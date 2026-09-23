// 音：BGM（MML を @onjmin/dtm で再生）・効果音（RPGEN の mp3）・セリフの読み上げ（koe UtauTTS）。
//
// - AudioContext は1つだけ。スマホの自動再生制限のため、最初のタップ／キー入力で作る（unlock）。
// - BGM と効果音は画面右上のボタンでまとめてミュートできる（settings.mute）。
//   ミュート中も「今どの曲のはずか」は覚えておき、解除したらその曲から鳴らす。
// - dtm のシーケンサは 0.5 秒以上止まる（タブ切替・画面ロック・重い処理）と黙って再生をやめる。
//   onStop で「自分で止めたのではない」停止を見分け、最後の位置から鳴らし直す。
// - 読み上げは既定 OFF（初回に約35MBの TTS データを取得するため）。設定で ON にする。
//   頭が欠けないよう、合成の最初のかたまりが出来てから頭から鳴らす（awaitRender: "first-chunk"）。
//   鳴り始める時刻を返すので、メッセージ窓は文字送りをそこまで待たせる（ui/message.ts）。
//   ただし入っている dtm が "first-chunk" に対応していると分かるまでは返さない（全部の合成を
//   待つ古い dtm では揃わず、窓が遅れるだけなので。speak を参照）。
// - dtm は重いので、最初の音が要るまで動的 import で遅らせる。
// - 大きさは測ったラウドネスでそろえる（data/loudness.ts）。既定の音量設定のとき、
//   BGM は曲ごとの #volume で、効果音は1音ずつの倍率で、声は声ごとの倍率で目標の大きさになる。
// - 効果音が鳴り始めたら、その音の本体が鳴り終わる時刻（waitMs。data/loudness.ts）まで「区切り待ち」にする。
//   文送り・選択肢の決定・戦闘の早送りはそれまで効かない（seSettled / seHeld）。
//   連打で次の効果音が畳みかけて重ならないように。余韻までは待たせない。
// - ジングル（勝利の曲）は途中で絞って止められる（fadeOutJingle。レベルアップの音と重ねない）。
//   dtm の stop は先読みで予約済みの音符（約0.5秒ぶん）を鳴らし残すので、出口の音量ごと絞る。

import type { DtmStudio, MmlPlayback, SpeechHandle } from "@onjmin/dtm";
import {
	REF_VOLUME,
	SE_LOUDNESS,
	SE_UNMEASURED_GAIN,
	SE_WAIT,
	voiceGain,
} from "../data/loudness";
import { soundUrl } from "./assets";
import type { VoiceDef } from "./defs";
import { onSettingsChange, settings } from "./settings";

type Dtm = typeof import("@onjmin/dtm");

let dtmPromise: Promise<Dtm> | null = null;
const loadDtm = (): Promise<Dtm> => {
	dtmPromise ??= import("@onjmin/dtm");
	return dtmPromise;
};

/** MML ヘッダの `#volume=` （曲ごとの音量。ラウドネスをそろえてある。data/bgm.ts）。 */
const songVolume = (mml: string): number => {
	const m = /#volume=(\d+)/.exec(mml);
	return m ? Number(m[1]) : 50;
};

/**
 * 効果音の全体の音量。既定（60）で 1 倍＝素材ごとの倍率（seLevel）だけで目標の大きさになる。
 * 最大（100）で +4.4 dB（直す前と同じ幅）。
 */
const seGainOf = (v: number): number => v / REF_VOLUME.se;
/** 効果音ごとの倍率（data/loudness.ts）。測っていない音は直す前と同じ大きさ。 */
const seLevel = (name: string): number =>
	SE_LOUDNESS[name]?.[4] ?? SE_UNMEASURED_GAIN;
/** これより長い効果音（ジングル）は、同じ音が鳴っている間は重ねない。 */
const LONG_SE_SEC = 1;
/** 読み込みにこれより長くかかった効果音は鳴らさない（ずれた音は邪魔）。 */
const SE_LATE_MS = 600;
/** 区切り待ちのいちばん長い時間（1回の待ちはこれを超えない）。 */
const SE_HOLD_MAX_MS = SE_WAIT.jingleMaxMs;
/** 効果音を鳴らしてから次へ進めるまでの ms（測っていない音は待たない）。 */
const seWaitMs = (name: string): number => SE_LOUDNESS[name]?.[7] ?? 0;

