// 戦闘（ドラクエ風の正面視点・コマンド式）。
//
// たたかうのは控えでない仲間（3人まで）。経験値も その仲間だけに入る。
// 操作するのは先頭のキリコだけで、仲間は「おまかせ」（設定で全員操作にもできる）。
// 「うたう」は覚えたうただけ（レベルで覚える。engine/party.ts の songsAt）。
// 「オート」を押すと全員おまかせで進む。負けたら「もういちど」ですぐ再戦できる。
// エンカウントの音が鳴り終わるまではフィールドを崩す演出でつなぎ、それから戦闘の画面と曲を出す。
// 文の早送りとコマンドを出すのは、鳴らしたばかりの効果音の区切りまで待つ（engine/audio.ts）。
// 裏ボス（EnemyDef.summon）は、ストックのボスを1体ずつ呼び、尽きるまで攻撃をかわす（召喚のブロック）。
// 負けても、たおした手下の分の経験値は入る（決着のブロック）。

import { cropOf, getImage, loadImage } from "../engine/assets";
import type {
	BattleResult,
	EnemyDef,
	FxSpec,
	MemberState,
	SkillDef,
	SummonDef,
} from "../engine/defs";
import { type Game, ResetToTitle } from "../engine/game";
import {
	activeOf,
	gainExp,
	healAll,
	learnTexts,
	songsAt,
	statsOf,
} from "../engine/party";
import { settings } from "../engine/settings";
import { isWalkRef } from "../engine/sprite";
import { sleep, TILE } from "../engine/types";
import { viewport } from "../engine/viewport";
import { el, nextFrame } from "./dom";
import { itemDesc } from "./itemText";
import { keepInView, onTap } from "./menu";

type Side = "party" | "enemy";

type Fighter = {
	side: Side;
	name: string;
	hp: number;
	maxHp: number;
	mp: number;
	maxMp: number;
	atk: number;
	def: number;
	spd: number;
	/** 味方のみ */
	member?: MemberState;
	skills: SkillDef[];
	/** 敵のみ */
	enemy?: EnemyDef;
	guard: boolean;
	/** 攻撃力アップの残りターン */
	buff: number;
	view: HTMLElement;
	bar?: HTMLElement;
	/** 召喚する敵のみ：まだ出していない手下（EnemyDef.summon.stock の写し。data は書きかえない） */
	stock?: SummonDef[];
	/** 呼ばれた手下のみ：呼んだ敵 */
	master?: Fighter;
};

type Action =
	| { kind: "attack"; target: Fighter }
	| { kind: "skill"; skill: SkillDef; target: Fighter | null }
	| { kind: "item"; item: string; target: Fighter }
	| { kind: "guard" }
	| { kind: "flee" }
	| { kind: "idle"; text: string };

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const alive = (fs: Fighter[]) => fs.filter((f) => f.hp > 0);

/** 敵の見た目（歩行グラなら正面のコマ）を canvas に描く。 */
const enemyCanvas = (ref: string, scale: number): HTMLCanvasElement => {
	const c = el("canvas", { class: "enemy-sprite" });
	let frame = 0;
	const draw = () => {
		const img = getImage(ref);
		const ctx = c.getContext("2d");
		if (!img || !ctx) return false;
		const walk = isWalkRef(ref);
		const crop = cropOf(ref);
		const cw = walk ? img.width / 2 : crop ? crop.sw : img.width;
		const ch = walk ? img.height / 4 : crop ? crop.sh : img.height;
		if (c.width !== cw) {
			c.width = cw;
			c.height = ch;
			c.style.width = `${cw * scale}px`;
			c.style.height = `${ch * scale}px`;
		}
		ctx.clearRect(0, 0, cw, ch);
		ctx.drawImage(
			img,
			walk ? frame * cw : (crop?.sx ?? 0),
			walk ? ch * 2 : (crop?.sy ?? 0),
			cw,
			ch,
			0,
			0,
			cw,
			ch,
		);
		return true;
	};
	c.width = 16;
	c.height = 16;
	c.style.width = `${16 * scale}px`;
	c.style.height = `${16 * scale}px`;
	void loadImage(ref).then(draw);
	const timer = window.setInterval(() => {
		if (!c.isConnected) {
			window.clearInterval(timer);
			return;
		}
		frame = 1 - frame;
		draw();
	}, 450);
	return c;
};

/** エンカウント演出の長さの上限（効果音を長い音に差し替えても待たせすぎない）。 */
const ENCOUNTER_MAX_MS = 2500;
/** エンカウントの音を測っていないときの長さ。 */
const ENCOUNTER_DEFAULT_MS = 1500;
/** 白く2回光る長さ（style.css の .encounter::after と同じ）。 */
const FLASH_MS = 400;

/**
 * エンカウント演出。エンカウントの効果音が鳴り終わるまで（測った長さ。data/loudness.ts）、
 * その瞬間のフィールドを止めて白く2回光らせ、モザイクで崩しながら暗転する。
 * 光るのは音の頭（素材の先頭の無音の後）に合わせる。長さは音ではなく測った値で決めるので、
 * ミュート中も同じテンポ。動きを減らす設定（prefers-reduced-motion）では、ただ暗転する。
 * 終わったら真っ暗なまま残す（戻り値を呼ぶと片付く）。
 */
