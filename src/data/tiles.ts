// マップチップ。ゲームに同梱した 16px のチップシートから1マスずつ切り出して使う。
//
//   base(c, r)  … public/assets/rpg-reze/Base.png（WOLF RPG エディター風の基本チップ。8列×652行）
//   field(c, r) … public/assets/rpg-reze/field.png（ワールドマップ用。30×16）
//   rpgen(c, r) … public/assets/rpgen/map.png（RPGEN のドラクエ風チップ。30×16）
//
// (c, r) はマス単位の列・行。w×h マスぶん切り出すと、マスの「下端そろえ・左右中央」で描かれる
// （16x32 の扉や本棚は上のマスへ、32x32 の木は左右と上へはみ出す）。
// 2マス幅以上の物は、はみ出しが後から描くマスに消されないよう `above`（キャラより手前）に入れ、
// その物が覆うマスはすべて通れないようにしておく。
//
// マップの文字 → タイルの対応表（パレット）を環境ごとに用意している。
// マップごとに `{ ...TOWN, X: {...} }` のように足して使う。どのパレットでも " " は外側の黒。
// よく使う文字: "." 地面 / "#" 壁・天井 / "~" 水 / "T" 木 / "D" 扉 / "=" 道・カウンター

import type { TileDef } from "../engine/defs";

const BASE = "pub:assets/rpg-reze/Base.png";
const FIELD_PNG = "pub:assets/rpg-reze/field.png";
const RPGEN_PNG = "pub:assets/rpgen/map.png";

const cut = (sheet: string, c: number, r: number, w: number, h: number) =>
	`${sheet}#${c * 16},${r * 16},${w * 16},${h * 16}`;

/** Base.png の (c, r) マスから w×h マス。 */
export const base = (c: number, r: number, w = 1, h = 1): string =>
	cut(BASE, c, r, w, h);
/** Base.png をピクセル単位で切り出す（半マスずれて描かれている窓・絵などの小物用）。 */
export const basePx = (x: number, y: number, w = 16, h = 16): string =>
	`${BASE}#${x},${y},${w},${h}`;
/** field.png（ワールドマップ）の (c, r) マスから w×h マス。 */
export const field = (c: number, r: number, w = 1, h = 1): string =>
	cut(FIELD_PNG, c, r, w, h);
/** rpgen/map.png（RPGEN のドラクエ風）の (c, r) マスから w×h マス。 */
export const rpgen = (c: number, r: number, w = 1, h = 1): string =>
	cut(RPGEN_PNG, c, r, w, h);

/** RPGEN の単体スプライト（rpgen-search の CDN）。同梱シートに無い物だけに使う。 */
const sp = (id: string) => `sp:${id}`;

/** 通れる地形。layers は下から順に重ねる。 */
const floor = (color: string, ...layers: string[]): TileDef => ({
	layers,
	color,
	passable: true,
});
/** 通れない物。 */
const solid = (color: string, ...layers: string[]): TileDef => ({
	layers,
	color,
	passable: false,
});
/** ランダムエンカウントが起きる地形にする。 */
const enc = (t: TileDef): TileDef => ({ ...t, encounter: true });
/** 大きな物（2マス幅の木・噴水など）。キャラより手前に描き、通れない。 */
const big = (color: string, ground: string, img: string): TileDef => ({
	layers: [ground],
	above: [img],
	color,
	passable: false,
});
/** カウンター（向こう側の人に話しかけられる）。 */
const counter = (color: string, ...layers: string[]): TileDef => ({
	layers,
	color,
	passable: false,
	counter: true,
});

const BLACK: TileDef = { layers: [], color: "#000", passable: false };

// ───────────────── フィールド（ワールドマップ） ─────────────────
// field.png の地形 ＋ Base.png の草花・柵・看板。
//   .  草原            ,  草むら（エンカウント）  *  花（ピンク）  %  花（黄）
//   :  土の道          =  石畳の道              s  砂地
//   T  木（通れない）  F  森（エンカウント）    b  茂み          S  桜の大木
//   ^  山脈            A  岩山（ひとつ）        n  丘（エンカウント）  o  岩
//   ~  水              w  川（横・1マス幅）     v  川（縦・1マス幅）
//   H  橋（川 w を南北に渡る）  I  橋（川 v を東西に渡る）  #  橋（広い水 ~ を南北に渡る）
//   |  木の柵          !  看板
//   C  洞窟の入口  V  村  K  城  Y  塔  >  階段（祠）   ※ 入口は通れる（warp を置く）
const GRASS = field(1, 10);
const WATER = field(1, 5);
const RIVER_H = field(1, 2);
const RIVER_V = field(1, 1);
const C_GRASS = "#6fae3a";
const C_WATER = "#2c55b0";

