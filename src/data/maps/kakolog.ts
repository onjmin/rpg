// 過去ログ倉庫（第二章）。設計書 §8-5・§11-4。
// 落ちたスレが流れつく倉庫。本棚の前で「……ンゴ……」の伏線（whisper）→ ロゼが本棚をどかす →
// 蓄音機（B2 前のセーブ）→ 奥の間でムッジェの相手をしていたフェリス → やきうを見てかんちがい →
// B2（ムッジェ＆フェリス）→ 和解してフェリス加入（やきうは自分から控えへ）→ 町へ浮上（600/1000）。rival-joins.md §3。
// 自由度（scratchpad/freedom/spec.md）：入口で古参ニキに「どう返す？」（F3-2・reply_kako）、
// B2 は負けても進む（F4。once なし・b2_met で短い前置き）、名言チャレンジ その2（F1・meigen2）。
// 隠し（知らせない）：ヒナリーの　お勉強（hinary → obenkyo）、名無しの　ログ（北東の空き部屋の棚 (20,2)）。

import type { EventDef, MapDef, Story, TileDef } from "../../engine/defs";
import { DIGS, type Dig } from "../digs";
import {
	ankaChoose,
	BOSS_EXP,
	bossFight,
	MEIGEN,
	meigenQuote,
	replyAnka,
} from "../freedom";
import { chest, npc, warp } from "../helpers";
import { mujjeThanks, ngoane, panmatsu, senkyo } from "../minors";
import { SPR } from "../sprites";
import { benchHint, ks, phono } from "../story";
import { base, CAVE, PROPS } from "../tiles";

// ───────────────── 地形 ─────────────────
// CAVE パレットに足すもの（通れるかどうかは §11-4 のまま）。
//   ,  暗い床（エンカウント）      p  暗い床＋ちぎれたレスの紙くず（エンカウント）
//   B  古いスレの本棚（通れない）  b  くずれかけた本棚（通れない）
//   K k  倒れた本棚（左右。通れない）
//   [ ]  岩壁にかかった古い掲示板（奥の間の正面。左右。通れない）
//   n  岩壁の前に ひとつだけ はなれた棚（b と同じ絵。北東の空き部屋の奥。通れない）
const DARK = base(1, 162);
const C_CAVE = "#6a5a3a";
const shelf = (img: string): TileDef => ({
	layers: [DARK, img],
	color: C_CAVE,
	passable: false,
});

const tiles: Record<string, TileDef> = {
	...CAVE,
	",": { ...CAVE[","], encounter: true },
	p: {
		layers: [DARK, base(1, 288)],
		color: C_CAVE,
		passable: true,
		encounter: true,
	},
	B: shelf(base(3, 104, 1, 2)),
	b: shelf(base(3, 270, 1, 2)),
	K: shelf(base(5, 272, 1, 2)),
	k: shelf(base(6, 272, 1, 2)),
	"[": { ...CAVE.w, layers: [...CAVE.w.layers, base(6, 37, 1, 2)] },
	"]": { ...CAVE.w, layers: [...CAVE.w.layers, base(7, 37, 1, 2)] },
	n: { ...CAVE.w, layers: [...CAVE.w.layers, base(3, 270, 1, 2)] },
};

/**
 * こわれた掲示板（PROPS.boardBroken の上の段には別の小物が入るので、板の2×2だけを使う）。
 * 32px 幅のまま置くとマスからはみ出すので、左右の 1×2 に分けて2マスとも通れなくする。
 */
const BOARD_L = base(4, 262, 1, 2);
const BOARD_R = base(5, 262, 1, 2);

// ───────────────── セリフの部品 ─────────────────
/** J民以外の人・生き物（名前欄だけ）。 */
const N = (s: Story, name: string, text: string) => s.say(null, text, { name });
/** 古参ニキ（町の古参ニキと同じ人。J民なので黄色の名前欄）。 */
const K = (s: Story, text: string) => s.say("nanj", text, { name: "古参ニキ" });

// ───────────────── 古参ニキ（第二章の「どう返す？」。spec §4 F3-2） ─────────────────

