// おでかけ（デート）専用のマップ。data/story.ts の dateTrip で来て、場面が終わると元の場所へ戻る。
// プレイヤーが自由に歩くことはない（場面はすべてスクリプト）。
//
// 1枚のマップに、行き先を4つ横に並べている（あいだは黒い空白 GAP マス）。
// どの場面でも、となりの行き先は画面に入らない。
//   ロゼ     … 夜の屋台（麻婆豆腐）        x  0〜15
//   フェリス … 星の見える丘                x 28〜43
//   テト     … パン屋とカラオケ            x 56〜71
//   やきう   … おんJスタジアムの外野席     x 84〜99
//
// 行き先ごとに、ふだんのパレット（TOWN / INDOOR / STADIUM）の文字でマップを描き、
// 最後に stitch() で1枚につなぐ（文字は行き先ごとに別のタイルへ割り当て直す）。
// 下の ASCII の座標は行き先の中の座標。マップ全体の座標は「+ 行き先の x0」。
// キリコの到着マスは ODEKAKE にまとめてある（dateTrip の to に使える）。
//
// 相手（date_<id>）と小物は、フラグ date_now が相手の ID のときだけ現れる。
// 小物のうち odk_ で始まる一部は、さらに専用のフラグを立てたときだけ出る
//   （場面の途中で出すとき: s.set("odk_mabo"); s.show("odk_mabo_l") ← show で出現状態を読み直す）。

import type { EventDef, MapDef, TileDef } from "../../engine/defs";
import type { Dir } from "../../engine/types";
import { SPR } from "../sprites";
import { base, basePx, INDOOR, STADIUM, TOWN } from "../tiles";

// ───────────────── タイルの部品 ─────────────────

const tile = (
	color: string,
	layers: string[],
	passable: boolean,
	above?: string[],
): TileDef => ({ layers, color, passable, ...(above ? { above } : {}) });
/** 既存のタイルに小物を重ねる（通れるかどうかも変えられる）。 */
const on = (t: TileDef, extra: string[], passable = t.passable): TileDef => ({
	...t,
	layers: [...t.layers, ...extra],
	passable,
});

const VOID: TileDef = { layers: [], color: "#000", passable: false };

// 夜空（星は金平糖の小さなきらきら、月は黄色い玉）
const C_SKY = "#0b1030";
const STARS = base(3, 573);
const STARS4 = base(3, 574);
const STARS_Y = base(0, 573);
const MOON = base(4, 572);
const sky = (...l: string[]): TileDef => tile(C_SKY, l, false);
const SKY: Record<string, TileDef> = {
	"-": sky(),
	"'": sky(STARS),
	"+": sky(STARS4),
	y: sky(STARS_Y),
	m: sky(MOON),
};

const WOOD = base(0, 46);
const C_WOOD = "#b8905a";
const PAVE = base(5, 48);
const C_PAVE = "#8c8c90";
const LANTERN = base(2, 297); // 赤いちょうちん（大）
const LANTERNS = base(3, 297); // 赤いちょうちん（小・2つ）
const AWNING = base(1, 366); // 紅白しまの幕（すそがギザギザ）
const WIN_WHITE = basePx(48, 1382); // 木枠の窓

