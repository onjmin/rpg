// 管理人室（クリア後のおまけ）。スレの下の扉（thread の to_admin）から来る。
// 矢野さとる（おんJ管理人）・ひろゆき（元2ch管理人）は、実在の人物をもとにした非公式のファン描写。
// セリフはすべて創作（本人の実際の発言ではない）。口調だけ公開の投稿を参考にした。
// さとる：話しかけると裏ボス戦（g_admin。何度でも）。テスト鯖なので、負けても道具も へらない
// （たおしたボスの経験値は入る。ui/battle.ts の決着）。
// ひろゆき：観戦席のカメオ（戦わない）。うまい棒（だいじなもの）と、答えのない問いが1つ。

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { ankaChoose } from "../freedom";
import { npc, OBJ, warp } from "../helpers";
import { SPR } from "../sprites";
import { phono } from "../story";
import { INDOOR, PROPS } from "../tiles";

/** 矢野さとる（立ち絵・読み上げなし）。 */
const S = (s: Story, text: string) => s.say(null, text, { name: "矢野さとる" });
/** ひろゆき（立ち絵・読み上げなし）。 */
const H = (s: Story, text: string) => s.say(null, text, { name: "ひろゆき" });

/** 数のフラグを1つ進め、進める前の値を返す（話すたびに一言をかえる）。 */
const bump = (s: Story, flag: string): number => {
	const n = Number(s.flag(flag) ?? 0);
	s.set(flag, n + 1);
	return n;
};

/** おしらせ（はじめて入ったときと看板）。 */
const NOTICE = [
	"【おしらせ】この部屋の　ふたりは、\n実在の人物を　もとにした　非公式の創作です。",
	"ご本人や　サイトとは　関係ありません。\nセリフは　すべて　創作です。",
];

// ───────────────── はじめて入ったとき ─────────────────

const intro = async (s: Story): Promise<void> => {
	// ふたりが話す前に、おしらせ
	for (const t of NOTICE) await s.narrate(t);
	// キーボードの音（高速プログラミング）
	for (let i = 0; i < 4; i++) {
		s.se("cursor");
		await s.wait(90);
	}
	await s.narrate("カタカタカタ……\nキーボードの　音が　する。");
	s.face("satoru", "player");
	await S(s, "おっ、ここまで　来たの？　おつー。\n管理人室へ　ようこそ。");
	await s.say("kiriko", "……だれンゴ？");
	await S(s, "おんJの　管理人、矢野さとる。\nさとるで　いいよー。");
	await s.say("roze", "管理人さん……板の　いちばん\nえらい人アル？");
	await S(s, "えらくは　ないよー。\nサーバーの　お守りを　しとるだけ。");
	s.face("hiro", "player");
	await H(
		s,
		"あ、どうも。おいらは　見てるだけなんで、\n気にしないでください。",
	);
	await s.say("teto", "……だれ？");
	await S(s, "ひろゆき。古い　掲示板仲間よ。\nきょうは　見学やって。");
	await H(
		s,
		"むかし、2chの　管理人を　やってました。\nきょうは　ただの　見物人です、はい。",
	);
	await S(
		s,
		"でね、ちょっと　遊んでいかん？\n新機能の　テストに　付き合ってほしいんよ。",
	);
	await s.say("kiriko", "新機能……ンゴ？");
	await S(s, "準備が　できたら　話しかけてね。\nいつでも　どうぞー。よろ。");
	s.set("satoru_met");
};

// ───────────────── 矢野さとる ─────────────────

const satoruRun = async (s: Story): Promise<void> => {
	if (!s.flag("satoru_win")) {
		await S(s, "新機能の　テスト、付き合ってくれる？");
		if ((await s.choose(["いどむ", "やめておく"], { cancel: 1 })) !== 0) {
			await S(s, "おけー。気が向いたら　また　おいで。");
			return;
		}
		return challenge(s);
	}
	await S(s, "おっ、おかえり。どしたの？");
	const n = await s.choose(["もう一度たたかう", "話を聞く", "またね"], {
		cancel: 2,
	});
	if (n === 1) return adminTalk(s);
	if (n !== 0) return;
	await S(s, "ボスの　ストック、また　つめといたけん。\nよろ。");
	await H(
		s,
		"また来たんですか。ひまなんですか？\n……まあ、おいらも　ですけど。",
	);
	return challenge(s);
};

/** 裏ボス戦。テスト鯖なので、はじめに全回復し、つかった道具は あとで もどす（勝っても負けても）。 */
const challenge = async (s: Story): Promise<void> => {
	if (!s.flag("satoru_try")) {
		s.set("satoru_try");
		await S(
			s,
			"ここは　テスト鯖やけん、どうぐは\nへらんよ。安心して　遊んでね。",
		);
	}
	s.heal();
	s.se("heal");
	await s.narrate("さとるが　みんなの　HPと　こえを\nまんたんに　してくれた。");
	const bag = { ...s.state.items };
	const r = await s.battle("g_admin", { canLose: true });
	for (const [id, n] of Object.entries(bag)) {
		const used = n - s.has(id);
		if (used > 0) s.give(id, used);
	}
	if (r === "win") await afterWin(s);
	else await afterLose(s);
};

