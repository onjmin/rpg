// ゲームデータの検証（pnpm validate）。
//
// Vite の SSR で src/data/index.ts を読み込み、次を調べる。
// - マップ: 行の長さがそろっているか、未定義のタイル文字、イベントの座標
// - イベントのスクリプトを「何もしない Story」で実際に走らせ、呼ばれた命令を調べる
//   （話し手・戦闘グループ・道具・BGM・効果音・ワープ先・セリフの長さ・使わない言葉）
//   フラグ2通り（空・すべて立っている）× 選び方（pick 0〜4）× 負け方（最初の0回・3回負ける）で走らせ、
//   さらに、読んだフラグを1つずつ反転させて走らせ直し、分岐の先もなるべく通す。
//   選択肢は、固定の pick のほかに、選び方の組み合わせを幅優先でたどる（1組 MAX_PATHS 本まで。
//   「メニュー → レスで返す → >>1」のような入れ子の選択や、釣りの「つる → まつ → いまだ！」も通す）。
//   2周目は、ほかのスクリプトが set した値（"uke"・0〜2 など）をフラグに入れて走らせる
//   （reply_kako・daida・meigen1〜3・sym_* などで変わる文も通す）。
//   仲間のレベルもフラグの組で変える（空＝Lv1・すべて＝Lv30・2周目＝Lv5）。覚えたうたで変わる文（knows）も通す。
// - 仲間: うた（battle.skills の { id, lv }）の形と順、覚えたときの文・控えの知らせの長さ、benchFirst
// - 裏ボスの召喚（summon.stock の敵・入れ子・restore の値）と、戦闘の文（召喚・downText）の長さ
// - 自由度（scratchpad/freedom/spec.md §5-3）
//   - エンディングのまとめカード（1行22字・1セクション10行まで）
//   - threadlog.ts の組み立てる文（レスの洪水・差分・まとめ）を FLAG_DOMAIN の組み合わせで検査
//   - 名言表（freedom.ts の MEIGEN）の選択肢と引用文
//   - フラグの約束：FLAG_DOMAIN のフラグが、どこかのスクリプトで立つか（値が範囲内か）
// エラーがあれば終了コード 1。

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const MAX_COLS = 22; // 1行あたりの全角文字数の目安
const MAX_LINES = 2;
// 選択肢の全角文字数。375px 幅のスマホ縦で1行に収まる幅（.choice の max-width 80vw・
// .choice-item の 17px と余白から、文字の入る幅は 約240px＝全角14字）
const MAX_CHOICE = 14;
// 戦闘のログ1枚の全角文字数（375px 幅の .battle-log で2行に収まる目安。改行は効かない）
const MAX_LOG = 28;
const MAX_SUMMARY_LINES = 10; // まとめカードの1セクションの行数
const PICKS = [0, 1, 2, 3, 4]; // choose が返す番号（選択肢が少なければ最後のもの）
const LOSE_FIRST = 3; // 負けイベント（canLose）で最初に負ける回数
const MAX_FLIPS = 48; // 1本のスクリプトで反転させて走らせ直すフラグの数
const MAX_PATHS = 48; // 選び方の組み合わせをたどる本数（フラグ1組・負け方1つあたり）
const TYPED = 4; // 2周目（set された値を入れる）のフラグの組の数
const BOND_VALUES = [3, 5]; // エンジンが立てる bond_*（なかよし度）を2周目で入れる値
const MENU_REPEAT = 12; // 同じ選択肢がこれ以上出たら、やめる側（cancel か最後）を選ぶ
const RANDOM_COMBOS = 200; // threadlog を検査するフラグのランダムな組み合わせの数
// ゲーム内の文に書かない言葉（spec §2-6・§10-21）
const BANNED = [
	"清濁",
	"併せ呑む",
	"当事者",
	"尊重",
	"批判",
	"アンチ",
	"たたかれる",
	"つくよみ",
	"MGRoid",
	"MOTRoid",
	"NYNRoid",
];
// 「一週間で　落ちる」のモチーフは3回だけ（spec §2-5）
const MOTIF = { text: "一週間で", max: 3 };
// エンジンが立てるフラグ（フラグの約束の検査から外す）
const ENGINE_FLAG = /^(date_|bond_|done:|skit_|seen_)/;

const server = await createServer({
	server: { middlewareMode: true, hmr: false, ws: false },
	appType: "custom",
	logLevel: "error",
	optimizeDeps: { noDiscovery: true, include: [] },
});

// 同じ警告・エラーは1回だけ出す（note は最初の1回の例として添える）
const errors = new Map();
const warns = new Map();
const add = (bag, m, note) => {
	if (!bag.has(m)) bag.set(m, note ? `${m}（例: ${note}）` : m);
};
const err = (m, note) => add(errors, m, note);
const warn = (m, note) => add(warns, m, note);

