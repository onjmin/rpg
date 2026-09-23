// 素材が見つからなかったドット絵を作る（node scripts/make-sprites.mjs）。
//
// - public/sprites/mujje.png        … ムッジェ ΣΩΩ>（赤い毛むくじゃら）。RPGEN 歩行グラ規格 32x64
// - public/sprites/kiriko_botsu.png … ボツキリコ。キリコの歩行グラを灰色に沈めた差分 32x64
// - public/sprites/phono.png        … ちいさな蓄音機（置物）16x16
//
// 依存なし（zlib だけ）。ドット絵は下の文字の絵から作る。

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, inflateSync } from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public/sprites");

// ───────────────── 最小 PNG（RGBA 8bit・非インターレース） ─────────────────

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
	let c = n;
	for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	return c >>> 0;
});
const crc32 = (buf) => {
	let c = 0xffffffff;
	for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
	return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length);
	const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(td));
	return Buffer.concat([len, td, crc]);
};
const encodePng = (w, h, rgba) => {
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(w, 0);
	ihdr.writeUInt32BE(h, 4);
	ihdr[8] = 8;
	ihdr[9] = 6;
	const raw = Buffer.alloc((w * 4 + 1) * h);
	for (let y = 0; y < h; y++) {
		raw[y * (w * 4 + 1)] = 0;
		rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
	}
	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		chunk("IHDR", ihdr),
		chunk("IDAT", deflateSync(raw)),
		chunk("IEND", Buffer.alloc(0)),
	]);
};

/** RGBA 8bit・非インターレースの PNG だけ読む（キリコの歩行グラ用）。 */
const decodePng = (buf) => {
	let pos = 8;
	let w = 0;
	let h = 0;
	let colorType = 0;
	const idat = [];
	while (pos < buf.length) {
		const len = buf.readUInt32BE(pos);
		const type = buf.toString("ascii", pos + 4, pos + 8);
		const data = buf.subarray(pos + 8, pos + 8 + len);
		if (type === "IHDR") {
			w = data.readUInt32BE(0);
			h = data.readUInt32BE(4);
			if (data[8] !== 8 || data[12] !== 0)
				throw new Error("8bit・非インターレースのみ対応");
			colorType = data[9];
		} else if (type === "IDAT") idat.push(data);
		pos += 12 + len;
	}
	if (colorType !== 6)
		throw new Error(`colorType ${colorType} は未対応（RGBA のみ）`);
	const raw = inflateSync(Buffer.concat(idat));
	const bpp = 4;
	const stride = w * bpp;
	const out = Buffer.alloc(stride * h);
	for (let y = 0; y < h; y++) {
		const f = raw[y * (stride + 1)];
		const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? out[y * stride + x - bpp] : 0;
			const b = y > 0 ? out[(y - 1) * stride + x] : 0;
			const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
			let v = line[x];
			if (f === 1) v += a;
			else if (f === 2) v += b;
			else if (f === 3) v += (a + b) >> 1;
			else if (f === 4) {
				const p = a + b - c;
				const pa = Math.abs(p - a);
				const pb = Math.abs(p - b);
				const pc = Math.abs(p - c);
				v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
			}
			out[y * stride + x] = v & 0xff;
		}
	}
	return { w, h, rgba: out };
};

// ───────────────── 文字の絵 → 画素 ─────────────────

const hex = (s) => [
	Number.parseInt(s.slice(1, 3), 16),
	Number.parseInt(s.slice(3, 5), 16),
	Number.parseInt(s.slice(5, 7), 16),
	255,
];

/** 16x16 のコマを sheet の (cx, cy) マスに描く。 */
const paint = (sheet, sheetW, cx, cy, art, pal) => {
	art.forEach((row, y) => {
		if (row.length !== 16) throw new Error(`行の長さが16でない: "${row}"`);
		[...row].forEach((ch, x) => {
			if (ch === ".") return;
			const col = pal[ch];
			if (!col) throw new Error(`色 "${ch}" が未定義`);
			const i = ((cy * 16 + y) * sheetW + cx * 16 + x) * 4;
			sheet[i] = col[0];
			sheet[i + 1] = col[1];
			sheet[i + 2] = col[2];
			sheet[i + 3] = col[3];
		});
	});
};

