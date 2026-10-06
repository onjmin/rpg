// 戦闘バランスのシミュレーター（pnpm balance）。
//
// ui/battle.ts の戦闘の計算（ダメージ・かいしん・かわす・素早さの順・敵の行動・おまかせの AI）を
// 画面なしで写して、本物のデータ（src/data）で何千回も戦わせる。道具は使わない（オートの人）。
// ui/battle.ts の計算を変えたら、ここも合わせる。
//
// 出すもの
// - ボス：目安のレベル（と ±1・+2）での勝率と、勝ったときのターン数
// - 雑魚：1戦で減る HP の割合と、蓄音機から出て 何戦で全滅するか（回復に戻る目安）
//
// node scripts/balance.mjs [回数]

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const N = Number(process.argv[2] ?? 2000);

const server = await createServer({
	root: ROOT,
	server: { middlewareMode: true, hmr: false, ws: false },
	appType: "custom",
	logLevel: "error",
	optimizeDeps: { noDiscovery: true, include: [] },
});
const { data } = await server.ssrLoadModule("/src/data/index.ts");
const P = await server.ssrLoadModule("/src/engine/party.ts");
await server.close();

// 試し：BAL_TWEAK='{"zonj":{"atk":18}}' で敵の数値を上書きして走らせる（データは書きかえない）
for (const [id, d] of Object.entries(JSON.parse(process.env.BAL_TWEAK ?? "{}")))
	Object.assign(data.enemies[id], d);

const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const alive = (fs) => fs.filter((f) => f.hp > 0);

const member = (id, lv, hp, mp) => {
	const c = data.cast[id];
	const st = P.statsOf(c, lv);
	return {
		side: "party",
		id,
		hp: hp ?? st.maxHp,
		maxHp: st.maxHp,
		mp: mp ?? st.maxMp,
		maxMp: st.maxMp,
		atk: st.atk,
		def: st.def,
		spd: st.spd,
		skills: P.songsAt(c, lv)
			.map((s) => data.skills[s])
			.filter(Boolean),
		guard: false,
		buff: 0,
	};
};

const foe = (id) => {
	const e = data.enemies[id];
	return {
		side: "enemy",
		id,
		hp: e.hp,
		maxHp: e.hp,
		atk: e.atk,
		def: e.def,
		spd: e.spd,
		enemy: e,
		guard: false,
		buff: 0,
	};
};

const damage = (a, t, power, canCrit) => {
	const atk = a.atk * (a.buff > 0 ? 1.4 : 1);
	let dmg = (atk * power - t.def / 2) * rand(0.85, 1.15);
	const crit = canCrit && a.side === "party" && Math.random() < 1 / 16;
	if (crit) dmg = atk * power * 1.6;
	if (t.guard) dmg /= 2;
	if (t.enemy?.metal && !crit) return Math.random() < 0.5 ? 0 : 1;
	return Math.max(1, Math.round(dmg));
};

