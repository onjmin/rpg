// 遊んでいる端末の曜日（0=日〜6=土）。
// ゲームの中の日付（2026-08-18・火曜日。先住民の「土曜日ど！」に おんJ民が「火曜日やぞ」と返す日）とは別で、
// 「外」の曜日が しみだしてくる寄り道（勢い欄・先住民・にぃちぇ・おんちゃん・スタジアム）だけが見る。
// 開発中は URL の &wday=0〜6 で決め打ちできる（pnpm dev のときだけ）。

export const weekday = (): number => {
	if (import.meta.env.DEV && typeof location !== "undefined") {
		const w = new URLSearchParams(location.search).get("wday");
		if (w !== null && /^[0-6]$/.test(w)) return Number(w);
	}
	return new Date().getDay();
};

/** 曜日ごとの表を引く（日曜はじまり・7つ）。 */
export const byWeekday = <T>(table: readonly [T, T, T, T, T, T, T]): T =>
	table[weekday()];

/**
 * 期間限定の日（遊んでいる端末の日付）。おんJマイナーズの ひとことが変わる（minors.ts）。
 * 開発中は URL の &date=MMDD（例 &date=1224）で決め打ちできる（pnpm dev のときだけ）。
 */
export type Season =
	| "newyear" // 1/1〜1/7
	| "valentine" // 2/14
	| "april" // 4/1
	| "tanabata" // 7/7
	| "halloween" // 10/31
	| "xmas" // 12/24〜12/25
	| "omisoka"; // 12/31

/** その日（月・日）の期間限定。無ければ null。 */
export const seasonOf = (m: number, d: number): Season | null => {
	if (m === 1 && d <= 7) return "newyear";
	if (m === 2 && d === 14) return "valentine";
	if (m === 4 && d === 1) return "april";
	if (m === 7 && d === 7) return "tanabata";
	if (m === 10 && d === 31) return "halloween";
	if (m === 12 && (d === 24 || d === 25)) return "xmas";
	if (m === 12 && d === 31) return "omisoka";
	return null;
};

/** 今日の期間限定。 */
export const season = (): Season | null => {
	if (import.meta.env.DEV && typeof location !== "undefined") {
		const v = new URLSearchParams(location.search).get("date");
		if (v !== null && /^\d{4}$/.test(v))
			return seasonOf(Number(v.slice(0, 2)), Number(v.slice(2)));
	}
	const now = new Date();
	return seasonOf(now.getMonth() + 1, now.getDate());
};

/** 期間限定の表を引く（その日の文が無ければ undefined）。 */
export const bySeason = <T>(
	table: Partial<Record<Season, T>>,
): T | undefined => {
	const s = season();
	return s ? table[s] : undefined;
};
