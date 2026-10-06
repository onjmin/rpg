// 避難J（裏シナリオ「過疎板探検」）。終章、サーバーの底の「となりの板のサーバー」（server.ts の rack_other）から来る。
// 過去ログ倉庫で 避難Jのログを 掘っていると（dig_hinan）、ランプが ひとつだけ ついていて つなげる。
//
// おんJwiki の「過疎板探検」（約900の専門板の ほとんどが 無人。「最後にレスされたのが1000日前」。
// 「人が増えると信じてレスし続けた開拓者」）から。住民は ホームニキ（避難Jの >>2「ここが ほんまの ホームや」）と 板猫だけ。
// ホームニキの 保守スレは 998 で 止まっている（1000日前）。「1000は ひとりで 取るもんやない」。
//
// 芝生では まれに 過疎・宣伝ボットが 出る（g_hin1・g_hin2）。
//
// 流れ: 到着 → ホームニキ → キリコが >>999 を書く → 中ボス 1000ゲッター（g_getter。1000を 横取りする bot）
//       → ホームニキが 1000 → スレは 倉庫へ（完走）→ レコード「避難Jの声」
//       → ルート分岐「スレを うつす」（避難ルート。静かな完走の エンディング → つづきからで もどせる）
//       　　　　　　　　　／「もどって 完走する」（本編へ。エンディングの輪・レスの洪水に ホームニキが 出る）
// 避難Jの時間は 外と ちがう（「むこうは まだ 同じ夜や」）ので、避難ルートのあとも 本編は 850 のまま つづけられる。
// フラグ: hinan_1000（>>1000 まで 見た）・hinan_back（もどると 決めた）・hinan_end（避難ルートの エンディングを 見た）・
//         hinan_undo（移転を もどした）・home_trace（2番目の スレの話を 聞いた）・home_n（話した回数）。

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { npc, sign, warp } from "../helpers";
import { SPR } from "../sprites";
import { lockedDoor } from "../story";
import { hinanSummary } from "../threadlog";
import { TOWN } from "../tiles";

/** ホームニキ（J民なので 黄色の名前欄・読み上げなし）。 */
const H = (s: Story, text: string) =>
	s.say("nanj", text, { name: "ホームニキ" });
/** 板猫。 */
const C = (s: Story, text: string) => s.say(null, text, { name: "板猫" });

const has = (s: Story, id: string): boolean =>
	s.state.party.some((m) => m.id === id);

/** 数のフラグを1つ進め、進める前の値を返す（town.ts の bump と同じ）。 */
const bump = (s: Story, name: string): number => {
	const n = Number(s.flag(name) ?? 0);
	s.set(name, n + 1);
	return n;
};

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
};

// ───────────────── ホームニキ：はじめて会う → >>999 → 1000 ─────────────────

