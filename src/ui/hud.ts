// 画面上のボタン類：十字キー・A/B・メニュー・ミュート。

import type { Input } from "../engine/input";
import { onSettingsChange, saveSettings, settings } from "../engine/settings";
import { el } from "./dom";

export const mountHud = (root: HTMLElement, input: Input): HTMLElement => {
	const pad = el("div", { class: "pad" }, [
		el("i", { class: "up" }),
		el("i", { class: "right" }),
		el("i", { class: "down" }),
		el("i", { class: "left" }),
	]);
	const a = el("button", { class: "btn btn-a", text: "A" });
	const b = el("button", { class: "btn btn-b", text: "B" });
	const menu = el("button", { class: "icon-btn menu-btn", text: "☰" });
	menu.title = "メニュー";
	const mute = el("button", { class: "icon-btn mute-btn" });
	mute.title = "BGM・効果音のミュート";
	const hud = el("div", { class: "hud" }, [
		pad,
		el("div", { class: "ab" }, [b, a]),
		el("div", { class: "top-btns" }, [mute, menu]),
	]);
	root.appendChild(hud);

	input.bindPad(pad);
	input.bindButton(a, "a");
	input.bindButton(b, "b");
	input.bindButton(menu, "b");
	mute.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		e.stopPropagation();
		input.onAnyInput?.();
		saveSettings({ mute: !settings.mute });
	});

	const sync = () => {
		mute.textContent = settings.mute ? "🔇" : "🔊";
		mute.classList.toggle("off", settings.mute);
		hud.classList.toggle("no-pad", !settings.pad);
	};
	sync();
	onSettingsChange(sync);
	return hud;
};
