// 章タイトルとエンディング（スタッフロール → まとめカード → おわり）。

import type { EndingSummary } from "../engine/defs";
import { type Game, ResetToTitle } from "../engine/game";
import { writeSave } from "../engine/save";
import { sleep } from "../engine/types";
import { viewport } from "../engine/viewport";
import { el, nextFrame } from "./dom";

/** スタッフロールの早送り：最後に押してから この ms たつと、ふつうの速さへ戻りはじめる。 */
const ROLL_IDLE_MS = 400;

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

/**
 * 画面いっぱいの札を、待ち時間のあと A/B かタップで閉じるまで待つ。
 * 札の中はスクロールできる（指を動かしたときはタップとみなさない）。上下キーでもスクロールする。
 */
const waitClose = (
	game: Game,
	box: HTMLElement,
	delay: number,
	scroller?: HTMLElement,
): Promise<void> =>
	new Promise<void>((resolve) => {
		let ready = false;
		let done = false;
		const timer = setTimeout(() => {
			ready = true;
		}, delay);
		let start: { x: number; y: number } | null = null;
		const finish = () => {
			if (!ready || done) return;
			done = true;
			clearTimeout(timer);
			pop();
			box.removeEventListener("pointerdown", down);
			box.removeEventListener("pointerup", up);
			resolve();
		};
		const down = (e: PointerEvent) => {
			game.input.onAnyInput?.();
			start = { x: e.clientX, y: e.clientY };
		};
		const up = (e: PointerEvent) => {
			if (!start) return;
			const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
			start = null;
			if (moved < 10) finish();
		};
		box.addEventListener("pointerdown", down);
		box.addEventListener("pointerup", up);
		// 押しっぱなし（スタッフロールの早送り）の自動くり返しでは閉じない。スクロールは続ける
		const pop = game.input.push((k, repeat) => {
			if (k === "a" || k === "b") {
				if (!repeat) finish();
			} else if (scroller && (k === "up" || k === "down"))
				scroller.scrollBy({ top: k === "up" ? -48 : 48 });
		});
	});

/** スタッフロールのあとの「このスレの　まとめ」カード。 */
const matomeCard = async (
	game: Game,
	summary: EndingSummary,
): Promise<void> => {
	const card = el("div", { class: "matome-card" }, [
		el("div", { class: "matome-head", text: "このスレの　まとめ" }),
	]);
	for (const sec of summary.sections) {
		const block = el("div", { class: "matome-sec" }, [
			el("div", { class: "matome-title", text: sec.title }),
		]);
		for (const line of sec.lines)
			block.appendChild(el("p", { class: "matome-line", text: line }));
		card.appendChild(block);
	}
	const box = el("div", { class: "matome" }, [
		card,
		el("div", { class: "the-end-tap", text: "タップで　つぎへ" }),
	]);
	game.ui.appendChild(box);
	await nextFrame();
	box.classList.add("shown");
	await waitClose(game, box, 1500, box);
	box.classList.remove("shown");
	await sleep(600);
	box.remove();
};

export const endingRoll = async (
	game: Game,
	opt?: { summary?: EndingSummary },
): Promise<void> => {
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
	const height = inner.scrollHeight + viewport.h;
	const ms = Math.max(30000, height * 28);
	inner.animate(
		[
			{ transform: `translateY(${viewport.h}px)` },
			{ transform: `translateY(${-inner.scrollHeight}px)` },
		],
		{ duration: ms, easing: "linear", fill: "forwards" },
	);
	// タップし続ける（キーの押しっぱなし・指の押しっぱなし）と早送り。
	// 手を離して しばらくすると ふつうの速さに戻る
	let speed = 1;
	let lastPress = 0;
	let holding = false;
	const pop = game.input.push((k) => {
		if (k === "a") speed = Math.min(8, speed * 2);
		if (k === "b") speed = 8;
		lastPress = performance.now();
	});
	// ロールが画面を覆うので、フィールドの代わりにロール自身でタップを受ける
	roll.addEventListener("pointerdown", () => {
		holding = true;
		game.input.press("a");
	});
	const release = () => {
		holding = false;
		lastPress = performance.now();
	};
	roll.addEventListener("pointerup", release);
	roll.addEventListener("pointercancel", release);
	roll.addEventListener("pointerleave", release);
	for (const a of inner.getAnimations()) {
		const tick = () => {
			if (holding) speed = Math.min(8, speed * 1.05);
			else if (performance.now() - lastPress > ROLL_IDLE_MS)
				speed = Math.max(1, speed * 0.92);
			a.playbackRate = speed;
			if (a.playState === "running") requestAnimationFrame(tick);
		};
		tick();
		await a.finished;
	}
	// ロール → まとめ → おわり の切りかえ（札のない間）も入力を握り、HUD の十字キーを出さない
	const guard = game.input.push(() => {});
	pop();
	roll.remove();
	if (opt?.summary?.sections.length) await matomeCard(game, opt.summary);
	const end = el("div", { class: "the-end" }, [
		el("div", { class: "the-end-title", text: "おわり" }),
		el("div", { class: "the-end-sub", text: "あそんでくれて　ありがとう！" }),
		el("div", { class: "the-end-tap", text: "タップで　タイトルへ" }),
	]);
	game.ui.appendChild(end);
	await nextFrame();
	end.classList.add("shown");
	// クリア後も遊べるよう、ここで記録する（thread の ending で ending_seen が立っている）。
	// ロールの途中で閉じたときは記録されず、次の「つづきから」でエンディングがもう一度流れる
	writeSave(game.state);
	await waitClose(game, end, 1500);
	guard();
	end.remove();
	game.audio.bgm(null);
	throw new ResetToTitle();
};
