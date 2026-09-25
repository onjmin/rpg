// 戦闘の背景（MOTHER2 風）。
//
// 小さな模様を敷きつめて「色回し」でうごかし、1行ずつ 横・縦に ゆらす。
// それを2枚かさねる。模様・色・ゆれ方は 敵の群れの id から決める（同じ相手なら いつも同じ背景）。
// ボスは ゆれも色も ひときわ強く。動きを減らす設定の端末では 止まった1枚だけ描く。
// 描くのは画面の 1/SCALE の大きさの canvas（ドットのまま引きのばす）。

import { viewport } from "../engine/viewport";

/** canvas 1ドットが画面の何px か。 */
const SCALE = 3;
/** 模様の1辺（ドット）。 */
const TEX = 32;
/** 色回しの段数。 */
const STEPS = 16;
/** 描きなおす間隔（ms）。30fps で十分。 */
const FRAME_MS = 33;

type RGB = [number, number, number];

/** 色の組（ぐるっと一周してもとに戻る）。暗めにして 敵と文字を うもれさせない。 */
const PALETTES: string[][] = [
	["#2a1a5e", "#5b3fa8", "#a070e0", "#3a2a80"],
	["#0e2a4a", "#1f6a8a", "#5ad0c0", "#1a4060"],
	["#1c3a1a", "#3f7a2a", "#b8d050", "#2a5a30"],
	["#3a1a40", "#8a3a8a", "#f0a0c0", "#502060"],
	["#2a2a10", "#7a6a20", "#e0c060", "#403a18"],
	["#10203a", "#3050a0", "#e080f0", "#20306a"],
];
const BOSS_PALETTES: string[][] = [
	["#3a0810", "#8a1020", "#f06030", "#500a18"],
	["#2a0830", "#7a1060", "#ff50a0", "#40103a"],
	["#301008", "#902a10", "#ffd040", "#5a1a0a"],
];

type Warp = "wave" | "interlace" | "squash";

type Layer = {
	tex: Uint8Array;
	pal: RGB[];
	warp: Warp;
	/** ゆれの大きさ（ドット）・細かさ・速さ。 */
	amp: number;
	freq: number;
	speed: number;
	/** 色回しの速さ（段/秒）。 */
	cycle: number;
	/** 流れる向き（ドット/秒）。 */
	sx: number;
	sy: number;
};

