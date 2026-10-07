// 「はなす」：スレ街道（remarks.ts）。
// 場所：屋台（ロゼが待っていた）・橋の前（番長）・つり場・洞くつの前・西の岩（名無しの すきま）・北東のすみ（おんすちゃん）。
// 川の北は 番長を越えるまで 行けない。

import type { GameState, RemarkDef } from "../../engine/defs";
import { between, during, has, near, scene } from "./lib";

const ROAD = { map: "road" };
/** 屋台（店主・蓄音機・ロゼが すわっていた所）。 */
const YATAI = near("road", 2, 10, 8, 14);
/** 橋の前（番長と子分）。 */
const BRIDGE = near("road", 10, 7, 14, 10);
/** つり場の前。 */
const FISH = near("road", 2, 8, 6, 9);
/** 洞くつ（過去ログ倉庫）の前。 */
const CAVE = near("road", 10, 1, 14, 3);
/** 西の はし（通りぬけられる岩。名無しの すきま）。 */
const WEST = near("road", 1, 5, 3, 6);
/** 北東の すみ（おんすちゃん）。 */
const ONSU = near("road", 19, 2, 22, 5);

const how = (st: GameState) => String(st.flags.b1_how ?? "fight");

export const road: RemarkDef[] = [
	// ───────── ロゼに 会うまで（やきうと 2人） ─────────
	...scene(
		{ ...YATAI, when: during("road") },
		{ nanj: "屋台に、だれか　すわっとるで。\n……足もと、よう　見えへんけど" },
	),
	...scene(
		{ ...BRIDGE, when: during("road") },
		{ nanj: "番長と　子分か。\nワイら　2人じゃ　分が　悪いわ" },
	),
	...scene(
		{ ...ROAD, when: during("road") },
		{
			nanj: "街道は　いろんな　スレの\n通り道や。宣伝には　もってこいやで",
		},
	),

	// ───────── 番長の前（ロゼと 3人） ─────────
	...scene(
		{ ...BRIDGE, when: (st) => !st.flags.b1 && !!st.flags.hw_fish },
		{
			roze: "その　ワカサギ、\n番長に　見せるアル",
			nanj: "絵日記の　ネタ、とれたてやで",
		},
	),
	...scene(
		{ ...BRIDGE, when: (st) => !st.flags.b1 && !!st.flags.hw_help },
		{
			roze: "つり場は、橋の　左アル",
			nanj: "魚か……。川なら　すぐ　そこや",
		},
	),
	...scene(
		{ ...BRIDGE, when: (st) => !st.flags.b1 && Number(st.flags.lose_b1) > 0 },
		{
			roze: "番長、つよいアル。\n……宿題から　にげてる　ぶん",
			nanj: "力で　あかんなら、\nほかの　通り方も　あるやろ",
		},
	),
	...scene(
		{ ...BRIDGE, when: during("bridge") },
		{
			roze: (st) =>
				st.flags.b1_met
					? "宿題、ほんとに　あとで\nやるアル？"
					: "子どもが　橋を　ふさいでるアル。\n……夏休みアル",
			nanj: "通るには　勝負か……。\nほかに　手は　ないんか",
		},
	),
	...scene(
		{ ...FISH, when: (st) => Number(st.flags.fish_n) >= 3 },
		{
			roze: "きょうは　もう　釣れないアル。\n……マーボーは　おいしかったアル",
			nanj: "長ぐつまで　釣れる　川や。\nなんでも　流れてくるで",
			feris: "お魚さん、もう　おやすみ\nだって〜",
		},
	),
	...scene(
		{ ...FISH, when: (st) => !st.flags.b1 },
		{
			nanj: [
				["nanj", "キリコ、釣り　うまいんか？"],
				["kiriko", "ワカサギなら、まかせるンゴ"],
			],
		},
	),
	...scene(
		{ ...YATAI, when: has("roze_in") },
		{
			roze: (st) =>
				st.flags.b1
					? "ここの　マーボーは\n本場の　味アル"
					: "ここで　キリコを　待ってたアル。\n……マーボー　三杯　ぶん",
			nanj: "(´・ω・｀)の　マーボー、\nクセに　なるで",
			feris: "からい　におい……\nくしゃみ　出そう……ふぇ……",
			teto: "……ここの　マーボー、\nパンに　のせても　いけるな",
		},
	),
	...scene(
		{ ...ROAD, when: during("bridge") },
		{
			roze: "風が　気持ちいいアル。\n……カツラは　しっかり　とめたアル",
			nanj: "ロゼちゃんが　おると、\nなんや　背すじ　のびるわ",
		},
	),

	// ───────── 番長を 越えてから ─────────
	...scene(
		{ ...WEST, when: has("b1") },
		{
			roze: "……この　岩、むこうに\n風が　ぬけてるアル",
		},
	),
	...scene(
		{ ...ONSU, when: has("onsu_met") },
		{
			roze: "ハンカチ、また　かんでるアル",
			nanj: "おんSも　おーぷんの　板や。\n……ちょっと　過疎っとるけど",
			feris: "ハンカチ、のびのびだね〜",
			teto: "……保守くらいなら、\nたまに　書いてやっても　いい",
		},
	),
	...scene(
		{ ...CAVE, when: between("b1", "b2") },
		{
			roze: "この　おくが　過去ログ倉庫アル。\n……ひんやり　してきたアル",
			nanj: "ここから　先は、落ちた　スレの\n行き先や",
		},
	),
	...scene(
		{ ...BRIDGE, when: between("b1", "b3") },
		{
			nanj: (st) =>
				how(st) === "neta"
					? "ファン1号、どこかで\n聞いてくれとるかもな"
					: how(st) === "shukudai"
						? "絵日記の　清書、\nちゃんと　できたんかな"
						: "番長、明日は　ちゃんと\n登校したんかな",
			roze: (st) =>
				how(st) === "lose"
					? "……橋は　通して　もらったアル。\nつぎは、ちゃんと　勝つアル"
					: "番長の　いない　橋は、\nひろく　見えるアル",
		},
	),

	// ───────── ナイターの日（フェリスと） ─────────
	...scene(
		{ ...ROAD, when: during("stadium") },
		{
			roze: "ナイターの　歓声、\nここまで　とどくアル",
			feris: "ここ、空が　ひろいね〜。\n……とびたく　なっちゃう",
		},
	),

	// ───────── 声が もどってから（テトと） ─────────
	...scene(
		{ ...ROAD, when: has("rec") },
		{
			roze: "……やきうと　歩いた　道アル",
			feris: "空が　ひろいと、声も\n遠くまで　とどきそうだね〜",
			teto: "……これが　スレ街道か。\nVIPの　ほうとは、だいぶ　ちがうな",
		},
	),
];
