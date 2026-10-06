// 避難J（裏シナリオ「過疎板探検」の 終点。data/kaso.ts に 全体の 流れ）。
// 過疎板の底で 避難Jの モニターを 当てて（実験板で 回線を つないだ あと）来る。
//
// 住民は ホームニキ（避難Jの >>2「ここが ほんまの ホームや」。みんな 帰ったのに ひとり 残った 名無し）と 板猫。
// ホームニキの スレは 998 で 止まっている（1000日前）。1000ゲッターは 自分で 置いた bot（実験板の 作成ログ）。
// 完走したら スレが 勢い欄から 消える。スレの ない 板は 板やない。……ホームが なくなる。
//
// 流れ: 到着 → ホームニキ（999 は 書かせん。帰れ）→ 天文・気象板の カギで 家へ（hinan_home）→ 棚の ログ → 机の >>998
//       （裏返し その2：サイレントバルスの ことば。home_998）→ 勢い欄で キリコが >>999 → 1000ゲッター →
//       ホームニキの 告白 →「完走した スレは 倉庫で 眠る。消えない」→ ホームニキが 1000「おそいわ。……おかえり」
//       → レコード「避難Jの声」（hinan_1000）→ ルート分岐「スレを うつす」（避難ルート。保守の 日々 → 静かな 完走）
//       　　　　　　　　　　　　　　　　　　　　　／「もどって 完走する」（本編へ。hinan_back）
// 避難Jの 時間は 外と ちがう（「むこうは まだ 同じ夜や」）ので、避難ルートの あとも 本編は つづけられる。
// フラグ: home_met・home_key（kaso.ts。天文・気象板）・home_998・hinan_1000・hinan_back・hinan_end・hinan_undo・
//         home_trace・home_n・hd_write/hd_cat/hd_look/hd_rest（保守の 日々で えらんだ 回数）

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { npc, warp } from "../helpers";
import { bump, C, H, has, K, look, MONITORS } from "../kaso";
import { SPR } from "../sprites";
import { hinanSummary } from "../threadlog";
import { INDOOR, TOWN } from "../tiles";

/** 過疎板の底の 避難Jの モニターの 下の マス（kaso.ts と 同じ 計算）。 */
const MONITOR_X = 3 + MONITORS.hinan[0] * 2;
const MONITOR_Y = 5 + MONITORS.hinan[1] * 2;

// ───────────────── 勢い欄 ─────────────────

const ikioiH = async (s: Story): Promise<void> => {
	const f = s.state.flags;
	if (f.hinan_end) {
		await s.narrate(
			"1 【安価】安価でボカロ作ろうぜ　1000/1000\n2 （スレ主が　消した）",
		);
		await s.narrate("……ほかに　スレは　ない。");
		return;
	}
	if (f.hinan_1000) {
		await s.narrate("1 （スレ主が　消した）\n……ほかに　スレは　ない。");
		await s.narrate("1000日ぶんの　保守は、\n過去ログ倉庫へ　流れていった。");
		return;
	}
	await s.narrate(
		"1 【避難J】ここが　ほんまの　ホームや　998\n2 （スレ主が　消した）",
	);
	await s.narrate("1の　最終レス：1000日前。");
	if (!f.home_998) {
		if (f.home_met)
			await K(s, "……999、書きたいンゴ。\nでも、ホームニキが　あんなに");
		return;
	}
	if ((await s.choose(["999 を　書く", "やめておく"], { cancel: 1 })) === 1)
		return;
	await write999(s);
};