/** dtm studio の出口の音量（createDtmStudio の masterVolume）。 */
const STUDIO_MASTER_VOLUME = 100;
/**
 * ジングルを絞って止めたあと、studio の出口を戻すまでの秒数。止めても予約済みの音符
 * （先読み0.5秒＋長い音符・残響）は鳴り続けるので、それが消えるまで絞ったままにする。
 */
const DUCK_TAIL_SEC = 2;

/** AudioParam を今の値から sec 秒かけて v へ（先の予約は捨てる）。 */
const rampTo = (p: AudioParam, now: number, v: number, sec: number): void => {
	p.cancelScheduledValues(now);
	p.setValueAtTime(p.value, now);
	p.linearRampToValueAtTime(v, now + sec);
};

/** 前奏（`@0` が全休符で始まる4小節）がある曲は、2周目から前奏を飛ばす。 */
const hasIntro = (mml: string): boolean =>
	/@0\s*t\d+\s*v\d+\s*o\d\s*r1r1r1r1/.test(mml);

/** 固有名詞の読み（OpenJTalk が誤読するもの）。長いものから置き換える。 */
const READINGS: ReadonlyArray<readonly [string, string]> = [
	["蓄音キリコ", "ちくねキリコ"],
	["束音ロゼ", "たばねロゼ"],
	["重音テト", "かさねテト"],
	["蓄音", "ちくね"],
	["束音", "たばね"],
	["重音", "かさね"],
	["吾輩", "わがはい"],
	["おーぷん2ちゃんねる", "おーぷんにちゃんねる"],
	["おんJ", "おんジェイ"],
	["なんJ", "なんジェイ"],
	["LV", "レベル"],
	["Lv", "レベル"],
];

/**
 * セリフ本文 → 読み上げ用の文。読めるものが残らなければ null（声なしで文字だけ出す）。
 * dtm の調査（planSpeech のモーラ列の実測）に基づく。
 */
export const speechText = (raw: string): string | null => {
	let s = raw.normalize("NFKC");
	for (const [from, to] of READINGS) s = s.replaceAll(from, to);
	s = s
		.replace(/[（(][^）)]*[）)]/g, "") // ト書き（…）は読まない
		.replace(/\p{Extended_Pictographic}|\u{FE0F}|\u{200D}/gu, "")
		.replace(/(^|[^A-Za-z])[wW]+(?=$|[^A-Za-z])/g, "$1、") // 草w / www（笑い）→ 間
		.replace(/草{2,}/g, "")
		.replace(/[♪♫☆★♡♥※→←↑↓]/g, "")
		.replace(/[「」『』【】［］<>＜＞]/g, "、")
		.replace(/[…‥]+|・{2,}|\.{2,}/g, "、")
		.replace(/[~〜]+/g, "ー")
		.replace(/\s+/g, "")
		.replace(/、{2,}/g, "、")
		.replace(/^[、\s]+|[、\s]+$/g, "")
		.trim();
	if (
		!/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z0-9]/u.test(s)
	)
		return null;
	return s;
};

/** 読み上げの鳴り始め（{@link GameAudio.speak} の started）。 */
export type SpeechStart = {
	/** 最初のモーラが鳴る AudioContext の時刻（秒）。 */
	startTime: number;
	/** その音が聞こえる時刻（performance.now の時計、ms。出力の遅れを含む）。 */
	at: number;
	/** 声の長さ（秒。合成待ちでずれた間は含まない）。 */
	durationSec: number;
	/**
	 * 声が鳴り終わって聞こえる見込みの時刻（performance.now の時計、ms）。合成が遅れて
	 * 後ろがずれる（dtm の shiftSec）と延びるので、読むたびに今の値を返す。
	 */
	endAt: () => number;
};

