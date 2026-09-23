// スレ街道（第一章）。設計書 §8-3・§8-4・§11-3。
// 町の北口から北へ。屋台でロゼが加入し、橋の前の夏休みキッズ番長（B1）を倒すと
// 北の洞窟（過去ログ倉庫）へ行けるようになる。川では釣り（任意）。

import type { EventDef, MapDef, Story, TileDef } from "../../engine/defs";
import { chest, npc, warp, warpLine } from "../helpers";
import { SPR } from "../sprites";
import { ks, phono } from "../story";
import { base, FIELD } from "../tiles";

// ───────────────── 地形 ─────────────────
// FIELD パレットに、屋台まわりと釣り場の見た目だけを足す（通れるかどうかは §11-3 のまま）。
//   a  屋台のひさし（紅白のしま。キャラより手前に描く。下は草むらのまま）
//   l  屋台のひさし＋ちょうちん（ひさしの両はし）
//   y  屋台の板床（安全）
//   f  釣り場（川にハスの葉。通れない）
const AWNING = base(1, 366); // 紅白しまの幕（すそがギザギザ）
const LANTERN = base(3, 297); // 赤いちょうちん（小・2つ）

const tiles: Record<string, TileDef> = {
	...FIELD,
	a: { ...FIELD[","], above: [AWNING] },
	l: { ...FIELD[","], above: [AWNING, LANTERN] },
	y: { layers: [base(0, 46)], color: "#b8905a", passable: true },
	f: { ...FIELD.w, layers: [...FIELD.w.layers, base(7, 12)] },
};

// ───────────────── セリフの部品 ─────────────────
const BANCHO = "夏休みキッズ番長";
/** J民系のモブ（黄色の名前欄・読み上げなし）。 */
const J = (s: Story, name: string, text: string) =>
	s.say("nanj", text, { name });
/** J民以外の人（名前欄だけ）。 */
const N = (s: Story, name: string, text: string) => s.say(null, text, { name });

// ───────────────── イベント ─────────────────

/**
 * §8-3 ロゼの加入（屋台の客）。rival-joins §2。
 * 名前安価で「束音ロゼ」を名乗りかけた新人を腕だめし → 勝つと和解して加入。
 * 負けたら（canLose。エンジンが全回復）「もう一度」か「ひと休み」を選ぶ。
 * ひと休みなら何も立てずに終わり、もう一度話すと最初から。
 */
const roze: EventDef = {
	id: "roze",
	x: 5,
	y: 14,
	dir: "up",
	sprite: "char:roze",
	trigger: "talk",
	when: (st) => !st.flags.roze_in,
	run: async (s) => {
		await s.narrate("屋台から、からい　においが　する。");
		await s.say("roze", "……いらっしゃいアル。わたしは　客アル");
		await ks(s, "……足が、ないンゴ！　おばけンゴ！");
		await s.say("roze", "失礼アル。体重0なだけアル");
		await s.say("nanj", "束音ロゼやんけ！　おんJ安価ボカロの　先輩や");
		await s.say("roze", "……ふうん。あなたが　キリコアルね");
		await s.say(
			"roze",
			"「わたしの名前を　名乗りかけた\n新人が　いる」って　聞いたアル",
		);
		await s.say(
			"roze",
			"名前安価で「束音ロゼでどうや？」って\n言われてた子アルね。見てたアル",
		);
		await ks(s, "……それ、却下された　やつンゴ");
		await s.say("roze", "本物の　ボカロか、\n確かめさせて　もらうアル");
		await s.say("nanj", "先輩の　かわいがりや！　気ぃつけや");
		for (;;) {
			if ((await s.battle("g_rival_roze", { canLose: true })) === "win") break;
			await s.say(
				"roze",
				"……まだ　声が　かたいアル。\nもう一度、聞かせるアル？",
			);
			if ((await s.choose(["もう一度！", "ひと休みする"])) === 1) {
				await s.say(
					"roze",
					"屋台で　待ってるアル。\n麻婆豆腐でも　食べてくるアル",
				);
				return;
			}
		}
		await s.say("roze", "……いい声アル。\n名前は、あなたの　ものアル");
		await ks(s, "……吾輩の、名前");
		await s.narrate(
			"ひゅう、と　つよい風。\nロゼの　ツーサイドアップが　宙を　舞った。",
		);
		await s.say("roze", "……見なかったことに　するアル");
		await s.say(
			"roze",
			"わたしもね、一度　消えかけたアル。\n公式が、ある日　ぜんぶ　なくなったアル",
		);
		await s.say("roze", "でも、覚えててくれた人たちが\n歌わせてくれたアル");
		await s.say(
			"roze",
			"きびしい　レスも　いっぱい　来たアル。\n……それも、聞いてくれてた　しょうこアル",
		);
		await s.say("roze", "後輩を　ほっとけないアル。いっしょに行くアル");
		s.hide("roze");
		s.join("roze");
		s.set("roze_in");
		s.se("item");
		await s.narrate("ロゼが　なかまに　なった！");
	},
};

