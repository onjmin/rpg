// 裏シナリオ「過疎板探検」の共通部品（maps/kaso.ts・neko.ts・aisatsu.ts・hoshu.ts・sentori.ts・hinan.ts・yukashita.ts）。
//
// おんJwiki の「過疎板探検」（約900の専門板の ほとんどが 無人。「最後にレスされたのが1000日前」。
// 「人が増えると信じてレスし続けた開拓者」）から。
// 入口は 過去ログ倉庫の 北東の 階段（避難Jのログを 掘ってから。dig_hinan）と、サーバーの底の となりのラック。
//
// 流れ: 過疎板の底（kaso）→ 犬猫大好き板（neko）→ 料理板（aisatsu）→ 天文・気象板（hoshu。第三章のあと）
//       → 実験板（sentori。第四章の 音が消えた夜から）→ 避難J（hinan）→ ホームの家（hinan_home）
//       → 1000（hinan_1000）→ すずが 鳴って 床下（yukashita）→ もどるか 残るか（offer）
// 板を ひとつ 終えるたび、過疎板の底の モニターが ひとつ 点き、避難Jの 板の 位置の 手がかりが ひとつ ふえる。
// 板ごとに 沈んだ レスを 1件 拾う（sunk_*。大事なもの）。ヒナリーは 蓄音キリコの レスを 数えていて
// 「……数が、合いません」。拾った 件数（sunkCount）で 中間報告し、床下で 時刻の 順に 並べて 最終発表。
//
// 裏返し（3段）：
//   1. 実験板の奥：1000ゲッターの 作成ログ「作：風吹けば名無し　回線：避難J」。bot は ホームニキが 自分で 置いた。
//   2. ホームの家の >>998（1000日前）：「ネタはネタのまま終わるんやろな。……どうせ忘れられる」。
//      本編の サイレントバルスの ことば。床下の 1人目が 何十回も 写し、第四章の 夜、
//      昔からある 声のない 静けさに 乗って はじめて 外へ 出た（キリコの 声を 借りて。87%一致）。
//   3. >>101の子：>>101 で「蓄音キリコ」と 呼ばれたのは、角刈り・100t・111歳の 1人目が 先。
//      釣り・防寒着・バラムツ（→囲碁）も その 1時間に 決まった。日付が かわって 再安価（ポニーテール）が 来て、
//      1人目の レスは 流され、100t の レスと いっしょに 避難Jの 家の 床下へ 沈んだ。ボツキリコは その子。
//      沈んだ レス4件（111・130・145・329）が その 1時間の 証拠。だれも 意味は 説明しない。
//
// フラグ（kaso_ / neko_ / ais_ / hos_ / sen_ / hinan_ / home_）：
//   kaso_in（底に 来た）・neko_done・ais_done・hos_done・sen_done（板を 終えた）・sen_line（避難Jへの 回線）
//   hinan_found（避難Jの モニターを 当てた）・home_met・home_key（カギを 拾った）・home_998（>>998 を 読んだ）
//   hinan_1000・hinan_back・hinan_end・hinan_undo（hinan.ts）
//   ura_101（床下で 真相を 見た）・keep_ura101（次スレへ 持ち越す。yukashita.ts）

import type { EventDef, GameState, Script, Story } from "../engine/defs";
import type { Dir } from "../engine/types";
import { ks } from "./story";
import { PROPS } from "./tiles";

/** キリコ（第四章の 沈黙中は「かきこみ」。story.ts の ks）。 */
export const K = ks;
/** ホームニキ（避難Jの >>2。J民なので 黄色の名前欄・読み上げなし）。 */
export const H = (s: Story, text: string): Promise<void> =>
	s.say("nanj", text, { name: "ホームニキ" });
/** 板猫。 */
export const C = (s: Story, text = "にゃあ"): Promise<void> =>
	s.say(null, text, { name: "板猫" });
/** 名前欄だけの話し手（J民ではない。白い名前欄）。 */
export const N = (s: Story, name: string, text: string): Promise<void> =>
	s.say(null, text, { name });

export const has = (s: Story, id: string): boolean =>
	s.state.party.some((m) => m.id === id);
/** 控えでなく いっしょに 歩いている 仲間か（やきうの アク禁中は いない）。 */
export const front = (s: Story, id: string): boolean =>
	!(id === "nanj" && s.state.flags.akukin) &&
	s.state.party.some((m) => m.id === id && !m.bench);

/** 数のフラグを1つ進め、進める前の値を返す。 */
export const bump = (s: Story, name: string): number => {
	const n = Number(s.flag(name) ?? 0);
	s.set(name, n + 1);
	return n;
};

/** 板を いくつ 終えたか（過疎板の底の ヒナリーの ノートと、避難Jの 手がかり）。 */
export const boardsDone = (st: GameState): number =>
	["neko_done", "ais_done", "hos_done", "sen_done"].filter((f) => st.flags[f])
		.length;

// ───────────────── 沈んだ レス（>>101の子の 1時間） ─────────────────

/** 沈んだ レス（大事なもの。次スレへ 持ち越す）。書かれた 時刻の 順。 */
export const SUNK = ["sunk_111", "sunk_130", "sunk_145", "sunk_329"];

/** 沈んだ レスを 何件 拾ったか（ヒナリーの 中間報告と、床下の 最終発表）。 */
export const sunkCount = (s: Story): number =>
	SUNK.filter((id) => s.has(id) > 0).length;

/** もう 拾っていれば（前の スレで 拾った）、短く そう言って true。 */
export const sunkHad = async (
	s: Story,
	id: string,
	no: number,
): Promise<boolean> => {
	if (s.has(id) <= 0) return false;
	await s.narrate(`${no}の　レスは、\nもう　ひろってある。`);
	return true;
};

