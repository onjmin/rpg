// 誕生スレ【安価】安価でボカロ作ろうぜ（序章・エンディング）。設計書 §11-1・§8-1・§8-12。
// 序章: opening（安価 → 誕生 → おんJ民の冷やかし → キリコ vs おんJ民 → 蓄音機 →
//        kskボット → おんJ民加入 → チュートリアル戦）。
// 終章: last から (6,6) に着くと ending_ev（みんなが集まる → s.ending()）。
//       住民の一言とまとめカードは、それまでの安価・返し方で変わる（data/threadlog.ts）。

import type { EventDef, GameState, MapDef, Story } from "../../engine/defs";
import { addLose } from "../freedom";
import { npc, warp } from "../helpers";
import { SPR } from "../sprites";
import { threadSummary, VARIANTS } from "../threadlog";
import { INDOOR } from "../tiles";

/** J民系のモブ（黄色の名前欄・読み上げなし）。 */
const J = (s: Story, text: string, name: string) =>
	s.say("nanj", text, { name });
/** J民以外の人・生き物。 */
const N = (s: Story, text: string, name: string) => s.say(null, text, { name });

const clear = (st: GameState) => !!st.flags.clear;

// ───────────────── 序章 ─────────────────

const opening = async (s: Story): Promise<void> => {
	s.bgm(null);
	await s.chapter("序章", "安価は絶対");
	await s.narrate(
		"2026年8月17日　22時51分。\nおーぷん2ちゃんねる　なんでも実況J。",
	);
	await s.narrate("【安価】安価でボカロ作ろうぜ");

	// 安価は絶対（どちらを選んでも公式設定にもどる。選んだことはボツキリコ・エンディングで拾う）
	await J(s, "髪型は？", "名無し");
	if ((await s.choose([">>1 角刈り", ">>2 ポニーテール"])) === 0) {
		await J(s, "角刈りで草。……再安価や！", "名無し");
		s.set("kakugari");
	} else {
		await J(s, "ポニテ有能", "名無し");
	}
	await J(s, "若草色の　ポニテに　リボンで　決まりや", "名無し");
	await J(s, "体重は？", "名無し");
	const w = await s.choose([">>1 100トン", ">>2 34キロ"]);
	if (w === 0) s.set("anka_100t");
	await J(
		s,
		w === 0 ? "物理的に　ムリやろ。34kgにしとこ" : "ガリガリで　ええやん",
		"名無し",
	);
	await J(
		s,
		"一人称は吾輩、語尾はンゴ。\n肌は……おんJ生まれなら　山吹色やろ",
		"名無し",
	);
	await J(s, ">>101　名前は――蓄音キリコ", "名無し");

	// 誕生
	await s.flash("#f8b500", 400);
	s.bgm("field2");
	await s.say("kiriko", "……ここは、どこンゴ？");
	s.face("j_a", "player");
	await J(s, "しゃべったァ！　ンゴ言うた！", "J民A");
	await J(s, "ちくおん？　きくね？　なんて読むんや", "J民C");
	await s.say("kiriko", "……ちくね。たぶん");
	s.face("j_b", "player");
	await J(s, "誕生日は　実質今日やな。8月18日や", "J民B");

	// おんJ民の冷やかし（キリコ vs おんJ民）
	s.se("door");
	await s.shake(300);
	s.set("onj_raid");
	s.show("nanj"); // show で when を評価し直し、nanj と raid_a が出る
	s.face("player", "down");
	await s.narrate("バンッ！　スレに　だれかが\nなだれこんできた。");
	await s.say("nanj", "ボカロ作るスレとか、\nくっさいガキの　たまり場やろ　草");
	await J(s, "どうせ　一週間で　落ちるで", "冷やかしJ民");
	await s.say(
		"kiriko",
		"ここは、みんなが　吾輩を　作ってくれた\nスレ。……わらうのは、ゆるさないンゴ",
	);
	await s.say(
		"nanj",
		"お、生まれたての　ボカロが　イキっとる。\nほな、ちょっと　遊んだろか",
	);
	if ((await s.battle("g_rival_nanj", { canLose: true })) === "win") {
		await J(s, "ひえっ、つよ……！　ほな、また……", "冷やかしJ民");
		await s.say("nanj", "……やるやんけ");
	} else {
		// 負けてもエンジンが全回復して "lose" が返る（負けた回数はまとめカードで拾う）
		addLose(s);
		await s.say("kiriko", "……まだ。吾輩、まだ　立てるンゴ");
		await J(s, "しつこ……。ほな、また……", "冷やかしJ民");
		await s.say("nanj", "……根性　あるやんけ");
	}
	// 逃げるヤジにも「また来て」（締め出さない）。エンディングで回収する
	await s.say("kiriko", "……また、来てほしい。\nこんどは、うたを　聞きに");
	await J(s, "……は？　調子　くるうわ", "冷やかしJ民");
	s.se("flee");
	s.hide("raid_a");
	await s.say(
		"nanj",
		"ちょっと　見直したわ。\nくっさいとか　言うて、すまんかったな",
	);
	await s.say(
		"kiriko",
		"……吾輩も、おんJの　こと、\nまだ　なんにも　知らないンゴ。うたも",
	);
	await s.say(
		"nanj",
		"ほな、おわびに　これ持っとき。\n声を　ためて、また　鳴らせる機械や",
	);
	s.give("chikuonki");
	s.se("item");
	await s.narrate("ちいさな蓄音機を　てにいれた！");
	await s.say("kiriko", "あー、あー。……吾輩、蓄音キリコ、ンゴ！");
	s.give("rec_first");
	s.heal(); // ライバル戦で減った HP・こえをチュートリアル前に戻す
	await s.narrate(
		"レコード「はじめての声」を　ろくおんした！\nHPと　こえが　かいふくした。",
	);

	// kskボット乱入
	await s.shake(400);
	s.set("ksk_raid");
	s.show("bot1"); // show で when を評価し直し、bot1/bot2 が出る
	s.face("player", "down");
	await s.narrate("kskst　kskst　kskst　kskst");
	await J(s, "スクリプトやんけ！　スレが　流される！", "J民A");
	s.face("nanj", "player"); // (6,9) にいるので move は不要
	await s.say(
		"nanj",
		"スレ　流されたら　かなわんわ。\nキリコ、いくで！　ワイも　手伝ったる",
	);
	s.hide("nanj");
	s.join("nanj");
	s.set("nanj_in");
	await s.battle("g_tut");
	s.set("p_tut");
	s.hide("bot1");
	s.hide("bot2");

	// 目的
	s.face("player", "up");
	await s.say(
		"nanj",
		"ようやった。……ワイ？　名無しや。\n風吹けば名無し、ってな",
	);
	await s.say("nanj", "キリコの　名付け親は　ワイやで（自称）");
	s.face("j_b", "player");
	await J(s, "いや、さっきまで　あおっとったやろ", "J民B");
	await s.say(
		"nanj",
		"このスレ、1000レスで　完走や。\n完走したら「ええもん」が　見れるらしい",
	);
	await s.say("kiriko", "ええもん……うた、ンゴ？");
	await s.say(
		"nanj",
		"かもな。けど　この勢いやと　もたん。\n外で　宣伝や！　下の扉から　町へ出るで",
	);
	s.set("res", 101);
};