/** {@link GameAudio.speak} の戻り値。 */
export type Speaking = {
	/** 止める（準備中なら準備ごと中断）。 */
	stop: () => void;
	/**
	 * 鳴り始める時刻が決まったら解決する。鳴らない（OFF・読めない本文・失敗・
	 * 鳴る前に止めた）ときは null。文字送りを声まで待たせてよいときだけある
	 * （入っている dtm が "first-chunk" に対応していると分かったあと）。
	 */
	started?: Promise<SpeechStart | null>;
};

export class GameAudio {
	private ctx: AudioContext | null = null;
	private seGain: GainNode | null = null;
	private studioPromise: Promise<DtmStudio> | null = null;
	private bgmData: Record<string, string>;
	private sfxData: Record<string, string>;
	/** 鳴っている（はずの）曲名。 */
	private bgmName: string | null = null;
	private bgmPlayback: MmlPlayback | null = null;
	/** 再生を始めるたびに増える。古い再生の onStop などを見分ける。 */
	private bgmToken = 0;
	/** 最後に鳴らした位置（1小節=192ステップ）。止まったときの再開用。 */
	private bgmLastStep = 0;
	/** 今の曲を歌声つきで流すか（singBgm）。 */
	private sing = false;
	/** 鳴っているジングル。軽量の音は自前の出口（bus）を通して絞れるようにする。 */
	private jingleNow: { pb: MmlPlayback; bus: GainNode | null } | null = null;
	/** 読み込み中・再生中のジングルの bgmToken（鳴り始める前に止める用）。 */
	private jingleToken = -1;
	/** studio の出口を絞っている間、戻してよくなる時刻（AudioContext の時計）。 */
	private duckUntil: number | null = null;
	private seCache = new Map<string, Promise<AudioBuffer | null>>();
	/** 長い効果音が鳴り終わる時刻（AudioContext の時計。重ね鳴らし防止）。 */
	private seEnds = new Map<string, number>();
	/** 区切り待ちが終わる時刻（performance.now の時計）。 */
	private holdUntil = 0;
	/**
	 * 読み込み中の効果音と、鳴るか捨てるか決まる時刻（初めての音はまだ鳴っていないが、
	 * すぐ鳴って待ちが始まるので、その間も進めない）。
	 */
	private sePending = new Set<{ until: number }>();
	private voiceReady: Promise<void> | null = null;
	private speaking: {
		abort: AbortController;
		handle: SpeechHandle | null;
	} | null = null;
	/**
	 * 入っている dtm が awaitRender: "first-chunk" に対応しているか（null はまだ分からない）。
	 * 対応版の SpeechHandle にだけある position() で、最初に鳴らした声から見分ける。
	 * 対応していないあいだ（と分かるまで）は、文字送りを声まで待たせない（{@link speak}）。
	 */
	private firstChunkSpeech: boolean | null = null;
	/** 読み上げの準備の進み具合（設定画面の表示用）。 */
	voiceProgress: { loaded: number; total: number } | null = null;
	onVoiceProgress: (() => void) | null = null;

	constructor(bgm: Record<string, string>, sfx: Record<string, string>) {
		this.bgmData = bgm;
		this.sfxData = sfx;
		let prev = {
			bgm: settings.bgm,
			mute: settings.mute,
			bgmVolume: settings.bgmVolume,
			voice: settings.voice,
		};
		onSettingsChange(() => {
			const cur = {
				bgm: settings.bgm,
				mute: settings.mute,
				bgmVolume: settings.bgmVolume,
				voice: settings.voice,
			};
			if (cur.bgm !== prev.bgm || cur.mute !== prev.mute) {
				this.restartBgm(0);
			} else if (
				cur.bgmVolume !== prev.bgmVolume &&
				this.bgmPlayback &&
				this.bgmName
			) {
				this.bgmPlayback.setVolume(
					this.volumeFor(this.bgmData[this.bgmName] ?? ""),
				);
			}
			if (cur.voice && !prev.voice) void this.prepareVoice();
			if (!cur.voice) this.stopSpeech();
			if (this.seGain) this.seGain.gain.value = seGainOf(settings.seVolume);
			// 音を消したら、鳴っていた音の区切りも待たない
			if (!this.seAudible()) {
				this.holdUntil = 0;
				this.sePending.clear();
			}
			prev = cur;
		});
		document.addEventListener("visibilitychange", () => this.onVisibility());
	}

