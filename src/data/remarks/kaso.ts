// 「はなす」：裏シナリオ「過疎板探検」（remarks.ts。data/kaso.ts）。
// 来られるのは 第二章（倉庫の北東の階段。やきう・ロゼ。フェリスが来たら やきうは控え）と、
// 声が もどってから（サーバーの底の ラック。ロゼ・フェリス・テト）。天文・気象板と実験板は 声が もどってから。
//
// ここの ひとことは、板の 様子と その人の 感想だけ。真相（裏返し3段）には ふれない：
// - bot・保守の あとを だれかに 結びつけない（「だれか」まで）。>>998 の ことばを 口に しない。
// - 沈んだレスの 時刻・8月17日・0時21分の 意味、「数が　合わない」わけ、床下の ものの いわれは 言わない。
// - ボツキリコ・サイレントバルス・沈黙の 話を 持ちこまない。謎ときの 答え（あいさつの順・999・取り合戦・箱）は 言わない。
// 説明に なりそうなら、パン・ねこ・ほこり・空の ほうへ 逃がす（README「セリフの書き方」）。

import type { GameState, RemarkDef } from "../../engine/defs";
import { has, near, scene } from "./lib";

// ───────────────── 過疎板の底 ─────────────────
const KASO = { map: "kaso" };
/** ヒナリーの すみ。 */
const HINARY = near("kaso", 14, 5, 18, 8);
/** モニターの 前。 */
const MONITORS = near("kaso", 2, 4, 14, 10);

/** 終えた板の数（点いた モニター）。 */
const lit = (st: GameState) =>
	["neko_done", "ais_done", "hos_done", "sen_done"].filter((f) => st.flags[f])
		.length;

// ───────────────── 犬猫大好き板 ─────────────────
const NEKO = { map: "neko" };
/** まんなかの 庭の ベンチ。 */
const NEKO_BENCH = near("neko", 1, 7, 4, 8);

// ───────────────── 料理板 ─────────────────
const AIS = { map: "aisatsu" };
/** 額と 残像の 列。 */
const FRAMES = near("aisatsu", 1, 3, 16, 4);
/** 帳場。 */
const COUNTER = near("aisatsu", 12, 9, 16, 11);

// ───────────────── 天文・気象板 ─────────────────
const HOSHU = { map: "hoshu" };
/** 左の 部屋（2000日前の 植民地化宣言）。 */
const HOS_OLD = near("hoshu", 2, 2, 6, 4);
/** 箱を 押す 部屋。 */
const HOS_BOX = near("hoshu", 7, 9, 13, 13);

// ───────────────── 実験板 ─────────────────
const SEN = { map: "sentori" };
/** スイッチの 部屋。 */
const SEN_SW = near("sentori", 1, 12, 18, 16);
/** 奥の 部屋（勢い欄・端末）。 */
const SEN_BACK = near("sentori", 1, 3, 18, 5);

// ───────────────── 避難J・ホーム・床下 ─────────────────
const HINAN = { map: "hinan" };
/** 家の 前。 */
const HOUSE = near("hinan", 1, 5, 5, 6);

