// 終章「1000レス目のうた」後半：1000レス目（設計書 §11-8・§8-11）。
// F1 サイレントバルス → ボツキリコの正体 → 恩赦とレスの洪水 → F2 ボツキリコ → 蓄音 → >>1000 → thread へ。
// 洪水とボツキリコの一部は、それまでの安価・返し方で変わる（data/threadlog.ts）。

import type { MapDef, SayOptions, Story, TileDef } from "../../engine/defs";
import { warp } from "../helpers";
import { SPR } from "../sprites";
import { floodWaves, VARIANTS } from "../threadlog";
import { CYBER } from "../tiles";
import { reiCare } from "./server";

// ゲートの奥の「まっくらで　音が　ない」場所：床は虚無の黒い床（通れる）にする。
const tiles: Record<string, TileDef> = {
	...CYBER,
	".": { ...CYBER.X, passable: true },
};

/** ボツキリコのセリフ（声はキリコと同じ音源。名前欄だけ変える）。 */
const B: SayOptions = { name: "ボツキリコ", noPortrait: true };
const botsuSay = (s: Story, text: string) => s.say("kiriko", text, B);
const balusSay = (s: Story, text: string) =>
	s.say(null, text, { name: "サイレントバルス" });

/** 1000レス目の床を踏むと始まる最終戦（F1 → F2 → 1000 → エンディングへ）。 */
const lastRun = async (s: Story): Promise<void> => {
	await s.narrate("1000レス目。ゲートの　奥は、\nまっくらで　音が　ない。");
	await s.move("player", "uu");
	await balusSay(s, "…………");
	await s.say("kiriko", "吾輩の850レス、返してもらうンゴ");
	await balusSay(s, "ネタは、ネタのまま　終われ。\n……どうせ、忘れられるンゴ");
	await s.say("roze", "忘れられても、もどってこれるアル");
	await s.say("feris", "何回でも、だよ〜");
	await s.say("teto", "君は　じつに　馬鹿だな。\nウソだって、本物に　なるんだ");

	// ── F1 サイレントバルス ──
	await s.battle("g_f1");
	s.set("f1_done");
	s.set("res", 850);
	s.hide("balus_last"); // hide で when を評価し直し、botsu（f1_done）が出る
	await s.narrate(
		"黒い　もやが　はれていく。\n蓄音機に　850レスが　もどってきた！",
	);
	await s.narrate("もやの　中から　あらわれたのは――\n角刈りの　キリコだった。");
	await botsuSay(s, "角刈り。体重100トン。111歳");
	await botsuSay(s, "あの夜、最初に　えらばれて、\nすぐ「再安価」で　流された");
	await botsuSay(s, "吾輩は、お前の　ボツンゴ");
	// 序章の髪型・体重の安価（角刈り・100トン）を、えらんだか
	await botsuSay(s, VARIANTS.botsuPick(s.state));
	await botsuSay(
		s,
		"流されたレスは、だれにも　ひろわれない。\nだから　ぜんぶ　無音に　するンゴ",
	);
	await s.say("roze", "……それは、ちがうアル");

	// ── 恩赦とレスの洪水 ──
	await s.narrate("――そのとき、\nスレの　上のほうが　明るくなった。");
	await s.say("rei", "恩赦、承認されました。\nみなさんの　声を　中継します", {
		name: "レイ（中継）",
	});
	await s.say("nanj", "キリコォ！　恩赦や！\n書きこめるようになったで！");
	s.set("onsha");
	// >>991〜>>999。流れていくので、1波につき1つしか蓄音できない。
	// 波が目の前に来た合図を読んでハンドルを回す（釣りと同じ手ざわり）。
	// しくじっても ひろえるが、かすれて すこしだけ。ひろった声は まとめカードに残る
	let wave = 0;
	for (const w of floodWaves(s.state)) {
		await s.narrate(w.screen);
		if (!w.picks.length) continue;
		const pick = w.picks[await s.choose(w.picks.map((p) => p.label))];
		const near = Math.random() < 0.5;
		await s.narrate(
			near
				? "レスが　目の前に　来た。"
				: "レスは　まだ　遠い。\n……ハンドルは、いつ　まわす？",
		);
		const turned = (await s.choose(["ハンドルを　まわす", "まつ"])) === 0;
		const ok = near === turned;
		if (ok && !near)
			await s.narrate("ひと呼吸　おいた。\n……レスが　目の前に　来た。");
		s.se(ok ? "item" : "miss");
		s.give(pick.item.id, ok ? pick.item.n : 1);
		await s.say("kiriko", ok ? pick.line : "……すこし　かすれたンゴ");
		s.set(`flood_${++wave}`, pick.key);
	}
	await s.narrate("蓄音機が、すこし　あたたかい。");
	s.set("res", 999);
	s.heal();
	s.se("heal");
	await s.narrate(
		"みんなの　レスが　たまった！（999/1000）\nHPと　こえが　ぜんかいふくした！",
	);
	await botsuSay(s, "……再安価ンゴ。お前も、ボツに　してやる");
	await s.say("kiriko", "安価は　絶対。……でも");
	await s.say("kiriko", "ここから先は、吾輩が　決めるンゴ！");

	// ── F2 ボツキリコ ──
	await s.battle("g_f2");
	await s.narrate("ボツキリコは　ひざを　ついた。");
	await botsuSay(s, "……吾輩の声も、どうせ　消えるンゴ");
	await s.say("kiriko", "消えさせない");
	await s.say(
		"kiriko",
		"角刈りも、100トンも、111歳も。\nぜんぶ　あの夜の安価。吾輩の一部ンゴ",
	);
	const answer = VARIANTS.botsuAnswer(s.state);
	if (answer) await s.say("kiriko", answer);
	await botsuSay(s, "……ひろって、くれるンゴ？");
	await s.narrate("キリコは　蓄音機を　ボツキリコに　むけた。");
	s.give("rec_botsu");
	s.hide("botsu");
	s.se("item");
	await s.narrate("ボツキリコの　声が、\nレコードに　きざまれていく。");
	await s.narrate("のこり、1レス。");
	await s.choose(["1000ゲット！"]);
	await s.narrate("1000　名前：蓄音キリコ");
	await s.say("kiriko", "消えた声は、吾輩が、また　鳴らすンゴ！");
	await s.flash("#ffffff", 500);
	s.se("levelup");
	s.set("res", 1000);
	s.set("clear");
	await s.narrate("このスレッドは　1000を　こえました。");
	await s.say(
		"teto",
		"……君は　じつに　馬鹿だな。\n今のを　名言と言わずに、何て言うんだ",
	);
	await s.say("kiriko", "ンゴ……？　今の、名言ンゴ？");
	await s.fadeOut(600);
	await s.warp("thread", 6, 6, "up"); // ここで終了。thread の ending_ev が続く
};