const encounterFx = async (game: Game): Promise<() => void> => {
	const span = game.audio.seSpan("encounter");
	const end = Math.min(ENCOUNTER_MAX_MS, span?.endMs ?? ENCOUNTER_DEFAULT_MS);
	const start = Math.min(span?.startMs ?? 0, end / 2);
	const box = el("div", { class: "encounter" });
	box.style.setProperty("--at", `${start}ms`);
	game.ui.appendChild(box);
	const t0 = performance.now();
	let raf = 0;
	const src = game.screen.canvas;
	const w = src.width;
	const h = src.height;
	if (
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
		!w ||
		!h
	) {
		box.classList.add("calm");
		box.style.setProperty("--fade", `${end - start}ms`);
		await nextFrame();
		box.classList.add("dark");
	} else {
		// フィールドはその瞬間の1枚にする（人や水が動き続けないように）
		const still = document.createElement("canvas");
		still.width = w;
		still.height = h;
		still.getContext("2d")?.drawImage(src, 0, 0);
		const view = el("canvas", { class: "encounter-view" });
		view.width = w;
		view.height = h;
		box.appendChild(view);
		const small = document.createElement("canvas");
		const vctx = view.getContext("2d");
		const sctx = small.getContext("2d");
		// 2回目に光るのと同時に崩し始め、音が消える少し前に真っ暗にする
		const from = start + FLASH_MS / 2;
		const draw = (now: number) => {
			if (!vctx || !sctx) return;
			const p = Math.min(1, Math.max(0, (now - t0 - from) / (end - from)));
			// モザイクの1粒は 1 ドット → 1 マス（だんだん速く）
			const block = Math.max(
				1,
				Math.round((1 + (TILE - 1) * p * p) * game.screen.scale),
			);
			const sw = Math.ceil(w / block);
			const sh = Math.ceil(h / block);
			if (small.width !== sw || small.height !== sh) {
				small.width = sw;
				small.height = sh;
			}
			sctx.imageSmoothingEnabled = true;
			sctx.drawImage(still, 0, 0, sw, sh);
			vctx.imageSmoothingEnabled = false;
			vctx.drawImage(small, 0, 0, sw, sh, 0, 0, sw * block, sh * block);
			vctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, p / 0.9)})`;
			vctx.fillRect(0, 0, w, h);
			if (p < 1) raf = requestAnimationFrame(draw);
		};
		draw(t0);
	}
	await sleep(Math.max(0, end - (performance.now() - t0)));
	cancelAnimationFrame(raf);
	box.classList.add("dark"); // コマ落ちしていても最後は真っ暗
	return () => box.remove();
};

export const runBattle = async (
	game: Game,
	groupId: string,
	opt: { canLose?: boolean },
): Promise<BattleResult> => {
	const { data, audio, state } = game;
	const group = data.groups[groupId];
	if (!group) {
		console.warn(`[battle] グループ ${groupId} がありません`);
		return "win";
	}
	const prevBgm = audio.currentBgm;
	const snapshot = state.party.map((m) => ({ ...m }));

	for (;;) {
		const result = await fight(game, groupId);
		if (result !== "lose" || opt.canLose) {
			audio.bgm(prevBgm);
			if (result === "lose") healAll(data, state.party);
			return result;
		}
		// 全滅：もういちど／タイトルへ
		audio.bgm(null);
		audio.se("wipeout");
		await game.say(null, "キリコたちは　ちからつきた……");
		const n = await game.story.choose([
			"もういちど　たたかう",
			"タイトルへ　もどる",
		]);
		game.msg.close();
		if (n === 1) {
			audio.bgm(null);
			throw new ResetToTitle();
		}
		// 戦闘前の状態から全回復して再戦
		state.party = snapshot.map((m) => ({ ...m }));
		healAll(data, state.party);
	}
};

/** とくぎの演出が消えるまで（いちばん長い型＋ずらしの合計）。 */
const FX_MS = 900;

/**
 * とくぎの飾りを組み立てる（形は style.css の .fx-*）。
 * h は出す場所の高さ（降らせる距離を決めるのに使う）。
 */
const fxNode = (spec: FxSpec, h: number): HTMLElement => {
	const box = el("div", { class: `fx fx-${spec.kind}` });
	box.style.setProperty("--fx", spec.color ?? "#fff");
	const bits = (n: number, tag: "i" | "b" = "i") =>
		Array.from({ length: n }, () => el(tag));
	if (spec.kind === "slash") box.append(...bits(3));
	else if (spec.kind === "burst") box.append(...bits(2), ...bits(1, "b"));
	else if (spec.kind === "spin") box.append(...bits(2));
	else if (spec.kind === "ring") {
		// 札のかたちの輪が ひろがり、＋ が 3つ 立ちのぼる
		box.append(...bits(2));
		for (let i = 0; i < 3; i++) {
			const e = el("b", { text: "＋" });
			e.style.left = `${16 + i * 28}%`;
			e.style.animationDelay = `${i * 0.09}s`;
			box.append(e);
		}
	} else if (spec.kind === "aura") {
		// 札の下から 立ちのぼる筋。ずらして出すと 一本ずつ上がって見える
		for (let i = 0; i < 6; i++) {
			const e = el("i");
			e.style.left = `${6 + i * 16}%`;
			e.style.animationDelay = `${i * 0.05}s`;
			box.append(e);
		}
	} else if (spec.kind === "rain") {
		box.style.setProperty("--fall", `${Math.round(h) + 40}px`);
		for (let i = 0; i < 18; i++) {
			const e = el("i", { text: spec.mark ?? "●" });
			e.style.left = `${Math.round(Math.random() * 92)}%`;
			e.style.animationDelay = `${(Math.random() * 0.35).toFixed(2)}s`;
			box.append(e);
		}
	}
	return box;
};

const fight = async (game: Game, groupId: string): Promise<BattleResult> => {
	const { data, audio, input, state } = game;
	const group = data.groups[groupId];
	const isBoss = !!group.boss;
	// ── エンカウント ──
	// フィールドの曲を止めて効果音を鳴らし、鳴り終わるまで演出でつなぐ（入力は捨てる）。
	// 戦闘の画面と曲は音が終わってから（エンカウントの音と戦闘の曲・最初の文が重ならないように）
	audio.bgm(null);
	audio.se("encounter");
	const popSkip = input.push(() => {});
	const clearFx = await encounterFx(game);
	audio.bgm(group.bgm ?? (isBoss ? data.bossBgm : data.battleBgm));

	// ── 画面 ──
	const root = el("div", { class: "battle" });
	const enemyRow = el("div", { class: "enemy-row" });
	const partyRow = el("div", { class: "party-row" });
	const logEl = el("div", { class: "battle-log window" });
	const cmdEl = el("div", { class: "battle-cmd" });
	// 上から 敵 → 文 → なかまの HP → コマンド。
	// 文は敵のすぐ下（目が行き来しない）、HP はコマンドのすぐ上（選ぶときに見る）
	root.append(
		el("div", { class: "battle-bg" }),
		enemyRow,
		logEl,
		partyRow,
		cmdEl,
	);
	game.ui.appendChild(root);
	await sleep(20);
	root.classList.add("shown");
	// 戦闘の画面が出きったら（.battle の opacity 0.25s）演出の暗転を片付ける
	void sleep(300).then(clearFx);

	// ── 戦う人 ──
	// 画面の短辺に合わせて拡大（スマホ縦で 4 倍前後、ボスは 1.5 倍）
	const base = Math.max(
		3,
		Math.min(9, Math.round(Math.min(viewport.w, viewport.h) / 95)),
	);
	/**
	 * 次スレ（Part2 以降）の敵の強さ。前の周のレベルのまま始まるので、
	 * そのぶん 敵も強くする（2周目 1.6倍、3周目 2.2倍…）。
	 */
	const hard = state.flags.p2
		? 1 + 0.6 * Math.max(1, Number(state.flags.p2_n ?? 2) - 1)
		: 1;
	/** 敵を1体つくって列の後ろに並べる（はじめの顔ぶれと、召喚で使う）。 */
	const spawn = (id: string, name: string): Fighter => {
		const e = data.enemies[id];
		const hp = Math.round(e.hp * hard);
		const scale = Math.round(base * (e.scale ?? (isBoss ? 1.5 : 1)));
		const sprite = enemyCanvas(e.sprite, scale);
		const bar = el("div", { class: "hpbar" }, [el("i")]);
		const view = el("div", { class: "enemy" }, [sprite, bar]);
		enemyRow.appendChild(view);
		// 呼ぶ予定のボスの絵は先に読んでおく（出た瞬間に空の枠にならないように）
		for (const s of e.summon?.stock ?? []) {
			const d = data.enemies[s.enemy];
			if (d) void loadImage(d.sprite);
		}
		return {
			side: "enemy",
			name,
			hp,
			maxHp: hp,
			mp: 0,
			maxMp: 0,
			atk: Math.round(e.atk * hard),
			def: Math.round(e.def * hard),
			spd: e.spd,
			enemy: e,
			skills: [],
			guard: false,
			buff: 0,
			view,
			bar,
			// 写しなので「もういちど」や再戦のたびに最初から
			stock: e.summon ? [...e.summon.stock] : undefined,
		};
	};
	const enemies: Fighter[] = group.enemies.map((id, i) => {
		const e = data.enemies[id];
		const same = group.enemies.filter((x) => x === id).length > 1;
		return spawn(
			id,
			same
				? `${e.name}${"ABCDEFG"[group.enemies.slice(0, i + 1).filter((x) => x === id).length - 1]}`
				: e.name,
		);
	});
	/** 呼んだ手下が場にいるか（裏ボス）。 */
	const hasMinion = (m: Fighter): boolean =>
		enemies.some((f) => f.master === m && f.hp > 0);
	/** 守り：ストックが残っているか、手下がいる間は、攻撃を必ずかわす（裏ボス）。 */
	const shielded = (f: Fighter): boolean =>
		!!f.stock && (f.stock.length > 0 || hasMinion(f));
	/** このターンに呼ばれた手下（守りのある敵への ねらいを こっちへ移す）。 */
	const fresh: Fighter[] = [];
	// 控えは戦闘に出ない（経験値も入らない）
	const party: Fighter[] = activeOf(state.party).map((m) => {
		const c = data.cast[m.id];
		const st = statsOf(c, m.lv);
		const view = el("div", { class: "member" });
		view.style.setProperty("--char", c.color);
		partyRow.appendChild(view);
		return {
			side: "party",
			name: c.name,
			hp: m.hp,
			maxHp: st.maxHp,
			mp: m.mp,
			maxMp: st.maxMp,
			atk: st.atk,
			def: st.def,
			spd: st.spd,
			member: m,
			// 覚えたうただけ（おまかせも「うたう」の一覧も）
			skills: songsAt(c, m.lv)
				.map((s) => data.skills[s])
				.filter(Boolean),
			guard: false,
			buff: 0,
			view,
		};
	});

	const renderParty = () => {
		for (const f of party) {
			const hpPct = Math.max(0, (f.hp / f.maxHp) * 100);
			f.view.classList.toggle("down", f.hp <= 0);
			f.view.classList.toggle("pinch", f.hp > 0 && hpPct < 30);
			f.view.innerHTML = `<div class="m-name">${f.name}<span>Lv${f.member?.lv}</span></div>
