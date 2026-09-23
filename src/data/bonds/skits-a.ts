// 仲間との親睦：ひとやすみ会話（第一章〜第三章＝B3 まで。a_mabo だけ終章まで）。
// 配列の順番＝優先度（蓄音機・メニューでは、まだ見ていない先頭の1つが流れる）。
// 早い時期 → 遅い時期 の順に並べる。設計は bonds-plan.md §1-2。
// ただし n_nighter（おんJ民のおでかけの予告）だけは先頭に置く（蓄音機では先頭の1つしか流れないため）。
import { bondOf } from "../../engine/bonds";
import type {
	ChatDef,
	GameState,
	ProfileDef,
	SkitDef,
} from "../../engine/defs";
import { knows, silent } from "../story";

const ch = (st: GameState) => Number(st.flags.ch ?? 0);

export const skits: SkitDef[] = [
	// 0. おんJ民のおでかけ（外野席でナイター）の予告。アク禁で行けなくなる前に、
	//    シーズンの終わりという理由で知らせる（F5 の予告②）。B2〜B3
	{
		id: "n_nighter",
		title: "今夜の　ナイター",
		members: ["nanj"],
		when: (st) =>
			!!st.flags.b2 &&
			!st.flags.b3 &&
			!st.flags.date_nanj &&
			bondOf(st, "nanj") >= 3,
		run: async (s) => {
			await s.say("nanj", "ナイター、今シーズンは\n今夜で　しまいなんや");
			await s.say("kiriko", "……外野席、行ってみたいンゴ");
			await s.say("nanj", "ほな、「なかま」から\nワイに　声かけてや");
		},
	},
	// 1. 名前の漢字（町の誤字看板から）。A〜C
	{
		id: "a_nazuke",
		title: "蓄と　畜と　ちくね",
		members: ["nanj"],
		when: (st) => ch(st) >= 1 && !st.flags.b2,
		run: async (s) => {
			await s.say(
				"nanj",
				"町の　看板、見たか？\n「畜音キリコ」って　書いとったで",
			);
			await s.say("kiriko", "畜じゃないンゴ。蓄ンゴ！");
			await s.say("kiriko", "蓄音機の　蓄。\n含蓄の　蓄。");
			await s.say("nanj", "がんちく……むずかしい　ことば\n知っとるな");
			await s.say("kiriko", "名前に　書いてあるから　覚えた");
			await s.say(
				"nanj",
				"名前が　出たとき、「面白味がない」\nとか　言われとったけどな",
			);
			await s.say("kiriko", "吾輩は　気に入ってる。\nちくね。……ちくね、ンゴ");
			await s.say("nanj", "……せやな。ええ名前や");
		},
	},
	// 2. 山吹色の肌と語尾「ンゴ」は、J民とおそろい。A〜D
	{
		id: "a_yamabuki",
		title: "おそろいの　山吹色",
		members: ["nanj"],
		when: (st) => ch(st) >= 1 && !st.flags.b3,
		run: async (s) => {
			await s.say("nanj", "キリコの　肌の色、ワイらと\nおんなじ　山吹色やな");
			await s.say("kiriko", "おんJ生まれの　あかしンゴ");
			await s.say(
				"nanj",
				"語尾の　ンゴも、もとは\nワイらが　よう使う　ことばやで",
			);
			await s.say("kiriko", "吾輩の語尾は、おさがりンゴ？");
			await s.say("nanj", "おさがりやない。おそろいや");
			await s.say(
				"nanj",
				"ところで　その前髪、\n片目　ちゃんと　見えとるんか？",
			);
			await s.say("kiriko", "見えてる。……半分くらい");
			await s.say("nanj", "草");
		},
	},
	// 3. おんJ民は UTAU の声がナイ（うたえない）→ 応援を蓄音機にためる。B〜D
	{
		id: "a_koe_aru_nai",
		title: "声は　アル？ナイ！",
		members: ["nanj", "roze"],
		when: (st) => !!st.flags.roze_in && !st.flags.b3,
		run: async (s) => {
			await s.say("roze", "わたしは　UTAUの　声が　アルから\n歌えるアル");
			await s.say(
				"nanj",
				"ワイは　UTAUの　声が　ナイ。\nせやから　うたえへんのや",
			);
			await s.say("roze", "声は　アル？");
			await s.say("nanj", "……ナイ！　そのぶん\nフルスイングと　応援で　いくで");
			await s.say("kiriko", "じゃあ、その応援を\n蓄音機に　ためよう");
			await s.say("nanj", "お、おう。……キリコ、がんばれ！");
			await s.narrate("蓄音機に「がんばれ」が　きざまれた。");
			// ちくおんリプレイ（Lv5）をまだ覚えていなければ、これからの約束にする
			await s.say(
				"kiriko",
				knows(s.state, "kiriko", "replay")
					? "ちくおんリプレイの「がんばれ」は\nおんJ民の　声に　なったンゴ！"
					: "この「がんばれ」、いつか\nうたにして　鳴らすンゴ！",
			);
		},
	},
	// 4. ふたりとも日付が変わってから誕生日が決まった。B〜D
	{
		id: "a_birthday",
		title: "夜ふかしの　誕生日",
		members: ["roze", "nanj"],
		when: (st) => !!st.flags.roze_in && !st.flags.b3,
		run: async (s) => {
			await s.say(
				"roze",
				"わたしの　誕生日は　7月1日アル。\n作ってる　途中で　日付が　変わったアル",
			);
			await s.say("roze", "キリが　いいから、7月1日アル");
			await s.say("kiriko", "吾輩も　日付が　変わってから\n誕生日が　決まった");
			await s.say(
				"nanj",
				"スレが　立ったのは　8月17日の夜。\n決まったんは　18日の　深夜1時すぎや",
			);
			await s.say("roze", "ふたりとも、夜ふかしの　子アルね");
			await s.say("nanj", "安価スレは　深夜が　本番やからな");
			await s.say("kiriko", "吾輩、まだ　眠くないンゴ");
			await s.say("roze", "……もう　寝るアル。常識アル");
		},
	},
	// 5. 麻婆豆腐と素粒子（ニュートリノ）。B〜H（ロゼとキリコだけがしゃべる）
	{
		id: "a_mabo",
		title: "麻婆豆腐と　素粒子",
		members: ["roze"],
		when: (st) => !!st.flags.roze_in && !silent(st) && !st.flags.clear,
		run: async (s) => {
			await s.say(
				"roze",
				"麻婆豆腐の　からさには、\n素粒子の　ロマンが　あるアル",
			);
			await s.say("kiriko", "……どういう　ことンゴ？");
			await s.say("roze", "……わたしにも　よく　わからないアル");
			await s.say(
				"roze",
				"でも　ニュートリノは　ほんとアル。\n毎秒　何百兆個も　体を　すりぬけるアル",
			);
			await s.say("kiriko", "34キロの　吾輩も？");
			await s.say(
				"roze",
				"0キロの　わたしも、アル。\nふたり　あわせて　34キロアル",
			);
			await s.say("kiriko", "麻婆豆腐を　食べても　0キロンゴ？");
			await s.say("roze", "……そこは　ひみつアル");
		},
	},
	// 6. 「落ちた」スレは消えていない。完走は「しまわれる」。C（過去ログ倉庫）
	{
		id: "a_kakolog",
		title: "落ちるのと　しまうの",
		members: ["nanj", "roze"],
		when: (st) => !!st.flags.b1 && !st.flags.b2,
		run: async (s) => {
			await s.say(
				"nanj",
				"おんJの　スレは、dat落ち　せえへん。\nほんまは　消えへんのや",
			);
			await s.say(
				"nanj",
				"勢い欄から　見えなくなるだけ。\nそれを「落ちた」って　言うんや",
			);
			await s.say(
				"roze",
				"わたしの　2024年の　スレも、\nどこかで　ねむってるアル",
			);
			await s.say("nanj", "探したろか？");
			await s.say(
				"roze",
				"……いいアル。覚えてる人が　いるなら\nそれで　じゅうぶんアル",
			);
			await s.say("kiriko", "吾輩のスレも、いつか\n過去ログ倉庫に？");
			await s.say(
				"nanj",
				"完走したら、胸はって　しまわれるんや。\n落ちるのとは　ちがうで",
			);
			await s.say("kiriko", "じゃあ、胸はれる　スレに　するンゴ");
		},
	},
	// 7. 釣りも囲碁も安価も「待つ」もの。C〜D
	{
		id: "a_matsu",
		title: "待つのは　とくい",
		members: ["nanj", "roze"],
		when: (st) => !!st.flags.b1 && !st.flags.b3,
		run: async (s) => {
			await s.say(
				"roze",
				"釣りと　囲碁。キリコの　趣味は\nどっちも　待つ　趣味アルね",
			);
			await s.say("kiriko", "氷に　穴を　あけて、\nワカサギを　じっと　待つ");
			await s.say("roze", "わたしは　麻婆豆腐は　待てないアル");
			await s.say(
				"nanj",
				"安価も　待つもんやで。\n……ワイは　つい　ksk（加速）するけど",
			);
			await s.say("kiriko", "吾輩の　名前も、>>101まで\nちゃんと　待ったンゴ");
			await s.say("nanj", "生まれる前から　待っとったんか。草");
			await s.say("roze", "えらいアル。……ちょっと　こわいアル");
		},
	},
];

export const chats: ChatDef[] = [];
export const profiles: ProfileDef[] = [];