export const FIELD: Record<string, TileDef> = {
	".": floor(C_GRASS, GRASS),
	",": enc(floor(C_GRASS, GRASS, base(0, 11))),
	"*": floor(C_GRASS, GRASS, base(5, 11)),
	"%": floor(C_GRASS, GRASS, base(7, 11)),
	":": floor("#b07a45", field(7, 14)),
	"=": floor("#8a8078", base(2, 46)),
	s: floor("#f0c890", field(7, 2)),
	T: solid(C_GRASS, GRASS, field(3, 8)),
	F: enc(floor("#2f7a2a", field(4, 10))),
	b: solid(C_GRASS, GRASS, base(0, 10)),
	S: big(C_GRASS, GRASS, base(0, 292, 2, 2)),
	"^": solid("#7a7a7a", field(4, 14)),
	A: solid(C_GRASS, field(3, 12)),
	n: enc(floor("#c07a3a", field(1, 14))),
	o: solid(C_GRASS, GRASS, base(1, 13)),
	"~": solid(C_WATER, WATER),
	w: solid(C_WATER, RIVER_H),
	v: solid(C_WATER, RIVER_V),
	H: floor("#a07040", RIVER_H, base(4, 43)),
	I: floor("#a07040", RIVER_V, field(21, 11)),
	"#": floor("#a07040", WATER, base(4, 43)),
	"|": solid(C_GRASS, GRASS, base(5, 30)),
	"!": solid(C_GRASS, GRASS, base(3, 38)),
	C: floor(C_GRASS, GRASS, field(20, 10)),
	V: floor(C_GRASS, GRASS, field(21, 8)),
	K: {
		layers: [GRASS],
		above: [field(19, 8, 2, 2)],
		color: C_GRASS,
		passable: true,
	},
	Y: floor(C_GRASS, GRASS, field(19, 10, 1, 2)),
	">": floor(C_GRASS, GRASS, field(22, 10)),
	" ": BLACK,
};

// ───────────────── 町（屋外・スレ広場） ─────────────────
// 家は「屋根2段（棟 n/a/z ＋ 屋根 ^/A/Z）＋ 壁2段（上段＝窓・看板、下段＝扉）」で組む。
//   .  石畳      :  広場の石畳（スレ広場）  ,  芝生
//   n ^ 赤い屋根（棟・屋根）  a A 青い屋根  z Z わら屋根
//   % #  レンガ壁（上段・下段）  ( )  白壁（上段・下段）  [ ]  板壁（上段・下段）
//   W  窓（レンガ壁）  w  窓（白壁・板壁）  D  扉（レンガ壁）  d  扉（白壁）  e  扉（板壁）
//   $  道具屋の看板  I  宿屋の看板  +  教会（回復）の看板   ※ 壁の上段に付く
//   |  木の柵  f  鉄の柵  *  花壇（ピンク）  &  花壇（黄）  T  広場の木  P  鉢植えの木  p  花の鉢
//   O  噴水（3×3 の下段中央に置き、残り8マスは 0）  0  噴水のまわり（通れない石畳）
//   U  井戸  K k  掲示板（2マス・左右）  !  立て看板  V  自販機  x  木箱  L  街灯  B b  ベンチ（左右）
const PAVE = base(5, 48);
const TURF = base(0, 4);
const C_PAVE = "#8c8c90";
const WIN_BRICK = basePx(16, 1382); // 格子窓（壁装飾 1,86 を半マス上げて切り出し）
const WIN_WHITE = basePx(48, 1382); // 木枠の窓（壁装飾 3,86）

