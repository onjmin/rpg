// 仲間との親睦：なかよし度（♥0〜5）・ひとやすみ会話・なかまと話す・プロフィール。
// 状態はすべてフラグに入れる（セーブにそのまま乗る）。
// - bond_<id>        … なかよし度
// - skit_<skitId>    … その会話を見た
// - chat_<id>_<ch>   … その章で、その人と はじめて話した（なかよし度が上がるのは章ごとに1回）

import type {
	BondData,
	GameState,
	RemarkDef,
	RemarkLine,
	SkitDef,
} from "./defs";

export const MAX_BOND = 5;

export const bondOf = (st: GameState, id: string): number =>
	Number(st.flags[`bond_${id}`] ?? 0);

/** なかよし度を上げる。上がったら true。 */
export const addBond = (st: GameState, id: string, n = 1): boolean => {
	if (id === "kiriko") return false;
	const cur = bondOf(st, id);
	const next = Math.min(MAX_BOND, cur + n);
	st.flags[`bond_${id}`] = next;
	return next > cur;
};

export const hearts = (n: number): string =>
	"♥".repeat(n) + "♡".repeat(Math.max(0, MAX_BOND - n));

const inParty = (st: GameState, id: string) =>
	id === "kiriko" || st.party.some((m) => m.id === id);

/** いま見られる、まだ見ていない会話。 */
export const availableSkits = (
	bonds: BondData | undefined,
	st: GameState,
): SkitDef[] =>
	(bonds?.skits ?? []).filter(
		(k) =>
			!st.flags[`skit_${k.id}`] &&
			k.members.every((m) => inParty(st, m)) &&
			(!k.when || k.when(st)),
	);

/** もう見た会話（もう一度見る用）。 */
export const seenSkits = (
	bonds: BondData | undefined,
	st: GameState,
): SkitDef[] => (bonds?.skits ?? []).filter((k) => !!st.flags[`skit_${k.id}`]);

/** その「はなす」の ひとことが、いまの場所・場面に当てはまるか。 */
export const remarkFits = (r: RemarkDef, st: GameState): boolean => {
	if (
		r.map &&
		!(typeof r.map === "string" ? [r.map] : r.map).includes(st.mapId)
	)
		return false;
	if (r.area) {
		const [x0, y0, x1, y1] = r.area;
		if (st.x < x0 || st.x > x1 || st.y < y0 || st.y > y1) return false;
	}
	return !r.when || r.when(st);
};

/** その人の、いまの「はなす」（上から順に調べて最初に当てはまったもの）。 */
export const remarkOf = (
	bonds: BondData | undefined,
	st: GameState,
	who: string,
): RemarkLine[] | null => {
	const r = bonds?.remarks?.find((x) => x.who === who && remarkFits(x, st));
	if (!r) return null;
	return typeof r.lines === "function" ? r.lines(st) : r.lines;
};

/** 会話を見たことにして、出てきた仲間のなかよし度を上げる（はじめての時だけ）。上がった人の ID を返す。 */
export const markSkitSeen = (st: GameState, skit: SkitDef): string[] => {
	if (st.flags[`skit_${skit.id}`]) return [];
	st.flags[`skit_${skit.id}`] = true;
	return skit.members.filter((m) => addBond(st, m));
};