/** 章カードのあとに必ず見る。返し方は reply_kako に残り、町の古参ニキとエンディングが拾う。 */
const kosanMeet = async (s: Story): Promise<void> => {
	await s.say("nanj", "お、古参ニキやんけ。\n倉庫に　おったんか");
	s.face("kosan_k", "player");
	await K(s, "過去ログ　読みに　来とったんや。\nここの　スレ、ええやろ");
	await K(
		s,
		"昔の　おんJの　ほうが　よかったわ。\nボカロスレなんか　なかったしな",
	);
	const r = await replyAnka(s, "reply_kako", [
		{ reply: "uke", label: "昔の　おんJ、教えて" },
		{ reply: "kaesu", label: "今の　おんJも　たのしい" },
		{ reply: "neta", label: "吾輩も　いつか　昔になる" },
	]);
	if (r === "uke") {
		await ks(s, "昔の　おんJ、教えてほしいンゴ");
		await K(s, "……しゃあないな。\n昔は　ここも、毎晩　祭りやった");
	} else if (r === "kaesu") {
		await ks(s, "今の　おんJも、たのしいンゴ。\n吾輩、ここで　生まれたから");
		await K(s, "……生意気やな。\nほな、今の　おんJ、見せてもらおか");
	} else {
		await ks(s, "吾輩も、いつか\n「昔の　おんJ」に　なるンゴ");
		await K(s, "……草。うまいこと　言うやんけ");
	}
};

/** 倉庫の古参ニキに話しかけたとき（reply_kako しだい。なしは記録前のセーブ）。 */
const KOSAN_K: Record<string, string> = {
	uke: "2009年の　ナイター実況、\nそら　すごかったで",
	kaesu: "今の　おんJ、\n見せてもらうで",
	neta: "「昔のおんJ」予備軍か。草",
};

// ───────────────── イベント ─────────────────

/** 第二章の章カード（入ったとき1回だけ）。そのまま古参ニキの場面へ。 */
const ch2: EventDef = {
	id: "ch2",
	x: 1,
	y: 16,
	trigger: "auto",
	once: true,
	when: (st) => !!st.flags.b1,
	run: async (s) => {
		await s.chapter("第二章", "過去ログ倉庫の不死鳥");
		s.set("ch", 2);
		await s.say("roze", "ここは　落ちたスレが　ねむる　場所アル");
		await s.say("nanj", "過去ログは　閲覧専用や。\nそっと　見て　まわろか");
		await kosanMeet(s);
	},
};

/** 本棚の手前で必ず踏む「……ンゴ……」（ボツキリコの伏線）。 */
const whisper: EventDef = {
	id: "whisper",
	x: 11,
	y: 10,
	trigger: "touch",
	once: true,
	run: async (s) => {
		s.bgm(null);
		await s.wait(600);
		await s.narrate("……ンゴ……");
		await ks(s, "い、今……吾輩の声が　した？");
		await s.say("roze", "……あっちの　こわれた　掲示板からアル");
		s.face("player", "right");
		await s.narrate(
			"「角刈り」「100t」「111歳」……\n再安価で　流れた　レスが　ふきだまっている。",
		);
		// 序章の安価（髪型 kakugari・体重 anka_100t）で選ばれて流れたものを拾う（F1 ②）
		const kaku = !!s.flag("kakugari");
		const ton = !!s.flag("anka_100t");
		if (kaku && ton)
			await ks(s, "角刈りも、100トンも……。\nあの夜、いちど　えらばれたンゴ");
		else if (kaku)
			await ks(s, "角刈り……。あの夜、いちど\nえらばれた　髪型ンゴ");
		else if (ton)
			await ks(s, "100トン……。あの夜、いちど\nえらばれた　体重ンゴ");
		s.bgm("dungeon");
	},
};

