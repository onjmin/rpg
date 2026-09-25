// 仲間との親睦：テトとおんJ民の「なかまと はなす」とプロフィール。
// チャットは上から順に調べ、最初に当てはまったものを使う（上ほど遅い時期・特別な条件、最後がフォールバック）。
// おんJ民は第四章で抜けるので、序章〜第三章の分と、クリア後に控えで もどってからの分（N0）。
// テトは録音後（第四章）〜終章と、クリア後。

import { bondOf } from "../../engine/bonds";
import type {
	ChatDef,
	GameState,
	ProfileDef,
	SkitDef,
	Story,
} from "../../engine/defs";

const ch = (st: GameState) => Number(st.flags.ch ?? 0);

/**
 * おでかけ（外野席でナイター）の予告。アク禁で行けなくなる前に知らせる（F5 の予告③）。
 * 別のチャットにすると N1・N2 が見られなくなるので、その最後に1行だけ足す。
 */
const nighterNotice = async (s: Story): Promise<void> => {
	const st = s.state;
	if (
		st.flags.b2 &&
		!st.flags.b3 &&
		!st.flags.date_nanj &&
		bondOf(st, "nanj") >= 3
	)
		await s.say("nanj", "外野席、今夜が　最後の\nチャンスやで");
};

export const skits: SkitDef[] = [];

export const chats: ChatDef[] = [
	// ───────── テト ─────────
	{
		// T0' クリア後・管理人に会ったあと、おんJ民が まだ もどっていないとき
		// （誕生スレの おんJ民。テトを前に出して話すと もどる。thread.ts の end_nanj）
		who: "teto",
		when: (st) =>
			!!st.flags.clear && !!st.flags.satoru_met && !st.flags.nanj_back,
		run: async (s) => {
			await s.say("teto", "……あの　名無し、さっきから\nこっちばかり　見てるな");
			await s.say("kiriko", "おんJ民ンゴ");
			await s.say("teto", "……ふうん");
		},
	},
	{
		// T0 クリア後（管理人室の予告）
		who: "teto",
		when: (st) => !!st.flags.clear,
		run: async (s) => {
			await s.say(
				"teto",
				"……スレの　下の扉、だれかが\nキーボードを　たたいてるな",
			);
			await s.say("kiriko", "見に　いくンゴ？");
			await s.say("teto", "ボクは　べつに。……君が　行くなら");
		},
	},
	{
		// T1 終章・扉のあと
		who: "teto",
		when: (st) => !!st.flags.door_open,
		run: async (s) => {
			await s.say("teto", "……最後だ。のどの　調子は？");
			await s.say("kiriko", "ばっちりンゴ！");
			await s.say(
				"teto",
				"ふん。歌は　苦手だけど、\nマイクなら　どんなのでも　握るさ",
			);
		},
	},
	{
		// T2 終章・扉の前
		who: "teto",
		when: (st) => ch(st) >= 5,
		run: async (s) => {
			await s.say("teto", "ボクの声も、むかし　UTAUで\nみんなに　配られた");
			await s.say(
				"teto",
				"いまも　どこかで　鳴ってるよ。\nボクの　知らない　歌でね",
			);
			await s.say("kiriko", "吾輩の声も、いつか\n鳴る？");
			await s.say("teto", "……鳴るさ。ボクが　保証してやる");
		},
	},
	{
		// T3 録音後・なかよし度 3 以上
		who: "teto",
		when: (st) => bondOf(st, "teto") >= 3,
		run: async (s) => {
			await s.say(
				"teto",
				"……発声練習、つきあってやる。\nあ・え・い・う・え・お・あ・お",
			);
			await s.say("kiriko", "あ・え・い・う……先輩、\nやさしいンゴ");
			await s.say("teto", "う、うるさい。\nボクの　のどの　ついでだ");
		},
	},
	{
		// T4 録音後（第四章）— フォールバック
		who: "teto",
		run: async (s) => {
			await s.say("teto", "フランスパン、食うか？\n……べ、別に　余っただけだ");
			await s.say("kiriko", "34キロだから、いっぱい　食べる");
			await s.say(
				"teto",
				"……ちゃんと　食えよ。\nちなみに　ボクの　得意なことは",
			);
			await s.say("teto", "レンタルDVDの　延長だ");
			await s.say("kiriko", "それ、得意って　言うンゴ？");
		},
	},

	// ───────── おんJ民 ─────────
	{
		// N0 クリア後（控えに もどってから。thread.ts の end_nanj）
		who: "nanj",
		when: (st) => !!st.flags.clear,
		run: async (s) => {
			await s.say("nanj", "控えって、けっこう\nよう　見えるんやな");
			await s.say("kiriko", "スタンド側、ンゴ？");
			await s.say("nanj", "せや。……特等席や");
		},
	},
	{
		// N1 第三章・スタジアム
		who: "nanj",
		when: (st) => ch(st) === 3,
		run: async (s) => {
			await s.say("nanj", "ここは　ワイらの　ホームや！");
			await s.say(
				"nanj",
				"フェリスとの　2009年の　つづき、\nしっかり　見届けたるで",
			);
			await s.say("kiriko", "吾輩も　見届けるンゴ");
			await nighterNotice(s);
		},
	},
	{
		// N2 B2 のあと（第二章・町）
		who: "nanj",
		when: (st) => !!st.flags.b2,
		run: async (s) => {
			await s.say("nanj", "今夜は　ナイターや！");
			await s.say("nanj", "実況スレは　名前欄に\n試合の　スコアが　出るんやで");
			await s.say("kiriko", "名無しの　となりに\nスコアが　出る……？");
			await s.say(
				"nanj",
				"せや。名無しが　何人　おっても、\nスコアだけは　おんなじや",
			);
			await nighterNotice(s);
		},
	},
	{
		// N3 過去ログ倉庫（B1 のあと）
		who: "nanj",
		when: (st) => !!st.flags.b1,
		run: async (s) => {
			await s.say("nanj", "過去ログには　ワイの　昔の　レスも\nあるかもしれん");
			await s.say("kiriko", "見たいンゴ");
			await s.say("nanj", "……黒歴史や。見んといてや");
		},
	},
	{
		// N4 ロゼ加入〜B1
		who: "nanj",
		when: (st) => !!st.flags.roze_in,
		run: async (s) => {
			await s.say(
				"nanj",
				"ロゼちゃんの「アル？ナイ！」、\nスレで　めっちゃ　流行ったんやで",
			);
			await s.say("kiriko", "吾輩も　流行りたい");
			await s.say("nanj", "ほな、名言が　いるな");
		},
	},
	{
		// N5 第一章・ロゼ前
		who: "nanj",
		when: (st) => ch(st) >= 1,
		run: async (s) => {
			await s.say("nanj", "なんでも実況J町は\nワイらの　地元や。ええ町やろ？");
			await s.say(
				"nanj",
				"勢い欄は　こまめに　見とき。\nスレの　元気が　わかるで",
			);
			await s.say("kiriko", "わかったンゴ。こまめに　見る");
		},
	},
	{
		// N6 序章 — フォールバック
		who: "nanj",
		run: async (s) => {
			await s.say("nanj", "キリコ、ありがとうは　なんて　言う？");
			await s.say("kiriko", "……ありがとう？");
			await s.say("nanj", "サンガツや。「31」とも　書くで");
			await s.say("kiriko", "サンガツ、ンゴ！");
			await s.say("nanj", "……混ぜたら　あかん");
		},
	},
];

