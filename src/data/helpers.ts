// マップのイベントを書くための部品（扉・宝箱・セーブ点・回復点・看板・人）。
// どのマップでも同じ見た目・同じ手触りになるよう、なるべくこれを使う。

import type { EventDef, Script } from "../engine/defs";
import type { Dir } from "../engine/types";
import { PROPS } from "./tiles";

/** イベントの見た目に使う置物（同梱チップシートの切り出し。ほかの候補は data/tiles.ts の PROPS）。 */
export const OBJ = {
	chest: PROPS.chest, // 赤い宝箱
	chestOpen: PROPS.chestOpen, // 赤い宝箱（開）
	save: PROPS.crystalBall, // 水晶玉（記録の水晶）
	heal: PROPS.magicCircle, // 白い魔法陣
	sign: PROPS.sign, // 立て看板
	pc: PROPS.monitor, // 小さなモニター
	board: PROPS.board, // 掲示板（2マス幅）
	piano: PROPS.piano, // ピアノ（2マス幅）
} as const;

type WarpTo = { map: string; x: number; y: number; dir?: Dir };

/**
 * 乗ると別のマップへ移る床（扉・階段・マップの端）。見た目はタイル側に任せる。
 * se: "door" / "stairs" / "warp" など（省略時は無音）。
 */
export const warp = (
	id: string,
	x: number,
	y: number,
	to: WarpTo,
	opt: { se?: string; when?: EventDef["when"] } = {},
): EventDef => ({
	id,
	x,
	y,
	trigger: "touch",
	through: true,
	when: opt.when,
	run: async (s) => {
		await s.warp(to.map, to.x, to.y, to.dir, { se: opt.se });
	},
});

/** 横一列・縦一列に並んだ出口（マップの端など）をまとめて作る。 */
export const warpLine = (
	id: string,
	cells: [number, number][],
	to: (i: number) => WarpTo,
	opt: { se?: string; when?: EventDef["when"] } = {},
): EventDef[] => cells.map(([x, y], i) => warp(`${id}_${i}`, x, y, to(i), opt));

/**
 * 宝箱。開けると item を n 個もらい、フラグ `chest_<id>` が立つ（id はゲーム全体で一意に）。
 * 開けた後は開いた宝箱が残る。
 */
export const chest = (
	id: string,
	x: number,
	y: number,
	item: string,
	n = 1,
): EventDef[] => [
	{
		id,
		x,
		y,
		sprite: OBJ.chest,
		trigger: "talk",
		fixedDir: true,
		when: (st) => !st.flags[`chest_${id}`],
		run: async (s) => {
			s.se("item");
			s.give(item, n);
			s.set(`chest_${id}`);
			// 「あけた！」の文と同時に開いた宝箱の絵へ（show で出現状態を反映し、閉じた箱と入れ替える）
			s.show(`${id}_open`);
			await s.say(
				null,
				`たからばこを　あけた！\n${itemName(item)}${n > 1 ? `を　${n}こ` : "を"}　てにいれた！`,
			);
		},
	},
	{
		id: `${id}_open`,
		x,
		y,
		sprite: OBJ.chestOpen,
		trigger: "talk",
		fixedDir: true,
		when: (st) => !!st.flags[`chest_${id}`],
		run: async (s) => {
			await s.say(null, "からっぽだ。");
		},
	},
];

/** 道具名の引き当て（data/battle.ts の items を後から登録する）。 */
let itemNames: Record<string, string> = {};
export const registerItemNames = (names: Record<string, string>): void => {
	itemNames = names;
};
const itemName = (id: string) => itemNames[id] ?? id;

/** セーブ点（調べると記録できる）。 */
export const savePoint = (id: string, x: number, y: number): EventDef => ({
	id,
	x,
	y,
	sprite: OBJ.save,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		await s.saveMenu();
	},
});

/** 回復点（調べると全員全回復）。 */
export const healPoint = (
	id: string,
	x: number,
	y: number,
	text = "やさしい　ひかりに　つつまれた……",
): EventDef => ({
	id,
	x,
	y,
	sprite: OBJ.heal,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		s.se("inn");
		s.heal();
		await s.say(null, `${text}\nHPと　こえが　ぜんかいふくした！`);
	},
});

/** 看板（調べると文が出る）。 */
export const sign = (
	id: string,
	x: number,
	y: number,
	text: string,
	sprite: string = OBJ.sign,
): EventDef => ({
	id,
	x,
	y,
	sprite,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		await s.say(null, text);
	},
});

/**
 * 話しかけられる人。
 * talk は「セリフの配列」（話者は who）か、自由なスクリプト。
 * who はキャラ ID（data/cast.ts）。名前だけ変えたいモブは name を渡す。
 */
export const npc = (
	id: string,
	x: number,
	y: number,
	sprite: string,
	talk: string[] | Script,
	opt: {
		who?: string;
		name?: string;
		dir?: Dir;
		wander?: boolean;
		when?: EventDef["when"];
	} = {},
): EventDef => ({
	id,
	x,
	y,
	sprite,
	dir: opt.dir ?? "down",
	trigger: "talk",
	wander: opt.wander,
	when: opt.when,
	run:
		typeof talk === "function"
			? talk
			: async (s) => {
					for (const line of talk)
						await s.say(opt.who ?? null, line, { name: opt.name });
				},
});