export const last: MapDef = {
	id: "last",
	name: "1000レス目",
	bgm: null, // 無音（戦闘は lastboss）
	tiles,
	rows: [
		"###########", // y0
		"#WWWWWWWWW#", // y1
		"#wwwwwwwww#", // y2
		"#.........#", // y3
		"#.........#", // y4  サイレントバルス／ボツキリコ (5,4)
		"#.........#", // y5
		"#MMMM+MMMM#", // y6
		"#mmmm+mmmm#", // y7  lastfloor (5,7)（1マスの通路）
		"#.........#", // y8
		"#.........#", // y9
		"#.........#", // y10
		"#.........#", // y11 レイ (3,11)
		"#.........#", // y12 到着 (5,12)
		"#####D#####", // y13 入口 (5,13) → server
	],
	events: [
		warp(
			"to_server",
			5,
			13,
			{ map: "server", x: 12, y: 3, dir: "down" },
			{ se: "door" },
		),
		{
			id: "rei2",
			x: 3,
			y: 11,
			sprite: "char:rei",
			dir: "right",
			trigger: "talk",
			run: (s) =>
				reiCare(s, "この先が　1000レス目です。\n当機は　ここから　中継します"),
		},
		{
			id: "balus_last",
			x: 5,
			y: 4,
			sprite: SPR.e_shinmax,
			dir: "down",
			trigger: "talk",
			when: (st) => !st.flags.f1_done,
			run: async (s) => {
				await balusSay(s, "…………");
			},
		},
		{
			id: "botsu",
			x: 5,
			y: 4,
			sprite: SPR.botsu,
			dir: "down",
			trigger: "talk",
			when: (st) => !!st.flags.f1_done && !st.flags.clear,
			run: async (s) => {
				await botsuSay(s, "……吾輩は、お前の　ボツンゴ");
			},
		},
		{
			id: "lastfloor",
			x: 5,
			y: 7,
			trigger: "touch",
			once: true,
			run: lastRun,
		},
	],
};
