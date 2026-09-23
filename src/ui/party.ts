// メニューの「なかま」：ひとやすみ会話・いれかえ（控え）・なかまと話す・プロフィール（仲間との親睦）。

import { silent } from "../data/story";
import {
	addBond,
	availableSkits,
	bondOf,
	hearts,
	seenSkits,
} from "../engine/bonds";
import type { DateDef } from "../engine/defs";
import type { Game } from "../engine/game";
import {
	activeOf,
	benchOf,
	fromBench,
	MAX_ACTIVE,
	statsOf,
	swapBench,
	toBench,
} from "../engine/party";
import { el } from "./dom";
import { listWindow } from "./menu";

/** 控えなら名前のあとに（控え）。 */
const benchMark = (game: Game, who: string): string =>
	game.state.party.find((m) => m.id === who)?.bench ? "（控え）" : "";

/**
 * いれかえ：たたかう仲間（キリコを入れて3人まで）と控えを選ぶ。
 * たたかう人を選ぶと控えへ、控えを選ぶと たたかう側へ（いっぱいなら、だれと かわるか聞く）。
 */
const swapMenu = async (game: Game): Promise<void> => {
	const { data, state } = game;
	state.flags.seen_swap = true;
	let start = 0;
	for (;;) {
		const party = state.party;
		const n = activeOf(party).length;
		const rows = party.map((m, i) => {
			const st = statsOf(data.cast[m.id], m.lv);
			return {
				label: `${data.cast[m.id]?.name ?? m.id}　Lv${m.lv}`,
				sub: i === 0 ? "リーダー" : m.bench ? "控え" : "たたかう",
				desc: `HP ${m.hp}/${st.maxHp}${st.maxMp ? `　こえ ${m.mp}/${st.maxMp}` : ""}`,
				value: m.id,
				disabled: i === 0,
			};
		});
		const v = await listWindow(
			game,
			`いれかえ　たたかう ${n}/${MAX_ACTIVE}`,
			rows,
			{ start },
		);
		if (v === null) return;
		start = party.findIndex((m) => m.id === v);
		const m = party[start];
		if (!m) continue;
		if (!m.bench) {
			toBench(party, v);
		} else if (n < MAX_ACTIVE) {
			fromBench(party, v);
		} else {
			// いっぱいなので、たたかう仲間のだれと かわるか
			const outs = activeOf(party).slice(1);
			const out = await listWindow(
				game,
				`${data.cast[v]?.name ?? v}が　だれと　かわる？`,
				outs.map((o) => ({
					label: `${data.cast[o.id]?.name ?? o.id}　Lv${o.lv}`,
					sub: "たたかう",
					value: o.id,
				})),
			);
			if (out === null || !swapBench(party, out, v)) continue;
		}
		// 並びが変わる（たたかう仲間が前、控えが後ろ）ので、選んだ人の新しい位置にカーソルを置く
		start = party.findIndex((x) => x.id === v);
		game.refreshFollowers();
	}
};

