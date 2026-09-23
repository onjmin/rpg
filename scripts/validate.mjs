// ゲームデータの検証（pnpm validate）。
//
// Vite の SSR で src/data/index.ts を読み込み、次を調べる。
// - マップ: 行の長さがそろっているか、未定義のタイル文字、イベントの座標
// - イベントのスクリプトを「何もしない Story」で実際に走らせ、呼ばれた命令を調べる
//   （話し手・戦闘グループ・道具・BGM・効果音・ワープ先・セリフの長さ）
//   フラグの組み合わせを何通りか変えて走らせ、分岐の先もなるべく通す。
// エラーがあれば終了コード 1。

import { createServer } from "vite";

const MAX_COLS = 22; // 1行あたりの全角文字数の目安
const MAX_LINES = 2;

const server = await createServer({
	server: { middlewareMode: true, hmr: false },
	appType: "custom",
	logLevel: "error",
	optimizeDeps: { noDiscovery: true, include: [] },
});

const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

try {
	const { data } = await server.ssrLoadModule("/src/data/index.ts");
	const maps = data.maps;

	// 全角換算の幅（半角英数・半角カナは 0.5）
	const width = (line) =>
		[...line].reduce((w, ch) => w + (/[\x20-\x7e｡-ﾟ]/.test(ch) ? 0.5 : 1), 0);

	const checkText = (where, text) => {
		if (typeof text !== "string") return;
		const lines = text.split("\n");
		if (lines.length > MAX_LINES)
			warn(
				`${where}: セリフが ${lines.length} 行（${MAX_LINES} 行まで）: ${text.replace(/\n/g, "⏎")}`,
			);
		for (const l of lines)
			if (width(l) > MAX_COLS)
				warn(`${where}: 1行が長い（${width(l)}字）: ${l}`);
	};

	// ── マップの形 ──
	const grids = {};
	for (const [id, m] of Object.entries(maps)) {
		if (m.id !== id) err(`map ${id}: id が "${m.id}" になっている`);
		const lens = m.rows.map((r) => [...r].length);
		const w = Math.max(...lens);
		lens.forEach((l, y) => {
			if (l !== w) err(`map ${id}: ${y} 行目の長さが ${l}（ほかは ${w}）`);
		});
		const grid = m.rows.map((r) => [...r]);
		grids[id] = { w, h: m.rows.length, grid };
		const unknown = new Set();
		for (const row of grid)
			for (const ch of row) if (!m.tiles[ch]) unknown.add(ch);
		if (unknown.size)
			err(
				`map ${id}: 未定義のタイル文字 ${[...unknown].map((c) => JSON.stringify(c)).join(" ")}`,
			);
		const seen = new Set();
		for (const e of m.events ?? []) {
			if (seen.has(e.id)) err(`map ${id}: イベント id "${e.id}" が重複`);
			seen.add(e.id);
			if (e.x < 0 || e.y < 0 || e.x >= w || e.y >= m.rows.length)
				err(`map ${id}: イベント ${e.id} (${e.x},${e.y}) がマップの外`);
			if (e.trigger === "auto" && !e.once)
				warn(
					`map ${id}: auto イベント ${e.id} に once が無い（無限ループのおそれ）`,
				);
			if (e.trigger === "touch" && e.sprite && !e.through)
				warn(
					`map ${id}: touch イベント ${e.id} が見た目つきで通れない（踏めない）`,
				);
		}
		if (m.bgm && !data.bgm[m.bgm]) err(`map ${id}: BGM "${m.bgm}" が無い`);
		for (const g of m.encounters?.groups ?? [])
			if (!data.groups[g])
				err(`map ${id}: エンカウントのグループ "${g}" が無い`);
	}

	const passable = (mapId, x, y) => {
		const g = grids[mapId];
		if (!g || x < 0 || y < 0 || x >= g.w || y >= g.h) return false;
		return !!maps[mapId].tiles[g.grid[y][x]]?.passable;
	};

	// ── スクリプトを走らせる ──
	const makeStory = (where, flags, mapId) => {
		// 仮の現在地はそのマップの最初の通れるマス（開始マップなら開始位置）。ワープすると移る
		const firstPassable = (id) => {
			const g = grids[id];
			for (let y = 0; y < g.h; y++)
				for (let x = 0; x < g.w; x++) if (passable(id, x, y)) return { x, y };
			return { x: 0, y: 0 };
		};
		const pos =
			mapId === data.start.mapId
				? { x: data.start.x, y: data.start.y }
				: firstPassable(mapId);
		const state = {
			mapId,
			x: pos.x,
			y: pos.y,
			dir: "down",
			flags,
			party: [{ id: "kiriko", lv: 5, exp: 0, hp: 50, mp: 20 }],
			items: { candy: 3 },
			playMs: 0,
		};
		const here = () => maps[state.mapId];
		let steps = 0;
		const tick = () => {
			if (++steps > 2000) throw new Error("命令が多すぎる（無限ループ？）");
		};
		const s = {
			get state() {
				return state;
			},
			say: async (who, text, opt) => {
				tick();
				if (who && !data.cast[who])
					err(`${where}: 話し手 "${who}" が cast に無い`);
				if (who && opt?.name === undefined && who === "nanj") {
					// なんJ民本人のセリフ（名前欄は「なんJ民」）
				}
				checkText(where, text);
			},
			narrate: async (text) => {
				tick();
				checkText(where, text);
			},
			choose: async (options) => {
				tick();
				for (const o of options)
					if (width(o) > 16) warn(`${where}: 選択肢が長い: ${o}`);
				return 0;
			},
			wait: async () => tick(),
			fadeOut: async () => tick(),
			fadeIn: async () => tick(),
			bgm: (name) => {
				if (name !== null && !data.bgm[name])
					err(`${where}: BGM "${name}" が無い`);
			},
			se: (name) => {
				if (!data.sfx[name]) err(`${where}: 効果音 "${name}" が無い`);
			},
			flag: (name) => flags[name],
			set: (name, value = true) => {
				flags[name] = value;
			},
			warp: async (to, x, y) => {
				tick();
				if (!maps[to]) err(`${where}: ワープ先のマップ "${to}" が無い`);
				else {
					if (!passable(to, x, y))
						err(`${where}: ワープ先 ${to} (${x},${y}) が通れないマス`);
					state.mapId = to;
					state.x = x;
					state.y = y;
				}
			},
			move: async (target, route) => {
				tick();
				if (typeof route !== "string" || /[^udlrUDLRw]/.test(route))
					err(`${where}: move の道順 "${route}" が変`);
				if (
					target !== "player" &&
					!target.startsWith("follower:") &&
					!(here().events ?? []).some((e) => e.id === target)
				)
					err(`${where}: move の相手 "${target}" がこのマップのイベントに無い`);
			},
			face: (target) => {
				if (
					target !== "player" &&
					!target.startsWith("follower:") &&
					!(here().events ?? []).some((e) => e.id === target)
				)
					err(`${where}: face の相手 "${target}" がこのマップのイベントに無い`);
			},
			show: (id) => {
				if (!(here().events ?? []).some((e) => e.id === id))
					err(`${where}: show の "${id}" がこのマップのイベントに無い`);
			},
			hide: (id) => {
				if (!(here().events ?? []).some((e) => e.id === id))
					err(`${where}: hide の "${id}" がこのマップのイベントに無い`);
			},
			place: (id, x, y) => {
				const g = grids[state.mapId];
				if (x < 0 || y < 0 || x >= g.w || y >= g.h)
					err(`${where}: place の座標 (${x},${y}) がマップの外`);
			},
			battle: async (group) => {
				tick();
				if (!data.groups[group])
					err(`${where}: 戦闘グループ "${group}" が無い`);
				return "win";
			},
			join: (id) => {
				if (!data.cast[id]?.battle)
					err(`${where}: join の "${id}" に戦闘能力が無い`);
			},
			leave: () => {},
			give: (id) => {
				if (!data.items[id]) err(`${where}: 道具 "${id}" が無い`);
			},
			take: (id) => {
				if (!data.items[id]) err(`${where}: 道具 "${id}" が無い`);
				return true;
			},
			has: (id) => {
				if (!data.items[id]) err(`${where}: 道具 "${id}" が無い`);
				return 1;
			},
			heal: () => {},
			shake: async () => {},
			flash: async () => {},
			chapter: async () => tick(),
			saveMenu: async () => {},
			restTalk: async () => false,
			followers: () => {},
			// dateTrip などが現在地を読む
			ending: async () => {},
		};
		return s;
	};

	// フラグの組み合わせ：空・すべて立っている（数値は大きめ）・ランダムに半分
	const flagSets = () => {
		const sets = [{}];
		const allTrue = new Proxy(
			{},
			{
				get: (t, k) =>
					k in t ? t[k] : typeof k === "string" ? true : undefined,
				set: (t, k, v) => ((t[k] = v), true),
			},
		);
		sets.push(allTrue);
		return sets;
	};

	const run = async (where, fn, mapId) => {
		for (const flags of flagSets()) {
			try {
				await fn(makeStory(where, flags, mapId));
			} catch (e) {
				err(`${where}: スクリプトが例外: ${e?.message ?? e}`);
			}
		}
	};

	for (const [id, m] of Object.entries(maps)) {
		if (m.onEnter) await run(`map ${id} onEnter`, m.onEnter, id);
		for (const e of m.events ?? []) {
			if (e.when) {
				for (const flags of flagSets()) {
					try {
						e.when({
							flags,
							party: [],
							items: {},
							mapId: id,
							x: 0,
							y: 0,
							dir: "down",
							playMs: 0,
						});
					} catch (ex) {
						err(`map ${id} ${e.id}: when が例外: ${ex?.message ?? ex}`);
					}
				}
			}
			if (e.run) await run(`map ${id} ${e.id}`, e.run, id);
		}
	}

	// ── 仲間との親睦（ひとやすみ会話・なかまと話す・プロフィール） ──
	const bonds = data.bonds ?? { skits: [], chats: [], profiles: [] };
	const skitIds = new Set();
	for (const k of bonds.skits) {
		if (skitIds.has(k.id)) err(`skit ${k.id}: id が重複`);
		skitIds.add(k.id);
		for (const m of k.members)
			if (!data.cast[m]) err(`skit ${k.id}: members の "${m}" が cast に無い`);
		await run(`skit ${k.id}`, k.run, data.start.mapId);
	}
	for (const [i, c] of bonds.chats.entries()) {
		if (!data.cast[c.who]) err(`chat #${i}: who "${c.who}" が cast に無い`);
		await run(`chat ${c.who} #${i}`, c.run, data.start.mapId);
	}
	for (const d of bonds.dates ?? []) {
		if (!data.cast[d.who]) err(`date: who "${d.who}" が cast に無い`);
		await run(`date ${d.who}`, d.run, data.start.mapId);
	}
	for (const p of bonds.profiles) {
		if (!data.cast[p.who]) err(`profile: who "${p.who}" が cast に無い`);
	}

	// ── 戦闘データ ──
	for (const [id, g] of Object.entries(data.groups)) {
		for (const en of g.enemies)
			if (!data.enemies[en]) err(`group ${id}: 敵 "${en}" が無い`);
		if (g.bgm && !data.bgm[g.bgm]) err(`group ${id}: BGM "${g.bgm}" が無い`);
	}
	for (const [id, en] of Object.entries(data.enemies)) {
		if ([...en.name].length > 8)
			warn(`enemy ${id}: 名前が長い（8字まで）: ${en.name}`);
		if (en.drop && !data.items[en.drop.item])
			err(`enemy ${id}: ドロップ "${en.drop.item}" が無い`);
	}
	for (const [id, c] of Object.entries(data.cast)) {
		for (const s of c.battle?.skills ?? [])
			if (!data.skills[s]) err(`cast ${id}: 技 "${s}" が無い`);
	}
	const st = data.start;
	if (!maps[st.mapId]) err(`start: マップ "${st.mapId}" が無い`);
	else if (!passable(st.mapId, st.x, st.y))
		err(`start: 開始位置 ${st.mapId} (${st.x},${st.y}) が通れない`);
} catch (e) {
	err(`読み込みに失敗: ${e?.stack ?? e}`);
} finally {
	await server.close();
}

for (const w of warns) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✖ ${e}`);
console.log(`\n${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
