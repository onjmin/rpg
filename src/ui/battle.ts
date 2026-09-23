// 戦闘（ドラクエ風の正面視点・コマンド式）。
//
// 操作するのは先頭のキリコだけで、仲間は「おまかせ」（設定で全員操作にもできる）。
// 「オート」を押すと全員おまかせで進む。負けたら「もういちど」ですぐ再戦できる。

import { cropOf, getImage, loadImage } from "../engine/assets";
import type {
	BattleResult,
	EnemyDef,
	MemberState,
	SkillDef,
} from "../engine/defs";
import { type Game, ResetToTitle } from "../engine/game";
import { gainExp, healAll, statsOf } from "../engine/party";
import { settings } from "../engine/settings";
import { isWalkRef } from "../engine/sprite";
import { sleep } from "../engine/types";
import { el } from "./dom";

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

const fight = async (game: Game, groupId: string): Promise<BattleResult> => {
	const { data, audio, input, state } = game;
	const group = data.groups[groupId];
	const isBoss = !!group.boss;
	audio.se("encounter");
	audio.bgm(group.bgm ?? (isBoss ? data.bossBgm : data.battleBgm));

	// ── 画面 ──
	const root = el("div", { class: "battle" });
	const enemyRow = el("div", { class: "enemy-row" });
	const partyRow = el("div", { class: "party-row" });
	const logEl = el("div", { class: "battle-log window" });
	const cmdEl = el("div", { class: "battle-cmd" });
	root.append(
		el("div", { class: "battle-bg" }),
		enemyRow,
		partyRow,
		logEl,
		cmdEl,
	);
	game.ui.appendChild(root);
	await sleep(20);
	root.classList.add("shown");

	// ── 戦う人 ──
	const enemies: Fighter[] = group.enemies.map((id, i) => {
		const e = data.enemies[id];
		// 画面の短辺に合わせて拡大（スマホ縦で 4 倍前後、ボスは 1.5 倍）
		const base = Math.max(
			3,
			Math.min(
				9,
				Math.round(Math.min(window.innerWidth, window.innerHeight) / 95),
			),
		);
		const scale = Math.round(base * (e.scale ?? (isBoss ? 1.5 : 1)));
		const sprite = enemyCanvas(e.sprite, scale);
		const bar = el("div", { class: "hpbar" }, [el("i")]);
		const view = el("div", { class: "enemy" }, [sprite, bar]);
		enemyRow.appendChild(view);
		const same = group.enemies.filter((x) => x === id).length > 1;
		return {
			side: "enemy",
			name: same
				? `${e.name}${"ABCDEFG"[group.enemies.slice(0, i + 1).filter((x) => x === id).length - 1]}`
				: e.name,
			hp: e.hp,
			maxHp: e.hp,
			mp: 0,
			maxMp: 0,
			atk: e.atk,
			def: e.def,
			spd: e.spd,
			enemy: e,
			skills: [],
			guard: false,
			buff: 0,
			view,
			bar,
		};
	});
	const party: Fighter[] = state.party.map((m) => {
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
			skills: (c.battle?.skills ?? [])
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
	const renderEnemies = () => {
		for (const e of enemies) {
			e.view.classList.toggle("dead", e.hp <= 0);
			const i = e.bar?.firstElementChild as HTMLElement | null;
			if (i) i.style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;
		}
	};
	renderParty();
	renderEnemies();

	// ── メッセージ（タップで早送り） ──
	let fast = false;
	const pushFast = () =>
		input.push((k) => {
			if (k === "a" || k === "b") fast = true;
		});
	let popFast = pushFast();
	const log = async (text: string, wait = 650) => {
		logEl.textContent = text;
		fast = false;
		const t0 = performance.now();
		while (performance.now() - t0 < wait && !fast) await sleep(30);
	};

	const names = [...new Set(group.enemies.map((id) => data.enemies[id].name))];
	await log(group.intro ?? `${names.join("と　")}が　あらわれた！`, 900);

	let auto = false;
	let result = null as BattleResult | null;

	// ── コマンド選択 ──
	const menu = (
		items: { label: string; sub?: string; disabled?: boolean; value: string }[],
		back: boolean,
	): Promise<string | null> =>
		new Promise((resolve) => {
			cmdEl.replaceChildren();
			cmdEl.classList.add("shown");
			let cur = Math.max(
				0,
				items.findIndex((i) => !i.disabled),
			);
			const buttons = items.map((it) => {
				const b = el("button", {
					class: "cmd",
					html: `${it.label}${it.sub ? `<small>${it.sub}</small>` : ""}`,
				});
				if (it.disabled) b.classList.add("disabled");
				b.addEventListener("pointerdown", (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					if (it.disabled) return;
					done(it.value);
				});
				cmdEl.appendChild(b);
				return b;
			});
			if (back) {
				const b = el("button", { class: "cmd back", text: "もどる" });
				b.addEventListener("pointerdown", (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					done(null);
				});
				cmdEl.appendChild(b);
			}
			const render = () =>
				buttons.forEach((b, i) => {
					b.classList.toggle("cur", i === cur);
				});
			render();
			const cols = 2;
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
		if (list.length === 1 && side === "enemy") return list[0];
		const v = await menu(
			list.map((f, i) => ({
				label: f.name,
				sub: side === "party" ? `HP ${f.hp}/${f.maxHp}` : undefined,
				value: String(i),
			})),
			true,
		);
		return v === null ? null : list[Number(v)];
	};

	/** おまかせの行動。 */
	const aiAction = (f: Fighter): Action => {
		const foes = alive(enemies);
		const friends = alive(party);
		const hurt = friends
			.filter((x) => x.hp / x.maxHp < 0.4)
			.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
		const usable = f.skills.filter((s) => s.mp <= f.mp);
		const heal = usable.find((s) => s.kind === "heal");
		if (hurt.length && heal)
			return {
				kind: "skill",
				skill: heal,
				target: heal.target === "ally" ? hurt[0] : null,
			};
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
					{ label: "うたう", value: "skill", disabled: !f.skills.length },
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
				const it = await menu(
					owned.map(([id, n]) => ({
						label: data.items[id].name,
						sub: `×${n}`,
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
		const { dmg, crit } = damage(a, t, power);
		if (crit) {
			audio.se("critical");
			await log("かいしんの　レス！", 450);
		}
		t.hp = Math.max(0, t.hp - dmg);
		if (t.side === "enemy") {
			audio.se("attack");
			await hitEnemy(t);
			renderEnemies();
			await log(`${t.name}に　${dmg}の　ダメージ！`);
			if (t.hp <= 0) {
				audio.se("enemyDown");
				await log(`${t.name}を　たおした！`, 500);
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
			if (t.hp > 0) return t;
			const pool = alive(t.side === "enemy" ? enemies : party);
			return pool[0] ?? null;
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
			await log(
				s.text.replace("{user}", a.name).replace("{target}", targetName),
				700,
			);
			if (s.kind === "attack") {
				const pool = a.side === "party" ? enemies : party;
				const targets =
					s.target === "enemies"
						? alive(pool)
						: [aimed ?? alive(pool)[0]].filter((x): x is Fighter => !!x);
				for (const t of targets) {
					if (result) break;
					await applyDamage(a, t, s.power);
				}
			} else if (s.kind === "heal") {
				const targets =
					s.target === "allies" ? alive(party) : [action.target ?? a];
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
		const plans: { f: Fighter; action: Action; order: number }[] = [];
		for (const f of alive(party)) {
			const leader = f === party.find((p) => p.hp > 0);
			let action: Action;
			if (auto || (!leader && settings.autoAllies)) {
				action = aiAction(f);
			} else {
				popFast();
				logEl.textContent = `${f.name}は　どうする？`;
				const chosen = await chooseAction(f);
				popFast = pushFast();
				if (chosen === "auto") {
					auto = true;
					action = aiAction(f);
				} else if (chosen === null) {
					action = aiAction(f);
				} else {
					action = chosen;
				}
			}
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
		for (const f of [...party, ...enemies]) {
			f.guard = false;
			if (f.buff > 0) f.buff--;
		}
		if (auto && !result) {
			// オート中でも B で止められる
			logEl.textContent = "オート中……（Bで　とめる）";
			let stop = false;
			const pop = input.push((k) => {
				if (k === "b") stop = true;
			});
			await sleep(250);
			pop();
			if (stop) auto = false;
		}
	}

	// ── 決着 ──
	if (result === "win") {
		const exp = enemies.reduce((s, e) => s + (e.enemy?.exp ?? 0), 0);
		audio.bgm(null);
		if (data.victoryBgm) void audio.jingle(data.victoryBgm, 21, 5500);
		await log(group.victory ?? "あらしを　しずめた！", 900);
		if (exp > 0) await log(`${exp}ポイントの　けいけんちを　かくとく！`, 900);
		for (const f of party) {
			if (!f.member) continue;
			const ups = gainExp(data, f.member, exp);
			if (ups > 0) {
				audio.se("levelup");
				renderParty();
				await log(`${f.name}は　レベル${f.member.lv}に　あがった！`, 1000);
			}
		}
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
	}
	popFast();
	root.classList.remove("shown");
	await sleep(250);
	root.remove();
	return result;
};
