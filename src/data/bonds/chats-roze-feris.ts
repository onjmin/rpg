// 仲間との親睦：ロゼ・フェリスの「なかまと　はなす」とプロフィール（bonds-plan.md §2-1・§2-2・§3-1・§3-2）。
// チャットは上から順に調べ、最初に当てはまったものを使う（遅い時期・沈黙を上に、最後はフォールバック）。
import type {
	ChatDef,
	GameState,
	ProfileDef,
	SkitDef,
} from "../../engine/defs";
import { ks, silent } from "../story";

const ch = (st: GameState) => Number(st.flags.ch ?? 0);

export const skits: SkitDef[] = [];

export const chats: ChatDef[] = [
	// ───────── ロゼ ─────────
	{
		// R1 沈黙（第四章・声が出ない）
		who: "roze",
		when: (st) => silent(st),
		run: async (s) => {
			await s.say("roze", "足が　うすいのは、わたしと\nおそろいアル");
			await s.say(
				"roze",
				"……でも、キリコのは　すぐ　もどるアル。\nわたしが　保証するアル",
			);
			await ks(s, "……うん");
		},
	},
	{
		// R2 扉のあと（1000レス目の手前）
		who: "roze",
		when: (st) => !!st.flags.door_open,
		run: async (s) => {
			await s.say("roze", "もうすぐ　1000レス目アル");
			await s.say("roze", "完走の　景色は、何回　見ても\nいいものアル");
			await s.say("kiriko", "いっしょに　見よう");
			await s.say("roze", "……もちろんアル");
		},
	},
	{
		// R3 終章・サーバーの底
		who: "roze",
		when: (st) => ch(st) >= 5,
		run: async (s) => {
			await s.say(
				"roze",
				"サーバーの　中は、電子が\nびゅんびゅん　走ってるアル",
			);
			await s.say("roze", "素粒子の　庭アル。\n……ちょっと　楽しいアル");
			await s.say("kiriko", "ロゼ先輩、目が　きらきらンゴ");
		},
	},
	{
		// R4 録音のあと（テト加入）
		who: "roze",
		when: (st) => !!st.flags.rec,
		run: async (s) => {
			await s.say("roze", "キリコの　声、もどって　よかったアル");
			await s.say(
				"roze",
				"テト先輩は　2008年生まれ。\n安価ボカロの　大・大先輩アル",
			);
			await s.say("kiriko", "ロゼ先輩の　先輩ンゴ？");
			await s.say("roze", "そうアル。頭が　あがらないアル");
		},
	},
	{
		// R5 第三章・スタジアム
		who: "roze",
		when: (st) => ch(st) === 3,
		run: async (s) => {
			await s.say(
				"roze",
				"野球は　よく　わからないアル。\n……でも、応援なら　できるアル",
			);
			await s.say("roze", "フレー、フレー、アル");
			await s.say("kiriko", "フレー、フレー、ンゴ");
		},
	},
	{
		// R6 B2 のあと・町（フェリス加入）
		who: "roze",
		when: (st) => !!st.flags.b2,
		run: async (s) => {
			await s.say(
				"roze",
				"フェリス先輩は　なんJ時代からの\n大先輩アル。あこがれアル",
			);
			await s.say("kiriko", "ロゼ先輩にも　先輩が　いるんだ");
			await s.say(
				"roze",
				"先輩の　先輩の　そのまた先輩……\nみんな　つながってるアル",
			);
		},
	},
	{
		// R7 第二章・過去ログ倉庫
		who: "roze",
		when: (st) => !!st.flags.b1,
		run: async (s) => {
			await s.say("roze", "過去ログ倉庫は　ひんやりして\n落ちつくアル");
			await s.say("kiriko", "おばけだから？");
			await s.say(
				"roze",
				"……ちがうアル。夏は　すずしい\nところが　いいアル。常識アル",
			);
		},
	},
	{
		// R8 フォールバック（ロゼ加入〜B1）
		who: "roze",
		run: async (s) => {
			await s.say(
				"roze",
				"わたしは　群馬出身アル。\n……場所？　関東の　左上アル",
			);
			await s.say("roze", "キリコは　どこ出身アル？");
			await s.say("kiriko", "おんJンゴ");
			await s.say("roze", "……そうだったアル");
		},
	},

	// ───────── フェリス ─────────
	{
		// F1 沈黙（第四章・声が出ない）
		who: "feris",
		when: (st) => silent(st),
		run: async (s) => {
			await s.say(
				"feris",
				"私も　UTAUの　声は　ないけど、\nちゃんと　ここに　いるよ〜",
			);
			await s.say("feris", "キリコちゃんも、ちゃんと　いるよ〜");
			await ks(s, "……うん");
		},
	},
	{
		// F2 扉のあと（1000レス目の手前）
		who: "feris",
		when: (st) => !!st.flags.door_open,
		run: async (s) => {
			await s.say("feris", "1000レス目って、いちばん上？\nいちばん下？");
			await s.say("kiriko", "どっち……？");
			await s.say("feris", "どっちでも　飛んでいくよ〜。\n私、鳥だから〜");
		},
	},
	{
		// F3 終章・サーバーの底
		who: "feris",
		when: (st) => ch(st) >= 5,
		run: async (s) => {
			await s.say("feris", "ここ、過去ログ倉庫より\nもっと　下だね〜");
			await s.say("feris", "でも　だいじょうぶ〜。\nageるのは　得意だから〜");
			await s.say("kiriko", "不死鳥は　しずまないンゴ");
		},
	},
	{
		// F4 録音のあと
		who: "feris",
		when: (st) => !!st.flags.rec,
		run: async (s) => {
			await s.say(
				"feris",
				"キリコちゃんの　声、もどったね〜。\nうれしくて　くしゃみ　出そう……",
			);
			await s.say("kiriko", "い、今は　出さないでンゴ！");
			await s.say("feris", "……ふぇ。セーフ〜");
		},
	},
	{
		// F5 第三章・スタジアム
		who: "feris",
		when: (st) => ch(st) === 3,
		run: async (s) => {
			await s.say("feris", "やきうくんたちと、また　勝負〜");
			await s.say(
				"feris",
				"今度は　負けないよ〜。\n……勝たなくても　いいけど〜",
			);
			await s.say("kiriko", "どっちンゴ？");
			await s.say("feris", "たのしければ　いいかな〜");
		},
	},
	{
		// F6 フォールバック（B2 のあと町に浮上してから）
		who: "feris",
		run: async (s) => {
			await s.say("feris", "あらためて、フェリスです〜");
			await s.say("feris", "タンクトップの「炎」はね、\nほのおの　炎だよ〜");
			await s.say("kiriko", "……そのまま");
			await s.say(
				"feris",
				"相方は　ヒナリーちゃん。\n避難Jを　研究してるんだ〜",
			);
			await s.say("kiriko", "……あいさつしか　聞いたこと\nないンゴ");
		},
	},
];

