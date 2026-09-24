// タイトル画面。

import type { GameState } from "../engine/defs";
import type { Game } from "../engine/game";
import { nextThreadState } from "../engine/newgame";
import { hasSave, readSave } from "../engine/save";
import { drawWalk, stepFrame } from "../engine/sprite";
import { el } from "./dom";
import { listWindow, settingsMenu } from "./menu";

/** タイトルを出し、「はじめから／つづきから」で選ばれた状態を返す。 */
export const showTitle = (game: Game): Promise<GameState> =>
	new Promise((resolve) => {
		const { data } = game;
		game.audio.bgm(data.titleBgm);
		document.title = data.title.replace(/\n/g, " ");
		const cast = ["kiriko", "roze", "teto", "feris"]
			.map((id) => data.cast[id])
			.filter(Boolean);
		const walkers = el("canvas", { class: "title-walkers" });
		walkers.width = cast.length * 20;
		walkers.height = 20;
		const root = el("div", { class: "title" }, [
			el("div", { class: "title-sub", text: data.subtitle ?? "" }),
			el("h1", {
				class: "title-logo",
				// 1行目は大きく、2行目以降（副題）は小さく
				html: data.title
					.split("\n")
					.map((line, i) =>
						i === 0 ? line : `<span class="title-logo-sub">${line}</span>`,
					)
					.join(""),
			}),
			walkers,
		]);
		const buttons = el("div", { class: "title-buttons" });
		root.appendChild(buttons);
		root.appendChild(
			el("div", {
				class: "title-foot",
				text: "BGM・効果音は右上の🔊で切り替え",
			}),
		);
		game.ui.appendChild(root);

		let raf = 0;
		const anim = (t: number) => {
			const ctx = walkers.getContext("2d");
			if (ctx && root.isConnected) {
				ctx.imageSmoothingEnabled = false;
				ctx.clearRect(0, 0, walkers.width, walkers.height);
				cast.forEach((c, i) => {
					drawWalk(
						ctx,
						c.walk,
						"down",
						stepFrame(t + i * 130, true),
						i * 20 + 2,
						2,
					);
				});
				raf = requestAnimationFrame(anim);
			}
		};
		raf = requestAnimationFrame(anim);

		// 完走したきろくがあれば「次スレ」を出す（強くてニューゲーム）
		const cleared = !!readSave()?.state.flags.clear;
		const showDebug =
			!!data.debug &&
			(import.meta.env.DEV ||
				new URLSearchParams(location.search).has("debug"));
		const items = () => [
			{ label: "はじめから", value: "new" },
			{ label: "つづきから", value: "load", disabled: !hasSave() },
			...(cleared ? [{ label: "次スレを　立てる", value: "part2" }] : []),
			{ label: "せってい", value: "settings" },
			...(showDebug ? [{ label: "デバッグルーム", value: "debug" }] : []),
		];
		let cur = hasSave() ? 1 : 0;
		const render = () => {
			buttons.replaceChildren();
			items().forEach((it, i) => {
				const b = el("button", {
					class: `title-btn${i === cur ? " cur" : ""}${it.disabled ? " disabled" : ""}`,
					text: it.label,
				});
				b.addEventListener("pointerdown", (e) => {
					e.preventDefault();
					e.stopPropagation();
					game.input.onAnyInput?.();
					if (!it.disabled) void pick(it.value);
				});
				buttons.appendChild(b);
			});
		};
		render();
		let busy = false;
		const pop = game.input.push((k) => {
			if (busy) return;
			const list = items();
			if (k === "up" || k === "down") {
				do cur = (cur + (k === "up" ? -1 : 1) + list.length) % list.length;
				while (list[cur].disabled);
				game.audio.se("cursor");
				render();
			} else if (k === "a" && !list[cur].disabled) {
				void pick(list[cur].value);
			}
		});
		const pick = async (v: string) => {
			if (busy) return;
			busy = true;
			game.audio.se("decide");
			if (v === "settings") {
				await settingsMenu(game);
				game.msg.close();
				busy = false;
				render();
				return;
			}
			let state: GameState | null = null;
			if (v === "load") state = readSave()?.state ?? null;
			if (v === "part2") {
				const old = readSave()?.state;
				const n = await listWindow(
					game,
					"次スレを　立てますか？　いまの　スレは　しまわれます",
					[
						{
							label: "立てる",
							sub: "レベル・なかよし度・記録は　引きつぐ",
							value: "yes",
						},
						{ label: "やめる", value: "no" },
					],
				);
				if (n !== "yes" || !old) {
					busy = false;
					return;
				}
				state = nextThreadState(data, old);
			}
			if (v === "new" && hasSave()) {
				const n = await listWindow(
					game,
					"きろくが　あります。はじめから　あそびますか？",
					[
						{ label: "はじめから", value: "yes" },
						{ label: "やめる", value: "no" },
					],
				);
				if (n !== "yes") {
					busy = false;
					return;
				}
			}
			if (v === "debug" && data.debug) {
				// flags.debug が立っていると記録しない（engine/save.ts）
				const st = game.newState();
				state = { ...st, ...data.debug, flags: { ...st.flags, debug: true } };
			}
			state ??= game.newState();
			pop();
			cancelAnimationFrame(raf);
			root.classList.add("leaving");
			game.audio.bgm(null);
			setTimeout(() => {
				root.remove();
				resolve(state);
			}, 500);
		};
	});