// ───────────────── ① ロゼ：夜の屋台 ─────────────────
// 町の裏通り。3軒の家の前に、麻婆豆腐の屋台（ひさし＋ちょうちん）。
//   -  ' + y m  夜空（星・月）
//   n ^ / z Z / a A  屋根（赤・わら・青）   % # W l  レンガ壁（l＝ちょうちん）
//   [ ] v  板壁（v＝窓）   ( ) w j  白壁（j＝ちょうちん）   D d  扉
//   ~ &  屋台のひさし（&＝両はしのちょうちん。キャラより手前）
//   _  屋台の板床   o  木箱＋調味料   K  大なべ   k  中華なべ
//   { = }  カウンター   c  カウンター＋急須
//   s  丸いす（座れる）   r t q  赤い縁台（左・中・右。座れる）
//   .  石畳   L  街灯   u  たる   h  麻袋   p  花の鉢   *  花壇
const rozeTiles: Record<string, TileDef> = {
	...TOWN,
	...SKY,
	l: on(TOWN["%"], [LANTERN]),
	j: on(TOWN["("], [LANTERN]),
	v: on(TOWN["["], [WIN_WHITE]),
	D: { ...TOWN.D, passable: false },
	d: { ...TOWN.d, passable: false },
	"~": tile(C_WOOD, [WOOD], false, [AWNING]),
	"&": tile(C_WOOD, [WOOD], false, [AWNING, LANTERNS]),
	_: tile(C_WOOD, [WOOD], true),
	o: tile(C_WOOD, [WOOD, base(4, 123), base(4, 138)], false),
	K: tile(C_WOOD, [WOOD, base(7, 141)], false),
	k: tile(C_WOOD, [WOOD, base(7, 142)], false),
	"{": tile(C_WOOD, [WOOD, base(1, 98)], false),
	"=": tile(C_WOOD, [WOOD, base(2, 98)], false),
	"}": tile(C_WOOD, [WOOD, base(3, 98)], false),
	c: tile(C_WOOD, [WOOD, base(2, 98), base(6, 138)], false),
	s: tile(C_PAVE, [PAVE, base(4, 105)], true),
	r: tile(C_PAVE, [PAVE, base(2, 298)], true),
	t: tile(C_PAVE, [PAVE, base(3, 298)], true),
	q: tile(C_PAVE, [PAVE, base(4, 298)], true),
	u: tile(C_PAVE, [PAVE, base(3, 125)], false),
	h: tile(C_PAVE, [PAVE, base(0, 125)], false),
};
const rozeRows = [
	"-'---+----'--m-+", // y0  夜空
	"'--y---'---+--'-", // y1
	"nnnnnzzzzzzaaaaa", // y2  屋根
	"^^^^^ZZZZZZAAAAA", // y3
	"%W%%l[v[[v[(j(w(", // y4  壁（ちょうちん (4,4)(12,4)）
	"###D#]]]]]]))d))", // y5
	"..L..&~~~~&..L..", // y6  屋台のひさし (5..10,6)、街灯 (2,6)(13,6)
	".uh..o___Kk...p.", // y7  屋台の中: 店主 (7,7)、大なべ (9,7)
	".u...{c===}.....", // y8  カウンター。麻婆豆腐 (7,8)(8,8)（フラグ odk_mabo）
	"......ssss......", // y9  丸いす (6..9,9)。キリコ (7,9)・ロゼ (8,9) が座る
	"................", // y10 ねこ (2,10)
	"p..........rtq.p", // y11 到着: キリコ (7,11)・ロゼ (8,11)。赤い縁台 (11..13,11)
	"**.**......**.**", // y12 花壇
];

// ───────────────── ② フェリス：星の見える丘 ─────────────────
// 夜空に浮かぶような高台。大きな木・花・丸太のベンチ。崖の石段の下に町の灯り。
//   -  ' + m  夜空
//   7 8 9 / 4 5 6 / 1 2 3  高台の草地（テンキーの並び。7 8 9 と角は通れない）
//   ( c ) / [ _ ]  崖（上段・下段）   a b / d e  崖の石段（通れる）
//   T  大きな木（3×3。t はその下の草地・通れない）   h H  丸太のベンチ（座れる）
//   * % w u  花（ピンク・黄・白・青）   W  白い花の茂み   R Y  バラの茂み（赤・黄）
//   . , ;  崖の下の町の灯り
const C_NIGHT = "#141a36";
const PLAT = (c: number, r: number, pass = true): TileDef =>
	tile(C_SKY, [base(c, r)], pass);
