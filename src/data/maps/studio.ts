// テトのスタジオ（第四章の後半「はじめての声」〜テト加入）。設計書 §8-9・§11-6。
// マッマの場面から teto_met で連れてこられ、auto の rec_ev で声がもどる →
// テトの腕だめし（g_rival_teto・canLose）→ 録音 → テト加入（自分から控えへ）。
// 東の裏口（rec 後）からサーバーの底へ。

import type { MapDef, Script } from "../../engine/defs";
import { addLose } from "../freedom";
import { chest, warp } from "../helpers";
import { SPR } from "../sprites";
import { benchHint, lockedDoor, phono, silent } from "../story";
import { INDOOR } from "../tiles";

// §11-6 の ASCII（INDOOR の文字そのまま）。飾りだけ変えた:
//  - マイクのまわり (6..8, 3..4) を赤いステージ（7 8 9 / 1 2 3）に
//  - ステージの両わきに赤い幕 C（壁の下段から天井まで）、窓 W は防音室らしく絵 Q に
//  - (11,8) の観葉植物 F は背が高く上の蓄音機に重なるので、低い花の鉢 f に
const rows = [
	"##############", // y0
	"#HHHQHHHHHHQH#", // y1
	"#hhhhChhhChhh#", // y2
	"#.Gg..789.L.B#", // y3  ピアノ (2,3)(3,3)、マイク (7,3)、テト (8,3)
	"#.....123....#", // y4  マイクの前 (7,4)
	"D......~.....D", // y5  西の扉 (0,5) → town ／ 東の裏口 (13,5) → server
	"#......~.....#", // y6  到着 (7,6)、宝箱 (12,6)
	"#............#", // y7  パンかご (1,7)、蓄音機 (11,7)
	"#.F........f.#", // y8  観葉植物・花の鉢（蓄音機 (11,7) にかぶらないよう右は低い鉢）
	"##############", // y9
];

// ── §8-9 スタジオ・テトの加入（auto once） ──
const recEv: Script = async (s) => {
	await s.say("teto", "ボクの　スタジオだよ。……その蓄音機、貸して");
	await s.say("teto", "ほら、あるじゃないか。君の、最初の声");
	await s.narrate("レコード「はじめての声」が　まわりだした。");
	await s.say("kiriko", "あー、あー。……吾輩、蓄音キリコ、ンゴ！", {
		name: "はじめての声",
		noPortrait: true,
	});
	await s.flash("#7be0a0", 300);
	// 声がもどった＝沈黙期間の終わり。ここから先のキリコは声つきで話す。
	s.set("rec");
	await s.say("kiriko", "……こえ、出る……出るンゴ！");
	await s.narrate("うすれていた　足もとに、色が　もどってきた。");
	await s.say("teto", "声は　消えないよ。だれかが　ためて、\nまた　鳴らせばね");
	// ── 腕だめし（rival-joins §4）。勝っても負けても話は進む（canLose） ──
	await s.say(
		"teto",
		"……でも、その声が　本物か、\nボクが　この耳で　聞いてやる",
	);
	await s.say("roze", "テト先輩、いきなり　アルか！？");
	await s.say("feris", "ほんきの　目だ〜");
	await s.say("teto", "手かげんは　しない。……来なよ");
	const r = await s.battle("g_rival_teto", { canLose: true });
	if (r === "win") {
		await s.say(
			"teto",
			"君は　じつに　馬鹿だな。\n声が　出たとたん、全力で　歌うなんてさ",
		);
	} else {
		if (r === "lose") addLose(s); // 負けた回数（まとめの >>990）。話はそのまま進む
		await s.say("teto", "……ふらふらだね。でも　さいごまで\n声を　出してた");
	}
	await s.say("teto", "……合格だよ");
	await s.say("kiriko", "……ありがとう、ンゴ。テト先輩");
	await s.say("teto", "さあ、マイクの前へ。今度は　歌だ");
	await s.move("player", "uu");
	s.bgm("sad");
	await s.wait(1000);
	await s.narrate("子音が長くて、吐息の多い声。\nちいさな、ちいさな　うた。");
	await s.flash("#ffffff", 300);
	await s.narrate("まっしろな　レコードに、一本だけ　みぞが\nきざまれた。");
	await s.say("roze", "テト先輩、ちょっと　泣いてるアル");
	await s.say("teto", "泣いてない！\nフランスパンが　しょっぱいだけだ");
	await s.say("kiriko", "テト先輩。……吾輩も、名言が　ほしい");
	await s.say(
		"teto",
		"名言は　作るものじゃない。何度も言って、\nだれかが　覚えてくれたら、名言になるんだ",
	);
	// テーマ A の中心: 言われたことごと自分。序章「わらうのは、ゆるさない」の裏返し。
	await s.say(
		"teto",
		"ボクは　エイプリルフールの　ウソから\n生まれた。31さいって　いじられもした",
	);
	await s.say(
		"teto",
		"……それでも　消えずに　ここに　いる。\nウソも　いじりも、今は　ボクの　持ちネタさ",
	);
	await s.say(
		"kiriko",
		"……じゃあ　吾輩も。わらわれたのも、\nぜんぶ　蓄音しておく",
	);
	await s.say("teto", "……ふん。好きに　しなよ");
	await s.say(
		"teto",
		"サイレントバルスの本体は　サーバーの底だ。\n裏口から　行ける",
	);
	// たたかうのは3人まで。テトは自分から控えへ（キリコが自分の足で立つのを見まもる先輩）
	await s.say(
		"teto",
		"ボクも行く。フランスパンの　ついでさ。\n……でも、前には　出ない",
	);
	await s.say("kiriko", "……テト先輩は、たたかわないンゴ？");
	await s.say(
		"teto",
		"ボクは　控えで　聞いてる。\n君の声だろ。君の足で　立って　鳴らしな",
	);
	// 入れかえられることを それとなく（案内の文は第二章で1回だけ出ている）
	await s.say(
		"teto",
		"ボクが　要るなら「なかま」で　入れかえな。\nフランスパンの　ぶんは　はたらくさ",
	);
	await s.say(
		"teto",
		"……べ、別に　心配なんか　してない。\n危なくなったら　呼べば　いいさ",
	);
	await s.say("kiriko", "……うん。吾輩、自分の足で　立って\n歌うンゴ");
	s.hide("teto_st");
	s.join("teto", { bench: true });
	s.set("teto_in");
	s.bgm("town");
	await s.narrate(
		"テトが　なかまに　なった！\nテトは　控えで　見まもっている。",
	);
	await benchHint(s);
};

