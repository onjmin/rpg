// 仲間の能力値とレベルアップ。

import type { CharDef, GameData, MemberState } from "./defs";

export const MAX_LV = 30;

/** そのレベルに到達するのに必要な累計経験値。 */
export const expFor = (lv: number): number =>
	lv <= 1 ? 0 : Math.round(12 * (lv - 1) ** 1.75);

export type Stats = {
	maxHp: number;
	maxMp: number;
	atk: number;
	def: number;
	spd: number;
};

const grow = ([base, per]: [number, number], lv: number) =>
	Math.round(base + per * (lv - 1));

export const statsOf = (c: CharDef, lv: number): Stats => {
	const b = c.battle;
	if (!b) return { maxHp: 1, maxMp: 0, atk: 1, def: 1, spd: 1 };
	return {
		maxHp: grow(b.hp, lv),
		maxMp: grow(b.mp, lv),
		atk: grow(b.atk, lv),
		def: grow(b.def, lv),
		spd: grow(b.spd, lv),
	};
};

/** 新しく仲間になったときの状態（パーティの平均レベルに合わせる）。 */
export const newMember = (
	data: GameData,
	id: string,
	party: MemberState[],
): MemberState => {
	const c = data.cast[id];
	const lv = party.length
		? Math.max(
				1,
				Math.round(party.reduce((s, m) => s + m.lv, 0) / party.length),
			)
		: 1;
	const st = statsOf(c, lv);
	return { id, lv, exp: expFor(lv), hp: st.maxHp, mp: st.maxMp };
};

/** 経験値を足してレベルアップした回数を返す。 */
export const gainExp = (
	data: GameData,
	m: MemberState,
	exp: number,
): number => {
	m.exp += exp;
	let ups = 0;
	while (m.lv < MAX_LV && m.exp >= expFor(m.lv + 1)) {
		const before = statsOf(data.cast[m.id], m.lv);
		m.lv++;
		ups++;
		const after = statsOf(data.cast[m.id], m.lv);
		// 上がった分だけ現在値も増やす
		m.hp += after.maxHp - before.maxHp;
		m.mp += after.maxMp - before.maxMp;
	}
	return ups;
};

export const healAll = (data: GameData, party: MemberState[]): void => {
	for (const m of party) {
		const st = statsOf(data.cast[m.id], m.lv);
		m.hp = st.maxHp;
		m.mp = st.maxMp;
	}
};
