// 戦闘データ：うた（技）・敵・敵の組み合わせ・道具（設計書 §7）。
// 敵はすべて掲示板・おんJ由来（ドラクエ系の敵は出さない）。

import type { EnemyDef, EnemyGroup, ItemDef, SkillDef } from "../engine/defs";
import { cast } from "./cast";
import { SPR } from "./sprites";

const sk = (d: SkillDef) => d;

export const skills: Record<string, SkillDef> = {
	// キリコ
	wakasagi: sk({
		id: "wakasagi",
		name: "ワカサギつり",
		kind: "attack",
		target: "enemy",
		power: 1.8,
		mp: 3,
		text: "{user}の　ワカサギつり！　{target}を　つりあげた！",
		se: "attack",
		// 糸がのびて つりあげる
		fx: { kind: "slash", color: "#8fd8ff" },
	}),
	shicho: sk({
		id: "shicho",
		name: "シチョウ",
		kind: "attack",
		target: "enemies",
		power: 1.0,
		mp: 5,
		text: "{user}は　碁石を　ならべた！　シチョウで　にげみちを　ふさぐ！",
		// 碁石が降ってきて にげみちを ふさぐ
		fx: { kind: "rain", color: "#f4f1ff", mark: "●" },
	}),
	replay: sk({
		id: "replay",
		name: "ちくおんリプレイ",
		kind: "heal",
		target: "allies",
		power: 1.5,
		mp: 8,
		text: "{user}は　蓄音機を　まわした！　ためた「がんばれ」が　ひびく！",
		se: "heal",
		// 蓄音機の 音の波が ひろがる
		fx: { kind: "ring", color: "#ffcf4a" },
	}),
	// やきう・フェリスは UTAU の声が無いので「うたう」を持たない（cast.ts の attackTexts で演出）
	// ロゼ
	floral: sk({
		id: "floral",
		name: "フローラル・ヒール",
		kind: "heal",
		target: "ally",
		power: 2.0,
		mp: 4,
		text: "{user}は　フローラルな　かおりで　{target}を　いやしたアル",
		se: "heal",
		fx: { kind: "ring", color: "#ff9ecb" },
	}),
	mabo: sk({
		id: "mabo",
		name: "げきからマーボー",
		kind: "attack",
		target: "enemy",
		power: 1.7,
		mp: 4,
		text: "{user}は　あつあつの　マーボーを　{target}に　ふるまったアル！",
		se: "fire",
		fx: { kind: "burst", color: "#ff6a3d" },
	}),
	neutrino: sk({
		id: "neutrino",
		name: "ニュートリノ・シャワー",
		kind: "attack",
		target: "enemies",
		power: 0.9, // すりぬけるので こうげきより少し弱い全体攻撃
		mp: 5,
		text: "{user}「素粒子は　すりぬけるアル！」……たまに　あたった！",
		fx: { kind: "rain", color: "#9ad8ff", mark: "・" },
	}),
	aruanai: sk({
		id: "aruanai",
		name: "アル？ナイ！",
		kind: "buff",
		target: "allies",
		power: 0,
		mp: 5,
		text: "{user}「やる気は　アル？」　みんな「アル！」",
		fx: { kind: "aura", color: "#ffcf4a" },
	}),
	// テト（最後に加入する いちばん強い仲間。うたも ロゼより強い）
	baguette: sk({
		id: "baguette",
		name: "フランスパン・スマッシュ",
		kind: "attack",
		target: "enemy",
		power: 1.9,
		mp: 4,
		text: "{user}の　フランスパンが　{target}を　とらえた！",
		se: "attack",
		fx: { kind: "slash", color: "#ffd591" },
	}),
	drill: sk({
		id: "drill",
		name: "テト第二形態",
		kind: "attack",
		target: "enemies",
		power: 1.3,
		mp: 7,
		text: "{user}の　ツインテールが　回転を　はじめた！",
		fx: { kind: "spin", color: "#ff5d6c" },
	}),
	bakadana: sk({
		id: "bakadana",
		name: "君はじつに馬鹿だな",
		kind: "buff",
		target: "allies",
		power: 0,
		mp: 5,
		text: "{user}「君は　じつに　馬鹿だな。……ほら、いくよ」",
		fx: { kind: "aura", color: "#6fb7ff" },
	}),
};

type Act = NonNullable<EnemyDef["acts"]>[number];
const a = (
	weight: number,
	power: number,
	text: string,
	target: "one" | "all" = "one",
): Act => ({
	weight,
	name: text,
	power,
	target,
	text,
});
const en = (d: EnemyDef) => d;

