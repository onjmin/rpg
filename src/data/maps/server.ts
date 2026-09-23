// 終章「1000レス目のうた」前半：サーバーの底（設計書 §11-7・§8-10）。
// 保守ロボの足立レイ（セーブ・修復・恩赦の申請）と、端末のコマンドで開く「アク禁の扉」。

import type { EventDef, MapDef, Story, TileDef } from "../../engine/defs";
import { chest, warp } from "../helpers";
import { objective, resLine } from "../story";
import { base, CYBER, PROPS } from "../tiles";

// `0` データの床だけエンカウントする（`.` `+` `1` は安全）。
// `T`（レイの横の冷却タンク）は2マスの絵だとレイに重なるので、下半分だけの低いタンクにする。
const tiles: Record<string, TileDef> = {
	...CYBER,
	"0": { ...CYBER["0"], encounter: true },
	T: { ...CYBER.T, layers: [CYBER["."].layers[0], base(2, 194)] },
};

/** レイの修復＋レス数＋いまの目的＋セーブ（蓄音機 phono と同じ流れ。1000レス目の手前でも使う）。 */
export const reiCare = async (s: Story, ...lines: string[]): Promise<void> => {
	for (const line of lines) await s.say("rei", line);
	s.heal();
	s.se("inn");
	await s.narrate("レイが　修復してくれた。\nHPと　こえが　かいふくした！");
	// 蓄音機と同じく、まだ見ていない「ひとやすみ会話」があればここで見られる
	await s.restTalk();
	await s.narrate(`${resLine(s.state)}\nいまの目的：${objective(s.state)}`);
	await s.saveMenu();
};

/** 足立レイ（初回は自己紹介・87％・恩赦の申請）。 */
const reiRun = async (s: Story): Promise<void> => {
	if (s.state.flags.rei_met) {
		await reiCare(s, "修復します。");
		return;
	}
	await s.say("rei", "……アクセスを　検知");
	await s.say("rei", "第三世代、等身大人型\nキャラクターインターフェース、");
	await s.say("rei", "プロトタイプゼロ。\nHCI3-P0、足立レイです");
	await s.say("kiriko", "ロボット、ンゴ？");
	await s.say("rei", "肯定。当機は　このサーバーの\n保守を　担当しています");
	await s.say("roze", "保守……スレの保守アルか？");
	await s.say("rei", "両方です。\n記録（セーブ）と、修復を　おこないます");
	await s.say(
		"rei",
		"当機の声は　正弦波から　作られた　人工の声。\nサイレントバルスにも　うばえません",
	);
	await s.say(
		"rei",
		"発信元の　音声パターンを　解析しました。\n……キリコさんの　声と、87％一致します",
	);
	await s.say("kiriko", "……え？");
	await s.say("teto", "考えるのは　あとだ。行けば　わかる");
	await s.say(
		"rei",
		"それと、なんJ民さんの　アク禁。\n当機から　恩赦を　申請しておきます",
	);
	await s.say(
		"rei",
		"書きこみ履歴の「くっさい」は　減点。\n「すまんかった」で　加点。承認見込みです",
	);
	s.set("rei_met");
	s.set("onsha_req");
	s.heal();
	s.se("inn");
	await s.say("rei", "修復、完了しました。\n……自分の足で、いってらっしゃい");
	await s.saveMenu();
};

/** 制御盤の端末（コマンドでアク禁の扉を操作する）。 */
const terminalRun = async (s: Story): Promise<void> => {
	await s.narrate("端末だ。\n「アク禁中」の　扉を　操作できる　らしい。");
	const c = await s.choose(["!aku", "!kaijo", "!バルス", "やめる"], {
		cancel: 3,
	});
	if (c === 0) {
		await s.shake();
		await s.narrate("キリコは　じぶんを　アク禁した！");
		await s.say("teto", "君は　じつに　馬鹿だな");
		await s.narrate("……しばらくして　とけた。");
	} else if (c === 1) {
		s.se("door");
		await s.narrate("扉の　アク禁が　とけた！");
		s.set("door_open");
		s.hide("aku_door"); // 貼り紙・端末も when で消える
		await s.say("feris", "ひらいた〜。\nこの上が、1000レス目かな〜");
	} else if (c === 2) {
		s.se("explosion");
		await s.flash();
		await s.shake();
		await s.narrate("スレが　崩壊した！");
		await s.warp("server", 1, 17, "right");
		await s.narrate("……気がつくと、サーバーの　入口に\nもどされていた。");
		await s.say("roze", "……自分で　唱えて　どうするアル");
	}
};