/** キリコの >>999 → 1000ゲッター → 告白 → ホームニキの 1000 → レコード → 分岐。 */
const write999 = async (s: Story): Promise<void> => {
	await s.narrate("キリコは　勢い欄の　前に　立った。");
	s.se("cursor");
	await s.narrate("999　名前：蓄音キリコ\n>>2　ホーム、来たンゴ");
	await H(s, "待て！　それは――");
	await s.narrate("ホームニキが　かけよってきた。");
	s.se("shock");
	await s.shake(300);
	await s.narrate(
		"画面が　勝手に　リロードされた。\n……だれかが、1000を　ねらっている。",
	);
	await H(s, "……来よった。1000ゲッターや");
	await K(s, "知ってるンゴ。\n……作成ログ、読んだから");
	await H(s, "…………");
	await s.battle("g_getter");
	await s.narrate("リロードの　音が、やんだ。");
	await s.narrate("ホームニキは　しばらく\n画面を　見ていた。");
	await H(s, "……せや。ワイが　作った");
	await H(
		s,
		"1000を　取ったら、完走や。\n完走したら、スレは　勢い欄から　消える",
	);
	await H(s, "スレの　ない　板は、板やない。\n……ホームが、なくなるやろ");
	await H(s, "せやから、だれにも　取らせんようにした。\n……ワイにも、や");
	if (has(s, "roze")) await s.say("roze", "……それで、1000日アルか");
	if (has(s, "teto"))
		await s.say("teto", "終わらせたくなくて、終われなく　した。\n……不器用だな");
	await K(s, "ホームニキ。\n完走した　スレは、消えないンゴ");
	await K(s, "過去ログ倉庫で、眠るンゴ。\n吾輩、そこで　>>2 を　読んだ");
	await H(s, "……うそやろ。\nあれ、倉庫まで　流れとったんか");
	await K(s, "それに。……>>998、読んだンゴ");
	await H(s, "…………");
	await K(
		s,
		"『どうせ、忘れられる』。\n吾輩の　スレを　消した　やつと、同じ　言葉",
	);
	await H(s, "……知らん。\nワイは　ここから　出とらん");
	if (has(s, "roze"))
		await s.say("roze", "出なくても、しみだすアル。\n千日ぶんの　静けさは");
	else await K(s, "出なくても、しみだすンゴ。\n千日ぶんの　静けさは");
	await H(s, "…………");
	await s.narrate(
		"ホームニキは　勢い欄を　見た。\nキリコの　999が、光っている。",
	);
	await H(s, "……ほな、取るか");
	s.se("cursor");
	await s.narrate("1000　名前：風吹けば名無し\n>>999　おそいわ。……おかえり");
	s.se("levelup");
	await s.narrate("避難Jの　スレが、1000に　とどいた。");
	await s.wait(400);
	await s.narrate(
		"勢い欄の　スレタイが、ふっと　消えた。\n……過去ログ倉庫へ　流れていった。",
	);
	await H(s, "……消えた");
	await K(s, "消えてないンゴ。\n倉庫で、また　聞けるンゴ");
	if (has(s, "roze"))
		await s.say("roze", "落ちたんじゃ　ないアル。\n……あがったアル");
	await H(s, "……ワイの　スレの　声、持っていき。");
	s.se("item");
	s.give("rec_hinan");
	await s.narrate("レコード「避難Jの声」を　てにいれた！");
	s.set("hinan_1000");
	await s.wait(300);
	await offer(s);
};

// ───────────────── ホームニキ ─────────────────

/** はじめて 会う（999 は 書かせない）。 */
const meet = async (s: Story): Promise<void> => {
	s.face("home", "player");
	await H(s, "……うわっ。人や。\n人が　おる");
	await H(s, "1000日ぶりやぞ。\n……いや、ねこは　のぞいて");
	await K(s, "吾輩、蓄音キリコ。\n……ここ、避難Jンゴ？");
	await H(s, "せや。なんJが　重かったころ、\nみんなで　ここへ　逃げてきた");
	await H(s, "ワイが　>>2 や。\n「ここが　ほんまの　ホームや」って　書いた");
	if (has(s, "roze")) await s.say("roze", "……ほかの　人は、アルか？");
	else await K(s, "……ほかの　人は？");
	await H(s, "帰った。むこうが　軽くなったら、すぐな。\n……ワイだけ　のこった");
	await K(s, "どうして　ンゴ？");
	await H(s, "ホームや　言うてもうたからな");
	await H(s, "言うた本人が　帰ったら、\nウソに　なるやろ");
	if (has(s, "teto"))
		await s.say(
			"teto",
			"……ウソから　生まれた　ボクが\n言うのも　なんだが、律儀だな",
		);
	if (s.has("rec_hinan") > 0)
		await s.narrate("カバンの　なかで、レコードが\nかたり、と　鳴った。");
	s.face("home", "left");
	await H(s, "見てみ。ワイの　スレ。\n998 や。……1000日前に　止めた");
	await K(s, "どうして　998で……");
	s.face("home", "player");
	await H(
		s,
		"1000は、ひとりで　取るもんやない。\nだれか　来るまで、待っとこ　思てな",
	);
	await H(s, "……1000日　待った。\nねこしか　来んかった");
	if (has(s, "feris")) await s.say("feris", "……ねこは、ノーカン〜？");
	await C(s);
	await H(s, "ノーカンや");
	await K(s, "……吾輩が、>>999　書くンゴ");
	await H(s, "あかん");
	await s.narrate("ホームニキは　勢い欄の　前に\n立ちふさがった。");
	await H(s, "ここは　ワイの　ホームや。\nよそもんが、さわんな");
	await H(s, "……帰れ。むこうの　夜に");
	if (has(s, "roze")) await s.say("roze", "……待つ、って　言ったアルのに");
	await s.narrate("ホームニキは、もう　こっちを　見なかった。");
	s.set("home_met");
};