	/** 最初のユーザー操作（のコールスタック内）で呼ぶ。以後は何度呼んでもよい。 */
	unlock(): void {
		if (!this.ctx) {
			// iOS: 既定のままだとマナーモードで Web Audio が無音になる。ctx を作る前に設定する。
			// （音を消したい人は右上のミュートボタンで消せる）
			const nav = navigator as Navigator & { audioSession?: { type: string } };
			try {
				if (nav.audioSession) nav.audioSession.type = "playback";
			} catch {
				// 対応していないブラウザ
			}
			const AC =
				window.AudioContext ??
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext;
			this.ctx = new AC({ latencyHint: "interactive" });
			this.seGain = this.ctx.createGain();
			this.seGain.gain.value = seGainOf(settings.seVolume);
			this.seGain.connect(this.ctx.destination);
			// 鳴らすはずだった曲があれば始める
			if (this.bgmName) this.restartBgm(0);
			if (settings.voice) void this.prepareVoice();
		}
		const ctx = this.ctx;
		if (ctx.state === "suspended") void ctx.resume();
		// 古い iOS 向け：無音を1サンプル鳴らして出力を開く
		const src = ctx.createBufferSource();
		src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
		src.connect(ctx.destination);
		src.start();
	}

	get unlocked(): boolean {
		return this.ctx !== null;
	}

	/** 鳴っている（はずの）曲名。戦闘の後に元の曲へ戻す用。 */
	get currentBgm(): string | null {
		return this.bgmName;
	}

	private studio(): Promise<DtmStudio> {
		const ctx = this.ctx;
		if (!ctx) return Promise.reject(new Error("audio locked"));
		if (!this.studioPromise) {
			// voiceWorkerUrl は省略：Vite が dist/voice-worker.js を assets/ へ出力して URL を書き換える
			this.studioPromise = loadDtm().then((dtm) =>
				dtm.createDtmStudio({
					audioContext: ctx,
					masterVolume: STUDIO_MASTER_VOLUME,
					features: { midi: false, chord: false, presetUI: false, help: false },
				}),
			);
			this.studioPromise.catch(() => {
				this.studioPromise = null; // 次に要るときにやり直す
			});
		}
		return this.studioPromise;
	}

	private onVisibility(): void {
		const ctx = this.ctx;
		if (!ctx) return;
		if (document.visibilityState === "hidden") {
			void ctx.suspend();
			return;
		}
		void ctx.resume();
		// 隠れている間に停滞検知で止まっていたら、続きから鳴らす
		if (this.bgmName && this.canPlayBgm() && !this.bgmPlayback?.isPlaying()) {
			this.restartBgm(this.bgmLastStep);
		}
	}

	// ───────────────── BGM ─────────────────

	private volumeFor(mml: string): number {
		// 曲ごとの #volume に設定の音量を掛ける（既定 40 で #volume の 2 割、100 で半分）。
		// #volume は既定の 40 で -23 LUFS（sad・ending は -24）になるよう、測って直してある。
		return Math.min(100, songVolume(mml) * (settings.bgmVolume / 100) * 0.5);
	}

	/** 曲を切り替える。同じ曲なら続けて鳴らす。null で止める。 */
	bgm(name: string | null): void {
		if (
			name === this.bgmName &&
			(this.bgmPlayback?.isPlaying() || !this.canPlayBgm())
		)
			return;
		this.bgmName = name;
		this.sing = false;
		this.restartBgm(0);
	}

	/**
	 * 歌入りの曲（@@n 歌詞トラック）を歌声つきで流す（エンディング用）。
	 * ボイスが OFF・高音質でない・合成に失敗したときは、ふつうにインストで流す。
	 */
	singBgm(name: string): void {
		this.bgmName = name;
		this.sing = settings.voice && settings.bgm === "hq";
		this.restartBgm(0);
	}