// ───────────────── エンディング ─────────────────

const ending = async (s: Story): Promise<void> => {
	const st = s.state;
	s.bgm("town");
	// 仲間をキリコのまわりに並べ、みんなをキリコに向ける（見た目だけ）
	s.place("follower:roze", 5, 6, "up");
	s.place("follower:teto", 7, 6, "up");
	s.place("follower:feris", 6, 7, "up");
	for (const id of [
		"j_a",
		"j_b",
		"j_c",
		"end_nanj",
		"end_bancho",
		"end_kantoku",
		"end_hinary",
		"end_mujje",
		"end_rei",
		"end_raid",
		"end_kosan",
		"end_puyu",
	])
		s.face(id, "player");
	await s.narrate("【安価】安価でボカロ作ろうぜ　1000/1000");
	await J(s, "1000取ったの　キリコ本人やんけ　草", "J民A");
	await s.say("nanj", "名言、できたやん");
	// 名言チャレンジ その3 と >>1000 をくらべる（その3 がないときは出さない）
	const jb = VARIANTS.meigenJb(st);
	if (jb) await J(s, jb, "J民B");
	await s.say("roze", "わたしにあって　キリコにないもの……\nもう、ないアル");
	await s.say("feris", "34キロなのに、中身　ぎっしりだね〜");
	await N(s, "……おめでとう。\n避難Jを研究している　ヒナリーです", "ヒナリー");
	await N(s, "ホゲェ！", "ムッジェ");
	// ぷゆゆ（町の小花のそばでの こたえ方。記録なしは既定の一言）
	await J(s, VARIANTS.puyu(st), "ぷゆゆ");
	// 番長の越え方・代打・古参ニキへの返し・!バルス で変わる
	await J(s, VARIANTS.bancho(st), "夏休みキッズ番長");
	await J(s, VARIANTS.kantoku(st), "テノヒラ監督");
	const kosan = VARIANTS.kosan(st);
	if (kosan) await J(s, kosan, "古参ニキ");
	await s.say("rei", VARIANTS.rei(st));
	// 序章の冷やかしJ民（「また、来てほしい」の回収）
	await J(
		s,
		"一週間で　落ちる　思たんやけどな。\n……ボカロスレも、もう　おんJの　文化やな",
		"冷やかしJ民",
	);
	await s.say("kiriko", "……また、来てくれたンゴ");
	await s.narrate("蓄音機から、ちいさな　声が　ながれた。");
	const B = { name: "ボツの声", noPortrait: true };
	await s.say("kiriko", "……悪くない　安価だったンゴ", B);
	await s.say("kiriko", VARIANTS.botsuVoice(st), B);
	s.face("player", "right");
	s.face("follower:teto", "left");
	await s.say("teto", "……で、「ええもん」って　なんだったのさ");
	await s.say("kiriko", "たぶん……これンゴ");
	await s.say("nanj", "次スレ　立てといたで。\n「蓄音キリコのうた　Part2」や");
	// 外野席のおでかけを見逃したときだけ
	const date = VARIANTS.nanjDate(st);
	if (date) await s.say("nanj", date);
	await s.say("teto", "……じゃあ、一曲いこうか。ボクと、君で");
	await s.say("kiriko", "吾輩、歌うンゴ！");
	// スタッフロール → まとめカード → おわり → タイトルへ
	await s.ending({ summary: threadSummary(st) });
};