/** こわれた掲示板（再安価で流れたレスの吹きだまり）。左右どちらを調べても同じ。 */
const botsuRun = async (s: Story): Promise<void> => {
	await s.narrate(
		"再安価で　流れた　レスの　ふきだまり。\n……ンゴ……と　聞こえた　気がする",
	);
	// whisper と同じく「えらばれた」（受け身）で言う。「吾輩が　えらんだ」は last の山場だけ
	const kaku = !!s.flag("kakugari");
	const ton = !!s.flag("anka_100t");
	if (kaku && ton)
		await ks(
			s,
			"あの夜　えらばれた　角刈りも　100トンも、\nここに　流れついたンゴ？",
		);
	else if (kaku)
		await ks(s, "あの夜　えらばれた　角刈りも、\nここに　流れついたンゴ？");
	else if (ton)
		await ks(s, "あの夜　えらばれた　100トンも、\nここに　流れついたンゴ？");
	if (ton)
		await s.say("roze", "……100トンのレスだけ、\nいちばん　底に　沈んでるアル");
};
const botsuPile: EventDef = {
	id: "botsu_pile",
	x: 15,
	y: 11,
	sprite: BOARD_L,
	trigger: "talk",
	fixedDir: true,
	run: botsuRun,
};
const botsuPileR: EventDef = {
	id: "botsu_pile_r",
	x: 16,
	y: 11,
	sprite: BOARD_R,
	trigger: "talk",
	fixedDir: true,
	run: botsuRun,
};

/** 道をふさぐ本棚（ロゼがすりぬけて、むこうからずらす）。 */
const shelfEv: EventDef = {
	id: "shelf",
	x: 11,
	y: 9,
	sprite: PROPS.bookshelf,
	trigger: "talk",
	fixedDir: true,
	when: (st) => !st.flags.shelf_open,
	run: async (s) => {
		// 遠くから本棚をタップすると、(11,10) の whisper が走った直後にエンジンが
		// 話しかけも始めてしまう（二重実行）。whisper が終わるまでは何もしない。
		if (!s.flag("done:kakolog:whisper")) return;
		await s.narrate("ふるいスレが　ぎっしりの　本棚が\n道を　ふさいでいる。");
		if (!s.flag("roze_in")) {
			await s.narrate("おしても　ひいても　びくとも　しない。");
			return;
		}
		await s.say("roze", "まかせるアル。体重0の　本領アル");
		await s.narrate(
			"ロゼは　本棚を　すりぬけて、\nむこうから　ずらしてくれた！",
		);
		s.se("door");
		s.set("shelf_open");
		s.hide("shelf");
	},
};

// ───────────────── B2（ムッジェ＆フェリス） ─────────────────

/** はじめて奥の間に入ったとき。 */
const b2First = async (s: Story): Promise<void> => {
	await s.narrate(
		"倉庫の　おく。赤い　けむくじゃらの　となりに\nだれかが　ちょこんと　すわっている。",
	);
	await N(s, "ムッジェ", "ホゲェ");
	await s.say("feris", "あ、どうも〜。この子と　おるすばん中だよ〜");
	await ks(s, "つかまってる……わけじゃ　ないンゴ？");
	await s.say(
		"feris",
		"ちがうよ〜。この子も　私も、\n忘れられた　マスコットだからね〜",
	);
	await s.say("nanj", "フェリスやんけ！　なんJ時代からの　大先輩や");
	await s.say("feris", "……あ、やきうくんだ");
	await s.say("feris", "ムッジェを　いじめに　来たの？");
	await s.say("nanj", "ち、ちゃうわ！　ワイらは……");
	await s.say("feris", "やきうくんの　仲間は、敵だよ〜");
	s.set("b2_met");
	await s.shake(300);
	await N(s, "ムッジェ", "ホゲェ！！");
};

/** 2回目以降（ひとやすみのあと、踏み直したとき）の短い前置き。 */
const b2Again = async (s: Story): Promise<void> => {
	await s.shake(300);
	await N(s, "ムッジェ", "ホゲェ！！");
	await s.say("feris", "また　来たの〜？\nやきうくんの　仲間は、敵だよ〜");
};

/** B2 の負けレス（1・2回目。spec §4 F4）。2回目は「遊びたいだけ」をそれとなく示す。 */
const loseB2 = async (s: Story, n: number): Promise<void> => {
	if (n === 1) {
		await s.narrate("「ムッジェ　つよ」「ホゲェ」\n「倉庫で　全滅は　草」");
		await s.say("roze", "……フェリス先輩、本気アル");
		return;
	}
	await s.narrate(
		"「過去ログに　残るで」\n「ムッジェ、あそびたいだけちゃう？」",
	);
	await s.say("nanj", "……ワイらの　せいかもな。\nすまん");
};

/** 名言チャレンジ その2 へのフェリスの返し（MEIGEN[1] の順）。 */
const REACT2 = [
	"ふふ、それは　ちょっと　いいかも〜",
	"ムッジェが　よろこぶよ〜",
	"……それ、私の　ことだよ〜",
];