/** 999 を 書く 前（home_met から）。カギの 手がかりと、読んだ あとの ひとこと。 */
const before = async (s: Story): Promise<void> => {
	s.face("home", "player");
	if (s.flag("home_998")) {
		await H(s, "……読んだんか");
		await H(s, "…………");
		await H(s, "999は、書かせん。\n……書かせん、言うとるやろ");
		await s.narrate("声が、すこし　ふるえていた。");
		return;
	}
	if (s.has("home_key") > 0) {
		await H(s, "……そのカギ。どこで");
		await K(s, "天文・気象板の、いちばん　おくンゴ");
		await H(s, "……返せ、とは　言わん。\n読むなら、読め。ワイは　知らん");
		return;
	}
	await H(s, "帰れ、言うとるやろ");
	await K(s, "……あの家、ホームニキの？");
	await H(s, "カギは　なくした。\n……天文・気象板の　どこかや。知らん");
};

// ───────────────── ルート分岐：スレを うつす ─────────────────

/** 「ここに うつすか？」。もどる＝本編へ（hinan_back）、うつす＝避難ルート（moveThread）。 */
const offer = async (s: Story): Promise<void> => {
	if (s.flag("clear")) {
		await H(s, "……お前の　スレ、完走したんか。\nほな、ええな");
		await H(s, "倉庫で、となり　あけとく");
		s.set("hinan_back");
		return;
	}
	await H(s, "……なあ。キリコの　スレ、\nえらい目に　あっとるんやろ");
	await H(s, "勢い欄、ずっと　見とったからな。\n……ここに　うつすか？");
	await H(s, "ここなら　落ちん。だれも　押さんからな。\nワイが　保守したる");
	const c = await s.choose(["スレを　うつす", "もどって　完走する"]);
	if (c === 0) return moveThread(s);
	await H(s, "……せやな。あっちが　ホームや");
	await K(s, "でも、ここも　ホームンゴ。\n>>999　書いたから");
	await H(s, "……草");
	await H(
		s,
		"完走したら、倉庫で　会おや。\nワイの　スレの　となりが　あいとる",
	);
	s.set("hinan_back");
};

// ───────────────── 避難ルート：保守の 日々（別の ゲーム） ─────────────────

type Day = { day: number; before?: (s: Story) => Promise<void> };
const DAYS: Day[] = [
	{ day: 1 },
	{ day: 7 },
	{ day: 30 },
	{
		day: 100,
		before: async (s) => {
			await s.narrate(
				"勢い欄の　2番目に、知らない　スレが\nいちど　立って、すぐ　消えた。",
			);
			await H(s, "……立て逃げや。気にすな");
		},
	},
	{ day: 365 },
	{
		day: 500,
		before: async (s) => {
			s.se("cursor");
			await s.narrate("500　名前：風吹けば名無し\n保守");
			await K(s, "……だれ、ンゴ？");
			await H(s, "知らん。……通りすがりやろ");
			await s.narrate("それきり、来なかった。");
		},
	},
	{ day: 999 },
];

