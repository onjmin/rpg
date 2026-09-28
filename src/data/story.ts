// シナリオ全体で使う共通の判定・部品（設計書 §6・§12-1）。各マップはここから import する。

import type { EventDef, GameState, Story } from "../engine/defs";
import { BENCH_HINT, songsAt } from "../engine/party";
import type { Dir } from "../engine/types";
import { cast } from "./cast";
import { SPR } from "./sprites";

/** 第四章の沈黙期間（キリコの声が出ない・町が静か）。 */
export const silent = (st: GameState): boolean =>
	!!st.flags.balus_lost && !st.flags.rec;

/**
 * ストーリーの区間（いまの目的の区切り）と、その区間を ぬけると立つフラグ。話の順。
 * 期間限定の場面（その区間に いる あいだは ずっと起きて、過ぎたら もう起きない）は、この区間で決める。
 * 現実の日付では決めない（現実の時間とつなぐのは 曜日まで。weekday.ts）。
 */
export const SECTIONS = [
	["ikioi", "ikioi_seen"], // 広場の勢い欄を見る
	["road", "roze_in"], // 北のスレ街道へ
	["bridge", "b1"], // 橋の夏休みキッズ番長
	["kakolog", "b2"], // 過去ログ倉庫のおく
	["stadium", "b3"], // おんJスタジアム
	["rest", "balus_lost"], // 町でひと休み
	["mamma", "teto_met"], // 沈黙：マッマのところへ
	["studio", "rec"], // 沈黙：スタジオのマイクの前へ
	["server", "door_open"], // サーバーのアク禁の扉
	["gate", "clear"], // ゲートの奥の1000レス目へ
] as const;

/** ストーリーの区間。"after" は完走のあと。 */
export type Section = (typeof SECTIONS)[number][0] | "after";

/** いまの区間（ぬけるフラグが まだ立っていない最初の区間。完走していれば "after"）。 */
export const section = (st: GameState): Section =>
	st.flags.clear
		? "after"
		: (SECTIONS.find(([, flag]) => !st.flags[flag])?.[0] ?? "after");

/** いまの目的（蓄音機で表示）。 */
export const objective = (st: GameState): string => {
	const f = st.flags;
	switch (section(st)) {
		case "ikioi":
			return "広場の　勢い欄を　見る";
		case "road":
			return "北の　スレ街道へ";
		case "bridge":
			return f.hw_help
				? "魚を　つって　番長に　見せる"
				: "橋の　夏休みキッズ番長を　どかす";
		case "kakolog":
			return "過去ログ倉庫の　おくを　しらべる";
		case "stadium":
			return f.quiz_ok
				? "マウンドの　テノヒラ監督と　勝負"
				: "町の東門から　おんJスタジアムへ";
		case "rest":
			return "町で　ひと休み";
		case "mamma":
			return "……マッマの　ところへ";
		case "studio":
			return "スタジオの　マイクの前へ";
		case "server":
			return "サーバーの　アク禁の扉を　ひらく";
		case "gate":
			return "ゲートの　奥の　1000レス目へ";
		case "after":
			// クリア後（管理人室のおまけ）
			if (!f.satoru_met) return "スレの　下の扉の　むこうへ";
			if (!f.satoru_win) return "管理人の　テストに　付き合う";
			return "スレは　完走！　おつかれさま";
	}
};

/** 蓄音機にたまったレス数の表示。 */
export const resLine = (st: GameState): string =>
	`【安価】安価でボカロ作ろうぜ　${Number(st.flags.res ?? 0)}/1000`;

/** 蓄音機の本体：回復＋レス数＋いまの目的＋セーブ（レイの2回目以降でも使う）。 */
export const phonoRun = async (s: Story): Promise<void> => {
	s.heal();
	s.se("inn");
	await s.narrate(
		silent(s.state)
			? "蓄音機は　音もなく　まわっている……\nHPと　こえが　かいふくした。"
			: "蓄音機から　なつかしい　レスが　ながれた。\nHPと　こえが　かいふくした！",
	);
	// まだ見ていない「ひとやすみ会話」があれば、ここで見られる（仲間との親睦）
	if (!silent(s.state)) await s.restTalk();
	await s.narrate(`${resLine(s.state)}\nいまの目的：${objective(s.state)}`);
	await s.saveMenu();
};

/** 蓄音機（調べると 回復・レス数・いまの目的・セーブ）。 */
export const phono = (id: string, x: number, y: number): EventDef => ({
	id,
	x,
	y,
	sprite: SPR.phono,
	trigger: "talk",
	fixedDir: true,
	run: phonoRun,
});

/** 見えるシンボル敵（once にしない。勝ったら消える、逃げたら残る）。 */
export const symbol = (
	id: string,
	x: number,
	y: number,
	sprite: string,
	group: string,
	line: string,
	name = "J民",
): EventDef => ({
	id,
	x,
	y,
	sprite,
	trigger: "talk",
	run: async (s) => {
		await s.say("nanj", line, { name });
		if ((await s.battle(group)) === "win") s.hide(id);
	},
});

/** 開かない扉（踏むと文を出して1歩もどす）。 */
export const lockedDoor = (
	id: string,
	x: number,
	y: number,
	text: string,
	when?: EventDef["when"],
	back: "u" | "d" | "l" | "r" = "d",
): EventDef => ({
	id,
	x,
	y,
	trigger: "touch",
	through: true,
	when,
	run: async (s) => {
		await s.narrate(text);
		await s.move("player", back);
	},
});

/** キリコのセリフ（沈黙中は「書きこみ」表示で、読み上げない）。 */
export const ks = (s: Story, text: string): Promise<void> =>
	silent(s.state)
		? s.say("kiriko", text, { noVoice: true, name: "キリコ（かきこみ）" })
		: s.say("kiriko", text);

/**
 * その仲間が うたを覚えているか（レベルで覚える。song を省くと「ひとつでも」）。
 * 仲間にいなければ false。
 */
export const knows = (st: GameState, who: string, song?: string): boolean => {
	const m = st.party.find((x) => x.id === who);
	if (!m) return false;
	const list = songsAt(cast[who], m.lv);
	return song ? list.includes(song) : list.length > 0;
};

/** いれかえの案内（まだ出していなければ1回だけ）。 */
export const benchHint = async (s: Story): Promise<void> => {
	if (s.flag("bench_hint")) return;
	s.set("bench_hint");
	// メニューの「なかま」→「いれかえ」で／たたかう　なかまを　えらべる。
	await s.narrate(BENCH_HINT);
};

/** レス数を変える。 */
export const setRes = (s: Story, n: number): void => {
	s.set("res", n);
};

/**
 * おでかけ（デート）の段取り：隊列を隠して行き先へ移り、scene を流して、元の場所へ帰る。
 * 行き先のマップではフラグ date_now に相手の ID が入っているので、
 * 相手の立ち姿はそのマップのイベントに when: (st) => st.flags.date_now === "roze" のように書く。
 */
export const dateTrip = async (
	s: Story,
	who: string,
	to: { map: string; x: number; y: number; dir?: Dir },
	scene: (s: Story) => Promise<void>,
): Promise<void> => {
	const back = {
		map: s.state.mapId,
		x: s.state.x,
		y: s.state.y,
		dir: s.state.dir,
	};
	s.set("date_now", who);
	s.followers(false);
	try {
		await s.warp(to.map, to.x, to.y, to.dir);
		await scene(s);
	} finally {
		s.set("date_now", false);
		await s.warp(back.map, back.x, back.y, back.dir);
		s.followers(true);
	}
};
