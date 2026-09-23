// 過去ログ倉庫（第二章）。設計書 §8-5・§11-4。
// 落ちたスレが流れつく倉庫。本棚の前で「……ンゴ……」の伏線（whisper）→ ロゼが本棚をどかす →
// 蓄音機（B2 前のセーブ）→ 奥の間でムッジェの相手をしていたフェリス → やきう民を見てかんちがい →
// B2（ムッジェ＆フェリス）→ 和解してフェリス加入 → 町へ浮上（600/1000）。rival-joins.md §3。

import type { EventDef, MapDef, Story, TileDef } from "../../engine/defs";
import { chest, npc, warp } from "../helpers";
import { SPR } from "../sprites";
import { ks, phono } from "../story";
import { base, CAVE, PROPS } from "../tiles";

// ───────────────── 地形 ─────────────────
// CAVE パレットに足すもの（通れるかどうかは §11-4 のまま）。
//   ,  暗い床（エンカウント）      p  暗い床＋ちぎれたレスの紙くず（エンカウント）
//   B  古いスレの本棚（通れない）  b  くずれかけた本棚（通れない）
//   K k  倒れた本棚（左右。通れない）
//   [ ]  岩壁にかかった古い掲示板（奥の間の正面。左右。通れない）
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

// ───────────────── イベント ─────────────────

/** 第二章の章カード（入ったとき1回だけ）。 */
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
		if (s.flag("kakugari"))
			await ks(s, "角刈り……。あの夜、いちど\nえらばれた　髪型ンゴ");
		s.bgm("dungeon");
	},
};

/** こわれた掲示板（再安価で流れたレスの吹きだまり）。左右どちらを調べても同じ。 */
const botsuRun = async (s: Story): Promise<void> => {
	await s.narrate(
		"再安価で　流れた　レスの　ふきだまり。\n……ンゴ……と　聞こえた　気がする",
	);
	if (s.flag("kakugari"))
		await ks(s, "吾輩が　えらんだ　角刈りも、\nここに　流れついたンゴ？");
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

/** 奥の間の入口：ムッジェ＆フェリス → B2 → 和解してフェリス加入 → 町へ浮上。 */
const bossfloor: EventDef = {
	id: "bossfloor",
	x: 10,
	y: 6,
	trigger: "touch",
	once: true,
	when: (st) => !st.flags.b2,
	run: async (s) => {
		await s.move("player", "u");
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
		await s.shake(300);
		await N(s, "ムッジェ", "ホゲェ！！");
		// B2 = ムッジェ＋フェリス（canLose なし。負けたら通常の「もういちど」）
		if ((await s.battle("g_b2")) !== "win") return;
		await N(s, "ムッジェ", "ホゲェ……♪");
		await s.say("feris", "……あれ？　ムッジェ、たのしそう");
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
		await s.say("nanj", "まあ、やきう民は　前科　あるからな……");
		// 2009年のマスコット争いの和解は第三章（テノヒラ監督戦）へ。ここは前ふりだけ。
		// 「その話」だと直後の「私ね、2009年に…」と食いちがうので、先送りするのは決着だけ
		// （スタジアムの「今夜は　その　つづきだね〜」につながる）。
		await s.say("feris", "ふふ。その　決着は、また　こんどね〜");
		await ks(s, "ムッジェの　バナー、ちゃんと　見る。約束する");
		await N(s, "ムッジェ", "ホゲェ！");
		await s.say(
			"feris",
			"「また　あそびに　きてな」だって〜。\n私も　いっしょに　行っていい？",
		);
		s.hide("feris");
		s.join("feris");
		s.set("feris_in");
		s.se("item");
		await s.narrate("フェリスが　なかまに　なった！");
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
		await ks(
			s,
			"名言チャレンジ、その2。\n「囲碁の石は、打ったら　消えないンゴ」",
		);
		await s.say("feris", "ふふ、それは　ちょっと　いいかも〜");
		await s.say("nanj", "お、東門が　あいとるで。今夜は　ナイターや！");
	},
};

/** ヒナリー（3回目だけセリフが変わる）。 */
const hinary = npc(
	"hinary",
	13,
	15,
	SPR.hinary,
	async (s) => {
		const n = Number(s.flag("hinary_n") ?? 0) + 1;
		s.set("hinary_n", n);
		if (s.flag("feris_in"))
			await s.say("feris", "ヒナリーちゃん、また　研究？");
		await N(
			s,
			"ヒナリー",
			n >= 3
				? "……避難Jを研究しているヒナリーです。\n（なにか　言いたそうだ）"
				: "避難Jを研究しているヒナリーです。",
		);
	},
	{ dir: "down" },
);

// ───────────────── マップ ─────────────────

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
		"#wwwwwwwww[]wwwwwwwww#", // y2  奥の間の正面に古い掲示板
		"#,,,,#..........#,,,,#", // y3  奥の間: フェリス (10,3)、ムッジェ (11,3)（B2 後は mujje_after）
		"#,,,,#..........#,,,p#", // y4  宝箱 (2,4)
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
		"#,,p,,,,,,,,,.,,,,,,,#", // y15 ヒナリー (13,15)
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
		...chest("kako1", 2, 4, "hane", 1),
		...chest("kako2", 19, 12, "candy", 2),
	],
};
