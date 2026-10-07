// 実験板（裏シナリオ「過疎板探検」の 4枚目。過疎板の底の 右の 扉。第四章の 音が 消えた夜から ひらく）。
// おーぷんに 実在する 板（ヤンゴン）。書きこみの テストを する板で、「open分析スレ ヤンゴン出張所」が
// おーぷんの 統計を 毎日 記録している（おんJ の「1ヶ月間過疎板巡り」スレ >>4）。
// ゲームでは 1000取り合戦（創作）が 立ったまま、だれも 1000に とどかなく なった 板。
// 手前の 部屋：数字の スイッチ（+500 +300 +200 +100 +90 +9）を 調べて 点けたり 消したり。
//   合計が ちょうど 999 で 扉が ひらく（sen_999）。1000を こえると「ゲッター試作」が わいて、ぜんぶ 消える。
// 通路：ksk の シンボル敵。
// おく：勢い欄の『1000取り合戦 part∞ 990/1000』で、bot「ksk」と 1000の 取り合い（別のゲーム。石取り）。
//   ひとりが 書けるのは 1〜3レス。1000を 書いた ほうの 勝ち。勝つと ksk が あばれる（中ボス）。
//   そのあと 端末に 1000ゲッターの 作成ログ：「作：風吹けば名無し　回線：避難J」。bot は 避難Jの 住民が 置いたもの。
//   回線が つながり（sen_line）、過疎板の底の 避難Jの モニターから 行ける ように なる。
//   端末の 下には 沈んだ レス（沈んだレス >>111。111歳）。
// フラグ：sen_p<値>（スイッチ）・sen_999・sen_won（取り合いに 勝った）・sen_line・sen_done

import type { EventDef, GameState, MapDef, Story } from "../../engine/defs";
import { chest, warp } from "../helpers";
import { front, giveSunk, has, K, look, sunkHad } from "../kaso";
import { SPR } from "../sprites";
import { symbol } from "../story";
import { CYBER, PROPS } from "../tiles";

// ───────────────── 999 の スイッチ ─────────────────

const PADS: [value: number, x: number, y: number][] = [
	[500, 3, 13],
	[300, 8, 13],
	[200, 13, 13],
	[100, 3, 15],
	[90, 8, 15],
	[9, 13, 15],
];

const padOn = (st: GameState, v: number): boolean => !!st.flags[`sen_p${v}`];
const padSum = (st: GameState): number =>
	PADS.reduce((n, [v]) => n + (padOn(st, v) ? v : 0), 0);

/** 数字の スイッチ（調べると 点いたり 消えたり。光る 床の 上に 立っている）。 */
const pad = ([v, x, y]: (typeof PADS)[number]): EventDef => ({
	id: `pad${v}`,
	x,
	y,
	sprite: PROPS.console,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		if (s.flag("sen_999")) {
			await s.narrate(
				`スイッチ（+${v}）。\n……カウンターは　999 で　止まっている。`,
			);
			return;
		}
		const on = !padOn(s.state, v);
		s.set(`sen_p${v}`, on);
		s.se(on ? "decide" : "cancel");
		const sum = padSum(s.state);
		await s.narrate(
			`スイッチ（+${v}）を　${on ? "入れた" : "切った"}。\nカウンター：${sum}`,
		);
		if (sum === 999) {
			s.set("sen_999");
			s.se("levelup");
			await s.narrate(
				"カウンターが　999 で　止まった。\n……おくの　扉が　ひらいた。",
			);
			await K(s, "1000の　手前で、止めるンゴ");
			return;
		}
		if (sum >= 1000) {
			s.se("shock");
			await s.shake(300);
			await s.narrate(
				"カウンターが　1000 を　こえた！\n……ゲッターが　わいた！",
			);
			await s.battle("g_sen_getter");
			for (const [w] of PADS) s.set(`sen_p${w}`, false);
			await s.narrate("スイッチが　ぜんぶ　切れた。\nカウンター：0");
		}
	},
});

/** カウンターの 表示（右の壁）。 */
const counter: EventDef = {
	id: "counter",
	x: 17,
	y: 14,
	sprite: PROPS.monitor,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		if (s.flag("sen_999")) {
			await s.narrate("カウンター：999\n『あと　1。……だれが　書く？』");
			return;
		}
		await s.narrate(
			`カウンター：${padSum(s.state)}\n『ちょうど　999 で　止めろ』`,
		);
		await s.narrate("『1000 を　こえた者は、\nゲッターの　エサに　なる』");
	},
};

