// 「はなす」：誕生スレ【安価】安価でボカロ作ろうぜ（remarks.ts）。
// 完走の前は 宣伝の あいまに 立ちよる所。完走の あとは みんなが 輪に なって 集まっていて、
// 下の扉は 管理人室へ（町へは もどれない）。
// 場所（完走のあと）：やきう (4,7)・レイ (8,7)・モニター (2,3)(10,3)・下の扉 (6,10)。

import type { RemarkDef } from "../../engine/defs";
import { during, has, inParty, near, scene } from "./lib";

const THREAD = { map: "thread" };
/** 完走のあとの やきう（話すと 控えに もどる）の そば。 */
const NANJ = near("thread", 3, 6, 5, 8);
/** 完走のあとの レイの そば。 */
const REI = near("thread", 7, 6, 9, 8);
/** 下の扉の前。 */
const DOOR = near("thread", 5, 8, 7, 9);
/** モニターの前（左右）。 */
const MON_L = near("thread", 1, 3, 3, 4);
const MON_R = near("thread", 9, 3, 11, 4);

export const thread: RemarkDef[] = [
	// ───────── 完走のあと ─────────
	...scene(
		{
			...NANJ,
			when: (st) =>
				!!st.flags.clear && !st.flags.nanj_back && !inParty(st, "nanj"),
		},
		{
			roze: "……やきう、ずっと　こっちを\n見てるアル",
			feris: "やきうくん、いるよ〜。\nほら、あそこ〜",
			teto: "……あの　名無し、\n話しかけて　ほしそうだな",
		},
	),
	...scene(
		{ ...REI, when: has("clear") },
		{
			roze: "レイ、ここまで　来てくれたアル",
			feris: "レイちゃん、輪っかの\nなかに　いるね〜",
			teto: (st) =>
				st.flags.rei_wait
					? "……「おかえりなさい」係、\nちゃんと　仕事してるな"
					: "……ロボットも、\n完走は　祝うんだな",
		},
	),
	...scene(
		{
			...MON_L,
			when: (st) => !!st.flags.satoru_win && !st.flags.res_over,
		},
		{ roze: "モニターに、なにか\n映ってるアル" },
	),
	...scene(
		{
			...MON_R,
			when: (st) => !!st.flags.satoru_win && !st.flags.res_over,
		},
		{ roze: "モニターに、なにか\n映ってるアル" },
	),
	...scene(
		{ ...THREAD, when: has("res_over") },
		{
			teto: "……1005か。\nはみ出しすぎだ",
			nanj: "1000の　先まで　書くとは、\nさすが　スレ主や",
		},
	),
	...scene(
		{ ...DOOR, when: (st) => !!st.flags.ending_seen && !st.flags.satoru_met },
		{
			roze: "扉の　札が、かわってるアル",
			teto: "……扉の　むこう、\nキーボードの　音が　する",
		},
	),
	...scene(
		{ ...THREAD, when: has("clear") },
		{
			nanj: "勢い欄の　前で　立っとったら、\n足の　うら、かたなったわ",
			roze: "完走した　スレに、\nみんな　集まってるアル",
			feris: "輪っかに　なって、\nお祭りみたいだね〜",
			teto: "……まだ　帰らないのか。\nまあ、ボクも　帰らないけど",
		},
	),

	// ───────── 完走の前 ─────────
	...scene(
		{ ...THREAD, when: during("ikioi") },
		{
			nanj: "スレの　中は、まだ　ワイらだけや。\n……外は、もっと　うるさいで",
		},
	),
	...scene(
		{ ...THREAD, when: during("server", "gate") },
		{
			roze: "レスが　0に　なっても、\nスレの　壁は　のこってるアル",
			feris: "J民さんたち、ちゃんと\n待っててくれたね〜",
			teto: "……ここで　君は　生まれたのか。\n安価で、ね",
		},
	),
	...scene(
		{ ...THREAD, when: (st) => !st.flags.clear },
		{
			nanj: "名付け親は　ワイや。\n……J民Bは　ほっとき",
			roze: "スレの　壁に、まだ\n安価の　あとが　のこってるアル",
			feris: "キリコちゃんの　スレ、\nちいさくて　かわいいね〜",
		},
	),
];