/** 1戦。party は写しでなく そのまま減らす（連戦で使う）。 */
const fight = (party, groupId) => {
	const group = data.groups[groupId];
	const isBoss = !!group.boss;
	const enemies = group.enemies.map(foe);
	let result = null;
	let turns = 0;
	const healing = new Set();
	const ai = (f) => {
		const foes = alive(enemies);
		const friends = alive(party);
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
		const aoe = usable.find(
			(s) => s.kind === "attack" && s.target === "enemies",
		);
		if (aoe && foes.length >= 2 && f.mp >= f.maxMp * 0.3)
			return { kind: "skill", skill: aoe };
		const buff = usable.find((s) => s.kind === "buff" || s.kind === "guard");
		if (buff && isBoss && Math.random() < 0.25)
			return { kind: "skill", skill: buff };
		const strong = usable.find(
			(s) => s.kind === "attack" && s.target === "enemy",
		);
		const weakest = foes.sort((a, b) => a.hp - b.hp)[0];
		if (strong && isBoss && f.mp >= f.maxMp * 0.3)
			return { kind: "skill", skill: strong, target: weakest };
		return { kind: "attack", target: weakest };
	};
	const retarget = (t) => {
		if (t.hp > 0) return t;
		return alive(t.side === "enemy" ? enemies : party)[0] ?? null;
	};
	const act = (a, action) => {
		if (a.hp <= 0 || result) return;
		if (action.kind === "attack") {
			const t = retarget(action.target);
			if (!t) return;
			if (t.side === "party" && Math.random() < 0.06) return;
			t.hp = Math.max(0, t.hp - damage(a, t, 1, true));
		} else if (action.kind === "skill") {
			const s = action.skill;
			if (a.side === "party") {
				if (a.mp < s.mp) return;
				a.mp -= s.mp;
			}
			const pool = a.side === "party" ? enemies : party;
			if (s.kind === "attack") {
				const ts =
					s.target === "enemies"
						? alive(pool)
						: [action.target ? retarget(action.target) : alive(pool)[0]];
				for (const t of ts) {
					if (!t || result) continue;
					t.hp = Math.max(0, t.hp - damage(a, t, s.power, false));
				}
			} else if (s.kind === "heal") {
				const ts = s.target === "allies" ? alive(party) : [action.target ?? a];
				for (const t of ts)
					if (t.hp > 0)
						t.hp = Math.min(t.maxHp, t.hp + Math.round(30 * s.power));
			} else if (s.kind === "buff") {
				for (const t of alive(party)) t.buff = 3;
			} else if (s.kind === "guard") {
				for (const t of alive(party)) t.guard = true;
			}
		}
		if (!alive(enemies).length) result = "win";
		else if (!alive(party).length) result = "lose";
	};
	while (!result && turns < 60) {
		turns++;
		healing.clear();
		const plans = [];
		for (const f of alive(party)) {
			const action = ai(f);
			if (action.kind === "skill" && action.skill.kind === "heal")
				for (const t of action.skill.target === "allies"
					? alive(party)
					: [action.target ?? f])
					healing.add(t);
			plans.push({ f, action, order: f.spd * rand(0.8, 1.2) });
		}
		for (const e of alive(enemies)) {
			const acts = e.enemy.acts;
			const ts = alive(party);
			const t = ts[Math.floor(Math.random() * ts.length)];
			let action;
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
									kind: "attack",
									mp: 0,
									power: pick.power,
									target: pick.target === "all" ? "enemies" : "enemy",
								},
								target: t,
							}
						: { kind: "idle" };
			} else action = { kind: "attack", target: t };
			plans.push({ f: e, action, order: e.spd * rand(0.8, 1.2) });
		}
		plans.sort((a, b) => b.order - a.order);
		for (const p of plans) {
			if (result) break;
			act(p.f, p.action);
		}
		for (const f of [...party, ...enemies]) {
			f.guard = false;
			if (f.buff > 0) f.buff--;
		}
	}
	if (result === "win") for (const m of party) if (m.hp <= 0) m.hp = 1;
	return {
		result: result ?? "lose",
		turns,
		exp: enemies.reduce((s, e) => s + e.enemy.exp, 0),
	};
};

const pct = (x) => `${Math.round(x * 100)}%`.padStart(4);
const hpOf = (party) => party.reduce((s, m) => s + m.hp, 0);
const maxOf = (party) => party.reduce((s, m) => s + m.maxHp, 0);

/** ボス：そのレベル・顔ぶれで N 回。勝率と勝ったときの平均ターン。 */
const boss = (groupId, ids, lv) => {
	let win = 0;
	let turns = 0;
	for (let i = 0; i < N; i++) {
		const party = ids.map((id) => member(id, lv));
		const r = fight(party, groupId);
		if (r.result === "win") {
			win++;
			turns += r.turns;
		}
	}
	return { rate: win / N, turns: win ? turns / win : 0 };
};

/**
 * 雑魚：満タンから同じ場所で戦いつづける。
 * 1戦目で減る HP の割合・ターン数と、全滅するまでの戦闘数（中央値。20 で打ち切り）。
 */
const zone = (groups, ids, lv) => {
	let loss = 0;
	let turns = 0;
	const chains = [];
	for (let i = 0; i < N; i++) {
		const party = ids.map((id) => member(id, lv));
		let n = 0;
		for (; n < 20; n++) {
			const before = hpOf(party);
			const g = groups[Math.floor(Math.random() * groups.length)];
			const r = fight(party, g);
			if (n === 0) {
				loss += (before - hpOf(party)) / maxOf(party);
				turns += r.turns;
			}
			if (r.result !== "win") break;
		}
		chains.push(n);
	}
	chains.sort((a, b) => a - b);
	return {
		loss: loss / N,
		turns: turns / N,
		chain: chains[Math.floor(N / 2)],
		chain10: chains[Math.floor(N / 10)],
	};
};

