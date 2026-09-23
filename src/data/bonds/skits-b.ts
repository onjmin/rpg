// 仲間との親睦：ひとやすみ会話（第三章〜終章・録音後・♥特別会話）。
// 配列の順番＝優先度（蓄音機・メニューでは先頭の1つが流れる）。
// 早い時期 → 遅い時期 → ♥特別会話 の順に並べる。

import { bondOf } from "../../engine/bonds";
import type {
	ChatDef,
	GameState,
	ProfileDef,
	SkitDef,
} from "../../engine/defs";
import { ks, silent } from "../story";

const ch = (st: GameState) => Number(st.flags.ch ?? 0);

export const skits: SkitDef[] = [
	// ── D：B2〜B3（おんJ民・ロゼ・フェリス） ──
	{
		id: "b_nai_gumi",
		title: "うたえない　ふたり",
		members: ["feris", "nanj"],
		when: (st) => !!st.flags.b2 && !st.flags.b3,
		run: async (s) => {
			await s.say("feris", "キリコちゃん、私ね〜\nUTAUの　声、ないんだ〜");
			await s.say("nanj", "ワイもや。声ナイ組、ふたりめやな");
			await s.say("feris", "だから　うたえないけど、\nくしゃみなら　出るよ〜");
			await s.say("nanj", "ワイは　フルスイングで　いくで");
			await s.say("kiriko", "ふたりの声も、蓄音機に　ためる！");
			await s.say("feris", "じゃあ　いくよ〜。ふぇ……ふぇ……\n……フェニックス！");
			await s.narrate("蓄音機が　ちょっと　こげた。");
			await s.say("nanj", "草ァ！");
		},
	},
	{
		id: "b_senpai",
		title: "先輩で　後輩",
		members: ["roze", "feris"],
		when: (st) => !!st.flags.b2 && !st.flags.balus_lost,
		run: async (s) => {
			await s.say("roze", "フェリス先輩は　2005年生まれアル。\n大先輩アル");
			await s.say("feris", "うん〜。でも　私、二十歳だよ〜");
			await s.say("roze", "わたしは　24歳アル");
			await s.say("kiriko", "吾輩は　25歳");
			await s.say(
				"feris",
				"生まれたのは　キリコちゃんが\nいちばん　あとなのにね〜",
			);
			await s.say("kiriko", "いちばん　後輩で、\nいちばん　年上ンゴ……？");
			await s.say("feris", "じゃあ　キリコちゃんは\n先輩で　後輩かな〜");
			await s.say("roze", "……ややこしいアル");
		},
	},
	{
		id: "b_obenkyo",
		title: "フェリスの　お勉強",
		members: ["nanj", "feris", "roze"],
		when: (st) => ch(st) >= 3 && !st.flags.b3,
		run: async (s) => {
			await s.say("nanj", "ほな　ナイターの前に　お勉強や");
			await s.say(
				"nanj",
				"ワイが　ホームラン　3本、\nフェリスが　2本。あわせて？",
			);
			await s.say("feris", "0本だよ〜");
			await s.say("nanj", "なんでや！");
			await s.say("feris", "私、飛べるから〜。\nぜんぶ　キャッチしちゃう〜");
			await s.say("roze", "算数じゃ　ないアル。\n……でも　ちょっと　正解アル");
			await s.say("nanj", "ほな　キリコ。\n完走まで　あと何レス？");
			await s.say("kiriko", "みんなで　書けば、すぐンゴ");
		},
	},

	// ── E：沈黙（ロゼ・フェリス）。キリコは ks() で「かきこみ」 ──
	{
		id: "b_kakikomi",
		title: "かきこみで　いい",
		members: ["roze", "feris"],
		when: (st) => silent(st) && !st.flags.teto_met,
		run: async (s) => {
			await s.say("roze", "……しゃべらなくて　いいアル");
			await s.say("feris", "書きこみなら　できるかな〜？");
			await ks(s, "……うん");
			await s.say("feris", "じゃあ、ンゴって　書いてみて〜");
			await ks(s, "……ンゴ");
			await s.say("feris", "ほら〜。キリコちゃんの　ンゴだよ〜");
			await s.say(
				"roze",
				"書きこめば、ちゃんと　レスアル。\n……マッマの　ところへ　行くアル",
			);
		},
	},

	// ── F〜H：録音後（ロゼ・フェリス・テト） ──
	{
		id: "b_teto_age",
		title: "年上の　後輩",
		members: ["feris", "teto"],
		when: (st) => !!st.flags.teto_in && !silent(st) && !st.flags.clear,
		run: async (s) => {
			await s.say(
				"feris",
				"テトちゃんは　2008年生まれ？\n私、2005年〜。私が　先輩かな〜",
			);
			await s.say("teto", "……ボクは　31歳だぞ");
			await s.say("feris", "私は　二十歳だよ〜");
			await s.say("kiriko", "年上の　後輩……？");
			await s.say("teto", "それに　キメラだから\n15.5歳って　説も　ある");
			await s.say("feris", "じゃあ　テトちゃん、\nいちばん　年下だね〜");
			await s.say("teto", "……君たちは　じつに　馬鹿だな");
			await s.say("kiriko", "先輩、ちょっと　うれしそうンゴ");
		},
	},
	{
		id: "b_pan_mabo",
		title: "フランスパンに　麻婆",
		members: ["teto", "roze"],
		when: (st) => !!st.flags.teto_in && !silent(st) && !st.flags.clear,
		run: async (s) => {
			await s.say(
				"roze",
				"テト先輩、フランスパンに\n麻婆豆腐を　のせてみるアル",
			);
			await s.say("teto", "……正気か？");
			await s.say("roze", "中華と　フランスの　衝突実験アル。\n素粒子アル");
			await s.say("teto", "……もぐ。……わるくない");
			await s.say("kiriko", "吾輩は　ワカサギを　のせるンゴ");
			await s.say("roze", "それは　アル？");
			await s.say("teto", "ナイ");
			await s.say("teto", "のせるなら　ノルウェーの　サーモンだ");
		},
	},
	{
		id: "b_anka_umare",
		title: "安価生まれの会",
		members: ["teto", "roze", "feris"],
		when: (st) => !!st.flags.teto_in && !silent(st) && !st.flags.clear,
		run: async (s) => {
			await s.say(
				"teto",
				"ボクは　2008年、VIPの　安価生まれ。\nエイプリルフールの　ウソさ",
			);
			await s.say(
				"roze",
				"わたしは　2024年、おんJの　安価アル。\n名前は　投票で　決まったアル",
			);
			await s.say("feris", "私は　2005年、なんJの\nくしゃみだよ〜");
			await s.say("kiriko", "くしゃみ！？");
			await s.say("kiriko", "吾輩は　2026年、おんJの　安価ンゴ");
			await s.say(
				"teto",
				"ウソに、安価に、くしゃみか。\n……ろくな　生まれじゃないな",
			);
			await s.say("roze", "でも、みんな　ここに　いるアル");
			await s.say("teto", "……ふん。そういう　ことさ");
		},
	},

	// ── G〜H：終章（サーバー） ──
	{
		id: "b_rusuban",
		title: "るすばんの　名無し",
		members: ["roze", "feris", "teto"],
		when: (st) => !!st.flags.onsha_req && !st.flags.onsha,
		run: async (s) => {
			await s.say("feris", "やきうくん、元気かな〜");
			await s.say("teto", "その　おんJ民って、どんな　やつさ");
			await s.say("kiriko", "吾輩の　名付け親。\n……自称ンゴ");
			await s.say("teto", "自称かよ");
			await s.say("roze", "勢い欄の前で、ずっと\n見張ってくれてるアル");
			await s.say("teto", "恩赦は　レイが　申請してる。\n……間に合わせるぞ");
			await s.say("kiriko", "1000レス目は、みんなで　見る");
		},
	},
	{
		id: "b_rei_sine",
		title: "正弦波と　吐息",
		members: ["teto", "feris"],
		when: (st) => !!st.flags.rei_met && !st.flags.clear,
		run: async (s) => {
			await s.say(
				"teto",
				"レイの声は　正弦波から　できてる。\nいちばん　まっすぐな　音さ",
			);
			await s.say("feris", "まっすぐ〜。\nフランスパンみたい〜");
			await s.say("teto", "……フランスパンは　ちょっと\n曲がってる");
			await s.say("kiriko", "吾輩の声は、吐息が　多いンゴ");
			await s.say(
				"teto",
				"子音が　長くて、吐息が　多い。\nゆっくりの　歌に　あう声だ",
			);
			await s.say("teto", "……わるくないよ");
			await s.say("feris", "私は　くしゃみの　声〜");
			await s.say("teto", "それは　声じゃなくて　火だ");
		},
	},
	{
		id: "b_meigen",
		title: "名言の　れんしゅう",
		members: ["roze", "feris", "teto"],
		when: (st) => !!st.flags.door_open && !st.flags.clear,
		run: async (s) => {
			await s.say("kiriko", "名言チャレンジ、その4……");
			await s.say("roze", "待つアル。今は　とっておくアル");
			await s.say("feris", "1000レス目で　言えば　いいよ〜");
			await s.say("kiriko", "でも、まだ　なにも\n思いついて　ない");
			await s.say("teto", "言いたいことが　できたら、\nそれが　そうさ");
			await s.say(
				"roze",
				"わたしの　アル？ナイ！も、\n最初は　ただの　ノリだったアル",
			);
			await s.say("feris", "私なんて　くしゃみだよ〜");
			await s.say("kiriko", "……うん。とっておくンゴ");
		},
	},

	// ── ♥特別会話（♥4 で出る。見ると ♥5） ──
	{
		id: "sp_nanj",
		title: "♥ 名無しの　声",
		members: ["nanj"],
		when: (st) =>
			bondOf(st, "nanj") >= 4 && !!st.flags.b1 && !st.flags.balus_lost,
		run: async (s) => {
			await s.say(
				"nanj",
				"白状するわ。>>101を　書いたんは\nワイやない。ほんまに　自称や",
			);
			await s.say("kiriko", "……知ってた");
			await s.say("nanj", "知っとったんかい！");
			// 序章でスレをひやかしに来た（thread.ts opening）のと食いちがわないように
			await s.say("nanj", "ワイは　あの夜、スレを\nひやかしに　来た　名無しや");
			await s.say(
				"kiriko",
				"ひやかしでも、来てくれた。\nそれから、ずっと　となりに　いたンゴ",
			);
			await s.say(
				"nanj",
				"……サンガツ。けど　名無しの\n代わりなんて、なんぼでも　おるで",
			);
			await s.say(
				"kiriko",
				"この声は　ひとりだけ。\n蓄音機が　ちゃんと　覚えてるンゴ",
			);
			await s.say("nanj", "……ほな、しっかり　ためといてや");
		},
	},
	{
		id: "sp_roze",
		title: "♥ ローゼンフェルド",
		members: ["roze"],
		when: (st) =>
			bondOf(st, "roze") >= 4 &&
			!!st.flags.b2 &&
			!silent(st) &&
			!st.flags.clear,
		run: async (s) => {
			await s.say("roze", "キリコ、わたしの　本名、\n知ってるアル？");
			await s.say("kiriko", "束音ロゼ……じゃないの？");
			await s.say("roze", "ローゼンフェルド、アル");
			await s.say("kiriko", "ろ、ローゼン……\nかっこいいンゴ！");
			await s.say("roze", "長いから、ロゼで　いいアル");
			await s.say(
				"roze",
				"この　カツラも、みんなが\n「つけたら？」って　くれたアル",
			);
			await s.say(
				"roze",
				"わたしは、もらった　ものばかりアル。\nだから、後輩に　わたす番アル",
			);
			await s.say("kiriko", "……ロゼ先輩の　後輩で、\nよかったンゴ");
		},
	},
	{
		id: "sp_feris",
		title: "♥ 12月29日",
		members: ["feris"],
		when: (st) => bondOf(st, "feris") >= 4 && !silent(st) && !st.flags.clear,
		run: async (s) => {
			await s.say(
				"feris",
				"私の　誕生日、12月29日なんだ〜。\n年末だから、みんな　いそがしくて〜",
			);
			await s.say("kiriko", "忘れられちゃう？");
			await s.say(
				"feris",
				"……でもね、おととしも　去年も\nみんな　お祝い　してくれたよ〜",
			);
			await s.say(
				"feris",
				"私の　絵を描く　スレもね、\n1羽目、2羽目って　数えるんだ〜",
			);
			await s.say("kiriko", "鳥だから　羽ンゴ！");
			await s.say(
				"kiriko",
				"毎年12月29日、吾輩が　蓄音機で\n「おめでとう」を　鳴らす！",
			);
			await s.say("feris", "じゃあ　私は　8月18日に\nくしゃみ　するね〜");
			await s.say("kiriko", "……火が　出るンゴ");
		},
	},
	{
		id: "sp_teto",
		title: "♥ 0401と　0818",
		members: ["teto"],
		when: (st) =>
			bondOf(st, "teto") >= 4 && !!st.flags.teto_in && !st.flags.clear,
		run: async (s) => {
			await s.say("teto", "君、最初に　歌う　カバー曲は\n決めてるのか？");
			await s.say("kiriko", "まだ。うた、あんまり\n知らないンゴ");
			await s.say("teto", "……ボクの歌に　しなよ。\n「オーバーライド」とか");
			await s.say(
				"kiriko",
				"じゃあ　2曲目は\n「好きな惣菜発表ドラゴン」ンゴ！",
			);
			await s.say(
				"teto",
				"べ、別に　売りこんだわけじゃない。\n……いい曲だから　だ",
			);
			await s.say(
				"teto",
				"ボクの腕の　0401は、ウソの日の　数字。\n君なら　0818、だな",
			);
			await s.say("kiriko", "吾輩も　腕に　書く！");
			await s.say("teto", "……油性ペンは　やめとけ");
		},
	},
];

export const chats: ChatDef[] = [];
export const profiles: ProfileDef[] = [];