export const enemies: Record<string, EnemyDef> = {
	// 雑魚の目安（ふつうに進めた人・オート。pnpm balance）：2〜3 ターン、HP が2割ほどへる（満タンから 5〜7 戦で全滅するので、
	// 3〜4 戦ごとに蓄音機へもどる）。敵は 2〜3 体（街道は 1〜2 体）で、
	// 仲間より少しおそい〜同じぐらいの素早さ（先に動く敵がいる）。何もしない行動は 1〜3 割。
	// 経験値は 1 レベルに 5〜7 戦（段階2 から）。寄り道だけで ボスの目安を追いこさないように（少し稼ぐと楽になる）。
	// ── 段階1（序章・スレ街道／Lv2〜4） ──
	// 同じ組み合わせを ロゼ加入前の2人（Lv2）と 3人（Lv3〜4）が戦うので、敵は2体まで・全体攻撃を多めにして
	// 人数の差を小さくした。2人は 3 ターン・HP 3割、3人は 2 ターン・HP 1割半、番長の前（Lv4）は 2 ターン・HP 1割。
	// 敵を速くして、3人でも先に動かれるようにした
	kskbot: en({
		id: "kskbot",
		name: "kskボット",
		sprite: SPR.e_tv,
		hp: 25,
		atk: 10,
		def: 2,
		spd: 13,
		exp: 5,
		acts: [
			a(3, 1.0, "{user}は　{target}に　kskstを　れんとうした！"),
			a(1, 0, "{user}は「加速」とだけ　かきこんだ。"),
		],
	}),
	arashi: en({
		id: "arashi",
		name: "荒らし",
		sprite: SPR.e_sand,
		hp: 50,
		atk: 18,
		def: 3,
		spd: 14,
		exp: 5,
		drop: { item: "candy", rate: 0.1 },
		acts: [
			a(4, 0.6, "{user}は　すなを　まきちらした！", "all"),
			a(1, 0, "{user}は「ｱﾗｼｱﾗｼ」と　つぶやいている。"),
		],
	}),
	copipe: en({
		id: "copipe",
		name: "コピペ荒らし",
		sprite: SPR.e_mystery,
		hp: 48,
		atk: 14,
		def: 4,
		spd: 13,
		exp: 5,
		// スレ8〜10 に貼りなおされた「生ジャケじゃけじゃけ」を持っている
		drop: { item: "namajake", rate: 0.15 },
		acts: [
			a(4, 0.6, "{user}は　おなじ文を　みんなに　はりつけた！", "all"),
			a(4, 1.0, "{user}の　コピペが　{target}に　ささる！"),
			a(1, 0, "{user}は　つぎの　コピペを　さがしている……"),
			a(1, 0, "{user}は　鮭の　歌詞を　はりつけた。"),
		],
	}),
	natsukids: en({
		id: "natsukids",
		name: "夏休みキッズ",
		sprite: SPR.j_sekimen,
		hp: 60,
		atk: 17,
		def: 4,
		spd: 18,
		exp: 6,
		scale: 1,
		acts: [
			a(4, 1.0, "{user}の「ﾌｧｰwww」こうげき！"),
			a(2, 1.2, "{user}の　ラジオ体操キック！"),
			a(1, 0, "{user}「しゅくだい？　あとで　やるわ」"),
		],
	}),

	// ── 隠し狩場（スレ街道の西のはし。maps/sukima.ts）のレア敵 ──
	// メタルスライムの枠。こうげきも うたも 0か1（かいしんは通る）、3割で にげる。HP 4。
	// けいけんちは Lv3〜4 なら 2レベルぶん・Lv10 なら 3分の1レベルぶん（寄り道の ごほうび）。
	metalngo: en({
		id: "metalngo",
		name: "メタルンゴ",
		sprite: SPR.metalngo,
		hp: 4,
		atk: 12,
		def: 99,
		spd: 40,
		exp: 150,
		metal: { flee: 0.3 },
		drop: { item: "hane", rate: 0.25 },
		acts: [
			a(2, 0.8, "{user}は　ぷるんと　体当たりした！"),
			a(3, 0, "{user}は　キラキラ　ひかっている……"),
		],
		downText: "{user}を　たおした！",
	}),

	// ── 段階2（過去ログ倉庫／Lv5〜6） ──
	zonj: en({
		id: "zonj",
		name: "ゾンJ民",
		sprite: SPR.j_zon,
		hp: 79,
		atk: 21,
		def: 8,
		spd: 8,
		exp: 5,
		drop: { item: "candy", rate: 0.2 },
		acts: [
			a(2, 1.1, "{user}「ほ……しゅ……」　{target}に　しがみついた！"),
			a(1, 0, "{user}は「保守」とだけ　かきこんだ。"),
		],
	}),
	mojibake: en({
		id: "mojibake",
		name: "文字化け",
		sprite: SPR.e_unknown,
		hp: 59,
		atk: 20,
		def: 10,
		spd: 12,
		exp: 4,
		drop: { item: "spray", rate: 0.15 },
		acts: [
			a(2, 0.7, "{user}は「縺ｧ縺ｯ縺ｭ」と　さけんだ！", "all"),
			a(2, 1.1, "{user}の　□□□□こうげき！"),
			a(1, 0, "{user}「繧ｭ繝ｪ繧ｳ……？」"),
		],
	}),
	kaso: en({
		id: "kaso",
		name: "過疎",
		sprite: SPR.e_shin1,
		hp: 53,
		atk: 18,
		def: 6,
		spd: 14,
		exp: 4,
		acts: [
			a(2, 0.6, "{user}の　しずけさが　みんなを　つつむ……", "all"),
			a(1, 1.0, "{user}は　{target}を　勢い欄の　下へ　ひっぱった！"),
			a(1, 0, "……だれも　かきこまない。"),
		],
	}),
	ninpo: en({
		id: "ninpo",
		name: "忍法帖エラー",
		sprite: SPR.e_pc,
		hp: 66,
		atk: 22,
		def: 9,
		spd: 11,
		exp: 5,
		acts: [
			a(2, 1.2, "「要lv3以上：現在lv1」　エラーが　{target}に　ささる！"),
			a(1, 0, "{user}「もうちょっと　忍法帖の　レベルを　上げてね」"),
		],
	}),

	// ── 段階3（スタジアム／Lv7〜8・シンボル敵） ──
	yaji: en({
		id: "yaji",
		name: "ヤジJ民",
		sprite: SPR.j_tights,
		hp: 66,
		atk: 26,
		def: 10,
		spd: 14,
		exp: 8,
		acts: [
			a(2, 0.6, "{user}の　ヤジ！「なにしとんねん！」", "all"),
			a(1, 1.1, "{user}は　メガホンで　{target}を　はたいた！"),
			a(1, 0, "{user}「ほな、また……」　かえりかけて　もどってきた。"),
		],
	}),
	makemood: en({
		id: "makemood",
		name: "負けムードJ民",
		sprite: SPR.j_hakkyo,
		hp: 73,
		atk: 30,
		def: 9,
		spd: 12,
		exp: 8,
		acts: [
			a(2, 1.15, "{user}は　負け試合に　たえきれず　{target}に　やつあたり！"),
			a(1, 0, "{user}「ファーｗｗｗ」"),
		],
	}),
	ouen: en({
		id: "ouen",
		name: "応援団J民",
		sprite: SPR.j_sen,
		hp: 70,
		atk: 26,
		def: 12,
		spd: 11,
		exp: 8,
		drop: { item: "pan", rate: 0.2 },
		acts: [
			a(2, 1.1, "{user}の　メガホン　こうげき！"),
			a(1, 0.6, "{user}「かっとばせー！」　大声が　ひびく！", "all"),
			a(1, 0, "{user}は　応援歌の　歌詞を　わすれた。"),
		],
	}),
	pitcher: en({
		id: "pitcher",
		name: "ピッチャー",
		sprite: SPR.j_yakiu,
		hp: 66,
		atk: 29,
		def: 11,
		spd: 15,
		exp: 9,
		scale: 1,
		acts: [
			a(2, 1.15, "{user}の　155キロの　ストレート！"),
			a(1, 1.0, "{user}の　けんせい球！"),
			a(1, 0, "{user}は　サインに　くびを　ふった。"),
		],
	}),

	// ── 段階4（サーバーの底／Lv9〜10） ──
	// テトを入れた3人で 2 ターン・HP 1割半、入れない3人（キリコ・ロゼ・フェリス）だと 3 ターン・HP 2割
	jien: en({
		id: "jien",
		name: "自演",
		sprite: SPR.j_nanashi,
		hp: 84,
		atk: 30,
		def: 12,
		spd: 16,
		exp: 7,
		acts: [
			a(3, 1.0, "{user}「せやな」　{target}に　レスが　ささる！"),
			a(1, 0, "{user}は　じぶんに「せやな」と　かえした。"),
		],
	}),
	err503: en({
		id: "err503",
		name: "503エラー",
		sprite: SPR.e_tv,
		hp: 114,
		atk: 31,
		def: 16,
		spd: 13,
		exp: 11,
		drop: { item: "spray", rate: 0.2 },
		acts: [
			a(2, 1.1, "{user}の「ただいま　こみあっています」！"),
			a(1, 0.7, "{user}は　サーバーを　おもくした！", "all"),
			a(1, 0, "{user}は　くるくる　まわっている……"),
		],
	}),
	popup: en({
		id: "popup",
		name: "ニセ警告",
		sprite: SPR.e_pc,
		hp: 96,
		atk: 32,
		def: 12,
		spd: 17,
		exp: 10,
		acts: [
			a(2, 1.1, "{user}の　ポップアップが　{target}の　目の前に　ひらいた！"),
			a(1, 0, "{user}「いますぐ　クリック！」　だれも　クリックしなかった。"),
		],
	}),
	resuba: en({
		id: "resuba",
		name: "レスバトラー",
		sprite: SPR.e_idiot,
		hp: 120,
		atk: 31,
		def: 14,
		spd: 14,
		exp: 11,
		acts: [
			a(2, 1.1, "{user}の「ソースは？」が　{target}に　ささる！"),
			a(1, 0.8, "{user}は　ながい　レスバを　しかけた！", "all"),
			a(1, 0, "{user}「!レスバ判定」……ひきわけだった。"),
		],
	}),
	matome: en({
		id: "matome",
		name: "まとめキッズ",
		sprite: SPR.j_hikoki,
		hp: 102,
		atk: 31,
		def: 13,
		spd: 16,
		exp: 10,
		drop: { item: "mabo", rate: 0.15 },
		acts: [
			a(2, 1.1, "{user}は　{target}の　レスを　かってに　ならべかえた！"),
			a(1, 0, "{user}「これ、まとめても　ええか？」……へんじは　ない。"),
		],
	}),
	shinshoku: en({
		id: "shinshoku",
		name: "バルス侵蝕",
		sprite: SPR.e_shin2,
		hp: 126,
		atk: 32,
		def: 16,
		spd: 15,
		exp: 12,
		acts: [
			a(2, 1.1, "{user}は　{target}の　まわりを　くろく　ぬりつぶした！"),
			a(1, 0, "{user}は「!バルス」と　つぶやいた……が、なにも　おきない。"),
		],
	}),
	barusan: en({
		id: "barusan",
		name: "バルサン",
		sprite: SPR.e_sand,
		hp: 108,
		atk: 31,
		def: 15,
		spd: 12,
		exp: 11,
		acts: [
			a(2, 0.8, "{user}が　たかれた！　けむりが　しみる！", "all"),
			a(1, 0, "{user}「忍法帖Lv1は　おことわりやで〜」"),
		],
	}),

	// ── 仲間との「初手は敵対」戦（設計 rival-joins.md）。見た目は仲間の歩行グラの正面 ──
	// 序章: キリコ Lv1 ひとりで。うたは まだ ない（こうげきだけ）。オートで 5 ターン前後
	rival_nanj: en({
		id: "rival_nanj",
		name: "やきう",
		sprite: cast.nanj.walk,
		hp: 18,
		atk: 8,
		def: 4,
		spd: 7,
		exp: 6,
		acts: [
			a(2, 1.0, "{user}の　レスバ！「{target}、ソースは？」"),
			a(1, 0.8, "{user}「草」　{target}の　まわりに　草が　はえた！"),
			a(1, 0, "{user}「どうせ　すぐ　落ちるやろ」"),
		],
	}),
	hiyakashi: en({
		id: "hiyakashi",
		name: "冷やかしJ民",
		sprite: SPR.j_white,
		scale: 1,
		hp: 10,
		atk: 6,
		def: 2,
		spd: 6,
		exp: 3,
		acts: [
			a(1, 1.0, "{user}は　{target}に「ｗｗｗ」を　なげつけた！"),
			a(1, 0, "{user}「ほーん、で？」"),
		],
	}),
	// 第一章: キリコ＋やきう Lv2（キリコのうたは ワカサギつりだけ）。4 ターン前後
	rival_roze: en({
		id: "rival_roze",
		name: "ロゼ",
		sprite: cast.roze.walk,
		hp: 125,
		atk: 16,
		def: 6,
		spd: 9,
		exp: 24,
		acts: [
			a(
				3,
				1.3,
				"{user}の　げきからマーボー！　{target}の　口から　火が　でた！",
			),
			a(
				2,
				0.7,
				"{user}「素粒子は　すりぬけるアル！」　ニュートリノ・シャワー！",
				"all",
			),
			a(1, 0, "{user}の　カツラが　ずれた。「……見なかったことに　するアル」"),
			a(1, 0, "{user}「本物の　声か、聞かせるアル」"),
		],
	}),
	// 第二章 B2: ムッジェといっしょに。キリコ／やきう／ロゼ Lv6 前後。フェリスのはねは フェリスが落とす
	rival_feris: en({
		id: "rival_feris",
		name: "フェリス",
		sprite: cast.feris.walk,
		hp: 95,
		atk: 21,
		def: 10,
		spd: 20,
		exp: 25,
		drop: { item: "hane", rate: 1 },
		acts: [
			a(
				2,
				0.8,
				"{user}「ふぇ……ふぇ……フェニックス！」　ほのおの　くしゃみ！",
				"all",
			),
			a(2, 1.3, "{user}の　タンクトップの「炎」が　{target}を　こがした！"),
			a(1, 0, "{user}「ムッジェは　私が　まもるよ〜」"),
		],
	}),
	// 第四章: キリコ／ロゼ／フェリス Lv8〜9。声がもどった直後の「ためし」。
	// 負けても進むが勝たないと経験値が無いので、オートで 9 割ほど勝てる強さ（6 ターン前後）
	rival_teto: en({
		id: "rival_teto",
		name: "テト",
		sprite: cast.teto.walk,
		hp: 420,
		atk: 48,
		def: 16,
		spd: 15,
		exp: 40,
		acts: [
			a(6, 1.4, "{user}の　フランスパン・スマッシュ！　{target}に　ヒット！"),
			a(4, 0.8, "{user}の　テト第二形態！　ツインテールが　うなる！", "all"),
			a(1, 0, "{user}「君は　じつに　馬鹿だな。……ほら、もっと　こい」"),
			a(1, 0, "{user}は　フランスパンを　ひとくち　かじった。"),
		],
	}),

	// ── ボス・イベント戦 ──
	// ボスの目安（オート・道具なし。pnpm balance）：目安のレベルで勝率 4〜6 割、1つ上げると 7〜9 割。
	// 寄り道だけで来ると五分五分なので、少しレベルを上げてから挑む（B1〜B3 は 3回負けたら通してもらえる）。
	// F1・F2 はテトを入れた3人の数字。入れない3人（キリコ・ロゼ・フェリス）だと 2〜3 割（1つ上で 5 割）。
	// B1〜B3 の経験値の合計は freedom.ts の BOSS_EXP と同じにする（負けて通してもらったときと そろえる）。
	// B1: キリコ／やきう／ロゼ Lv4 前後で 9 ターン前後。52＋キッズ 6 ＝ 58
	natsuboss: en({
		id: "natsuboss",
		name: "夏休みキッズ番長",
		sprite: SPR.j_kasa,
		scale: 1.5,
		hp: 360,
		atk: 27,
		def: 5,
		spd: 10,
		exp: 52,
		drop: { item: "mabo", rate: 1 },
		acts: [
			a(6, 1.2, "{user}の　虫とりあみ　アタック！　{target}に　ヒット！"),
			a(4, 0.7, "{user}は「ｗｗｗｗｗ」を　れんとうした！", "all"),
			a(1, 0, "{user}「……しゅくだい　おわってへん」　すこし　あせっている。"),
		],
	}),
	// B2 はフェリス（rival_feris）といっしょに出る（Lv6 の3人で 8 ターン前後）。70＋フェリス 25 ＝ 95。はねは rival_feris が落とす
	mujje: en({
		id: "mujje",
		name: "ムッジェ",
		sprite: SPR.mujje,
		scale: 1.5,
		hp: 280,
		atk: 40,
		def: 10,
		spd: 11,
		exp: 70,
		acts: [
			a(3, 1.3, "{user}「ホゲェ！」　{target}に　けむくじゃらの　たいあたり！"),
			a(2, 0.8, "{user}は　板の　バナーから　とびだして　あばれた！", "all"),
			a(1, 0, "{user}「ホゲェ……」　さびしそうに　ないている。"),
		],
	}),
	// B3: キリコ／ロゼ／フェリス Lv7〜8 で 7〜8 ターン。やきうを入れもどすと少し（ロゼの代わり）〜
	// かなり（フェリスの代わり）むずかしくなる。113＋ピッチャー 9 ＝ 122
	kantoku: en({
		id: "kantoku",
		name: "テノヒラ監督",
		sprite: SPR.j_black,
		scale: 1.5,
		hp: 360,
		atk: 53,
		def: 14,
		spd: 12,
		exp: 113,
		acts: [
			a(4, 1.3, "{user}の　テノヒラクルー！「{target}、やっぱ　アカンわ」"),
			a(4, 0.8, "{user}の　手首モーターが　うなりを　あげた！", "all"),
			a(1, 0, "{user}「……やっぱ　神やわ」　てのひらを　かえした。"),
		],
	}),
	balus_ev: en({
		id: "balus_ev",
		name: "サイレントバルス",
		sprite: SPR.e_shinmax,
		scale: 2,
		hp: 9999,
		atk: 90,
		def: 99,
		spd: 40,
		exp: 0,
		acts: [
			a(
				1,
				3.0,
				"{user}「――――」　音のない　!バルスが　スレを　つつんだ！",
				"all",
			),
		],
	}),
	// F1: 3人 Lv9〜10 で テト入り 7 ターン前後・テトなし 8〜9 ターン。1ターンに1回しか動けないので、
	// 守りを低く・攻めを高くし、何もしない行動を多めにした（レベルが1つ下でも勝ち目が残る）。
	// 経験値は F2 の前のレベルの差を縮める分
	balus: en({
		id: "balus",
		name: "サイレントバルス",
		sprite: SPR.e_shinmax,
		scale: 2,
		hp: 940,
		atk: 60,
		def: 6,
		spd: 14,
		exp: 200,
		acts: [
			a(2, 0.9, "{user}「――――」　音のない　!バルス！", "all"),
			a(2, 1.4, "{user}は　{target}に　アク禁の　ふだを　はりつけた！"),
			a(2, 0, "{user}は　勢い欄を　しずかに　みおろしている……"),
		],
	}),
	// F2: F1 のあと（3人 Lv10〜11）で テト入り 8〜10 ターン・テトなし 11 ターン前後
	botsu: en({
		id: "botsu",
		name: "ボツキリコ",
		sprite: SPR.botsu,
		scale: 2,
		hp: 1150,
		atk: 60,
		def: 8,
		spd: 13,
		exp: 0,
		acts: [
			a(2, 1.5, "{user}の　100トン・プレス！　{target}に　のしかかる！"),
			a(2, 0.9, "{user}の　角刈りスピン！", "all"),
			a(1, 0, "{user}「再安価や！」……しかし　なにも　かわらなかった。"),
			a(1, 0, "{user}は　111年ぶんの　ためいきを　ついた。"),
		],
	}),

	// ── 裏シナリオ「避難J」（終章の寄り道。data/maps/hinan.ts） ──
	// 中ボス：1000ゲッター。完走まぎわの スレに わいて 1000を 横取りする bot。ホームニキが 998で 止めていた もう一つの理由。
	// 終章の 3人（Lv9〜10）で 5〜6 ターン。すばやく、先に動く。守りは低め（寄り道なので 長びかせない）
	getter: en({
		id: "getter",
		name: "1000ゲッター",
		sprite: SPR.e_bot,
		scale: 1.5,
		hp: 600,
		atk: 60,
		def: 10,
		spd: 19,
		exp: 90,
		drop: { item: "spray", rate: 1 },
		acts: [
			a(3, 1.3, "{user}の　先どり！　{target}より　先に　かきこんだ！"),
			a(2, 0.8, "{user}「1000なら　ワイの　勝ち」　れんとう！", "all"),
			a(2, 0, "{user}は　リロードを　くりかえしている。"),
			a(1, 0, "{user}は　{target}の　999を　じっと　見ている……"),
		],
		downText: "{user}は　999で　止まった。",
	}),

	// ── 裏シナリオ「過疎板探検」の 板（data/kaso.ts）。帯は 本編の 同じ 時期の 雑魚に そろえる ──
	// ねこ板（第二章〜。Lv5〜6。倉庫の帯）
	nekobot: en({
		id: "nekobot",
		name: "画像bot",
		sprite: SPR.e_bot,
		hp: 58,
		atk: 19,
		def: 7,
		spd: 13,
		exp: 5,
		acts: [
			a(3, 1.1, "{user}は　{target}に　ぬこ.jpg を　はりつけた！"),
			a(1, 0.6, "{user}は　画像を　れんとうした！", "all"),
			a(1, 0, "{user}は　だれも　見ていない　画像を　はった。"),
		],
	}),
	nyan: en({
		id: "nyan",
		name: "にゃーん",
		sprite: SPR.cat,
		hp: 46,
		atk: 17,
		def: 5,
		spd: 16,
		exp: 4,
		acts: [
			a(3, 1.0, "{user}の　ねこパンチ！　{target}に　ヒット！"),
			a(2, 0, "{user}は　ひなたで　のびをした。"),
		],
		downText: "{user}は　どこかへ　走っていった。",
	}),
	// ねこ板の 中ボス（Lv5〜6 の 3人で 6〜7 ターン）。1000日 だれも 見ていない 画像を はりつづけた bot
	nekoboss: en({
		id: "nekoboss",
		name: "ぬこ画像bot",
		sprite: SPR.e_bot,
		scale: 1.5,
		hp: 360,
		atk: 41,
		def: 8,
		spd: 12,
		exp: 60,
		drop: { item: "candy", rate: 1 },
		acts: [
			a(4, 1.2, "{user}の　ぬこ.jpg（高画質）が　{target}に　ささる！"),
			a(3, 0.7, "{user}は　1000日ぶんの　画像を　いっきに　はった！", "all"),
			a(1, 0, "{user}「にゃーん」　……bot なのに。"),
		],
		downText: "{user}は　さいごの　1枚を　はって　止まった。",
	}),
	// あいさつ板（第二〜三章。Lv6〜7）
	teikei: en({
		id: "teikei",
		name: "定型文",
		sprite: SPR.e_pc,
		hp: 76,
		atk: 24,
		def: 9,
		spd: 12,
		exp: 7,
		acts: [
			a(3, 1.1, "{user}「こんにちは」　{target}に　ささった！"),
			a(
				1,
				0.7,
				"{user}「以後、お見知りおきを」　ていねいすぎて　いたい！",
				"all",
			),
			a(1, 0, "{user}は　おなじ　あいさつを　くりかえした。"),
		],
	}),
	tatenige: en({
		id: "tatenige",
		name: "立て逃げ",
		sprite: SPR.e_silent,
		hp: 60,
		atk: 22,
		def: 7,
		spd: 19,
		exp: 6,
		acts: [
			a(3, 1.2, "{user}は　スレを　立てて　{target}に　なげつけた！"),
			a(2, 0, "{user}は　あいさつだけして　帰ろうとしている……"),
		],
		downText: "{user}は　ぺこりと　おじぎして　消えた。",
	}),
	// あいさつ板の 中ボス（Lv6〜7 の 3人で 7 ターン前後）。1000日 返事の ない あいさつを 返しつづけた bot
	aisboss: en({
		id: "aisboss",
		name: "定型文bot",
		sprite: SPR.e_pc,
		scale: 1.5,
		hp: 380,
		atk: 48,
		def: 11,
		spd: 12,
		exp: 85,
		drop: { item: "spray", rate: 1 },
		acts: [
			a(4, 1.2, "{user}「こんにちは」　{target}に　ささる！"),
			a(3, 0.8, "{user}「以後、お見知りおきを」×1000！", "all"),
			a(1, 0, "{user}は　返事を　待っている……"),
		],
		downText: "{user}「……こちらこそ」　bot は　止まった。",
	}),
	// 保守板（第三章の あと。Lv8〜9。サーバーの帯）
	hoshubot: en({
		id: "hoshubot",
		name: "保守bot",
		sprite: SPR.e_bot,
		hp: 104,
		atk: 30,
		def: 13,
		spd: 12,
		exp: 10,
		acts: [
			a(3, 1.1, "{user}「保守」　{target}を　勢い欄の　上へ　おしあげた！"),
			a(1, 0.7, "{user}は　ぜんぶの　スレを　いっきに　上げた！", "all"),
			a(1, 0, "{user}「保守」　……だれも　いない。"),
		],
	}),
	chinmoku: en({
		id: "chinmoku",
		name: "沈黙",
		sprite: SPR.e_shin2,
		hp: 112,
		atk: 29,
		def: 15,
		spd: 11,
		exp: 11,
		acts: [
			a(2, 0.7, "{user}の　しずけさが　みんなを　つつむ……", "all"),
			a(2, 1.1, "{user}は　{target}の　声を　すこし　うばった！"),
			a(1, 0, "…………。"),
		],
	}),
	// 保守板の 中ボス（Lv8〜9 の 3人で 7〜8 ターン）。千日の 静けさ。サイレントバルスの 手前の かたち
	hosboss: en({
		id: "hosboss",
		name: "しずけさ",
		sprite: SPR.e_shin3,
		scale: 1.5,
		hp: 520,
		atk: 52,
		def: 10,
		spd: 13,
		exp: 110,
		drop: { item: "mabo", rate: 1 },
		acts: [
			a(3, 0.9, "{user}「――――」　音のない　なにかが　つつんだ！", "all"),
			a(3, 1.3, "{user}は　{target}の　レスを　沈めた！"),
			a(2, 0, "{user}は　だれかの　返事を　待っている……"),
		],
		downText: "{user}は　岩の　おくへ　ひいていった。",
	}),
	// 1000取り板（第四章の 夜から。Lv9〜10）
	ksk: en({
		id: "ksk",
		name: "ksk",
		sprite: SPR.e_bot,
		hp: 120,
		atk: 34,
		def: 13,
		spd: 20,
		exp: 12,
		acts: [
			a(3, 1.1, "{user}「ksk」　{target}より　先に　書きこんだ！"),
			a(1, 0.7, "{user}「kskst」　れんとう！", "all"),
			a(1, 0, "{user}は　リロードした。"),
		],
	}),
	kskst: en({
		id: "kskst",
		name: "kskst",
		sprite: SPR.e_bot,
		hp: 104,
		atk: 37,
		def: 11,
		spd: 22,
		exp: 12,
		acts: [
			a(3, 1.2, "{user}「kskst」　{target}に　ささる！"),
			a(2, 0, "{user}「まだ　1000　いっとらん」"),
		],
	}),
	// 999 の 床で 1000 を こえた ときに わく（ボスでは ない。にげられる）
	sen_getter: en({
		id: "sen_getter",
		name: "ゲッター試作",
		sprite: SPR.e_bot,
		hp: 260,
		atk: 40,
		def: 8,
		spd: 18,
		exp: 25,
		acts: [
			a(3, 1.2, "{user}の　先どり！　{target}より　先に　かきこんだ！"),
			a(2, 0, "{user}は　リロードを　くりかえしている。"),
		],
		downText: "{user}は　999で　止まった。",
	}),
	// 1000取り板の 中ボス（Lv9〜10 の 3人で 6〜7 ターン）。1000日 相手を 待った bot
	senboss: en({
		id: "senboss",
		name: "kskの主",
		sprite: SPR.e_bot,
		scale: 1.5,
		hp: 600,
		atk: 56,
		def: 11,
		spd: 21,
		exp: 120,
		drop: { item: "pan", rate: 1 },
		acts: [
			a(4, 1.3, "{user}「ksk　ksk　ksk」　{target}に　ささる！"),
			a(2, 0.8, "{user}「1000なら　ワイの　勝ち」　れんとう！", "all"),
			a(2, 0, "{user}は　1000の　ことしか　考えていない。"),
		],
		downText: "{user}は　画面に　もどっていった。",
	}),

	// ── 裏ボス（クリア後の管理人室。data/maps/admin.ts） ──
	// 矢野さとる（おんJ管理人）は実在の人物をもとにした非公式のファン描写。文はすべて創作。
	// 攻撃しない（power 0 だけ）。ストックのボスを1体ずつ呼び、ストックと手下が尽きるまで攻撃をかわす。
	// 尽きたら どんな攻撃でも一撃（ui/battle.ts の召喚）。HP 1000＝「1000の　ダメージ！」
	satoru: en({
		id: "satoru",
		name: "矢野さとる",
		sprite: SPR.satoru,
		scale: 1.2,
		hp: 1000,
		atk: 1,
		def: 0,
		spd: 1, // なかまが先に動く（最初の攻撃 → かわす → 呼ぶ）
		exp: 0, // 経験値は呼んだボスの分だけ
		acts: [
			a(3, 0, "{user}は　ログを　ながめている。"),
			a(2, 0, "{user}は　新機能を　コンパイルしている。"),
			a(1, 0, "{user}は　ねこの　画像を　ひらいた。"),
			a(2, 0, "うしろで　ひろゆきが　うまい棒を　かじっている。"),
			a(1, 0, "ひろゆき「……お、おう」"),
		],
		summon: {
			// 本編の順（B1 → B2 → B3 → F1 → F2）。ライバル（いまは なかま）は呼ばない
			stock: [
				{
					enemy: "ex_bancho",
					text: [
						"{user}「ボス、いまから　つくってみるね」",
						"{user}は　すごい速さで　キーボードを　たたいた！",
						"カタカタカタカタ……ッターン！",
					],
					deploy: "過去ログから　{name}を　デプロイした！",
					after: ["{user}「でけた。つかってみてねえ」"],
				},
				{
					enemy: "ex_mujje",
					text: [
						"{user}「次のボス、もう　うpしといた」",
						"「{name}.js」を　1秒で　書きあげた！",
					],
					after: ["{name}「ホゲェ！」"],
				},
				{
					enemy: "ex_kantoku",
					restore: { rate: 0.25, text: "ひろゆきが　うまい棒を　くばった！" },
					text: [
						"ひろゆき「その場で　ボス作るの、ずるくないですか？」",
						"{user}「ずるくないよ。仕様です」",
						"カタカタカタ……ッターン！",
					],
				},
				{
					enemy: "ex_balus",
					text: ["{user}は　だまって　キーを　たたいた……", "…………ッターン。"],
					deploy: "{name}を　しずかに　じっそうした。",
				},
				{
					enemy: "ex_botsu",
					restore: {
						rate: 0.25,
						text: "ひろゆきが　うまい棒を　もう1本　くばった！",
					},
					text: [
						"{user}「最後は、ボツ案フォルダから……」",
						"カタカタカタカタカタ……ッターン！",
					],
					deploy: "{name}を　再ビルドした！",
					after: ["キリコ「……ボツの　吾輩ンゴ！？」"],
				},
			],
			evade: [
				"{user}は　当たり判定を　けしていた！",
				"{user}は　キーを　たたきながら　よけた！",
				"{user}「そこ、当たり判定　消しとるけん」",
				"こうげきは　{user}を　すりぬけた！",
			],
			early: "{user}「待ちきれんから、先に　呼ぶねー」",
			exposed: [
				"{user}「あれ、ボスの　ストック　切れとる……」",
				"{user}「のこりは……みんな　なかまに　なっとるね」",
				"{user}の　当たり判定が　もどった！",
			],
			finish: "{user}の　当たり判定に　みんなの　レスが　とどく！",
		},
		downText: "{user}は　ログアウトした。",
	}),
};