/** プロフィール（なかよし度で読めるページが増える）。 */
const profileView = (game: Game, who: string): Promise<void> =>
	new Promise((resolve) => {
		const { data, state } = game;
		const c = data.cast[who];
		const prof = data.bonds?.profiles.find((p) => p.who === who);
		const bond = bondOf(state, who);
		const box = el("div", { class: "menu window profile" });
		box.style.setProperty("--char", c?.color ?? "#fff");
		box.appendChild(
			el("div", {
				class: "menu-title",
				text: `${c?.name ?? who}${benchMark(game, who)}　${hearts(bond)}`,
			}),
		);
		for (const page of prof?.pages ?? []) {
			const open = bond >= page.bond;
			const sec = el("div", { class: `profile-page${open ? "" : " locked"}` });
			sec.appendChild(
				el("div", {
					class: "profile-head",
					text: open ? page.title : `？？？（♥${page.bond}で　ひらく）`,
				}),
			);
			if (open)
				for (const line of page.lines) sec.appendChild(el("p", { text: line }));
			box.appendChild(sec);
		}
		if (!prof?.pages.length)
			box.appendChild(
				el("p", { class: "s-row small", text: "（まだ　なにも　わからない）" }),
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
		const pop = game.input.push((k) => {
			if (k === "a" || k === "b") done();
		});
	});

/** 仲間ひとりと話す。章ごとに最初の1回だけ なかよし度が上がる。 */
const talkWith = async (game: Game, who: string): Promise<void> => {
	const { data, state } = game;
	const chat = data.bonds?.chats.find(
		(c) => c.who === who && (!c.when || c.when(state)),
	);
	game.msg.close();
	if (!chat) {
		// 話すことが無いときは、なかよし度も上げない
		await game.say(who, "……。");
		game.msg.close();
		return;
	}
	await chat.run(game.story);
	const key = `chat_${who}_${Number(state.flags.ch ?? 0)}`;
	if (!state.flags[key]) {
		state.flags[key] = true;
		if (addBond(state, who)) {
			game.audio.se("item");
			await game.say(
				null,
				`${data.cast[who]?.name ?? who}との　なかよし度が　あがった！`,
			);
		}
	}
	game.msg.close();
};

export const partyMenu = async (game: Game): Promise<void> => {
	const { data, state } = game;
	let start = 0;
	for (;;) {
		const fresh = availableSkits(data.bonds, state);
		const seen = seenSkits(data.bonds, state);
		const members = state.party.filter((m) => m.id !== "kiriko");
		const items = [
			{
				label: "みんなで　はなす",
				sub: fresh.length
					? `あたらしい会話 ${fresh.length}`
					: seen.length
						? "もういちど見る"
						: "まだ　ない",
				value: "__skit",
				disabled: !fresh.length && !seen.length,
			},
			// 控えがいる・仲間が4人以上のときだけ出す
			...(state.party.length > MAX_ACTIVE || benchOf(state.party).length
				? [
						{
							label: "いれかえ",
							sub: `たたかう ${activeOf(state.party).length}/${MAX_ACTIVE}`,
							value: "__swap",
						},
					]
				: []),
			...members.map((m) => ({
				label: data.cast[m.id]?.name ?? m.id,
				sub: `${m.bench ? "控え　" : ""}${hearts(bondOf(state, m.id))}`,
				value: m.id,
			})),
		];
		const v = await listWindow(game, "なかま", items, { start });
		if (v === null) return;
		start = items.findIndex((i) => i.value === v);
		if (v === "__swap") {
			await swapMenu(game);
			continue;
		}
		if (v === "__skit") {
			if (fresh.length) {
				await game.playSkit(fresh[0]);
			} else {
				const pick = await listWindow(
					game,
					"もういちど　見る",
					seen.map((k) => ({ label: k.title, value: k.id })),
				);
				const skit = seen.find((k) => k.id === pick);
				if (skit) await game.playSkit(skit);
			}
			continue;
		}
		const name = data.cast[v]?.name ?? v;
		const date = data.bonds?.dates?.find((d) => d.who === v);
		const dateItem = date ? dateMenuItem(game, date) : null;
		const w = await listWindow(
			game,
			`${name}${benchMark(game, v)}　${hearts(bondOf(state, v))}`,
			[
				{ label: "はなす", value: "talk" },
				...(dateItem ? [dateItem] : []),
				{ label: "プロフィール", value: "profile" },
			],
		);
		if (w === "talk") await talkWith(game, v);
		else if (w === "profile") await profileView(game, v);
		else if (w === "date" && date) {
			await goOnDate(game, date);
			return; // 行って帰ってきたらメニューを閉じる
		}
	}
};

/** 「おでかけ」の項目（まだ行けないときは理由を添えて選べなくする）。 */
const dateMenuItem = (game: Game, date: DateDef) => {
	const { state } = game;
	const need = date.minBond ?? 3;
	if (state.flags[`date_${date.who}`])
		return {
			label: "おでかけ",
			sub: "おもいで",
			value: "date",
			disabled: true,
		};
	if (bondOf(state, date.who) < need)
		return {
			label: "おでかけ",
			sub: `♥${need}で　ひらく`,
			value: "date",
			disabled: true,
		};
	if (silent(state) || (date.when && !date.when(state)))
		return {
			label: "おでかけ",
			sub: "いまは　むり",
			value: "date",
			disabled: true,
		};
	return { label: "おでかけ", sub: date.title, value: "date" };
};

/** おでかけに行く（1人1回。なかよし度が上がる）。 */
const goOnDate = async (game: Game, date: DateDef): Promise<void> => {
	const { data, state } = game;
	const name = data.cast[date.who]?.name ?? date.who;
	await game.say(
		null,
		`${name}と　おでかけする？
（${date.title}）`,
	);
	const n = await game.story.choose(["いっしょに　いく", "また　こんど"], {
		cancel: 1,
	});
	if (n !== 0) {
		game.msg.close();
		return;
	}
	game.msg.close();
	await date.run(game.story);
	state.flags[`date_${date.who}`] = true;
	if (addBond(state, date.who, 2)) {
		game.audio.se("item");
		await game.say(null, `${name}との　なかよし度が　ぐっと　あがった！`);
	}
	game.msg.close();
};

/**
 * メニューに出す「なかま」の補足（あたらしい会話・まだ いれかえを開いていない控え）。
 * メニューは幅 200px なので、補足は全角5字まで（長いと「なかま」が縦に折れる）。
 */
export const partyMenuHint = (game: Game): string | undefined => {
	const { data, state } = game;
	if (availableSkits(data.bonds, state).length) return "会話あり！";
	if (benchOf(state.party).length && !state.flags.seen_swap) return "いれかえ";
	return undefined;
};
