// おんJスタジアム（第三章「やきう場のマスコット決定戦」）。設計書 §8-6・§11-5。
// ナイターの球場。門の応援団長のクイズ → シンボル敵（任意）→ マウンドのテノヒラ監督（B3）→ 夜の町へ。
// ランダムエンカウントはなし。
// 自由度（scratchpad/freedom/spec.md）：シンボルに「たたかう／レスする／スルー」（F3-3）、
// 監督は負けても進む（F4。3回で雨天コールド）、代打と名言その3を安価で記録（F1）、
// おんJ民のデートの予告（F5）。

import { bondOf } from "../../engine/bonds";
import type {
	EventDef,
	GameState,
	MapDef,
	Script,
	Story,
	TileDef,
} from "../../engine/defs";
import {
	addLose,
	ankaChoose,
	BOSS_EXP,
	bossFight,
	MEIGEN,
	meigenQuote,
	symCount,
} from "../freedom";
import { chest, warp } from "../helpers";
import { posihame, yayapoji } from "../minors";
import { SPR } from "../sprites";
import { ks, phono, silent } from "../story";
import { base, STADIUM, TOWN } from "../tiles";
import { weekday } from "../weekday";

// ── タイル ──
// §11-5 の ASCII をそのまま使う。"." はコンコースの石畳（町と同じ）。
// スコアボードは「ツタの壁の下段 (10,1)(11,1)」に 1×2 で置き、上段 (10,0)(11,0) まで立たせる。
const IVY_LOW = base(1, 176);
const board = (c: number): TileDef => ({
	layers: [IVY_LOW, base(c, 485, 1, 2)],
	color: "#3a8a3a",
	passable: false,
});
/** ナイターの照明（スタンドの上段に立てる。街灯の単体スプライト）。 */
const light: TileDef = {
	layers: [base(4, 52), "sp:2gTYec"],
	color: "#8a8a8a",
	passable: false,
};
const tiles: Record<string, TileDef> = {
	...STADIUM,
	".": TOWN["."],
	Q: board(0),
	q: board(1),
	L: light,
};

// §11-5 の ASCII。飾りだけ変えた（どれも壁なので通れるマスは同じ）:
//  - スコアボード Q q を 1 段下げた  - スタンド上段 (2,0)(19,0) に照明 L
const rows = [
	"SSLSSSSVVVVVVVVSSSSLSS", // y0
	"sssssssvvvQqvvvsssssss", // y1  スコアボード（(10,1) を (10,2) から調べる）
	"SS,,,,,,,,,,,,,,,,,,SS", // y2  宝箱 (2,2) (19,2)
	"ss;;;;;;;;;;;;;;;;;;ss", // y3
	"SS,,,,,,,,,,,,,,,,,,SS", // y4  シンボル sym1 (5,4)
	"ss;;;;;;;;;;;;;;;;;;ss", // y5  シンボル sym2 (16,5)
	"SS,,,,,,,:o:,,,,,,,,SS", // y6
	"ss;;;;;;:::::;;;;;;;ss", // y7
	"SS,,,,,:::m:::,,,,,,SS", // y8  マウンド: 監督 (10,8)、ピッチャー (11,8)
	"ss;;;;o:::::::o;;;;;ss", // y9
	"SS,,,,,:::::::,,,,,,SS", // y10 シンボル sym3 (15,10)
	"ss;;;;;;:::::;;;;;;;ss", // y11
	"SS,,,,,,,:o:,,,,,,,,SS", // y12
	"SSffffffff.fffffffffSS", // y13 バックネットの門 (10,13)＝応援団長
	"S....................S", // y14 コンコース。蓄音機 (3,14)
	".....................S", // y15 入口 (0,15) → town、到着 (1,15)
	"S....................S", // y16 実況J民 (7,16)
	"SSSSSSSSSSSSSSSSSSSSSS", // y17
];

/** J民のセリフ（黄色の名前欄・読み上げなし）。 */
const j = (s: Story, name: string, text: string) =>
	s.say("nanj", text, { name });

/** 沈黙中（第四章）でない＝人がいる。 */
const day = (st: GameState) => !silent(st);

// ── §8-6 冒頭：第三章の章カード ──
const arrive: Script = async (s) => {
	await s.chapter("第三章", "やきう場のマスコット決定戦");
	s.set("ch", 3);
	await s.say(
		"feris",
		"ここ……2009年に、やきうくんたちと\nマスコットの座を　かけて　勝負したとこだ〜",
	);
	await s.say("nanj", "……その節は　すまんかったな");
	await s.say("feris", "いいよ〜。今夜は　その　つづきだね〜");
	await s.say(
		"nanj",
		"グラウンドへは　バックネットの　門からや。\n応援団長が　見張っとるで",
	);
	// F5 取り逃しの予告（デートは アク禁 で行けなくなる。理由は「シーズンの終わり」で言う）
	if (bondOf(s.state, "nanj") >= 3 && !s.flag("date_nanj"))
		await s.say(
			"nanj",
			"……外野席で　見られるのも、\n今シーズンは　今夜で　しまいや",
		);
};

