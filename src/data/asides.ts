// 出来事の直後だけの会話（期間限定。次の出来事まで）。どれも こちらから話しかけたときだけ流れる。
// - chats … 「なかまと　はなす」（なかま → その人 →「ふたりで　はなす」）で、その期間に1回だけ
//           ふだんの話の代わりに流れる（見たら aside_<id>）。メニューの「はなす」（remarks.ts）とは別。
// - fresh … 町の人に はじめて話したとき1回だけ、ふだんの話の代わりに流れる（見たら fresh_<id>）。
//           町の人の話（maps/town.ts）の頭で freshTalk を呼ぶ。
// 分量：ふだんの話に「足す」のではなく、1回だけ「置きかえる」。1件2〜3行、話す相手とキリコだけ。
// 町の人は 1つの期間に2人まで。説明はさせない。その場の様子だけ。

import type { ChatDef, GameState, Script, Story } from "../engine/defs";

/** 1行。[話す人の cast id, 文]。 */
type AsideLine = [who: string, text: string];

/** J民系のモブ（黄色の名前欄・読み上げなし）。 */
const J = (s: Story, name: string, text: string) =>
	s.say("nanj", text, { name });
/** J民以外の人（名前欄だけ）。 */
const N = (s: Story, name: string, text: string) => s.say(null, text, { name });

/** 番長の越え方ごとの ひとこと（road.ts の b1_how）。 */
const B1_LINES: Record<string, AsideLine[]> = {
	fight: [
		["nanj", "番長、明日　登校日　言うとったな"],
		["kiriko", "……宿題、たぶん　まっしろンゴ"],
		["nanj", "草"],
	],
	shukudai: [
		["nanj", "絵日記の　キリコ、\n目が　ふたつ　あったで"],
		["kiriko", "吾輩、前髪で\nひとつしか　見えないンゴ"],
	],
	neta: [
		["nanj", "ファン1号、ほんまに　なりよったな"],
		["kiriko", "……サインの　練習、しておくンゴ"],
	],
	lose: [
		["kiriko", "……通して　もらっちゃったンゴ"],
		["nanj", "スレは　進んどる。それで　ええ"],
	],
};

type AsideDef = {
	id: string;
	/** 「なかまと　はなす」で話しかける相手。 */
	who: string;
	/** 全員がパーティ（控えもふくむ）にいるときだけ（キリコは書かなくてよい）。 */
	members: string[];
	when: (s: GameState) => boolean;
	lines: AsideLine[] | ((s: GameState) => AsideLine[]);
};

type FreshDef = {
	id: string;
	/** 話しかける人（town のイベント id）。 */
	event: string;
	when: (s: GameState) => boolean;
	run: Script;
};

const ASIDES: AsideDef[] = [
	// 番長（B1）を越えたあと（スレ街道）
	{
		id: "b1",
		who: "nanj",
		members: ["nanj"],
		when: (st) => !!st.flags.b1 && !st.flags.b2,
		lines: (st) => B1_LINES[String(st.flags.b1_how)] ?? B1_LINES.fight,
	},
	// フェリスの ほのおで 町へ あがったあと
	{
		id: "b2",
		who: "feris",
		members: ["feris"],
		when: (st) => !!st.flags.b2 && !st.flags.b3,
		lines: [
			["feris", "町、ひさしぶりだな〜"],
			["kiriko", "……なんだか　こげくさいンゴ"],
			["feris", "あ、私かも〜"],
		],
	},
	// 声がもどったあと（スタジオ）
	{
		id: "rec",
		who: "feris",
		members: ["feris"],
		when: (st) => !!st.flags.rec && !st.flags.rei_met,
		lines: [
			["kiriko", "あー、あー。……あー"],
			["feris", "ずっと　言ってる〜"],
			["kiriko", "……出るか、たしかめてるンゴ"],
		],
	},
	// レイに修復してもらい、恩赦を申請してもらったあと（サーバーの底）
	{
		id: "rei",
		who: "teto",
		members: ["teto"],
		when: (st) => !!st.flags.rei_met && !st.flags.door_open,
		lines: [
			["kiriko", "やきう、「すまんかった」って\n書いたンゴ？"],
			["teto", "……書いたんだろ。あいつなりにさ"],
		],
	},
	// アク禁の扉をひらいたあと（1000レス目の手前。ロゼは R2 が同じ場面なので フェリス）
	{
		id: "door",
		who: "feris",
		members: ["feris"],
		when: (st) => !!st.flags.door_open && !st.flags.clear,
		lines: (st) =>
			st.flags.aku_self
				? [
						["feris", "さっきの　じぶんアク禁、\nログに　のこるよ〜"],
						["kiriko", "……それも　蓄音しておくンゴ"],
					]
				: [
						["feris", "上に　いくほど、\n音が　へっていくね〜"],
						["kiriko", "……ひびかせるンゴ"],
					],
	},
];

const FRESH: FreshDef[] = [
	// ── 番長（B1）のあと、倉庫の騒ぎが片づくまで ──
	{
		id: "b1_oekaki",
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
		},
	},
	{
		id: "b1_igo",
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
		event: "senju",
		when: (st) => !!st.flags.b2 && !st.flags.b3,
		run: async (s) => {
			await N(s, "先住民", "あ！空から　とり　ふってきたど！");
			await s.say("feris", "とりじゃ　ないよ〜。\n不死鳥だよ〜");
		},
	},
	{
		id: "b2_oekaki",
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
		event: "voice",
		when: (st) => !!st.flags.rec && !st.flags.door_open,
		run: async (s) => {
			await J(s, "ボイスニキ", "……キリコちゃん、\nなんか　しゃべってみ");
			await s.say("kiriko", "……あー。吾輩ンゴ");
		},
	},
	{
		id: "rec_senju",
		event: "senju",
		when: (st) => !!st.flags.rec && !st.flags.door_open,
		run: async (s) => {
			await N(s, "先住民", "あ！今日は　声が　あるど！");
			await s.say("roze", "……今日は、それで　合ってるアル");
		},
	},
];

/** 出来事の直後だけの「なかまと　はなす」（bonds.ts で ふだんの話より先に並べる）。 */
export const asideChats: ChatDef[] = ASIDES.map((a) => ({
	who: a.who,
	when: (st) =>
		!st.flags[`aside_${a.id}`] &&
		a.members.every(
			(m) => m === "kiriko" || st.party.some((p) => p.id === m),
		) &&
		a.when(st),
	run: async (s) => {
		s.state.flags[`aside_${a.id}`] = true;
		const lines = typeof a.lines === "function" ? a.lines(s.state) : a.lines;
		for (const [who, text] of lines) await s.say(who, text);
	},
}));

/** 町の人の、出来事の直後だけの一言。流したら true（ふだんの話は しない）。 */
export const freshTalk = async (s: Story, event: string): Promise<boolean> => {
	const t = FRESH.find(
		(f) =>
			f.event === event && !s.state.flags[`fresh_${f.id}`] && f.when(s.state),
	);
	if (!t) return false;
	s.state.flags[`fresh_${t.id}`] = true;
	await t.run(s);
	return true;
};

/** validate 用：町の人の一言の一覧。 */
export const freshTalks: readonly FreshDef[] = FRESH;