/** 名言チャレンジ その2（F1）。ロゼが その1 を引用してから、安価で選ぶ。 */
const meigen2 = async (s: Story): Promise<void> => {
	await ks(s, "名言チャレンジ、その2。");
	const q = meigenQuote(s.state, 0);
	if (q) await s.say("roze", `「${q}」よりは\nましなのを　たのむアル`);
	const i = await ankaChoose(
		s,
		"meigen2",
		MEIGEN[1].map((m) => m.label),
	);
	await ks(s, MEIGEN[1][i].line);
	await s.say("feris", REACT2[i]);
};

/**
 * 勝っても、3回負けて通してもらっても、ここから先は同じ
 * （バナー・加入・b2・2009年の話・600・名言その2）。ちがうのはムッジェの「ホゲェ！」だけ。
 */
const b2After = async (s: Story): Promise<void> => {
	// 下の「バナー、ちゃんと　見る」の前ふり（mujje_after で回収）
	await s.say(
		"feris",
		"この子の　バナー、ずっと　だれも\n見てくれなかったから〜",
	);
	await ks(s, "吾輩たち、スレの　宣伝に　来ただけンゴ");
	await s.say(
		"feris",
		"そっか〜。いじめに　来たんじゃ\nなかったんだね〜。ごめんね〜",
	);
	await s.say("nanj", "まあ、やきうは　前科　あるからな……");
	// 2009年のマスコット争いの和解は第三章（テノヒラ監督戦）へ。ここは前ふりだけ。
	// 「その話」だと直後の「私ね、2009年に…」と食いちがうので、先送りするのは決着だけ
	// （スタジアムの「今夜は　その　つづきだね〜」につながる）。
	await s.say("feris", "ふふ。その　決着は、また　こんどね〜");
	await ks(s, "ムッジェの　バナー、ちゃんと　見る。約束する");
	// 3回負けて通してもらったとき（b2_how=lose）は、ムッジェは　ねむったまま
	await N(
		s,
		"ムッジェ",
		s.flag("b2_how") === "lose" ? "……ホゲェ……（ねごと）" : "ホゲェ！",
	);
	await s.say(
		"feris",
		"「また　あそびに　きてな」だって〜。\n私も　いっしょに　行っていい？",
	);
	// たたかって歩くのは3人まで。やきうが自分から控えへ（大先輩に席をゆずる。三章のスタジアムへの前ふり）
	// 先に bench してから join する（join は たたかう仲間の平均レベルで入る）
	await s.say(
		"nanj",
		"大先輩の　たのみや、ことわれんわ。\n……ほな、ワイは　一歩　下がっとくで",
	);
	await s.say("nanj", "ワイは　スタンド側や。\n後ろから　応援しとくで");
	await ks(s, "……やきう、いなく　なっちゃうンゴ？");
	await s.say("nanj", "なるかいな。声かけたら　すぐ\nグラウンドに　降りたるわ");
	await s.say("feris", "……やきうくん、ありがとね〜");
	s.bench("nanj");
	s.hide("feris");
	s.join("feris");
	s.set("feris_in");
	s.se("item");
	await s.narrate(
		"フェリスが　なかまに　なった！\nやきうは　控えに　まわった。",
	);
	await benchHint(s);
	s.set("b2");
	s.hide("mujje");
	await s.say(
		"feris",
		"私ね、2009年に　一回　消えたんだ〜。\nやきうくんたちに　マスコット争いで　負けて",
	);
	await s.say(
		"feris",
		"でも2015年に、だれかが「フェリスおったよな」\nって　書いてくれて。……不死鳥だからね〜",
	);
	await s.say("roze", "……わたしと、おなじアル");
	await s.say(
		"feris",
		"落ちても、覚えてる人が　いれば\nage（あが）れるよ〜。くしゃみ出そう……",
	);
	await s.say("feris", "ふぇ……ふぇ……");
	await ks(s, "――フェニックス！");
	await s.flash("#ff7a2a", 300);
	s.se("fire");
	await s.say("feris", "あ、言われちゃった〜");
	s.set("res", 600);
	await s.warp("town", 12, 9, "down", { se: "warp" });
	// ここからは町（勢い欄の前）
	await s.narrate("ほのおに　のって、勢い欄の　上へ\nage（あが）った！");
	s.se("item");
	await s.narrate("蓄音機に　レスが　たまった！（600/1000）");
	await meigen2(s);
	await s.say("nanj", "お、東門が　あいとるで。今夜は　ナイターや！");
};

