// 犬猫大好き板（裏シナリオ「過疎板探検」の 1枚目。過疎板の底の 左の 扉から。data/kaso.ts）。
// おーぷんに 実在する 板（dog）。「他の板の猫スレ紹介場」が 2015年から おーぷんじゅうの 猫スレを 集めつづけている
// （おんJ の「1ヶ月間過疎板巡りしてきたワイが良スレだと思ったものを紹介していく」>>7）。犬は いない（犬とは 言ってない）。
// ゲームでは ねこしか いなくなった 板。すずを つけた 猫（板猫）が 柵の すきまを ぬけて 勢い欄まで 案内する。
// ほかの 猫は 気まぐれに 歩くだけ（にゃあ）。
// 勢い欄の 2番目『ぬこ画像スレ』（創作）には、1000日 だれも いない 板に、画像bot だけが 画像を はりつづけている。
// bot を 止めると この板は 終わり（neko_done）。板猫は 底の ほうへ 走っていく（避難Jの 板猫と 同じ 猫）。
// フラグ：neko_step（猫を 追った 回数 0〜4）・neko_done

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { chest, warp } from "../helpers";
import { C, front, has, K, look } from "../kaso";
import { SPR } from "../sprites";
import { lockedDoor } from "../story";
import { TOWN } from "../tiles";

const step = (st: { flags: Record<string, unknown> }): number =>
	Number(st.flags.neko_step ?? 0);

/** すずの 猫の 立つ 場所と、話しかけたとき 走っていく 道（つぎの 場所まで）。 */
const CAT: [x: number, y: number, route: string][] = [
	[8, 11, "llllllu"], // 到着の そば → 左の 柵の すきまの 手前へ
	[2, 10, "uuurrrrrrrrrrrrr"], // 柵 (1,9)(2,9) を ぬけて、右の 柵の すきまの 手前へ
	[15, 7, "llllllllluuu"], // 左へ 歩いて、柵 (6,6) を ぬけ、家の 前へ
	[6, 4, "rrr"], // 勢い欄の 前へ
	[9, 4, ""], // 勢い欄の 前で すわる
];

const cat = (i: number): EventDef => {
	const [x, y, route] = CAT[i];
	return {
		id: `cat${i}`,
		x,
		y,
		sprite: SPR.cat,
		dir: "down",
		trigger: "talk",
		when: (st) => !st.flags.neko_done && step(st) === i,
		run: async (s) => {
			s.face(`cat${i}`, "player");
			if (i === 0) {
				await C(s);
				await s.narrate("ちりん。\n……首に　すずを　つけた　猫だ。");
				await K(s, "この子だけ、すずが　あるンゴ");
				if (front(s, "roze"))
					await s.say("roze", "だれかに　飼われてた　猫アルか");
			} else if (i === CAT.length - 1) {
				await C(s, "にゃあ♪");
				await s.narrate(
					"猫は　勢い欄の　前で　すわった。\n……ここを　見ろ、と　いうように。",
				);
				return;
			} else {
				await C(s);
			}
			await s.narrate("猫は　すずを　ならして　走りだした。");
			s.se("cursor");
			await s.move(`cat${i}`, route, { speed: 2, through: true });
			s.set("neko_step", i + 1);
		},
	};
};

/** 気まぐれな 猫（案内は しない）。 */
const stray = (
	id: string,
	x: number,
	y: number,
	text = "にゃあ",
): EventDef => ({
	id,
	x,
	y,
	sprite: SPR.cat,
	trigger: "talk",
	wander: true,
	run: async (s) => {
		await C(s, text);
	},
});