const GRASS = base(1, 16);
const lights = (...l: string[]): TileDef => tile(C_NIGHT, l, false);
const ferisTiles: Record<string, TileDef> = {
	" ": VOID,
	...SKY,
	"7": PLAT(0, 15, false),
	"8": PLAT(1, 15, false),
	"9": PLAT(2, 15, false),
	"4": PLAT(0, 16),
	"5": PLAT(1, 16),
	"6": PLAT(2, 16),
	"1": PLAT(0, 17, false),
	"2": PLAT(1, 17),
	"3": PLAT(2, 17, false),
	"(": PLAT(0, 18, false),
	c: PLAT(1, 18, false),
	")": PLAT(2, 18, false),
	"[": PLAT(0, 19, false),
	_: PLAT(1, 19, false),
	"]": PLAT(2, 19, false),
	a: tile(C_SKY, [base(1, 18), base(6, 52)], true),
	b: tile(C_SKY, [base(1, 18), base(7, 52)], true),
	d: tile(C_SKY, [base(1, 19), base(6, 53)], true),
	e: tile(C_SKY, [base(1, 19), base(7, 53)], true),
	T: tile(C_SKY, [GRASS], false, [base(3, 612, 3, 3)]),
	t: tile(C_SKY, [GRASS], false),
	h: tile(C_SKY, [GRASS, base(6, 10)], true),
	H: tile(C_SKY, [GRASS, base(7, 10)], true),
	"*": tile(C_SKY, [GRASS, base(5, 11)], true),
	"%": tile(C_SKY, [GRASS, base(7, 11)], true),
	w: tile(C_SKY, [GRASS, base(4, 11)], true),
	u: tile(C_SKY, [GRASS, base(6, 11)], true),
	W: tile(C_SKY, [GRASS, base(6, 601, 1, 2)], false),
	R: tile(C_SKY, [GRASS, base(6, 603)], false),
	Y: tile(C_SKY, [GRASS, base(7, 603)], false),
	".": lights(),
	",": lights(STARS_Y),
	";": lights(base(0, 574)),
};
const ferisRows = [
	"-'---+---'---+-'", // y0  夜空（流れ星 odk_star は (15,1) から左へ）
	"'---'------m'---", // y1
	"--+----'----+--'", // y2
	"-'788888888889-+", // y3  高台の上のふち
	"'-4Wttt5*55%R6--", // y4  大きな木 (5,5)（木の下 (4..6,3..5) は通れない）
	"-+4wtTt55hH5u6'-", // y5  丸太のベンチ (9,5)(10,5)
	"'-4%55*5555wY6-'", // y6
	"--122222222223+-", // y7  到着: キリコ (7,7)・フェリス (8,7)（石段の上）
	"-'(ccccabcccc)-'", // y8  崖。石段 (7..8,8..9)
	"'-[____de____]'-", // y9
	".,..;.,..,..;.,.", // y10 崖の下の町の灯り
	",..;..,.;..,..;.", // y11
	"..,..;..,.;..,..", // y12
];

// ───────────────── ③ テト：パン屋とカラオケ ─────────────────
// 左はパン屋のカウンターと棚、まん中は喫茶のテーブル、右は小さなカラオケのステージ。
//   INDOOR の文字（# H h W C . ~ F f 4 5 6 1 2 3 [ ] G g D）に足したもの:
//   b  パンの棚   c  戸棚   j  粉の袋   + * &  カウンター＋パン（丸パン・食パン・かご）
//   K  壁のカラオケ画面   { }  ステージ＋スピーカー   m  ステージ＋マイク   M  ステージ＋歌詞モニター
//   e  いす（座れる）   o  丸テーブル
const BREAD = base(6, 139);
const tetoTiles: Record<string, TileDef> = {
	...INDOOR,
	b: tile(C_WOOD, [WOOD, base(4, 554, 1, 2)], false),
	c: tile(C_WOOD, [WOOD, base(5, 554, 1, 2)], false),
	"+": on(INDOOR["="], [BREAD]),
	"*": on(INDOOR["="], [base(7, 139)]),
	"&": on(INDOOR["="], [base(4, 125), BREAD]),
	j: tile(C_WOOD, [WOOD, base(0, 125)], false),
	K: on(INDOOR.H, [base(7, 486)]),
	"{": on(INDOOR["7"], [base(4, 540)], false),
	"}": on(INDOOR["9"], [base(4, 540)], false),
	m: on(INDOOR["8"], [SPR.mic], false),
	M: on(INDOOR["8"], [base(6, 486)], false),
	e: tile(C_WOOD, [WOOD, base(2, 109)], true),
};
const tetoRows = [
	"################", // y0
	"#HWHHWHHHHHHKHH#", // y1  カラオケ画面 (12,1)
	"#hhhhhhhhhChhhC#", // y2  赤い幕 (10,2)(14,2)
	"#bbc..bFGg{mMm}#", // y3  パンの棚、ピアノ (8,3)(9,3)、ステージ (10..14,3..5)。マイク (11,3)(13,3)
	"#.....j...45556#", // y4  パン屋さん (3,4)、粉の袋 (6,4)。歌う位置 (11,4)(13,4)
	"#[+*+&]...12223#", // y5  パンのカウンター (1..6,5)
	"#..........~~~.#", // y6  カウンターの前 (3,6)(4,6)
	"#..........~~~.#", // y7
	"#.eoe......~~~.#", // y8  テーブル (3,8)（パン皿 odk_pan）、いす (2,8)(4,8)
	"#.............f#", // y9
	"#.eoe..........#", // y10 お客 (4,10)
	"#F............F#", // y11 到着: キリコ (7,11)・テト (8,11)
	"#######D########", // y12 入口 (7,12)
];