const ACTIONS: {
	label: string;
	flag: string;
	run: (s: Story) => Promise<void>;
}[] = [
	{
		label: "保守を　書く",
		flag: "hd_write",
		run: async (s) => {
			s.se("cursor");
			await s.narrate("キリコは　ひとつ、書いた。\nホームニキも、ひとつ。");
			if (has(s, "roze")) await s.narrate("ロゼは「アル」と　書いた。");
			if (has(s, "feris")) await s.narrate("フェリスは「ふぇ」と　書いた。");
			if (has(s, "teto")) await s.narrate("テトは……パンの　絵を　はった。");
		},
	},
	{
		label: "ねこと　あそぶ",
		flag: "hd_cat",
		run: async (s) => {
			await C(s, "にゃあ");
			await s.narrate(
				"板猫が　キリコの　ひざに　のった。\nすずは、もう　ない。",
			);
			await H(s, "……そいつ、人を　えらぶんやぞ");
		},
	},
	{
		label: "むこうの　勢い欄を　見る",
		flag: "hd_look",
		run: async (s) => {
			await s.narrate(
				"むこうの　板の　勢い欄。\n……まっくろに　ぬりつぶされたまま。",
			);
			await K(s, "……まだ、同じ　夜ンゴ");
			await H(s, "ここの　時間は、外と　ちがうからな");
		},
	},
	{
		label: "ベンチで　休む",
		flag: "hd_rest",
		run: async (s) => {
			await s.narrate("ベンチに　すわった。\n風の　音も、しない。");
			await H(s, "……しずかやろ。\nここは、落ちん");
		},
	},
];

/** 避難ルート：静かな 1000日の 完走 → エンディング。見たあとは つづきからで ここに もどる（hinan_end）。 */
const moveThread = async (s: Story): Promise<void> => {
	await H(s, "ほな、移転や。\nURLが　かわるだけや。簡単や");
	await s.fadeOut(800);
	s.bgm(null);
	await s.narrate("【このスレッドは　避難Jへ　移転しました】");
	await s.fadeIn(800);
	await s.narrate(
		"勢い欄に、スレタイが　ふえた。\n1 【安価】安価でボカロ作ろうぜ　避難所　1",
	);
	await K(s, "……静かンゴ");
	await H(
		s,
		"せやろ。ここは、落ちん。\n毎日　ひとつ　書けば、1000日で　完走や",
	);
	await s.wait(600);
	await s.narrate("それから。");
	for (const d of DAYS) {
		await s.narrate(`${d.day}日目。`);
		if (d.before) await d.before(s);
		if (d.day === 999) break;
		const c = await s.choose(ACTIONS.map((a) => a.label));
		const a = ACTIONS[Math.min(c, ACTIONS.length - 1)];
		bump(s, a.flag);
		await a.run(s);
	}
	await s.narrate("だれも、読みに　来なかった。");
	await s.narrate("それでも　レスは　ふえて――");
	await s.wait(600);
	s.se("cursor");
	await s.narrate(
		"999　名前：風吹けば名無し\n>>1000　おかえり、は　お前が　言え",
	);
	await s.narrate("1000日目。");
	s.se("levelup");
	await s.narrate("1000　名前：蓄音キリコ\n……完走、ンゴ");
	await K(s, "……名言、できなかったンゴ");
	await H(s, "ええやん。1000日　保守した。\nそれが　名言や");
	if (has(s, "roze")) await s.say("roze", "……静かな　完走アル");
	await s.narrate(
		"勢い欄から、スレタイが　ふっと　消えた。\n過去ログ倉庫へ　流れていく。",
	);
	await K(s, "……やきうにも、\n見せたかったンゴ");
	await H(s, "……倉庫で、読むやろ。\nあいつら、過去ログ　好きやから");
	await s.narrate(
		"ホームニキは　ベンチに　すわった。\nキリコも、となりに　すわった。",
	);
	await s.narrate(
		"勢い欄は、また　からっぽに　なった。\n……次に　来る　だれかの　ために。",
	);
	s.set("hinan_end");
	s.heal();
	await s.ending({ summary: hinanSummary(s.state) });
};

// ───────────────── 2回目から ─────────────────

