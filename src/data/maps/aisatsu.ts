// 料理板（裏シナリオ「過疎板探検」の 2枚目。過疎板の底の 左から2番目の 扉。入るとき のれんの 声に 返事を する）。
// おーぷんに 実在する 板（cook）。「料理雑談スレ」（2014年〜）が 細々と つづき、よそから 書きこむと
// 「お客さんだ」「いらっしゃい」と 返ってくる（おんJ の「1ヶ月間過疎板巡り」スレ >>116・>>242）。
// ゲームでは だれも 来なくなった 食堂。4人の 名無しの 残像が 立っていて、それぞれの スレ（壁の 額）に 日付が ある。
// 来た順（日付の 古い順）に あいさつを 返すと、そろって おじぎして 帰っていく（ais_order）。
// 順番を まちがえると そっぽを むかれて 最初から。
// おくの モニターで この板の 1スレの >>1 を 当て（倉庫の 発掘と 同じ 遊び）、
// 1000日 「いらっしゃい」を 返しつづけている 常連bot を 止めると 終わり（ais_done）。
// bot が 止まると、帳場の 帳面の 字が こくなる（沈んだレス >>130。バラムツ → 再安価で 囲碁）。
// フラグ：ais_n（返した 人数 0〜4）・ais_order・ais_age・ais_done

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { chest, warp } from "../helpers";
import { bump, front, giveSunk, has, K, look, N, sunkHad } from "../kaso";
import { SPR } from "../sprites";
import { INDOOR } from "../tiles";

/** 残像と スレ（壁の 額）。order は 来た順（0 が いちばん 古い）。 */
const GHOSTS: {
	id: string;
	x: number;
	order: number;
	date: string;
	title: string;
	reply: string;
}[] = [
	{
		id: "g_a",
		x: 2,
		order: 2,
		date: "2014/04/07",
		title: "料理雑談スレ",
		reply: "……いらっしゃい",
	},
	{
		id: "g_b",
		x: 6,
		order: 0,
		date: "2012/06/07",
		title: "はじめまして。なに作れば　ええ？",
		reply: "……はじめまして",
	},
	{
		id: "g_c",
		x: 10,
		order: 3,
		date: "2015/01/01",
		title: "あけおめ。おせち　作った",
		reply: "……あけおめ",
	},
	{
		id: "g_d",
		x: 14,
		order: 1,
		date: "2013/05/16",
		title: "いらっしゃい。まず　米を　とげ",
		reply: "……お客さんだ",
	},
];

const ghostEvents = (): EventDef[] =>
	GHOSTS.flatMap((g) => [
		// 壁の 額（スレ）。(x,3) から 上を 向いて 調べる
		look(
			`${g.id}_frame`,
			g.x,
			2,
			`【料理】${g.title}\n1　名前：名無しさん＠おーぷん　${g.date}`,
		),
		{
			id: g.id,
			x: g.x,
			y: 4,
			sprite: SPR.e_silent,
			dir: "down",
			trigger: "talk",
			when: (st) => !st.flags.ais_order,
			run: async (s) => {
				const n = Number(s.flag("ais_n") ?? 0);
				s.face(g.id, "player");
				await s.narrate(
					"名無しの　残像。\nなにも　言わずに、こちらを　見ている。",
				);
				const c = await s.choose(["あいさつする", "やめる"], {
					cancel: 1,
				});
				if (c === 1) return;
				await K(s, "……おじゃまします、ンゴ");
				if (g.order !== n) {
					s.se("miss");
					await s.narrate("残像は、ふいと　そっぽを　むいた。");
					await s.narrate("ほかの　残像たちも、いっせいに\nそっぽを　むいた。");
					if (!s.flag("ais_hint")) {
						s.set("ais_hint");
						if (front(s, "roze"))
							await s.say(
								"roze",
								"……順番が　あるアルか。\n額の　日付を　見るアル",
							);
						else await K(s, "……順番、ンゴ？");
					}
					s.set("ais_n", 0);
					return;
				}
				s.se("decide");
				await s.narrate("残像は、ぺこりと　おじぎした。");
				await s.say(null, g.reply, { name: "残像" });
				bump(s, "ais_n");
				if (n + 1 < GHOSTS.length) return;
				await s.narrate("4人の　残像が、そろって\nもういちど　おじぎした。");
				await s.narrate(
					"……そして、帰っていった。\nお客さんに　あいさつして、帰る　店。",
				);
				if (front(s, "feris"))
					await s.say("feris", "いらっしゃい、って\n言われたかったんだね〜");
				s.set("ais_order");
				await s.narrate("おくの　モニターが、\nぽつりと　ついた。");
			},
		},
	]);

