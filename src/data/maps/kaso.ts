// 過疎板の底（裏シナリオ「過疎板探検」の 入口。data/kaso.ts に 全体の 流れ）。
// 過去ログ倉庫の 北東の 階段（避難Jの ログを 掘ってから）と、サーバーの底の となりの ラックから 来る。
// おーぷんの 約900の 専門板の サーバー室。モニターが ずらりと ならんで、ほとんど 消えている。
//
// 上の壁に 4つの 板の 扉（どれも おーぷんに 実在する 板。おんJ の「1ヶ月間過疎板巡り」スレから）：
// 犬猫大好き板（いつでも）・料理板（のれんの 声に 返事を して ひらく）・
// 天文・気象板（第三章の あと。それまでは 503）・実験板（第四章の 音が 消えた夜から。それまでは 音声認証）。
// まんなかの モニター 6列×3段（data/kaso.ts の MONITORS）。板を 終えると その板の モニターが 点く。
// 避難Jの モニターは 暗いまま。3つの 手がかり（同じ段・同じ列・右上）で 当てる。
// 当てても、実験板で 回線（sen_line）を つなぐまでは 行けない。
// ヒナリーが 研究中（倉庫の ヒナリーと 同じ人。立て逃げの 研究者）。手がかりを 発表してくれる。
// 研究の 背骨は 蓄音キリコの レスの 数（「……数が、合いません」）。沈んだ レス4件を 拾った 数で 中間報告。

import type { EventDef, GameState, MapDef, Story } from "../../engine/defs";
import { npc, warp } from "../helpers";
import {
	boardsDone,
	front,
	K,
	look,
	MONITOR_COLS,
	MONITOR_ROWS,
	MONITORS,
	SUNK,
	sunkCount,
} from "../kaso";
import { SPR } from "../sprites";
import { phono } from "../story";
import { CYBER, PROPS } from "../tiles";

const MX = (col: number) => 3 + col * 2;
const MY = (row: number) => 5 + row * 2;

/** 板の 扉（上の壁。触れると その板へ）。 */
const door = (
	id: string,
	x: number,
	to: { map: string; x: number; y: number },
	gate?: (s: Story) => Promise<boolean>,
): EventDef => ({
	id,
	x,
	y: 2,
	trigger: "touch",
	through: true,
	run: async (s) => {
		if (gate && !(await gate(s))) {
			await s.move("player", "d");
			return;
		}
		await s.warp(to.map, to.x, to.y, "up", { se: "door" });
	},
});

/** 料理板の のれん：「いらっしゃい」に 返事を しないと 通れない。 */
const aisGate = async (s: Story): Promise<boolean> => {
	if (s.flag("ais_open")) return true;
	await s.narrate("のれんの　むこうから、声がした。\n『……いらっしゃい』");
	const c = await s.choose(
		["おじゃまします", "こんにちは", "だまって　入る", "やめる"],
		{ cancel: 3 },
	);
	if (c === 3) return false;
	if (c === 2) {
		s.se("miss");
		await s.narrate("のれんが、ふわりと　下りて\n道を　ふさいだ。");
		if (front(s, "roze"))
			await s.say("roze", "……お店アル。あいさつは　するアル");
		return false;
	}
	s.se("decide");
	await K(s, c === 0 ? "おじゃまします、ンゴ" : "こんにちは、ンゴ");
	await s.narrate("『お客さんだ』\nのれんが、すっと　上がった。");
	s.set("ais_open");
	return true;
};

/** 天文・気象板の 扉：第三章の ナイターが 終わるまで こみあっている。 */
const hosGate = async (s: Story): Promise<boolean> => {
	if (s.flag("b3")) {
		if (!s.flag("hos_open")) {
			s.set("hos_open");
			await s.narrate("扉の　表示が　消えている。\n……こみあいは、おさまった。");
		}
		return true;
	}
	await s.narrate(
		"【503】ただいま　こみあっています。\nナイターが　終わるまで　お待ちください",
	);
	if (front(s, "roze")) await s.say("roze", "……どこの　板も、野球アルか");
	return false;
};

