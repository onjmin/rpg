// 効果音。RPGEN の mp3（rpgen-search の CDN を id で直リンク）。
// 多くは unj-reze の DQ プリセット（components/game-presets/dq.ts）と同じ素材。
// 括弧内は RPGEN 上の素材名。

export const sfx: Record<string, string> = {
	cursor: "rpgen:GklUsK", // ﾄﾞﾗｸｴｶｰｿﾙ
	decide: "rpgen:GklUsK", // ﾄﾞﾗｸｴｶｰｿﾙ
	cancel: "rpgen:uZc2MS", // キャンセル
	door: "rpgen:8gPREU", // ﾄﾞﾗｸｴ扉
	warp: "rpgen:vfCmoe",
	stairs: "rpgen:gO9HUJ", // 階段
	encounter: "rpgen:qm03Mw", // [ﾄﾞﾗｸｴ6]エンカウント
	attackStart: "rpgen:n0fqek", // ﾄﾞﾗｸｴ攻撃時
	attack: "rpgen:7JKd21", // ﾄﾞﾗｸｴ攻撃
	critical: "rpgen:3xdWAT", // [ﾄﾞﾗｸｴ3]会心の一撃
	enemyAttack: "rpgen:Ln5pje", // [ﾄﾞﾗｸｴ]敵攻撃時
	damage: "rpgen:bC3ZP1", // [ﾄﾞﾗｸｴ]敵攻撃（被弾）
	miss: "rpgen:AeNs0l", // ﾄﾞﾗｸｴﾐｽ
	spell: "rpgen:wGCfnC", // ﾄﾞﾗｸｴ呪文
	heal: "rpgen:n0UqyV", // ﾄﾞﾗｸｴ5回復
	/** 敵をたおした（全滅音ではない）。 */
	enemyDown: "rpgen:DApPoE", // 撃破音
	/** 味方が全滅した。 */
	wipeout: "rpgen:rEaCCP", // [ﾄﾞﾗｸｴ]全滅
	flee: "rpgen:FTCG4H", // 逃走
	victory: "rpgen:tSHy6V", // ﾄﾞﾗｸｴ戦闘終了
	levelup: "rpgen:JrcaUb", // ﾄﾞﾗｸｴﾚﾍﾞﾙｱｯﾌﾟ
	item: "rpgen:gbcHf7", // ﾄﾞﾗｸｴ宝箱
	inn: "rpgen:L5Npni", // ﾄﾞﾗｸｴ宿屋
	save: "rpgen:jVOw87", // [自然癒]セーブ
	chapter: "rpgen:oFwlq5",
	fire: "rpgen:HyTVhK",
	explosion: "rpgen:HydVaH",
	shock: "rpgen:usF2l8",
};
