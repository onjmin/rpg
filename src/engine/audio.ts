// 音：BGM（MML を @onjmin/dtm で再生）・効果音（RPGEN の mp3）・セリフの読み上げ（koe UtauTTS）。
//
// - AudioContext は1つだけ。スマホの自動再生制限のため、最初のタップ／キー入力で作る（unlock）。
// - BGM と効果音は画面右上のボタンでまとめてミュートできる（settings.mute）。
//   ミュート中も「今どの曲のはずか」は覚えておき、解除したらその曲から鳴らす。
// - dtm のシーケンサは 0.5 秒以上止まる（タブ切替・画面ロック・重い処理）と黙って再生をやめる。
//   onStop で「自分で止めたのではない」停止を見分け、最後の位置から鳴らし直す。
// - 読み上げは既定 OFF（初回に約35MBの TTS データを取得するため）。設定で ON にする。
//   初めての行は合成が追いつかず頭が欠けるので、合成を待ってから頭から鳴らす（awaitRender）。
// - dtm は重いので、最初の音が要るまで動的 import で遅らせる。

import type { DtmStudio, MmlPlayback, SpeechHandle } from "@onjmin/dtm";
import { soundUrl } from "./assets";
import type { VoiceDef } from "./defs";
import { onSettingsChange, settings } from "./settings";

type Dtm = typeof import("@onjmin/dtm");

let dtmPromise: Promise<Dtm> | null = null;
const loadDtm = (): Promise<Dtm> => {
	dtmPromise ??= import("@onjmin/dtm");
	return dtmPromise;
};

/** MML ヘッダの `#volume=` （曲ごとのミックス音量）。 */
const songVolume = (mml: string): number => {
	const m = /#volume=(\d+)/.exec(mml);
	return m ? Number(m[1]) : 50;
};

/** 効果音の音量（RPGEN の mp3 は音が大きいものが多いので半分に絞る）。 */
const seGainOf = (v: number): number => (v / 100) * 0.5;

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
	private seCache = new Map<string, Promise<AudioBuffer | null>>();
	private voiceReady: Promise<void> | null = null;
	private speaking: {
		abort: AbortController;
		handle: SpeechHandle | null;
	} | null = null;
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
					masterVolume: 100,
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
		// 曲ごとの #volume（作者のミックス）を基準に、設定の音量で全体を下げる。
		// 効果音・声より前に出ないよう、設定 100 でも元の半分にとどめる（既定 40 で元の 2 割）。
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
		if (!mml || !this.canPlayBgm()) return;
		const token = ++this.bgmToken;
		const pb = await this.startMml(mml, false, (fromBar - 1) * 192, token);
		if (!pb) return;
		if (token !== this.bgmToken) {
			this.dispose(pb);
			return;
		}
		this.bgmPlayback = pb;
		const start = performance.now();
		while (pb.isPlaying() && performance.now() - start < maxMs) {
			await new Promise((r) => setTimeout(r, 100));
		}
		if (this.bgmPlayback === pb) this.stopBgmPlayback();
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

	private async startMml(
		mml: string,
		loop: boolean,
		startStep: number | undefined,
		token: number,
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
				destination: ctx.destination,
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

	se(name: string): void {
		if (settings.mute || !this.ctx || !this.seGain) return;
		const ctx = this.ctx;
		const gain = this.seGain;
		const p = this.buffer(name);
		if (!p) return;
		const t0 = performance.now();
		void p.then((buf) => {
			// 読み込みに時間がかかりすぎたら鳴らさない（ずれた音は邪魔）
			if (!buf || performance.now() - t0 > 600) return;
			const src = ctx.createBufferSource();
			src.buffer = buf;
			src.connect(gain);
			src.start();
		});
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

	/**
	 * セリフを読み上げる。戻り値を呼ぶと止まる（準備中なら準備ごと中断）。
	 * 合成が終わる前に次のセリフへ進んだときは、遅れて届いた声を捨てる。
	 */
	speak(text: string, voice: VoiceDef): () => void {
		this.stopSpeech();
		const body = speechText(text);
		if (!settings.voice || !this.ctx || !body) return () => {};
		const entry = {
			abort: new AbortController(),
			handle: null as SpeechHandle | null,
		};
		this.speaking = entry;
		void (async () => {
			try {
				await this.prepareVoice();
				const studio = await this.studio();
				if (entry.abort.signal.aborted) return;
				const handle = await studio.speak(body, {
					model: voice.model,
					pitchOffset: voice.pitchOffset ?? 0,
					emotion: voice.emotion ?? "neutral",
					style: voice.style ?? "neutral",
					volume: (settings.voiceVolume / 100) * 0.85,
					awaitRender: true,
					signal: entry.abort.signal,
				});
				if (this.speaking !== entry || entry.abort.signal.aborted) {
					handle?.stop();
					return;
				}
				entry.handle = handle;
			} catch (e) {
				if (!entry.abort.signal.aborted)
					console.warn("[audio] 読み上げに失敗しました", e);
			}
		})();
		return () => {
			if (this.speaking === entry) this.stopSpeech();
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
