// 天文・気象板（裏シナリオ「過疎板探検」の 3枚目。過疎板の底の 右から2番目の 扉。第三章の ナイターの あと）。
// おーぷんに 実在する 板（sky）。「空を見た」が 2015年から 毎日 その日の 空の 写真、「台風総合スレ」は 2012年から
// （おんJ の「1ヶ月間過疎板巡り」スレ >>64・>>128）。毎日 ひとつ 書く＝保守の 板。
// 手前の 部屋：沈んだ スレ（3つの 箱）を 押して 勢い欄の 上段（光る 床）に そろえると、おくへの 道が ひらく（hos_age）。
// おく：ホームニキが 千日の あいだ 書いて 回った 保守レスの 足あと。日付が 新しい ほうへ 進むと、
// いちばん おくの 部屋に ホームの カギ。カギを 取ると「しずけさ」が しみだしてくる（中ボス）。
// しずけさが ひいた あとに、流れついた レス（沈んだレス >>329。服装：エスキモー）。
// 左の 部屋は 2000日前の 植民地化宣言（おんJ民が 遊びで 無人板に 乗りこんだ ころ）の 行き止まり。
// フラグ：hos_<a|b|c>（箱の 位置）・hos_age・hos_key（カギを 取った）・hos_done

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { chest, warp } from "../helpers";
import {
	front,
	giveSunk,
	K,
	look,
	type PushPuzzle,
	pushBlocks,
	pushReset,
	sunkHad,
} from "../kaso";
import { CAVE, PROPS } from "../tiles";

const rows = [
	"####################", // y0
	"#WWWWWWWWWWWWWWWWWW#", // y1
	"#w,,,,,w,,,,,w,,,,,#", // y2  左の部屋 (2..6)・まんなか (8..12)・右の部屋 (14..18)
	"#w,,,,,w,,,,,w,,,,,#", // y3
	"#w,,,,,w,,,,,w,,,,,#", // y4
	"#wwww,wwwww,wwwww,w#", // y5  入口 (5,5)(11,5)(17,5)
	"#,,,,,,,,,,,,,,,,,,#", // y6  通路
	"#,,,,,,,,,,,,,,,,,,#", // y7
	"#wwwwwwwww.wwwwwwww#", // y8  おくへの 道 (10,8)。hos_age まで 閉じている
	"#wwwwwwg.g..gwwwwww#", // y9  勢い欄の 上段（光る床 g）(7,9)(9,9)(12,9)
	"#wwwwww......wwwwww#", // y10 箱の 部屋（箱は x7..12・y9..12 を 動く）
	"#wwwwww......wwwwww#", // y11
	"#wwwwww......wwwwww#", // y12
	"#wwwwww......wwwwww#", // y13 端末 (13,13) は 壁の 前
	"#wwwwwwwww.wwwwwwww#", // y14 到着 (10,14)
	"#########.##########", // y15 出口 (10,15) → kaso
];

const tiles = {
	...CAVE,
	",": { ...CAVE[","], encounter: true },
	g: {
		...CAVE["."],
		layers: [...CAVE["."].layers, PROPS.magicCircle],
	},
};

// ───────────────── 沈んだ スレを 上げる ─────────────────

/** 3つの 箱＝沈んだ スレ（実在の スレと、ホームニキの 保守スレ）。 */
const BOX_NAME: Record<string, string> = {
	a: "空を見た",
	b: "台風総合スレ",
	c: "保守",
};

const PUZZLE: PushPuzzle = {
	prefix: "hos",
	blocks: [
		{ id: "a", x: 8, y: 11 },
		{ id: "b", x: 10, y: 12 },
		{ id: "c", x: 11, y: 11 },
	],
	area: { x0: 7, y0: 9, x1: 12, y1: 12 },
	rows,
	floor: ".g",
	goals: [
		[7, 9],
		[9, 9],
		[12, 9],
	],
	solved: "hos_age",
	onSolved: async (s) => {
		s.se("levelup");
		await s.narrate("3つの　スレが、いっせいに\n浮かびあがった。（age）");
		await s.narrate(
			`勢い欄の　上段に、スレタイが　ならんだ。\n${BOX_NAME.a}・${BOX_NAME.b}・${BOX_NAME.c}`,
		);
		await K(s, "……保守、ンゴ");
		if (front(s, "roze"))
			await s.say("roze", "沈んだ　スレを　上げる。\nそれだけの　板アル");
		await s.narrate("おくの　岩が、ごとりと　動いた。");
	},
};

/** 端末：箱を 最初の 位置へ。 */
const reset: EventDef = {
	id: "hos_reset",
	x: 13,
	y: 13,
	sprite: PROPS.console,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		await s.narrate("端末。\n『スレ一覧を　読み直す』");
		if (s.flag("hos_age")) {
			await s.narrate("……もう　上がっている。");
			return;
		}
		if ((await s.choose(["読み直す", "やめる"], { cancel: 1 })) === 1) return;
		s.se("cursor");
		pushReset(s, PUZZLE);
		await s.narrate("沈んだ　スレが、もとの　場所に　もどった。");
	},
};

/** おくへの 道（hos_age まで 岩が ふさぐ。踏むと 1歩 もどる）。 */
const gate: EventDef = {
	id: "hos_gate",
	x: 10,
	y: 8,
	trigger: "touch",
	through: true,
	when: (st) => !st.flags.hos_age,
	run: async (s: Story) => {
		await s.narrate("大きな　岩が　道を　ふさいでいる。");
		await s.narrate("岩に、ほりこんである。\n『スレを　上げた者だけ　通れ』");
		await s.move("player", "d");
	},
};

// ───────────────── 保守の 足あと ─────────────────