/**
 * 奥の間の入口：ムッジェ＆フェリス → B2 → 和解してフェリス加入 → 町へ浮上。
 * 負けても進む（F4）：ひとやすみなら入口の外 (10,7) へ下がり、踏み直すと短い前置きで再戦。
 * そのため once にしない（b2 が立てば when で消える）。
 */
const bossfloor: EventDef = {
	id: "bossfloor",
	x: 10,
	y: 6,
	trigger: "touch",
	when: (st) => !st.flags.b2,
	run: async (s) => {
		await s.move("player", "u");
		if (s.flag("b2_met")) await b2Again(s);
		else await b2First(s);
		// 1・2回目の負けは負けレス → もういちど／ひとやすみ、3回目で通してもらう
		const r = await bossFight(s, "b2", "g_b2", loseB2);
		if (r === "rest") {
			await s.say("feris", "……また　あそぼうね〜");
			// (10,5) → (10,7)。スクリプトの move では踏んだ判定は起きない
			await s.move("player", "dd");
			return;
		}
		s.set("b2_how", r === "win" ? "win" : "lose");
		if (r === "pass") {
			await s.narrate("ムッジェは　あそびつかれて\nねむってしまった。");
			await s.say("feris", "……ねちゃった〜");
			await s.say("feris", "……ねがお、たのしそう〜");
			// 経験値は　フェリスの2行のあと（静かな場面を　レベルアップで　切らない）
			await s.gainExp(BOSS_EXP.b2);
		} else {
			await N(s, "ムッジェ", "ホゲェ……♪");
			await s.say("feris", "……あれ？　ムッジェ、たのしそう");
		}
		await b2After(s);
	},
};

/**
 * ヒナリーの　お勉強（隠し）。「言いたそうだ」を見たあと、フェリスが前にいると出す問題。
 * スタジアムの門の「追いつかれません」と、b_obenkyo のロゼの「算数じゃ　ないアル」の呼び返し。
 * hinary_q はクリア後の end_hinary と、1000の先の >>995 が拾う（thread.ts）。
 */
const obenkyo = async (s: Story): Promise<void> => {
	await s.say("feris", "ヒナリーちゃん、また　研究？");
	await N(s, "ヒナリー", "……避難Jを研究しているヒナリーです。");
	await s.narrate(
		"ヒナリーは　白衣の　ポケットから、\nおりたたんだ　紙を　出した。",
	);
	await N(s, "ヒナリー", "……お勉強の、時間です");
	await s.narrate("フェリスの　羽が、ぴんと　立った。");
	await N(
		s,
		"ヒナリー",
		"フェリスさんが　先に　飛んで　出発。\nヒナリーは　あとから　歩いて　追いかけます",
	);
	await N(s, "ヒナリー", "ヒナリーが　追いつくのは、何分後？");
	await s.say("feris", "……それ、知ってる〜。\n追いつかれません〜");
	// 門でフェリスが言う「ぶ〜」を、こんどはヒナリーが言う
	await N(s, "ヒナリー", "……ぶ〜");
	await s.say("feris", "え〜？");
	await s.narrate("ヒナリーは　紙を　うらがえした。");
	await s.narrate("『答え：0分後』");
	await s.say("feris", "……0分〜？");
	await s.narrate("ヒナリーは　だまって、\nフェリスの　足もとを　ゆびさした。");
	await s.narrate("フェリスは、ヒナリーの　すぐ　となりに\n立っていた。");
	await s.say("feris", "……あ〜");
	await s.say("feris", "ほんとだ〜。\n……追いつかれちゃった〜");
	await s.say("roze", "……算数じゃ　ないアル。\nでも、正解アル");
	await N(s, "ヒナリー", "……避難Jを研究しているヒナリーです。");
	await s.narrate("さっきより、すこしだけ\n声が　大きかった。");
	s.set("hinary_q");
};