/**
 * 実験板の 扉：音の あるうちは ひらかない。
 * 着くのは 声が もどった あとなので、音声認証は キリコの 声で とおる（登録は キリコが 生まれる 前の 時刻）。
 */
const senGate = async (s: Story): Promise<boolean> => {
	if (s.flag("balus_lost")) {
		if (!s.flag("sen_open")) {
			s.set("sen_open");
			await s.narrate("【音声認証】……一致：蓄音キリコ\n登録：8月18日　0時21分");
			await K(s, "……吾輩、まだ　生まれて\nないンゴ");
			await s.narrate("扉が、ひらいた。");
		}
		return true;
	}
	await s.narrate("【音声認証】音の　あるうちは\nひらきません。");
	await K(s, "……音の　ない　とき、って\nいつンゴ？");
	return false;
};

/** 板の名前の 札（扉の 右の 壁）。 */
const plate = (id: string, x: number, text: string): EventDef =>
	look(id, x, 2, text);

// ───────────────── モニター（900の板） ─────────────────

const BOARD_NAME: Record<string, string> = {
	neko: "犬猫大好き板",
	ais: "料理板",
	hos: "天文・気象板",
	sen: "実験板",
};

const monitor = (col: number, row: number): EventDef[] => {
	const x = MX(col);
	const y = MY(row);
	const board = Object.entries(MONITORS).find(
		([id, [c, r]]) => id !== "hinan" && c === col && r === row,
	)?.[0];
	const isHinan = MONITORS.hinan[0] === col && MONITORS.hinan[1] === row;
	const lit = (st: GameState) => !!board && !!st.flags[`${board}_done`];
	return [
		{
			// 消えた モニター
			id: `mon_${col}_${row}`,
			x,
			y,
			sprite: PROPS.monitor,
			trigger: "talk",
			fixedDir: true,
			when: (st) => !lit(st),
			run: async (s) => {
				if (board) {
					await s.narrate(`暗い　モニター。\n札に『${BOARD_NAME[board]}』。`);
					return;
				}
				if (isHinan) {
					if (!s.flag("sen_line")) {
						await s.narrate(
							"暗い　モニター。\n……かすかに、ランプが　またたいた？",
						);
						await K(s, "……回線が、つながって　ないンゴ");
						return;
					}
					s.se("decide");
					await s.narrate("モニターが、ぽつりと　ついた。\n『避難J』。");
					if (!s.flag("hinan_found")) {
						s.set("hinan_found");
						await s.narrate(
							"ほかの　899この　板の　あいだで、\nひとつだけ　灯りが　ついている。",
						);
						if (front(s, "roze")) await s.say("roze", "……過疎板探検アルか");
					}
					if (
						(await s.choose(["つないで　みる", "やめておく"], {
							cancel: 1,
						})) === 1
					)
						return;
					await s.warp("hinan", 7, 10, "up", { se: "warp" });
					return;
				}
				await s.narrate("暗い　モニター。\n最後の　レスは、1000日より　前。");
				if (!s.flag("sen_line")) return;
				// 回線が ついたあとの 外れ：過疎が しみだす
				await s.narrate("……画面の　おくから、\nしずけさが　しみだしてきた。");
				await s.battle("g_kaso_dark");
			},
		},
		{
			// 点いた モニター（板を 終えたあと）
			id: `mon_${col}_${row}_on`,
			x,
			y,
			sprite: PROPS.monitorBars,
			trigger: "talk",
			fixedDir: true,
			when: (st) => lit(st),
			run: async (s) => {
				await s.narrate(
					`モニターが　ついている。\n『${BOARD_NAME[board ?? "neko"]}』。`,
				);
			},
		},
	];
};

// ───────────────── ヒナリー（研究中） ─────────────────