export const TOWN: Record<string, TileDef> = {
	".": floor(C_PAVE, PAVE),
	":": floor("#8a7a6a", base(2, 46)),
	",": floor(C_GRASS, TURF),
	n: solid("#a83a2a", base(3, 82)),
	"^": solid("#c04a3a", base(3, 83)),
	a: solid("#3a5a8a", base(2, 82)),
	A: solid("#4a6a9a", base(2, 83)),
	z: solid("#b89a3a", base(6, 82)),
	Z: solid("#c8aa4a", base(6, 83)),
	"%": solid("#a04a3a", base(1, 61)),
	"#": solid("#a04a3a", base(1, 62)),
	"(": solid("#e8e8e8", base(1, 59)),
	")": solid("#e8e8e8", base(1, 60)),
	"[": solid("#6a4a2a", base(1, 55)),
	"]": solid("#6a4a2a", base(1, 56)),
	W: solid("#a04a3a", base(1, 61), WIN_BRICK),
	w: solid("#e8e8e8", base(1, 59), WIN_WHITE),
	D: floor("#a04a3a", base(1, 62), base(7, 61, 1, 2)),
	d: floor("#e8e8e8", base(1, 60), base(7, 77, 1, 2)),
	e: floor("#6a4a2a", base(1, 56), base(7, 55, 1, 2)),
	$: solid("#a04a3a", base(1, 61), base(2, 95)),
	I: solid("#a04a3a", base(1, 61), base(0, 96)),
	"+": solid("#a04a3a", base(1, 61), base(1, 96)),
	"|": solid(C_GRASS, TURF, base(5, 30)),
	f: solid(C_PAVE, PAVE, base(5, 32)),
	"*": solid(C_GRASS, TURF, base(5, 11)),
	"&": solid(C_GRASS, TURF, base(7, 11)),
	T: big(C_GRASS, TURF, base(0, 6, 2, 2)),
	P: solid(C_PAVE, PAVE, base(7, 129, 1, 2)),
	p: solid(C_PAVE, PAVE, base(7, 133)),
	O: big(C_PAVE, PAVE, base(0, 132, 3, 3)),
	"0": solid(C_PAVE, PAVE),
	U: solid(C_PAVE, PAVE, base(2, 37)),
	K: solid(C_PAVE, PAVE, base(6, 37, 1, 2)),
	k: solid(C_PAVE, PAVE, base(7, 37, 1, 2)),
	"!": solid(C_PAVE, PAVE, base(3, 38)),
	V: solid(C_PAVE, PAVE, base(0, 519, 1, 2)),
	x: solid(C_PAVE, PAVE, base(4, 123)),
	L: solid(C_PAVE, PAVE, sp("2gTYec")), // 街灯（同梱シートに無いので RPGEN から）
	B: solid(C_PAVE, PAVE, sp("9UnaFUN")), // ベンチ左（同上）
	b: solid(C_PAVE, PAVE, sp("PcAZNWo")), // ベンチ右（同上）
	" ": BLACK,
};

// ───────────────── 屋内（家・店・音楽室） ─────────────────
// 部屋の上端は「天井 # ＋ 壁2段（H 上段・h 下段）」。16x32 の家具は壁ぎわの床に置くと上段へはみ出して立つ。
//   #  天井（黒）  H  壁（上段）  h  壁（下段・腰板）  W  窓  Q  絵  k  柱時計（下段）
//   .  木の床  ,  タイルの床  ~  赤いじゅうたん  -  金のじゅうたん  D  出入口（床。warp を置く）
//   [ = ]  カウンター（左端・中・右端。counter）
//   t  テーブル  o  丸テーブル  O  白い丸テーブル  n  いす  r  赤いいす
//   Z z  ベッド（枕・布団。縦2マス）  B  本棚  S s  大きな本棚（左右）
//   P p  ピアノ（木・左右）  G g  ピアノ（黒・左右）  L  スピーカー  V  テレビ  M  モニター（PC）
//   >  下り階段  < {  上り階段（左右）  u  壺  U  樽  x  木箱  f  花の鉢  F  観葉植物  Y  水晶玉
//   C  赤い幕（壁の下段に置くと天井まで垂れる）
//   7 8 9 / 4 5 6 / 1 2 3  赤いステージ（テンキーの並び。1 2 3 が手前の段。5 を並べると広くなる）
const WOOD = base(0, 46);
const C_WOOD = "#b8905a";