	/** 短い曲（ジングル）を1回だけ鳴らす。終わったら解決。BGM は止める。 */
	async jingle(name: string, fromBar = 1, maxMs = 8000): Promise<void> {
		this.stopBgmPlayback();
		this.bgmName = null;
		const mml = this.bgmData[name];
		const ctx = this.ctx;
		if (!mml || !ctx || !this.canPlayBgm()) return;
		const token = ++this.bgmToken;
		this.jingleToken = token;
		// 軽量の音は自前の出口を通す（途中で絞れるように。高音質は studio の出口を絞る）
		const bus = settings.bgm === "hq" ? null : ctx.createGain();
		bus?.connect(ctx.destination);
		const pb = await this.startMml(
			mml,
			false,
			(fromBar - 1) * 192,
			token,
			bus ?? undefined,
		);
		if (!pb || token !== this.bgmToken) {
			if (pb) this.dispose(pb);
			bus?.disconnect();
			if (this.jingleToken === token) this.jingleToken = -1;
			return;
		}
		this.bgmPlayback = pb;
		const entry = { pb, bus };
		this.jingleNow = entry;
		// 勝利のジングルも効果音と同じく区切り待ちにする（続けてレベルアップの音が重ならないように）。
		// 曲の長さは測っていないので、ジングルの上限（1.5 秒）だけ待つ
		this.hold(SE_HOLD_MAX_MS);
		const start = performance.now();
		while (pb.isPlaying() && performance.now() - start < maxMs) {
			await new Promise((r) => setTimeout(r, 100));
		}
		if (this.jingleNow === entry) {
			this.jingleNow = null;
			// 余韻を切らないよう、少し置いてから出口を外す
			if (bus) setTimeout(() => bus.disconnect(), DUCK_TAIL_SEC * 1000);
		}
		if (this.jingleToken === token) this.jingleToken = -1;
		if (this.bgmPlayback === pb) this.stopBgmPlayback();
	}

	/**
	 * 鳴っているジングルを ms かけて絞って止める（勝利の曲にレベルアップの音を重ねない）。
	 * 読み込み中でまだ鳴っていなければ、鳴らさずに捨てる。ジングルでなければ何もしない。
	 */
	async fadeOutJingle(ms = 150): Promise<void> {
		const j = this.jingleNow;
		const ctx = this.ctx;
		if (!j || j.pb !== this.bgmPlayback || !ctx) {
			if (this.jingleToken === this.bgmToken) this.stopBgmPlayback();
			return;
		}
		this.jingleNow = null;
		const sec = ms / 1000;
		if (j.bus) {
			rampTo(j.bus.gain, ctx.currentTime, 0, sec);
		} else {
			// 高音質は studio の出口（声と共用）を絞る。次に studio で鳴らすときに戻す（unduck）
			const studio = await this.studioPromise?.catch(() => null);
			if (studio) {
				rampTo(studio.masterGain.gain, ctx.currentTime, 0, sec);
				this.duckUntil = ctx.currentTime + sec + DUCK_TAIL_SEC;
			}
		}
		await new Promise((r) => setTimeout(r, ms));
		// ほかの曲に替わっていたら、替えた側がもう止めている
		if (this.bgmPlayback === j.pb) this.stopBgmPlayback();
		const bus = j.bus;
		if (bus) setTimeout(() => bus.disconnect(), DUCK_TAIL_SEC * 1000);
	}

	/**
	 * fadeOutJingle で絞った studio の出口を戻す。曲は絞った音の残りが消えてから、
	 * 声（now）は頭が欠けないようすぐに。
	 */
	private unduck(studio: DtmStudio, now = false): void {
		const ctx = this.ctx;
		if (this.duckUntil === null || !ctx) return;
		const at = now
			? ctx.currentTime
			: Math.max(ctx.currentTime, this.duckUntil);
		this.duckUntil = null;
		const g = studio.masterGain.gain;
		g.cancelScheduledValues(at);
		g.setValueAtTime(0, at);
		g.linearRampToValueAtTime(STUDIO_MASTER_VOLUME / 100, at + 0.05);
	}