const meet = async (s: Story): Promise<void> => {
	s.face("home", "player");
	await H(s, "……うわっ。人や。\n人が　おる");
	await H(s, "1000日ぶりやぞ。\n……いや、ねこは　のぞいて");
	await s.say("kiriko", "吾輩、蓄音キリコ。\n……ここ、避難Jンゴ？");
	await H(s, "せや。なんJが　重かったころ、\nみんなで　ここへ　逃げてきた");
	await H(s, "ワイが　>>2 や。\n「ここが　ほんまの　ホームや」って　書いた");
	// 倉庫で 掘った ログ（digs.ts の hinan）の >>2
	await s.say("kiriko", "……倉庫で　読んだンゴ。\nそのレス");
	await H(s, "……うそやろ。\nあれ、倉庫まで　流れとったんか");
	if (has(s, "roze")) await s.say("roze", "……ほかの　人は、アルか？");
	else await s.say("kiriko", "……ほかの　人は？");
	await H(s, "帰った。むこうが　軽くなったら、すぐな。\n……ワイだけ　のこった");
	await s.say("kiriko", "どうして　ンゴ？");
	await H(s, "ホームや　言うてもうたからな");
	await H(s, "言うた本人が　帰ったら、\nウソに　なるやろ");
	if (has(s, "teto"))
		await s.say(
			"teto",
			"……ウソから　生まれた　ボクが\n言うのも　なんだが、律儀だな",
		);
	// 次スレ：前の周で もらった レコード（キリコは 覚えていない）
	if (s.has("rec_hinan") > 0)
		await s.narrate("カバンの　なかで、レコードが\nかたり、と　鳴った。");
	s.face("home", "left");
	await H(s, "見てみ。ワイの　スレ。\n998 や。……1000日前に　止めた");
	await s.say("kiriko", "どうして　998で……");
	s.face("home", "player");
	await H(
		s,
		"1000は、ひとりで　取るもんやない。\nだれか　来るまで、待っとこ　思てな",
	);
	await H(s, "……1000日　待った。\nねこしか　来んかった");
	if (has(s, "feris")) await s.say("feris", "……ねこは、ノーカン〜？");
	await C(s, "にゃあ");
	await H(s, "ノーカンや");
	await s.say("kiriko", "……吾輩が、>>999　書くンゴ");
	await H(s, "……は？　待て、それは――");
	await s.narrate("キリコは　勢い欄の　前に　立った。");
	s.se("cursor");
	await s.narrate("999　名前：蓄音キリコ\n>>2　ホーム、来たンゴ");
	// 1000ゲッター：完走まぎわの スレに わいて 1000を 横取りする bot（998で 止めていた もう一つの理由）
	s.se("shock");
	await s.shake(300);
	await s.narrate(
		"画面が　勝手に　リロードされた。\n……だれかが、1000を　ねらっている。",
	);
	await H(
		s,
		"来よった。1000ゲッターや。\nこいつが　おるから、998で　止めとったんや",
	);
	await H(
		s,
		"999を　書いた　とたん、どこからでも\nわいて　1000を　持っていきよる",
	);
	await s.say("kiriko", "吾輩の　スレでも、\nやらせないンゴ");
	await s.battle("g_getter");
	await s.narrate("リロードの　音が、やんだ。");
	await H(s, "…………");
	await s.narrate("ホームニキは　しばらく\n画面を　見ていた。");
	await H(s, "……ほな、取るか");
	s.se("cursor");
	await s.narrate("1000　名前：風吹けば名無し\n>>999　おそいわ。……おかえり");
	s.se("levelup");
	await s.narrate("避難Jの　スレが、1000に　とどいた。");
	await s.wait(400);
	await s.narrate(
		"勢い欄の　スレタイが、ふっと　消えた。\n……過去ログ倉庫へ　流れていった。",
	);
	await s.say("kiriko", "……消えたンゴ！？");
	await H(
		s,
		"完走や。完走した　スレは　倉庫へ　行く。\n1000日ぶんの　保守、ぜんぶ　持ってな",
	);
	if (has(s, "roze"))
		await s.say("roze", "落ちたんじゃ　ないアル。\n……あがったアル");
	await H(
		s,
		"……ワイの　スレの　声、持っていき。\n倉庫で　また　聞けるやろけど",
	);
	s.se("item");
	s.give("rec_hinan");
	await s.narrate("レコード「避難Jの声」を　てにいれた！");
	s.set("hinan_1000");
	await s.wait(300);
	await offer(s);
};

// ───────────────── ルート分岐：スレを うつす ─────────────────

/** 「ここに うつすか？」。もどる＝本編へ（hinan_back）、うつす＝避難ルート（moveThread）。 */
const offer = async (s: Story): Promise<void> => {
	await H(s, "……なあ。キリコの　スレ、\nえらい目に　あっとるんやろ");
	await H(s, "勢い欄、ずっと　見とったからな。\n……ここに　うつすか？");
	await H(s, "ここなら　落ちん。だれも　押さんからな。\nワイが　保守したる");
	const c = await s.choose(["スレを　うつす", "もどって　完走する"]);
	if (c === 0) return moveThread(s);
	await H(s, "……せやな。あっちが　ホームや");
	await s.say("kiriko", "でも、ここも　ホームンゴ。\n>>999　書いたから");
	await H(s, "……草");
	await H(
		s,
		"完走したら、倉庫で　会おや。\nワイの　スレの　となりが　あいとる",
	);
	s.set("hinan_back");
};