/** 手がかり。板を 終えた 順に ひとつずつ ふえる。 */
const CLUES: [flag: string, text: string][] = [
	["neko_done", "避難Jは、犬猫大好き板と　同じ　段に\nならんでいる　模様です"],
	["ais_done", "避難Jは、料理板と　同じ　列に\nならんでいる　模様です"],
	["hos_done", "避難Jは、天文・気象板の　右上に\nある　模様です"],
];

/** 研究の 中間報告：沈んだ レス（data/kaso.ts の sunkCount）。最終発表は 床下で。 */
const sunkReport = async (s: Story): Promise<void> => {
	if (s.flag("ura_101")) {
		await s.say("hinary", "研究の　発表は、床下で\n終わりました");
		return;
	}
	const k = sunkCount(s);
	if (!k) return;
	await s.say(
		"hinary",
		`中間報告です。沈んだ　レス、\n${k}件　見つかった　模様です`,
	);
	if (k >= SUNK.length) await s.say("hinary", "……それでも、数が　合いません");
};

const hinaryRun = async (s: Story): Promise<void> => {
	const n = boardsDone(s.state);
	if (!s.flag("kaso_hinary")) {
		s.set("kaso_hinary");
		await s.say("hinary", "……避難Jを研究しているヒナリーです。");
		if (front(s, "feris")) await s.say("feris", "ヒナリーちゃん、ここにも〜？");
		await s.say("hinary", "蓄音キリコさんの　レスを\n数えています");
		await s.say("hinary", "……数が、合いません");
		await K(s, "……吾輩の、レス　ンゴ？");
		if (sunkCount(s) < SUNK.length)
			await s.say(
				"hinary",
				`足りないのは　${SUNK.length - sunkCount(s)}件。\nほかの　板に　沈んでいる　模様です`,
			);
		else await sunkReport(s);
		await s.say(
			"hinary",
			"ここは　おーぷんの　ほかの板の\nサーバー室の　模様です",
		);
		await s.say(
			"hinary",
			"板は　約900。モニターは\nぜんぶで　18しか　見えません",
		);
		await s.say("hinary", "避難Jの　モニターは、\nこの　どれかです。……たぶん");
		await K(s, "……たぶん、ンゴ？");
		await s.say(
			"hinary",
			"板を　ひとつ　調べ終えるたび、\n手がかりを　発表します",
		);
		await s.say(
			"hinary",
			"まずは　犬猫大好き板が　安全の　模様です。\n以後、お見知りおきを。",
		);
		return;
	}
	if (s.flag("hinan_found")) {
		await s.say("hinary", "避難Jの　モニター、\n当たった　模様です");
		await s.say("hinary", "……サンキューヒッナ、は\n自分では　言いません");
		await sunkReport(s);
		return;
	}
	const clues = CLUES.filter(([f]) => s.flag(f));
	if (!clues.length) {
		await s.say("hinary", "本日の　研究成果：\n点いた　モニター、0こ");
		await sunkReport(s);
		await s.say("hinary", "犬猫大好き板から　どうぞ。\n以後、お見知りおきを。");
		return;
	}
	await s.say("hinary", `本日の　研究成果：\n点いた　モニター、${n}こ`);
	for (const [, t] of clues) await s.say("hinary", t);
	await sunkReport(s);
	if (n >= 2 && !s.flag("balus_lost"))
		await s.say(
			"hinary",
			"右の　扉は、音の　ない　夜に　ひらく\n模様です。……来ない　ほうが　いい　夜ですが",
		);
	if (n >= 3 && !s.flag("sen_line"))
		await s.say(
			"hinary",
			"モニターを　当てても、回線が　ないと\nつながらない　模様です",
		);
	if (n >= 3 && !s.flag("sen_done"))
		await s.say("hinary", "回線は、実験板の　おくに\nある　模様です");
	await s.say("hinary", "これで　発表を　終わりたいと\n思います");
};

// ───────────────── マップ ─────────────────

const monitors: EventDef[] = [];
for (let r = 0; r < MONITOR_ROWS; r++)
	for (let c = 0; c < MONITOR_COLS; c++) monitors.push(...monitor(c, r));