	private canPlayBgm(): boolean {
		return !!this.ctx && !settings.mute && settings.bgm !== "off";
	}

	private dispose(pb: MmlPlayback): void {
		try {
			pb.stop();
			pb.destroy(); // 渡した ctx は閉じない
		} catch {
			// 止め損ねても続行
		}
	}

	private stopBgmPlayback(): void {
		this.bgmToken++;
		const pb = this.bgmPlayback;
		this.bgmPlayback = null;
		if (pb) this.dispose(pb);
	}

	private restartBgm(fromStep: number): void {
		this.stopBgmPlayback();
		const token = this.bgmToken;
		const name = this.bgmName;
		this.bgmLastStep = fromStep;
		if (!name || !this.canPlayBgm()) return;
		const mml = this.bgmData[name];
		if (!mml) {
			console.warn(`[audio] BGM ${name} がありません`);
			return;
		}
		void this.startMml(mml, true, fromStep || undefined, token).then((pb) => {
			if (!pb) return;
			if (token !== this.bgmToken) {
				this.dispose(pb);
				return;
			}
			this.bgmPlayback = pb;
		});
	}

	/** destination は軽量の音の出口（省略で ctx.destination）。 */
	private async startMml(
		mml: string,
		loop: boolean,
		startStep: number | undefined,
		token: number,
		destination?: AudioNode,
	): Promise<MmlPlayback | null> {
		const ctx = this.ctx;
		if (!ctx) return null;
		const loopOpt = loop
			? hasIntro(mml)
				? { start: { bar: 5 } }
				: true
			: false;
		const volume = this.volumeFor(mml);
		const onTick = (step: number) => {
			if (token === this.bgmToken) this.bgmLastStep = step;
		};
		// 自分で止めていないのに止まった = 停滞検知。見えていれば続きから鳴らし直す
		const onStop = () => {
			if (!loop || token !== this.bgmToken || !this.bgmName) return;
			if (document.visibilityState === "visible")
				this.restartBgm(this.bgmLastStep);
		};
		const common = {
			loop: loopOpt,
			startStep,
			onTick,
			onStop,
			pauseWhenHidden: false,
		};
		try {
			if (settings.bgm === "hq") {
				const studio = await this.studio();
				this.unduck(studio);
				if (this.sing) {
					try {
						const pb = await studio.playSingingMML(mml, common);
						pb.setVolume(volume);
						return pb;
					} catch (e) {
						console.warn(
							"[audio] 歌声つきで流せなかったのでインストにします",
							e,
						);
					}
				}
				const pb = studio.play(mml, common);
				pb.setVolume(volume);
				return pb;
			}
			const dtm = await loadDtm();
			const pb = dtm.playMML(mml, {
				...common,
				audioContext: ctx,
				destination: destination ?? ctx.destination,
			});
			pb.setVolume(volume);
			return pb;
		} catch (e) {
			console.warn("[audio] BGM を鳴らせませんでした", e);
			return null;
		}
	}

	// ───────────────── 効果音 ─────────────────