/** おくの モニター：1スレの >>1 当て → 常連bot。 */
const monitorRun = async (s: Story): Promise<void> => {
	if (s.flag("ais_done")) {
		await s.narrate("1　料理雑談スレ\n……bot は　止まっている。");
		return;
	}
	if (!s.flag("ais_order")) {
		await s.narrate(
			"消えた　モニター。\n『ようこそ。まず　お客さんに　あいさつを』",
		);
		return;
	}
	if (!s.flag("ais_age")) {
		await s.narrate("この板の　1スレ。\n>>1 は　文字化けして　読めない。");
		await s.narrate(">>2 いらっしゃい\n>>3 お客さんだ");
		await s.narrate(">>4 ……なに　作ります？\n>>5 >>4 なんでも　ええで。雑談や");
		await s.narrate("……この　スレの　>>1 は、\nなんだった？");
		const c = await s.choose([
			"料理雑談スレ",
			"今日の　献立　スレ",
			"お店　紹介スレ",
		]);
		if (c !== 0) {
			s.se("miss");
			await s.narrate(
				"ログは　ぱらぱらと　くずれて、\nまた　モニターの　おくへ　もどった。",
			);
			await K(s, "……もう　いちど　読むンゴ");
			return;
		}
		s.set("ais_age");
		s.se("levelup");
		await s.narrate("スレが　ゆっくり　浮かびあがった。\n（age）");
		await K(s, "なんでも　ええ、雑談。\n……それだけの　店ンゴ");
	}
	await s.narrate("スレの　いちばん下で、\nbot が　まだ　動いている。");
	await s.narrate("998　名前：常連bot\nいらっしゃい。お客さんだ");
	await s.narrate("997　名前：常連bot\nいらっしゃい。お客さんだ");
	await s.narrate(
		"……1000日、だれも　来ない　店で\n「いらっしゃい」を　言いつづけている。",
	);
	await K(s, "だれにも　返ってこない\nいらっしゃい、ンゴ……");
	s.se("shock");
	await s.shake(300);
	await s.narrate("「いらっしゃい」が、画面から　あふれだした！");
	await s.battle("g_aisboss");
	await s.narrate("bot が　止まった。");
	s.se("cursor");
	await s.narrate("999　名前：蓄音キリコ\n>>998 おじゃまします。ンゴ");
	await s.narrate("……画面が、すこしだけ\nあたたかく　なった　気がした。");
	if (has(s, "roze"))
		await s.say("roze", "お客さんが　来るのを、\n待ってたアルかもね");
	s.set("ais_done");
	await s.narrate("どこかで、モニターが　ひとつ\nついた　気がした。");
};

/** 帳場の 帳面（bot が 止まると 読める。沈んだレス >>130）。 */
const ledgerRun = async (s: Story): Promise<void> => {
	if (!s.flag("ais_done")) {
		await s.narrate(
			"帳場。帳面が　ひらいたまま。\n……字が　うすくて、読めない。",
		);
		return;
	}
	await s.narrate("帳場の　帳面。\n字が、こく　なっている。");
	if (await sunkHad(s, "sunk_130", 130)) return;
	await s.narrate("130　好きなもの：バラムツ\n380　再安価：囲碁");
	await s.narrate("帳場の　むこうに、残像が　ひとつ。");
	await N(s, "常連の残像", "……食べたら　あかん　魚や");
	await s.narrate("残像は、それきり　消えた。");
	await s.narrate("キリコは　だまって、\n石を　ひとつ　置く　しぐさを　した。");
	await giveSunk(s, "sunk_130", 130);
};

const events: EventDef[] = [
	{
		id: "arrive",
		x: 8,
		y: 12,
		trigger: "auto",
		once: true,
		run: async (s) => {
			await s.narrate("料理板。\n最後の　レスは、1000日前。");
			await s.narrate("食堂に、だれかの　影が　4つ。\n……動かない。");
			if (front(s, "roze"))
				await s.say("roze", "残像アル。\n書いた　人は、もう　いないアル");
			await K(s, "……あいさつ、したほうが\nいいンゴ？");
		},
	},
	warp(
		"to_kaso",
		8,
		13,
		{ map: "kaso", x: 8, y: 3, dir: "down" },
		{ se: "door" },
	),
	look(
		"rule",
		8,
		2,
		"店の　きまり\n一、お客さんには　あいさつを",
		"二、あいさつは、来た順に　返すこと\n三、なんでも　ええで。雑談や",
	),
	...ghostEvents(),
	{
		id: "monitor",
		x: 15,
		y: 5,
		trigger: "talk",
		fixedDir: true,
		run: monitorRun,
	},
	{
		id: "ledger",
		x: 15,
		y: 10,
		trigger: "talk",
		fixedDir: true,
		run: ledgerRun,
	},
	look("tables", 8, 8, "テーブルと　いす。\nだれも　すわって　いない。"),
	look("pot", 1, 3, "鍋。\n……中は、からっぽだ。"),
	...chest("ais1", 1, 10, "spray", 2),
];

export const aisatsu: MapDef = {
	id: "aisatsu",
	name: "料理板",
	bgm: "dungeon",
	tiles: { ...INDOOR, ".": { ...INDOOR["."], encounter: true } },
	encounters: { rate: 0.05, groups: ["g_ais1", "g_ais2"] },
	// 18×14。上の壁に 4つの 額（Q。x = 2,6,10,14）と 店の きまり (8,2)。残像は その下 y4。
	// おくの モニター M (15,5)。テーブル t と いす n。帳場 [=] (14..16,10)。南の 扉 (8,13) → 過疎板の底
	rows: [
		"##################", // y0
		"#HHHHHHHHHHHHHHHH#", // y1
		"#hQhhhQhQhQhhhQhh#", // y2  額 (2,2)(6,2)(10,2)(14,2)・きまり (8,2)
		"#u...............#", // y3  鍋 (1,3)
		"#................#", // y4  残像 (2,4)(6,4)(10,4)(14,4)
		"#..............M.#", // y5  モニター (15,5)
		"#................#", // y6
		"#................#", // y7
		"#..ntn..ntn..ntn.#", // y8  テーブルと いす
		"#................#", // y9
		"#.............[=]#", // y10 宝箱 (1,10)・帳場 (15,10)
		"#................#", // y11
		"#................#", // y12 到着 (8,12)
		"########D#########", // y13 出口 (8,13) → kaso
	],
	events,
};
