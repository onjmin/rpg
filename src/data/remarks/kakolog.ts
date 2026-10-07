// 「はなす」：過去ログ倉庫（remarks.ts）。
// 場所：入口（古参ニキ・ヒナリー）・こわれた掲示板（再安価の ふきだまり）・ふさいだ本棚・まんなかの広間・
// 奥の間（ムッジェ）・北東の空き部屋（はなれた棚の 名無しのログ・下への階段）。
// 掲示板の「いちばん重いレス」は 裏シナリオの 床下へ つながる。だれも それ以上は 言わない。

import type { GameState, RemarkDef } from "../../engine/defs";
import { between, has, inParty, near, scene } from "./lib";

const KAKO = { map: "kakolog" };
/** 入口のまわり（古参ニキ・ヒナリー）。 */
const HINARY = near("kakolog", 11, 14, 15, 16);
/** こわれた掲示板（再安価で 流れたレスの ふきだまり）。 */
const BOARD = near("kakolog", 13, 10, 18, 12);
/** ふさいでいた本棚の前（「……ンゴ……」の声の所）。 */
const SHELF = near("kakolog", 10, 10, 12, 10);
/** 奥の間の手前の広間（蓄音機）と 奥の間。 */
const PLAZA = near("kakolog", 8, 6, 14, 8);
const DEEP = near("kakolog", 6, 3, 15, 5);
/** 北東の空き部屋（はなれた棚・下への階段）。 */
const NE = near("kakolog", 17, 2, 20, 6);

const heard = (st: GameState) => !!st.flags["done:kakolog:whisper"];
/** やきうが 仲間に いる（アク禁の前。控えでも）。 */
const nanjHere = (st: GameState) => inParty(st, "nanj") && !st.flags.akukin;

export const kakolog: RemarkDef[] = [
	// ───────── 本棚が ひらくまで（やきう・ロゼ） ─────────
	...scene(
		{ ...SHELF, when: (st) => heard(st) && !st.flags.shelf_open },
		{
			roze: "この　本棚、わたしなら\n通れるアル",
			nanj: "押しても　びくとも　せえへん。\n……ロゼちゃん、たのめる？",
		},
	),
	...scene(
		{ ...BOARD, when: (st) => heard(st) && !st.flags.b2 },
		{
			roze: "……あの　掲示板、\nまだ　なにか　言ってるアル",
			nanj: "流れた　レスの　ふきだまりか。\n……あんまり　見んとき",
		},
	),
	...scene(
		{ ...KAKO, when: (st) => heard(st) && !st.flags.shelf_open },
		{
			roze: "……おばけが　おばけを\nこわがるのは、常識アル",
			nanj: "さっきの　声は　気のせいや。\n……たぶんな",
		},
	),
	...scene(
		{ ...KAKO, when: (st) => !st.flags.shelf_open },
		{
			roze: "落ちた　スレの　においアル。\n……紙と、ほこりアル",
			nanj: "古い　スレほど　奥に\nしまわれとる。……奥は　まっくらや",
		},
	),

	// ───────── 奥の間の手前（本棚の むこう） ─────────
	...scene(
		{ ...PLAZA, when: (st) => !!st.flags.shelf_open && !st.flags.b2 },
		{
			roze: "おくに、だれか　いるアル。\n……ふたり、アル",
			nanj: "……なんや、なつかしい\nにおいが　するな",
		},
	),
	...scene(
		{ ...KAKO, when: (st) => !!st.flags.shelf_open && !st.flags.b2 },
		{
			roze: "本棚の　むこうは、\nもっと　ひんやりアル",
			nanj: "ここまで　来たら、\nもう　閲覧専用とは　言えんな",
		},
	),

	// ───────── フェリスが 来てから ─────────
	// 北東の はなれた棚（名無しのログ。kako_2015）
	...scene(
		{ ...NE, when: (st) => Number(st.flags.kako_2015) >= 2 && nanjHere(st) },
		{
			feris: "……ここの　ログ、\nもう一回　読んでも　いい〜？",
			roze: [
				["roze", "……やきう、耳"],
				["nanj", "見んで　ええ"],
			],
			nanj: "……ほこり　すごいで、そこ",
		},
	),
	...scene(
		{
			...NE,
			when: (st) =>
				Number(st.flags.kako_2015) === 1 && !!st.flags.feris_in && nanjHere(st),
		},
		{
			feris: "あの　棚の　前、やきうくんが\n立ってたね〜",
			nanj: "……古い　ログなんか、\nほっとき",
		},
	),
	...scene(
		{ ...NE, when: (st) => Number(st.flags.kako_2015) >= 2 },
		{
			feris: "「フェリスおったよな」……\nいまも、ちゃんと　読めるよ〜",
			teto: "……ふうん。名無しの　ログか",
		},
	),
	...scene(
		{ ...NE, when: has("dig_hinan") },
		{
			feris: "ヒナリーちゃんの　研究、\nこの　下かな〜",
			roze: "……下から、風が　来るアル",
		},
	),
	// 奥の間（ムッジェ・ンゴ姉・パン松）
	...scene(
		{ ...DEEP, when: has("b2") },
		{
			feris: (st) =>
				st.flags.b2_how === "lose"
					? "ムッジェ、まだ　ねがおが\nたのしそう〜"
					: "ここで　ずっと　ムッジェと\nおるすばん　してたんだ〜",
			roze: "ここ、さっきより\nあったかいアル",
			nanj: "ムッジェの「ホゲェ」、\n……ワイにだけ　強ない？",
			teto: "……赤い　毛玉が、\nこっちを　見てるぞ",
		},
	),
	// 入口（ヒナリー）
	...scene(
		{ ...HINARY, when: has("feris_in") },
		{
			feris: "ヒナリーちゃん、今日も\n発表　してた〜？",
			roze: "……発表、短いアル",
			nanj: "研究成果、まだ　ちゃんと\n聞いてへんで",
		},
	),
	// 声が もどってから（やきうは いない）
	...scene(
		{ ...KAKO, when: has("rec") },
		{
			roze: "やきうの　いない　倉庫は、\nちょっと　静かすぎるアル",
			feris: "やきうくんの　黒歴史、\nどこに　あるのかな〜",
			teto: (st) =>
				st.flags.dig_uso
					? "……ボクの　ウソまで、\nちゃんと　しまってあるとはな"
					: "ほこりっぽいな。\n……のどに　悪い",
		},
	),
	...scene(
		{ ...KAKO, when: between("b2", "rec") },
		{
			feris: "ここ、私の　おうちみたいな\nものだったんだ〜",
			roze: "フェリス先輩が　いると、\n倉庫も　あったかいアル",
			nanj: "控えから　見ても、\n倉庫は　倉庫やな",
		},
	),
];