// ── §8-6 門の「フェリスのお勉強」クイズ ──
const quiz: Script = async (s) => {
	await j(s, "応援団長", "通りたかったら　フェリスの　お勉強や！");
	await j(
		s,
		"応援団長",
		"フェリスちゃんが　先に　飛んで　出発。\nやきう君は　あとから　走って　追いかけます",
	);
	await j(s, "応援団長", "やきう君が　追いつくのは　何分後？");
	const a = await s.choose(["5分後", "10分後", "追いつかれません"]);
	if (a < 2) {
		await s.say("feris", "ぶ〜。それじゃ　ふつうの　答えだよ〜");
		return;
	}
	await s.say("feris", "せいか〜い。だって　私、飛んでるもん");
	await j(s, "応援団長", "……ほんまに　それが　正解なんよな。\n通ってええで");
	s.set("quiz_ok");
	s.hide("gate_quiz"); // 門をあける（gate_quiz2 がコンコースに出る）
};

// ── F3-3 スタンドの声援（シンボル J民に「レスする」と、監督戦の前に届く） ──
const cheer = async (s: Story): Promise<void> => {
	const r = symCount(s.state, "res");
	const d = r - Number(s.flag("cheer_n") ?? 0);
	if (d <= 0) return;
	s.set("cheer_n", r);
	s.give("spray", d);
	s.se("item");
	await s.narrate(
		`スタンドから　声援が　とどいた！\nのどスプレーを　${d}こ　もらった！`,
	);
};

// ── F4 B3 の負けレス（1・2回目）。2回目は「雨」をそれとなく示す ──
const loseB3 = async (s: Story, n: number): Promise<void> => {
	if (n === 1) {
		await s.narrate("「代打　凡退で　草」\n「まだ　9回裏や」");
		await s.say("nanj", "監督の　手首、今日は　かたいで");
	} else {
		await s.narrate("「手のひら　返らんやんけ」\n「雨でも　ふらんかな」");
		await s.say("feris", "……雨の　においが　する〜");
	}
};

/** 名言チャレンジ その3 への おんJ民の返し（MEIGEN[2] の順）。 */
const REACT3 = [
	"それは　名言やなくて　宣言や",
	"それ、監督の　持ちネタやんけ",
	"腹　へっとるだけやろ",
];

// ── §8-6 B3 テノヒラ監督（監督・ピッチャーのどちらに話しても同じ） ──
const kantoku: Script = async (s) => {
	if (s.flag("b3_met")) {
		await j(s, "テノヒラ監督", "まだ　やるんか！");
	} else {
		s.set("b3_met");
		await j(s, "テノヒラ監督", "フェリスやんけ！　なにしに　来たんや！");
		await s.say("feris", "試合を　見にきたよ〜");
	}
	await j(
		s,
		"テノヒラ監督",
		"マスコットの座は　渡さへんで！\n代打、そこの　ンゴの子！",
	);
	// 代打は毎回えらぶ（daida は最後の選択で上書き）
	const d = await ankaChoose(s, "daida", ["打つ", "見送る", "バント"]);
	if (d === 0) await s.say("kiriko", "吾輩、フルスイングするンゴ！");
	else if (d === 1) await s.say("kiriko", "……選球眼には　自信が　ある");
	else await s.say("kiriko", "囲碁で　いえば、手堅い一手");
	await cheer(s);
	const r = await bossFight(s, "b3", "g_b3", loseB3);
	if (r === "rest") {
		// 監督はマウンドに立ったまま（すぐ話しかけ直せる）
		await j(s, "テノヒラ監督", "……打席は　あけといたるで！");
		return;
	}
	s.set("b3_how", r === "win" ? "win" : "lose");
	if (r === "pass") {
		// 3回負けた：雨天コールドで通してもらう（「勝った」とは書かない）
		await s.narrate("ぽつ、ぽつ……\n雨が　ふってきた。");
		await j(s, "テノヒラ監督", "……雨天コールドや。\nひきわけで　ええな");
		await j(s, "テノヒラ監督", "……フェリス、ずぶぬれでも\n神やわ");
	} else await j(s, "テノヒラ監督", "……やっぱ　フェリスは　神やわ");
	await s.say("roze", "手のひら、くるっくるアル");
	await s.say("nanj", "監督の手首は　モーター式やからな");
	await j(
		s,
		"テノヒラ監督",
		"……うっさいわ。負けた年も、ボロクソ\n言いながら　スタンドに　おったんや",
	);
	await s.say(
		"nanj",
		"……なあ、フェリス。マスコット、\n一人やなくても　ええやろ",
	);
	await s.say("feris", "はんぶんこ、だね〜");
	await s.narrate(
		"試合は　ひきわけ。スタンドの　おんJ民が\nいっせいに　かきこんだ。",
	);
	s.set("res", 850);
	s.set("b3");
	s.se("item");
	await s.narrate("蓄音機に　レスが　たまった！（850/1000）");
	// 雨天コールドで通してもらったときの経験値は、場面のあと（監督のセリフを切らない）
	if (r === "pass") await s.gainExp(BOSS_EXP.b3);
	// F1 名言チャレンジ その3（フェリスが その2 を引用）
	await ks(s, "名言チャレンジ、その3。");
	const q = meigenQuote(s.state, 1);
	if (q) await s.say("feris", `「${q}」の　つぎは\nなにかな〜`);
	const i = await ankaChoose(
		s,
		"meigen3",
		MEIGEN[2].map((m) => m.label),
	);
	await ks(s, MEIGEN[2][i].line);
	await s.say("nanj", REACT3[i]);
	s.set("night");
	await s.warp("town", 12, 9, "down"); // ここで終了。町の night_ev（第四章）が続く
};