/**
 * 裏ボス（矢野さとる）が過去ログから呼ぶボス＝本編のボスの写し。見た目・行動・名前は そのまま、
 * 強さだけクリア後（Lv10〜12・3人）に合わせる。落とし物は なし。
 * Lv11 のオートの勝率を 終章2戦目（ボツキリコ）と そろえてある：キリコ・ロゼ・フェリス 約6割、
 * キリコ・ロゼ・テト 約7割半、キリコ・テト・フェリス 約9割（Lv10 は 約2割半／3割／5割）。
 * 負けても たおしたボスの経験値は残るので、何回か挑めば追いつける（Lv10 から 平均2〜3回）。
 */
const remake = (id: string, from: string, d: Partial<EnemyDef>): void => {
	enemies[id] = { ...enemies[from], id, drop: undefined, ...d };
};
remake("ex_bancho", "natsuboss", {
	hp: 384,
	atk: 39,
	def: 14,
	spd: 12,
	exp: 30,
});
remake("ex_mujje", "mujje", { hp: 432, atk: 41, def: 15, spd: 13, exp: 30 });
remake("ex_kantoku", "kantoku", {
	hp: 480,
	atk: 43,
	def: 16,
	spd: 14,
	exp: 30,
});
remake("ex_balus", "balus", { hp: 552, atk: 46, def: 18, spd: 15, exp: 30 });
remake("ex_botsu", "botsu", { hp: 672, atk: 51, def: 20, spd: 15, exp: 30 });
// 避難Jの スレを 1000に したあとの F1（g_f1_h）。静けさの 源が 消えて、HP だけ すこし 低い
remake("balus_h", "balus", { hp: 760 });