/** おくへの 扉（sen_999 まで）。 */
const gate: EventDef = {
	id: "sen_gate",
	x: 10,
	y: 11,
	trigger: "touch",
	through: true,
	when: (st) => !st.flags.sen_999,
	run: async (s) => {
		await s.narrate("扉は　ひらかない。\n『カウンターを　999 に　せよ』");
		await s.move("player", "d");
	},
};

// ───────────────── 1000取り合戦（別のゲーム） ─────────────────

/** bot の 手。残りが 4の倍数なら（負けの 形）でたらめ、それ以外は 残りを 4の倍数に する。 */
const botMove = (n: number): number => {
	const left = 1000 - n;
	const m = left % 4;
	if (m === 0) return 1 + Math.floor(Math.random() * 3);
	return Math.min(m, left);
};

const race = async (s: Story): Promise<boolean> => {
	let n = 990;
	await s.narrate("990　名前：ksk\nここから　先、1〜3レスずつ　やで");
	for (;;) {
		const c = await s.choose(
			["1レス　書く", "2レス　書く", "3レス　書く", "やめる"],
			{ cancel: 3 },
		);
		if (c === 3) {
			await s.narrate("キリコは　画面から　はなれた。");
			return false;
		}
		const k = c + 1;
		n = Math.min(1000, n + k);
		s.se("cursor");
		await s.narrate(`キリコが　${k}レス　書いた。\n……${n}/1000`);
		if (n >= 1000) return true;
		const m = botMove(n);
		n = Math.min(1000, n + m);
		s.se("cursor");
		await s.narrate(`ksk が　${m}レス　書いた。\n……${n}/1000`);
		if (n >= 1000) {
			s.se("miss");
			await s.narrate("1000　名前：ksk\nksk");
			await K(s, "……取られたンゴ");
			await s.say(null, "990 から　やりなおしや", { name: "ksk" });
			if ((await s.choose(["もういちど", "やめる"], { cancel: 1 })) === 1)
				return false;
			n = 990;
			await s.narrate("990　名前：ksk\nここから　先、1〜3レスずつ　やで");
		}
	}
};

const ikioiRun = async (s: Story): Promise<void> => {
	if (s.flag("sen_won")) {
		await s.narrate(
			"1 open分析スレ　ヤンゴン出張所\n2 【1000取り合戦】part∞　1000/1000",
		);
		await s.narrate("1000　名前：蓄音キリコ");
		return;
	}
	await s.narrate(
		"1 open分析スレ　ヤンゴン出張所\n2 【1000取り合戦】part∞　990/1000",
	);
	await s.narrate(
		"1：おーぷんの　人数を　毎日　数えている。\n……書きこまず、見るだけに　しておこう。",
	);
	await s.narrate(
		"2の　ルール：ひとり　1〜3レスずつ。\n1000 を　書いた者の　勝ち。",
	);
	await s.say(null, "お、人や。1000取り　やろうや", { name: "ksk" });
	await s.say(null, "ワイが　1000日　待っとった　相手や。\n……負けんで", {
		name: "ksk",
	});
	if (front(s, "roze"))
		await s.say("roze", "……相手は　bot アル。\n数を　よく　考えるアル");
	if (!(await race(s))) return;
	s.se("levelup");
	await s.narrate("1000　名前：蓄音キリコ\n……取ったンゴ");
	await s.say(null, "…………", { name: "ksk" });
	await s.say(null, "ksk　ksk　ksk　ksk　ksk", { name: "ksk" });
	s.se("shock");
	await s.shake(300);
	await s.narrate("ksk が　スレから　とびだしてきた！");
	await s.battle("g_senboss");
	await s.narrate("ksk は　画面に　もどって、\nしずかに　なった。");
	await s.say(null, "……ええ　1000や。1000日ぶりや", { name: "ksk" });
	s.set("sen_won");
	await s.narrate("となりの　端末が、ついた。");
};

/** 端末：1000ゲッターの 作成ログ（裏返し その1）。 */
const terminalRun = async (s: Story): Promise<void> => {
	if (!s.flag("sen_won")) {
		await s.narrate("消えた　端末。\n……スレが　終わるまで、動かない。");
		return;
	}
	if (s.flag("sen_done")) {
		await s.narrate("端末。『避難J：接続中』");
		return;
	}
	await s.narrate("端末。\n『1000ゲッター　ver.998　作成ログ』");
	await K(s, "……1000ゲッター？");
	await s.narrate("『999 が　書かれたら　わいて、\n1000 を　横取りする　bot』");
	await s.narrate("『作：風吹けば名無し\n回線：避難J』");
	await s.narrate(
		"『メモ：ワイの　スレで、1000 を\n取らせるな。……ワイにも、や』",
	);
	await K(s, "……ワイ、ンゴ？");
	if (has(s, "roze"))
		await s.say("roze", "猛虎弁アル。\n……避難Jの、だれかアル");
	if (has(s, "feris"))
		await s.say("feris", "ヒナリーちゃんの　言ってた、\n住民1名〜？");
	await K(s, "自分で、1000 を　取れない\nように　したンゴ……？");
	s.se("decide");
	await s.narrate("端末が、回線を　つないだ。\n『避難J：接続』");
	s.set("sen_line");
	await s.narrate("端末の　下から、\n紙きれが　1枚　のぞいている。");
	if (!(await sunkHad(s, "sunk_111", 111))) {
		await s.narrate("111　111歳");
		await giveSunk(s, "sunk_111", 111);
	}
	s.set("sen_done");
	await s.narrate("どこかで、モニターが　ひとつ\nついた　気がした。");
	await K(s, "……避難Jへ　行くンゴ。\nこの　人に、会いに");
};

