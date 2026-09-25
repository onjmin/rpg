// 隠し狩場「名無しの　すきま」。スレ街道の西のはし（川のすぐ上の山 (0,6)）が 通りぬけられる。
// 案内も 看板も ない（極秘）。ふつうの雑魚（街道と同じ）に まじって、まれに メタルンゴが出る。
// メタルンゴは こうげきも うたも 0か1しか通らず、すぐ にげる（data/battle.ts の metalngo）。

import type { MapDef } from "../../engine/defs";
import { warp } from "../helpers";
import { FIELD } from "../tiles";

export const sukima: MapDef = {
	id: "sukima",
	name: "名無しの　すきま",
	bgm: "secret",
	tiles: FIELD,
	rows: [
		"^^^^^^^^^^^^", // y0
		"^TT,,,,,,,T^", // y1
		"^,,,,,,,,,,^", // y2
		"^,,,,FF,,,,^", // y3
		"^,,,,FF,,,,^", // y4
		"^,,,,,,,,,,^", // y5
		"^,,,,,,,,,..", // y6 出口 (11,6) → スレ街道 (1,6)
		"^,,,,,,,,,,^", // y7
		"^TT,,,,,,TT^", // y8
		"^^^^^^^^^^^^", // y9
	],
	encounters: {
		rate: 0.1,
		groups: ["g_road1", "g_road2", "g_road3", "g_road4"],
		rare: { group: "g_metal", rate: 0.15 },
	},
	events: [warp("to_road", 11, 6, { map: "road", x: 1, y: 6, dir: "right" })],
};