/** 避難ルートの エンディングを 見たあと（つづきから）。移転を もどせる。 */
const afterEnd = async (s: Story): Promise<void> => {
	s.face("home", "player");
	await H(s, "……おはよう。\n……いや、おかえりか");
	await H(s, "移転、もどすか？");
	const c = await s.choose(["もどす", "もうすこし　ここに"], { cancel: 1 });
	if (c !== 0) {
		await H(s, "ほな、保守しとこか");
		return;
	}
	s.se("warp");
	await s.narrate("【このスレッドは　もとの板へ　もどりました】");
	await s.narrate("勢い欄の　スレタイが、ひとつ　へった。");
	await H(
		s,
		"1000日ぶんは、ワイが　あずかっとく。\n……ここの　時間は、外と　ちがうからな",
	);
	await H(s, "むこうは、まだ　同じ　夜や");
	s.set("hinan_end", false);
	s.set("hinan_undo");
	s.set("hinan_back");
	await K(s, "……また　来るンゴ");
	await H(s, "来んでええ。\n……完走したら、倉庫で　会おや");
};

/** 2番目の スレ（スレ主が 消した）の話。1回だけ。 */
const trace = async (s: Story): Promise<void> => {
	s.face("home", "left");
	await H(s, "2番目の　スレ、見たか。\nスレ主が　消したやつ");
	await H(
		s,
		"ロゼに　あこがれた　子が　立てたんや。\n……そのあと、自分で　ぜんぶ　消した",
	);
	if (has(s, "roze")) await s.say("roze", "……わたしに、アルか");
	s.face("home", "player");
	await H(
		s,
		"消したのも、その子の　安価や。\nワイは　スレタイだけ　のこしとく",
	);
	await K(s, "……蓄音、しないンゴ");
	await H(s, "せや。それで　ええ");
	s.set("home_trace");
};

const IDLE = [
	"保守しとこか",
	"ねこに　えさ、やっといて",
	"倉庫で　会おや",
	"むこう、にぎやかか？\n……ええことや",
	"bot、作り直さへんで。\n……もう　ええねん",
];

const again = async (s: Story): Promise<void> => {
	s.face("home", "player");
	if (!s.flag("home_trace")) return trace(s);
	const canMove = !s.flag("clear");
	const c = await s.choose(
		canMove
			? ["はなす", "スレを　うつす", "なんでもない"]
			: ["はなす", "なんでもない"],
		{ cancel: canMove ? 2 : 1 },
	);
	if (canMove && c === 1) {
		await H(s, "ここなら　落ちん。\n……ほんまに　ええんか？");
		if ((await s.choose(["うつす", "やめる"], { cancel: 1 })) === 0)
			return moveThread(s);
		await H(s, "……せやな");
		return;
	}
	if (c !== 0) return;
	await H(s, IDLE[bump(s, "home_n") % IDLE.length]);
};

const homeRun = async (s: Story): Promise<void> => {
	if (s.flag("hinan_end")) return afterEnd(s);
	if (s.flag("hinan_1000")) return again(s);
	if (!s.flag("home_met")) return meet(s);
	return before(s);
};

// ───────────────── マップ ─────────────────