export const INDOOR: Record<string, TileDef> = {
	"#": solid("#1b1410"),
	H: solid("#e8e4dc", base(1, 77)),
	h: solid("#e8e4dc", base(1, 78)),
	W: solid("#e8e4dc", base(1, 77), WIN_BRICK),
	Q: solid("#e8e4dc", base(1, 77), basePx(64, 1446)),
	k: solid("#e8e4dc", base(1, 78), base(2, 116, 1, 2)),
	".": floor(C_WOOD, WOOD),
	",": floor("#9a9a9a", base(3, 46)),
	"~": floor("#c02020", base(5, 46)),
	"-": floor("#c0a030", base(5, 47)),
	D: floor(C_WOOD, WOOD),
	"[": counter(C_WOOD, WOOD, base(1, 98)),
	"=": counter(C_WOOD, WOOD, base(2, 98)),
	"]": counter(C_WOOD, WOOD, base(3, 98)),
	t: solid(C_WOOD, WOOD, base(2, 108)),
	o: solid(C_WOOD, WOOD, base(4, 104)),
	O: solid(C_WOOD, WOOD, base(3, 108)),
	n: solid(C_WOOD, WOOD, base(2, 109)),
	r: solid(C_WOOD, WOOD, base(3, 109)),
	Z: solid(C_WOOD, WOOD, base(0, 112)),
	z: solid(C_WOOD, WOOD, base(0, 113)),
	B: solid(C_WOOD, WOOD, base(3, 104, 1, 2)),
	S: solid(C_WOOD, WOOD, base(0, 108, 1, 2)),
	s: solid(C_WOOD, WOOD, base(1, 108, 1, 2)),
	P: solid(C_WOOD, WOOD, base(3, 120, 1, 2)),
	p: solid(C_WOOD, WOOD, base(4, 120, 1, 2)),
	G: solid(C_WOOD, WOOD, basePx(96, 5088, 16, 48)),
	g: solid(C_WOOD, WOOD, basePx(112, 5088, 16, 48)),
	L: solid(C_WOOD, WOOD, base(4, 540)),
	V: solid(C_WOOD, WOOD, base(3, 395)),
	M: solid(C_WOOD, WOOD, base(6, 486)),
	">": floor(C_WOOD, base(6, 48)),
	"<": floor(C_WOOD, WOOD, base(6, 49, 1, 2)),
	"{": floor(C_WOOD, WOOD, base(7, 49, 1, 2)),
	u: solid(C_WOOD, WOOD, base(0, 123)),
	U: solid(C_WOOD, WOOD, base(3, 125)),
	x: solid(C_WOOD, WOOD, base(4, 123)),
	f: solid(C_WOOD, WOOD, base(7, 133)),
	F: solid(C_WOOD, WOOD, base(7, 129, 1, 2)),
	Y: solid(C_WOOD, WOOD, base(3, 140)),
	C: solid("#e8e4dc", base(1, 78), base(6, 358, 1, 3)),
	"7": floor("#a01818", base(3, 354)),
	"8": floor("#a01818", base(4, 354)),
	"9": floor("#a01818", base(5, 354)),
	"4": floor("#a01818", base(3, 355)),
	"5": floor("#a01818", base(4, 355)),
	"6": floor("#a01818", base(5, 355)),
	"1": floor("#a01818", base(3, 356)),
	"2": floor("#a01818", base(4, 356)),
	"3": floor("#a01818", base(5, 356)),
	" ": BLACK,
};

// ───────────────── 洞窟・ダンジョン ─────────────────
// 上端は「闇 # ＋ 岩壁2段（W 上段・w 下段）」。水晶の洞窟は C/c を壁に使う。
//   #  闇（岩の天井）  W w  岩壁（上段・下段）  C c  水晶の壁（上段・下段）
//   .  土の床  ,  土の床（暗い）  ~  水たまり
//   >  下り階段  ( )  上り階段（壁の下段に置く。左右）
//   o  岩  r  小石  x  骸骨  O  穴  *  水晶（RPGEN）
const CAVE_FLOOR = base(0, 162);
const C_CAVE = "#6a5a3a";

export const CAVE: Record<string, TileDef> = {
	"#": solid("#08070a"),
	W: solid("#4a4030", base(1, 169)),
	w: solid("#4a4030", base(1, 170)),
	C: solid("#3a5a80", base(1, 173)),
	c: solid("#3a5a80", base(1, 174)),
	".": floor(C_CAVE, CAVE_FLOOR),
	",": floor(C_CAVE, base(1, 162)),
	"~": floor(C_CAVE, CAVE_FLOOR, base(5, 12)),
	">": floor(C_CAVE, base(0, 163)),
	"(": floor(C_CAVE, CAVE_FLOOR, base(2, 162, 1, 2)),
	")": floor(C_CAVE, CAVE_FLOOR, base(3, 162, 1, 2)),
	o: solid(C_CAVE, CAVE_FLOOR, base(2, 189)),
	r: solid(C_CAVE, CAVE_FLOOR, base(1, 13)),
	x: solid(C_CAVE, CAVE_FLOOR, base(0, 189)),
	O: solid(C_CAVE, CAVE_FLOOR, base(2, 190)),
	"*": solid(C_CAVE, CAVE_FLOOR, sp("n18q7J")), // 水晶（同梱シートに無いので RPGEN から）
	" ": BLACK,
};