/** §8-4 B1 夏休みキッズ番長（橋の前）。 */
const bancho: EventDef = {
	id: "bancho",
	x: 12,
	y: 8,
	dir: "down",
	sprite: SPR.j_kasa,
	trigger: "talk",
	when: (st) => !st.flags.b1,
	run: async (s) => {
		await J(
			s,
			BANCHO,
			"ここは　ワイらの　ナワバリや！\n通りたかったら　勝負せえ！",
		);
		if (!s.flag("roze_in")) {
			await s.say(
				"nanj",
				"……さすがに　2人は　きついで。\n屋台で　ひと休み　してこか",
			);
			return;
		}
		await s.say("roze", "宿題は　おわったアルか？");
		await J(s, BANCHO, "……あとで　やる！　いくで！");
		if ((await s.battle("g_b1")) !== "win") return;
		await J(s, BANCHO, "あかん、明日　登校日やんけ！\nほな、また……");
		// 番長と子分が走り去る（b1 を立てて when を評価し直す）
		s.set("b1");
		s.se("flee");
		s.show("bancho");
		await s.narrate(
			"見物の　なんJ民が　つぎつぎに　かきこんだ。\n「ええ試合やった」「キリコがんばれ」",
		);
		s.set("res", 350);
		s.se("item");
		await s.narrate("蓄音機に　レスが　たまった！（350/1000）");
		await ks(s, "名言チャレンジ、その1。\n「釣れた魚は、ぜんぶ　吾輩のもの」");
		await s.say("roze", "それは　ただの　欲アル");
	},
};

/** 子分（番長の両どなり）。 */
const kids = (id: string, x: number): EventDef =>
	npc(id, x, 8, SPR.j_sekimen, ["番長に　話　とおしてや"], {
		who: "nanj",
		name: "夏休みキッズ",
		dir: "down",
		when: (st) => !st.flags.b1,
	});

/** 屋台の店主（回復）。 */
const yatai = npc(
	"yatai",
	4,
	12,
	SPR.townsfolk,
	async (s) => {
		await N(s, "原住民", "(´・ω・｀) マーボー、たべてく？");
		if ((await s.choose(["たべる", "いまは　いい"], { cancel: 1 })) === 1) {
			await N(s, "原住民", "(´・ω・｀) そう……");
			return;
		}
		s.heal();
		s.se("inn");
		await s.narrate(
			"あつあつの　マーボーを　たべた。\nHPと　こえが　かいふくした！",
		);
		await ks(s, "からい……けど　げんきが　でたンゴ");
		if (s.flag("roze_in")) await s.say("roze", "ここのは　本場の　味アル");
	},
	{ dir: "down" },
);

/** 釣り（川の (4,7)。(4,8) から上を向いて調べる）。最大3回。 */
const fish: EventDef = {
	id: "fish",
	x: 4,
	y: 7,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		const done = Number(s.flag("fish_n") ?? 0);
		if (done >= 3) {
			await ks(s, "きょうは　もう　釣れないンゴ");
			return;
		}
		await s.narrate("流れの　ゆるい　ところに\n魚の　かげが　見える。");
		if (done === 0) await ks(s, "釣りなら、ちょっと　自信が　あるンゴ");
		if ((await s.choose(["つる", "やめる"], { cancel: 1 })) === 1) return;
		await s.narrate("ウキが　ぴくっと　うごいた。");
		if ((await s.choose(["あわせる", "まつ"])) === 0) {
			await s.narrate("はやすぎた！　にげられた……");
			return;
		}
		await s.narrate("ぐぐっと　しずんだ！");
		if ((await s.choose(["いまだ！", "まつ"])) === 1) {
			await s.narrate("……にげられた。");
			return;
		}
		const n = done + 1;
		s.set("fish_n", n);
		s.se("item");
		if (n === 1) {
			s.give("spray");
			await s.narrate("ワカサギと　いっしょに\nのどスプレーが　つれた！");
		} else if (n === 2) {
			s.give("candy", 2);
			await s.narrate("長ぐつの　中に　のどあめが　はいっていた！");
		} else {
			s.give("mabo");
			await s.narrate("なぜか　マーボーが　つれた");
			if (s.flag("roze_in")) await s.say("roze", "……いただくアル");
		}
	},
};