const events: EventDef[] = [
	{
		id: "arrive",
		x: 7,
		y: 10,
		trigger: "auto",
		once: true,
		run: async (s) => {
			await s.narrate("避難J。\n最後の　レスは、1000日前。");
			if (has(s, "feris"))
				await s.say(
					"feris",
					"……ヒナリーちゃんが　研究してる\n板だ〜。はじめて　来た〜",
				);
			await K(s, "……だれも、いないンゴ？");
			await s.narrate(
				"風の　音も、しない。\n勢い欄の　前に、だれか　立っている。",
			);
			await s.narrate("足もとで、すずの　音が　した。");
		},
	},
	warp(
		"to_kaso",
		7,
		11,
		{ map: "kaso", x: MONITOR_X, y: MONITOR_Y + 1, dir: "down" },
		{ se: "warp" },
	),
	// 勢い欄（(10,4)(11,4) から 上を向いて 調べる）
	{ id: "ikioi_l", x: 10, y: 3, trigger: "talk", fixedDir: true, run: ikioiH },
	{ id: "ikioi_r", x: 11, y: 3, trigger: "talk", fixedDir: true, run: ikioiH },
	npc("home", 12, 4, SPR.j_so, homeRun, { dir: "left" }),
	npc(
		"cat",
		8,
		7,
		SPR.cat,
		async (s) => {
			await C(s, s.flag("hinan_1000") ? "にゃあ♪" : "にゃあ");
			if (s.flag("neko_done") && !s.flag("cat_suzu")) {
				s.set("cat_suzu");
				await s.narrate(
					"首に、すずの　あとが　ある。\n……犬猫大好き板の、あの猫だ。",
				);
				await K(s, "通ってるンゴ？　900の　板を");
			}
		},
		{ wander: true },
	),
	// 家（カギは 天文・気象板）
	{
		id: "home_door",
		x: 3,
		y: 5,
		trigger: "touch",
		through: true,
		run: async (s) => {
			if (!(s.has("home_key") > 0)) {
				await s.narrate("表札に『ホーム』。\nカギが　かかっている。");
				await s.move("player", "d");
				return;
			}
			if (!s.flag("home_in")) {
				s.set("home_in");
				await s.narrate("ホームのカギを　さしこんだ。\n……かちり。");
			}
			await s.warp("hinan_home", 4, 6, "up", { se: "door" });
		},
	},
	look("sign_h", 6, 9, "ようこそ　避難Jへ\n人口：1（ねこを　のぞく）"),
	// 左の ベンチに ヒナリーの 研究ノート
	look(
		"note",
		2,
		7,
		"ベンチに、おりたたんだ　紙。\n『研究ノート：住民1名。ねこ1匹。以上』",
		"……ヒナリーの　字だ。",
	),
	look(
		"note_r",
		3,
		7,
		"だれも　すわっていない　ベンチ。\nほこりは、つもっていない。",
	),
	look("bench_r", 12, 7, "だれも　すわっていない　ベンチ。"),
	look("bench_r2", 13, 7, "ベンチの　すみに、ねこの　毛。"),
];

export const hinan: MapDef = {
	id: "hinan",
	name: "避難J",
	bgm: "hinan", // AI作曲スレ >>17「くもり空をパクったやつ」（data/bgm.ts）
	tiles: TOWN,
	// 16×12。北西に 家、北東に 勢い欄、ベンチが 左右に ひとつずつ。南の 柵の すきま (7,11) → 過疎板の底
	rows: [
		"||||||||||||||||", // y0
		"|,,,,,,,,,,,,,,|", // y1
		"|,nnn,,,,,,,,,,|", // y2
		"|,^^^,,,,,Kk,,,|", // y3  勢い欄 (10,3)(11,3)
		"|,%W%,,,,,::,,,|", // y4  ホームニキ (12,4)
		"|,#D#,,,,,::,,,|", // y5  家の扉 (3,5)
		"|,,,,,,,,,,,,,,|", // y6
		"|,Bb,,,,,,,,Bb,|", // y7  ベンチ。板猫 (8,7)
		"|,,,,,,,,,,,,,,|", // y8
		"|,,,,,!,,,,,,,,|", // y9  看板 (6,9)
		"|,,,,,,,,,,,,,,|", // y10 到着 (7,10)
		"|||||||.||||||||", // y11 出口 (7,11) → kaso
	],
	events,
};

// ───────────────── ホームの 家（hinan_home） ─────────────────

