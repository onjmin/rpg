// 出来事の直後だけの雑談（ひとこと）。
// - walk … 出来事のあと、そのマップで数歩あるくと、仲間が ぽろっと話す（止まらない吹き出し）。
//          マップを出たら もう流れない。なかよし度は上げない（見のがしても損はない）。
// - talk … 出来事のあと、次の出来事までに はじめて話したときだけ、町の人の一言が変わる。
// 説明はさせない。その場の様子だけ（ひとやすみ会話より軽く、1〜5行）。

import type { AsideData, AsideLine, Story } from "../engine/defs";

/** J民系のモブ（黄色の名前欄・読み上げなし）。 */
const J = (s: Story, name: string, text: string) =>
	s.say("nanj", text, { name });
/** J民以外の人（名前欄だけ）。 */
const N = (s: Story, name: string, text: string) => s.say(null, text, { name });

/** 番長の越え方ごとの ひとこと（road.ts の b1_how）。 */
const B1_LINES: Record<string, AsideLine[]> = {
	fight: [
		["nanj", "番長、明日　登校日　言うとったな"],
		["roze", "宿題、おわってるアルか"],
		["kiriko", "……たぶん　まっしろンゴ"],
		["nanj", "草"],
	],
	shukudai: [
		["roze", "絵日記の　キリコ、\n目が　ふたつ　あったアル"],
		["kiriko", "吾輩、前髪で\nひとつしか　見えないンゴ"],
		["nanj", "清書で　なおしとくやろ"],
	],
	neta: [
		["nanj", "ファン1号、ほんまに　なりよったな"],
		["roze", "サイン、ねだられる　かもアル"],
		["kiriko", "……練習、しておくンゴ"],
	],
	lose: [
		["kiriko", "……通して　もらっちゃったンゴ"],
		["nanj", "スレは　進んどる。それで　ええ"],
		["roze", "帰りに　もう一回　勝負アル"],
	],
};