// ───────────────── マップ ─────────────────

const events: EventDef[] = [
	{ id: "opening", x: 11, y: 9, trigger: "auto", once: true, run: opening },
	{
		id: "ending_ev",
		x: 1,
		y: 9,
		trigger: "auto",
		once: true,
		when: clear,
		run: ending,
	},

	// おんJ民（オープニングで扉から乗りこんでくる。onj_raid が立ってから出る）
	npc("nanj", 6, 9, "char:nanj", async (s) => s.say("nanj", "……"), {
		dir: "up",
		when: (st) => !!st.flags.onj_raid && !st.flags.nanj_in,
	}),
	npc(
		"raid_a",
		7,
		9,
		SPR.j_white,
		async (s) => J(s, "ほーん、で？", "冷やかしJ民"),
		{
			dir: "up",
			when: (st) => !!st.flags.onj_raid && !st.flags.nanj_in,
		},
	),

	// 誕生スレの住民（カウンターの向こう）
	npc("j_a", 3, 4, SPR.j_yakiu, async (s) =>
		J(s, clear(s.state) ? "1000取られたァ！" : "宣伝　たのんだで！", "J民A"),
	),
	npc("j_b", 9, 4, SPR.j_tights, async (s) =>
		J(s, clear(s.state) ? "ええんやで" : "名付け親は　ワイやで", "J民B"),
	),
	npc("j_c", 6, 3, SPR.j_hikoki, async (s) =>
		J(
			s,
			clear(s.state)
				? "……ちくおんの方が　語呂ええけどな"
				: "ちくね、な。覚えたで",
			"J民C",
		),
	),

	// kskボット（オープニングの間だけ）
	...(["bot1", "bot2"] as const).map((id, i) =>
		npc(
			id,
			i === 0 ? 4 : 8,
			9,
			SPR.e_tv,
			async (s) => N(s, "kskst　kskst", "kskボット"),
			{
				dir: "up",
				when: (st) => !!st.flags.ksk_raid && !st.flags.p_tut,
			},
		),
	),

	// 下の扉 → 町
	warp(
		"exit",
		6,
		10,
		{ map: "town", x: 11, y: 16, dir: "down" },
		{
			se: "door",
			when: (st) => !!st.flags.p_tut && !clear(st),
		},
	),

	// エンディングに集まる人たち
	npc(
		"end_nanj",
		4,
		7,
		"char:nanj",
		async (s) => s.say("nanj", "名言、できたやん"),
		{
			dir: "right",
			when: clear,
		},
	),
	npc(
		"end_bancho",
		2,
		6,
		SPR.j_kasa,
		async (s) => J(s, VARIANTS.bancho(s.state), "夏休みキッズ番長"),
		{
			dir: "right",
			when: clear,
		},
	),
	npc(
		"end_kantoku",
		10,
		6,
		SPR.j_black,
		async (s) => J(s, VARIANTS.kantoku(s.state), "テノヒラ監督"),
		{
			dir: "left",
			when: clear,
		},
	),
	npc(
		"end_hinary",
		2,
		9,
		SPR.hinary,
		async (s) => N(s, "避難Jを研究しているヒナリーです。", "ヒナリー"),
		{
			dir: "right",
			when: clear,
		},
	),
	npc(
		"end_mujje",
		10,
		9,
		SPR.mujje,
		async (s) => N(s, "ホゲェ！", "ムッジェ"),
		{
			dir: "left",
			when: clear,
		},
	),
	npc(
		"end_rei",
		8,
		7,
		"char:rei",
		async (s) => s.say("rei", "本日のログ、保守完了"),
		{
			dir: "left",
			when: clear,
		},
	),
	// 序章で冷やかしに来た J民（raid_a と同じマス。raid_a は nanj_in 以降出ない）
	npc(
		"end_raid",
		7,
		9,
		SPR.j_white,
		async (s) => J(s, "……保守しに　来た　だけや", "冷やかしJ民"),
		{
			dir: "up",
			when: clear,
		},
	),
	// 町の古参ニキ（bot1 と同じマス。bot1 は p_tut 以降出ない）
	npc(
		"end_kosan",
		4,
		9,
		SPR.j_shinkan,
		async (s) =>
			J(s, VARIANTS.kosan(s.state) ?? "……ええもん、見れたわ", "古参ニキ"),
		{
			dir: "right",
			when: clear,
		},
	),
	// ぷゆゆ（町の小花のそばの子。エンディングの輪のなか）。キリコ (6,6) より上に置いて、
	// キリコのほうを向くと 顔（下向き）が見えるようにする。下のマス (7,5) は空ける
	npc(
		"end_puyu",
		7,
		4,
		SPR.puyu,
		async (s) => J(s, VARIANTS.puyu(s.state), "ぷゆゆ"),
		{
			dir: "down",
			when: clear,
		},
	),
];

export const thread: MapDef = {
	id: "thread",
	name: "【安価】安価でボカロ作ろうぜ",
	bgm: null,
	tiles: {
		...INDOOR,
		D: INDOOR["~"], // 赤いじゅうたんが扉の外まで続く
	},
	rows: [
		"#############",
		"#HHHQHHHQHHH#",
		"#hhhhhhhhhhh#",
		"#.M...~...M.#",
		"#.....~.....#",
		"#.[=].~.[=].#",
		"#.....~.....#",
		"#.....~.....#",
		"#.F...~...F.#",
		"#.....~.....#",
		"######D######",
	],
	events,
	onEnter: async (s) => {
		if (s.flag("clear")) s.bgm("town");
		else if (s.flag("p_tut")) s.bgm("field2");
	},
};
