// フィールドのメニュー（Bボタン／☰）：つよさ・どうぐ・きろく・せってい。

import { bondOf, hearts } from "../engine/bonds";
import type { Game } from "../engine/game";
import { countPlay, nextSongLv, songsAt, statsOf } from "../engine/party";
import { writeSave } from "../engine/save";
import { saveSettings, settings } from "../engine/settings";
import { el } from "./dom";
import { itemDesc } from "./itemText";
import { partyMenu, partyMenuHint } from "./party";

type Item = {
	label: string;
	sub?: string;
	/** 2行目の小さい説明（HTML）。どうぐの効果など、選ぶ前に見せたいもの。 */
	desc?: string;
	value: string;
	disabled?: boolean;
};

/** 指でなぞって巻き取れるか（はみ出していて、しかも overflow で巻き取る箱か）。 */
const canScroll = (s: HTMLElement): boolean => {
	if (s.scrollHeight <= s.clientHeight + 1) return false;
	const o = getComputedStyle(s).overflowY;
	return o === "auto" || o === "scroll";
};

/**
 * タップで決める。ふつうは押した瞬間に決まるが、はみ出して巻き取れる一覧では、
 * 指でなぞって巻き取れるよう、ほとんど動かさずに離したときに決める。
 */
export const onTap = (
	b: HTMLElement,
	scroller: HTMLElement,
	fn: () => void,
): void => {
	let from: { id: number; y: number } | null = null;
	b.addEventListener("pointerdown", (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (canScroll(scroller)) from = { id: e.pointerId, y: e.clientY };
		else fn();
	});
	b.addEventListener("pointerup", (e) => {
		if (!from || from.id !== e.pointerId) return;
		const moved = Math.abs(e.clientY - from.y);
		from = null;
		if (moved < 10) fn();
	});
	// 巻き取りが始まった（ブラウザに指を取られた）・外へ出たらやめる
	b.addEventListener("pointercancel", () => {
		from = null;
	});
	b.addEventListener("pointerleave", () => {
		from = null;
	});
};

/** 巻き取れる一覧で、カーソルの行が見えるところまで巻き取る（十字キー・キーボード用）。 */
export const keepInView = (scroller: HTMLElement, b: HTMLElement): void => {
	const r = b.getBoundingClientRect();
	const s = scroller.getBoundingClientRect();
	if (r.top < s.top) scroller.scrollTop -= s.top - r.top;
	else if (r.bottom > s.bottom) scroller.scrollTop += r.bottom - s.bottom;
};

/** 縦に並ぶ選択ウィンドウ。B で null。 */
export const listWindow = (
	game: Game,
	title: string,
	items: Item[],
	opt: { cls?: string; start?: number } = {},
): Promise<string | null> =>
	new Promise((resolve) => {
		const box = el("div", { class: `menu window ${opt.cls ?? ""}` });
		if (title) box.appendChild(el("div", { class: "menu-title", text: title }));
		let cur = Math.min(items.length - 1, Math.max(0, opt.start ?? 0));
		// 選べない行から始めない（最初の A が空振りしないように）
		if (items[cur]?.disabled) {
			const firstOk = items.findIndex((i) => !i.disabled);
			if (firstOk >= 0) cur = firstOk;
		}
		const buttons = items.map((it) => {
			const b = el("button", {
				class: "menu-item",
				html: `<span>${it.label}</span>${it.sub ? `<small>${it.sub}</small>` : ""}${it.desc ? `<span class="desc">${it.desc}</span>` : ""}`,
			});
			if (it.disabled) b.classList.add("disabled");
			if (it.desc) b.classList.add("has-desc");
			onTap(b, box, () => {
				if (!it.disabled) done(it.value);
			});
			box.appendChild(b);
			return b;
		});
		const close = el("button", { class: "menu-close", text: "とじる" });
		onTap(close, box, () => done(null));
		box.appendChild(close);
		const render = () =>
			buttons.forEach((b, i) => {
				b.classList.toggle("cur", i === cur);
				// 先頭の行では見出しごと見せる
				if (i === cur) {
					if (i === 0) box.scrollTop = 0;
					else keepInView(box, b);
				}
			});
		game.ui.appendChild(box);
		render();
		const pop = game.input.push(
			(k) => {
				if (k === "up" || k === "down") {
					if (!items.length) return;
					cur = (cur + (k === "up" ? -1 : 1) + items.length) % items.length;
					game.audio.se("cursor");
					render();
				} else if (k === "a" && items[cur] && !items[cur].disabled) {
					done(items[cur].value);
				} else if (k === "b") {
					done(null);
				}
			},
			{ tap: "b" },
		);
		const done = (v: string | null) => {
			pop();
			game.audio.se(v === null ? "cancel" : "decide");
			box.remove();
			resolve(v);
		};
	});

const fmtTime = (ms: number) => {
	const m = Math.floor(ms / 60000);
	return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};

