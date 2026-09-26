// 歩いているときの ひとこと（止まらない吹き出し）。画面の上に1行ずつ出て、勝手に消える。
// 押しても何も起きない（タップは下のフィールドへ通す）。送りは game.ts の update が時間で行う。

import { el } from "./dom";

export class AsideStrip {
	private root: HTMLDivElement;
	private nameEl: HTMLSpanElement;
	private textEl: HTMLSpanElement;
	private key = "";

	constructor(ui: HTMLElement) {
		this.nameEl = el("span", { class: "aside-name" });
		this.textEl = el("span", { class: "aside-text" });
		this.root = el("div", { class: "aside" }, [this.nameEl, this.textEl]);
		ui.append(this.root);
	}

	/** 行を出す（同じ行なら何もしない）。 */
	show(name: string, color: string | undefined, text: string): void {
		const key = `${name}\n${text}`;
		if (key !== this.key) {
			this.key = key;
			this.nameEl.textContent = name;
			this.nameEl.style.color = color ?? "";
			this.textEl.textContent = text;
			// 行が変わるたびに ふわっと出し直す
			this.root.classList.remove("shown");
			void this.root.offsetWidth;
		}
		this.root.classList.add("shown");
	}

	hide(): void {
		this.key = "";
		this.root.classList.remove("shown");
	}
}
