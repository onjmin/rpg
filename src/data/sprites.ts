// 歩行グラ・置物の名前 → 素材参照。マップや戦闘データはこの名前で参照する。
// `sa:<id>` … RPGEN 歩行グラ（rpgen-search）、`pub:` … public/ 配下、`sp:<id>` … RPGEN 単体スプライト。

import { PROPS } from "./tiles";

export const SPR = {
	// ── 置物 ──
	/** 蓄音機（セーブ・回復・いまの目的）。public/sprites/phono.png は scripts/make-sprites.mjs で作る。 */
	phono: "pub:sprites/phono.png#0,0,16,16",
	/** マイクスタンド */
	mic: "sp:RV4seB",
	/** パンかご（回復） */
	basket: PROPS.barrel,
	/** レコード */
	record: "sp:3dANW5P",

	// ── 新しく描いた歩行グラ（scripts/make-sprites.mjs） ──
	/** ムッジェ ΣΩΩ>（赤い毛むくじゃら） */
	mujje: "pub:sprites/mujje.png",
	/** ボツキリコ（再安価で流された最初のキリコ。灰色の角刈り） */
	botsu: "pub:sprites/kiriko_botsu.png",
	/** メタルンゴ（隠し狩場のレア敵。銀色の しずく） */
	metalngo: "pub:sprites/metalngo.png",
	// おんJマイナーズ（おんJwiki の「一軍・二軍」まわりの顔文字キャラ）
	/** にぃちぇ ξ◉ω◉)ξ（日曜日の子） */
	nichie: "pub:sprites/minors_nichie.png",
	/** おんすちゃん（おんS のお嬢さま。縦ロール） */
	onsu: "pub:sprites/minors_onsu.png",
	/** ンゴ姉 ﾝ´ヮ｀ｺﾞ（やきうのお姉ちゃん） */
	ngoane: "pub:sprites/minors_ngoane.png",
	/** パン松 |｀°Ο°´|（パン板の食パン） */
	panmatsu: "pub:sprites/minors_panmatsu.png",
	/** ヤヤポジ (*^△^*)（ひかえめなポジハメ） */
	yayapoji: "pub:sprites/minors_yayapoji.png",
	/** おんちゃん (o'ω'n)（一軍。rpgen no.1212「おんちゃん」の歩行シート） */
	onchan: "sa:oLrlUq",
	/** ポジハメ (*^◯^*)（ヤヤポジの もと。rpgen no.1040「ポジハメ2」。顔の はっきりした方） */
	posihame: "sa:bC3ZP1",

	// ── おんJ民・マッマ ──
	j_yakiu: "sa:4rSOzo", // 野球民
	j_gakuran: "sa:XvdbmA", // 野球民（学生服）
	j_tights: "sa:8DXRgk", // 黒タイツJ民
	j_hikoki: "sa:29aYeF", // 彡(●)(●)
	j_white: "sa:xjuotB", // 彡(⭕)(⭕)
	j_black: "sa:VaBXqn", // J min Black
	j_sen: "sa:P9PNOA", // 戦J民
	j_shinkan: "sa:83nRXJ", // 神官J民
	j_zon: "sa:LV9pUy", // ゾンJ民
	j_hakkyo: "sa:UT7LXB", // 発狂J民
	j_sekimen: "sa:qPN3cT", // 赤面J民
	j_kasa: "sa:f6k97v", // 笠J民
	j_nanashi: "sa:lcBiHO", // 風吹けば名無し
	j_cyclo: "sa:DUfPo9", // サイクロJ民
	j_yosuko: "sa:C2hS8U", // 陽すこ民
	mamma: "sa:rzXCtC", // J( ´ー`)し マッマ
	senju: "sa:PLsNO9", // ( ‘ｊ’ ) 先住民（rpgen no.937「あ！今日土曜日ど！」。no.944 の sa:HJDVki は上向きにも顔があるので使わない）
	puyu: "sa:DszPWT", // ぷゆゆ🥺（rpgen「PIEN」の歩行シート。sp:4IFEOzI は由来の都合で使わない）

	// ── 住民（同梱の RPGEN DQ 風キャラ） ──
	townsfolk: "pub:assets/rpgen/char/14-man-a.png", // 原住民の代わり（先住民は senju）
	elder: "pub:assets/rpgen/char/03-elderly-a.png",
	shopkeeper: "pub:assets/rpgen/char/02-merchant.png",
	child: "pub:assets/rpgen/char/04-child.png",
	woman: "pub:assets/rpgen/char/09-woman-a.png",
	hinary: "pub:assets/rpgen/char/10-elderly-c.png", // 白衣っぽい研究者の代わり
	cat: "sa:q103Qa", // 虎猫

	// ── 敵 ──
	e_tv: "sa:5T0QR7", // エラーテレビ
	e_pc: "sa:8WBRbo", // PCのパフォーマンスが低下しています！
	e_sand: "sa:NFxzuZ", // 砂荒らし
	e_mystery: "sa:R7Ve5N", // ミステリーデータ
	e_unknown: "sa:OvRJbE", // 識別不能個体
	e_idiot: "sa:9eoFuV", // You are an idiot!（精神汚染の代わり。精神汚染は正面がキャラ物に見えるので使わない）
	e_bot: "sa:gmLHHM", // クソアホロボット
	e_silent: "sa:EerhmX", // 無言兵士（「…」の吹きだし）
	e_shin1: "sa:YkoESZ", // 侵蝕レベル1
	e_shin2: "sa:xhaoYC", // 侵蝕レベル2
	e_shin3: "sa:JiWaz3", // 侵蝕レベル3
	e_shinmax: "sa:kXfKfE", // 侵蝕レベル最大
	e_bat: "sa:Z7zM7m", // バット

	// ── 管理人室（クリア後のおまけ。実在の人物をもとにした非公式のファン描写） ──
	/** 矢野さとる（おんJ管理人）。似顔ではない汎用の人物グラ（rpgen no.751「白の民(眼鏡)」） */
	satoru: "sa:JDYaGN",
	/** ひろゆき（元2ch管理人）。rpgen no.1932 の歩行シート（no.1902 の sa:qhy37c は使わない） */
	hiro: "sa:sx28Sp",
} as const;