// ───────────────── ④ やきう：おんJスタジアムの外野席 ─────────────────
// ナイターの外野席。木のベンチの列、手すり、ツタのフェンスの向こうに外野の芝。
//   STADIUM の文字（S s V v , ; :）に足したもの:
//   -  ' + m  夜空   L  照明   Q q  バックスクリーン（左右）
//   =  ベンチの列（座れる）   |  通路の階段   r  手すり
const stadiumTiles: Record<string, TileDef> = {
	...STADIUM,
	...SKY,
	L: tile("#8a8a8a", [base(4, 52), "sp:2gTYec"], false),
	Q: tile("#8a8a8a", [base(4, 52), base(0, 485, 1, 2)], false),
	q: tile("#8a8a8a", [base(4, 52), base(1, 485, 1, 2)], false),
	"=": tile("#a07040", [base(1, 52)], true),
	"|": tile("#8a8a8a", [base(4, 52)], true),
	r: tile(C_PAVE, [PAVE, base(5, 32)], false),
};
const nanjRows = [
	"-'---+--'---+-'-", // y0  夜空
	"SLSSSSSQqSSSSSLS", // y1  スタンドの上段と照明、バックスクリーン (7,1)(8,1)
	"ssssssssssssssss", // y2
	"=====|==========", // y3  うしろのベンチ（通路 (5,3..5)）
	"SSSSS|SSSSSSSSSS", // y4
	"=====|==========", // y5  最前列。キリコ (7,5)・やきう (8,5) が座って到着
	"rrrrrrrrrrrrrrrr", // y6  手すり
	"VVVVVVVVVVVVVVVV", // y7  ツタの外野フェンス
	"vvvvvvvvvvvvvvvv", // y8
	"::::::::::::::::", // y9  フェンス前の土（ボール odk_ball は (8,11) から上へ）
	",,,,,,,,,,,,,,,,", // y10 外野手 (8,10)
	";;;;;;;;;;;;;;;;", // y11
	",,,,,,,,,,,,,,,,", // y12
];

// ───────────────── 1枚につなぐ ─────────────────

const GAP = 12;
const SPOT_W = 16;
type Spot = { tiles: Record<string, TileDef>; rows: string[] };
const SPOTS: Spot[] = [
	{ tiles: rozeTiles, rows: rozeRows },
	{ tiles: ferisTiles, rows: ferisRows },
	{ tiles: tetoTiles, rows: tetoRows },
	{ tiles: stadiumTiles, rows: nanjRows },
];
/** 行き先の左端の x（マップ全体の座標）。 */
export const SPOT_X = {
	roze: 0,
	feris: SPOT_W + GAP,
	teto: (SPOT_W + GAP) * 2,
	nanj: (SPOT_W + GAP) * 3,
} as const;

/**
 * 行き先ごとの文字を、マップ全体で重ならない文字（私用領域 U+E000〜）に割り当て直してつなぐ。
 * 行き先のパレットに無い文字はそのまま残す（validate が「未定義のタイル文字」として見つける）。
 */
const stitch = (
	spots: Spot[],
): { tiles: Record<string, TileDef>; rows: string[] } => {
	const tiles: Record<string, TileDef> = { " ": VOID };
	const h = Math.max(...spots.map((s) => s.rows.length));
	const rows: string[] = Array.from({ length: h }, () => "");
	let next = 0xe000;
	spots.forEach((spot, i) => {
		const map = new Map<string, string>([[" ", " "]]);
		for (let y = 0; y < h; y++) {
			const cells = [...(spot.rows[y] ?? "")];
			let line = i ? " ".repeat(GAP) : "";
			for (let x = 0; x < SPOT_W; x++) {
				const ch = cells[x] ?? " ";
				let to = map.get(ch);
				if (to === undefined) {
					const t = spot.tiles[ch];
					if (t) {
						to = String.fromCharCode(next++);
						tiles[to] = t;
					} else to = ch;
					map.set(ch, to);
				}
				line += to;
			}
			rows[y] += line;
		}
	});
	return { tiles, rows };
};
const { tiles, rows } = stitch(SPOTS);

// ───────────────── 到着マス（dateTrip の to） ─────────────────