export const profiles: ProfileDef[] = [
	{
		who: "roze",
		pages: [
			{
				bond: 0,
				title: "束音ロゼ",
				lines: [
					"束音（たばね）ロゼ。24歳、群馬出身。",
					"2024年7月1日、おんJの安価スレで生まれた。",
					"好きな食べ物は麻婆豆腐。趣味は素粒子物理学。",
					"性格は常識人。語尾は「〜アル」。",
					"身長165cm、体重0。足先はすうっと消えている。",
				],
			},
			{
				bond: 2,
				title: "アル？ナイ！",
				lines: [
					"作る途中で日付が変わり「キリがいい」から7月1日生まれに。",
					"名前は投票で決まった。本名はローゼンフェルド。",
					"自己紹介ソング「アルアル×ナイナイ」の歌詞は、スレで広まった。",
					"髪は……ナイ。ツーサイドアップのカツラは、みんなの声で付いた。",
					"エメラルドの瞳。においはフローラル。",
				],
			},
			{
				bond: 4,
				title: "ロゼのひみつ",
				lines: [
					"デビュー曲は「らいおん」。",
					"公式がいちど無くなったあとも、覚えていた人たちが歌わせた。",
					"2024年の年末には、ロゼの歌「獅子舞」が生まれた。",
					"2026年7月、「束音ロゼー華ー」に転生。原因は激辛麻婆豆腐……らしい。",
					"転生してからは「アル」をひかえめにしている。今日は前世の格好。",
					"キリコの名前安価で「束音ロゼでどうや？」と言われたことがある。",
				],
			},
		],
	},
	{
		who: "feris",
		pages: [
			{
				bond: 0,
				title: "フェリス",
				lines: [
					"なんJ生まれの、不死鳥の女の子。",
					"2005年12月29日、なんJの一発ネタから生まれた。",
					"「くしゃみ出そう…ふぇ…ふぇ……フェニックス！」",
					"鳥の帽子、暖色の髪、背中の翼、「炎」の字のタンクトップ。",
					"一人称は「私」。やきう民のことは「やきうくん」と呼ぶ。",
					"UTAUの声はないので、うたえない。くしゃみは出る。",
				],
			},
			{
				bond: 2,
				title: "不死鳥のあゆみ",
				lines: [
					"2006年、人のすがたのAAができた。",
					"2009年、やきう民とのマスコット争いに負けて、すがたを消した。",
					"2015年4月、おんJで再発見。夏の「フェリスの絵を描くスレ」で完全復活。",
					"絵スレは「1羽目、2羽目……」と数える。",
					"2024年に再ブーム。2025年の年末、二十歳のお誕生日を祝ってもらった。",
				],
			},
			{
				bond: 4,
				title: "フェリスのお勉強",
				lines: [
					"やきうくんの問題に、斜め上の正解を返す「お勉強シリーズ」が名物。",
					"「やきう君が追いつくのは何分後？」→「追いつかれません」",
					"相方は避難Jのヒナリー。白衣に青い髪で、氷っぽいと言われる。",
					"むかしのおんJRPG『OPEN』では、ムッジェにさらわれるヒロインだった。",
					"「鳥の帽子・暖色の髪・羽」があれば、アレンジは自由。",
				],
			},
		],
	},
];