/** 貼り紙（保守レス）。 */
const post = (
	id: string,
	x: number,
	y: number,
	...texts: string[]
): EventDef => ({
	id,
	x,
	y,
	sprite: PROPS.notice,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		for (const t of texts) await s.narrate(t);
	},
});

/** ホームの カギ（右の 部屋の 宝箱）。取ると しずけさが しみだす。 */
const keyChest: EventDef[] = [
	{
		id: "hos_keybox",
		x: 17,
		y: 2,
		sprite: PROPS.chestBrown,
		trigger: "talk",
		fixedDir: true,
		when: (st) => !st.flags.hos_key,
		run: async (s) => {
			await s.narrate("古い　箱。\nふたに『ホーム』と　書いてある。");
			if ((await s.choose(["あける", "やめる"], { cancel: 1 })) === 1) return;
			s.se("item");
			s.give("home_key");
			s.set("hos_key");
			s.show("hos_keybox_open");
			await s.narrate("ホームのカギを　てにいれた！");
			await K(s, "……だれかの、家の　カギンゴ");
			s.bgm(null);
			await s.wait(500);
			await s.narrate("――音が、消えた。");
			await s.narrate("岩の　すきまから、\nしずけさが　しみだしてくる。");
			if (front(s, "feris")) await s.say("feris", "さむい〜……");
			await s.battle("g_hosboss");
			s.bgm("dungeon");
			await s.narrate("しずけさが、岩の　おくへ　ひいていった。");
			await K(s, "……いまの、サイレントバルスに\n似てたンゴ");
			await s.narrate(
				"しずけさの　ひいた　あとに、\n紙きれが　1枚　のこっていた。",
			);
			if (!(await sunkHad(s, "sunk_329", 329))) {
				await s.narrate("329　服装：エスキモー");
				await s.narrate("……その下に、ちいさく。\n『8月やぞ　草』");
				await s.narrate("キリコは、自分の　袖を　見た。");
				await giveSunk(s, "sunk_329", 329);
			}
			s.set("hos_done");
			await s.narrate("どこかで、モニターが　ひとつ\nついた　気がした。");
		},
	},
	{
		id: "hos_keybox_open",
		x: 17,
		y: 2,
		sprite: PROPS.chestBrownOpen,
		trigger: "talk",
		fixedDir: true,
		when: (st) => !!st.flags.hos_key,
		run: async (s) => {
			await s.narrate("からっぽの　箱。\nふたに『ホーム』。");
		},
	},
];

const events: EventDef[] = [
	{
		id: "arrive",
		x: 10,
		y: 14,
		trigger: "auto",
		once: true,
		run: async (s) => {
			await s.narrate("天文・気象板。\n最後の　レスは、3日前。");
			await K(s, "……3日前？\nここ、だれか　いるンゴ？");
			if (front(s, "roze"))
				await s.say("roze", "沈んだ　スレが、床に　ころがってるアル");
			await s.narrate(
				"部屋の　おくに、光る　床が　3つ。\n……勢い欄の、上段だ。",
			);
		},
	},
	warp(
		"to_kaso",
		10,
		15,
		{ map: "kaso", x: 12, y: 3, dir: "down" },
		{ se: "door" },
	),
	...pushBlocks(PUZZLE),
	reset,
	look(
		"ikioi_hos",
		8,
		8,
		"勢い欄。沈んだ　スレは、ここに　上げる。",
		"『空を見た』：毎日、その日の　空の　写真。\n2015年から。……沈んでいる。",
	),
	gate,
	// 通路の 足あと（日付が 新しい ほうへ）
	post(
		"post1",
		2,
		6,
		"貼り紙。\n『保守　980日前　名前：風吹けば名無し』",
		"『むこうは　まだ　重いんか？\n帰ってきた人、おる？』",
	),
	post(
		"post2",
		9,
		6,
		"貼り紙。\n『保守　700日前　名前：風吹けば名無し』",
		"『ねこが　来た。\nねこは　ノーカンやけど』",
	),
	post(
		"post3",
		15,
		6,
		"貼り紙。\n『保守　400日前　名前：風吹けば名無し』",
		"『保守って　書くの、\n何回目やろ』",
	),
	// 左の 部屋：2000日前の 植民地化宣言（行き止まり）
	post(
		"post_col",
		3,
		2,
		"古い　貼り紙。\n『2000日前　名前：風吹けば名無し』",
		"『【植民地化宣言】\nここは　おんJの　領土や。ワイらの　板や』",
		"……その下に、ちいさく。\n『3日で　飽きた。帰るわ』",
	),
	look(
		"scrawl",
		5,
		2,
		"岩に、あとから　ほりこんである。\n『昔は　遊びで　侵略しとった　だけやのにな』",
	),
	// まんなかの 部屋：100日前と、空の 写真
	post(
		"post4",
		10,
		2,
		"貼り紙。\n『保守　100日前　名前：風吹けば名無し』",
		"『保守』",
	),
	look(
		"sky_photo",
		12,
		4,
		"岩の　すきまに、空の　写真が　1枚。\n……くもり空。日付は　ない。",
	),
	// 右の 部屋：3日前と カギ
	post(
		"post5",
		15,
		2,
		"貼り紙。\n『保守　3日前　名前：風吹けば名無し』",
		"『ほ』",
	),
	...keyChest,
	...chest("hos1", 2, 4, "mabo", 2),
];

export const hoshu: MapDef = {
	id: "hoshu",
	name: "天文・気象板",
	bgm: "dungeon",
	tiles,
	rows,
	encounters: { rate: 0.06, groups: ["g_hos1", "g_hos2", "g_hos3"] },
	events,
};
