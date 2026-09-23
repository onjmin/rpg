// どうぐの一覧の2行目（効果の一言）。フィールドのメニューと戦闘の「どうぐ」で共用。
//
// タップすると選んだ瞬間に決まるので、カーソルを合わせたときの説明では見る暇がない。
// だから効果は一覧の行そのものに出す。文は desc を使い、数字が効果（effect）と
// 食い違っていたら効果から組み立てた文に差し替える（表示と中身がずれないように）。
// 頭に「だれに効くか」の札を付ける（desc がもう言っていれば付けない）。

import type { ItemDef } from "../engine/defs";

type Effect = NonNullable<ItemDef["effect"]>;

/** 2行目の長さの目安（全角1・半角0.5）。320px 幅のメニューで2行に収まる量。 */
const MAX_UNITS = 36;

const esc = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** 全角1・半角0.5 で数えた長さ。 */
const units = (s: string) =>
	[...s].reduce((n, c) => n + (/[\x20-\x7e｡-ﾟ]/.test(c) ? 0.5 : 1), 0);

/** だれに効くか。 */
const targetTag = (e: Effect): string =>
	e.all ? "みんな" : e.revive ? "たおれた　なかま" : "ひとり";

/** 効果から組み立てた文（desc が効果と合わないときに使う）。 */
const effectText = (e: Effect): string =>
	[
		e.revive ? "いきかえる" : "",
		e.hp ? `HPを　${e.hp}　かいふく` : "",
		e.mp ? `こえを　${e.mp}　かいふく` : "",
	]
		.filter(Boolean)
		.join("・") || "つかえる";

/** 文の中に数 n がそのまま書いてあるか（30 と 300 を取り違えない）。 */
const hasNumber = (s: string, n: number) =>
	new RegExp(`(^|[^0-9])${n}([^0-9]|$)`).test(s);

/** desc が効果の中身と数字を言い当てているか。 */
const descMatches = (desc: string, e: Effect): boolean => {
	const s = desc.normalize("NFKC");
	if (e.hp && !(s.includes("HP") && hasNumber(s, e.hp))) return false;
	if (e.mp && !((s.includes("こえ") || s.includes("声")) && hasNumber(s, e.mp)))
		return false;
	if (e.revive && !s.includes("いきかえ")) return false;
	return true;
};

const warned = new Set<string>();

/** 一覧の2行目（HTML）。札は <b class="tag">。 */
export const itemDesc = (it: ItemDef): string => {
	if (it.key) return `<b class="tag">だいじなもの</b>${esc(it.desc)}`;
	const e = it.effect;
	if (!e) return esc(it.desc);
	let text = it.desc;
	if (!descMatches(text, e)) {
		if (!warned.has(it.id)) {
			warned.add(it.id);
			console.warn(
				`[item] ${it.id} の desc「${it.desc}」が効果と合わないので、効果から組み立てた文を出します`,
			);
		}
		text = effectText(e);
	}
	const tag = targetTag(e);
	// desc がもう「みんな」「たおれた」と言っている・長くて2行に収まらないときは札を省く
	const said = text.includes(tag.split("　")[0]);
	const fits = units(tag) + 1 + units(text) <= MAX_UNITS;
	return `${said || !fits ? "" : `<b class="tag">${tag}</b>`}${esc(text)}`;
};