export const kaso: RemarkDef[] = [
	// ───────── 過疎板の底 ─────────
	...scene(
		{ ...HINARY, when: has("ura_101") },
		{
			feris: "ヒナリーちゃん、\n発表　おわったんだね〜",
			roze: "……白衣の　ポケット、\n紙で　ふくらんでるアル",
		},
	),
	...scene(
		{ ...HINARY },
		{
			feris: "ヒナリーちゃん、ここでも\nずっと　数えてるんだね〜",
			roze: "研究の　じゃまは、\nしないアル",
			nanj: "研究成果、こんどこそ\n聞かせてもらうで",
			teto: "……白衣の　すそ、\nこげてるぞ",
		},
	),
	...scene(
		{ ...MONITORS },
		{
			roze: (st) =>
				lit(st) === 0
					? "モニター、まだ　どれも\nまっくらアル"
					: lit(st) < 4
						? "点いた　モニターが、\nすこし　ふえたアル"
						: "4つ　点いたアル。\n……あと　ひとつは、どこアル",
			feris: "ランプの　数だけ、\nだれかの　板が　あるんだね〜",
		},
	),
	...scene(
		{ ...KASO },
		{
			nanj: "900も　板が　あって、\nほとんど　寝とるんか",
			roze: "おーぷんの　底は、\nひんやりアル",
			feris: "しーんと　してるけど、\nあったかい　ランプも　あるね〜",
			teto: "……900の　板か。VIPにも、\nこういう　すみっこは　あった",
		},
	),

	// ───────── 犬猫大好き板 ─────────
	...scene(
		{
			...NEKO,
			when: (st) => !st.flags.neko_done && Number(st.flags.neko_step) > 0,
		},
		{
			roze: "すずの　音の　するほうへ\n行くアル",
		},
	),
	...scene(
		{ ...NEKO_BENCH },
		{
			roze: "ベンチ、ねこの　毛で\nふわふわアル",
			feris: "ここで　ひなたぼっこ\nしたいな〜",
		},
	),
	...scene(
		{ ...NEKO, when: has("neko_done") },
		{
			roze: "画像の　ねこは、\n1000日　年を　とらないアル",
			feris: "ぬこ画像、ぜんぶ\nかわいかったね〜",
			nanj: "1000日ぶんの　ぬこ画像か。\n……ちょっと　見たかったわ",
			teto: "……だれも　見ない　画像を、\nよく　1000日も　はったな",
		},
	),
	...scene(
		{ ...NEKO },
		{
			roze: "……犬は、やっぱり\nいないアル",
			feris: "ねこさん、なでても\nいいかな〜",
			nanj: "ねこしか　おらん　板か。\n……平和やな",
			teto: "……ねこは、パン\n食うのか",
		},
	),

	// ───────── 料理板 ─────────
	...scene(
		{ ...FRAMES, when: (st) => !st.flags.ais_order && !!st.flags.ais_hint },
		{
			roze: "額の　日付、ばらばらアル",
		},
	),
	...scene(
		{ ...COUNTER, when: (st) => !!st.flags.ais_done && !st.flags.sunk_130 },
		{
			roze: "帳場の　帳面、\nもう　読めそうアル",
		},
	),
	...scene(
		{ ...AIS, when: has("ais_done") },
		{
			roze: "麻婆豆腐の　スレも、\nあったら　よかったアル",
			feris: "いらっしゃい、って\nまた　言ってほしいね〜",
			nanj: "バラムツは　あかん。\nワイでも　知っとる",
			teto: "……雑談だけの　店か。\nボクは、きらいじゃない",
		},
	),
	...scene(
		{ ...AIS, when: has("ais_order") },
		{
			roze: "……いい　店だったアル",
			feris: "あいさつ　したら、\nみんな　帰っちゃったね〜",
			nanj: "あいさつで　はじまって、\nあいさつで　帰る　店か",
		},
	),
	...scene(
		{ ...AIS },
		{
			roze: "残像でも、あいさつは\n大事アル。……おばけ同士アル",
			feris: "みんな、なにか\n待ってるみたい〜",
			nanj: "料理板やのに、\nなんも　ええ　におい　せんな",
			teto: "……米を　とげ、か。\nパンなら　ボクに　聞け",
		},
	),

	// ───────── 天文・気象板 ─────────
	...scene(
		{ ...HOS_OLD },
		{
			roze: "侵略しに　来て、\n3日で　帰ったアル",
			feris: "ここ、いちばん　古いね〜",
			teto: "……3日で　飽きた、か。\n正直な　やつだ",
		},
	),
	...scene(
		{ ...HOS_BOX, when: (st) => !st.flags.hos_age },
		{
			roze: "沈んだ　スレ、重そうアル。\n……わたしは　押せないアル",
			feris: "よいしょ〜って、\n私も　押したい〜",
			teto: "……ボクの　ドリルで　押すか？\n冗談だ",
		},
	),
	...scene(
		{ ...HOSHU, when: has("hos_done") },
		{
			roze: "……音が、すこしずつ\nもどってきたアル",
			feris: "さっきの　しずけさ、\nさむかったね〜",
			teto: "……あんな　静けさは、\n二度と　ごめんだ",
		},
	),
	...scene(
		{ ...HOSHU, when: has("hos_age") },
		{
			roze: "保守の　日付、だんだん\n新しく　なるアル",
			feris: "保守、保守……ずっと\n同じ　ことばだね〜",
			teto: "……だれかが、ここで\nずっと　書いてたんだな",
		},
	),
	...scene(
		{ ...HOSHU },
		{
			roze: "空の　写真、毎日\nだれかが　はってたアル",
			feris: "台風の　スレ〜。\n……私、風は　好きだよ〜",
			teto: "……空なんか、\n見あげたのは　いつぶりだ",
		},
	),

	// ───────── 実験板 ─────────
	...scene(
		{ ...SEN_SW, when: (st) => !st.flags.sen_999 },
		{
			roze: "数字の　足し算アル。\n……素粒子より　かんたんアル",
			feris: "お勉強だ〜。\n……私、こういうの　とくい〜？",
			teto: "……1000の　手前で\n止めるのか",
		},
	),
	...scene(
		{ ...SEN_BACK, when: (st) => !!st.flags.sen_999 && !st.flags.sen_won },
		{
			roze: "1000取り合戦……\nあわてないアル",
			feris: "1000、取れるかな〜",
			teto: "……1000日　待ってた　相手、か",
		},
	),
	...scene(
		{ ...SEN, when: has("sen_line") },
		{
			roze: "……避難Jへ、行くアル",
			feris: "住民1名さん、\nどんな　人かな〜",
			teto: "……「ワイにも、や」か。\nへんな　メモだな",
		},
	),
	...scene(
		{ ...SEN },
		{
			roze: "テストだけして、\nみんな　帰ったアル",
			feris: "ここの　スイッチ、\nぜんぶ　押したくなるね〜",
			teto: "……テストだけの　板か。\nマイクテスト　みたいなもんだな",
		},
	),

	// ───────── 避難J ─────────
	...scene(
		{ ...HINAN, when: has("hinan_end") },
		{
			roze: "……ここの　時間は、\nゆっくりアル",
			feris: "1000日、あっという間\nだったね〜",
			teto: "……保守の　日々も、\n悪くは　なかった",
		},
	),
	...scene(
		{ ...HINAN, when: has("hinan_back") },
		{
			roze: "……完走して、\nまた　来るアル",
			feris: "またね〜って、\n言いに　来ようね〜",
			teto: "……行くぞ。むこうの　スレが\n待ってる",
		},
	),
	...scene(
		{ ...HINAN, when: has("ura_101") },
		{
			roze: "……すこし、\nここに　いるアル",
			feris: "ここの　ベンチ、\nすわると　あったかいね〜",
			teto: "……パンは、あと　ひとつ。\nホームニキにも　やるか",
		},
	),
	...scene(
		{ ...HINAN, when: has("hinan_1000") },
		{
			roze: "……おかえり、って\n言われたアル",
			feris: "ホームニキさん、\nちょっと　かるく　なったみたい〜",
			teto: "……1000日、か。ボクなら\nとっくに　パンが　かびてる",
		},
	),
	...scene(
		{ ...HINAN, when: has("home_998") },
		{
			roze: "……999を、書きに　行くアル",
			feris: "勢い欄、待ってるね〜",
			teto: "……読んだなら、書け。\nそういう　板だろ",
		},
	),
	...scene(
		{ ...HOUSE, when: (st) => !!st.flags.home_met && !st.flags.home_in },
		{
			roze: (st) =>
				st.flags.hos_key
					? "カギ、ここで　使うアル"
					: "……家に、カギが\nかかってるアル",
		},
	),
	...scene(
		{ ...HINAN, when: has("home_met") },
		{
			roze: "……帰れ、って　言われたアル。\n……帰らないアル",
			feris: "ねこは　ノーカン、だって〜。\nねこさん、かわいそう〜",
			teto: "……ああいう　意地は、\nボクにも　わかる",
		},
	),
	...scene(
		{ ...HINAN },
		{
			roze: "……人も、音も、\nほとんど　ないアル",
			feris: "風も　ふいてないね〜。\n羽が　しずか〜",
			teto: "……人口　1、か",
		},
	),

	// ───────── ホーム（家の中）・床下 ─────────
	...scene(
		{ map: "hinan_home" },
		{
			roze: "……ひとりで　住むには、\nちょうどいい　部屋アル",
			feris: "ねこさんの　におい〜",
			teto: "……ボクの　スタジオより、\nせまいな",
		},
	),
	...scene(
		{ map: "yukashita", when: has("ura_101") },
		{
			roze: "……ここは、\nそっと　しておくアル",
			feris: "ねこさんの　寝床、\nあったかかったね〜",
			teto: "……ここでは、\nパンは　かじらない",
		},
	),
	...scene(
		{ map: "yukashita" },
		{
			roze: "……土の　においアル",
			feris: "ここ、ちょっと　さむいね〜",
			teto: "……声が、ひびかないな",
		},
	),
];
