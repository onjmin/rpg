// 端末の日付・時刻で起きる場面（隠しイベント「8月18日と　12月29日」）。
// 蓄音機を調べたとき、回復のあと・ひとやすみ会話の前に流す（story.ts の phonoRun が dayTalk を呼ぶ）。
// 約束は ひとやすみ会話 sp_feris（bonds/skits-b.ts）：キリコは 12月29日に「おめでとう」を鳴らす、
// フェリスは 8月18日に くしゃみ（フェニックス！）をする。
// - 1回の使用で流すのは1本だけ。同じ場面は年に1回（keep_day_<id>_<年>。keep_ なので次スレにも持ち越す）
// - 手がかり：J民B（maps/thread.ts の j_b が kirikoDay を見る）。あとで拾う：レイの修復（maps/server.ts の reiCare が dayLog を見る）
// - 端末の日時は weekday.ts の now()。開発中は &date=MMDD&time=HHMM で決め打ちできる
// - validate は決め打ちの日時で DAYS を全部走らせる（scripts/validate.mjs）。場面を足したら、その日時を validate の一覧に足す
//
// story.ts を import しない（phonoRun から呼ばれるので、たがいに import しあう形になる）。
// silent と ks は、ここに小さく書き直す。

import type { GameState, Story } from "../engine/defs";
import { type Now, now } from "./weekday";

/** 第四章の沈黙期間（story.ts の silent と同じ）。 */
const silent = (st: GameState): boolean =>
	!!st.flags.balus_lost && !st.flags.rec;

/** キリコのセリフ（沈黙中は「書きこみ」表示。story.ts の ks と同じ）。 */
const ks = (s: Story, text: string): Promise<void> =>
	silent(s.state)
		? s.say("kiriko", text, { noVoice: true, name: "キリコ（かきこみ）" })
		: s.say("kiriko", text);

/** 一行にいるか（控えも ふくむ）。 */
const inParty = (st: GameState, id: string): boolean =>
	st.party.some((m) => m.id === id);

/** 日付の場面。 */
export type DayDef = {
	id: string;
	/** いっしょに いる仲間（控えでもよい）。 */
	who: string;
	/** 見ておくべきフラグ（約束をした ひとやすみ会話）。 */
	need: string;
	/** その日時か。 */
	is: (t: Now) => boolean;
	run: (s: Story, t: Now) => Promise<void>;
	/** 沈黙中の版（無ければ 沈黙中は出さない）。 */
	silent?: (s: Story, t: Now) => Promise<void>;
	/** レイの修復の一言（その日に 場面を見ていれば）。 */
	reiLog?: string;
};

/**
 * キリコの誕生日まわり。スレが立った 8/17 22:51（序章）から 23:59 までは "eve"（J民Bの「実質今日やな」）、
 * 8/18 は終日 "day"。
 */
export const kirikoDay = (t: Now): "eve" | "day" | null => {
	if (t.m === 8 && t.d === 17 && t.h * 60 + t.mi >= 22 * 60 + 51) return "eve";
	if (t.m === 8 && t.d === 18) return "day";
	return null;
};

/**
 * その日の J民B（maps/thread.ts の j_b）の ひとこと。序章の「誕生日は　実質今日やな」を、その日に言う。
 * validate が日時を決め打ちして長さを見られるように、ここに置く。
 */
export const KIRIKO_DAY_J: Record<"eve" | "day", string> = {
	eve: "誕生日は　実質今日やな。\n8月18日や",
	day: "……実質やなくて、\nほんまに　今日やんけ",
};

/** フェリスの くしゃみ。 */
const phoenix = async (s: Story): Promise<void> => {
	await s.say("feris", "……フェニックス！");
	s.se("fire");
	await s.flash("#ffb040", 300);
};

