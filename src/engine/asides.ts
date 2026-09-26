// 出来事の直後だけの雑談（ひとこと）。状態はフラグに入れる（セーブにそのまま乗る）。
// - aside_<id> … 歩いているときの ひとことが流れた（出そびれた）
// - fresh_<id> … 町の人の「直後だけ」の一言を見た
// 「いま待っている ひとこと」（どのマップで出せるようになったか）はセーブしない。読み直したら、そのマップで また待つ。

import type {
	AsideData,
	AsideDef,
	AsideLine,
	FreshTalkDef,
	GameState,
} from "./defs";

/** ひとことが流れるまでに歩く歩数。 */
export const ASIDE_STEPS = 4;

const inParty = (st: GameState, id: string) =>
	id === "kiriko" || st.party.some((m) => m.id === id);

/** まだ流れていなくて、いま流せる ひとこと。 */
export const asideReady = (st: GameState, a: AsideDef): boolean =>
	!st.flags[`aside_${a.id}`] &&
	a.members.every((m) => inParty(st, m)) &&
	a.when(st);

export const asideLines = (st: GameState, a: AsideDef): AsideLine[] =>
	typeof a.lines === "function" ? a.lines(st) : a.lines;

/**
 * 待っている ひとことを、いまのマップにそろえる（マップに入ったとき・スクリプトの終わりに呼ぶ）。
 * armed は id → 出せるようになったマップ。ほかのマップで待っていたものは出そびれ（フラグを立てる）。
 */
export const syncAsides = (
	data: AsideData | undefined,
	st: GameState,
	armed: Map<string, string>,
): void => {
	for (const a of data?.walk ?? []) {
		if (!asideReady(st, a)) {
			armed.delete(a.id);
			continue;
		}
		const at = armed.get(a.id);
		if (at === undefined) armed.set(a.id, st.mapId);
		else if (at !== st.mapId) {
			armed.delete(a.id);
			st.flags[`aside_${a.id}`] = true;
		}
	}
};

/** いまのマップで流す ひとこと（先に書いたものから）。 */
export const nextAside = (
	data: AsideData | undefined,
	st: GameState,
	armed: Map<string, string>,
): AsideDef | undefined =>
	(data?.walk ?? []).find(
		(a) => armed.get(a.id) === st.mapId && asideReady(st, a),
	);

/** この人に話しかけたとき、ふだんの話の代わりに流す一言。 */
export const freshTalk = (
	data: AsideData | undefined,
	st: GameState,
	mapId: string,
	eventId: string,
): FreshTalkDef | undefined =>
	(data?.talk ?? []).find(
		(t) =>
			t.map === mapId &&
			t.event === eventId &&
			!st.flags[`fresh_${t.id}`] &&
			t.when(st),
	);