/**
 * F3-3 見えるシンボル J民（story.ts の symbol() の代わり）。
 * たたかう＝勝つと消える（負けても全滅にしない。lose_n に数えて、J民は残る）／
 * レスする＝1往復して スタンドに回る（消える）／スルー＝何も起きない。
 * どちらで越えたかを sym_<id> に "fight" / "res" で入れる。
 */
const symbolReply = (
	id: string,
	x: number,
	y: number,
	sprite: string,
	group: string,
	name: string,
	line: string,
	reply: string,
	answer: string,
): EventDef => ({
	id,
	x,
	y,
	sprite,
	trigger: "talk",
	run: async (s) => {
		await j(s, name, line);
		const c = await s.choose([">>1 たたかう", ">>2 レスする", "スルー"], {
			cancel: 2,
		});
		if (c === 0) {
			const r = await s.battle(group, { canLose: true });
			if (r === "lose") {
				// 負けても　もういちど話せば、レスする・スルーも選べる
				addLose(s);
				await j(s, name, "……ワイの　勝ちや。草");
			}
			if (r !== "win") return;
			s.set(`sym_${id}`, "fight");
			s.hide(id);
		} else if (c === 1) {
			await ks(s, reply);
			await j(s, name, answer);
			s.set(`sym_${id}`, "res");
			s.hide(id);
		} else await j(s, name, "……スルーかい。草");
	},
});

/** 試合のあとの実況J民（代打の選び方で変わる）。 */
const JIKKYO_DAIDA = [
	"代打の　フルスイング、\n実況スレ　わいとったで",
	"代打の　見送り、\n選球眼で　草",
	"代打で　バントて。\n渋すぎて　草",
];

const scoreRun: Script = async (s) => {
	await s.narrate(
		s.flag("b3")
			? "スコアボードに　大きく\n「ひきわけ　おめでとう」"
			: "9回裏　2アウト満塁\nフェリス　vs　やきう民",
	);
};