const mirror = (art) => art.map((r) => [...r].reverse().join(""));

// ───────────────── ムッジェ ΣΩΩ> ─────────────────
// 板のバナーに出る赤い毛むくじゃら（ムック＋J民）。大きな口「>」と、頭のプロペラ。

const MUJJE_PAL = {
	K: hex("#3a0d0a"), // 輪郭
	R: hex("#d8352a"), // 毛
	r: hex("#9e1f17"), // 毛の影
	P: hex("#f27a5e"), // 毛のつや
	W: hex("#ffffff"),
	B: hex("#141414"),
	M: hex("#5a0f12"), // 口の中
	T: hex("#ff9aa2"), // 舌
	Y: hex("#f6c945"), // プロペラ
	y: hex("#b98a1a"),
};

const mujjeDown = [
	[
		".....YYKYY......",
		".......K........",
		"....KKKKKKKK....",
		"...KRPRRRRPRK...",
		"..KRRRRRRRRRRK..",
		"..KRWWRRRRWWRK..",
		".KRRWBRRRRWBRRK.",
		".KRRRRRRRRRRRRK.",
		".KRRKKKKKKKKRRK.",
		".KRRKMMMMMMKRRK.",
		".KRRKMTTTTMKRRK.",
		"..KRRKKKKKKRRK..",
		"..KRrRRrRRrRRK..",
		"...KRrKRRKrRK...",
		"...KKK.KK.KKK...",
		"................",
	],
	[
		"......YKYYY.....",
		".......K........",
		"....KKKKKKKK....",
		"...KRPRRRRPRK...",
		"..KRRRRRRRRRRK..",
		"..KRWWRRRRWWRK..",
		".KRRWBRRRRWBRRK.",
		".KRRRRRRRRRRRRK.",
		".KRRKKKKKKKKRRK.",
		".KRRKMMMMMMKRRK.",
		".KRRKMTTTTMKRRK.",
		"..KRRKKKKKKRRK..",
		"..KRrRRrRRrRRK..",
		"...KRrKRRKrRK...",
		"....KK.KK.KK....",
		"....KK....KK....",
	],
];

const mujjeUp = [
	[
		".....YYKYY......",
		".......K........",
		"....KKKKKKKK....",
		"...KRRRRRRRRK...",
		"..KRrRRrRRrRRK..",
		"..KRRRRRRRRRRK..",
		".KRRrRRrRRrRRRK.",
		".KRRRRRRRRRRRRK.",
		".KRrRRrRRrRRrRK.",
		".KRRRRRRRRRRRRK.",
		".KRRrRRrRRrRRRK.",
		"..KRRRRRRRRRRK..",
		"..KRrRRrRRrRRK..",
		"...KRrKRRKrRK...",
		"...KKK.KK.KKK...",
		"................",
	],
	[
		"......YKYYY.....",
		".......K........",
		"....KKKKKKKK....",
		"...KRRRRRRRRK...",
		"..KRrRRrRRrRRK..",
		"..KRRRRRRRRRRK..",
		".KRRrRRrRRrRRRK.",
		".KRRRRRRRRRRRRK.",
		".KRrRRrRRrRRrRK.",
		".KRRRRRRRRRRRRK.",
		".KRRrRRrRRrRRRK.",
		"..KRRRRRRRRRRK..",
		"..KRrRRrRRrRRK..",
		"...KRrKRRKrRK...",
		"....KK.KK.KK....",
		"....KK....KK....",
	],
];

// 右向き：顔が右に寄り、口「>」が右を向く
const mujjeRight = [
	[
		".....YYKYY......",
		".......K........",
		"....KKKKKKKK....",
		"...KRRRRRPRRK...",
		"..KRRRRRRRRRRK..",
		"..KRRRRRWWRRRK..",
		".KRRrRRRWBRRRK..",
		".KRRRRRRRRRRRKK.",
		".KRrRRRRKKKKKKK.",
		".KRRRRRRKMMMMK..",
		".KRRrRRRKMTTK...",
		"..KRRRRRKKKK....",
		"..KRrRRrRRRK....",
		"...KRrKRRKK.....",
		"...KKK.KKK......",
		"................",
	],
	[
		"......YKYYY.....",
		".......K........",
		"....KKKKKKKK....",
		"...KRRRRRPRRK...",
		"..KRRRRRRRRRRK..",
		"..KRRRRRWWRRRK..",
		".KRRrRRRWBRRRK..",
		".KRRRRRRRRRRRKK.",
		".KRrRRRRKKKKKKK.",
		".KRRRRRRKMMMMK..",
		".KRRrRRRKMTTK...",
		"..KRRRRRKKKK....",
		"..KRrRRrRRRK....",
		"...KRrKRRKK.....",
		"....KKKK.KK.....",
		"....KK....K.....",
	],
];