/**
 * ヒナリー（3回目から「言いたそうだ」→ hinary_hint）。
 * hinary_hint のあと、フェリスが たたかう仲間にいれば お勉強。控えにいると、うしろを気にする。
 * 回数でなく hinary_hint で分けるのは、validate で hinary_n が 1〜2 にしかならないため。
 */
const hinary = npc(
	"hinary",
	13,
	15,
	SPR.hinary,
	async (s) => {
		const n = Number(s.flag("hinary_n") ?? 0) + 1;
		s.set("hinary_n", n);
		const benched = s.state.party.some((m) => m.id === "feris" && m.bench);
		if (
			s.flag("hinary_hint") &&
			s.flag("feris_in") &&
			!benched &&
			!s.flag("hinary_q")
		)
			return obenkyo(s);
		if (s.flag("feris_in"))
			await s.say("feris", "ヒナリーちゃん、また　研究？");
		if (n >= 3 && !s.flag("hinary_q")) {
			await N(
				s,
				"ヒナリー",
				benched
					? "……避難Jを研究しているヒナリーです。\n（うしろの　ほうを　ちらちら　見ている）"
					: "……避難Jを研究しているヒナリーです。\n（なにか　言いたそうだ）",
			);
			s.set("hinary_hint");
		} else await N(s, "ヒナリー", "避難Jを研究しているヒナリーです。");
	},
	{ dir: "down" },
);

// ───────────────── 名無しの　ログ（隠し。北東の空き部屋の奥の棚） ─────────────────
// 本棚をどけたあと〜終章。仲間の顔ぶれで3段（フラグだけで分ける）。kako_2015 = 1|2|3。
// (i) フェリスがまだ → やきうが棚の前に立つ。(ii) フェリスが仲間でやきうが控え →
// 読む（やきうがてれる）。(iii) 録音のあと → 読む（やきうはいない）。
// 2以上で読んだあとの一言。エンディング（thread.ts）が 2以上を拾う。
// DIGS には入れない（rec_kako の条件が変わる）。dig_ にもしない（次スレへ持ち越すと (i) が飛ぶ）。

const LOG_SHELF =
	"ひとつだけ　はなれた　棚。\n名無しの　ログが　はさまっている。";

/** フェリスがログを ひっぱりだし、書いた人の名前を キリコが読むところまで（(ii)(iii) 共通）。 */
const logOpen = async (s: Story): Promise<void> => {
	await s.say("feris", "なになに〜？");
	await s.narrate("フェリスが　ひょいと　飛んで、\nログを　ひっぱりだした。");
	await s.narrate("1　名前：風吹けば名無し\nフェリスおったよな");
	await s.narrate(">>2 おった　おった");
	await s.say("feris", "……これ、私の　スレだ〜");
	await ks(s, "書いたのは……風吹けば名無し");
};

/** ログを棚に もどして、だれにともなく礼を言う（(ii)(iii) 共通）。 */
const logClose = async (s: Story): Promise<void> => {
	await s.narrate(
		"フェリスは　ログを　棚に　もどして、\nだれにとも　なく　言った。",
	);
	await s.say("feris", "……ありがとね〜");
};

const nanashiLog: EventDef = {
	id: "nanashi_log",
	x: 20,
	y: 2,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		const k = Number(s.flag("kako_2015") ?? 0);
		if (k >= 2) {
			await s.narrate("「フェリスおったよな」。\n……いまも、ちゃんと　読める。");
			return;
		}
		// (i) フェリスがまだ（B1〜B2）：やきうが読ませない
		if (!s.flag("feris_in")) {
			if (k === 1) await s.say("nanj", "……ほっとき　言うたやろ");
			else {
				await s.narrate(LOG_SHELF);
				await s.say("nanj", "……古いログなんか　ほっとき。\nほこり　すごいで");
				await ks(s, "……黒歴史ンゴ？");
				await s.say("nanj", "ちゃうわ");
			}
			await s.narrate("やきうが、棚の　前に　立った。");
			s.set("kako_2015", 1);
			return;
		}
		// (ii) B2〜アク禁（フェリスが仲間、やきうは控え）
		if (s.flag("nanj_in") && !s.flag("akukin")) {
			if (!k) await s.narrate(LOG_SHELF);
			await s.say(
				"nanj",
				k === 1
					? "……ほっとき　言うたやろ"
					: "……古いログなんか　ほっとき。\nほこり　すごいで",
			);
			await logOpen(s);
			await s.narrate("キリコは　やきうを\nふりかえった。");
			await s.say("nanj", "……名無しは　いっぱい　おるやろ");
			await ks(s, "やきう、耳が　赤いンゴ");
			await s.say("nanj", "……倉庫が　あついんや");
			// 「過去ログ倉庫は　ひんやりして」（ロゼの「なかまと　はなす」R7）
			await s.say("roze", "倉庫は　ひんやりアル");
			await s.say("nanj", "…………");
			await logClose(s);
			s.set("kako_2015", 2);
			return;
		}
		// (iii) 録音のあと（やきうはいない）
		await s.narrate(LOG_SHELF);
		await logOpen(s);
		await s.say("roze", "名無しは　いっぱい　いるアル");
		await ks(s, "……「おったよな」");
		await s.say("feris", "……ふふ〜。だれだろうね〜");
		await logClose(s);
		s.set("kako_2015", 3);
	},
};

