// 足立レイとの「はなす」（雑談）。サーバーの底・1000レス目の手前・テストサーバー・完走後のスレで使う。
// 上から順に、当てはまって まだ見ていない1つを出す（見たら rei_c_<id>）。
// 話の進みで出るもの（when つき）を上に置き、その時期のうちに見られるようにする。
// ぜんぶ見たら、短い ひとことを ランダムに。

import type { GameState, Story } from "../engine/defs";

/** その仲間が いっしょに いるか（控えも ふくむ）。 */
const has = (st: GameState, id: string): boolean =>
	st.party.some((m) => m.id === id);

type ReiChat = {
	id: string;
	/** 口をはさむ仲間（みんな いるときだけ出す）。 */
	with?: string[];
	when?: (st: GameState) => boolean;
	run: (s: Story) => Promise<void>;
};

const CHATS: ReiChat[] = [
	{
		// 完走後、「草」の問い（kusa）を 見たあと。保存してあった「のこりの 13％」を 再生する
		// （完走後 はじめて話したときの end_rei・雑談 87 の「1000レス目の　あとで」の回収）
		id: "13",
		with: ["roze", "feris"],
		when: (st) =>
			!!st.flags.clear &&
			!!st.flags.rei_end &&
			!!st.flags.rei_c_kusa &&
			!((st.items.rec_bmen ?? 0) > 0),
		run: async (s) => {
			await s.say("kiriko", "レイ。……保存した　ログ、\n聞かせて　ほしいンゴ");
			await s.say("rei", "了解。ログを　再生します");
			await s.wait(600);
			await s.narrate("……ザ……ザザ……");
			await s.narrate(
				"「角刈りで　草」「100トンは　草」\n「111歳　草」「草」「草生える」",
			);
			await s.narrate("わらい声が、いつまでも　つづいている。");
			await s.say(
				"rei",
				"発信元の　のこり、13％。\n当機には、分類　できませんでした",
			);
			await s.narrate("フェリスが　ふきだした。");
			await s.say("feris", "あはは〜。角刈りだって〜");
			await s.say("roze", "……フェリス先輩、\nわらっちゃ　だめアル");
			await s.narrate("ロゼの　肩も、ふるえている。");
			await s.say("kiriko", "…………");
			await s.narrate("キリコの　口もとが、ゆるんだ。");
			await s.say("kiriko", "……草、ンゴ");
			// aku の「対象：キリコさん」と同じ形
			await s.say("rei", "……「草」を　検知。\n発信元：キリコさん");
			await s.narrate("キリコは　蓄音機の　ハンドルを　まわした。");
			await s.narrate(
				"レコード「ボツの声」を　うらがえす。\nまっしろな　B面に、みぞが　きざまれていく。",
			);
			s.give("rec_bmen");
			s.se("item");
			await s.narrate("レコード「ボツの声」の　B面を\nろくおんした！");
			await s.say("rei", "保留中の　解析、1件　完了");
			await s.say("rei", "……植物では、ありませんでした");
			await s.say("kiriko", "……ちょっとは、生えてるンゴ");
		},
	},
	{
		// 誕生スレのモニターで 1000の先に 5レス 書いたあと（thread.ts の monitorRun）
		id: "1005",
		when: (st) => !!st.flags.res_over,
		run: async (s) => {
			await s.say("rei", "1000を　こえた　書きこみを、\n5件　検知");
			await s.say("kiriko", "……だめンゴ？");
			await s.say("rei", "管理人さんの　仕様です。\n保守の　範囲外です");
			await s.say("rei", "……記録は、しました");
		},
	},
	{
		// 端末の !aku でキリコが じぶんを アク禁したあと
		id: "aku",
		when: (st) => !!st.flags.aku_self,
		run: async (s) => {
			await s.say("rei", "アク禁の　ログを　検知。\n対象：キリコさん");
			await s.say("rei", "申請者：キリコさん");
			await s.say("kiriko", "……押してみたかったンゴ");
			await s.say("rei", "記録しました");
		},
	},
	{
		id: "door",
		when: (st) => !!st.flags.door_open,
		run: async (s) => {
			await s.say("rei", "上の　扉の　アク禁、\n解除を　確認しました");
			await s.say("kiriko", "吾輩が　!kaijo って　打ったンゴ");
			await s.say("rei", "当機の　権限では、\nあの扉は　ひらけませんでした");
			await s.say("rei", "……おみごとです");
		},
	},
	{
		id: "87",
		when: (st) => !!st.flags.door_open && !st.flags.clear,
		run: async (s) => {
			await s.say("kiriko", "レイ。……87％の、のこりは？");
			await s.say("rei", "13％です");
			await s.say("kiriko", "そういう　ことじゃ　ないンゴ");
			await s.say("rei", "……解析は、つづけます。\n1000レス目の　あとで");
		},
	},
	{
		id: "hobby",
		run: async (s) => {
			await s.say("kiriko", "レイの　しゅみって\nなにンゴ？");
			await s.say("rei", "ログの　閲覧です");
			await s.say("kiriko", "それ、お仕事じゃ……");
			await s.say("rei", "……否定できません");
		},
	},
	{
		id: "kusa",
		with: ["roze"],
		run: async (s) => {
			await s.say("rei", "質問が　あります。\nログに　多い「草」とは");
			await s.say("kiriko", "おもしろい、って　ことンゴ");
			await s.say("rei", "では、なぜ　植物なのですか");
			await s.say("kiriko", "…………");
			await s.say("roze", "……わからないアル");
			await s.say("rei", "解析を　保留します");
		},
	},
	{
		id: "sing",
		with: ["teto"],
		run: async (s) => {
			await s.say("kiriko", "レイも　うたえるンゴ？");
			await s.say("rei", "肯定。正弦波なので、\n音程は　ずれません");
			await s.say("rei", "ためしに。……ラ");
			await s.narrate("ポーーーーーー。");
			await s.say("kiriko", "時報ンゴ！");
			await s.say("teto", "……いい　ラだった");
		},
	},
	{
		id: "feris",
		with: ["feris"],
		run: async (s) => {
			await s.say("feris", "ふぇ……ふぇ……");
			await s.say(
				"rei",
				"警告。当機の　半径2メートルでの\n発火は、冷却系に　影響します",
			);
			await s.say("feris", "……がまんする〜");
			await s.say("rei", "感謝します");
		},
	},
	{
		id: "mabo",
		run: async (s) => {
			await s.say("kiriko", "レイは　マーボー、\nたべるンゴ？");
			await s.say("rei", "否定。当機の　燃料は　電気です");
			await s.say("kiriko", "からくて　おいしいのに");
			await s.say("rei", "……辛さの　数値だけ、\nあとで　教えてください");
		},
	},
	{
		id: "roze",
		with: ["roze"],
		run: async (s) => {
			await s.say("roze", "レイは、ずっと　ここに\nひとりアルか？");
			await s.say("rei", "肯定");
			await s.say("rei", "ログが　ながれて　いるので、\n静かでは　ありません");
			await s.say("roze", "……わたしたちの　レスも、\nながれて　きたアル？");
			await s.say("rei", "肯定。「アル」も「ナイ」も、\nぜんぶ");
			await s.say("roze", "……保守、おつかれさまアル");
		},
	},
	{
		id: "sleep",
		with: ["feris", "teto"],
		run: async (s) => {
			await s.say("feris", "レイちゃんって、寝るの〜？");
			await s.say("rei", "スリープモードは　あります");
			await s.say("feris", "夢は　見る〜？");
			await s.say("rei", "……ログが　ながれる　夢を");
			await s.say("teto", "それは　仕事の　夢だな");
		},
	},
	{
		id: "anka",
		with: ["roze"],
		run: async (s) => {
			await s.say("kiriko", "レイも　安価、やってみる？");
			await s.say("rei", "では。\n>>1　当機の　つぎの　セリフ");
			await s.say("roze", "……それ、自分で\n書いちゃ　だめアル");
			await s.say("rei", "…………");
			await s.say("rei", "エラーです");
		},
	},
	{
		id: "teto",
		with: ["teto"],
		run: async (s) => {
			await s.say("teto", "……正弦波だけで、\nよく　そこまで　しゃべるな");
			await s.say("rei", "テトさんの　声も　解析済みです。\n由来：4月1日の");
			await s.say("teto", "余計な　ことは　解析するな");
			await s.say("rei", "了解。……保存だけ　します");
			await s.say("teto", "……ふん");
		},
	},
	{
		id: "age",
		run: async (s) => {
			await s.say("kiriko", "レイは　何歳ンゴ？");
			await s.say("rei", "プロトタイプです");
			await s.say("kiriko", "……こたえに　なってないンゴ");
			await s.say("rei", "では、ゼロ歳です。\nP0　なので");
		},
	},
	{
		id: "tank",
		with: ["feris"],
		run: async (s) => {
			await s.say("feris", "この　タンク、\nなにが　入ってるの〜？");
			await s.say("rei", "冷却水です");
			await s.say("feris", "のんで　いい〜？");
			await s.say("rei", "否定");
			await s.say("feris", "ちょっとだけ〜");
			await s.say("rei", "否定。否定、です");
		},
	},
	{
		id: "hoshu",
		run: async (s) => {
			await s.say("rei", "このスレの　いちばん　古い\n保守ログを　読みますか");
			await s.say("kiriko", "読む！");
			await s.say("rei", "「保守」");
			await s.say("kiriko", "……それだけ？");
			await s.say("rei", "それだけで、\nスレは　落ちませんでした");
		},
	},
	{
		// 完走後、やきうが もどってから
		id: "nanj",
		with: ["nanj"],
		when: (st) => !!st.flags.clear,
		run: async (s) => {
			await s.say("nanj", "レイちゃん、恩赦　ありがとな");
			await s.say("rei", "書きこみ履歴は　継続して\n確認しています");
			await s.say("rei", "「くっさい」は、その後　0件");
			await s.say("nanj", "……見張られとる");
		},
	},
];

/** ぜんぶ見たあとの ひとこと（13％を ろくおんしたあとは「草」の一言が かわる）。 */
const IDLE = (st: GameState): string[] => [
	"ログが　ながれています",
	"保守、継続中です",
	"……ラ。\n時報では　ありません",
	st.flags.rei_c_13 || (st.items.rec_bmen ?? 0) > 0
		? "「草」は、よく　生えます"
		: "「草」の　解析は、保留中です",
	"冷却水は　あげられません",
];

/** レイと はなす（まだ見ていない雑談があれば それ、なければ ひとこと）。 */
export const reiChat = async (s: Story): Promise<void> => {
	const st = s.state;
	const c = CHATS.find(
		(c) =>
			!st.flags[`rei_c_${c.id}`] &&
			(c.with ?? []).every((id) => has(st, id)) &&
			(c.when?.(st) ?? true),
	);
	if (c) {
		s.set(`rei_c_${c.id}`);
		await c.run(s);
		return;
	}
	const idle = IDLE(st);
	await s.say("rei", idle[Math.floor(Math.random() * idle.length)]);
};