/** 看板（看板タイルの上。見た目はタイル側）。 */
const signRoad: EventDef = {
	id: "sign_road",
	x: 13,
	y: 17,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		await s.narrate(
			"↑ 過去ログ倉庫（橋の　むこう）\n→ やきう場は　町の東門から",
		);
	},
};

// ───────────────── マップ ─────────────────

export const road: MapDef = {
	id: "road",
	name: "スレ街道",
	bgm: "field",
	tiles,
	// 24×20。§11-3 の ASCII と同じ配置（a/l/y/f と花 * % は見た目だけの差し替え）。
	rows: [
		"^^^^^^^^^^^^^^^^^^^^^^^^", // y0
		"^^TT,,,,,,,,C,,,,,,,,TT^", // y1  洞窟の入口 (12,1) → kakolog
		"^T,,,,,,,,,,,,,,,,,,,,T^", // y2  kakolog からの到着 (12,2)
		"^,,FFF,,,,,,,,,,,,,,.,,^", // y3  宝箱 (20,3)
		"^,,FFF,,,,,,,,,,,,,,,,,^", // y4
		"^,,,,,,,,,,,,,,,,,,,,,,^", // y5
		"^.*.........:.......%..^", // y6
		"wwwwfwwwwwwwHwwwwwwwwwww", // y7  川。橋 (12,7)。釣り (4,7)
		"^..%........:......*...^", // y8  番長 (12,8)、子分 (11,8)(13,8)
		"^,,,,,,,,,,,:,,,,,,,,,,^", // y9  番長の前 (12,9) まで道
		"^,,TT,,,,,,,:,,,,,,FF,,^", // y10
		"^,,laaal,,,,:,,,,,,,,,,^", // y11 屋台のひさし
		"^,,yyyyy,,,,:,,,,,,,,,,^", // y12 屋台: 店主 (4,12)、蓄音機 (6,12)
		"^,,::::::::::,,,,,,,,,,^", // y13 屋台への道（安全）
		"^,,*...%,,,,,,,,,,,,,,,^", // y14 ロゼ (5,14)
		"^,,,,,,,,,,,,,,,,,TT,,,^", // y15
		"^,.,,,,,,,,,,,,,,,,,,,,^", // y16 宝箱 (2,16)
		"^,,,,,,,,,,,:!,,,,,,,,,^", // y17 看板 (13,17)
		"^TT,,,,,,,,::,,,,,,,,TT^", // y18 町からの到着 (11,18)(12,18)
		"^^^^^^^^^^^::^^^^^^^^^^^", // y19 南口 (11,19)(12,19) → town
	],
	encounters: {
		rate: 0.08,
		groups: ["g_road1", "g_road2", "g_road3", "g_road4"],
	},
	events: [
		// 出入口
		...warpLine(
			"to_town",
			[
				[11, 19],
				[12, 19],
			],
			(i) => ({ map: "town", x: 11 + i, y: 1, dir: "down" }),
		),
		warp(
			"to_kakolog",
			12,
			1,
			{ map: "kakolog", x: 11, y: 16, dir: "up" },
			{ se: "stairs" },
		),
		// 屋台
		yatai,
		phono("phono_road", 6, 12),
		roze,
		// 橋の番長（B1）
		bancho,
		kids("kids1", 11),
		kids("kids2", 13),
		// そのほか
		fish,
		signRoad,
		...chest("road1", 2, 16, "candy", 2),
		...chest("road2", 20, 3, "mabo", 1),
	],
};
