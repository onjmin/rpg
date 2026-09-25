// デバッグルーム（開発用。タイトルの「デバッグルーム」から来る。本編からは入れない）。
// 並んだ人に話しかけると、その場面の手前まで進めた状態（フラグ・仲間・レベル・大事なもの）に
// 作りなおして、そこへ飛ぶ。安価の選び方は いちばん素直なもの（戦って勝った）にしてある。
// フラグの並びは本編の s.set の順（各マップ）。本編の流れを変えたら、ここも合わせる。

import type { EventDef, GameState, MapDef, Story } from "../../engine/defs";
import { expFor, MAX_LV, statsOf } from "../../engine/party";
import type { Dir } from "../../engine/types";
import { cast } from "../cast";
import { npc, savePoint } from "../helpers";
import { SPR } from "../sprites";
import { INDOOR } from "../tiles";

type Flags = GameState["flags"];

/** once のイベントを見たことにする。 */
const done = (map: string, ...ids: string[]): Flags =>
	Object.fromEntries(ids.map((id) => [`done:${map}:${id}`, true]));

// 本編の区切りごとに立っているフラグ（前の区切りに足していく）
const PROLOGUE: Flags = {
	...done("thread", "opening"),
	onj_raid: true,
	ksk_raid: true,
	nanj_in: true,
	p_tut: true,
	res: 101,
};
const CH1_END: Flags = {
	...PROLOGUE,
	...done("town", "ch1_intro"),
	ch: 1,
	ikioi_seen: true,
	roze_in: true,
	b1_met: true,
	b1_how: "fight",
	b1: true,
	res: 350,
};
const CH2_END: Flags = {
	...CH1_END,
	...done("kakolog", "ch2", "whisper"),
	ch: 2,
	shelf_open: true,
	b2_met: true,
	b2_how: "win",
	feris_in: true,
	b2: true,
	res: 600,
};
const CH3_END: Flags = {
	...CH2_END,
	...done("stadium", "st_arrive"),
	ch: 3,
	quiz_ok: true,
	b3_met: true,
	b3_how: "win",
	b3: true,
	res: 850,
	night: true,
};
const CH4_MID: Flags = {
	...CH3_END,
	...done("town", "night_ev"),
	ch: 4,
	balus_on: true,
	balus_lost: true,
	akukin: true,
	teto_on: true,
	teto_met: true,
	res: 0,
};
const CH4_END: Flags = {
	...CH4_MID,
	...done("studio", "rec_ev"),
	rec: true,
	teto_in: true,
};
const CH5_MID: Flags = {
	...CH4_END,
	...done("server", "ch5"),
	ch: 5,
	rei_met: true,
	onsha_req: true,
	resuba_done: true,
	door_open: true,
};
const CLEAR: Flags = {
	...CH5_MID,
	...done("last", "lastfloor"),
	...done("thread", "ending_ev"),
	f1_done: true,
	onsha: true,
	flood_1: "991",
	flood_2: "995",
	res: 1000,
	clear: true,
	ending_seen: true,
};

type Member = { id: string; bench?: boolean };
const P1: Member[] = [{ id: "kiriko" }, { id: "nanj" }];
const P2: Member[] = [...P1, { id: "roze" }];
// 過去ログ倉庫で やきうが控えに回り、フェリスが入る
const P3: Member[] = [
	{ id: "kiriko" },
	{ id: "roze" },
	{ id: "feris" },
	{ id: "nanj", bench: true },
];
// 前夜祭の夜（town の night_ev）で やきうが抜ける（クリア後に もどるまで）
const P4: Member[] = [{ id: "kiriko" }, { id: "roze" }, { id: "feris" }];
// 録音（studio の rec_ev）で テトが控えに入る
const P5: Member[] = [...P4, { id: "teto", bench: true }];

type Checkpoint = {
	id: string;
	/** 話しかけたときに出す見出し。 */
	label: string;
	sprite: string;
	flags: Flags;
	party: Member[];
	lv: number;
	items: string[];
	to: { map: string; x: number; y: number; dir: Dir };
};

const KEY1 = ["chikuonki", "rec_first"];
const KEY2 = [...KEY1, "rec_kako"];