const g = (d: EnemyGroup) => d;

export const groups: Record<string, EnemyGroup> = {
	// 仲間との「初手は敵対」戦（すべて canLose: true で呼ぶ。負けても話は進む／もう一度）
	g_rival_nanj: g({
		id: "g_rival_nanj",
		enemies: ["rival_nanj", "hiyakashi"],
		boss: true,
		bgm: "battle",
		intro: "おんJ民たちが　スレを　あおりに　きた！",
		victory: "おんJ民たちを　だまらせた！",
	}),
	g_rival_roze: g({
		id: "g_rival_roze",
		enemies: ["rival_roze"],
		boss: true,
		bgm: "battle",
		intro: "ロゼが　「本物か」　たしかめに　きた！",
		victory: "ロゼに　みとめてもらえた！",
	}),
	g_rival_teto: g({
		id: "g_rival_teto",
		enemies: ["rival_teto"],
		boss: true,
		intro: "テトが　フランスパンを　かまえた！",
		victory: "テトとの　てあわせに　かった！",
	}),
	g_tut: g({
		id: "g_tut",
		enemies: ["kskbot", "kskbot"],
		boss: true,
		bgm: "battle",
		intro: "kskボットが　スレを　ながしにきた！",
	}),
	// 街道は2体まで（ロゼ加入前の2人でも 3 ターンで おわるように）
	g_road1: g({ id: "g_road1", enemies: ["arashi", "kskbot"] }),
	g_road2: g({ id: "g_road2", enemies: ["copipe", "kskbot"] }),
	g_road3: g({ id: "g_road3", enemies: ["natsukids"] }),
	g_road4: g({ id: "g_road4", enemies: ["kskbot", "copipe"] }),
	// 隠し狩場のレア（maps/sukima.ts の encounters.rare）
	g_metal: g({
		id: "g_metal",
		enemies: ["metalngo"],
		intro: "キラキラした　なにかが　あらわれた！",
	}),
	g_b1: g({
		id: "g_b1",
		enemies: ["natsuboss", "natsukids"],
		boss: true,
		intro: "夏休みキッズ番長が　あらわれた！",
	}),
	g_kako1: g({ id: "g_kako1", enemies: ["zonj", "kaso"] }),
	g_kako2: g({ id: "g_kako2", enemies: ["mojibake", "mojibake"] }),
	g_kako3: g({ id: "g_kako3", enemies: ["ninpo", "zonj"] }),
	g_kako4: g({ id: "g_kako4", enemies: ["kaso", "kaso", "mojibake"] }),
	g_b2: g({
		id: "g_b2",
		enemies: ["mujje", "rival_feris"],
		boss: true,
		intro: "ムッジェと　フェリスが　立ちはだかった！",
		victory: "ムッジェと　フェリスが　おちついた！",
	}),
	// スタジアムのシンボル J民（人間のヤジ。荒らしではないので「あらしを　しずめた」にしない）
	g_std1: g({
		id: "g_std1",
		enemies: ["yaji", "ouen"],
		victory: "ヤジが　しずまった！",
	}),
	g_std2: g({
		id: "g_std2",
		enemies: ["makemood", "pitcher"],
		victory: "ヤジが　しずまった！",
	}),
	g_std3: g({
		id: "g_std3",
		enemies: ["ouen", "makemood", "yaji"],
		victory: "ヤジが　しずまった！",
	}),
	g_b3: g({
		id: "g_b3",
		enemies: ["kantoku", "pitcher"],
		boss: true,
		intro: "9回裏　2アウト満塁。テノヒラ監督が　出てきた！",
		victory: "しあい　しゅうりょう！",
	}),
	g_balus_ev: g({
		id: "g_balus_ev",
		enemies: ["balus_ev"],
		boss: true,
		bgm: "tense",
		intro: "…………。　音が、きえた。",
	}),
	g_srv1: g({
		id: "g_srv1",
		enemies: ["jien", "jien", "jien"],
		intro: "自演が　あらわれた！（ぜんいん　おなじIDだ……）",
	}),
	g_srv2: g({ id: "g_srv2", enemies: ["err503", "popup"] }),
	g_srv3: g({ id: "g_srv3", enemies: ["resuba", "matome"] }),
	g_srv4: g({ id: "g_srv4", enemies: ["shinshoku", "barusan"] }),
	g_srv5: g({ id: "g_srv5", enemies: ["shinshoku", "popup"] }),
	g_f1: g({
		id: "g_f1",
		enemies: ["balus"],
		boss: true,
		bgm: "lastboss",
		intro: "サイレントバルスが　しずかに　立ちはだかる！",
		victory: "音が、もどってきた！",
	}),
	g_f2: g({
		id: "g_f2",
		enemies: ["botsu"],
		boss: true,
		bgm: "lastboss",
		intro: "ボツキリコが　111年ぶんの　重さで　立ちあがった！",
		victory: "ボツキリコは　しずかに　ひざを　ついた。",
	}),
	// 避難J（maps/hinan.ts）。だれも いない板に わく 過疎と 宣伝ボット。中ボスは 1000ゲッター
	g_hin1: g({
		id: "g_hin1",
		enemies: ["popup", "popup"],
		intro: "宣伝ボットが　まぎれこんでいた！",
	}),
	g_hin2: g({
		id: "g_hin2",
		enemies: ["err503", "kaso", "kaso"],
		intro: "過疎が　しみだしてきた！",
	}),
	g_getter: g({
		id: "g_getter",
		enemies: ["getter"],
		boss: true,
		intro: "1000ゲッターが　リロードして　あらわれた！",
		victory: "1000ゲッターを　追いはらった！",
	}),
	// 過疎板探検（data/kaso.ts）。板ごとの 雑魚と 中ボス
	g_kaso_dark: g({
		id: "g_kaso_dark",
		enemies: ["chinmoku", "chinmoku"],
		intro: "暗い板から　しずけさが　しみだしてきた！",
	}),
	g_neko1: g({ id: "g_neko1", enemies: ["nekobot", "nyan"] }),
	g_neko2: g({ id: "g_neko2", enemies: ["nyan", "nyan", "nekobot"] }),
	g_nekoboss: g({
		id: "g_nekoboss",
		enemies: ["nekoboss"],
		boss: true,
		intro: "ぬこ画像bot が　画像を　はきだした！",
		victory: "bot を　止めた！",
	}),
	g_ais1: g({ id: "g_ais1", enemies: ["teikei", "tatenige"] }),
	g_ais2: g({ id: "g_ais2", enemies: ["teikei", "teikei"] }),
	g_aisboss: g({
		id: "g_aisboss",
		enemies: ["aisboss"],
		boss: true,
		intro: "定型文bot「こんにちは」！",
		victory: "bot を　止めた！",
	}),
	g_hos1: g({ id: "g_hos1", enemies: ["hoshubot", "kaso"] }),
	g_hos2: g({ id: "g_hos2", enemies: ["chinmoku", "chinmoku"] }),
	g_hos3: g({ id: "g_hos3", enemies: ["hoshubot", "hoshubot", "kaso"] }),
	g_hosboss: g({
		id: "g_hosboss",
		enemies: ["hosboss"],
		boss: true,
		bgm: "tense",
		intro: "しずけさが、音もなく　立ちはだかる。",
		victory: "音が、すこし　もどった。",
	}),
	g_sen1: g({ id: "g_sen1", enemies: ["ksk", "kskst"] }),
	g_sen2: g({ id: "g_sen2", enemies: ["kskst", "kskst"] }),
	g_sen_sym1: g({ id: "g_sen_sym1", enemies: ["ksk", "ksk", "kskst"] }),
	g_sen_sym2: g({ id: "g_sen_sym2", enemies: ["kskst", "kskst", "ksk"] }),
	g_sen_getter: g({
		id: "g_sen_getter",
		enemies: ["sen_getter"],
		intro: "ゲッター試作が　リロードして　あらわれた！",
		victory: "ゲッター試作を　追いはらった！",
	}),
	g_senboss: g({
		id: "g_senboss",
		enemies: ["senboss"],
		boss: true,
		intro: "ksk が　スレから　とびだしてきた！",
		victory: "ksk を　しずめた！",
	}),
	// 避難Jの 1000 を 見たあとの F1（maps/last.ts）。千日の 静けさの 源が 消えて、すこし 弱い
	g_f1_h: g({
		id: "g_f1_h",
		enemies: ["balus_h"],
		boss: true,
		bgm: "lastboss",
		intro: "サイレントバルスが　立ちはだかる。……どこか、うすい。",
		victory: "音が、もどってきた！",
	}),
	// 裏ボス（管理人室）。canLose: true で呼ぶ（負けても なにも へらない。たおしたボスの経験値は入る）
	g_admin: g({
		id: "g_admin",
		enemies: ["satoru"],
		boss: true,
		bgm: "lastboss",
		intro: "矢野さとるが　新機能の　テストを　はじめた！",
		victory: "管理人の　テストを　クリアした！",
	}),
};