const events: EventDef[] = [
	{
		id: "arrive",
		x: 9,
		y: 13,
		trigger: "auto",
		once: true,
		run: async (s) => {
			s.set("kaso_in");
			await s.narrate(
				"おーぷんの、ほかの　板の　サーバー室。\n札に『livejupiter　以外　ぜんぶ』。",
			);
			await s.narrate(
				"モニターが　ずらりと　ならんで、\nほとんど　消えている。",
			);
			await K(s, "……900の　板、ンゴ？");
			if (front(s, "roze"))
				await s.say("roze", "そのほとんどに、だれも　いないアル");
			if (front(s, "feris")) await s.say("feris", "しーん、ってしてる〜");
			if (front(s, "nanj"))
				await s.say(
					"nanj",
					"おんJも、昔は　こういう板を\n遊びで　侵略しとったんや",
				);
			await s.narrate("白衣の　子が、モニターの　前で\nなにかを　数えている。");
		},
	},
	// 出入口
	warp(
		"to_kakolog",
		9,
		14,
		{ map: "kakolog", x: 19, y: 5, dir: "down" },
		{ se: "stairs" },
	),
	warp(
		"to_server",
		18,
		12,
		{ map: "server", x: 17, y: 10, dir: "down" },
		{ se: "door" },
	),
	look(
		"srv_door_look",
		18,
		12,
		"東の　扉。\nとなりの　サーバー室（livejupiter）へ。",
	),
	// 板の 扉と 札
	door("d_neko", 4, { map: "neko", x: 8, y: 12 }),
	plate(
		"p_neko",
		5,
		"『犬猫大好き板』\n人口：0（ねこを　のぞく。犬は　いない）",
	),
	door("d_ais", 8, { map: "aisatsu", x: 8, y: 12 }, aisGate),
	plate("p_ais", 9, "『料理板』\nのれんが　かかっている。『いらっしゃい』"),
	door("d_hos", 12, { map: "hoshu", x: 10, y: 14 }, hosGate),
	plate("p_hos", 13, "『天文・気象板』\n今日の　空の　写真。……最後は　3日前"),
	door("d_sen", 16, { map: "sentori", x: 9, y: 14 }, senGate),
	plate("p_sen", 17, "『実験板（ヤンゴン）』\n書きこみの　テストは　ここで"),
	...monitors,
	npc("hinary_k", 15, 6, SPR.hinary, hinaryRun, { dir: "left" }),
	phono("phono_kaso", 16, 11),
	look(
		"rack_look",
		1,
		11,
		"サーバーラック。\n札に『保守：風吹けば名無し』。",
		"……ほこりは、つもっていない。",
	),
];

export const kaso: MapDef = {
	id: "kaso",
	name: "過疎板の底",
	bgm: "secret",
	tiles: CYBER,
	// 20×15。上の壁に 4つの 扉、まんなかに モニター 6列×3段（x = 3,5,…,13 / y = 5,7,9）。
	// 南 (9,14) → 過去ログ倉庫の 階段、東の 扉 (18,12) → サーバーの底の となりの ラック
	rows: [
		"####################", // y0
		"#WWWWWWWWWWWWWWWWWW#", // y1
		"#wwwDwwwDwwwDwwwDww#", // y2  扉 (4,2)(8,2)(12,2)(16,2)
		"#..................#", // y3
		"#..................#", // y4
		"#..................#", // y5  モニター 段0
		"#..................#", // y6  ヒナリー (15,6)
		"#..................#", // y7  モニター 段1
		"#..................#", // y8
		"#..................#", // y9  モニター 段2
		"#..................#", // y10
		"#S................S#", // y11 ラック (1,11)・蓄音機 (16,11)
		"#.................D#", // y12 東の扉 (18,12) → server（到着は 手前の (17,12)）
		"#..................#", // y13 到着 (9,13)
		"#########.##########", // y14 階段 (9,14) → kakolog
	],
	events,
};