/** 沈んだ レスを わたす。 */
export const giveSunk = async (
	s: Story,
	id: string,
	no: number,
): Promise<void> => {
	s.se("item");
	s.give(id, 1);
	await s.narrate(`沈んだレス　>>${no}を　てにいれた！`);
};

/** 調べると 文が 出るだけの 見えない イベント。 */
export const look = (
	id: string,
	x: number,
	y: number,
	...texts: string[]
): EventDef => ({
	id,
	x,
	y,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		for (const t of texts) await s.narrate(t);
	},
});

/** 勢い欄（板の スレ一覧）。調べると 1行ずつ。 */
export const ikioi = (
	id: string,
	x: number,
	y: number,
	lines: (st: GameState) => string[],
): EventDef => ({
	id,
	x,
	y,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		for (const t of lines(s.state)) await s.narrate(t);
	},
});

// ───────────────── ブロック押し（沈んだ スレを 上げる） ─────────────────

export type PushBlock = { id: string; x: number; y: number };
export type PushPuzzle = {
	/** フラグの頭（`<prefix>_<block>` に "x,y" が 入る）。 */
	prefix: string;
	blocks: PushBlock[];
	/** 押して 動かせる 範囲（両端を ふくむ）。 */
	area: { x0: number; y0: number; x1: number; y1: number };
	/** 範囲の 中で ブロックが 乗れる マス（マップの rows と 通れる 文字）。 */
	rows: string[];
	floor: string;
	/** そろえる マス。 */
	goals: [number, number][];
	/** そろったとき（1回だけ。solved が 立つ）。 */
	solved: string;
	onSolved: Script;
	/** ブロックの 見た目。 */
	sprite?: string;
};

const DIR_VEC: Record<Dir, [number, number]> = {
	up: [0, -1],
	down: [0, 1],
	left: [-1, 0],
	right: [1, 0],
};

const posKey = (x: number, y: number) => `${x},${y}`;

/** ブロックの いまの マス（動かしていなければ 最初の マス）。 */
export const blockAt = (st: GameState, p: PushPuzzle, b: PushBlock): string => {
	const v = st.flags[`${p.prefix}_${b.id}`];
	return typeof v === "string" ? v : posKey(b.x, b.y);
};

/** そろっているか。 */
export const pushSolved = (st: GameState, p: PushPuzzle): boolean => {
	const at = new Set(p.blocks.map((b) => blockAt(st, p, b)));
	return p.goals.every(([x, y]) => at.has(posKey(x, y)));
};

/**
 * 押せる ブロック（話しかけると、向いている方へ 1マス 動く）。
 * ブロックの 位置ごとに イベントを 1つ 置くので、範囲は 小さく。リセットは pushReset で。
 */
export const pushBlocks = (p: PushPuzzle): EventDef[] => {
	const events: EventDef[] = [];
	const canStand = (x: number, y: number) =>
		x >= p.area.x0 &&
		x <= p.area.x1 &&
		y >= p.area.y0 &&
		y <= p.area.y1 &&
		p.floor.includes(p.rows[y]?.[x] ?? " ");
	for (const b of p.blocks)
		for (let y = p.area.y0; y <= p.area.y1; y++)
			for (let x = p.area.x0; x <= p.area.x1; x++) {
				if (!canStand(x, y)) continue;
				events.push({
					id: `${p.prefix}_${b.id}_${x}_${y}`,
					x,
					y,
					sprite: p.sprite ?? PROPS.crate,
					trigger: "talk",
					fixedDir: true,
					when: (st) => blockAt(st, p, b) === posKey(x, y),
					run: async (s) => {
						// 押す向きは、プレイヤーから 見た ブロックの 方向（タップで 話しかけると state.dir が 向かないことがある）
						let dx = Math.sign(x - s.state.x);
						let dy = Math.sign(y - s.state.y);
						if ((dx !== 0) === (dy !== 0)) [dx, dy] = DIR_VEC[s.state.dir];
						const nx = x + dx;
						const ny = y + dy;
						const others = p.blocks
							.filter((o) => o !== b)
							.map((o) => blockAt(s.state, p, o));
						if (
							!canStand(nx, ny) ||
							others.includes(posKey(nx, ny)) ||
							(s.state.x === nx && s.state.y === ny)
						) {
							s.se("miss");
							await s.narrate("うごかない。");
							return;
						}
						s.se("damage");
						s.set(`${p.prefix}_${b.id}`, posKey(nx, ny));
						// 見た目は ふだん スクリプトの 終わりに 動く。そろった 知らせより 先に 動かす
						s.show(`${p.prefix}_${b.id}_${nx}_${ny}`);
						if (!s.flag(p.solved) && pushSolved(s.state, p)) {
							s.set(p.solved);
							await p.onSolved(s);
						}
					},
				});
			}
	return events;
};

/** ブロックを 最初の 位置へ もどす。 */
export const pushReset = (s: Story, p: PushPuzzle): void => {
	for (const b of p.blocks) s.set(`${p.prefix}_${b.id}`, posKey(b.x, b.y));
};

// ───────────────── 過疎板の底の モニター（900の板） ─────────────────

/**
 * モニターの 並び（6列×3段）。板を 終えると その板の モニターが 点く。
 * 避難Jは 暗いまま。手がかり：犬猫大好き板と 同じ段・料理板と 同じ列・天文・気象板の 右上。
 */
export const MONITOR_COLS = 6;
export const MONITOR_ROWS = 3;
export const MONITORS: Record<string, [col: number, row: number]> = {
	neko: [1, 0],
	ais: [4, 2],
	hos: [3, 1],
	sen: [0, 2],
	hinan: [4, 0],
};
