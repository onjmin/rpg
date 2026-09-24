// 仲間の能力値とレベルアップ。

import type { CharDef, GameData, GameState, MemberState } from "./defs";

export const MAX_LV = 30;

/**
 * そのレベルに到達するのに必要な累計経験値。
 * Lv2 12（チュートリアル戦の 12 で かならず Lv2）・Lv5 101・Lv9 423・Lv11 710。
 * 終盤ほど1レベルが重い（寄り道した人と急いだ人のレベル差が開きすぎないように）。
 */
export const expFor = (lv: number): number => {
	const k = lv - 1;
	return lv <= 1 ? 0 : Math.round(k * (9 + k * (2.6 + k * 0.36)));
};

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

/** 新しく仲間になったときの状態（たたかう仲間の平均レベルに合わせる）。 */
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

// ───────────────── 控え（たたかうのは3人まで） ─────────────────

/** たたかって歩ける人数（キリコを入れて）。 */
export const MAX_ACTIVE = 3;

/** 控えでない仲間（隊列・戦闘・経験値の対象）。並びは隊列の順（先頭がリーダー）。 */
export const activeOf = (party: MemberState[]): MemberState[] =>
	party.filter((m) => !m.bench);

/** 控えの仲間（控えに回った順）。 */
export const benchOf = (party: MemberState[]): MemberState[] =>
	party.filter((m) => !!m.bench);

/** 並びをととのえる：たたかう仲間（隊列の順）を前、控えを後ろに。どちらも今の順のまま。 */
export const tidyParty = (party: MemberState[]): void => {
	party.splice(0, party.length, ...activeOf(party), ...benchOf(party));
};

/** m を配列の最後に移してから ととのえる（たたかう側・控えの それぞれの最後尾に入る）。 */
const toTail = (party: MemberState[], m: MemberState): void => {
	party.splice(party.indexOf(m), 1);
	party.push(m);
	tidyParty(party);
};

/** 控えに回す（リーダー＝先頭は回さない）。控えの最後に入る。回したら true。 */
export const toBench = (party: MemberState[], id: string): boolean => {
	const m = party.find((x) => x.id === id);
	if (!m || m === party[0] || m.bench) return false;
	m.bench = true;
	toTail(party, m);
	return true;
};

/** 控えから戻す（たたかう人が MAX_ACTIVE 未満のときだけ）。隊列の最後尾に入る。戻したら true。 */
export const fromBench = (party: MemberState[], id: string): boolean => {
	const m = party.find((x) => x.id === id);
	if (!m?.bench || activeOf(party).length >= MAX_ACTIVE) return false;
	delete m.bench;
	toTail(party, m);
	return true;
};

/** たたかう outId と控えの inId を入れかえる（inId が outId の隊列の位置に、outId が inId の控えの位置に入る）。 */
export const swapBench = (
	party: MemberState[],
	outId: string,
	inId: string,
): boolean => {
	const i = party.findIndex((x) => x.id === outId);
	const j = party.findIndex((x) => x.id === inId);
	if (i <= 0 || j <= 0 || party[i].bench || !party[j].bench) return false;
	[party[i], party[j]] = [party[j], party[i]];
	delete party[i].bench;
	party[j].bench = true;
	return true;
};

/**
 * 古いセーブ・開発用の開始：リーダーを控えから戻し、たたかう人を MAX_ACTIVE までにして並びをととのえる。
 * 控えに回すのは prefer の順（本編で控えに回る順）、無ければ 隊列の最後尾
 * （古いセーブは加入順なので いちばん新しい仲間）。控えに回した ID を返す。
 */
export const fixParty = (
	party: MemberState[],
	prefer: readonly string[],
): string[] => {
	const moved: string[] = [];
	if (party[0]?.bench) delete party[0].bench;
	tidyParty(party);
	for (;;) {
		const act = activeOf(party).slice(1);
		if (act.length + 1 <= MAX_ACTIVE) break;
		const id =
			prefer.find((p) => act.some((m) => m.id === p)) ?? act[act.length - 1].id;
		if (!toBench(party, id)) break;
		moved.push(id);
	}
	return moved;
};

// ───────────────── うた（レベルで覚える） ─────────────────

/** そのレベルで覚えているうた（覚える順）。 */
export const songsAt = (c: CharDef | undefined, lv: number): string[] =>
	(c?.battle?.skills ?? []).filter((s) => s.lv <= lv).map((s) => s.id);

/** 次にうたを覚えるレベル（もう無ければ null）。 */
export const nextSongLv = (c: CharDef | undefined, lv: number): number | null =>
	(c?.battle?.skills ?? []).reduce<number | null>(
		(n, s) => (s.lv > lv && (n === null || s.lv < n) ? s.lv : n),
		null,
	);

/** from より上・to 以下のレベルで覚えたうたの知らせ（覚える順）。 */
export const learnTexts = (
	data: GameData,
	id: string,
	from: number,
	to: number,
): string[] => {
	const c = data.cast[id];
	return (c?.battle?.skills ?? [])
		.filter((s) => s.lv > from && s.lv <= to)
		.map(
			// うたの名前は「」でくくる（「君はじつに馬鹿だな」など、名前が文になっているので）
			(s) =>
				`${c?.name ?? id}は　「${data.skills[s.id]?.name ?? s.id}」を　おぼえた！`,
		);
};

// ───────────────── 知らせの文 ─────────────────

/** いれかえの案内（はじめて控えができたときに1回だけ）。 */
export const BENCH_HINT =
	"メニューの「なかま」→「いれかえ」で\nたたかう　なかまを　えらべる。";
export const benchText = (name: string): string =>
	`${name}は　控えに　まわった。`;
export const backText = (name: string): string =>
	`${name}が　たたかう　なかまに　もどった。`;

/**
 * 遊び方の記録（仲間が どうぐ・うたを 使った回数）。ふつうは すぐ 1 になるので、
 * 0 のまま完走した「縛り」を エンディングで拾う（threadlog.ts の shibari）。
 */
export const countPlay = (
	state: GameState,
	key: "play_item" | "play_song",
): void => {
	state.flags[key] = Number(state.flags[key] ?? 0) + 1;
};