/** 文字列から決まる乱数（mulberry32）。 */
const rng = (seed: string): (() => number) => {
	let h = 1779033703;
	for (let i = 0; i < seed.length; i++)
		h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
	let a = h >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const hex = (s: string): RGB => [
	Number.parseInt(s.slice(1, 3), 16),
	Number.parseInt(s.slice(3, 5), 16),
	Number.parseInt(s.slice(5, 7), 16),
];

/** 色の組を STEPS 段の輪にする（最後の色から最初の色へ つなぐ）。 */
const ring = (stops: string[]): RGB[] => {
	const c = stops.map(hex);
	const out: RGB[] = [];
	for (let i = 0; i < STEPS; i++) {
		const p = (i / STEPS) * c.length;
		const a = c[Math.floor(p)];
		const b = c[(Math.floor(p) + 1) % c.length];
		const f = p - Math.floor(p);
		out.push([
			Math.round(a[0] + (b[0] - a[0]) * f),
			Math.round(a[1] + (b[1] - a[1]) * f),
			Math.round(a[2] + (b[2] - a[2]) * f),
		]);
	}
	return out;
};

/** 模様（各ドットは色の輪の何段目か）。どれも TEX で 継ぎ目なく つながる。 */
const PATTERNS: ((x: number, y: number) => number)[] = [
	// ななめの縞
	(x, y) => (x + y) / 2,
	// 市松 ＋ 段
	(x, y) => (((x >> 3) ^ (y >> 3)) & 1) * 8 + (y & 7),
	// ひし形
	(x, y) => Math.abs((x & 15) - 8) + Math.abs((y & 15) - 8),
	// 輪
	(x, y) => Math.hypot((x & 15) - 7.5, (y & 15) - 7.5) * 1.6,
	// 格子
	(x, y) => Math.min(x & 7, 7 - (x & 7), y & 7, 7 - (y & 7)) * 3 + (x >> 3),
	// なみ
	(x, y) =>
		4 * Math.sin((x / TEX) * Math.PI * 4) +
		4 * Math.sin((y / TEX) * Math.PI * 2) +
		8,
];

const texture = (fn: (x: number, y: number) => number): Uint8Array => {
	const t = new Uint8Array(TEX * TEX);
	for (let y = 0; y < TEX; y++)
		for (let x = 0; x < TEX; x++)
			t[y * TEX + x] = (((Math.floor(fn(x, y)) % STEPS) + STEPS) % STEPS) | 0;
	return t;
};

const pick = <T>(r: () => number, xs: T[]): T =>
	xs[Math.floor(r() * xs.length)];

const makeLayer = (r: () => number, boss: boolean, back: boolean): Layer => {
	const pal = ring(pick(r, boss ? BOSS_PALETTES : PALETTES));
	const k = boss ? 1.6 : 1;
	return {
		tex: texture(pick(r, PATTERNS)),
		pal,
		warp: pick(r, ["wave", "interlace", "squash"] as Warp[]),
		amp: (back ? 6 : 3 + r() * 5) * k,
		freq: 0.04 + r() * 0.08,
		speed: (1.2 + r() * 1.6) * k,
		cycle: (back ? 3 : 5 + r() * 6) * k,
		sx: (r() - 0.5) * 12,
		sy: (r() - 0.5) * 12,
	};
};

/**
 * 背景の canvas をつくって うごかしはじめる。
 * canvas が画面から外れたら（戦闘の画面を消したら）ひとりでに止まる。
 */
export const battleBackdrop = (
	seed: string,
	boss: boolean,
): HTMLCanvasElement => {
	const r = rng(`bg:${seed}`);
	const layers = [makeLayer(r, boss, true), makeLayer(r, boss, false)];
	const canvas = document.createElement("canvas");
	canvas.className = "battle-bg-canvas";
	const ctx = canvas.getContext("2d");
	if (!ctx) return canvas;
	let img: ImageData | null = null;

	const draw = (sec: number) => {
		const w = Math.max(1, Math.ceil(viewport.w / SCALE));
		const h = Math.max(1, Math.ceil(viewport.h / SCALE));
		if (!img || img.width !== w || img.height !== h) {
			canvas.width = w;
			canvas.height = h;
			img = ctx.createImageData(w, h);
		}
		const px = img.data;
		for (let li = 0; li < layers.length; li++) {
			const L = layers[li];
			const shift = Math.floor(sec * L.cycle);
			const ox = sec * L.sx;
			const oy = sec * L.sy;
			const ph = sec * L.speed;
			for (let y = 0; y < h; y++) {
				const s = Math.sin(y * L.freq + ph) * L.amp;
				let dx = 0;
				let yy = y;
				if (L.warp === "wave") dx = s;
				else if (L.warp === "interlace") dx = y & 1 ? s : -s;
				else yy = y + s;
				const v = ((Math.floor(yy + oy) % TEX) + TEX) % TEX;
				const row = v * TEX;
				const base = Math.floor(dx + ox);
				let o = y * w * 4;
				for (let x = 0; x < w; x++, o += 4) {
					const u = (((x + base) % TEX) + TEX) % TEX;
					const c = L.pal[(L.tex[row + u] + shift) % STEPS];
					if (li === 0) {
						px[o] = c[0];
						px[o + 1] = c[1];
						px[o + 2] = c[2];
						px[o + 3] = 255;
					} else {
						// 2枚目は半分すかして かさねる
						px[o] = (px[o] + c[0]) >> 1;
						px[o + 1] = (px[o + 1] + c[1]) >> 1;
						px[o + 2] = (px[o + 2] + c[2]) >> 1;
					}
				}
			}
		}
		ctx.putImageData(img, 0, 0);
	};

	const still =
		typeof matchMedia === "function" &&
		matchMedia("(prefers-reduced-motion: reduce)").matches;
	draw(0);
	if (still) return canvas;

	let t0 = 0;
	let last = 0;
	const tick = (now: number) => {
		// まだ付けていないうちは待ち、付けたあとに外れたら止める
		if (canvas.isConnected) {
			if (!t0) t0 = now;
			if (now - last >= FRAME_MS) {
				last = now;
				draw((now - t0) / 1000);
			}
		} else if (t0) return;
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
	return canvas;
};