/** 負けたとき（エンジンが全回復して "lose" を返す）。何度でも。2回目・3回目に ヒント。 */
const afterLose = async (s: Story): Promise<void> => {
	const n = bump(s, "satoru_lose");
	await S(s, "おしい〜。テストやけん、\n何回でも　遊んでってねー。");
	if (n % 2 === 0)
		await H(
			s,
			"なんだろう、負けても　なにも　へらないの、\nいい仕様ですよね。",
		);
	else await s.say("kiriko", "……つぎは　勝つンゴ");
	// オートは どうぐを つかわない。負けても たおしたボスの経験値は のこる（ui/battle.ts）
	if (n === 1)
		await S(
			s,
			"ヒント。どうぐは　へらんよ。\nオートを　止めて　どんどん　つかってね。",
		);
	else if (n === 2)
		await S(
			s,
			"負けても、たおした　ボスの　経験値は\nのこるよー。レベル上げにも　どうぞ。",
		);
};

/** 再戦で勝ったときの さとるの一言（順に）。 */
const REMATCH = [
	"テスト　ありがと。\n新機能は　また　つくっとくね。",
	"ボス、もうちょい　つよく　しとこかな。\n……うそうそ。よろ。",
	"おつかれ〜。\n次スレも　のぞきに　いくねー。",
];

const afterWin = async (s: Story): Promise<void> => {
	const n = bump(s, "satoru_win");
	await s.narrate("矢野さとるが　ログインしなおした。");
	if (n > 0) {
		await S(s, "また　負けた〜。君ら　ほんと　つよすぎ。");
		await S(s, REMATCH[(n - 1) % REMATCH.length]);
		await H(
			s,
			n % 2
				? "おつかれさまです。\nいいもの　見せてもらいました、はい。"
				: "うひょ。……あ、いや、\nつよいなって　思っただけです。",
		);
		return;
	}
	// はじめて勝ったとき：管理人らしいコメントと会話
	await S(s, "負けた〜。つよいねえ、君ら。\nこれは　なおせんバグやね。");
	await s.say("kiriko", "吾輩たちの　勝ちンゴ！");
	await S(
		s,
		"当たり判定　消しとって、ごめんたい。\nでも　ボスラッシュ、よかったやろ？",
	);
	await s.say("roze", "その場で　ボスを　作るなんて……\n手品みたいアル");
	await S(
		s,
		"思いついたら　夜のうちに　作っとる。\nキーボード　さわると　止まらんのよ。",
	);
	await s.say("teto", "……ボクの　ドリルより　速いな、その指");
	await s.say("feris", "管理人さん、手が　はやすぎだよ〜");
	s.face("hiro", "player");
	await H(
		s,
		"さとるくんの　新機能、また　ふえてますね。\n……いや、ふつうに　すごいと思います、はい。",
	);
	await S(s, "お、ほめられた。めずらし〜。");
	await S(s, "……うた、ちゃんと　1000まで\nとどいとったよ。神スレやったねえ。");
	await s.say("kiriko", "……！　聞いてて　くれたンゴ？");
	await S(
		s,
		"掲示板は、書く人が　おって　はじめて\n動くんよ。いつも　ありがとね。",
	);
	await S(
		s,
		"スレ主だけ　1000の先に　5レスぶん\n書けるようにしとる。とっておきよ。",
	);
	await s.say("kiriko", "1000の　先……！");
	await S(s, "次スレも　見とるよー。\nまた　遊びに　おいで。乙。");
};

/** 「話を聞く」（勝ったあと）。話すたびに順に。 */
const adminTalk = async (s: Story): Promise<void> => {
	const k = bump(s, "satoru_talk") % 6;
	if (k === 0)
		await S(
			s,
			"新しいの　つくってみた、って\n言うときが　いちばん　楽しいんよ。",
		);
	else if (k === 1)
		await S(
			s,
			"お絵かきも　将棋も、スレで　できるよ。\nネットは　でっかい　遊び場なんよ。",
		);
	else if (k === 2)
		await S(
			s,
			"書けば　書くほど　レベルが　上がる\n仕組みも　あるんよ。RPGみたいやろ？",
		);
	else if (k === 3) {
		await S(
			s,
			"「管理人」って　書いたら\n「明太子」に　なる　機能も　あるけん。",
		);
		await H(
			s,
			"めんたい、いいですよね。\nおいら、うまい棒も　めんたい味なんで。",
		);
	} else if (k === 4)
		await S(
			s,
			"要望は　この部屋で　聞くよー。\n夜のうちに　つくるかも。よろ。",
		);
	else
		await S(s, "バグ　見つけたら　この部屋で　教えてね。\nすぐ　なおす。乙。");
};

// ───────────────── ひろゆき（観戦席のカメオ。戦わない） ─────────────────