<div class="m-bar hp"><i style="width:${hpPct}%"></i></div><div class="m-num">HP ${Math.max(0, f.hp)}/${f.maxHp}</div>
${f.maxMp ? `<div class="m-bar mp"><i style="width:${(f.mp / f.maxMp) * 100}%"></i></div><div class="m-num">こえ ${f.mp}/${f.maxMp}</div>` : `<div class="m-num novoice">こえ ―</div>`}`;
			if (f.member) {
				f.member.hp = Math.max(0, f.hp);
				f.member.mp = f.mp;
			}
		}
	};
	/** dying はまだ消さない敵（撃破音と同時にフェードアウトさせるため、ダメージの文の間は残す）。 */
	const renderEnemies = (dying?: Fighter) => {
		for (const e of enemies) {
			e.view.classList.toggle("dead", e.hp <= 0 && e !== dying);
			e.view.classList.toggle("shielded", shielded(e)); // 守りの間は HP のバーが灰色
			const i = e.bar?.firstElementChild as HTMLElement | null;
			if (i) i.style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;
		}
	};
	renderParty();
	renderEnemies();

	// ── オート（全員おまかせ） ──
	//
	// やめ方は2つ。どちらも、オートが続いているあいだ ずっと効く。
	// - B（キーボードの X・Esc）… 早送りの手より先に受ける
	// - コマンド欄いっぱいに出す「オートを　やめる」… スマホには B のボタンが無いので必要
	//   （画面の十字キー・A/B は戦闘の画面の下に隠れる）
	let auto = false;
	const autoBtn = el("button", {
		class: "cmd auto-stop",
		text: "オートを　やめる",
	});
	onTap(autoBtn, cmdEl, () => stopAuto());
	const setAuto = (on: boolean): void => {
		if (auto === on) return;
		auto = on;
		if (on) {
			cmdEl.classList.remove("list");
			cmdEl.replaceChildren(autoBtn);
			cmdEl.classList.add("shown");
		} else if (autoBtn.parentElement === cmdEl) {
			cmdEl.classList.remove("shown");
			cmdEl.replaceChildren();
		}
	};
	/** プレイヤーがやめたとき（音を鳴らす）。 */
	const stopAuto = (): void => {
		if (!auto) return;
		audio.se("cancel");
		setAuto(false);
	};

	// ── メッセージ（タップで早送り） ──
	let fast = false;
	const pushFast = () =>
		input.push((k) => {
			// オート中の B は「やめる」。早送りにはしない
			if (k === "b" && auto) {
				stopAuto();
				return;
			}
			if (k === "a" || k === "b") fast = true;
		});
	let popFast = pushFast();
	popSkip(); // ここからの入力は早送り
	const log = async (text: string, wait = 650) => {
		logEl.textContent = text;
		fast = false;
		const t0 = performance.now();
		while (performance.now() - t0 < wait && !fast) {
			await sleep(30);
			// 効果音の本体が鳴っている間の早送りは無視する（連打で音が畳みかけないように）
			if (audio.seHeld) fast = false;
		}
		// 時間で進むときも、効果音の区切りまでは次の文（とその音）を出さない
		await audio.seSettled();
	};

	const names = [...new Set(group.enemies.map((id) => data.enemies[id].name))];
	await log(group.intro ?? `${names.join("と　")}が　あらわれた！`, 900);

	let result = null as BattleResult | null;

	// ── コマンド選択 ──
	/** desc（2行目の説明）がある一覧は、読めるように1行に1つずつ並べる（list）。 */
	const menu = (
		items: {
			label: string;
			sub?: string;
			desc?: string;
			disabled?: boolean;
			value: string;
		}[],
		back: boolean,
	): Promise<string | null> =>
		new Promise((resolve) => {
			cmdEl.replaceChildren();
			const list = items.some((i) => i.desc);
			cmdEl.classList.toggle("list", list);
			// 一覧を選んでいる間は、空の文の欄をたたんで場所をゆずる（style.css）
			root.classList.toggle("picking", list);
			cmdEl.classList.add("shown");
			cmdEl.scrollTop = 0;
			let cur = Math.max(
				0,
				items.findIndex((i) => !i.disabled),
			);
			const buttons = items.map((it) => {
				const b = el("button", {
					class: "cmd",
					html: it.desc
						? `<span>${it.label}</span>${it.sub ? `<small>${it.sub}</small>` : ""}<span class="desc">${it.desc}</span>`
						: `${it.label}${it.sub ? `<small>${it.sub}</small>` : ""}`,
				});
				if (it.disabled) b.classList.add("disabled");
				if (it.desc) b.classList.add("has-desc");
				onTap(b, cmdEl, () => {
					if (!it.disabled) done(it.value);
				});
				cmdEl.appendChild(b);
				return b;
			});
			if (back) {
				const b = el("button", { class: "cmd back", text: "もどる" });
				onTap(b, cmdEl, () => done(null));
				cmdEl.appendChild(b);
			}
			const render = () =>
				buttons.forEach((b, i) => {
					b.classList.toggle("cur", i === cur);
					// 画面に収まらず巻き取れるときも、カーソルの行は見えるように
					if (i === cur) keepInView(cmdEl, b);
				});
			render();
			// 上下で動く幅＝今の画面での列の数（縦持ち2列・横持ち3列・説明つきの一覧は1列）
			const cols = Math.max(
				1,
				getComputedStyle(cmdEl).gridTemplateColumns.split(" ").length,
			);
			const pop = input.push((k) => {
				const move = (d: number) => {
					let n = cur;
					for (let tries = 0; tries < items.length; tries++) {
						n = (n + d + items.length) % items.length;
						if (!items[n].disabled) break;
					}
					cur = n;
					audio.se("cursor");
					render();
				};
				if (k === "left") move(-1);
				else if (k === "right") move(1);
				else if (k === "up") move(-cols);
				else if (k === "down") move(cols);
				else if (k === "a" && !items[cur].disabled) done(items[cur].value);
				else if (k === "b" && back) done(null);
			});
			const done = (v: string | null) => {
				pop();
				audio.se(v === null ? "cancel" : "decide");
				root.classList.remove("picking");
				cmdEl.classList.remove("shown");
				cmdEl.replaceChildren();
				resolve(v);
			};
		});

	/** 対象を選ぶ。includeDown: 倒れた仲間も選べる（いきかえる道具）。 */
	const pickTarget = async (
		side: Side,
		includeDown = false,
	): Promise<Fighter | null> => {
		const list =
			side === "party" && includeDown
				? party
				: alive(side === "enemy" ? enemies : party);
		// 守りのある敵（裏ボス）は後ろへ（カーソルが当たる敵から始まるように）
		if (side === "enemy")
			list.sort((a, b) => Number(shielded(a)) - Number(shielded(b)));
		if (list.length === 1 && side === "enemy") return list[0];
		const v = await menu(
			list.map((f, i) => ({
				label: f.name,
				sub:
					side === "party"
						? `HP ${f.hp}/${f.maxHp}`
						: shielded(f)
							? "むてき"
							: undefined,
				value: String(i),
			})),
			true,
		);
		return v === null ? null : list[Number(v)];
	};

	/** このターンに回復のうたが決まった仲間（おまかせが同じ人を重ねて回復して、こえを むだにしないように）。 */
	const healing = new Set<Fighter>();
	/** 決めた行動が回復のうたなら、その相手を healing に入れる（手で選んだ回復も）。 */
	const noteHeal = (f: Fighter, action: Action): void => {
		if (action.kind !== "skill" || action.skill.kind !== "heal") return;
		const ts =
			action.skill.target === "allies" ? alive(party) : [action.target ?? f];
		for (const t of ts) healing.add(t);
	};

	/** おまかせの行動。 */
	const aiAction = (f: Fighter): Action => {
		const all = alive(enemies);
		const open = all.filter((x) => !shielded(x));
		// 守りのある敵（裏ボス）は、ほかに ねらえる敵が いれば ねらわない
		const foes = open.length ? open : all;
		const friends = alive(party);
		// 回復は、このターンに まだ だれも回復しない仲間だけ
		const hurt = friends
			.filter((x) => x.hp / x.maxHp < 0.4 && !healing.has(x))
			.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
		const usable = f.skills.filter((s) => s.mp <= f.mp);
		const heal = usable.find((s) => s.kind === "heal");
		if (hurt.length && heal)
			return {
				kind: "skill",
				skill: heal,
				target: heal.target === "ally" ? hurt[0] : null,
			};
		// 守りのある敵しかいない（裏ボスの最初）：かならず かわされるので、こえは つかわない
		if (!open.length && all.some(shielded))
			return { kind: "attack", target: all[0] };
		const aoe = usable.find(
			(s) => s.kind === "attack" && s.target === "enemies",
		);
		if (aoe && foes.length >= 2 && f.mp >= f.maxMp * 0.3)
			return { kind: "skill", skill: aoe, target: null };
		const buff = usable.find((s) => s.kind === "buff" || s.kind === "guard");
		if (buff && isBoss && Math.random() < 0.25)
			return { kind: "skill", skill: buff, target: null };
		const strong = usable.find(
			(s) => s.kind === "attack" && s.target === "enemy",
		);
		const weakest = foes.sort((a, b) => a.hp - b.hp)[0];
		if (strong && isBoss && f.mp >= f.maxMp * 0.3)
			return { kind: "skill", skill: strong, target: weakest };
		return { kind: "attack", target: weakest };
	};

	const chooseAction = async (f: Fighter): Promise<Action | "auto" | null> => {
		for (;;) {
			const hasItem = Object.entries(state.items).some(
				([id, n]) => n > 0 && data.items[id]?.effect,
			);
			const v = await menu(
				[
					{ label: "たたかう", value: "attack" },
					{
						label: "うたう",
						// こえはあるのに、まだ　うたを覚えていない（キリコの Lv1 など）
						sub: !f.skills.length && f.maxMp ? "まだ　ない" : undefined,
						value: "skill",
						disabled: !f.skills.length,
					},
					{ label: "どうぐ", value: "item", disabled: !hasItem },
					{ label: "ぼうぎょ", value: "guard" },
					{ label: "にげる", value: "flee", disabled: isBoss },
					{ label: "オート", sub: "全員おまかせ", value: "auto" },
				],
				false,
			);
			logEl.textContent = "";
			if (v === "auto") return "auto";
			if (v === "attack") {
				const t = await pickTarget("enemy");
				if (t) return { kind: "attack", target: t };
			} else if (v === "guard") {
				return { kind: "guard" };
			} else if (v === "flee") {
				return { kind: "flee" };
			} else if (v === "skill") {
				const s = await menu(
					f.skills.map((sk) => ({
						label: sk.name,
						sub: `こえ${sk.mp}`,
						value: sk.id,
						disabled: sk.mp > f.mp,
					})),
					true,
				);
				if (s === null) continue;
				const skill = data.skills[s];
				if (skill.target === "enemy" || skill.target === "ally") {
					const t = await pickTarget(
						skill.target === "enemy" ? "enemy" : "party",
					);
					if (!t) continue;
					return { kind: "skill", skill, target: t };
				}
				return { kind: "skill", skill, target: null };
			} else if (v === "item") {
				const owned = Object.entries(state.items).filter(
					([id, n]) => n > 0 && data.items[id]?.effect,
				);
				// 効果は2行目に出しておく（タップだとすぐ決まって、選ぶ前に説明を読めないので）
				const it = await menu(
					owned.map(([id, n]) => ({
						label: data.items[id].name,
						sub: `×${n}`,
						desc: itemDesc(data.items[id]),
						value: id,
					})),
					true,
				);
				if (it === null) continue;
				const t = data.items[it].effect?.all
					? party[0]
					: await pickTarget("party", !!data.items[it].effect?.revive);
				if (!t) continue;
				return { kind: "item", item: it, target: t };
			}
		}
	};

	// ── ダメージ・演出 ──
	/**
	 * とくぎの演出を、当たる相手の上に出す。
	 * 画面ぜんたいの色を変えるだけだと どの技も同じに見えるので、形を技ごとに変える。
	 * 列ぜんたいに出す型（rain・spin）は、相手が並んでいる列の上にまとめて1つ。
	 */
	const playFx = (spec: FxSpec | undefined, targets: Fighter[]): void => {
		if (!spec || !targets.length) return;
		const wide = spec.kind === "rain" || spec.kind === "spin";
		const spots = wide
			? [targets[0].side === "enemy" ? enemyRow : partyRow]
			: targets.map((t) => t.view);
		const rr = root.getBoundingClientRect();
		for (const spot of spots) {
			const r = spot.getBoundingClientRect();
			if (!r.width || !r.height) continue;
			const box = fxNode(spec, r.height);
			const st = box.style;
			st.left = `${r.left - rr.left}px`;
			st.top = `${r.top - rr.top}px`;
			st.width = `${r.width}px`;
			st.height = `${r.height}px`;
			root.appendChild(box);
			setTimeout(() => box.remove(), FX_MS);
			// 受けた本人も ひと呼吸 ひからせる（なかまの札。style.css の .member.fx-lit）
			spot.style.setProperty("--fx", spec.color ?? "#fff");
			spot.classList.remove("fx-lit");
			void spot.offsetWidth;
			spot.classList.add("fx-lit");
			setTimeout(() => spot.classList.remove("fx-lit"), FX_MS);
		}
	};

	const hitEnemy = async (t: Fighter) => {
		t.view.classList.remove("hit");
		void t.view.offsetWidth;
		t.view.classList.add("hit");
		await sleep(120);
	};
	const hitParty = async (t: Fighter) => {
		t.view.classList.remove("hit");
		void t.view.offsetWidth;
		t.view.classList.add("hit");
		root.classList.remove("quake");
		void root.offsetWidth;
		root.classList.add("quake");
		await sleep(120);
	};

	// ── 召喚（裏ボス。EnemyDef.summon） ──
	/** ストックの次の1体を、キーを たたく文を流してから場に出す。early＝ターンの終わりに自分から。 */
	const summonNext = async (m: Fighter, early = false): Promise<void> => {
		const next = m.stock?.shift();
		const def = next ? data.enemies[next.enemy] : undefined;
		if (!next || !def) return;
		const fill = (t: string) =>
			t.replace("{user}", m.name).replace("{name}", def.name);
		const cfg = m.enemy?.summon;
		if (early && cfg?.early) await log(fill(cfg.early));
		if (next.restore) {
			audio.se("heal");
			await log(fill(next.restore.text));
			for (const p of alive(party)) {
				p.hp = Math.min(
					p.maxHp,
					p.hp + Math.round(p.maxHp * next.restore.rate),
				);
				p.mp = Math.min(
					p.maxMp,
					p.mp + Math.round(p.maxMp * next.restore.rate),
				);
			}
			renderParty();
			await log("みんなの　HPと　こえが　すこし　もどった！", 600);
		}
		for (const t of next.text) {
			const line = fill(t);
			// せりふ（名前「…」）は ふつうの待ちで読ませる
			if (line.indexOf("「") > 0) {
				await log(line);
				continue;
			}
			audio.se("cursor"); // キーの音（待ちが短いので「一瞬で」作っているように見える）
			await log(line, 320);
		}
		const f = spawn(next.enemy, def.name);
		f.master = m;
		fresh.push(f);
		f.view.classList.add("summoned"); // 1行ずつ組み上がる演出（style.css）
		f.view.addEventListener(
			"animationend",
			() => f.view.classList.remove("summoned"),
			{ once: true },
		);
		enemies.push(f);
		renderEnemies();
		audio.se("warp");
		await log(fill(next.deploy ?? "{name}を　デプロイした！"), 700);
		for (const t of next.after ?? []) await log(fill(t));
	};

	/** 守りのあるうちの攻撃：かならず かわし、手下がいなければ かわりに呼ぶ。 */
	const evade = async (t: Fighter): Promise<void> => {
		audio.se("miss");
		t.view.classList.remove("dodge");
		void t.view.offsetWidth;
		t.view.classList.add("dodge");
		const list = t.enemy?.summon?.evade ?? [];
		const text =
			list[Math.floor(Math.random() * list.length)] ??
			"{user}は　ひらりと　みをかわした！";
		await log(text.replace("{user}", t.name));
		if (!hasMinion(t)) await summonNext(t);
	};

	/** 手下が倒れたら次を呼ぶ。ストックも尽きたら守りがとける。 */
	const minionDown = async (m: Fighter): Promise<void> => {
		// 倒れた手下の枠を片付ける（フェードは「たおした」の文と撃破音の待ちの間に終わっている）
		for (const f of enemies) if (f.master === m && f.hp <= 0) f.view.remove();
		if (m.hp <= 0 || hasMinion(m)) return;
		if (m.stock?.length) return summonNext(m);
		renderEnemies(); // 守りの灰色が消える（もう当たる）
		audio.se("shock");
		for (const t of m.enemy?.summon?.exposed ?? [])
			await log(t.replace("{user}", m.name), 800);
	};

	const damage = (
		a: Fighter,
		t: Fighter,
		power: number,
	): { dmg: number; crit: boolean } => {
		const atk = a.atk * (a.buff > 0 ? 1.4 : 1);
		let dmg = (atk * power - t.def / 2) * rand(0.85, 1.15);
		const crit = a.side === "party" && power <= 1 && Math.random() < 1 / 16;
		if (crit) dmg = atk * power * 1.6;
		if (t.guard) dmg /= 2;
		dmg = Math.max(1, Math.round(dmg));
		return { dmg, crit };
	};

	const applyDamage = async (a: Fighter, t: Fighter, power: number) => {
		// 召喚する敵：守りのあるうちは必ずかわす。とけたら一撃で決まる
		if (t.stock && shielded(t)) return evade(t);
		const hit = damage(a, t, power);
		if (t.stock) {
			hit.dmg = t.hp;
			hit.crit = false;
			audio.se("critical");
			await log(
				(t.enemy?.summon?.finish ?? "いちげき！").replace("{user}", t.name),
				600,
			);
		}
		const { dmg, crit } = hit;
		if (crit) {
			audio.se("critical");
			await log("かいしんの　レス！", 450);
		}
		t.hp = Math.max(0, t.hp - dmg);
		if (t.side === "enemy") {
			audio.se("attack");
			await hitEnemy(t);
			renderEnemies(t);
			await log(`${t.name}に　${dmg}の　ダメージ！`);
			if (t.hp <= 0) {
				// 撃破音とフェードアウトを同時に始める
				audio.se("enemyDown");
				renderEnemies();
				await log(
					(t.enemy?.downText ?? "{user}を　たおした！").replace(
						"{user}",
						t.name,
					),
					500,
				);
				if (t.master) await minionDown(t.master);
			}
		} else {
			audio.se("damage");
			await hitParty(t);
			renderParty();
			await log(`${t.name}は　${dmg}の　ダメージを　うけた！`);
			if (t.hp <= 0) await log(`${t.name}は　たおれてしまった！`, 600);
		}
	};

	const heal = async (t: Fighter, amount: number) => {
		if (t.hp <= 0) return;
		const n = Math.min(t.maxHp - t.hp, Math.round(amount));
		if (n <= 0) return; // もともと満タンなら何も出さない
		t.hp += n;
		renderParty();
		audio.se("heal");
		await log(`${t.name}の　HPが　${n}　かいふくした！`, 550);
	};

	const act = async (a: Fighter, action: Action) => {
		if (a.hp <= 0 || result) return;
		const retarget = (t: Fighter): Fighter | null => {
			// 裏ボス：守りのある敵をねらっていて、このターンに手下が呼ばれていれば、そっちに当てる
			if (shielded(t)) {
				const f = fresh.find((x) => x.hp > 0);
				if (f) return f;
			}
			if (t.hp > 0) return t;
			const pool = alive(t.side === "enemy" ? enemies : party);
			return pool.find((f) => !shielded(f)) ?? pool[0] ?? null;
		};
		if (action.kind === "attack") {
			const t = retarget(action.target);
			if (!t) return;
			audio.se(a.side === "party" ? "attackStart" : "enemyAttack");
			const texts = a.member
				? data.cast[a.member.id]?.battle?.attackTexts
				: undefined;
			const text = texts?.length
				? texts[Math.floor(Math.random() * texts.length)]
				: "{user}の　こうげき！";
			await log(text.replace("{user}", a.name), 450);
			if (t.side === "party" && Math.random() < 0.06) {
				audio.se("miss");
				await log(`${t.name}は　ひらりと　みをかわした！`);
				return;
			}
			await applyDamage(a, t, 1);
		} else if (action.kind === "idle") {
			await log(action.text, 600);
		} else if (action.kind === "guard") {
			a.guard = true;
			await log(`${a.name}は　みを　まもっている。`, 450);
		} else if (action.kind === "flee") {
			await log("キリコたちは　にげだした！", 450);
			const partySpd =
				alive(party).reduce((s, f) => s + f.spd, 0) /
				Math.max(1, alive(party).length);
			const foeSpd =
				alive(enemies).reduce((s, f) => s + f.spd, 0) /
				Math.max(1, alive(enemies).length);
			if (Math.random() < 0.55 + (partySpd - foeSpd) * 0.03) {
				audio.se("flee");
				await log("うまく　にげきれた！", 600);
				result = "escape";
			} else {
				await log("しかし　まわりこまれてしまった！");
			}
		} else if (action.kind === "item") {
			const it = data.items[action.item];
			if (!game.story.take(action.item)) return;
			await log(`${a.name}は　${it.name}を　つかった！`, 450);
			const targets = it.effect?.all ? alive(party) : [action.target];
			for (const t of targets) {
				if (it.effect?.revive && t.hp <= 0) {
					t.hp = Math.round(t.maxHp * 0.5);
					renderParty();
					audio.se("heal");
					await log(`${t.name}が　いきかえった！`);
				}
				if (it.effect?.hp) await heal(t, it.effect.hp);
				if (it.effect?.mp && t.hp > 0) {
					const n = Math.min(t.maxMp - t.mp, it.effect.mp);
					t.mp += n;
					renderParty();
					await log(`${t.name}の　こえが　${n}　もどった！`, 500);
				}
			}
		} else if (action.kind === "skill") {
			const s = action.skill;
			if (a.side === "party") {
				if (a.mp < s.mp) {
					await log(`${a.name}は　こえが　たりない！`);
					return;
				}
				a.mp -= s.mp;
				renderParty();
			}
			audio.se(s.se ?? "spell");
			root.classList.remove("sing");
			void root.offsetWidth;
			root.classList.add("sing");
			// 先に狙った相手が倒れていたら、実際に当たる相手の名前を出す
			const aimed =
				s.kind === "attack" && s.target === "enemy" && action.target
					? retarget(action.target)
					: action.target;
			const targetName = aimed?.name ?? "";
			// 当たる顔ぶれを先に決める（演出とダメージで同じ相手をつかう）
			const pool = a.side === "party" ? enemies : party;
			const targets: Fighter[] =
				s.kind === "attack"
					? s.target === "enemies"
						? alive(pool)
						: [aimed ?? alive(pool)[0]].filter((x): x is Fighter => !!x)
					: s.kind === "heal"
						? s.target === "allies"
							? alive(party)
							: [action.target ?? a]
						: alive(party);
			// 演出は文といっしょに出す（送りの速い人を待たせない）
			playFx(s.fx, targets);
			await log(
				s.text.replace("{user}", a.name).replace("{target}", targetName),
				700,
			);
			if (s.kind === "attack") {
				for (const t of targets) {
					if (result) break;
					await applyDamage(a, t, s.power);
				}
			} else if (s.kind === "heal") {
				for (const t of targets) await heal(t, 30 * s.power);
			} else if (s.kind === "buff") {
				for (const t of alive(party)) t.buff = 3;
				await log("みんなの　こうげきりょくが　あがった！", 550);
			} else if (s.kind === "guard") {
				for (const t of alive(party)) t.guard = true;
				await log("みんなの　まもりが　かたくなった！", 550);
			}
		}
		if (!alive(enemies).length) result = "win";
		else if (!alive(party).length) result = "lose";
	};

	// ── ターン ──
	while (!result) {
		fresh.length = 0;
		healing.clear();
		const plans: { f: Fighter; action: Action; order: number }[] = [];
		for (const f of alive(party)) {
			const leader = f === party.find((p) => p.hp > 0);
			let action: Action;
			if (auto || (!leader && settings.autoAllies)) {
				action = aiAction(f);
			} else {
				// コマンドは効果音の区切りまで鳴ってから出す（すぐ決めて次の音が重ならないように）
				await audio.seSettled();
				popFast();
				logEl.textContent = `${f.name}は　どうする？`;
				const chosen = await chooseAction(f);
				popFast = pushFast();
				if (chosen === "auto") {
					setAuto(true);
					action = aiAction(f);
				} else if (chosen === null) {
					action = aiAction(f);
				} else {
					action = chosen;
				}
			}
			noteHeal(f, action);
			plans.push({ f, action, order: f.spd * rand(0.8, 1.2) });
			if (action.kind === "flee") break;
		}
		for (const e of alive(enemies)) {
			const acts = e.enemy?.acts;
			let action: Action;
			const targets = alive(party);
			const t = targets[Math.floor(Math.random() * targets.length)];
			if (acts?.length) {
				const total = acts.reduce((s, x) => s + x.weight, 0);
				let r = Math.random() * total;
				const pick =
					acts.find((x) => {
						r -= x.weight;
						return r <= 0;
					}) ?? acts[0];
				action =
					pick.power > 0
						? {
								kind: "skill",
								skill: {
									id: pick.name,
									name: pick.name,
									mp: 0,
									target: pick.target === "all" ? "enemies" : "enemy",
									power: pick.power,
									kind: "attack",
									text: pick.text.replace("{user}", e.name),
									se: "enemyAttack",
									// 敵のとくぎは、当たった人の札の上ではじける
									fx: { kind: "burst", color: "#ff8a5c" },
								},
								target: t,
							}
						: { kind: "idle", text: pick.text.replace("{user}", e.name) };
			} else {
				action = { kind: "attack", target: t };
			}
			plans.push({ f: e, action, order: e.spd * rand(0.8, 1.2) });
		}
		// にげるは最初に判定
		plans.sort((a, b) =>
			a.action.kind === "flee"
				? -1
				: b.action.kind === "flee"
					? 1
					: b.order - a.order,
		);
		for (const p of plans) {
			if (result) break;
			await act(p.f, p.action);
		}
		// 召喚する敵は、だれにも攻撃されず 手下もいなければ、ターンの終わりに自分で呼ぶ（止まらない）
		if (!result)
			for (const e of alive(enemies))
				if (e.stock?.length && !hasMinion(e)) await summonNext(e, true);
		for (const f of [...party, ...enemies]) {
			f.guard = false;
			if (f.buff > 0) f.buff--;
		}
		if (auto && !result) await sleep(250);
	}
	setAuto(false);

	// ── 決着 ──
	/** 経験値を なかまに入れ、上がったレベルと覚えたうたを出す。 */
	const share = async (exp: number): Promise<void> => {
		if (exp > 0) await log(`${exp}ポイントの　けいけんちを　かくとく！`, 900);
		// レベルアップの音は1回だけ（何人も上がると音が重なってうるさい）
		let leveled = false;
		for (const f of party) {
			if (!f.member) continue;
			const from = f.member.lv;
			const ups = gainExp(data, f.member, exp);
			if (ups > 0) {
				// ドラクエのように、勝利の曲を絞って止めてからレベルアップの音を鳴らす（2つを重ねない）
				if (!leveled) {
					await audio.fadeOutJingle(150);
					audio.se("levelup");
				}
				leveled = true;
				renderParty();
				await log(`${f.name}は　レベル${f.member.lv}に　あがった！`, 1000);
				// 覚えたうた（音はレベルアップの1回だけ）
				for (const t of learnTexts(data, f.member.id, from, f.member.lv))
					await log(t, 1000);
			}
		}
	};
	if (result === "win") {
		const exp = enemies.reduce((s, e) => s + (e.enemy?.exp ?? 0), 0);
		audio.bgm(null);
		if (data.victoryBgm) void audio.jingle(data.victoryBgm, 21, 5500);
		await log(group.victory ?? "あらしを　しずめた！", 900);
		await share(exp);
		for (const e of enemies) {
			const d = e.enemy?.drop;
			if (d && Math.random() < d.rate) {
				game.story.give(d.item);
				audio.se("item");
				await log(
					`${e.name}は　${data.items[d.item]?.name ?? d.item}を　おとしていった！`,
					900,
				);
			}
		}
		// 戦闘不能の仲間は HP1 で起き上がる（サクッと遊べるように）
		for (const m of state.party) if (m.hp <= 0) m.hp = 1;
	} else if (result === "lose") {
		// 裏ボス：負けても、たおした手下（呼ばれたボス）の分の経験値は入る（挑むほど追いつける）
		const exp = enemies.reduce(
			(s, e) => s + (e.master && e.hp <= 0 ? (e.enemy?.exp ?? 0) : 0),
			0,
		);
		if (exp > 0) {
			audio.bgm(null);
			await log("たおした　ボスの　けいけんちは　のこった！", 900);
			await share(exp);
		}
	}
	popFast();
	root.classList.remove("shown");
	await sleep(250);
	root.remove();
	return result;
};