export const asides: AsideData = {
	walk: [
		// 番長（B1）を越えたあと（スレ街道）
		{
			id: "b1",
			members: ["nanj", "roze"],
			when: (st) => !!st.flags.b1 && !st.flags.b2,
			lines: (st) => B1_LINES[String(st.flags.b1_how)] ?? B1_LINES.fight,
		},
		// フェリスの ほのおで 町へ あがったあと
		{
			id: "b2",
			members: ["roze", "feris"],
			when: (st) => !!st.flags.b2 && !st.flags.b3,
			lines: [
				["feris", "町、ひさしぶりだな〜"],
				["roze", "……なんだか　こげくさいアル"],
				["feris", "あ、私かも〜"],
				["kiriko", "吾輩の　前髪も、\nちょっと　ちりちりンゴ"],
			],
		},
		// 声がもどったあと（スタジオ）
		{
			id: "rec",
			members: ["roze", "feris", "teto"],
			when: (st) => !!st.flags.rec && !st.flags.rei_met,
			lines: [
				["kiriko", "あー、あー。……あー"],
				["feris", "ずっと　言ってる〜"],
				["kiriko", "……出るか、たしかめてるンゴ"],
				["teto", "うるさいな。\nフランスパンが　かじれない"],
				["roze", "……何回でも　たしかめて　いいアル"],
			],
		},
		// レイに修復してもらい、恩赦を申請してもらったあと（サーバーの底）
		{
			id: "rei",
			members: ["roze", "feris", "teto"],
			when: (st) => !!st.flags.rei_met && !st.flags.door_open,
			lines: [
				["roze", "……修復、ちょっと\nくすぐったいアル"],
				["feris", "わかる〜"],
				["kiriko", "やきう、「すまんかった」って\n書いたンゴ？"],
				["teto", "……書いたんだろ。あいつなりにさ"],
			],
		},
		// アク禁の扉をひらいたあと（1000レス目の手前）
		{
			id: "door",
			members: ["roze", "feris", "teto"],
			when: (st) => !!st.flags.door_open && !st.flags.clear,
			lines: (st) =>
				st.flags.aku_self
					? [
							["teto", "さっきの　じぶんアク禁、\nログに　のこるぞ"],
							["kiriko", "……それも　蓄音しておくンゴ"],
							["roze", "しなくて　いいアル"],
						]
					: [
							["roze", "上に　いくほど、\n音が　へっていくアル"],
							["feris", "くしゃみも　ひびかないかな〜"],
							["kiriko", "……ひびかせるンゴ"],
						],
		},
	],

	talk: [
		// ── 番長（B1）のあと、倉庫の騒ぎが片づくまで ──
		{
			id: "b1_oekaki",
			map: "town",
			event: "oekaki",
			when: (st) => !!st.flags.b1 && !st.flags.b2,
			run: async (s) => {
				if (s.flag("b1_how") === "shukudai") {
					await J(
						s,
						"お絵かきニキ",
						"番長の　絵日記、見せてもろたで。\n……ワイのほうが　うまいな",
					);
					await s.say("kiriko", "張りあう　ところ　ちがうンゴ");
					return;
				}
				await J(
					s,
					"お絵かきニキ",
					"橋の　番長、どいたんやて？\n記念に　描いといたろか",
				);
				await s.say("kiriko", "……字は　まちがえないでンゴ");
				await J(s, "お絵かきニキ", "…………");
			},
		},
		{
			id: "b1_igo",
			map: "town",
			event: "igo",
			when: (st) => !!st.flags.b1 && !st.flags.b2,
			run: async (s) => {
				const how = s.flag("b1_how");
				await J(
					s,
					"囲碁J民",
					how === "fight"
						? "番長と　打ちあったんやて？\n……力碁やな"
						: how === "lose"
							? "負けて　通してもろたんか。\n……そういう　一局も　ある"
							: "番長を　たたかわずに　どかした？\n……石を　とらん　勝ち方やな",
				);
				await s.say("roze", "囲碁で　たとえられても　こまるアル");
			},
		},

		// ── フェリスの ほのおで あがったあと、ナイターまで ──
		{
			id: "b2_senju",
			map: "town",
			event: "senju",
			when: (st) => !!st.flags.b2 && !st.flags.b3,
			run: async (s) => {
				await N(s, "先住民", "あ！空から　とり　ふってきたど！");
				await s.say("feris", "とりじゃ　ないよ〜。\n不死鳥だよ〜");
			},
		},
		{
			id: "b2_oekaki",
			map: "town",
			event: "oekaki",
			when: (st) => !!st.flags.b2 && !st.flags.b3,
			run: async (s) => {
				await J(
					s,
					"お絵かきニキ",
					"さっきの　ほのお、描き　そびれたわ。\n……もう一回　とんでくれへん？",
				);
				await s.say("feris", "くしゃみが　出たらね〜");
			},
		},

		// ── 声がもどったあと、アク禁の扉まで（静かだった町に 人がもどる） ──
		{
			id: "rec_voice",
			map: "town",
			event: "voice",
			when: (st) => !!st.flags.rec && !st.flags.door_open,
			run: async (s) => {
				await J(s, "ボイスニキ", "……キリコちゃん、\nなんか　しゃべってみ");
				await s.say("kiriko", "……あー。吾輩ンゴ");
				await J(s, "ボイスニキ", "……よっしゃ。\nボイス、ONに　しとこ");
			},
		},
		{
			id: "rec_senju",
			map: "town",
			event: "senju",
			when: (st) => !!st.flags.rec && !st.flags.door_open,
			run: async (s) => {
				await N(s, "先住民", "あ！今日は　声が　あるど！");
				await s.say("roze", "……今日は、それで　合ってるアル");
			},
		},
		{
			id: "rec_igo",
			map: "town",
			event: "igo",
			when: (st) => !!st.flags.rec && !st.flags.door_open,
			run: async (s) => {
				await J(
					s,
					"囲碁J民",
					"静かな　あいだ、ひとりで　打っとった。\n……石の音が　ひびいて　かなわん",
				);
				await s.say("kiriko", "……じゃあ、うるさく　するンゴ");
				await J(s, "囲碁J民", "……おう。たのむわ");
			},
		},
	],
};
