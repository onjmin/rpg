// 効果音。RPGEN の mp3（rpgen-search の CDN を id で直リンク）。
// 多くは unj-reze の DQ プリセット（components/game-presets/dq.ts）と同じ素材。
// 括弧内は RPGEN 上の素材名。
// 区分ごとに大きさの目標がある（data/loudness.ts）。足したり替えたりしたら pnpm loudness で測り直す
// （測るまでは、既定の音量で 0.3 倍のまま鳴る）。

import type { SeKind } from "./loudness";

const byKind: Record<SeKind, Record<string, string>> = {
	/** メニューの操作音。何度も鳴るので控えめ。 */
	ui: {
		cursor: "rpgen:GklUsK", // ﾄﾞﾗｸｴｶｰｿﾙ
		decide: "rpgen:GklUsK", // ﾄﾞﾗｸｴｶｰｿﾙ
		cancel: "rpgen:uZc2MS", // キャンセル
	},
	/** 移動・宝箱・回復。 */
	field: {
		door: "rpgen:8gPREU", // ﾄﾞﾗｸｴ扉
		warp: "rpgen:vfCmoe",
		stairs: "rpgen:gO9HUJ", // 階段
		item: "rpgen:gbcHf7", // ﾄﾞﾗｸｴ宝箱
		heal: "rpgen:n0UqyV", // ﾄﾞﾗｸｴ5回復
	},
	/** 戦闘の音（イベントの炎・電撃も）。 */
	battle: {
		encounter: "rpgen:qm03Mw", // [ﾄﾞﾗｸｴ6]エンカウント
		attackStart: "rpgen:n0fqek", // ﾄﾞﾗｸｴ攻撃時
		attack: "rpgen:7JKd21", // ﾄﾞﾗｸｴ攻撃
		enemyAttack: "rpgen:Ln5pje", // [ﾄﾞﾗｸｴ]敵攻撃時
		damage: "rpgen:bC3ZP1", // [ﾄﾞﾗｸｴ]敵攻撃（被弾）
		miss: "rpgen:AeNs0l", // ﾄﾞﾗｸｴﾐｽ
		spell: "rpgen:wGCfnC", // ﾄﾞﾗｸｴ呪文
		/** 敵をたおした（全滅音ではない）。 */
		enemyDown: "rpgen:DApPoE", // 撃破音
		flee: "rpgen:FTCG4H", // 逃走
		fire: "rpgen:HyTVhK",
		shock: "rpgen:usF2l8",
	},
	/** いちばん目立たせる音。 */
	impact: {
		critical: "rpgen:3xdWAT", // [ﾄﾞﾗｸｴ3]会心の一撃
		explosion: "rpgen:HydVaH",
	},
	/** 短い曲（ファンファーレ）。 */
	jingle: {
		victory: "rpgen:tSHy6V", // ﾄﾞﾗｸｴ戦闘終了
		levelup: "rpgen:JrcaUb", // ﾄﾞﾗｸｴﾚﾍﾞﾙｱｯﾌﾟ
		/** 味方が全滅した。 */
		wipeout: "rpgen:rEaCCP", // [ﾄﾞﾗｸｴ]全滅
		inn: "rpgen:L5Npni", // ﾄﾞﾗｸｴ宿屋
		save: "rpgen:jVOw87", // [自然癒]セーブ
		/** 章の切り替わり（システム音らしいチャイム。前の素材は「エンディング」と喋る声だった）。 */
		chapter: "rpgen:thHyyN", // [ツクール]チャイム2
	},
};

export const sfx: Record<string, string> = Object.fromEntries(
	Object.values(byKind).flatMap((g) => Object.entries(g)),
);

/** 効果音の区分（pnpm loudness が目標を引くのに使う）。 */
export const sfxKind: Record<string, SeKind> = Object.fromEntries(
	Object.entries(byKind).flatMap(([kind, g]) =>
		Object.keys(g).map((name) => [name, kind as SeKind]),
	),
);