// ───────────────── マップ ─────────────────

/**
 * くずれかけた棚を掘る（data/digs.ts）。掘り出した過去ログは >>1 が欠けていて、
 * レスの流れだけを読んで当てる。外しても棚のおくへ もどるだけで、何度でも掘り直せる。
 */
const digRun = (d: Dig) => async (s: Story) => {
	if (s.flag(`dig_${d.id}`)) {
		await s.narrate("掘ったあとの　棚。\n……もう　からっぽだ。");
		return;
	}
	await s.narrate("ほこりの　つもった　棚。");
	if ((await s.choose(["掘る", "やめる"], { cancel: 1 })) === 1) return;
	s.se("item");
	await s.narrate(
		"古い　過去ログが　出てきた。\n>>1 は　文字化けして　読めない。",
	);
	for (const t of d.log) await s.narrate(t);
	await s.narrate("……この　スレの　>>1 は、\nなんだった？");
	if ((await s.choose(d.choices)) !== d.answer) {
		s.se("miss");
		await s.narrate(
			"ログは　ぱらぱらと　くずれて、\nまた　棚の　おくへ　もどった。",
		);
		await ks(s, "……もう　いちど　読むンゴ");
		return;
	}
	s.set(`dig_${d.id}`);
	s.se("levelup");
	await s.narrate("スレが　ゆっくり　浮かびあがった。\n（age）");
	await ks(s, d.line);
	s.se("item");
	s.give(d.item.id, d.item.n);
	await s.narrate(d.item.text);
	// 4つ そろうと、掘りおこした声が ひとつのレコードになる
	if (DIGS.every((x) => s.flag(`dig_${x.id}`)) && !s.flag("dig_all")) {
		s.set("dig_all");
		s.se("item");
		s.give("rec_kako", 1);
		await s.narrate(
			"4つの　スレが　いっせいに　鳴った。\nレコード「過去ログの声」を　てにいれた！",
		);
	}
};

const digEvent = (d: Dig): EventDef => ({
	id: `dig_${d.id}`,
	x: d.x,
	y: d.y,
	trigger: "talk",
	fixedDir: true,
	run: digRun(d),
});