// レベルは battle.ts の各ボスの目安（B1 Lv4・B2 Lv6・B3 Lv7〜8・F1 Lv9〜10・F2 Lv10〜11）
const CHECKPOINTS: Checkpoint[] = [
	{
		id: "cp1",
		label: "第一章のはじめ（町に着いたところ）",
		sprite: "char:nanj",
		flags: PROLOGUE,
		party: P1,
		lv: 2,
		items: KEY1,
		to: { map: "town", x: 11, y: 16, dir: "down" },
	},
	{
		id: "cp2",
		label: "第二章のはじめ（過去ログ倉庫）",
		sprite: "char:roze",
		flags: CH1_END,
		party: P2,
		lv: 5,
		items: KEY1,
		to: { map: "kakolog", x: 11, y: 16, dir: "up" },
	},
	{
		id: "cp3",
		label: "第三章のはじめ（スタジアム）",
		sprite: "char:feris",
		flags: CH2_END,
		party: P3,
		lv: 7,
		items: KEY2,
		to: { map: "stadium", x: 1, y: 15, dir: "right" },
	},
	{
		id: "cp4",
		label: "第四章のはじめ（前夜祭の夜）",
		sprite: SPR.e_shinmax,
		flags: CH3_END,
		party: P3,
		lv: 8,
		items: KEY2,
		to: { map: "town", x: 12, y: 9, dir: "down" },
	},
	{
		id: "cp5",
		label: "第四章の後半（スタジオで録音）",
		sprite: "char:teto",
		flags: CH4_MID,
		party: P4,
		lv: 9,
		items: KEY2,
		to: { map: "studio", x: 7, y: 6, dir: "up" },
	},
	{
		id: "cp6",
		label: "終章のはじめ（サーバーの底）",
		sprite: "char:rei",
		flags: CH4_END,
		party: P5,
		lv: 9,
		items: KEY2,
		to: { map: "server", x: 1, y: 17, dir: "right" },
	},
	{
		id: "cp7",
		label: "1000レス目（最終戦の手前）",
		sprite: SPR.botsu,
		flags: CH5_MID,
		party: P5,
		lv: 10,
		items: KEY2,
		to: { map: "last", x: 5, y: 12, dir: "up" },
	},
	{
		id: "cp8",
		label: "クリア後（スレの下の扉）",
		sprite: "char:kiriko",
		flags: CLEAR,
		party: P5,
		lv: 11,
		items: [...KEY2, "rec_botsu"],
		to: { map: "thread", x: 6, y: 7, dir: "up" },
	},
];

/** どうぐ（たたかいで使うもの）を配る数。 */
const SUPPLY: Record<string, number> = {
	candy: 9,
	spray: 5,
	mabo: 5,
	pan: 3,
	hane: 3,
};

/** その場面の手前まで進めた状態に作りなおす（いまの状態は捨てる）。 */
const rebuild = (st: GameState, cp: Checkpoint, lv: number): void => {
	st.flags = { ...cp.flags, debug: true };
	st.party = cp.party.map(({ id, bench }) => {
		const s = statsOf(cast[id], lv);
		return {
			id,
			lv,
			exp: expFor(lv),
			hp: s.maxHp,
			mp: s.maxMp,
			...(bench ? { bench: true } : {}),
		};
	});
	st.items = { ...SUPPLY };
	for (const id of cp.items) st.items[id] = 1;
};

/** レベルを変える幅（選択肢）。 */
const STEPS = [-5, -1, 1, 5];

/** 場面を見せ、レベルを選んで（目安から上げ下げできる）飛ぶ。 */
const jump =
	(cp: Checkpoint) =>
	async (s: Story): Promise<void> => {
		// たたかう仲間の名前と、控えの人数（1行に収める）
		const bench = cp.party.filter((m) => m.bench).length;
		const names = `${cp.party
			.filter((m) => !m.bench)
			.map((m) => cast[m.id].name)
			.join("／")}${bench ? `＋控え${bench}` : ""}`;
		let lv = cp.lv;
		for (;;) {
			await s.narrate(`${cp.label}\nLv${lv}（目安${cp.lv}）${names}`);
			const i = await s.choose(
				[
					`Lv${lv}で　とぶ`,
					...STEPS.map((d) => `Lv${d > 0 ? "+" : "−"}${Math.abs(d)}`),
					"やめる",
				],
				{ cancel: STEPS.length + 1 },
			);
			if (i === STEPS.length + 1) return;
			if (i === 0) break;
			lv = Math.min(MAX_LV, Math.max(1, lv + STEPS[i - 1]));
			s.se("cursor");
		}
		rebuild(s.state, cp, lv);
		await s.warp(cp.to.map, cp.to.x, cp.to.y, cp.to.dir, { se: "warp" });
	};

/** どうぐを配る。 */
const supply = async (s: Story): Promise<void> => {
	for (const [id, n] of Object.entries(SUPPLY)) {
		const lack = n - s.has(id);
		if (lack > 0) s.give(id, lack);
	}
	s.se("item");
	await s.narrate("どうぐを　補充した。");
};

// 人の並び（x = 2, 4, 6, 8 の2列）
const spots: [number, number][] = [
	[2, 2],
	[4, 2],
	[6, 2],
	[8, 2],
	[2, 5],
	[4, 5],
	[6, 5],
	[8, 5],
];

const events: EventDef[] = [
	...CHECKPOINTS.map((cp, i) =>
		npc(cp.id, spots[i][0], spots[i][1], cp.sprite, jump(cp)),
	),
	npc("dbg_items", 8, 8, "char:nanj", supply, { dir: "left" }),
	savePoint("dbg_save", 5, 8),
];

export const debug: MapDef = {
	id: "debug",
	name: "デバッグルーム",
	bgm: null,
	tiles: INDOOR,
	rows: [
		"###########",
		"#HHHHHHHHH#",
		"#.........#",
		"#.........#",
		"#.........#",
		"#.........#",
		"#.........#",
		"#.........#",
		"#.........#",
		"#.........#",
		"###########",
	],
	events,
};

/** タイトルから入るときの状態（仲間はキリコだけ。場面を選ぶと作りなおす）。 */
export const debugStart = { mapId: "debug", x: 5, y: 9, dir: "up" as Dir };