export const stadium: MapDef = {
	id: "stadium",
	name: "おんJスタジアム",
	// 読み込み時は無音にして onEnter で決める（沈黙中にナイターの曲が一瞬鳴らないように）
	bgm: null,
	outside: "#0b1024",
	tiles,
	rows,
	onEnter: async (s) => {
		s.bgm(silent(s.state) ? "sad" : "field2");
	},
	events: [
		{
			id: "st_arrive",
			x: 20,
			y: 16,
			trigger: "auto",
			once: true,
			when: (st) => !!st.flags.b2,
			run: arrive,
		},
		warp("to_town", 0, 15, { map: "town", x: 22, y: 9, dir: "left" }),
		phono("phono_std", 3, 14),

		// ── コンコース ──
		{
			id: "jikkyo",
			x: 7,
			y: 16,
			sprite: SPR.j_nanashi,
			dir: "down",
			trigger: "talk",
			when: day,
			run: async (s) => {
				if (s.flag("b3")) {
					const d = s.flag("daida");
					await j(
						s,
						"名無し（3-3）",
						(typeof d === "number" && JIKKYO_DAIDA[d]) ||
							"ひきわけや！　ええ試合やった",
					);
				} else
					await j(
						s,
						"名無し（3-2）",
						"名前欄に　スコア　出とるやろ？\n実況スレは　こうなんや",
					);
			},
		},
		{
			// 沈黙中（第四章）だけ：実況が文字化けしている
			id: "jikkyo_mute",
			x: 7,
			y: 16,
			sprite: SPR.j_nanashi,
			dir: "down",
			trigger: "talk",
			when: (st) => silent(st),
			run: async (s) => {
				await j(s, "名無し（■-■）", "縺ｧ縺ｯ……縺ｭ縺ｦ\n（文字化けしている）");
			},
		},
		{
			id: "gate_quiz",
			x: 10,
			y: 13,
			sprite: SPR.j_sen,
			dir: "down",
			trigger: "talk",
			when: (st) => !st.flags.quiz_ok,
			run: quiz,
		},
		{
			id: "gate_quiz2",
			x: 12,
			y: 14,
			sprite: SPR.j_sen,
			dir: "down",
			trigger: "talk",
			when: (st) => !!st.flags.quiz_ok && day(st),
			run: async (s) => {
				if (s.flag("b3"))
					await j(s, "応援団長", "ええ試合やったで！　また　来てな");
				else await j(s, "応援団長", "かっとばせー！　キリコ！");
			},
		},

		// ── グラウンド：見えるシンボル敵（任意。たたかうか、レスで返すと消える） ──
		{
			...symbolReply(
				"sym1",
				5,
				4,
				SPR.j_tights,
				"g_std1",
				"ヤジJ民",
				"ワイの　守備範囲や！",
				"守備、見せてほしいンゴ",
				"……しゃあないな。\nスタンドから　声　出したるわ",
			),
			dir: "right",
			when: day,
		},
		{
			...symbolReply(
				"sym2",
				16,
				5,
				SPR.j_hakkyo,
				"g_std2",
				"負けムードJ民",
				"負けや負けや！",
				"まだ　9回裏ンゴ",
				"……せやな。\n最後まで　見たるわ",
			),
			dir: "left",
			when: day,
		},
		{
			...symbolReply(
				"sym3",
				15,
				10,
				SPR.j_sen,
				"g_std3",
				"応援団J民",
				"応援団の　意地、見せたる！",
				"その声、蓄音機に　ためたい",
				"……ほな、でっかい　声で\nいったるで！",
			),
			dir: "left",
			when: day,
		},

		// ── マウンド：B3 ──
		{
			id: "kantoku",
			x: 10,
			y: 8,
			sprite: SPR.j_black,
			dir: "down",
			trigger: "talk",
			when: (st) => !st.flags.b3,
			run: kantoku,
		},
		{
			id: "pitcher_npc",
			x: 11,
			y: 8,
			sprite: SPR.j_yakiu,
			dir: "down",
			trigger: "talk",
			when: (st) => !st.flags.b3,
			run: kantoku,
		},

		// ── スタンドの観客（飾り。グラウンドのきわから話せる） ──
		{
			id: "fan_a",
			x: 1,
			y: 5,
			sprite: SPR.j_gakuran,
			dir: "right",
			trigger: "talk",
			when: day,
			run: async (s) => {
				// 遊んでいる端末が月曜日なら（プロ野球は 月曜に 試合が ない。data/weekday.ts）
				if (weekday() === 1)
					await j(s, "観客", "……今日　月曜やろ。\nほんまは　試合　ない日やで");
				else await j(s, "観客", "ナイターは　ええなあ。\n夜風が　きもちええわ");
			},
		},
		{
			id: "fan_b",
			x: 20,
			y: 8,
			sprite: SPR.j_hikoki,
			dir: "left",
			trigger: "talk",
			when: day,
			run: async (s) => {
				if (s.flag("b3"))
					await j(s, "観客", "はんぶんこ、か。\n……ええ落としどころや");
				else
					await j(
						s,
						"観客",
						"フェリスが　帰ってきたんか……\nワイは　ずっと　覚えとったで",
					);
			},
		},
		{
			id: "fan_c",
			x: 1,
			y: 11,
			sprite: SPR.j_yosuko,
			dir: "right",
			trigger: "talk",
			when: day,
			run: async (s) => {
				if (s.flag("b3")) await j(s, "観客", "今日から　キリコの　ファンやで");
				else
					await j(s, "観客", "キリコ？　知らん子やな。\n……けど、応援したるわ");
			},
		},

		// ヤヤポジ（おんJマイナーズ。data/minors.ts）
		yayapoji(20, 11),
		posihame(20, 12),

		// ── スコアボード（(10,2) から上を向いて調べる） ──
		{ id: "score", x: 10, y: 1, trigger: "talk", run: scoreRun },
		{ id: "score_r", x: 11, y: 1, trigger: "talk", run: scoreRun },
		...chest("std1", 2, 2, "spray", 2),
		...chest("std2", 19, 2, "pan", 1),
	],
};
