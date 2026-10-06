// あいさつ板（裏シナリオ「過疎板探検」の 2枚目。過疎板の底の 左から2番目の 扉。入るときに「以後、お見知りおきを」）。
// ルールは「あいさつだけして、帰ること」。ヒナリーの「立て逃げ」は この板の 作法。
// 広間に 4人の 名無しの 残像が 立っていて、それぞれの あいさつスレ（壁の 額）に 日付が ある。
// 来た順（日付の 古い順）に あいさつを 返すと、そろって おじぎして 帰っていく（ais_order）。
// 順番を まちがえると そっぽを むかれて 最初から。
// おくの モニターで この板の 1スレの >>1 を 当て（倉庫の 発掘と 同じ 遊び）、
// 1000日 「こんにちは」を 返しつづけている 定型文bot を 止めると 終わり（ais_done）。
// フラグ：ais_n（返した 人数 0〜4）・ais_order・ais_age・ais_done

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { chest, warp } from "../helpers";
import { bump, front, has, K, look } from "../kaso";
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
		date: "2014/08/08",
		title: "おはようございます。帰ります",
		reply: "……おはよう　ございます",
	},
	{
		id: "g_b",
		x: 6,
		order: 0,
		date: "2012/06/07",
		title: "はじめまして。原住民です",
		reply: "……はじめまして",
	},
	{
		id: "g_c",
		x: 10,
		order: 3,
		date: "2015/01/01",
		title: "こんばんは。だれか　おる？",
		reply: "……おる",
	},
	{
		id: "g_d",
		x: 14,
		order: 1,
		date: "2013/05/16",
		title: "以後、お見知りおきを",
		reply: "……こちらこそ",
	},
];

const ghostEvents = (): EventDef[] =>
	GHOSTS.flatMap((g) => [
		// 壁の 額（スレ）。(x,3) から 上を 向いて 調べる
		look(
			`${g.id}_frame`,
			g.x,
			2,
			`【あいさつ】${g.title}\n1　名前：風吹けば名無し　${g.date}`,
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
				const c = await s.choose(["あいさつする", "やめる"], { cancel: 1 });
				if (c === 1) return;
				await K(s, "……どうも、ンゴ");
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
					"……そして、帰っていった。\nあいさつだけして、帰る　板。",
				);
				if (front(s, "feris"))
					await s.say(
						"feris",
						"ヒナリーちゃんの　口ぐせ、\nここの　ルールだったんだ〜",
					);
				s.set("ais_order");
				await s.narrate("おくの　モニターが、\nぽつりと　ついた。");
			},
		},
	]);

/** おくの モニター：1スレの >>1 当て → 定型文bot。 */
const monitorRun = async (s: Story): Promise<void> => {
	if (s.flag("ais_done")) {
		await s.narrate("1　あいさつして　帰る板　part1\n……bot は　止まっている。");
		return;
	}
	if (!s.flag("ais_order")) {
		await s.narrate(
			"消えた　モニター。\n『ようこそ。まず　みなさんに　あいさつを』",
		);
		return;
	}
	if (!s.flag("ais_age")) {
		await s.narrate("この板の　1スレ。\n>>1 は　文字化けして　読めない。");
		await s.narrate(">>2 おはようございます\n>>3 以後、お見知りおきを");
		await s.narrate(
			">>4 ……帰るの　はやない？\n>>5 >>4 ルールやで。長居は　無用",
		);
		await s.narrate("……この　スレの　>>1 は、\nなんだった？");
		const c = await s.choose([
			"あいさつして　帰る板",
			"雑談する　板",
			"自己紹介する　板",
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
		await K(s, "あいさつして、帰る。\n……それだけの　板ンゴ");
	}
	await s.narrate("スレの　いちばん下で、\nbot が　まだ　動いている。");
	await s.narrate("998　名前：定型文bot\nこんにちは。以後、お見知りおきを");
	await s.narrate("997　名前：定型文bot\nこんにちは。以後、お見知りおきを");
	await s.narrate(
		"……1000日、だれも　いない板で\nあいさつを　返しつづけている。",
	);
	await K(s, "だれにも　返ってこない\nあいさつ、ンゴ……");
	s.se("shock");
	await s.shake(300);
	await s.narrate("定型文が、画面から　あふれだした！");
	await s.battle("g_aisboss");
	await s.narrate("bot が　止まった。");
	s.se("cursor");
	await s.narrate("999　名前：蓄音キリコ\n>>998 こんにちは。ンゴ");
	await s.narrate("……画面が、すこしだけ\nあたたかく　なった　気がした。");
	if (has(s, "roze"))
		await s.say("roze", "返事が　来るのを、\n待ってたアルかもね");
	s.set("ais_done");
	await s.narrate("どこかで、モニターが　ひとつ\nついた　気がした。");
};

const events: EventDef[] = [
	{
		id: "arrive",
		x: 8,
		y: 12,
		trigger: "auto",
		once: true,
		run: async (s) => {
			await s.narrate("あいさつ板。\n最後の　レスは、1000日前。");
			await s.narrate("広間に、だれかの　影が　4つ。\n……動かない。");
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
		"板ルール\n一、あいさつだけして、帰ること",
		"二、あいさつは、来た順に　返すこと\n三、長居は　無用",
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
	look("chairs", 8, 8, "いすが　ならんでいる。\nだれも　すわって　いない。"),
	...chest("ais1", 1, 10, "spray", 2),
];

export const aisatsu: MapDef = {
	id: "aisatsu",
	name: "あいさつ板",
	bgm: "dungeon",
	tiles: { ...INDOOR, ".": { ...INDOOR["."], encounter: true } },
	encounters: { rate: 0.05, groups: ["g_ais1", "g_ais2"] },
	// 18×14。上の壁に 4つの 額（Q。x = 2,6,10,14）と 板ルール (8,2)。残像は その下 y4。
	// おくの モニター M (15,5)。南の 扉 (8,13) → 過疎板の底
	rows: [
		"##################", // y0
		"#HHHHHHHHHHHHHHHH#", // y1
		"#hQhhhQhQhQhhhQhh#", // y2  額 (2,2)(6,2)(10,2)(14,2)・板ルール (8,2)
		"#................#", // y3
		"#................#", // y4  残像 (2,4)(6,4)(10,4)(14,4)
		"#..............M.#", // y5  モニター (15,5)
		"#................#", // y6
		"#................#", // y7
		"#..n.n.n.n.n.n...#", // y8  いす
		"#................#", // y9
		"#................#", // y10 宝箱 (1,10)
		"#................#", // y11
		"#................#", // y12 到着 (8,12)
		"########D#########", // y13 出口 (8,13) → kaso
	],
	events,
};
