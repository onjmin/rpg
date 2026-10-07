// 「はなす」の ひとことを書く道具（remarks.ts）。

import type { GameState, RemarkDef, RemarkLine } from "../../engine/defs";
import { type Section, section } from "../story";

/** 1人ぶん：その人の1窓だけなら文だけ、キリコの返しなどが あれば 行の並び。 */
type Say = string | RemarkLine[] | ((st: GameState) => string | RemarkLine[]);

const linesOf = (who: string, say: string | RemarkLine[]): RemarkLine[] =>
	typeof say === "string" ? [[who, say]] : say;

/**
 * ひとつの場面での、みんなの ひとこと（人ごとの RemarkDef に ひらく）。
 * where は map・area・when。書いた人の分だけ出る（書かない人は 下の場面へ）。
 */
export const scene = (
	where: Omit<RemarkDef, "who" | "lines">,
	byWho: Record<string, Say>,
): RemarkDef[] =>
	Object.entries(byWho).map(([who, say]) => ({
		...where,
		who,
		lines:
			typeof say === "function"
				? (st: GameState) => linesOf(who, say(st))
				: linesOf(who, say),
	}));

/** マップの中の範囲（両端ふくむ）。 */
export const near = (
	map: string,
	x0: number,
	y0: number,
	x1: number,
	y1: number,
): { map: string; area: [number, number, number, number] } => ({
	map,
	area: [x0, y0, x1, y1],
});

/** ストーリーの区間が そのどれか（story.ts の SECTIONS。完走のあとは "after"）。 */
export const during =
	(...secs: Section[]) =>
	(st: GameState): boolean =>
		secs.includes(section(st));

/** フラグが立っている。 */
export const has =
	(...names: string[]) =>
	(st: GameState): boolean =>
		names.every((n) => !!st.flags[n]);

/** a が立っていて、b は まだ。 */
export const between =
	(a: string, b: string) =>
	(st: GameState): boolean =>
		!!st.flags[a] && !st.flags[b];

/** その人が 仲間に いる（控えも ふくむ）。 */
export const inParty = (st: GameState, id: string): boolean =>
	st.party.some((m) => m.id === id);