	private buffer(name: string): Promise<AudioBuffer | null> | null {
		const ctx = this.ctx;
		const ref = this.sfxData[name];
		if (!ctx || !ref) return null;
		let p = this.seCache.get(name);
		if (!p) {
			const url = ref.startsWith("rpgen:") ? soundUrl(ref.slice(6)) : ref;
			p = fetch(url)
				.then((r) =>
					r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${r.status}`)),
				)
				.then((b) => ctx.decodeAudioData(b))
				.catch((e) => {
					console.warn(`[audio] 効果音 ${name} を読めませんでした`, e);
					return null;
				});
			this.seCache.set(name, p);
		}
		return p;
	}

	/** 効果音をあらかじめ読み込む（最初の1回の遅れを無くす）。 */
	preloadSe(names: string[]): void {
		for (const n of names) void this.buffer(n);
	}

	/** 効果音が聞こえる設定か（ミュート・音量 0 のときは鳴らさず、区切りも待たない）。 */
	private seAudible(): boolean {
		return !settings.mute && settings.seVolume > 0;
	}

	se(name: string): void {
		if (!this.seAudible() || !this.ctx || !this.seGain) return;
		const ctx = this.ctx;
		const gain = this.seGain;
		const p = this.buffer(name);
		if (!p) return;
		const t0 = performance.now();
		const pending = { until: t0 + SE_LATE_MS };
		this.sePending.add(pending);
		void p.then((buf) => {
			this.sePending.delete(pending);
			// 読み込みに時間がかかりすぎたら鳴らさない（ずれた音は邪魔）
			if (!buf || performance.now() - t0 > SE_LATE_MS) return;
			if (!this.seAudible()) return; // 読み込み中に消された
			// ジングルのような長い音は、同じ音が鳴り終わるまで重ねない（カーソル音などの短い音は重ねてよい）
			if (buf.duration > LONG_SE_SEC) {
				if ((this.seEnds.get(name) ?? 0) > ctx.currentTime) return;
				this.seEnds.set(name, ctx.currentTime + buf.duration);
			}
			const src = ctx.createBufferSource();
			src.buffer = buf;
			// 素材ごとの大きさの補正 → 全体の音量
			const level = ctx.createGain();
			level.gain.value = seLevel(name);
			src.connect(level).connect(gain);
			src.onended = () => level.disconnect();
			src.start();
			// 実際に鳴り始めた音だけ、本体が鳴り終わるまで次へ進めない
			this.hold(seWaitMs(name));
		});
	}

	/** 今から ms の間を区切り待ちにする（前の待ちが長ければそちら）。 */
	private hold(ms: number): void {
		if (ms <= 0) return;
		this.holdUntil = Math.max(
			this.holdUntil,
			performance.now() + Math.min(ms, SE_HOLD_MAX_MS),
		);
	}

	/** 効果音の区切り待ちの最中か（鳴らしたばかりの音の本体がまだ鳴っている・読み込み中）。 */
	get seHeld(): boolean {
		const now = performance.now();
		if (now < this.holdUntil) return true;
		for (const p of this.sePending) {
			if (p.until > now) return true;
			this.sePending.delete(p); // 読み込みが止まったままの音は待たない
		}
		return false;
	}

	/**
	 * 効果音の区切りまで待つ。待ちの間に次の音が鳴れば延びるが、呼んでから
	 * SE_HOLD_MAX_MS を超えては待たない（時計で決めるので、タブが隠れていても抜ける）。
	 */
	async seSettled(): Promise<void> {
		const limit = performance.now() + SE_HOLD_MAX_MS;
		// 読み込み済みの音は次のマイクロタスクで鳴り始めて待ちが決まるので、先にそれを済ませる
		await Promise.resolve();
		while (this.seHeld) {
			const rest = limit - performance.now();
			if (rest <= 0) return;
			await new Promise((r) => setTimeout(r, Math.min(rest, 30)));
		}
	}

	/** 効果音の鳴り始めと鳴り終わり（ms。頭の無音を含むファイルの中の位置）。測っていなければ null。 */
	seSpan(name: string): { startMs: number; endMs: number } | null {
		const m = SE_LOUDNESS[name];
		return m ? { startMs: m[5], endMs: m[6] } : null;
	}

	// ───────────────── 読み上げ ─────────────────

	/** 読み上げの準備（TTS データ。2回目以降はブラウザのキャッシュ）。 */
	prepareVoice(): Promise<void> {
		if (!this.ctx) return Promise.resolve();
		this.voiceReady ??= (async () => {
			try {
				const studio = await this.studio();
				await studio.prepareSpeech(["uc", "roze", "teto", "rei"], {
					onProgress: (loaded: number, total: number) => {
						this.voiceProgress = { loaded: Math.min(loaded, total), total };
						this.onVoiceProgress?.();
					},
				});
				this.voiceProgress = null;
			} catch (e) {
				console.warn("[audio] 読み上げの準備に失敗しました", e);
				this.voiceReady = null;
			}
		})();
		return this.voiceReady;
	}

	/** AudioContext の時刻 t（秒）に鳴らした音が聞こえる時刻（performance.now の時計、ms）。 */
	private audibleAt(t: number): number {
		const ctx = this.ctx;
		if (!ctx) return performance.now();
		// outputLatency は Safari に無い（Bluetooth のイヤホンなどで大きくなる）
		const latency = Number.isFinite(ctx.outputLatency) ? ctx.outputLatency : 0;
		return performance.now() + (t - ctx.currentTime + latency) * 1000;
	}

	/**
	 * セリフを読み上げる。stop を呼ぶと止まる（準備中なら準備ごと中断）。
	 * 合成が終わる前に次のセリフへ進んだときは、遅れて届いた声を捨てる。
	 * started で鳴り始める時刻が分かる（文字送りを声の頭に合わせる用）。
	 *
	 * started は、入っている dtm が "first-chunk" に対応していると分かったときだけ返す。
	 * 対応していない dtm（2.1.23 まで）は "first-chunk" を true と同じ＝全部の合成を待ってから
	 * 鳴らすので、文字送りを声まで待たせても長いセリフほど窓が遅れるだけで揃わない。
	 * そのあいだは従来どおり文字送りをすぐ始める（声は合成が済んでから頭から鳴る）。
	 */
	speak(text: string, voice: VoiceDef): Speaking {
		this.stopSpeech();
		const body = speechText(text);
		if (!settings.voice || !this.ctx || !body) return { stop: () => {} };
		const waitable = this.firstChunkSpeech === true;
		const entry = {
			abort: new AbortController(),
			handle: null as SpeechHandle | null,
		};
		this.speaking = entry;
		const started = (async (): Promise<SpeechStart | null> => {
			try {
				await this.prepareVoice();
				const studio = await this.studio();
				if (entry.abort.signal.aborted) return null;
				this.unduck(studio, true);
				const handle = await studio.speak(body, {
					model: voice.model,
					pitchOffset: voice.pitchOffset ?? 0,
					emotion: voice.emotion ?? "neutral",
					style: voice.style ?? "neutral",
					// 既定（80）で声ごとの倍率＝目標の大きさ（data/loudness.ts）
					volume:
						voiceGain(voice.model) * (settings.voiceVolume / REF_VOLUME.voice),
					// "first-chunk": 最初のかたまりが出来たら頭から鳴らし、合成が遅れたら後ろをずらす
					// （新しい dtm）。いま入っている 2.1.23 は型が boolean だけだが、文字列は true と
					// 同じ（全部の合成を待ってから鳴らす）に扱うので今も安全。新しい dtm で待ちが短くなる。
					// TODO: "first-chunk" 対応の dtm を出したら package.json と lockfile を上げて cast を外し、
					// firstChunkSpeech の見分けと下の cast も外す。途中で間が空きやすい roze には
					// minBufferSec（0.3〜0.5 秒）を渡すことも考える。
					awaitRender: "first-chunk" as unknown as boolean,
					signal: entry.abort.signal,
				});
				if (handle)
					this.firstChunkSpeech =
						typeof (handle as { position?: unknown }).position === "function";
				if (this.speaking !== entry || entry.abort.signal.aborted) {
					handle?.stop();
					return null;
				}
				if (!handle) return null;
				entry.handle = handle;
				const shiftSec = () => (handle as { shiftSec?: number }).shiftSec ?? 0;
				return {
					startTime: handle.startTime,
					at: this.audibleAt(handle.startTime),
					durationSec: handle.durationSec,
					endAt: () =>
						this.audibleAt(handle.startTime + shiftSec() + handle.durationSec),
				};
			} catch (e) {
				if (!entry.abort.signal.aborted)
					console.warn("[audio] 読み上げに失敗しました", e);
				return null;
			}
		})();
		return {
			stop: () => {
				if (this.speaking === entry) this.stopSpeech();
			},
			started: waitable ? started : undefined,
		};
	}

	stopSpeech(): void {
		const s = this.speaking;
		this.speaking = null;
		if (!s) return;
		s.abort.abort();
		s.handle?.stop();
	}
}