const statusView = (game: Game): Promise<void> =>
	new Promise((resolve) => {
		const { data, state } = game;
		const box = el("div", { class: "menu window status" });
		box.appendChild(el("div", { class: "menu-title", text: "つよさ" }));
		for (const m of state.party) {
			const c = data.cast[m.id];
			const st = statsOf(c, m.lv);
			// 控えは少し淡く（style.css の .status-card.bench）
			const card = el("div", {
				class: `status-card${m.bench ? " bench" : ""}`,
			});
			card.style.setProperty("--char", c.color);
			// 覚えたうたと、次に覚えるレベル（うたの名前は伏せておく）
			const known = songsAt(c, m.lv)
				.map((s) => data.skills[s]?.name)
				.filter(Boolean)
				.join("・");
			const next = nextSongLv(c, m.lv);
			const uta = !st.maxMp
				? "なし（UTAUの声がない）"
				: `${known || "まだ　ない"}${next ? `　（つぎは Lv${next}）` : ""}`;
			card.innerHTML = `<div class="s-name">${c.name}<span>${m.bench ? "控え　" : ""}Lv ${m.lv}</span></div>
<div class="s-row">HP ${m.hp}/${st.maxHp}　${st.maxMp ? `こえ ${m.mp}/${st.maxMp}` : "こえ ―"}</div>
<div class="s-row">こうげき ${st.atk}　まもり ${st.def}　すばやさ ${st.spd}</div>
<div class="s-row small">うた：${uta}</div>${m.id === "kiriko" ? "" : `<div class="s-row small">なかよし度　${hearts(bondOf(state, m.id))}</div>`}`;
			box.appendChild(card);
		}
		box.appendChild(
			el("div", {
				class: "s-row small",
				text: `プレイ時間 ${fmtTime(state.playMs)}`,
			}),
		);
		const close = el("button", { class: "menu-close", text: "とじる" });
		box.appendChild(close);
		game.ui.appendChild(box);
		const done = () => {
			pop();
			game.audio.se("cancel");
			box.remove();
			resolve();
		};
		close.addEventListener("pointerdown", (e) => {
			e.preventDefault();
			e.stopPropagation();
			done();
		});
		const pop = game.input.push(
			(k) => {
				if (k === "a" || k === "b") done();
			},
			{ tap: "b" },
		);
	});

const itemMenu = async (game: Game): Promise<void> => {
	const { data, state } = game;
	for (;;) {
		const owned = Object.entries(state.items).filter(([, n]) => n > 0);
		// 効果は2行目に出しておく（タップだとすぐ決まって、選ぶ前に説明を読めないので）
		const v = await listWindow(
			game,
			"どうぐ",
			owned.map(([id, n]) => {
				const it = data.items[id];
				return {
					label: it?.name ?? id,
					// だいじなものは2行目の札で示すので、数は出さない
					sub: it?.key ? undefined : `×${n}`,
					desc: it ? itemDesc(it) : undefined,
					value: id,
				};
			}),
		);
		if (v === null) return;
		const it = data.items[v];
		if (!it) continue;
		if (!it.effect) {
			await game.say(null, `${it.name}：${it.desc}`);
			game.msg.hideWindow();
			continue;
		}
		const who = it.effect.all
			? "all"
			: await listWindow(
					game,
					`${it.name}を　だれに？`,
					state.party.map((m) => {
						const st = statsOf(data.cast[m.id], m.lv);
						return {
							label: data.cast[m.id].name,
							// 控えも回復できる
							sub: `${m.bench ? "控え　" : ""}HP ${m.hp}/${st.maxHp}${st.maxMp ? `　こえ ${m.mp}/${st.maxMp}` : ""}`,
							value: m.id,
						};
					}),
				);
		if (who === null) continue;
		const targets =
			who === "all" ? state.party : state.party.filter((m) => m.id === who);
		let used = false;
		for (const m of targets) {
			const st = statsOf(data.cast[m.id], m.lv);
			if (it.effect.revive && m.hp <= 0) {
				m.hp = Math.round(st.maxHp / 2);
				used = true;
			}
			if (it.effect.hp && m.hp < st.maxHp) {
				m.hp = Math.min(st.maxHp, m.hp + it.effect.hp);
				used = true;
			}
			if (it.effect.mp && m.mp < st.maxMp) {
				m.mp = Math.min(st.maxMp, m.mp + it.effect.mp);
				used = true;
			}
		}
		if (used) {
			game.story.take(v);
			countPlay(game.state, "play_item");
			game.audio.se("heal");
			await game.say(null, `${it.name}を　つかった！`);
		} else {
			await game.say(null, "いまは　つかっても　いみが　なさそうだ。");
		}
		game.msg.hideWindow();
	}
};

const voiceLabel = (game: Game) => {
	if (!settings.voice) return "OFF";
	const p = game.audio.voiceProgress;
	if (p && p.total > 0 && p.loaded < p.total)
		return `ON（じゅんび中 ${Math.floor((p.loaded / p.total) * 100)}%）`;
	return "ON";
};

