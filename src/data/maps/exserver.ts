// テストサーバー（クリア後のおまけ）。管理人室のサーバーラックから入る。
//
// 「ボスラッシュで終わりですか？」という感想への、もうひとつの答え。
// 戦いたい人のために、歴代のボスとだけ ひたすら戦える場所を用意する。
// 本編のフラグは ここでは一切いじらない（戦って、記録が残るだけ）。

import type { EventDef, MapDef, Story, TileDef } from "../../engine/defs";
import { warp } from "../helpers";
import { CYBER, PROPS } from "../tiles";
import { reiVisit } from "./server";

const tiles: Record<string, TileDef> = {
	...CYBER,
	// 赤いゲートの床（入口）。通れる
	D: { ...CYBER["-"], passable: true },
};

/** 連戦の組。id は記録のフラグ名にも使う（ex_<id>）。 */
type Course = {
	id: string;
	label: string;
	/** 見出し（連戦を始めるときの地の文）。 */
	title: string;
	groups: { group: string; name: string }[];
};

// サイレントバルス（g_balus_ev）は「かならず負ける」台本の戦いなので入れない
const COURSES: Course[] = [
	{
		id: "rival",
		label: "腕だめし　3戦",
		title: "なかまとの　腕だめし",
		groups: [
			{ group: "g_rival_nanj", name: "おんJ民" },
			{ group: "g_rival_roze", name: "ロゼ" },
			{ group: "g_rival_teto", name: "テト" },
		],
	},
	{
		id: "chapter",
		label: "章のボス　3戦",
		title: "章の　ボス",
		groups: [
			{ group: "g_b1", name: "夏休みキッズ番長" },
			{ group: "g_b2", name: "ムッジェ" },
			{ group: "g_b3", name: "テノヒラ監督" },
		],
	},
	{
		id: "final",
		label: "終章　2戦",
		title: "1000レス目の　2戦",
		groups: [
			{ group: "g_f1", name: "サイレントバルス" },
			{ group: "g_f2", name: "ボツキリコ" },
		],
	},
	{
		id: "admin",
		label: "管理人　1戦",
		title: "管理人の　テスト",
		groups: [{ group: "g_admin", name: "矢野さとる" }],
	},
];

/** 通し（上の組を ぜんぶ つなげた9戦）。 */
const ALL: Course = {
	id: "all",
	label: "通し　9戦",
	title: "通し　9戦",
	groups: COURSES.flatMap((c) => c.groups),
};

const COURSE_LIST = [ALL, ...COURSES];

/** ミリ秒 → 「12:34」。 */
const fmt = (ms: number): string => {
	const sec = Math.floor(ms / 1000);
	return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
};

/** その組の最高記録（ミリ秒。0 なら まだ）。 */
const bestOf = (s: Story, id: string): number => {
	const v = s.flag(`ex_${id}`);
	return typeof v === "number" ? v : 0;
};

/**
 * 連戦。あいだの回復は無し（どうぐは使える）。1つでも負けたら そこで終わり。
 * 全部たおしたら かかった時間を記録して、いちばん速ければ書きかえる。
 */
const runCourse = async (s: Story, c: Course): Promise<void> => {
	await s.narrate(`${c.title}。\nあいだの　回復は　ありません。`);
	if ((await s.choose(["はじめる", "やめる"], { cancel: 1 })) === 1) return;
	const from = s.state.playMs;
	let won = 0;
	for (const b of c.groups) {
		await s.narrate(`――${b.name}。`);
		const r = await s.battle(b.group, { canLose: true });
		if (r !== "win") {
			await s.narrate(`${won}体で　力つきた。\n……何度でも　やり直せます。`);
			s.heal();
			return;
		}
		won++;
	}
	const ms = Math.max(0, s.state.playMs - from);
	const best = bestOf(s, c.id);
	s.se("levelup");
	await s.narrate(
		`${c.groups.length}体　ぜんぶ　たおした！\nタイム ${fmt(ms)}`,
	);
	if (!best || ms < best) {
		s.set(`ex_${c.id}`, ms);
		await s.narrate(
			best ? `記録こうしん！（まえは ${fmt(best)}）` : "はじめての　記録です。",
		);
	}
	// はじめて通しをやりきった人には、持ちものを すこし
	if (c.id === "all" && !s.flag("ex_all_done")) {
		s.set("ex_all_done");
		s.se("item");
		s.give("pan", 5);
		s.give("hane", 3);
		await s.narrate(
			"検証の　ごほうび。\nフランスパンと　フェリスのはねを　もらった！",
		);
	}
	s.heal();
};

/** 記録を読む。 */
const showRecords = async (s: Story): Promise<void> => {
	const lines = COURSE_LIST.map((c) => {
		const best = bestOf(s, c.id);
		return `${c.label}　${best ? fmt(best) : "――"}`;
	});
	// 1画面2行まで（validate の決まり）なので、2つずつ出す
	for (let i = 0; i < lines.length; i += 2)
		await s.narrate(lines.slice(i, i + 2).join("\n"));
};

/** 端末のメニュー。 */
const terminal = async (s: Story): Promise<void> => {
	if (!s.flag("ex_met")) {
		s.set("ex_met");
		await s.narrate(
			"画面に　文字が　ならんだ。\n「検証用サーバー／負荷試験モード」",
		);
		await s.say("kiriko", "……もう一回　戦えるって　ことンゴ？");
	}
	for (;;) {
		const top = await s.choose(["たたかう", "記録を　見る", "やめる"], {
			cancel: 2,
		});
		if (top === 2) return;
		if (top === 1) {
			await showRecords(s);
			continue;
		}
		const labels = COURSE_LIST.map((c) => c.label);
		const i = await s.choose([...labels, "もどる"], { cancel: labels.length });
		if (i >= labels.length) continue;
		await runCourse(s, COURSE_LIST[i]);
	}
};

const events: EventDef[] = [
	{
		id: "ex_term",
		x: 5,
		y: 5,
		sprite: PROPS.monitor,
		trigger: "talk",
		fixedDir: true,
		run: terminal,
	},
	{
		id: "ex_rei",
		x: 8,
		y: 7,
		sprite: "char:rei",
		dir: "left",
		trigger: "talk",
		run: (s) => reiVisit(s, "テストサーバーの　保守も\n当機の　担当です"),
	},
	warp(
		"ex_out",
		5,
		9,
		{ map: "admin", x: 1, y: 4, dir: "down" },
		{ se: "warp" },
	),
];

export const exserver: MapDef = {
	id: "exserver",
	name: "テストサーバー",
	bgm: "extra",
	tiles,
	// S・R サーバーラック（R は赤いランプ）  M 壁  D 入口のゲート
	rows: [
		"###########", // y0
		"#WWWWWWWWW#", // y1
		"#wwwwwwwww#", // y2
		"#.S.....S.#", // y3
		"#.........#", // y4  ボスが出る空き地
		"#....M....#", // y5  端末 (5,5)
		"#.........#", // y6
		"#.......R.#", // y7  レイ (8,7)
		"#.........#", // y8  到着 (5,8)
		"#####D#####", // y9  入口 (5,9) → admin
	],
	events,
};