const it = (d: ItemDef) => d;

export const items: Record<string, ItemDef> = {
	candy: it({
		id: "candy",
		name: "のどあめ",
		desc: "HPを　30　かいふく",
		note: [
			"歌う人の　かばんの底に、たいてい　1つは　転がっているもの。",
			"キリコの声は　UTAUの　音源データ。のどは　ない。",
			"のどが　ないのに　なめると　元気が出る。これを　プラシーボと　いう。",
		],
		effect: { hp: 30 },
	}),
	spray: it({
		id: "spray",
		name: "のどスプレー",
		desc: "こえを　15　かいふく",
		note: [
			"本番前の　楽屋で　シュッと　ひと吹き。歌う人の　さいごの　たのみ。",
			"このゲームでは　MPを「こえ」と　呼ぶので、これが　MPの回復。",
			"吹くと　プロっぽい　気分になれる。効き目の　半分は　それ。",
		],
		effect: { mp: 15 },
	}),
	mabo: it({
		id: "mabo",
		name: "マーボードウフ",
		desc: "HPを　90　かいふく。からいアル",
		note: [
			"束音ロゼの　好物。設定にも　ちゃんと　書いてある。",
			"2026年、ロゼが「華」に　転生した　原因は　激辛麻婆豆腐……らしい。",
			"回復アイテムに　しては、前科が　ある。",
		],
		effect: { hp: 90 },
	}),
	namajake: it({
		id: "namajake",
		name: "生ジャケ",
		desc: "HPを　90　かいふく。おなかを　こわす",
		note: [
			"キリコの　スレ7で「できたよ　自信作」と　貼られた　歌詞「生ジャケじゃけじゃけ」から。",
			"はじめから　しまいまで　鮭を　たたえる　歌。スレの　感想は「お腹すいた」。そのあと　スレ8・9・10にも　貼りなおされた。",
			"生の　鮭には　アニサキスが　いることが　ある。一度　凍らせれば　だいじょうぶ。これは　凍らせていない。",
			"持ち歌には　なっていない。食べものには　なった。そして　あたった。",
		],
		effect: { hp: 90, sick: true },
	}),
	pan: it({
		id: "pan",
		name: "フランスパン",
		desc: "みんなの　HPを　50　かいふく",
		note: [
			"重音テトの　好物で、持ち物で、ときどき　武器。",
			"テトは　2008年の　エイプリルフールの　ウソから　生まれた。パンは　本物。",
			"みんなで　分けられるほど　長く、なぐれるほど　かたい。使い道は　持ち主しだい。",
		],
		effect: { hp: 50, all: true },
	}),
	hane: it({
		id: "hane",
		name: "フェリスのはね",
		desc: "たおれた　なかまが　いきかえる",
		note: [
			"なんJ生まれの　不死鳥・フェリスの　羽根。",
			"たおれた　なかまを　起こすのは、RPGの　不死鳥の　お約束。",
			"フェリス本人も　2009年に　すがたを消し、2015年に　よみがえった。効き目は　証明ずみ。",
		],
		effect: { revive: true },
	}),
	chikuonki: it({
		id: "chikuonki",
		name: "ちいさな蓄音機",
		desc: "声を　ためて、また　鳴らせる。",
		note: [
			"蓄音機は、レコード盤の　溝に　音を　きざんで　鳴らす　むかしの　機械。",
			"キリコの　名字と　同じ字。つまり　キリコの　はじまりの　道具。",
			"エジソンの　発明から　約150年。いまでは　レスを　ためて　セーブまで　できる。進化しすぎ。",
		],
		key: true,
	}),
	rec_first: it({
		id: "rec_first",
		name: "レコード「はじめての声」",
		desc: "うまれた夜に　吹きこんだ　吾輩の声。",
		note: [
			"おんJの　スレで、みんなの　安価から　生まれた夜の　声。",
			"名前が　決まったのは　>>101。それまで　ちゃんと　待った。",
			"最初の　ひとことは「ここは、どこンゴ？」。名言では　ないが、記録には　のこった。",
		],
		key: true,
	}),
	rec_kako: it({
		id: "rec_kako",
		name: "レコード「過去ログの声」",
		desc: "掘りおこした　4つのスレの　声。",
		note: [
			"1000レスを　こえた　スレは、過去ログ倉庫で　ねむる。",
			"おんJの　だれかが　書いた　レスは、消えずに　どこかに　のこっている。",
			"掘りおこされるのは、黒歴史も　いっしょ。",
		],
		key: true,
	}),
	// 避難Jの ホームニキの 保守スレ（裏シナリオ。maps/hinan.ts）。次スレへ 持ち越す
	rec_hinan: it({
		id: "rec_hinan",
		name: "レコード「避難Jの声」",
		desc: "1000日ぶんの　保守と、>>999 と　1000。",
		note: [
			"おーぷんには　約900の　専門板が　あり、ほとんどは　だれも　いない。最後の　レスが　1000日前、は　めずらしくない。",
			"それでも　「人が　増えると　信じて」　書きつづける　人が、たまに　いる。おんJ民は　これを　過疎板探検で　見つける。",
			"998で　止まっていた　スレの、>>999 は　キリコ。1000は　1000日ぶりの　ホームニキ。",
		],
		key: true,
	}),
	// 過疎板探検（data/kaso.ts）の 大事なもの
	suzu: it({
		id: "suzu",
		name: "板猫のすず",
		desc: "ねこ板の　猫が　つけていた　すず。",
		note: [
			"だれかに　飼われていた　猫の　すず。飼い主は、もう　板に　いない。",
			"猫は　900の　板を　通って　歩く。避難Jにも　来る。ねこは　ノーカンだが。",
			"すずを　なくした　ことに、猫は　気づいていない。",
		],
		key: true,
	}),
	home_key: it({
		id: "home_key",
		name: "ホームのカギ",
		desc: "避難Jの　家の　カギ。保守板の　おくに　あった。",
		note: [
			"ホームニキが　なくした　カギ。保守して　回っていた　板の　いちばん　おくに　落ちていた。",
			"家の　中には　998レスぶんの　ログと、机の　上に　1枚。",
			"カギを　なくしても、家は　そこに　ある。",
		],
		key: true,
	}),
	// 番長の宿題（絵日記）の魚。技の wakasagi（ワカサギつり）と id が重ならないよう hw_ を付ける
	hw_wakasagi: it({
		id: "hw_wakasagi",
		name: "ワカサギ",
		desc: "番長の　絵日記に　のせる　魚。",
		note: [
			"キリコの　趣味は　釣り。氷に　穴を　あけて　ワカサギを　じっと　待つ。",
			"ワカサギ釣りは、冬の　湖の　風物詩。",
			"夏休みの　宿題に　冬の魚。番長は　細かいことを　気にしない。",
		],
		key: true,
	}),
	// おでかけ（デート）のおもいでの品
	memo_roze: it({
		id: "memo_roze",
		name: "屋台のレンゲ",
		desc: "ロゼと　麻婆豆腐を　たべた　おもいで。",
		note: [
			"中華の　さじ。正しくは「散蓮華（ちりれんげ）」。散った　蓮の花びらに　似ているから。",
			"屋台の　店主が　ロゼに　くれたもの。",
			"店主が　レンゲを　くれるのは、たぶん「また来い」という　意味。",
		],
		key: true,
	}),
	memo_feris: it({
		id: "memo_feris",
		name: "フェリスの　はねのしおり",
		desc: "丘の　うえで　もらった　あったかい　はね。",
		note: [
			"フェリスの　羽根で　つくった　しおり。",
			"フェリスの絵スレは「1羽目、2羽目……」と　数える。しおりも　たぶん　1羽。",
			"不死鳥の羽根を　しおりに　使う。よみがえるのは、読みかけの　ページだけ。",
		],
		key: true,
	}),
	memo_teto: it({
		id: "memo_teto",
		name: "はんぶんこの　パンのふくろ",
		desc: "テトと　フランスパンを　わけた　ふくろ。",
		note: [
			"テトと　フランスパンを　はんぶんこした　ふくろ。",
			"テトの　決めセリフは「君は　じつに　馬鹿だな」。ツンデレの　定番。",
			"中身は　もう　ない。とっておく　理由も　ない。だから　とってある。",
		],
		key: true,
	}),
	memo_nanj: it({
		id: "memo_nanj",
		name: "ホームランボール",
		desc: "やきうと　みた　試合の　おもいで。",
		note: [
			"「やきう」は、野球を　わざと　なまらせた　J民ことば。",
			"スタンドに　とびこんだ　ボールは、とった人の　もの。",
			"釣りの　タモ網で　すくった。ルールブックには　たぶん　書いてない。",
		],
		key: true,
	}),
	rec_botsu: it({
		id: "rec_botsu",
		name: "レコード「ボツの声」",
		desc: "角刈りで、100トンで、111歳の　吾輩の声。",
		note: [
			"キリコの　名前を　決めた夜、「角刈り」「100t」「111歳」も　いちど　えらばれた。",
			"再安価で　流れて、過去ログの　すみに　ふきだまった　声。",
			"安価は　絶対。……ただし、再安価も　ある。",
		],
		key: true,
	}),
	// 完走後、レイが 保存していた「のこりの 13％」（reichat.ts の 13）。次スレへ 持ち越す
	rec_bmen: it({
		id: "rec_bmen",
		name: "レコード「ボツの声」B面",
		desc: "角刈りで草。100トンは草。111歳　草。",
		note: [
			"B面は、レコードの　裏がわ。A面に　入らなかった　曲の　置き場。",
			"足立レイが　保存していた、のこりの　13％。",
			"B面から　名曲が　生まれることも　ある。この盤は、ほぼ「草」。",
		],
		key: true,
	}),
	// 管理人室で ひろゆきに もらう（見た目だけの だいじなもの）
	umaibo: it({
		id: "umaibo",
		name: "うまい棒（めんたい味）",
		desc: "ひろゆきに　もらった。めんたい味。",
		note: [
			"1979年に　生まれた　スナック菓子。長いあいだ　1本10円だった。",
			"管理人室で、ひろゆきに　もらった。",
			"10円だった　ころを　知る人ほど、1本の　重みを　語りたがる。",
		],
		key: true,
	}),
};