export const settingsMenu = async (game: Game): Promise<void> => {
	let start = 0;
	for (;;) {
		const bgmLabel = { hq: "こうおんしつ", light: "けいりょう", off: "OFF" }[
			settings.bgm
		];
		const speed =
			settings.textMs === 0
				? "しゅんかん"
				: settings.textMs <= 15
					? "はやい"
					: settings.textMs <= 30
						? "ふつう"
						: "おそい";
		const v = await listWindow(
			game,
			"せってい",
			[
				{ label: "ボイス", sub: voiceLabel(game), value: "voice" },
				{
					label: "BGM・効果音",
					sub: settings.mute ? "ミュート中" : "ON",
					value: "mute",
				},
				{ label: "BGMの音", sub: bgmLabel, value: "bgm" },
				{
					label: "BGMの大きさ",
					sub: `${settings.bgmVolume}`,
					value: "bgmVolume",
				},
				{
					label: "効果音の大きさ",
					sub: `${settings.seVolume}`,
					value: "seVolume",
				},
				{
					label: "ボイスの大きさ",
					sub: `${settings.voiceVolume}`,
					value: "voiceVolume",
				},
				{ label: "文字の速さ", sub: speed, value: "text" },
				{
					label: "十字キー",
					sub: settings.pad ? "表示" : "かくす（タップ移動）",
					value: "pad",
				},
				{
					label: "仲間の行動",
					sub: settings.autoAllies ? "おまかせ" : "めいれいする",
					value: "allies",
				},
			],
			{ start },
		);
		if (v === null) return;
		start = [
			"voice",
			"mute",
			"bgm",
			"bgmVolume",
			"seVolume",
			"voiceVolume",
			"text",
			"pad",
			"allies",
		].indexOf(v);
		/** 0〜100 を 10 刻みの一覧から選ぶ。 */
		const pickVolume = async (
			label: string,
			cur: number,
		): Promise<number | null> => {
			const levels = Array.from({ length: 11 }, (_, i) => i * 10);
			const v = await listWindow(
				game,
				label,
				levels.map((n) => ({
					label: n === 0 ? "0（消す）" : String(n),
					sub: n === cur ? "いま" : undefined,
					value: String(n),
				})),
				{ start: Math.round(cur / 10) },
			);
			return v === null ? null : Number(v);
		};
		if (v === "voice") {
			if (!settings.voice) {
				await game.say(
					null,
					"ボイスを　ONにすると、はじめに　やく45MBの　データを　よみこみます。\n（2回目からは　すぐに　はじまります）",
				);
				const n = await game.story.choose(["ONにする", "やめておく"], {
					cancel: 1,
				});
				game.msg.hideWindow();
				if (n === 0) saveSettings({ voice: true });
			} else {
				saveSettings({ voice: false });
			}
		} else if (v === "mute") saveSettings({ mute: !settings.mute });
		else if (v === "bgm")
			saveSettings({
				bgm:
					settings.bgm === "hq"
						? "light"
						: settings.bgm === "light"
							? "off"
							: "hq",
			});
		else if (v === "bgmVolume") {
			const n = await pickVolume("BGMの大きさ", settings.bgmVolume);
			if (n !== null) saveSettings({ bgmVolume: n });
		} else if (v === "seVolume") {
			const n = await pickVolume("効果音の大きさ", settings.seVolume);
			if (n !== null) saveSettings({ seVolume: n });
		} else if (v === "voiceVolume") {
			const n = await pickVolume("ボイスの大きさ", settings.voiceVolume);
			if (n !== null) saveSettings({ voiceVolume: n });
		} else if (v === "text")
			saveSettings({
				textMs:
					settings.textMs === 0
						? 45
						: settings.textMs > 30
							? 18
							: settings.textMs > 15
								? 12
								: 0,
			});
		else if (v === "pad") saveSettings({ pad: !settings.pad });
		else if (v === "allies") saveSettings({ autoAllies: !settings.autoAllies });
	}
};

export const fieldMenu = async (game: Game): Promise<void> => {
	for (;;) {
		const v = await listWindow(
			game,
			"",
			[
				{ label: "つよさ", value: "status" },
				...(game.state.party.length > 1
					? [{ label: "なかま", sub: partyMenuHint(game), value: "party" }]
					: []),
				{ label: "どうぐ", value: "item" },
				{ label: "きろく", sub: "セーブ", value: "save" },
				{ label: "せってい", value: "settings" },
			],
			{ cls: "main-menu" },
		);
		if (v === null) return;
		if (v === "status") await statusView(game);
		else if (v === "party") await partyMenu(game);
		else if (v === "item") await itemMenu(game);
		else if (v === "settings") await settingsMenu(game);
		else if (v === "save") {
			const ok = writeSave(game.state);
			game.audio.se(ok ? "save" : "cancel");
			await game.say(
				null,
				ok
					? "きろくを　のこしました。"
					: "きろくできませんでした……（ブラウザの保存領域が使えないようです）",
			);
			game.msg.hideWindow();
		}
	}
};