/** 勝ったあとの「話す」（問いのあと。順に）。 */
const hiroTalk = async (s: Story): Promise<void> => {
	const k = bump(s, "hiro_talk2") % 4;
	if (k === 0)
		await H(
			s,
			"掲示板って、書く人が　いなかったら\nただの　空き地なんですよね。",
		);
	else if (k === 1)
		await H(
			s,
			"おいらが　昔　はじめた掲示板の　ずっと先に\nこういうスレが　あるのは　いいですよね。",
		);
	else if (k === 2)
		await H(
			s,
			"なんだろう、キリコさんの　うた、\nまた　聞きたいなって　思いました。",
		);
	else {
		await H(s, "すいません、ちょっと　寝坊しました。\n何か　ありました？");
		await s.say("kiriko", "……ずっと　そこに　いたンゴ");
	}
};

const hiroRun = async (s: Story): Promise<void> => {
	if (!s.flag("satoru_win")) {
		// 戦う前：観戦席からの一言（2つ目は攻略のヒント）
		const k = bump(s, "hiro_talk") % 3;
		if (k === 0)
			await H(
				s,
				"さとるくん、また　新機能ですか。\nお、おう……って感じですね。",
			);
		else if (k === 1)
			await H(
				s,
				"さとるくんの　ボス、ストックが\nあるうちは　当たらないらしいですよ。",
			);
		else {
			await s.say("kiriko", "このスレ、1000まで　いったンゴ！");
			await H(
				s,
				"なんか　そういうログ　あるんですか？\n……あ、あるんだ。うひょ。",
			);
		}
		return;
	}
	// 勝ったあと：うまい棒（1回）・答えのない問い（1回）・ひとこと
	await H(s, "あ、どうも。おいらに　なにか　用ですか？");
	const opts = s.flag("hiro_bo")
		? ["話す", "またね"]
		: ["話す", "うまい棒をもらう", "またね"];
	const pick = opts[await s.choose(opts, { cancel: opts.length - 1 })];
	if (pick === "うまい棒をもらう") {
		await H(s, "おつかれさまです。うまい棒、めんたい味\n置いときますね。");
		s.give("umaibo");
		s.set("hiro_bo");
		s.se("item");
		await s.narrate("うまい棒（めんたい味）を　てにいれた！");
		await s.say("kiriko", "……たべるのが　もったいないンゴ");
		return;
	}
	if (pick !== "話す") return;
	// 0 も答えなので undefined でくらべる
	if (s.flag("hiro_q") !== undefined) return hiroTalk(s);
	await H(s, "キリコさんって、なんで\nボカロに　なったんですか？");
	// 答えのない問い（どれを選んでも よい。hiro_q に残すだけ）
	const i = await ankaChoose(s, "hiro_q", [
		"安価は　絶対だから",
		"みんなが　作ったから",
		"なんとなくンゴ",
	]);
	await H(
		s,
		[
			"安価で　決まったなら、しかたないですね。\n……いい　文化だと　思います、はい。",
			"作った人が　いっぱい　いるの、\nいいですよね。掲示板っぽくて。",
			"なんとなく、いいと思います。\nおいらも　だいたい　なんとなくなんで。",
		][i],
	);
	await H(
		s,
		"どれが　正解とかは　ないんで。\nキリコさんの　感想が　いちばんです、はい。",
	);
};

// ───────────────── マップ ─────────────────

const events: EventDef[] = [
	{ id: "admin_intro", x: 1, y: 8, trigger: "auto", once: true, run: intro },
	// さとるは机の向こう。モニターにはさまれているので、カウンター越し (5,5) から話す
	npc("satoru", 5, 3, SPR.satoru, satoruRun, { dir: "down" }),
	// ひろゆきは観戦席のいす (9,5) のとなり
	npc("hiro", 8, 5, SPR.hiro, hiroRun, { dir: "left" }),
	phono("admin_phono", 2, 6),
	{
		id: "admin_sign",
		x: 3,
		y: 8,
		sprite: OBJ.sign,
		trigger: "talk",
		fixedDir: true,
		run: async (s) => {
			for (const t of NOTICE) await s.narrate(t);
		},
	},
	warp(
		"to_thread",
		5,
		9,
		{ map: "thread", x: 6, y: 9, dir: "up" },
		{ se: "door" },
	),
];

export const admin: MapDef = {
	id: "admin",
	name: "管理人室",
	bgm: "field2", // 誕生スレの曲（ここは スレの　うら側）
	tiles: {
		...INDOOR,
		D: INDOOR["~"], // 赤いじゅうたんが扉まで続く
		// サーバーラック（木の床の上に。CYBER の S と同じ絵。1x2 で壁の下段へ はみ出す）
		R: { ...INDOOR.B, layers: [...INDOOR["."].layers, PROPS.server] },
	},
	// R サーバーラック  M モニター  [=] 管理人の机  n 観戦席のいす  o まるテーブル  B 本棚
	rows: [
		"###########",
		"#HHQHHHQHH#",
		"#hhhhhhhhh#",
		"#RR.M.M..B#",
		"#...[=]...#",
		"#....~...n#",
		"#....~...o#",
		"#....~....#",
		"#....~....#",
		"#####D#####",
	],
	events,
};
