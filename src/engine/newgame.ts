// 次スレ（Part2）＝ 強くてニューゲーム。
//
// エンディングで やきうが「次スレ　立てといたで」と言うので、ほんとうに立てられるようにする。
// 引き継ぐのは「自分のもの」だけ：仲間のレベル・なかよし度・見た会話・記録・大事なもの。
// 話の進み（章・ボス・レス数）は まっさらに戻す。仲間は また ひとりずつ加わるが、
// 加わるときに前のレベルで入る（engine/game.ts の join が p2_lv_<id> を見る）。

import type { GameData, GameState } from "./defs";
import { expFor, healAll, newMember } from "./party";

/** 次スレへ持っていくフラグ（前方一致）。 */
const CARRY_PREFIX = [
	"bond_", // なかよし度
	"skit_", // 見た ひとやすみ会話
	"dig_", // 掘りおこした過去ログ
	"ex_", // テストサーバーの記録
	"p2_lv_", // 前の周のレベル
	"keep_", // スレをまたぐ約束（隠しイベント）
];

/** 次スレへ持っていくフラグ（そのもの）。 */
const CARRY_KEY = ["p2_n"];

const carried = (k: string): boolean =>
	CARRY_PREFIX.some((p) => k.startsWith(p)) || CARRY_KEY.includes(k);

/**
 * クリアした記録から、次スレのはじまりの状態を作る。
 * old は書きかえない（呼んだ側の state をこわさない）。
 */
export const nextThreadState = (data: GameData, old: GameState): GameState => {
	const st = data.start;
	const flags: GameState["flags"] = { ...(st.flags ?? {}) };
	for (const [k, v] of Object.entries(old.flags)) if (carried(k)) flags[k] = v;
	// 仲間のレベルを覚えておく（加わるときに この値で入る）
	for (const m of old.party) flags[`p2_lv_${m.id}`] = m.lv;
	flags.p2 = true;
	flags.p2_n = Number(old.flags.p2_n ?? 1) + 1;

	// 持ちものは「大事なもの」だけ引き継ぐ（どうぐは また ためる）
	const items: GameState["items"] = { ...(st.items ?? {}) };
	for (const [id, n] of Object.entries(old.items))
		if (data.items[id]?.key && n > 0) items[id] = n;

	const next: GameState = {
		mapId: st.mapId,
		x: st.x,
		y: st.y,
		dir: st.dir,
		flags,
		party: [],
		items,
		playMs: 0,
	};
	for (const id of st.party) {
		const m = newMember(data, id, next.party);
		const lv = Number(flags[`p2_lv_${id}`] ?? 0);
		if (lv > m.lv) {
			m.lv = lv;
			m.exp = expFor(lv);
		}
		next.party.push(m);
	}
	healAll(data, next.party);
	return next;
};
