// 自由度まわりの共通部品（scratchpad/freedom/spec.md）。
import type { GameState, Story } from "../engine/defs";

/** 「どう返す？」の返し方。 */
export type Reply = "uke" | "kaesu" | "neta" | "chikuon";

/** 記録する安価（>>1 本文 の形）。選んだ番号（0 から）を flag に入れて返す。 */
export const ankaChoose = async (
	s: Story,
	flag: string,
	labels: string[],
): Promise<number> => {
	const i = await s.choose(labels.map((t, k) => `>>${k + 1} ${t}`));
	s.set(flag, i);
	return i;
};

/**
 * 「どう返す？」の大安価。shita なら最後に「安価なら下」を足す。
 * 安価なら下を選ぶと、ランダムに1つ決まり、名無しのレスとして見せる。返し方を flag に入れて返す。
 */
export const replyAnka = async (
	s: Story,
	flag: string,
	opts: { reply: Reply; label: string }[],
	shita = true,
): Promise<Reply> => {
	const labels = opts.map((o, k) => `>>${k + 1} ${o.label}`);
	if (shita) labels.push("安価なら下");
	let i = await s.choose(labels);
	if (i >= opts.length) {
		i = Math.floor(Math.random() * opts.length);
		s.set("anka_shita", Number(s.flag("anka_shita") ?? 0) + 1);
		await s.say("nanj", `ほな、「${opts[i].label}」で`, { name: "名無し" });
	}
	s.set(flag, opts[i].reply);
	return opts[i].reply;
};

/** 負けた回数を数える（lose_n と、key があればそのボスの回数）。key の回数を返す。 */
export const addLose = (s: Story, key?: string): number => {
	s.set("lose_n", Number(s.flag("lose_n") ?? 0) + 1);
	if (!key) return 0;
	const n = Number(s.flag(key) ?? 0) + 1;
	s.set(key, n);
	return n;
};

export const BOSS_EXP = { b1: 58, b2: 95, b3: 122 } as const;

/**
 * 負けても進むボス戦。"win" 勝った／"pass" 3回負けて通してもらう／"rest" ひとやすみを選んだ。
 * onLose は 1・2回目の負けのあとに流す（負けレス＋仲間の一言）。
 * 逃げた（"escape"）ときは負けに数えず、ひとやすみと同じ扱い（"rest"）にする。
 */
export const bossFight = async (
	s: Story,
	key: "b1" | "b2" | "b3",
	group: string,
	onLose: (s: Story, n: number) => Promise<void>,
): Promise<"win" | "pass" | "rest"> => {
	for (;;) {
		const r = await s.battle(group, { canLose: true });
		if (r === "win") return "win";
		if (r === "escape") return "rest";
		const n = addLose(s, `lose_${key}`);
		if (n >= 3) return "pass";
		await onLose(s, n);
		if (
			(await s.choose(["もういちど！", "ひとやすみする"], { cancel: 1 })) === 1
		)
			return "rest";
	}
};

/** 名言チャレンジ（§4 F1 の表）。 */
export type Meigen = { label: string; line: string; quote: string };
export const MEIGEN: Meigen[][] = [
	[
		{
			label: "魚は　吾輩のもの",
			line: "「釣れた魚は、ぜんぶ　吾輩のもの」",
			quote: "魚は　ぜんぶ　吾輩のもの",
		},
		{
			label: "マーボーは　のみもの",
			line: "「マーボーは、のみものンゴ」",
			quote: "マーボーは　のみもの",
		},
		{
			label: "宿題は　あした　やる",
			line: "「宿題は、あした　やるンゴ」",
			quote: "宿題は　あした　やる",
		},
	],
	[
		{
			label: "囲碁の石は　消えない",
			line: "「囲碁の石は、打ったら　消えないンゴ」",
			quote: "囲碁の石は　消えない",
		},
		{
			label: "ホゲェは　あいさつ",
			line: "「ホゲェは、あいさつンゴ」",
			quote: "ホゲェは　あいさつ",
		},
		{
			label: "くしゃみは　名乗り",
			line: "「くしゃみは、名乗りンゴ」",
			quote: "くしゃみは　名乗り",
		},
	],
	[
		{
			label: "厚着は　脱がない",
			line: "「この厚着は　脱がないンゴ。夏でもンゴ」",
			quote: "厚着は　脱がない",
		},
		{
			label: "手のひらは　回すもの",
			line: "「手のひらは、回すものンゴ」",
			quote: "手のひらは　回すもの",
		},
		{
			label: "9回裏は　おやつの時間",
			line: "「9回裏は、おやつの　時間ンゴ」",
			quote: "9回裏は　おやつ",
		},
	],
];
/** 名言チャレンジ k（0〜2）で選んだものの引用（まだなら null）。 */
export const meigenQuote = (st: GameState, k: 0 | 1 | 2): string | null => {
	const v = st.flags[`meigen${k + 1}`];
	return typeof v === "number" ? (MEIGEN[k][v]?.quote ?? null) : null;
};

/** スタジアムのシンボル J民（F3-3）。 */
export const SYM_IDS = ["sym1", "sym2", "sym3"] as const;
export const symCount = (st: GameState, v: "fight" | "res"): number =>
	SYM_IDS.filter((id) => st.flags[`sym_${id}`] === v).length;