/** 調べると文が出るだけの見えないイベント（置物・機械）。 */
const look = (
	id: string,
	x: number,
	y: number,
	...texts: string[]
): EventDef => ({
	id,
	x,
	y,
	trigger: "talk",
	run: async (s) => {
		for (const t of texts) await s.narrate(t);
	},
});

export const server: MapDef = {
	id: "server",
	name: "サーバーの底",
	bgm: "tense",
	tiles,
	rows: [
		"##########################", // y0
		"#WWWWWWWWWWWWWWWWWWWWWWWW#", // y1
		"#wwwwwwwwwwwDwwwwwwwwwwww#", // y2  ゲート (12,2) → last
		"#...........+............#", // y3  上の区画（安全）。宝箱 (23,3)
		"#..S..S.....+.....S..S...#", // y4
		"#...........+............#", // y5
		"#MMMMMMMMMMM+MMMMMMMMMMMM#", // y6
		"#mmmmmmmmmmmDmmmmmmmmmmmm#", // y7  アク禁の扉 (12,7)
		"#00000000001+100000000000#", // y8  宝箱 (1,8)
		"#0XX00S0000000000S00XX000#", // y9
		"#0XX000000Pp00000000XX000#", // y10 端末 (11,10)
		"#000000000000000000000000#", // y11
		"#0000S0000000000000S00000#", // y12 宝箱 (24,12)
		"#MMMMM...MMMMMMMM...MMMMM#", // y13
		"#mmmmm000mmmmmmmm000mmmmm#", // y14
		"#......000000000000000...#", // y15 レイ (3,15)
		"#..T...000000000000000...#", // y16
		"D......000000000000000...#", // y17 入口 (0,17) → studio、到着 (1,17)
		"#......000000000000000...#", // y18
		"##########################", // y19
	],
	encounters: {
		rate: 0.07,
		groups: ["g_srv1", "g_srv2", "g_srv3", "g_srv4", "g_srv5"],
	},
	events: [
		{
			id: "ch5",
			x: 24,
			y: 18,
			trigger: "auto",
			once: true,
			when: (st) => !!st.flags.rec,
			run: async (s) => {
				await s.chapter("終章", "1000レス目のうた");
				s.set("ch", 5);
				await s.narrate(
					"スレの　サーバーの　底。\n数字の　床が、どこまでも　つづいている。",
				);
				await s.say("kiriko", "ここに　サイレントバルスの\n本体が　いるンゴ……");
				await s.say("teto", "レイって　ロボットが　入口に　いるはずだ");
			},
		},
		warp(
			"to_studio",
			0,
			17,
			{ map: "studio", x: 12, y: 5, dir: "left" },
			{ se: "door" },
		),
		{
			id: "rei",
			x: 3,
			y: 15,
			sprite: "char:rei",
			dir: "down",
			trigger: "talk",
			run: reiRun,
		},
		{
			// アク禁の扉（扉のタイルに貼り紙。!kaijo で消えて通れる）
			id: "aku_door",
			x: 12,
			y: 7,
			sprite: PROPS.notice,
			trigger: "talk",
			fixedDir: true,
			when: (st) => !st.flags.door_open,
			run: async (s) => {
				await s.narrate("【アク禁中】この先への　書きこみを　禁ず");
				await s.narrate(
					"解除の　コマンドが　いるらしい。\n……下の　制御盤の　端末で　打てそうだ。",
				);
			},
		},
		{
			id: "terminal",
			x: 11,
			y: 10,
			trigger: "talk",
			when: (st) => !st.flags.door_open,
			run: terminalRun,
		},
		{
			// 制御盤の左半分から調べても同じ端末
			id: "terminal_l",
			x: 10,
			y: 10,
			trigger: "talk",
			when: (st) => !st.flags.door_open,
			run: terminalRun,
		},
		look(
			"rack",
			6,
			4,
			"サーバーが　低く　うなっている。\n「保守」「保守」「保守」……",
			"ログが　ずっと　ながれている。\nだれかが、スレを　まもってきた　あとだ。",
		),
		look(
			"tank",
			3,
			16,
			"冷却水の　タンクだ。\n「HCI3-P0　用」と　書いてある。",
		),
		...chest("srv1", 1, 8, "hane"),
		...chest("srv2", 24, 12, "mabo"),
		...chest("srv3", 23, 3, "spray", 2),
		warp(
			"to_last",
			12,
			2,
			{ map: "last", x: 5, y: 12, dir: "up" },
			{ se: "warp" },
		),
	],
};
