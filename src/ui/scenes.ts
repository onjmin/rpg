// 章タイトルとエンディング（スタッフロール）。

import { type Game, ResetToTitle } from "../engine/game";
import { sleep } from "../engine/types";
import { el, nextFrame } from "./dom";

export const chapterCard = async (
	game: Game,
	label: string,
	title: string,
): Promise<void> => {
	game.msg.close();
	const card = el("div", { class: "chapter" }, [
		el("div", { class: "chapter-label", text: label }),
		el("div", { class: "chapter-title", text: title }),
	]);
	game.ui.appendChild(card);
	await nextFrame();
	card.classList.add("shown");
	game.audio.se("chapter");
	let skip = false;
	const pop = game.input.push((k) => {
		if (k === "a") skip = true;
	});
	const t0 = performance.now();
	while (performance.now() - t0 < 2600 && !skip) await sleep(50);
	pop();
	card.classList.remove("shown");
	await sleep(500);
	card.remove();
};

export const endingRoll = async (game: Game): Promise<void> => {
	const { data } = game;
	game.msg.close();
	await game.fadeOut(1200);
	game.audio.singBgm(data.endingBgm);
	const roll = el("div", { class: "credits" });
	const inner = el("div", { class: "credits-inner" });
	for (const line of data.credits) {
		if (line.startsWith("# "))
			inner.appendChild(el("h2", { text: line.slice(2) }));
		else if (line === "") inner.appendChild(el("div", { class: "gap" }));
		else inner.appendChild(el("p", { text: line }));
	}
	roll.appendChild(inner);
	game.ui.appendChild(roll);
	await nextFrame();
	const height = inner.scrollHeight + window.innerHeight;
	const ms = Math.max(30000, height * 28);
	inner.animate(
		[
			{ transform: `translateY(${window.innerHeight}px)` },
			{ transform: `translateY(${-inner.scrollHeight}px)` },
		],
		{ duration: ms, easing: "linear", fill: "forwards" },
	);
	// タップし続けると早送り
	let speed = 1;
	const pop = game.input.push((k) => {
		if (k === "a") speed = Math.min(8, speed * 2);
		if (k === "b") speed = 8;
	});
	for (const a of inner.getAnimations()) {
		const tick = () => {
			a.playbackRate = speed;
			if (a.playState === "running") requestAnimationFrame(tick);
		};
		tick();
		await a.finished;
	}
	pop();
	roll.remove();
	const end = el("div", { class: "the-end" }, [
		el("div", { class: "the-end-title", text: "おわり" }),
		el("div", { class: "the-end-sub", text: "あそんでくれて　ありがとう！" }),
		el("div", { class: "the-end-tap", text: "タップで　タイトルへ" }),
	]);
	game.ui.appendChild(end);
	await nextFrame();
	end.classList.add("shown");
	await sleep(1500);
	await new Promise<void>((resolve) => {
		const p = game.input.push((k) => {
			if (k === "a" || k === "b") {
				p();
				resolve();
			}
		});
	});
	end.remove();
	game.audio.bgm(null);
	throw new ResetToTitle();
};