// 全角換算の幅（半角英数・半角カナは 0.5）
const width = (line) =>
	[...line].reduce((w, ch) => w + (/[\x20-\x7e｡-ﾟ]/.test(ch) ? 0.5 : 1), 0);
const oneLine = (text) => text.replace(/\n/g, "⏎");

const checkWords = (where, text, note) => {
	for (const w of BANNED)
		if (text.includes(w))
			warn(`${where}: 使わない言葉「${w}」: ${oneLine(text)}`, note);
};

const checkText = (where, text, note) => {
	if (typeof text !== "string") return;
	const lines = text.split("\n");
	if (lines.length > MAX_LINES)
		warn(
			`${where}: セリフが ${lines.length} 行（${MAX_LINES} 行まで）: ${oneLine(text)}`,
			note,
		);
	for (const l of lines)
		if (width(l) > MAX_COLS)
			warn(`${where}: 1行が長い（${width(l)}字）: ${l}`, note);
	checkWords(where, text, note);
};

/** 組み立てた文に、値の入れまちがい（undefined・NaN など）が無いか。 */
const checkValue = (where, text, note) => {
	if (
		typeof text === "string" &&
		/undefined|NaN|\[object |null|true|false/.test(text)
	)
		err(`${where}: 文に変な値が入っている: ${oneLine(text)}`, note);
};

/** まとめカード（EndingSummary）の形と長さ。 */
const checkSummary = (where, summary, note, strict = false) => {
	if (!summary || !Array.isArray(summary.sections)) {
		err(`${where}: まとめの形が変（{ sections: [...] } ではない）`, note);
		return;
	}
	for (const sec of summary.sections) {
		if (typeof sec?.title !== "string" || !Array.isArray(sec?.lines)) {
			err(
				`${where}: まとめのセクションの形が変（{ title, lines } ではない）`,
				note,
			);
			continue;
		}
		if (width(sec.title) > MAX_COLS)
			warn(
				`${where}: まとめの見出しが長い（${width(sec.title)}字）: ${sec.title}`,
				note,
			);
		if (sec.lines.length > MAX_SUMMARY_LINES)
			warn(
				`${where}: まとめ「${sec.title}」が ${sec.lines.length} 行（${MAX_SUMMARY_LINES} 行まで）`,
				note,
			);
		if (strict) checkValue(where, sec.title, note);
		checkWords(where, sec.title, note);
		for (const l of sec.lines) {
			if (typeof l !== "string") {
				err(
					`${where}: まとめ「${sec.title}」の行が文字列でない: ${String(l)}`,
					note,
				);
				continue;
			}
			if (l.includes("\n"))
				warn(`${where}: まとめの行に改行がある: ${oneLine(l)}`, note);
			for (const part of l.split("\n"))
				if (width(part) > MAX_COLS)
					warn(
						`${where}: まとめの1行が長い（${width(part)}字）: ${part}`,
						note,
					);
			if (strict) checkValue(where, l, note);
			checkWords(where, l, note);
		}
	}
};

/** 決まった順の疑似乱数（mulberry32）。 */
const rng = (seed) => () => {
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const realRandom = Math.random;
const t0 = performance.now();
let runs = 0;
let scripts = 0;

try {
	const { data } = await server.ssrLoadModule("/src/data/index.ts");
	// 仲間のレベル・うた・控えの文（engine/party.ts）
	const P = await server.ssrLoadModule("/src/engine/party.ts");
	const maps = data.maps;

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
	/** スクリプトの set で立ったフラグ（名前 → 値の集合）。フラグの約束の検査に使う。 */
	const setFlags = new Map();
	/** 2周目で入れる値（フラグ名 → 1周目にスクリプトが set した文字列・数）。 */
	const typedDomain = new Map();
	/** 2周目の組 i で、フラグ k に入れる値（set されたことのない真偽のフラグは true）。 */
	const typedOf = (k, i) => {
		const vals =
			typedDomain.get(k) ?? (k.startsWith("bond_") ? BOND_VALUES : null);
		return vals?.length ? vals[i % vals.length] : true;
	};

	/**
	 * 走らせるときのフラグ。base "none" は何も立っていない、"all" はすべて true（数値は大きめ扱い）、
	 * 数 i は2周目の組（すべて立っていて、set された値のあるフラグはその値。typedOf）。
	 * flip のフラグだけ反対にする。reads には「最初から入っていた値」を読んだフラグ名をためる。
	 */
	const makeFlags = (base, flip, reads) =>
		new Proxy(
			{},
			{
				get: (t, k) => {
					if (typeof k !== "string" || Object.hasOwn(t, k) || k in t)
						return t[k];
					reads?.add(k);
					if (base === "none") return k === flip ? true : undefined;
					if (k === flip) return undefined;
					return base === "all" ? true : typedOf(k, base);
				},
				set: (t, k, v) => {
					t[k] = v;
					return true;
				},
			},
		);

	const makeStory = (where, flags, mapId, ctx) => {
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
			// レベルはフラグの組で変わる（none=1・all=MAX_LV・2周目=5）。覚えたうたの分岐（knows）を両側とも通す
			party: [{ id: "kiriko", lv: ctx.lv, exp: 0, hp: 50, mp: 20 }],
			items: { candy: 3 },
			playMs: 0,
		};
		const here = () => maps[state.mapId];
		const note = ctx.note;
		let steps = 0;
		const tick = () => {
			if (++steps > 2000) throw new Error("命令が多すぎる（無限ループ？）");
		};
		const s = {
			get state() {
				return state;
			},
			say: async (who, text) => {
				tick();
				if (who && !data.cast[who])
					err(`${where}: 話し手 "${who}" が cast に無い`, note);
				checkText(where, text, note);
			},
			narrate: async (text) => {
				tick();
				checkText(where, text, note);
			},
			choose: async (options, opt) => {
				tick();
				for (const o of options) {
					if (width(o) > MAX_CHOICE) warn(`${where}: 選択肢が長い: ${o}`, note);
					checkWords(where, o, note);
				}
				const n = options.length;
				if (!n) {
					err(`${where}: 選択肢が空`, note);
					return 0;
				}
				ctx.maxN = Math.max(ctx.maxN, n);
				// 同じメニューが何度も出るときは、やめる側を選んで抜ける（選び方を固定しているため）
				const sig = options.join("\u0000");
				const rep = (ctx.menus.get(sig) ?? 0) + 1;
				ctx.menus.set(sig, rep);
				let i;
				if (rep > MENU_REPEAT) {
					i = opt?.cancel ?? n - 1;
					ctx.counts.push(1); // ここは分けない
				} else if (ctx.path) {
					// 組み合わせをたどる：道の途中は決まった番号、その先は 0
					const k = ctx.taken.length;
					i = k < ctx.path.length ? Math.min(ctx.path[k], n - 1) : 0;
					ctx.counts.push(n);
				} else {
					i = Math.min(ctx.pick, n - 1);
					ctx.counts.push(n);
				}
				ctx.taken.push(i);
				return i;
			},
			wait: async () => tick(),
			fadeOut: async () => tick(),
			fadeIn: async () => tick(),
			bgm: (name) => {
				if (name !== null && !data.bgm[name])
					err(`${where}: BGM "${name}" が無い`, note);
			},
			se: (name) => {
				if (!data.sfx[name]) err(`${where}: 効果音 "${name}" が無い`, note);
			},
			flag: (name) => flags[name],
			set: (name, value = true) => {
				flags[name] = value;
				let vs = setFlags.get(name);
				if (!vs) {
					vs = new Set();
					setFlags.set(name, vs);
				}
				if (vs.size < 64) vs.add(value);
			},
			warp: async (to, x, y) => {
				tick();
				if (!maps[to]) err(`${where}: ワープ先のマップ "${to}" が無い`, note);
				else {
					if (!passable(to, x, y))
						err(`${where}: ワープ先 ${to} (${x},${y}) が通れないマス`, note);
					state.mapId = to;
					state.x = x;
					state.y = y;
				}
			},
			move: async (target, route) => {
				tick();
				if (typeof route !== "string" || /[^udlrUDLRw]/.test(route))
					err(`${where}: move の道順 "${route}" が変`, note);
				if (
					target !== "player" &&
					!target.startsWith("follower:") &&
					!(here().events ?? []).some((e) => e.id === target)
				)
					err(
						`${where}: move の相手 "${target}" がこのマップのイベントに無い`,
						note,
					);
			},
			face: (target) => {
				if (
					target !== "player" &&
					!target.startsWith("follower:") &&
					!(here().events ?? []).some((e) => e.id === target)
				)
					err(
						`${where}: face の相手 "${target}" がこのマップのイベントに無い`,
						note,
					);
			},
			show: (id) => {
				if (!(here().events ?? []).some((e) => e.id === id))
					err(`${where}: show の "${id}" がこのマップのイベントに無い`, note);
			},
			hide: (id) => {
				if (!(here().events ?? []).some((e) => e.id === id))
					err(`${where}: hide の "${id}" がこのマップのイベントに無い`, note);
			},
			place: (id, x, y) => {
				if (
					id !== "player" &&
					!id.startsWith("follower:") &&
					!(here().events ?? []).some((e) => e.id === id)
				)
					err(`${where}: place の "${id}" がこのマップのイベントに無い`, note);
				const g = grids[state.mapId];
				if (x < 0 || y < 0 || x >= g.w || y >= g.h)
					err(`${where}: place の座標 (${x},${y}) がマップの外`, note);
			},
			battle: async (group, opt) => {
				tick();
				if (!data.groups[group])
					err(`${where}: 戦闘グループ "${group}" が無い`, note);
				// 負けイベントだけ、最初の loseFirst 回は負ける（ふつうの戦闘はエンジンが勝つまでやり直す）
				if (opt?.canLose) {
					ctx.canLose = true;
					if (ctx.losses < ctx.loseFirst) {
						ctx.losses++;
						return "lose";
					}
				}
				return "win";
			},
			join: (id, opt) => {
				if (!data.cast[id]?.battle)
					err(`${where}: join の "${id}" に戦闘能力が無い`, note);
				if (
					opt !== undefined &&
					(typeof opt !== "object" ||
						opt === null ||
						Object.keys(opt).some((k) => k !== "bench"))
				)
					err(`${where}: join の opt が変`, note);
				// 仲間の数・控えのあふれは調べない（どのスクリプトも1人から走らせるので。実行時は console.warn）
				if (!state.party.some((m) => m.id === id))
					state.party.push({
						id,
						lv: ctx.lv,
						exp: 0,
						hp: 1,
						mp: 0,
						...(opt?.bench ? { bench: true } : {}),
					});
			},
			leave: (id) => {
				state.party = state.party.filter((m) => m.id !== id);
			},
			bench: (id) => {
				if (id === data.start.party[0])
					err(`${where}: リーダー "${id}" は控えに回せない`, note);
				else if (!data.cast[id]?.battle)
					err(`${where}: bench の "${id}" に戦闘能力が無い`, note);
				const m = state.party.find((x) => x.id === id);
				if (m) m.bench = true;
			},
			unbench: (id) => {
				if (id === data.start.party[0])
					err(
						`${where}: リーダー "${id}" は控えにならない（unbench 不要）`,
						note,
					);
				else if (!data.cast[id]?.battle)
					err(`${where}: unbench の "${id}" に戦闘能力が無い`, note);
				const m = state.party.find((x) => x.id === id);
				if (m) delete m.bench;
			},
			gather: () => {},
			give: (id) => {
				if (!data.items[id]) err(`${where}: 道具 "${id}" が無い`, note);
			},
			take: (id) => {
				if (!data.items[id]) err(`${where}: 道具 "${id}" が無い`, note);
				return true;
			},
			has: (id) => {
				if (!data.items[id]) err(`${where}: 道具 "${id}" が無い`, note);
				return 1;
			},
			heal: () => {},
			shake: async () => {},
			flash: async () => {},
			chapter: async () => tick(),
			saveMenu: async () => {},
			restTalk: async () => false,
			followers: () => {},
			gainExp: async (n) => {
				tick();
				if (!(n > 0)) err(`${where}: gainExp の値が変: ${n}`, note);
			},
			ending: async (opt) => {
				tick();
				if (opt?.summary !== undefined)
					checkSummary(`${where} ending`, opt.summary, note);
			},
		};
		return s;
	};

	/**
	 * 1回走らせる。Math.random は pick で決まる値にする（「安価なら下」などの行き先を固定）。
	 * path があれば、choose は path の番号を順に返す（その先は 0。選び方の組み合わせをたどる）。
	 */
	const runOnce = async (
		where,
		fn,
		mapId,
		flags,
		pick,
		loseFirst,
		label,
		path = null,
		lv = 5,
	) => {
		const ctx = {
			pick,
			path,
			lv,
			taken: [],
			counts: [],
			loseFirst,
			losses: 0,
			canLose: false,
			maxN: 0,
			random: false,
			menus: new Map(),
			note: path
				? `${label} path=[${path.join(",")}] lose=${loseFirst}`
				: `${label} pick=${pick} lose=${loseFirst}`,
		};
		Math.random = () => {
			ctx.random = true;
			return ((pick + 0.5) / 5) % 1;
		};
		runs++;
		try {
			await fn(makeStory(where, flags, mapId, ctx));
		} catch (e) {
			err(`${where}: スクリプトが例外: ${e?.message ?? e}`, ctx.note);
		} finally {
			Math.random = realRandom;
		}
		return ctx;
	};

	/**
	 * 選び方（pick 0〜4）と負け方（0回・LOSE_FIRST 回）を変えて走らせる。
	 * 結果が変わらない組み合わせ（選択肢が足りない・負けイベントが無い）は飛ばす。
	 */
	const runVariants = async (where, fn, mapId, mkFlags, label, lv) => {
		let maxAll = 0;
		let canLose = false;
		for (const pick of PICKS) {
			const a = await runOnce(
				where,
				fn,
				mapId,
				mkFlags(),
				pick,
				0,
				label,
				null,
				lv,
			);
			const b = a.canLose
				? await runOnce(
						where,
						fn,
						mapId,
						mkFlags(),
						pick,
						LOSE_FIRST,
						label,
						null,
						lv,
					)
				: null;
			const maxN = Math.max(a.maxN, b?.maxN ?? 0);
			maxAll = Math.max(maxAll, maxN);
			canLose ||= a.canLose;
			if (!a.random && !b?.random && maxN - 1 <= pick) break;
		}
		// 選択肢が2つ以上あれば、選び方の組み合わせもたどる（pick を固定すると通らない入れ子の選択）
		if (maxAll > 1) {
			await explore(where, fn, mapId, mkFlags, label, 0, lv);
			if (canLose)
				await explore(where, fn, mapId, mkFlags, label, LOSE_FIRST, lv);
		}
	};

	/**
	 * 選び方の組み合わせを幅優先でたどる（浅い選択のちがいから先に。MAX_PATHS 本まで）。
	 * 1本走らせるごとに、道の先で出た選択肢の「ほかの番号」を次の道として積む。
	 */
	const explore = async (where, fn, mapId, mkFlags, label, loseFirst, lv) => {
		const queue = [[]];
		for (let n = 0; n < MAX_PATHS && queue.length; n++) {
			const path = queue.shift();
			const ctx = await runOnce(
				where,
				fn,
				mapId,
				mkFlags(),
				0,
				loseFirst,
				label,
				path,
				lv,
			);
			for (let k = path.length; k < ctx.counts.length; k++)
				for (let j = 1; j < ctx.counts[k]; j++)
					queue.push([...ctx.taken.slice(0, k), j]);
		}
	};

	/** フラグの組 base で走らせ、読んだフラグを1つずつ反転させて走らせ直す（ほかの分岐の先も通す）。 */
	const runBase = async (where, fn, mapId, base) => {
		const tag = typeof base === "number" ? `typed${base}` : base;
		// 仲間のレベルもフラグの組に合わせる（はじめ＝1・ぜんぶ＝MAX_LV・2周目＝5）
		const lv = base === "none" ? 1 : base === "all" ? P.MAX_LV : 5;
		const reads = new Set();
		await runVariants(
			where,
			fn,
			mapId,
			() => makeFlags(base, null, reads),
			`flags=${tag} lv=${lv}`,
			lv,
		);
		for (const k of [...reads].slice(0, MAX_FLIPS))
			await runVariants(
				where,
				fn,
				mapId,
				() => makeFlags(base, k, null),
				`flags=${tag} lv=${lv} ${base === "none" ? "+" : "-"}${k}`,
				lv,
			);
	};

	/** 走らせたスクリプト（2周目にもう一度走らせる）。 */
	const jobs = [];
	const run = async (where, fn, mapId) => {
		scripts++;
		jobs.push([where, fn, mapId]);
		for (const base of ["none", "all"]) await runBase(where, fn, mapId, base);
	};

	/** when を評価する（例外が出ないか）。where は「map town kosan」のような名前。 */
	const checkWhen = (where, when, mapId, flags) => {
		try {
			when({
				flags,
				party: [],
				items: {},
				mapId,
				x: 0,
				y: 0,
				dir: "down",
				playMs: 0,
			});
		} catch (ex) {
			err(`${where}: when が例外: ${ex?.message ?? ex}`);
		}
	};

	// when の検査用（空・すべて立っている）
	const whenFlagSets = () => [{}, makeFlags("all", null, null)];

	for (const [id, m] of Object.entries(maps)) {
		if (m.onEnter) await run(`map ${id} onEnter`, m.onEnter, id);
		for (const e of m.events ?? []) {
			if (e.when)
				for (const flags of whenFlagSets())
					checkWhen(`map ${id} ${e.id}`, e.when, id, flags);
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

	// ── 2周目：1周目にスクリプトが set した値（文字列・数）をフラグに入れて、もう一度走らせる ──
	// 別の包みが立てた値で変わる文（古参ニキの reply_kako・実況J民の daida・名言の引用など）を通す
	for (const [k, vs] of setFlags) {
		const typed = [...vs].filter(
			(v) => typeof v === "string" || typeof v === "number",
		);
		if (typed.length) typedDomain.set(k, typed);
	}
	for (let i = 0; i < TYPED; i++) {
		const flags = makeFlags(i, null, null);
		for (const [id, m] of Object.entries(maps))
			for (const e of m.events ?? [])
				if (e.when) checkWhen(`map ${id} ${e.id}`, e.when, id, flags);
		for (const k of bonds.skits)
			if (k.when) checkWhen(`skit ${k.id}`, k.when, data.start.mapId, flags);
		for (const [j, c] of bonds.chats.entries())
			if (c.when)
				checkWhen(`chat ${c.who} #${j}`, c.when, data.start.mapId, flags);
	}
	for (const [where, fn, mapId] of jobs)
		for (let i = 0; i < TYPED; i++) await runBase(where, fn, mapId, i);

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
	// 戦闘の文（ログ1枚）：改行なし・MAX_LOG 字まで・使わない言葉・変な値
	const checkLog = (where, text) => {
		if (typeof text !== "string") {
			err(`${where}: 文が文字列でない`);
			return;
		}
		if (text.includes("\n"))
			warn(`${where}: 戦闘の文に改行がある（効かない）: ${oneLine(text)}`);
		if (width(text) > MAX_LOG)
			warn(
				`${where}: 戦闘の文が長い（${width(text)}字・${MAX_LOG}字まで）: ${text}`,
			);
		checkWords(where, text);
		checkValue(where, text);
	};
	for (const [id, en] of Object.entries(data.enemies)) {
		for (const act of en.acts ?? []) checkWords(`enemy ${id}`, act.text);
		if (en.downText !== undefined)
			checkLog(`enemy ${id} downText`, en.downText.replace("{user}", en.name));
		const sm = en.summon;
		if (!sm) continue;
		const who = (t) => t.replace("{user}", en.name);
		if (!sm.stock?.length) err(`enemy ${id}: summon.stock が空`);
		if (!sm.evade?.length) err(`enemy ${id}: summon.evade が空`);
		for (const t of [
			...(sm.evade ?? []),
			...(sm.exposed ?? []),
			sm.finish,
			...(sm.early ? [sm.early] : []),
		])
			checkLog(`enemy ${id} summon`, who(t));
		for (const [k, st] of (sm.stock ?? []).entries()) {
			const d = data.enemies[st.enemy];
			if (!d) {
				err(`enemy ${id}: summon.stock[${k}] の敵 "${st.enemy}" が無い`);
				continue;
			}
			if (d.summon)
				err(
					`enemy ${id}: 呼ぶ敵 "${st.enemy}" も summon を持っている（入れ子は不可）`,
				);
			if ((d.scale ?? 1.5) > 2)
				warn(
					`enemy ${id}: 呼ぶ敵 "${st.enemy}" の scale が 2 より大きい（スマホ縦で並ばない）`,
				);
			const r = st.restore;
			if (r && !(r.rate > 0 && r.rate <= 1))
				err(`enemy ${id}: summon.stock[${k}].restore.rate が 0〜1 でない`);
			const fill = (t) => who(t).replace("{name}", d.name);
			for (const t of [
				...(st.text ?? []),
				st.deploy ?? "{name}を　デプロイした！",
				...(st.after ?? []),
				...(r ? [r.text] : []),
			])
				checkLog(`enemy ${id} summon ${st.enemy}`, fill(t));
		}
	}
	// うた（battle.skills）は { id, lv } で、覚えるレベルの順。覚えたときの文も長さを調べる
	for (const [id, c] of Object.entries(data.cast)) {
		const list = c.battle?.skills ?? [];
		if (!Array.isArray(list)) {
			err(`cast ${id}: battle.skills が配列でない`);
			continue;
		}
		const ids = new Set();
		let prev = 0;
		for (const s of list) {
			if (
				typeof s !== "object" ||
				s === null ||
				typeof s.id !== "string" ||
				!Number.isInteger(s.lv) ||
				s.lv < 1 ||
				s.lv > P.MAX_LV
			) {
				err(
					`cast ${id}: うた ${JSON.stringify(s)} が { id, lv: 1〜${P.MAX_LV} } になっていない`,
				);
				continue;
			}
			if (!data.skills[s.id]) err(`cast ${id}: 技 "${s.id}" が無い`);
			if (ids.has(s.id)) err(`cast ${id}: うた "${s.id}" が重複`);
			ids.add(s.id);
			if (s.lv < prev)
				warn(
					`cast ${id}: うたが 覚えるレベルの順に並んでいない（${s.id} Lv${s.lv}）`,
				);
			prev = Math.max(prev, s.lv);
		}
		const mp = c.battle?.mp;
		if (list.length && mp && mp[0] === 0 && mp[1] === 0)
			warn(`cast ${id}: こえが 0 なのに うたが ある`);
		// Lv2 から上で覚えるうたの知らせ（加入したときに覚えている Lv1 のうたは出ない）
		for (const t of P.learnTexts(data, id, 1, P.MAX_LV)) {
			checkText(`cast ${id} おぼえた`, t);
			checkValue(`cast ${id} おぼえた`, t);
		}
		if (c.battle) {
			checkText(`engine benchText ${id}`, P.benchText(c.name));
			checkText(`engine backText ${id}`, P.backText(c.name));
		}
	}
	checkText("engine BENCH_HINT", P.BENCH_HINT);
	for (const id of data.benchFirst ?? [])
		if (!data.cast[id]?.battle)
			err(`benchFirst: "${id}" が cast に無い（戦闘能力が無い）`);
	const st = data.start;
	if (!maps[st.mapId]) err(`start: マップ "${st.mapId}" が無い`);
	else if (!passable(st.mapId, st.x, st.y))
		err(`start: 開始位置 ${st.mapId} (${st.x},${st.y}) が通れない`);

	// ── 自由度：名言表（freedom.ts の MEIGEN） ──
	try {
		const { MEIGEN } = await server.ssrLoadModule("/src/data/freedom.ts");
		if (!Array.isArray(MEIGEN) || MEIGEN.length !== 3)
			err("freedom MEIGEN: 3つ（その1〜その3）の表になっていない");
		else
			for (const [k, list] of MEIGEN.entries()) {
				const where = `freedom MEIGEN その${k + 1}`;
				if (!Array.isArray(list) || list.length < 2 || list.length > 4) {
					err(`${where}: 選択肢が 2〜4 個になっていない`);
					continue;
				}
				for (const [i, m] of list.entries()) {
					if (
						typeof m?.label !== "string" ||
						typeof m?.line !== "string" ||
						typeof m?.quote !== "string"
					) {
						err(`${where}-${i}: label・line・quote のどれかが無い`);
						continue;
					}
					const label = `>>${i + 1} ${m.label}`;
					if (width(label) > MAX_CHOICE)
						warn(`${where}: 選択肢が長い（${width(label)}字）: ${label}`);
					checkWords(where, label);
					checkText(where, m.line);
					// 次の名言チャレンジ・エンディングでの引用（spec §4 F1・F6-3）
					checkText(
						`${where} 引用`,
						`「${m.quote}」よりは\nましなのを　たのむアル`,
					);
					checkText(`${where} 引用`, `「${m.quote}」の　つぎは\nなにかな〜`);
					checkText(`${where} 引用`, `「${m.quote}」とは\nえらい　ちがいやな`);
				}
			}
	} catch (e) {
		err(`freedom.ts を読めない: ${e?.message ?? e}`);
	}

	// ── 自由度：組み立てる文（threadlog.ts）とフラグの約束 ──
	let tl = null;
	let tlWhy = "";
	try {
		tl = await server.ssrLoadModule("/src/data/threadlog.ts");
	} catch (e) {
		tlWhy = `読めない（${String(e?.message ?? e).split("\n")[0]}）`;
	}
	const need = ["FLAG_DOMAIN", "floodWaves", "VARIANTS", "threadSummary"];
	const missing = tl ? need.filter((k) => tl[k] == null) : need;
	if (!tl || missing.length) {
		warn(
			`threadlog.ts: ${tl ? `${missing.join("・")} が無い` : tlWhy}ので、組み立てる文とフラグの約束の検査を飛ばす`,
		);
	} else {
		const { FLAG_DOMAIN, floodWaves, VARIANTS, threadSummary } = tl;
		const keys = Object.keys(FLAG_DOMAIN);
		const party = ["kiriko", "roze", "feris", "teto"].map((id) => ({
			id,
			lv: 20,
			exp: 0,
			hp: 100,
			mp: 50,
		}));
		const stateOf = (flags) => ({
			mapId: "thread",
			x: 6,
			y: 6,
			dir: "up",
			flags: { clear: true, ...flags },
			party,
			items: {},
			playMs: 0,
		});
		const noteOf = (flags) => JSON.stringify(flags);

		const checkState = (flags) => {
			const note = noteOf(flags);
			const st = stateOf(flags);
			const where = "threadlog floodWaves";
			try {
				const waves = floodWaves(st);
				if (!Array.isArray(waves)) err(`${where}: 配列を返していない`, note);
				else {
					if (waves.length !== 3)
						warn(`${where}: ${waves.length} 波（3波の約束）`, note);
					for (const w of waves) {
						if (typeof w?.screen !== "string" || !Array.isArray(w?.picks)) {
							err(`${where}: screen（文字列）と picks（配列）が要る`, note);
							continue;
						}
						checkText(where, w.screen, note);
						checkValue(where, w.screen, note);
						for (const p of w.picks) {
							// 見出しは選択肢なので、セリフより短い MAX_CHOICE で見る
							if (width(p.label) > MAX_CHOICE)
								warn(`${where}: 見出しが長い: ${p.label}`, note);
							checkWords(where, p.label, note);
							checkText(where, p.line, note);
							checkValue(where, p.line, note);
							if (!data.items[p.item?.id])
								err(`${where}: 知らない どうぐ "${p.item?.id}"`, note);
						}
					}
				}
			} catch (e) {
				err(`${where}: 例外: ${e?.message ?? e}`, note);
			}
			for (const [name, fn] of Object.entries(VARIANTS)) {
				const where = `threadlog VARIANTS.${name}`;
				if (typeof fn !== "function") {
					err(`${where}: 関数ではない`);
					continue;
				}
				try {
					const t = fn(st);
					if (t !== null && typeof t !== "string")
						err(`${where}: 文字列か null を返していない: ${String(t)}`, note);
					else if (t !== null) {
						checkText(where, t, note);
						checkValue(where, t, note);
					}
				} catch (e) {
					err(`${where}: 例外: ${e?.message ?? e}`, note);
				}
			}
			try {
				checkSummary("threadlog threadSummary", threadSummary(st), note, true);
			} catch (e) {
				err(`threadlog threadSummary: 例外: ${e?.message ?? e}`, note);
			}
		};

		// 何も立っていない状態と、1つだけ値を変えた状態
		checkState({});
		for (const k of keys)
			for (const v of FLAG_DOMAIN[k] ?? []) {
				if (v === undefined) continue;
				checkState({ [k]: v });
			}
		// ランダムな組み合わせ（決まった順）と、全部いちばん後ろの値
		const rand = rng(1000);
		for (let i = 0; i < RANDOM_COMBOS; i++) {
			const flags = {};
			for (const k of keys) {
				const dom = FLAG_DOMAIN[k] ?? [];
				const v = dom[Math.floor(rand() * dom.length)];
				if (v !== undefined) flags[k] = v;
			}
			checkState(flags);
		}
		const last = {};
		for (const k of keys) {
			const dom = FLAG_DOMAIN[k] ?? [];
			if (dom.length && dom[dom.length - 1] !== undefined)
				last[k] = dom[dom.length - 1];
		}
		checkState(last);

		// フラグの約束：FLAG_DOMAIN のフラグが、どこかのスクリプトの set で立つか。値が範囲内か
		for (const k of keys) {
			if (ENGINE_FLAG.test(k)) continue;
			const got = setFlags.get(k);
			if (!got) {
				warn(
					`フラグの約束: "${k}" は FLAG_DOMAIN にあるが、どのスクリプトでも立たない（包みの結合漏れ？）`,
				);
				continue;
			}
			const dom = (FLAG_DOMAIN[k] ?? []).filter((v) => v !== undefined);
			const strs = dom.filter((v) => typeof v === "string");
			const nums = dom.filter((v) => typeof v === "number");
			// 文字列の値と、0 からの連番（選んだ番号）の値だけ範囲を調べる（回数は調べない）
			const indexLike = nums.length > 0 && nums.every((v, i) => v === i);
			for (const v of got) {
				if (typeof v === "string" && strs.length && !strs.includes(v))
					warn(
						`フラグの約束: "${k}" に FLAG_DOMAIN に無い値 "${v}" が入る（${strs.join("・")}）`,
					);
				if (typeof v === "number" && indexLike && !nums.includes(v))
					warn(
						`フラグの約束: "${k}" に FLAG_DOMAIN に無い値 ${v} が入る（${nums.join("・")}）`,
					);
			}
		}
	}

	// ── モチーフの回数（「一週間で　落ちる」は3回だけ） ──
	const files = [];
	const walk = (dir) => {
		for (const f of readdirSync(dir)) {
			const p = join(dir, f);
			if (statSync(p).isDirectory()) walk(p);
			else if (/\.ts$/.test(f)) files.push(p);
		}
	};
	walk(join(ROOT, "src", "data"));
	const motif = [];
	for (const p of files) {
		const lines = readFileSync(p, "utf8").split("\n");
		lines.forEach((l, i) => {
			if (l.includes(MOTIF.text) && !/^\s*(\/\/|\*)/.test(l))
				motif.push(`${relative(ROOT, p).replace(/\\/g, "/")}:${i + 1}`);
		});
	}
	if (motif.length > MOTIF.max)
		warn(
			`「${MOTIF.text}　落ちる」のモチーフが ${motif.length} 回（${MOTIF.max} 回まで）: ${motif.join(" ")}`,
		);
} catch (e) {
	err(`読み込みに失敗: ${e?.stack ?? e}`);
} finally {
	Math.random = realRandom;
	await server.close();
}

for (const w of warns.values()) console.log(`⚠ ${w}`);
for (const e of errors.values()) console.log(`✖ ${e}`);
console.log(
	`\n${errors.size} errors, ${warns.size} warnings（${scripts} scripts, ${runs} runs, ${((performance.now() - t0) / 1000).toFixed(1)}s）`,
);
process.exit(errors.size ? 1 : 0);