// RPGEN 規格の行順: 後(上)・右・前(下)・左
const mujje = Buffer.alloc(32 * 64 * 4);
for (let f = 0; f < 2; f++) {
	paint(mujje, 32, f, 0, mujjeUp[f], MUJJE_PAL);
	paint(mujje, 32, f, 1, mujjeRight[f], MUJJE_PAL);
	paint(mujje, 32, f, 2, mujjeDown[f], MUJJE_PAL);
	paint(mujje, 32, f, 3, mirror(mujjeRight[f]), MUJJE_PAL);
}
writeFileSync(join(OUT, "mujje.png"), encodePng(32, 64, mujje));

// ───────────────── ボツキリコ ─────────────────
// キリコの歩行グラを「色を抜いて、冷たい灰色に沈めた」差分。
// 若草色の髪（ポニテ）は黒っぽい鉄色にして、角刈りっぽい重さを出す。

const src = decodePng(readFileSync(join(OUT, "kiriko.png")));
const botsu = Buffer.from(src.rgba);
for (let i = 0; i < botsu.length; i += 4) {
	const [r, g, b, a] = botsu.subarray(i, i + 4);
	if (a === 0) continue;
	const lum = 0.3 * r + 0.59 * g + 0.11 * b;
	const greenish = g > r + 20 && g > b; // 若草色の髪
	if (greenish) {
		// 髪は暗い鉄色
		const v = Math.round(40 + lum * 0.35);
		botsu[i] = v;
		botsu[i + 1] = v + 4;
		botsu[i + 2] = v + 12;
	} else {
		// それ以外は青みの灰色に（少し暗く）
		const v = Math.round(lum * 0.8 + 18);
		botsu[i] = Math.min(255, v);
		botsu[i + 1] = Math.min(255, v + 6);
		botsu[i + 2] = Math.min(255, v + 18);
	}
}
writeFileSync(join(OUT, "kiriko_botsu.png"), encodePng(src.w, src.h, botsu));

// ───────────────── ちいさな蓄音機（置物） ─────────────────
// 金色のラッパと木の箱、黒いレコード。

const PHONO_PAL = {
	K: hex("#2b1a0e"), // 輪郭
	G: hex("#f2c14e"), // ラッパ（金）
	g: hex("#b98322"), // ラッパの影
	L: hex("#fff0b0"), // ラッパのつや
	N: hex("#9a5b2c"), // 木
	n: hex("#6a3a18"), // 木の影
	B: hex("#1a1a1a"), // レコード
	b: hex("#4a4a4a"), // レコードの溝
	R: hex("#d8352a"), // レーベル
	S: hex("#c8c8c8"), // アーム
};

const phonoArt = [
	"..KKKK..........",
	".KLGGGKK........",
	"KLGGGGGGK.......",
	"KGGGgGGGGK......",
	"KGGgKgGGGGK.....",
	".KGgKKgGGGK.....",
	"..KKK.KgGGK.....",
	"......KKgGK.....",
	".......KgK......",
	"..KKKKKKSKKKK...",
	".KBbBbBRBbBbBK..",
	".KKKKKKKKKKKKK..",
	".KNNNNNNNNNNNK..",
	".KNnNNNNNNNnNK..",
	".KNNNNNNNNNNNK..",
	".KKKKKKKKKKKKK..",
];
const phono = Buffer.alloc(16 * 16 * 4);
paint(phono, 16, 0, 0, phonoArt, PHONO_PAL);
writeFileSync(join(OUT, "phono.png"), encodePng(16, 16, phono));

console.log("wrote mujje.png, kiriko_botsu.png, phono.png");