/** 勢い欄。猫が 前に すわっていると、bot との 戦いに なる。 */
const ikioiRun = async (s: Story): Promise<void> => {
	if (s.flag("neko_done")) {
		await s.narrate(
			"1 他の板の　猫スレ　紹介場\n2 【画像】ぬこ画像スレ　part998",
		);
		await s.narrate("2の　最終レス：さっき。\n名前：蓄音キリコ「にゃあ」");
		return;
	}
	await s.narrate(
		"1 他の板の　猫スレ　紹介場\n2 【画像】ぬこ画像スレ　part998",
	);
	await s.narrate(
		"1：おーぷんじゅうの　猫スレを\n2015年から　集めている。……人の　字だ。",
	);
	await s.narrate("2の　最終レス：いま。\n……いま？");
	if (step(s.state) < CAT.length - 1) {
		await s.narrate(
			"2は　画面が　はやすぎて、読めない。\n……だれかが、はりつづけている。",
		);
		await K(s, "……すずの　猫が、なにか\n知ってそうンゴ");
		return;
	}
	await s.narrate(
		"猫が　画面を　ちょんと　たたいた。\nスクロールが、止まった。",
	);
	await s.narrate("998　名前：画像bot\n【画像】ぬこ.jpg");
	await s.narrate("997　名前：画像bot\n【画像】ぬこ.jpg");
	await s.narrate(
		"……1000日ぶん、ぜんぶ　bot だ。\nだれも　見ていない　画像を、ずっと。",
	);
	if (front(s, "feris")) await s.say("feris", "だれにも　見せないのに〜？");
	await K(s, "吾輩が　見たンゴ。\n……だから、もう　いいンゴ");
	s.se("shock");
	await s.shake(300);
	await s.narrate("画面から、画像が　あふれだした！");
	await s.battle("g_nekoboss");
	await s.narrate(
		"bot が　止まった。\n1000日ぶりに、スレが　しずかに　なった。",
	);
	s.se("cursor");
	await s.narrate("999　名前：蓄音キリコ\nにゃあ");
	await C(s, "にゃあ♪");
	await s.narrate(
		"猫が　キリコの　足に　頭を　こすりつけた。\nすずが　ちりん、と　鳴った。",
	);
	s.se("item");
	s.give("suzu");
	await s.narrate("板猫のすずを　てにいれた！");
	await s.narrate(
		"猫は　すずを　なくしたことにも　気づかず、\n底の　ほうへ　走っていった。",
	);
	if (has(s, "roze")) await s.say("roze", "……あの猫、どこへ　帰るアルか");
	s.set("neko_done");
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
			await s.narrate("犬猫大好き板。\n最後の　レスは、1000日前。");
			await s.narrate("……いや。勢い欄だけが、\nいまも　動いている。");
			await K(s, "ねこの　声しか、しないンゴ");
			if (front(s, "feris")) await s.say("feris", "ねこ〜！　いっぱい〜！");
			if (front(s, "roze")) await s.say("roze", "……犬は、アルか？");
			await K(s, "犬猫（犬とは　言ってない）ンゴ");
		},
	},
	warp(
		"to_kaso",
		8,
		13,
		{ map: "kaso", x: 4, y: 3, dir: "down" },
		{ se: "door" },
	),
	{
		id: "ikioi_l",
		x: 9,
		y: 3,
		trigger: "talk",
		fixedDir: true,
		run: ikioiRun,
	},
	{
		id: "ikioi_r",
		x: 10,
		y: 3,
		trigger: "talk",
		fixedDir: true,
		run: ikioiRun,
	},
	...CAT.map((_, i) => cat(i)),
	stray("stray1", 4, 7),
	stray("stray2", 12, 10, "にゃーん"),
	stray("stray3", 14, 2, "……にゃ"),
	lockedDoor("house_l", 3, 5, "表札に『ぬこ』。\nカギが　かかっている。"),
	lockedDoor(
		"house_r",
		14,
		5,
		"表札に『犬』。……犬は　いない。\nカギが　かかっている。",
	),
	look("sign", 6, 11, "ようこそ　犬猫大好き板へ\n人口：0（ねこを　のぞく）"),
	look("bench", 2, 8, "ベンチに、ねこの　毛。\n……何匹ぶん　だろう。"),
	look(
		"bench2",
		15,
		8,
		"ベンチの　下で、猫が　ねている。\nすずは　つけていない。",
	),
	...chest("neko1", 16, 11, "candy", 2),
	...chest("neko2", 1, 2, "namajake", 1),
];

export const neko: MapDef = {
	id: "neko",
	name: "犬猫大好き板",
	bgm: "town",
	tiles: { ...TOWN, ",": { ...TOWN[","], encounter: true } },
	encounters: { rate: 0.06, groups: ["g_neko1", "g_neko2"] },
	// 18×14。北に 家が 2軒と 勢い欄 (9,3)(10,3)。柵が 2列（すきま：y6 は x1・x6・x15,16、y9 は x1,2・x10）。
	// 南の 柵の すきま (8,13) → 過疎板の底
	rows: [
		"||||||||||||||||||", // y0
		"|,,,,,,,,,,,,,,,,|", // y1
		"|,nnn,,,,,,,,nnn,|", // y2  宝箱 (1,2)
		"|,^^^,,,,Kk,,^^^,|", // y3  勢い欄 (9,3)(10,3)
		"|,%W%,,,,::,,%W%,|", // y4  猫 (6,4)→(9,4)
		"|,#D#,,,,::,,#D#,|", // y5  扉 (3,5)(14,5)
		"|,||||,||||||||,,|", // y6  柵。すきま (1,6)(6,6)(15,6)(16,6)
		"|,,,,,,,,,,,,,,,,|", // y7  猫 (15,7)
		"|,Bb,,,,T,,,,,Bb,|", // y8  ベンチ・木
		"|,,|||||||,|||||||", // y9  柵。すきま (1,9)(2,9)(10,9)
		"|,,,,,,,,,,,,,,,,|", // y10 猫 (2,10)
		"|,,,,,,!,,,,,,,,,|", // y11 看板 (6,11)・猫 (8,11)・宝箱 (16,11)
		"|,,,,,,,,,,,,,,,,|", // y12 到着 (8,12)
		"||||||||.|||||||||", // y13 出口 (8,13) → kaso
	],
	events,
};