// ───────────────── 電脳世界（スレのサーバー） ─────────────────
// 上端は「虚空 # ＋ 壁2段」。ネオンの壁 W/w と金属の壁 M/m を使い分ける。
//   #  虚空  W w  ネオンの壁（紫）  M m  金属の壁
//   .  金属の床（網）  ,  縞鋼板  +  光る床（紫）  *  光る床（紫・模様）  -  光る床（赤）  =  格子の床
//   X  虚無の穴（通れない）  0 1  データの床（数字が浮かぶ。RPGEN の DIGITAL）
//   S R  サーバー  P p  制御盤  T  タンク  Q q  大モニター（左右）  v  小モニター
//   D  金属の扉  >  下り階段
const MESH = base(6, 469);
const C_MESH = "#3a3a44";

export const CYBER: Record<string, TileDef> = {
	"#": solid("#05060c"),
	W: solid("#2a0a3a", base(1, 181)),
	w: solid("#2a0a3a", base(1, 182)),
	M: solid("#5a5a64", base(1, 179)),
	m: solid("#5a5a64", base(1, 180)),
	".": floor(C_MESH, MESH),
	",": floor("#8a8a90", base(1, 469)),
	"+": floor("#4a1a6a", base(4, 166)),
	"*": floor("#4a1a6a", base(5, 166)),
	"-": floor("#6a1a1a", base(6, 168)),
	"=": floor("#6a6a6a", base(4, 168)),
	X: solid("#101010", base(1, 588)),
	"0": floor(C_MESH, MESH, sp("3Ou4W4d")),
	"1": floor(C_MESH, MESH, sp("l282iX")),
	S: solid(C_MESH, MESH, base(4, 193, 1, 2)),
	R: solid(C_MESH, MESH, base(7, 193, 1, 2)),
	P: solid(C_MESH, MESH, base(5, 193, 1, 2)),
	p: solid(C_MESH, MESH, base(6, 193, 1, 2)),
	T: solid(C_MESH, MESH, base(2, 193, 1, 2)),
	Q: solid(C_MESH, MESH, base(0, 485, 1, 2)),
	q: solid(C_MESH, MESH, base(1, 485, 1, 2)),
	v: solid(C_MESH, MESH, base(7, 485)),
	D: floor(C_MESH, MESH, base(0, 193, 1, 2)),
	">": floor(C_MESH, base(0, 167)),
	" ": BLACK,
};

// ───────────────── 球場（やきう） ─────────────────
// 外周は「観客席 S/s ＋ ツタの壁 V/v（甲子園ふう）」。芝は , と ; を1行ごとに交互に並べると刈り目になる。
//   ,  外野の芝  ;  外野の芝（濃い刈り目）  :  内野の土
//   |  白線（縦・芝の上）  _  白線（横・芝の上）  o  塁（土の上）  m  マウンド
//   V v  ツタの外野フェンス（上段・下段）  f  金網（バックネット）
//   S s  観客席（上段・下段）  Q q  スコアボード（ツタの壁の上段に置く。左右）
const TURF_A = base(0, 4);
const TURF_B = base(1, 4);
const INFIELD = base(5, 4);
const CHALK = (w: number, h: number) => basePx(96, 1760, w, h); // 白（家具 6,110 の白布）
const C_TURF = "#6fae3a";

export const STADIUM: Record<string, TileDef> = {
	",": floor(C_TURF, TURF_A),
	";": floor("#5f9e2a", TURF_B),
	":": floor("#b8a070", INFIELD),
	"|": floor(C_TURF, TURF_A, CHALK(2, 16)),
	_: floor(C_TURF, TURF_A, CHALK(16, 2)),
	o: floor("#b8a070", INFIELD, CHALK(8, 8)),
	m: floor("#b8a070", INFIELD, base(1, 191)),
	V: solid("#3a8a3a", base(1, 175)),
	v: solid("#3a8a3a", base(1, 176)),
	f: solid(C_TURF, TURF_A, base(5, 32)),
	S: solid("#8a8a8a", base(4, 52)),
	s: solid("#8a8a8a", base(4, 53)),
	Q: solid("#3a8a3a", base(1, 175), base(0, 485, 1, 2)),
	q: solid("#3a8a3a", base(1, 175), base(1, 485, 1, 2)),
	" ": BLACK,
};