/** 雑魚1戦の平均経験値（1 レベルに何戦かの目安）。 */
const expPer = (groups) =>
	groups.reduce(
		(s, g) =>
			s + data.groups[g].enemies.reduce((t, e) => t + data.enemies[e].exp, 0),
		0,
	) / groups.length;
const fightsPerLv = (groups, lv) =>
	((P.expFor(lv + 1) - P.expFor(lv)) / expPer(groups)).toFixed(1);

const KN = ["kiriko", "nanj"];
const KNR = ["kiriko", "nanj", "roze"];
const KRF = ["kiriko", "roze", "feris"];
const KRT = ["kiriko", "roze", "teto"];
const ROAD = ["g_road1", "g_road2", "g_road3", "g_road4"];
const KAKO = ["g_kako1", "g_kako2", "g_kako3", "g_kako4"];
const STD = ["g_std1", "g_std2", "g_std3"];
const SRV = ["g_srv1", "g_srv2", "g_srv3", "g_srv4", "g_srv5"];
// 裏シナリオ「過疎板探検」（data/kaso.ts）。板ごとの帯
const NEKO = ["g_neko1", "g_neko2"];
const AIS = ["g_ais1", "g_ais2"];
const HOS = ["g_hos1", "g_hos2", "g_hos3"];
const SEN = ["g_sen1", "g_sen2"];

console.log(`（${N} 回ずつ・オート・道具なし）\n`);
console.log(
	"■ 雑魚　レベル：1戦で減るHP・ターン／全滅までの戦闘数（中央値・下位1割）／1レベルに何戦",
);
const zones = [
	["街道 2人", ROAD, KN, [2, 3]],
	["街道 3人", ROAD, KNR, [3, 4, 5]],
	["倉庫", KAKO, KNR, [5, 6, 7]],
	["スタジアム", STD, KRF, [7, 8]],
	["サーバー", SRV, KRF, [9, 10]],
	["サーバー テト", SRV, KRT, [9, 10]],
	["裏 ねこ板", NEKO, KNR, [5, 6]],
	["裏 あいさつ板", AIS, KRF, [6, 7]],
	["裏 保守板", HOS, KRF, [8, 9]],
	["裏 1000取り", SEN, KRF, [9, 10]],
];
for (const [name, gs, ids, lvs] of zones)
	for (const lv of lvs) {
		const z = zone(gs, ids, lv);
		console.log(
			`${name.padEnd(8, "　")} Lv${String(lv).padEnd(2)} HP-${pct(z.loss)} ${z.turns.toFixed(1)}T ／ 全滅 ${String(z.chain).padStart(2)}戦（${String(z.chain10).padStart(2)}） ／ ${fightsPerLv(gs, lv)}戦`,
		);
	}

console.log("\n■ ボス　目安のレベルの前後：勝率（勝ったときのターン）");
const bosses = [
	["B1 番長", "g_b1", KNR, 4],
	["B2 ムッジェ", "g_b2", KNR, 6],
	["B3 監督", "g_b3", KRF, 7],
	["F1 テト入り", "g_f1", KRT, 9],
	["F1 テトなし", "g_f1", KRF, 9],
	["F2 テト入り", "g_f2", KRT, 10],
	["F2 テトなし", "g_f2", KRF, 10],
	["裏 ぬこ画像bot", "g_nekoboss", KNR, 5],
	["裏 定型文bot", "g_aisboss", KRF, 6],
	["裏 しずけさ", "g_hosboss", KRF, 8],
	["裏 kskの主", "g_senboss", KRF, 9],
	["裏 ゲッター テトなし", "g_getter", KRF, 9],
	["裏 ゲッター テト入り", "g_getter", KRT, 9],
	["F1 避難J後 テトなし", "g_f1_h", KRF, 9],
];
for (const [name, g, ids, lv] of bosses) {
	const cells = [-1, 0, 1, 2].map((d) => {
		const b = boss(g, ids, lv + d);
		return `Lv${lv + d} ${pct(b.rate)}（${b.turns.toFixed(1)}）`;
	});
	console.log(`${name.padEnd(8, "　")} ${cells.join("  ")}`);
}
