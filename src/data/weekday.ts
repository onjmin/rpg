// 遊んでいる端末の曜日（0=日〜6=土）。
// ゲームの中の日付（2026-08-18・火曜日。先住民の「土曜日ど！」に やきうが「火曜日やぞ」と返す日）とは別で、
// 「外」の曜日が しみだしてくる寄り道（勢い欄・先住民・にぃちぇ・おんちゃん・スタジアム）だけが見る。
// 現実の時間とつなぐのは 曜日の区切りまで（日付・月・季節・時刻は見ない）。
// 期間限定は 現実の日付ではなく、ストーリーの区間で決める（story.ts の section）。
// 開発中は URL の &wday=0〜6 で決め打ちできる（pnpm dev のときだけ）。

/** 端末の曜日（0=日〜6=土）。開発中は &wday=0〜6 で決め打ち（pnpm dev のときだけ）。 */
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