/** よく使う基本タイル（各パレットから抜き出した名前つきの別名）。 */
export const T = {
	grass: FIELD["."],
	grassEnc: FIELD[","],
	forest: FIELD.F,
	tree: FIELD.T,
	mountain: FIELD["^"],
	water: FIELD["~"],
	road: FIELD["="],
	floor: INDOOR["."],
	pave: TOWN["."],
	wall: TOWN["#"],
	castle: solid("#7a7a70", base(1, 68)),
	door: TOWN.D,
	black: BLACK,
} satisfies Record<string, TileDef>;

/**
 * 置物（イベントの見た目や飾りに使う切り出し）。helpers.ts の OBJ もここから選んでいる。
 * 2マス以上の物はイベントの見た目にすると、マスの下端中央にそろえて描かれる。
 */
export const PROPS = {
	// 宝箱（Base の置物。赤・茶・青）と RPGEN のドラクエ風
	chest: base(6, 123),
	chestOpen: base(6, 124),
	chestBrown: base(5, 123),
	chestBrownOpen: base(5, 124),
	chestBlue: base(7, 123),
	chestBlueOpen: base(7, 124),
	chestDq: rpgen(18, 15),
	chestDqOpen: rpgen(19, 15),
	// 看板・掲示板・貼り紙
	sign: base(3, 38),
	signpost: base(5, 37, 1, 2),
	board: base(6, 37, 2, 2), // 掲示板（スレッドの掲示板にどうぞ）
	boardBroken: base(4, 261, 2, 3), // 壊れた掲示板（荒らされた後）
	notice: basePx(32, 1446), // 貼り紙
	wanted: basePx(48, 1446), // 手配書
	// 記録・回復・魔法
	crystalBall: base(3, 140), // 水晶玉
	magicCircle: base(7, 13), // 白い魔法陣
	magicCircleDark: base(6, 13), // 黒い魔法陣
	lantern: basePx(96, 2250), // 灯ったランプ
	// 音楽
	piano: base(3, 120, 2, 2), // アップライトピアノ（木）
	pianoBlack: basePx(96, 5088, 32, 48), // アップライトピアノ（黒）
	pianoBroken: base(4, 273, 2, 3), // 壊れたピアノ
	speaker: base(4, 540),
	speakerWhite: base(2, 540),
	stage: base(3, 354, 3, 3), // 赤いステージ（3×3）
	stageWhite: base(0, 354, 3, 3),
	curtainRed: base(6, 358, 1, 3),
	curtainPurple: base(7, 358, 1, 3),
	// 機械・電脳
	tv: base(3, 395),
	monitor: base(6, 486),
	monitorBars: base(7, 486), // カラーバー
	bigScreen: base(0, 485, 2, 2),
	screenBars: base(2, 485, 2, 2),
	server: base(4, 193, 1, 2),
	console: base(5, 193, 1, 2),
	metalDoor: base(0, 193, 1, 2),
	vending: base(0, 519, 1, 2),
	blackboard: base(2, 509, 3, 1),
	// 家具
	bookshelf: base(3, 104, 1, 2),
	bed: base(0, 112, 1, 2),
	pot: base(0, 123),
	barrel: base(3, 125),
	crate: base(4, 123),
	// 階段・はしご
	stairsDown: base(6, 48),
	stairsUp: base(6, 49, 2, 2),
	stoneStairsDown: base(6, 51),
	stoneStairsUp: base(6, 52, 2, 2),
	caveStairsDown: base(0, 163),
	caveStairsUp: base(2, 162, 2, 2),
	ladder: base(6, 46, 1, 2),
	// 外の大物
	fountain: base(0, 132, 3, 3),
	well: base(2, 37),
	tree: base(0, 6, 2, 2),
	sakura: base(0, 292, 2, 2),
	purpleTree: base(0, 579, 2, 2), // 紫の木（侵蝕された森に）
	stoneLantern: base(0, 411, 1, 2),
	grave: base(3, 13),
	// 壊れ・侵蝕の上乗せ（床や壁のタイルの layers に足す）
	crackFloor: base(0, 250),
	crackWall: base(2, 253, 1, 2),
} as const;