/** 棚の ログ（>>1 から 100 ずつ）。 */
const SHELVES: [x: number, head: string, ...lines: string[]][] = [
	[
		2,
		"棚：>>1〜200。みんなが　いた　ころ。",
		">>2 ここが　ほんまの　ホームや\n>>3 むこうは　人　多すぎや",
		">>4 ヒナリーです。研究　させてください\n>>5 >>4 なんで　おるねん",
		">>88 ここ、ええな。しずかで\n>>89 ずっと　おってもええわ",
	],
	[
		3,
		"棚：>>201〜400。",
		">>240 むこう、軽くなったで\n>>241 ほんまや。帰るわ",
		">>300 おつ。ワイも　帰る\n>>301 >>2 お前は？",
		">>302 ワイは　ここに　おる。\nホームや　言うたからな",
	],
	[
		4,
		"棚：>>401〜600。ひとりに　なってから。",
		">>401 保守\n>>402 保守",
		">>450 ねこ　来た\n>>451 ねこは　ノーカンやけど",
		">>600 保守。……むこう、新キャラ　出たんか",
	],
	[
		5,
		"棚：>>601〜800。",
		">>700 保守\n>>750 保守",
		">>777 ゾロ目や。……だれも　おらんけど\n>>800 保守",
	],
	[
		6,
		"棚：>>801〜997。",
		">>900 ほ\n>>950 ほ",
		">>990 ……\n>>997 ほ",
		"……字が、どんどん　みじかくなっていく。",
	],
	[
		7,
		"棚：>>998 は、机の　上。",
		"……ここだけ、ほこりが　ない。\n毎日、手に　取っていたように。",
	],
];

const shelf = ([x, head, ...lines]: (typeof SHELVES)[number]): EventDef => ({
	id: `shelf${x}`,
	x,
	y: 2,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		await s.narrate(head);
		for (const l of lines) await s.narrate(l);
	},
});

/** 机の >>998（裏返し その2）。 */
const desk: EventDef = {
	id: "desk",
	x: 7,
	y: 4,
	trigger: "talk",
	fixedDir: true,
	run: async (s) => {
		await s.narrate("机の　上に、1枚だけ。");
		await s.narrate(
			"998　名前：風吹けば名無し　1000日前\nネタは　ネタのまま　終わるんやろな。",
		);
		await s.narrate("……どうせ、忘れられる。");
		if (s.flag("home_998")) {
			await s.narrate("キリコは、紙を　そっと　もどした。");
			return;
		}
		s.bgm(null);
		await s.wait(600);
		await K(s, "…………");
		if (has(s, "roze")) await s.say("roze", "……キリコ？");
		await K(s, "この　言葉。\n吾輩の　スレを　消した　やつが、言ったンゴ");
		await K(
			s,
			"『ネタは、ネタのまま　終わるンゴ』……\n『どうせ、忘れられる』……",
		);
		if (has(s, "feris")) await s.say("feris", "サイレントバルス……？");
		if (has(s, "roze"))
			await s.say("roze", "同じ　言葉アル。\n……千日前に、ここで　書かれてた");
		if (has(s, "teto"))
			await s.say(
				"teto",
				"返事の　ない　言葉は、どこかへ　しみだす。\n……それが、あれか",
			);
		await s.narrate(
			"だれにも　返事を　もらえなかった\n千日ぶんの　しずけさが、ここに　ある。",
		);
		await K(s, "……吾輩が、返事を　するンゴ。\n>>999 で");
		s.set("home_998");
		await s.narrate("キリコは、紙を　そっと　もどした。");
		s.bgm("hinan");
	},
};

export const hinanHome: MapDef = {
	id: "hinan_home",
	name: "ホーム",
	bgm: "hinan",
	tiles: INDOOR,
	// 10×8。上の壁に 本棚 6つ（>>1 から 100 ずつ）。右の 机に >>998。南の 扉 (4,7) → 避難J (3,6)
	rows: [
		"##########", // y0
		"#HHHHHHHH#", // y1
		"#hBBBBBBh#", // y2  棚 (2..7,2)
		"#........#", // y3
		"#.Z....Mt#", // y4  ベッド (2,4)(2,5)・机 (7,4)(8,4)
		"#.z......#", // y5
		"#....u...#", // y6  到着 (4,6)。えさ皿 (5,6)
		"####D#####", // y7  扉 (4,7) → hinan
	],
	events: [
		warp(
			"to_hinan",
			4,
			7,
			{ map: "hinan", x: 3, y: 6, dir: "down" },
			{ se: "door" },
		),
		...SHELVES.map(shelf),
		desk,
		look("bed", 2, 4, "ベッド。\n……ねこの　毛だらけだ。"),
		look("dish", 5, 6, "ねこの　えさ皿。\nきれいに　洗ってある。"),
		look("desk_r", 8, 4, "机の　はし。\nカレンダーは、1000日前の　まま。"),
	],
};