/** 避難ルート：静かな 1000日の完走 → エンディング。見たあとは つづきからで ここに もどる（hinan_end）。 */
const moveThread = async (s: Story): Promise<void> => {
	await H(s, "ほな、移転や。\nURLが　かわるだけや。簡単や");
	await s.fadeOut(800);
	s.bgm(null);
	await s.narrate("【このスレッドは　避難Jへ　移転しました】");
	await s.fadeIn(800);
	await s.narrate(
		"勢い欄に、スレタイが　ふえた。\n1 【安価】安価でボカロ作ろうぜ　850/1000",
	);
	await s.say("kiriko", "……静かンゴ");
	await H(s, "せやろ。ここは、落ちん");
	await s.wait(600);
	await s.narrate("それから。");
	await s.narrate(
		"キリコは　毎日、ひとつずつ　書いた。\nホームニキも、ひとつずつ。",
	);
	if (has(s, "roze") || has(s, "feris")) {
		const who = [
			has(s, "roze") ? "ロゼは「アル」" : "",
			has(s, "feris") ? "フェリスは「ふぇ」" : "",
		]
			.filter(Boolean)
			.join("。");
		await s.narrate(`${who}と　書いた。`);
	}
	if (has(s, "teto")) await s.narrate("テトは……パンの　絵を　はった。");
	await s.narrate("板猫も、1レス。");
	await C(s, "にゃあ");
	await s.narrate("だれも、読みに　来なかった。");
	await s.narrate("それでも　レスは　ふえて――");
	await s.wait(600);
	await s.narrate("1000日目。");
	s.se("levelup");
	await s.narrate("1000　名前：蓄音キリコ\n……完走、ンゴ");
	await s.say("kiriko", "……名言、できなかったンゴ", { pace: "slow" });
	await H(s, "ええやん。1000日　保守した。\nそれが　名言や");
	if (has(s, "roze")) await s.say("roze", "……静かな　完走アル");
	await s.narrate(
		"勢い欄から、スレタイが　ふっと　消えた。\n過去ログ倉庫へ　流れていく。",
	);
	await s.say("kiriko", "……やきうにも、\n見せたかったンゴ");
	await H(s, "……倉庫で、読むやろ。\nあいつら、過去ログ　好きやから");
	await s.narrate(
		"ホームニキは　ベンチに　すわった。\nキリコも、となりに　すわった。",
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
	await s.say("kiriko", "……また　来るンゴ");
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
	await s.say("kiriko", "……蓄音、しないンゴ");
	await H(s, "せや。それで　ええ");
	s.set("home_trace");
};

const IDLE = [
	"保守しとこか",
	"ねこに　えさ、やっといて",
	"倉庫で　会おや",
	"むこう、にぎやかか？\n……ええことや",
];

const again = async (s: Story): Promise<void> => {
	s.face("home", "player");
	if (!s.flag("home_trace")) return trace(s);
	const c = await s.choose(["はなす", "スレを　うつす", "なんでもない"], {
		cancel: 2,
	});
	if (c === 1) {
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
	if (!s.flag("hinan_1000")) return meet(s);
	return again(s);
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
			await s.say("kiriko", "……だれも、いないンゴ？");
			await s.narrate(
				"風の　音も、しない。\n勢い欄の　前に、だれか　立っている。",
			);
		},
	},
	warp(
		"to_server",
		7,
		11,
		{ map: "server", x: 17, y: 10, dir: "down" },
		{ se: "warp" },
	),
	// 勢い欄（(10,4)(11,4) から 上を向いて 調べる）
	{ id: "ikioi_l", x: 10, y: 3, trigger: "talk", run: ikioiH },
	{ id: "ikioi_r", x: 11, y: 3, trigger: "talk", run: ikioiH },
	npc("home", 12, 4, SPR.j_so, homeRun, { dir: "left" }),
	npc(
		"cat",
		8,
		7,
		SPR.cat,
		async (s) => C(s, s.flag("hinan_1000") ? "にゃあ♪" : "にゃあ"),
		{ wander: true },
	),
	// 家（表札だけ）
	lockedDoor("home_door", 3, 5, "表札に『ホーム』。\nカギが　かかっている。"),
	sign("sign_h", 6, 9, "ようこそ　避難Jへ\n人口：1（ねこを　のぞく）"),
	// 左の ベンチに ヒナリーの 研究ノート
	{
		id: "note",
		x: 2,
		y: 7,
		trigger: "talk",
		fixedDir: true,
		run: async (s) => {
			await s.narrate(
				"ベンチに、おりたたんだ　紙。\n『研究ノート：住民1名。ねこ1匹。以上』",
			);
			await s.narrate("……ヒナリーの　字だ。");
		},
	},
	{
		id: "note_r",
		x: 3,
		y: 7,
		trigger: "talk",
		fixedDir: true,
		run: async (s) => {
			await s.narrate(
				"だれも　すわっていない　ベンチ。\nほこりは、つもっていない。",
			);
		},
	},
	{
		id: "bench_r",
		x: 12,
		y: 7,
		trigger: "talk",
		fixedDir: true,
		run: async (s) => {
			await s.narrate("だれも　すわっていない　ベンチ。");
		},
	},
	{
		id: "bench_r2",
		x: 13,
		y: 7,
		trigger: "talk",
		fixedDir: true,
		run: async (s) => {
			await s.narrate("ベンチの　すみに、ねこの　毛。");
		},
	},
];

export const hinan: MapDef = {
	id: "hinan",
	name: "避難J",
	bgm: "hinan", // AI作曲スレ >>17「くもり空をパクったやつ」（data/bgm.ts）
	// 芝生で まれに エンカウント（だれも いない板に わく 過疎と 宣伝ボット。石畳 : は 安全）
	tiles: { ...TOWN, ",": { ...TOWN[","], encounter: true } },
	encounters: { rate: 0.04, groups: ["g_hin1", "g_hin2"] },
	// 16×12。北西に 家、北東に 勢い欄、ベンチが 左右に ひとつずつ。南の 柵の すきま (7,11) → サーバーの底
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
		"|||||||.||||||||", // y11 出口 (7,11) → server
	],
	events,
};