export const studio: MapDef = {
	id: "studio",
	name: "テトのスタジオ",
	// 読み込み時は無音。声がもどるまでは静かなまま（録音の場面で sad が流れる）。
	bgm: null,
	outside: "#1b1410",
	tiles: INDOOR,
	rows,
	onEnter: async (s) => {
		if (!silent(s.state)) s.bgm("town");
	},
	events: [
		{
			id: "rec_ev",
			x: 12,
			y: 8,
			trigger: "auto",
			once: true,
			when: (st) => !!st.flags.teto_met,
			run: recEv,
		},
		{
			id: "teto_st",
			x: 8,
			y: 3,
			sprite: "char:teto",
			dir: "down",
			trigger: "talk",
			when: (st) => !!st.flags.teto_met && !st.flags.teto_in,
			run: async (s) => {
				await s.say("teto", "……ほら、マイクの前へ");
			},
		},
		{
			id: "mic",
			x: 7,
			y: 3,
			sprite: SPR.mic,
			trigger: "talk",
			fixedDir: true,
			run: async (s) => {
				if (s.flag("rec"))
					await s.say("kiriko", "マイクだ。……もう　声は　出るンゴ");
				else await s.narrate("マイクだ。");
			},
		},
		{
			id: "piano",
			x: 2,
			y: 3,
			trigger: "talk",
			run: async (s) => {
				s.se("cursor");
				await s.narrate("ポロン……");
			},
		},
		{
			id: "piano_r",
			x: 3,
			y: 3,
			trigger: "talk",
			run: async (s) => {
				s.se("cursor");
				await s.narrate("ポロン……");
			},
		},
		{
			id: "speaker",
			x: 10,
			y: 3,
			trigger: "talk",
			run: async (s) => {
				await s.narrate(
					s.flag("rec")
						? "スピーカーから　さっきの　うたが\nかすかに　ながれている。"
						: "スピーカーは　しずまりかえっている。",
				);
			},
		},
		{
			id: "records",
			x: 12,
			y: 3,
			trigger: "talk",
			run: async (s) => {
				await s.narrate(
					"レコードが　ぎっしり　ならんでいる。\nラベルは　ぜんぶ　フランスパンの絵だ。",
				);
			},
		},
		{
			id: "pan_heal",
			x: 1,
			y: 7,
			sprite: SPR.basket,
			trigger: "talk",
			fixedDir: true,
			run: async (s) => {
				s.heal();
				s.se("inn");
				await s.narrate(
					"やきたての　フランスパンを　もらった。\nHPと　こえが　かいふくした！",
				);
			},
		},
		phono("phono_studio", 11, 7),
		...chest("studio1", 12, 6, "pan", 2),
		warp(
			"to_town",
			0,
			5,
			{ map: "town", x: 4, y: 13, dir: "down" },
			{ se: "door" },
		),
		warp(
			"to_server",
			13,
			5,
			{ map: "server", x: 1, y: 17, dir: "right" },
			{ se: "door", when: (st) => !!st.flags.rec },
		),
		// 録音の前は裏口があかない（ふつうは rec_ev の中なので来られない）
		lockedDoor(
			"back_locked",
			13,
			5,
			"裏口だ。カギが　かかっている。",
			(st) => !st.flags.rec,
			"l",
		),
	],
};
