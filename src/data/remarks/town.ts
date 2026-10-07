// 「はなす」：なんでも実況J町（remarks.ts）。
// 場所：勢い欄の前（広場のまんなか）・マッマの家・スタジオの前・ぷゆゆの小花・東門。
// 第四章の 沈黙のあいだは 町から出られない。完走のあとは 町へ もどれない（誕生スレ・管理人室だけ）。

import type { GameState, RemarkDef } from "../../engine/defs";
import { silent } from "../story";
import { between, during, near, scene } from "./lib";

const TOWN = { map: "town" };
/** 勢い欄の前（広場。アク禁の やきうも ここに立つ）。 */
const IKIOI = near("town", 9, 6, 14, 9);
/** マッマの家の前。 */
const MAMMA = near("town", 1, 4, 7, 7);
/** ぷゆゆの小花のそば。 */
const PUYU = near("town", 7, 10, 10, 12);
/** 東門（スタジアムへ）。 */
const EAST = near("town", 19, 7, 23, 10);
/** テトのスタジオの前。 */
const STUDIO = near("town", 1, 11, 7, 14);

/** やきうが 勢い欄の前で 見張っている（アク禁〜恩赦）。 */
const guarding = (st: GameState) => !!st.flags.akukin && !st.flags.onsha;

export const town: RemarkDef[] = [
	// ───────── 第四章：沈黙の町 ─────────
	...scene(
		{ ...IKIOI, when: (st) => silent(st) && guarding(st) },
		{
			roze: "……見張りを　かわると　言ったら、\n首を　ふられたアル",
			feris: "ふだが　はられてても、\n親指は　立てられるんだね〜",
		},
	),
	...scene(
		{ ...MAMMA, when: (st) => silent(st) && !st.flags.teto_met },
		{
			roze: "……マッマの　家だけ、\n灯りが　ついてるアル",
			feris: "ごはんの　においが　するね〜",
		},
	),
	...scene(
		{ ...PUYU, when: (st) => silent(st) && !!st.flags.puyu },
		{
			feris: "ぷゆゆちゃん、そこに\nいてくれたんだね〜",
		},
	),
	...scene(
		{ ...TOWN, when: (st) => silent(st) && !!st.flags.roze_hand },
		{
			roze: [
				[null, "ロゼの　手は、まだ\nキリコの　手の　中に　ある。"],
				["roze", "……歩くアル"],
			],
		},
	),
	...scene(
		{ ...TOWN, when: silent },
		{
			roze: "わたしより　静かな　町は、\nはじめてアル",
			feris: "風の　音しか　しないね〜。\n……羽の　音、小さくするね〜",
		},
	),

	// ───────── 第四章：声が もどってから（恩赦まで） ─────────
	...scene(
		{
			...IKIOI,
			when: (st) =>
				guarding(st) && !!st.flags.onigiri_got && !st.flags.onigiri_done,
		},
		{
			feris: "その　おにぎり、\nまだ　あったかいよ〜",
			teto: "……持ってる　だけじゃ、\nさめるぞ",
		},
	),
	...scene(
		{ ...IKIOI, when: guarding },
		{
			roze: (st) =>
				st.flags.onigiri_done
					? "……ふだの　すみ、\nまだ　しめってるアル"
					: "やきうが　書けない　ぶん、\nわたしたちが　書くアル",
			feris: (st) =>
				st.flags.onsha_req
					? "恩赦、はやく　とどくと\nいいね〜"
					: "やきうくん、声　聞こえたよね〜",
			teto: "……口を　ふさがれてても、\nうれしそうな　やつだな",
		},
	),
	...scene(
		{
			...MAMMA,
			when: (st) =>
				!!st.flags.aku_mimai && !st.flags.onigiri_got && !st.flags.onsha,
		},
		{
			roze: "さっきの　おなかの　音、\nマッマにも　聞こえそうアル",
		},
	),
	...scene(
		{ ...STUDIO, when: between("rec", "clear") },
		{
			teto: "……ボクの　スタジオだ。\n用が　なくても、寄っていいぞ",
		},
	),
	...scene(
		{ ...TOWN, when: during("server") },
		{
			roze: "町に　音が　もどったアル。\n……うるさいくらいが　ちょうどアル",
			feris: "みんな、帰ってきたね〜",
			teto: [
				["teto", "……騒がしい　町だな"],
				["teto", "べ、別に　きらいとは\n言ってない"],
			],
		},
	),

	// ───────── 終章：1000レス目の手前 ─────────
	...scene(
		{ ...TOWN, when: during("gate") },
		{
			roze: "町の　灯り、よく　見ておくアル。\n……完走しても、ここは　あるアル",
			feris: "1000レス目って、\n町からも　見えるのかな〜",
			teto: "のどあめは　たりてるか。\n……べつに、心配じゃない",
		},
	),

	// ───────── 第一〜三章（にぎやかな町） ─────────
	...scene(
		{ ...IKIOI, when: during("ikioi") },
		{ nanj: "この　看板が　勢い欄や。\n話しかけたら　読めるで" },
	),
	...scene(
		{ ...IKIOI, when: during("stadium") },
		{
			feris: "勢い欄に、ナイターの\nスレが　あるね〜",
			roze: "わたしたちの　スレ、\nまだ　いちばん上アル",
		},
	),
	...scene(
		{ ...IKIOI, when: (st) => !st.flags.balus_lost },
		{
			nanj: "勢い欄の　いちばん上、\nワイらの　スレやで",
			roze: "……すぐ　下の　スレタイ、\nさっきと　ちがうアル",
		},
	),
	...scene(
		{ ...MAMMA, when: (st) => !st.flags.balus_lost },
		{
			nanj: (st) =>
				st.flags.mamma_cup
					? "……カップめんも、\n食べたうちに　入るやろ"
					: "マッマの　とこは、\nたまに　寄ったら　ええ",
			roze: "あの　家、いつも\nごはんの　においアル",
			feris: "マッマさん、やさしいね〜",
		},
	),
	...scene(
		{ ...PUYU, when: (st) => !st.flags.balus_lost },
		{
			nanj: "ぷゆゆは、だいたい　あそこや。\n……ワイが　見てない　ときも",
			roze: "あの子、ずっと\nお花の　そばアル",
			feris: "ぷゆゆちゃん、ちっちゃくて\nかわいい〜",
		},
	),
	...scene(
		{ ...EAST, when: during("stadium") },
		{
			nanj: "東門の　むこうが　ホームや。\n……ちょっと　早足に　なるで",
			feris: "歓声、ここまで\n聞こえる〜",
		},
	),
	...scene(
		{ ...TOWN, when: during("ikioi") },
		{
			nanj: [
				[
					"nanj",
					"夜中やのに、みんな　起きとるやろ。\n……ここは　そういう　町や",
				],
				["kiriko", "吾輩も、ねむくないンゴ"],
			],
		},
	),
	...scene(
		{ ...TOWN, when: during("bridge", "kakolog") },
		{
			roze: [
				["roze", "この町、夜でも\n灯りが　消えないアル"],
				["kiriko", "ロゼ先輩の　ところは？"],
				["roze", "……群馬は、早寝アル"],
			],
			nanj: "ロゼちゃん　つれて　歩くと、\nJ民の　目が　ちゃうな",
		},
	),
	...scene(
		{ ...TOWN, when: during("stadium") },
		{
			roze: "今夜は　ナイターアル。\n……町じゅう、そわそわアル",
			feris: "やきうくんの　町、\nにぎやかだね〜",
			nanj: "ナイターの　日の　町は、\nにおいから　ちゃうねん",
		},
	),
];