/**
 * キリコの到着マス。例: `dateTrip(s, "roze", { map: "odekake", ...ODEKAKE.roze }, scene)`
 * 相手（date_<id>）はそのすぐ右どなり。
 */
export const ODEKAKE = {
	roze: { x: SPOT_X.roze + 7, y: 11, dir: "up" },
	feris: { x: SPOT_X.feris + 7, y: 7, dir: "up" },
	teto: { x: SPOT_X.teto + 7, y: 11, dir: "up" },
	nanj: { x: SPOT_X.nanj + 7, y: 5, dir: "down" },
} as const satisfies Record<string, { x: number; y: number; dir: Dir }>;

// ───────────────── イベント ─────────────────

type Who = keyof typeof SPOT_X;
const now = (who: Who) => (st: { flags: Record<string, unknown> }) =>
	st.flags.date_now === who;

/** デートの相手（キリコの到着マスの右どなり）。 */
const partner = (who: Who): EventDef => ({
	id: `date_${who}`,
	x: ODEKAKE[who].x + 1,
	y: ODEKAKE[who].y,
	dir: ODEKAKE[who].dir,
	sprite: `char:${who}`,
	trigger: "talk",
	when: now(who),
});

/** 場面の人（話しかけると一言）。 */
const extra = (
	who: Who,
	id: string,
	x: number,
	y: number,
	sprite: string,
	dir: Dir,
	name: string,
	line: string,
	speaker: string | null = null,
): EventDef => ({
	id,
	x: SPOT_X[who] + x,
	y,
	dir,
	sprite,
	trigger: "talk",
	when: now(who),
	run: async (s) => {
		await s.say(speaker, line, { name });
	},
});

/** 小物（フラグ flag が立っているときだけ出る。向きなし・通り抜けできる）。 */
const prop = (
	who: Who,
	id: string,
	x: number,
	y: number,
	sprite: string,
	flag: string,
): EventDef => ({
	id,
	x: SPOT_X[who] + x,
	y,
	sprite,
	trigger: "talk",
	fixedDir: true,
	through: true,
	when: (st) => st.flags.date_now === who && !!st.flags[flag],
});

const events: EventDef[] = [
	// ① ロゼ：夜の屋台
	partner("roze"),
	extra(
		"roze",
		"odk_yatai",
		7,
		7,
		SPR.townsfolk,
		"down",
		"原住民",
		"(´・ω・｀) いらっしゃい。マーボー、あるよ",
	),
	extra("roze", "odk_cat", 2, 10, SPR.cat, "down", "ねこ", "にゃあ"),
	prop("roze", "odk_mabo_l", 7, 8, base(4, 137), "odk_mabo"),
	prop("roze", "odk_mabo_r", 8, 8, base(4, 137), "odk_mabo"),
	// ② フェリス：星の見える丘
	partner("feris"),
	prop("feris", "odk_star", 15, 1, base(2, 196), "odk_star"),
	// ③ テト：パン屋とカラオケ
	partner("teto"),
	extra(
		"teto",
		"odk_baker",
		3,
		4,
		SPR.shopkeeper,
		"down",
		"パン屋",
		"いらっしゃい。フランスパン、やきたてだよ",
	),
	extra(
		"teto",
		"odk_guest",
		4,
		10,
		SPR.woman,
		"left",
		"お客",
		"ここの　メロンパン、おいしいのよ",
	),
	prop("teto", "odk_pan", 3, 8, BREAD, "odk_pan"),
	// ④ やきう：外野席
	partner("nanj"),
	extra(
		"nanj",
		"odk_fan1",
		2,
		3,
		SPR.j_gakuran,
		"down",
		"観客",
		"ナイターは　ええなあ",
		"nanj",
	),
	extra(
		"nanj",
		"odk_fan2",
		13,
		5,
		SPR.j_yosuko,
		"down",
		"観客",
		"外野は　ホームランが　飛んでくるで",
		"nanj",
	),
	extra(
		"nanj",
		"odk_fielder",
		8,
		10,
		SPR.j_yakiu,
		"up",
		"外野手",
		"……（ボールを　待っている）",
		"nanj",
	),
	prop("nanj", "odk_ball", 8, 11, base(0, 392), "odk_ball"),
];

export const odekake: MapDef = {
	id: "odekake",
	name: "おでかけ",
	// 場面ごとに s.bgm で曲を決める。
	bgm: null,
	outside: "#000",
	tiles,
	rows,
	events,
};
