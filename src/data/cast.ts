// 登場人物。歩行グラは RPGEN 形式（16x16・2コマ×4方向）。
// 立ち絵（portrait.src）は public/portraits/ に透過 PNG を置けば表示される。無ければダミー表示。
// 立ち絵は右向きで描けば、右側に立つときは自動で左右反転する（ui/message.ts）。
// battle は [Lv1 の値, 1レベルごとの伸び]。
// うた（技）は battle.skills の lv で覚える。加入したときは、そのレベル以下を覚えている。
// ライバル戦で見せたうたは、加入したときから覚えている（lv 1）。

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
		battle: {
			hp: [38, 7.5],
			mp: [0, 0],
			atk: [11, 2.6],
			def: [7, 1.5],
			spd: [7, 1.1],
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
		battle: {
			hp: [30, 6],
			mp: [18, 3.5],
			atk: [8, 2],
			def: [5, 1.2],
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
		portrait: { src: "portraits/feris.png", side: "right" },
		// UTAU の声が無いので こえ は 0 固定（うたえない）。持ち技は通常攻撃の演出で出す
		// うたが無いぶん、こうげき・HP の伸びを大きくしてある（テトの代わりに入っても見劣りしない）
		battle: {
			hp: [32, 7.5],
			mp: [0, 0],
			atk: [11, 3.2],
			def: [5, 1.5],
			spd: [12, 1.7],
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
		// うたがあるぶん、伸びはフェリスより小さめ（終章は3人。テトを入れても入れなくても同じぐらいの手ごたえ）
		battle: {
			hp: [40, 6.5],
			mp: [12, 2.5],
			atk: [11, 2.2],
			def: [7, 1.3],
			spd: [7, 1.1],
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
};
