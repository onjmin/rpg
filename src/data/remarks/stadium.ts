// 「はなす」：おんJスタジアム（remarks.ts）。
// 来られるのは 第三章（ナイター。やきうは 控え）と、声が もどってから（試合のあと。やきうは いない）。
// 場所：バックネットの門（応援団長の問題）・グラウンド（マウンド）・スコアボード。

import type { RemarkDef } from "../../engine/defs";
import { between, has, near, scene } from "./lib";

const STADIUM = { map: "stadium" };
/** バックネットの門の前（応援団長）。 */
const GATE = near("stadium", 8, 13, 12, 15);
/** グラウンド（マウンドのまわり）。 */
const FIELD = near("stadium", 6, 6, 14, 12);
/** スコアボードの下。 */
const SCORE = near("stadium", 8, 2, 13, 3);

export const stadium: RemarkDef[] = [
	// ───────── ナイター（試合の前） ─────────
	...scene(
		{ ...GATE, when: (st) => !st.flags.quiz_ok },
		{
			feris: "応援団長さんの　問題、\n私なら　わかるかも〜",
			roze: "……算数の　問題なら、\nわたしに　まかせるアル",
			nanj: "団長の　問題は、\nフェリスに　聞いたら　ええ",
		},
	),
	...scene(
		{ ...SCORE, when: (st) => !st.flags.b3 },
		{
			roze: "9回裏、2アウト満塁……\nいちばん　いい　ところアル",
			feris: "スコアボードに、私の\n名前が　ある〜",
			nanj: "名前欄の　スコアと\nおんなじや。……実況スレの　夜やな",
		},
	),
	...scene(
		{ ...FIELD, when: (st) => !st.flags.b3 },
		{
			feris: "……ここに　立つの、\n2009年　ぶりだ〜",
			roze: "ピッチャーの　球、わたしなら\nすりぬけるアル",
			nanj: "監督の　手首は　やわらかいで。\n……手のひら、返すからな",
		},
	),
	...scene(
		{ ...STADIUM, when: (st) => !st.flags.b3 },
		{
			roze: "照明が　まぶしいアル。\n……おばけには、昼みたいアル",
			feris: "歓声が　すごいね〜。\n羽が　ふるえちゃう",
			nanj: "控え　言うても、ここは　ホームや。\n……血が　さわぐわ",
		},
	),

	// ───────── 声が もどってから（試合のあと） ─────────
	...scene(
		{ ...FIELD, when: has("b3") },
		{
			roze: (st) =>
				st.flags.b3_how === "lose"
					? "……まだ　すこし、\n雨の　においが　するアル"
					: "ひきわけでも、ちゃんと\n試合は　おわったアル",
			feris: "マスコット、ここで\nはんぶんこ　したんだよ〜",
			teto: "ここが、やきうの　ホームか。\n……ずいぶん　広いな",
		},
	),
	...scene(
		{ ...SCORE, when: has("b3") },
		{
			roze: "ひきわけの　スコア、\nまだ　そのままアル",
			teto: "……「ひきわけ　おめでとう」か。\nへんな　スコアボードだな",
		},
	),
	...scene(
		{ ...STADIUM, when: between("b3", "clear") },
		{
			roze: "照明の　消えた　スタジアムも、\nわるくないアル",
			feris: "観客席、やきうくんの\n席だけ　あいてるね〜",
			teto: "……野球は　知らない。\nでも、この　広さは　声が　ひびく",
		},
	),
];