export const DAYS: DayDef[] = [
	{
		// 8月18日：フェリスが くしゃみを する（「じゃあ　私は　8月18日に　くしゃみ　するね〜」）
		id: "kiriko",
		who: "feris",
		need: "skit_sp_feris",
		is: (t) => kirikoDay(t) !== null,
		run: async (s, t) => {
			const st = s.state;
			await s.narrate(
				"ハンドルを　まわそうと　すると、\nフェリスが　となりに　来た。",
			);
			await s.say("feris", "キリコちゃん、ちょっと　まってね〜");
			if (kirikoDay(t) === "eve") {
				await s.say("feris", "……ふぇ……");
				await s.say("feris", "……あれ〜？　まだ　17日だ〜");
				await s.say("kiriko", "スレは、もう　立ってるンゴ");
				await s.say("feris", "じゃあ、いっか〜");
			}
			await s.say("feris", "……ふぇ……ふぇ……");
			await phoenix(s);
			await s.narrate(
				"ほのおの　くしゃみが、\n蓄音機の　上で　ぱちぱち　はじけた。",
			);
			await s.say("kiriko", "……ろうそく、ンゴ？");
			await s.say("feris", "……まにあった〜");
			await s.narrate("キリコは　ハンドルを　まわして、\nその　音を　ためた。");
			// 仲間の口出しは、テトか おんJ民の どちらか1つと、ロゼだけ
			if (inParty(st, "teto")) {
				await s.narrate(
					"テトが　フランスパンを　半分に　わって、\nだまって　キリコに　よこした。",
				);
				await s.say("teto", "……ろうそくは　ない。\nパンで　がまんしな");
			} else if (inParty(st, "nanj") && !st.flags.akukin) {
				await s.say("nanj", "……名付け親としては、\n祝わな　あかんな（自称）");
			}
			if (inParty(st, "roze")) {
				await s.narrate("ロゼが　キリコの　頭に　手を　のせた。");
				// 夜ふかし（8/18 の 1:00〜4:59）
				if (kirikoDay(t) === "day" && t.h >= 1 && t.h < 5) {
					await s.say("roze", "……もう　寝るアル。常識アル");
					await s.say("kiriko", "……もう　ちょっとだけ");
				}
			}
		},
		// 沈黙中（町の蓄音機）。キリコは書きこみで返す
		silent: async (s) => {
			await s.narrate("フェリスが　鼻を　ひくひく　させた。");
			await s.say("feris", "……ふぇ……ふぇ……");
			await phoenix(s);
			await s.narrate("火花が、音の　ない　蓄音機を\nあかるく　てらした。");
			await ks(s, "……ありがとう");
			await s.say("feris", "……ちゃんと　読めたよ〜");
		},
		reiLog: "本日の　ログ：発火　1件。\n……おめでとう、ございます",
	},
	{
		// 12月29日：キリコが 蓄音機で「おめでとう」を鳴らす（「12月29日は、吾輩が　蓄音機で…」）
		id: "feris",
		who: "feris",
		need: "skit_sp_feris",
		is: (t) => t.m === 12 && t.d === 29,
		run: async (s) => {
			await s.narrate(
				"キリコは　もういちど、\nゆっくり　ハンドルを　まわした。",
			);
			// フェリスの絵スレを掘りおこしていれば（dig_ は次スレにも持ち越す。digs.ts の hane）
			if (s.flag("dig_hane")) {
				await s.narrate("「1羽目」「2羽目」「3羽目」……");
				await s.narrate("「年の瀬なのに　よう　描くわ」");
				await s.say("feris", "……あ〜");
			}
			await s.narrate("蓄音機から「おめでとう」が　鳴った。");
			await s.say("kiriko", "……12月29日ンゴ");
			await s.narrate("フェリスは　羽で　顔を　かくした。");
			await s.say("feris", "……くしゃみ、出そう〜");
			await s.say("kiriko", "いいよ");
			await phoenix(s);
			await s.narrate("蓄音機の　ラッパが、\nちょっと　こげた。");
			await s.narrate(
				"こげた　ラッパから、もういちど\n「おめでとう」が　鳴った。",
			);
			if (inParty(s.state, "roze")) {
				await s.say("roze", "……先輩、羽の　うらが\nまっかアル");
				await s.say("feris", "ほのおの　せいだよ〜");
			}
		},
		reiLog: "本日の　ログ：発火　1件。\nラッパの　焦げ　1件",
	},
];

/** その日の場面を見たか（年ごと。次スレにも持ち越す）。 */
const dayKey = (d: DayDef, t: Now): string => `keep_day_${d.id}_${t.y}`;

/**
 * 蓄音機で、今日の場面があれば1本だけ流す（回復のあと・ひとやすみ会話の前。story.ts の phonoRun）。
 * 今日で・仲間がいて・約束を見ていて・今年まだ見ていない場面。沈黙中は silent の版（無ければ出さない）。
 */
export const dayTalk = async (s: Story, t: Now = now()): Promise<void> => {
	const st = s.state;
	for (const d of DAYS) {
		if (!d.is(t) || !inParty(st, d.who) || !s.flag(d.need)) continue;
		if (s.flag(dayKey(d, t))) continue;
		const play = silent(st) ? d.silent : d.run;
		if (!play) continue;
		s.set(dayKey(d, t));
		await play(s, t);
		return;
	}
};

/** レイの修復の一言：今日の場面を見ていれば、その日の ログ（無ければ null）。 */
export const dayLog = (st: GameState, t: Now): string | null => {
	for (const d of DAYS)
		if (d.reiLog && d.is(t) && st.flags[dayKey(d, t)]) return d.reiLog;
	return null;
};
