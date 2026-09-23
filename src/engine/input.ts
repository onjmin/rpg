// 入力（キーボード・画面上の十字キー/ボタン・タップ）をまとめる。
//
// - 方向は「押しっぱなし」を持つ（フィールド移動はポーリングで読む）。
// - A/B と方向の「押した瞬間」は、ハンドラのスタック最上段に配る。
//   メッセージ窓・選択肢・メニュー・戦闘がハンドラを積み、閉じたら外す。
//   スタックが空のときはフィールド用キューに入る。

import type { Dir } from "./types";

export type Key = Dir | "a" | "b";
type Handler = (key: Key, repeat: boolean) => void;

const KEYMAP: Record<string, Key> = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	KeyW: "up",
	KeyS: "down",
	KeyA: "left",
	KeyD: "right",
	KeyZ: "a",
	Enter: "a",
	Space: "a",
	KeyX: "b",
	Escape: "b",
	Backspace: "b",
};

const isDir = (k: Key): k is Dir =>
	k === "up" || k === "down" || k === "left" || k === "right";

export class Input {
	/** 押されている方向（後に押したものほど後ろ）。source は "key:ArrowUp" / "pad" など。 */
	private held: { dir: Dir; source: string }[] = [];
	private handlers: Handler[] = [];
	private fieldQueue: Key[] = [];
	/** フィールドでのタップ（ソース画素ではなく CSS 画素）。 */
	onFieldTap: ((clientX: number, clientY: number) => void) | null = null;
	/** 何かしら入力があったとき（オーディオのアンロック用）。 */
	onAnyInput: (() => void) | null = null;

	constructor() {
		window.addEventListener("keydown", (e) => {
			const key = KEYMAP[e.code];
			if (!key) return;
			// テキスト入力中は奪わない（現状は無いが念のため）
			const t = e.target as HTMLElement | null;
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
			e.preventDefault();
			if (isDir(key)) this.hold(key, `key:${e.code}`);
			this.press(key, e.repeat);
		});
		window.addEventListener("keyup", (e) => {
			const key = KEYMAP[e.code];
			if (key && isDir(key)) this.release(`key:${e.code}`);
		});
		window.addEventListener("blur", () => {
			this.held = [];
		});
	}

	/** 押した瞬間のキーを配る。 */
	press(key: Key, repeat = false): void {
		this.onAnyInput?.();
		const top = this.handlers[this.handlers.length - 1];
		if (top) {
			top(key, repeat);
			return;
		}
		if (!repeat && !isDir(key)) this.fieldQueue.push(key);
	}

	hold(dir: Dir, source: string): void {
		this.held = this.held.filter((h) => h.source !== source);
		this.held.push({ dir, source });
	}

	release(source: string): void {
		this.held = this.held.filter((h) => h.source !== source);
	}

	/** いま押されている方向（最後に押したもの）。 */
	heldDir(): Dir | null {
		return this.held.length ? this.held[this.held.length - 1].dir : null;
	}

	/** ハンドラを積む。戻り値を呼ぶと外れる。 */
	push(handler: Handler): () => void {
		this.handlers.push(handler);
		this.fieldQueue = [];
		return () => {
			const i = this.handlers.lastIndexOf(handler);
			if (i >= 0) this.handlers.splice(i, 1);
		};
	}

	get busy(): boolean {
		return this.handlers.length > 0;
	}

	/** フィールド用キューから1つ取り出す。 */
	takeField(): Key | undefined {
		return this.fieldQueue.shift();
	}

	clearField(): void {
		this.fieldQueue = [];
	}

	/** 画面上の十字キー（1つの要素。中心からの角度で方向を決める）。 */
	bindPad(el: HTMLElement): void {
		let active: number | null = null;
		let last: Dir | null = null;
		const update = (e: PointerEvent) => {
			const r = el.getBoundingClientRect();
			const dx = e.clientX - (r.left + r.width / 2);
			const dy = e.clientY - (r.top + r.height / 2);
			const dead = r.width * 0.12;
			let dir: Dir | null = null;
			if (Math.hypot(dx, dy) > dead) {
				dir =
					Math.abs(dx) > Math.abs(dy)
						? dx > 0
							? "right"
							: "left"
						: dy > 0
							? "down"
							: "up";
			}
			if (dir !== last) {
				last = dir;
				if (dir) {
					this.hold(dir, "pad");
					this.press(dir);
				} else {
					this.release("pad");
				}
				el.dataset.dir = dir ?? "";
			}
		};
		el.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			active = e.pointerId;
			el.setPointerCapture(e.pointerId);
			last = null;
			update(e);
		});
		el.addEventListener("pointermove", (e) => {
			if (e.pointerId === active) update(e);
		});
		const end = (e: PointerEvent) => {
			if (e.pointerId !== active) return;
			active = null;
			last = null;
			el.dataset.dir = "";
			this.release("pad");
		};
		el.addEventListener("pointerup", end);
		el.addEventListener("pointercancel", end);
	}

	/** 画面上のボタン（A/B）。 */
	bindButton(el: HTMLElement, key: Key): void {
		el.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			e.stopPropagation();
			el.classList.add("down");
			this.press(key);
		});
		const up = () => el.classList.remove("down");
		el.addEventListener("pointerup", up);
		el.addEventListener("pointercancel", up);
		el.addEventListener("pointerleave", up);
	}

	/**
	 * フィールド（canvas）のタップ。ハンドラが積まれているときは A 扱い
	 * （メッセージ送り）、空ならタップ移動としてフィールドへ渡す。
	 */
	bindField(el: HTMLElement): void {
		el.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			this.onAnyInput?.();
			if (this.handlers.length) {
				this.press("a");
				return;
			}
			this.onFieldTap?.(e.clientX, e.clientY);
		});
	}
}
