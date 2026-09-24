// 登場人物。歩行グラは RPGEN 形式（16x16・2コマ×4方向）。
// 立ち絵（portrait.src）は public/portraits/ に透過 PNG を置けば表示される。無ければダミー表示。
// 立ち絵は右向きで描けば、右側に立つときは自動で左右反転する（ui/message.ts）。
// battle は [Lv1 の値, 1レベルごとの伸び]。
// うた（技）は battle.skills の lv で覚える。加入したときは、そのレベル以下を覚えている。
// ライバル戦で見せたうたは、加入したときから覚えている（lv 1）。
// 同じレベルなら 後から加入する仲間ほど強い（おんJ民 < ロゼ < フェリス < テト）。入れかえる価値が出るように。
// 目安（キリコ＋ふつうの戦士＋X で ボスに勝てる強さ。Lv8〜11）：おんJ民 1.0・ロゼ 1.2・フェリス 1.35・テト 1.8

import type { CharDef } from "../engine/defs";

const c = (d: CharDef) => d;

export const cast: Record<string, CharDef> = {
	kiriko: c({
		id: "kiriko",
		name: "キリコ",
		walk: "pub:sprites/kiriko.png",
		color: "#7be0a0",
		voice: { model: "uc" },
		portrait: { src: "portraits/kiriko.png", side: "left" },
		battle: {
			hp: [34, 7],
			mp: [14, 3],
			atk: [9, 2.2],
			def: [6, 1.4],
			spd: [8, 1.3],
			skills: [
				{ id: "wakasagi", lv: 2 }, // 序章のおわり（チュートリアル戦の勝利で かならず Lv2）
				{ id: "shicho", lv: 4 }, // 第一章（番長のころ）
				{ id: "replay", lv: 5 }, // 番長に勝ったころ〜第二章（過去ログ倉庫。「リプレイ」）
			],
		},
	}),
	nanj: c({
		id: "nanj",
		name: "おんJ民",
		walk: "sa:29aYeF", // 彡(●)(●)
		color: "#f5d142",
		// UTAU の声が無いので こえ は 0 固定（うたえない）。持ち技は通常攻撃の演出で出す
		// 早熟：はじめから強く、伸びは小さい（ロゼ加入前の2人旅を支える。Lv8 からは いちばん下）
		battle: {
			hp: [54, 4.8],
			mp: [0, 0],
			atk: [16, 1.6],
			def: [10.5, 1.0],
			spd: [9, 0.8],
			skills: [],
			attackTexts: [
				"{user}の　フルスイング！「いけー！」",
				"{user}「草ァ！」　だいそうげんで　なぐりかかった！",
				"{user}の　こうげき！",
				"{user}「kskst！」　いきおいで　つっこんだ！",
			],
		},
	}),
	roze: c({
		id: "roze",
		name: "ロゼ",
		walk: "sa:mHhx69",
		color: "#ff6f91",
		voice: { model: "roze" },
		portrait: { src: "portraits/roze.png", side: "right" },
		// 回復とまほうの係。オートでも倒れにくいよう HP・まもりを少し厚めに
		battle: {
			hp: [32, 7],
			mp: [18, 3.5],
			atk: [8, 2],
			def: [6, 1.4],
			spd: [9, 1.4],
			skills: [
				{ id: "mabo", lv: 1 }, // ライバル戦で見せたうた
				{ id: "neutrino", lv: 1 },
				{ id: "floral", lv: 4 }, // 第一章（番長のころ）
				{ id: "aruanai", lv: 8 }, // 第三章（スタジアムの応援）
			],
		},
	}),
	feris: c({
		id: "feris",
		name: "フェリス",
		walk: "sa:4KtOzD",
		color: "#ffd166",
		// 頭の大きい（2頭身寄りの）絵なので、全身の高さでそろえると頭だけ2割ほど大きく見える。
		// 少し小さくして、頭の大きさをほかの子に寄せる（絵を描き直したら 1 に戻して見直す）
		portrait: { src: "portraits/feris.png", side: "right", scale: 0.9 },
		// UTAU の声が無いので こえ は 0 固定（うたえない）。持ち技は通常攻撃の演出で出す
		// うたが無いぶん、こうげき・すばやさが いちばん高い（まもりは いちばん低い）。ロゼより少し強い
		battle: {
			hp: [34, 7.5],
			mp: [0, 0],
			atk: [12, 4.5],
			def: [5, 1.4],
			spd: [12, 2],
			skills: [],
			attackTexts: [
				"{user}「ふぇ……ふぇ……フェニックス！」　ほのおの　くしゃみ！",
				"{user}の　タンクトップの「炎」が　もえあがった！",
				"{user}の　こうげき！",
				"{user}「追いつかれないよ〜」　ひらりと　ひとつき！",
			],
		},
	}),
	teto: c({
		id: "teto",
		name: "テト",
		walk: "sa:3xUW5Y",
		color: "#e2455b",
		voice: { model: "teto" },
		portrait: { src: "portraits/teto.png", side: "right" },
		// 最後に加入するぶん いちばん強い（HP・まもりが高く、うたも強い）。
		// 終章はテトを入れると「ふつう」、入れない3人（キリコ・ロゼ・フェリス）だと「むずかしい」
		battle: {
			hp: [44, 8.5],
			mp: [14, 3],
			atk: [12, 3],
			def: [8, 1.8],
			spd: [8, 1.4],
			skills: [
				{ id: "baguette", lv: 1 }, // ライバル戦で見せたうた
				{ id: "drill", lv: 1 },
				{ id: "bakadana", lv: 10 }, // 終章（サーバーの底。控えのままだと覚えない）
			],
		},
	}),
	rei: c({
		id: "rei",
		name: "レイ",
		walk: "sa:TI21YC", // 没キャラ（橙の短髪＋サイドテール）
		color: "#ff8a3d",
		voice: { model: "rei" },
		portrait: { src: "portraits/rei.png", side: "right" },
	}),
	// 終章のボス。声と立ち絵はキリコのまま。右に立つので立ち絵は反転し、左のキリコと鏡合わせになる
	botsu: c({
		id: "botsu",
		name: "ボツキリコ",
		walk: "pub:sprites/kiriko_botsu.png",
		color: "#a0a0a0",
		voice: { model: "uc" },
		portrait: { src: "portraits/kiriko.png", side: "right" },
	}),
};