export const kakolog: MapDef = {
	id: "kakolog",
	name: "過去ログ倉庫",
	bgm: "dungeon",
	tiles,
	// 22×18。§11-4 の ASCII と同じ配置（p・b・K k・[ ] は見た目だけの差し替え。
	// 奥の間の手前の壁 y6 は、正面から見える岩壁 w にした）。
	rows: [
		"######################", // y0
		"#WWWWWWWWWWWWWWWWWWWW#", // y1
		"#wwwwwwwww[]wwwwwwwwn#", // y2  奥の間の正面に古い掲示板（B2 後: (10,2) に総選挙のはり紙）。(20,2) に はなれた棚
		"#,,,,#..........#,,,,#", // y3  奥の間: フェリス (10,3)、ムッジェ (11,3)（B2 後は mujje_after）。棚は (20,3) から調べる
		"#,,,,#..........#,,,p#", // y4  宝箱 (2,4)。B2 後: ンゴ姉 (7,4)、パン松 (14,4)
		"#,,,,#..........#,,,,#", // y5
		"#,,,,wwwww.wwwwww,,,,#", // y6  奥の間の入口 (10,6) = bossfloor
		"#,p,,,,,,......,,,,,,#", // y7  蓄音機 (13,7)
		"#,,,,,,,,......,,,,,,#", // y8
		"#BBbBBBBbBB.BBbBBBBbB#", // y9  本棚の壁。すきま (11,9) に shelf
		"#,,,,,,,,,,,,,,,,,,,,#", // y10 whisper (11,10)
		"#,,,,,,p,,,,,,,,,,,,,#", // y11 こわれた掲示板 (15,11)(16,11)
		"#,,,Kk,,,,,,,,,,,,,,,#", // y12 宝箱 (19,12)
		"#,,,,,,,,p,,,,,,,,oo,#", // y13
		"#,,,,,,,,,,,,,,,,p,,,#", // y14
		"#,,p,,,,,,,,,.,,,,,,,#", // y15 古参ニキ (10,15)（b1〜b2）、ヒナリー (13,15)
		"#,,,,,,,,,,.,,,,,,,,,#", // y16 到着 (11,16)
		"###########.##########", // y17 入口 (11,17) → road
	],
	encounters: {
		rate: 0.08,
		groups: ["g_kako1", "g_kako2", "g_kako3", "g_kako4"],
	},
	events: [
		ch2,
		warp(
			"to_road",
			11,
			17,
			{ map: "road", x: 12, y: 2, dir: "down" },
			{ se: "stairs" },
		),
		hinary,
		// 古参ニキ（B1 のあと B2 まで。その間、町の古参ニキ kosan は消える）
		npc(
			"kosan_k",
			10,
			15,
			SPR.j_shinkan,
			async (s) =>
				K(
					s,
					KOSAN_K[String(s.flag("reply_kako"))] ?? "過去ログ倉庫、閲覧専用やで",
				),
			{ dir: "up", when: (st) => !!st.flags.b1 && !st.flags.b2 },
		),
		whisper,
		botsuPile,
		botsuPileR,
		shelfEv,
		phono("phono_kako", 13, 7),
		bossfloor,
		{
			id: "feris",
			x: 10,
			y: 3,
			dir: "down",
			sprite: "char:feris",
			trigger: "talk",
			when: (st) => !st.flags.feris_in,
			run: async (s) => {
				await s.say("feris", "あ、どうも〜");
			},
		},
		{
			id: "mujje",
			x: 11,
			y: 3,
			dir: "down",
			sprite: SPR.mujje,
			trigger: "talk",
			when: (st) => !st.flags.b2,
			run: async (s) => {
				await N(s, "ムッジェ", "ホゲェ");
			},
		},
		{
			// B2 のあと：奥の間でるすばん（b2 で hide した mujje とは別のイベント）。
			// 約束のバナーのすみに、町の看板と同じ誤字の新顔が描きたしてある。
			id: "mujje_after",
			x: 11,
			y: 3,
			dir: "down",
			sprite: SPR.mujje,
			trigger: "talk",
			when: (st) => !!st.flags.b2,
			run: async (s) => {
				await mujjeThanks(s);
				if (s.flag("feris_in"))
					await s.say("feris", "ムッジェ〜、あそびに　来たよ〜");
				await N(s, "ムッジェ", "ホゲェ！");
				await s.narrate(
					"ムッジェが　おくの　掲示板を　ゆびさした。\n自分が　描かれた　バナーが　はってある。",
				);
				await s.narrate(
					"すみっこに、ポニテの子が　描きたしてある。\n名前は……『畜音キリコ』。",
				);
				await ks(
					s,
					"約束の　バナー、ちゃんと　見た。\n……字は、あとで　なおしてもらうンゴ",
				);
				await N(s, "ムッジェ", "ホゲェ♪");
			},
		},
		// おんJマイナーズ（B2 のあと、ムッジェのまわりに いつく。data/minors.ts）
		ngoane(7, 4),
		panmatsu(14, 4),
		senkyo(10, 2),
		...chest("kako1", 2, 4, "hane", 1),
		...chest("kako2", 19, 12, "candy", 2),
		// くずれかけた棚（b）を掘る読解パズル
		...DIGS.map(digEvent),
		// 北東の空き部屋の奥の棚（n）。見えない。(20,3) から上を向いて調べる
		nanashiLog,
	],
};