const events: EventDef[] = [
	{
		id: "arrive",
		x: 9,
		y: 16,
		trigger: "auto",
		once: true,
		run: async (s) => {
			await s.narrate("実験板。\n最後の　レスは、1000日前。");
			await s.narrate(
				"床に、数字の　スイッチが　ならんでいる。\n壁の　カウンターは　0。",
			);
			await K(s, "……書きこみの　テストを　する板、ンゴ");
			if (front(s, "roze"))
				await s.say(
					"roze",
					"テストだけして、だれも\n書きに　来なくなった　板アル",
				);
		},
	},
	warp(
		"to_kaso",
		9,
		17,
		{ map: "kaso", x: 16, y: 3, dir: "down" },
		{ se: "door" },
	),
	...PADS.map(pad),
	counter,
	gate,
	look(
		"rule",
		1,
		11,
		"板ルール\n一、書きこみの　テストは　ここで",
		"二、1000 を　取る　以外の　テストは\n　　ほかの　板で",
	),
	// 通路の ksk
	symbol("ksk1", 4, 8, SPR.e_ksk, "g_sen_sym1", "ksk　ksk　ksk", "ksk"),
	symbol("ksk2", 15, 9, SPR.e_kskst, "g_sen_sym2", "kskst　kskst", "kskst"),
	// おく
	{
		id: "ikioi_l",
		x: 9,
		y: 2,
		trigger: "talk",
		fixedDir: true,
		run: ikioiRun,
	},
	{
		id: "ikioi_r",
		x: 10,
		y: 2,
		trigger: "talk",
		fixedDir: true,
		run: ikioiRun,
	},
	{
		id: "terminal",
		x: 14,
		y: 2,
		trigger: "talk",
		fixedDir: true,
		run: terminalRun,
	},
	...chest("sen1", 1, 4, "pan", 1),
	...chest("sen2", 18, 8, "spray", 2),
];

export const sentori: MapDef = {
	id: "sentori",
	name: "実験板",
	bgm: "tense",
	tiles: { ...CYBER, ".": { ...CYBER["."], encounter: true } },
	encounters: { rate: 0.05, groups: ["g_sen1", "g_sen2"] },
	// 20×18。北の 壁に 勢い欄 Qq (9,2)(10,2) と 端末 P (14,2)。おくの 部屋 y3〜5、通路 y8〜9、スイッチの 部屋 y12〜16。
	// 扉 (10,6)(10,7) と (10,10)(10,11。sen_999 まで 閉）。南 (9,17) → 過疎板の底
	rows: [
		"####################", // y0
		"#WWWWWWWWWWWWWWWWWW#", // y1
		"#wwwwwwwwQqwwwPwwww#", // y2  勢い欄 (9,2)(10,2)・端末 (14,2)
		"#..................#", // y3
		"#..................#", // y4  宝箱 (1,4)
		"#..................#", // y5
		"#MMMMMMMMM.MMMMMMMM#", // y6
		"#mmmmmmmmm.mmmmmmmm#", // y7
		"#..................#", // y8  ksk (4,8)・宝箱 (18,8)
		"#..................#", // y9  kskst (15,9)
		"#MMMMMMMMM.MMMMMMMM#", // y10
		"#mmmmmmmmm.mmmmmmmm#", // y11 扉 (10,11)。板ルール は (1,11) の 壁
		"#..................#", // y12
		"#..+....+....+.....#", // y13 スイッチ +500 (3,13)・+300 (8,13)・+200 (13,13)
		"#..................#", // y14 カウンター (17,14)
		"#..+....+....+.....#", // y15 スイッチ +100 (3,15)・+90 (8,15)・+9 (13,15)
		"#..................#", // y16 到着 (9,16)
		"#########.##########", // y17 出口 (9,17) → kaso
	],
	events,
};