export const profiles: ProfileDef[] = [
	{
		who: "teto",
		pages: [
			{
				bond: 0,
				title: "重音テト",
				lines: [
					"重音（かさね）テト。性別はキメラ、31歳。",
					"赤褐色の、ドリルみたいなツインテール。赤い目、軍服風の制服。",
					"好きな物も、持ち物も、フランスパン。",
					"性格はツンデレ。決めセリフは「君はじつに馬鹿だな」。",
					"一人称「ボク」は、ファンのあいだの定番。",
				],
			},
			{
				bond: 2,
				title: "ウソから本物へ",
				lines: [
					"2008年、VIPの有志がエイプリルフールのウソとして作った。",
					"設定は安価で決めた「架空のボーカロイド」。",
					"4月1日に発表されたので、誕生日も4月1日。",
					"左腕の数字は「0401」。はじめは「04」だった。",
					"そのあとUTAUの声が生まれ、本物の歌い手に。2023年には新しい声も。",
					"キャッチコピーは「どんなマイクも握ります」。",
				],
			},
			{
				bond: 4,
				title: "テトのひみつ",
				lines: [
					"得意な事は「レンタルDVDの延長」。苦手な事は「歌」（公式）。",
					"好きな国はノルウェー。身長159.5cm。",
					"ツインテールが回ると「テト第二形態」。「キメラなので15.5歳」説も。",
					"10月10日は「テトの日」。",
					"のちにキリコがはじめてカバーする2曲は、どちらもテトの歌。",
					"（「オーバーライド」と「好きな惣菜発表ドラゴン」）",
				],
			},
		],
	},
	{
		who: "nanj",
		pages: [
			{
				bond: 0,
				title: "おんJ民",
				lines: [
					"名無しのおんJ民。黄色い、やきうのすがた。",
					"一人称は「ワイ」。しゃべり方は猛虎弁（〜やで・草・サンガツ）。",
					"キリコが生まれた夜、スレをひやかしに来た。名付け親は……ワイ（自称）。",
					"UTAUの声はないので、うたえない。そのぶんフルスイング。",
				],
			},
			{
				bond: 2,
				title: "おんJのきほん",
				lines: [
					"おんJは、おーぷん2ちゃんねるの「なんでも実況J」。",
					"2014年の春、なんJ民が移り住み「おんJ」と呼ばれるようになった。",
					"おんJのスレは「dat落ち」しない。ageれば、また浮かぶ。",
					"1000レスで「完走」。実況スレは名前欄にスコアが出る。",
					"お礼は「サンガツ」。「31（サンイチ）」とも書く。",
				],
			},
			{
				bond: 4,
				title: "ワイとキリコ",
				lines: [
					"キリコの肌の山吹色は「J民の肌の色」。おんJから生まれたしるし。",
					"語尾の「ンゴ」も、もとはJ民がよく使う語尾。",
					"手首はモーター式（手のひら返しが得意）。",
					"マッマには頭があがらない。残機は無限（らしい）。",
					"名無しはいっぱいおる。けど、この声はひとりだけや。",
				],
			},
		],
	},
];
