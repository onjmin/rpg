// おでかけ（nanj）：おんJスタジアムの外野席でナイター観戦。
// フライのかんちがい → 手のひら返し → ホームランボールを釣りのタモ網でキャッチ（memo_nanj）。
// 試合のあと「名付け親はワイ（自称）」をしんみり回収し、UTAU の声が無いおんJ民の
// 応援の声を、キリコが蓄音機に録る。
// 舞台は odekake マップの ④ おんJ民の区画（scratchpad/design/odekake-spots.md）。
// おんJ民は アク禁（akukin）で離れたあとは戻らないので、それまでの間だけ行ける。
// 隠しイベント「ふたつめの　おもいで」（次スレの キリコは 前スレを覚えていない）：
// - promised：エンディングの「ナイターは、次スレで」の約束（keep_nighter。thread.ts が立てる）を果たす
// - again：前のホームランボールを持っていれば、カバンの中で ボールどうしが鳴る
import type { DateDef, GameState } from "../../../engine/defs";
import { ODEKAKE } from "../../maps/odekake";
import { dateTrip, silent } from "../../story";

const inParty = (st: GameState, id: string): boolean =>
	st.party.some((m) => m.id === id);

export const date: DateDef | null = {
	who: "nanj",
	title: "外野席で　ナイター",
	minBond: 3,
	when: (st) => inParty(st, "nanj") && !st.flags.akukin && !silent(st),
	run: (s) =>
		dateTrip(s, "nanj", { map: "odekake", ...ODEKAKE.nanj }, async (s) => {
			// 次スレで、前の周の おもいでの品を持っている／約束がある（give の前に決める）
			const again = !!s.flag("p2") && s.has("memo_nanj") > 0;
			const promised =
				!!s.flag("keep_nighter") ||
				(!!s.flag("p2") && s.has("memo_nanj") === 0);
			s.bgm("field2");
			await s.narrate(
				"ナイターの　おんJスタジアム。\n外野席の　最前列に　ならんで　すわった。",
			);

			// タモ網（あとでホームランボールをすくう前ふり）
			s.face("date_nanj", "left");
			s.face("player", "right");
			if (promised) {
				await s.say("nanj", "ええ席やろ？　……前スレから\nとっといたんや");
				await s.say("kiriko", "……前スレ？");
				await s.say(
					"nanj",
					"なんでも　あらへん。\n……って、なんで　タモ網　持っとんねん",
				);
			} else
				await s.say(
					"nanj",
					"ええ席やろ？\n……って、なんで　タモ網　持っとんねん",
				);
			await s.say("kiriko", "釣り人の　たしなみ");

			// 外野フライ（外野手がフェンスぎわへ下がる）
			s.face("date_nanj", "down");
			await s.say("nanj", "さよか。……お、外野フライや！");
			await s.move("odk_fielder", "u");
			await s.say(
				"kiriko",
				"フライなら　吾輩も　得意ンゴ。\n毛ばりで　魚を　釣るやつ",
			);
			s.face("date_nanj", "left");
			await s.say("nanj", "……その　フライや　ないねん");
			await s.move("odk_fielder", "dU");

			// 点をとられて、手首がまわる
			s.face("player", "down");
			s.face("date_nanj", "down");
			s.se("damage");
			await s.say("nanj", "あかん、3点　とられた。\n今日は　負けや。解散！");
			await s.say("kiriko", "まだ　5回……");

			// ホームラン
			s.se("critical");
			await s.flash("#ffffff", 200);
			await s.narrate(
				"カキーン！　反撃の　一発！\n打球が　まっすぐ　こっちへ　飛んでくる！",
			);
			s.set("odk_ball");
			s.show("odk_ball");
			await s.move("odk_ball", "uuuuu", { through: true, speed: 3 });
			await s.say("nanj", "もろたァ！");
			s.se("miss");
			await s.move("odk_ball", "l", { through: true, speed: 3 });
			await s.say("kiriko", "タモ網の　出番ンゴ！");
			s.hide("odk_ball");
			s.se("item");
			s.give("memo_nanj");
			await s.narrate(
				"キリコは　釣りの　タモ網で\nホームランボールを　すくった！",
			);
			if (again) {
				const n = s.has("memo_nanj");
				await s.narrate("カバンの　なかで、ボールどうしが\nコツンと　鳴った。");
				await s.say("nanj", `……なんで　${n}個　あんねん　草`);
				await s.say("kiriko", "……わからないンゴ");
				await s.say("nanj", "……ま、ええわ");
			}
			await s.move("odk_fielder", "LRLRU");

			s.face("player", "right");
			s.face("date_nanj", "left");
			await s.say(
				"nanj",
				"フライ　得意やんけ！\nこの試合、最初から　信じとったで！",
			);
			await s.say("kiriko", "さっき「解散」って\n言ってた");
			await s.say("nanj", "J民の　手首は　モーター式や");

			// 試合のあと。人が帰って、しずかになる
			s.bgm(null);
			await s.fadeOut(600);
			s.hide("odk_fan1");
			s.hide("odk_fan2");
			s.hide("odk_fielder");
			s.face("player", "down");
			s.face("date_nanj", "down");
			await s.wait(400);
			await s.fadeIn(600);
			s.bgm("sad");
			await s.narrate(
				"試合が　おわって、\nスタンドの　照明が　ひとつ　消えた。",
			);
			await s.say(
				"nanj",
				"名付け親は　自称やけど、\nキリコって　呼んだ回数は　ワイが一番や",
			);
			s.face("player", "right");
			await s.say("kiriko", "呼ばれるたびに　吾輩は\n蓄音キリコに　なれるンゴ");
			await s.say(
				"nanj",
				"ワイには　UTAUの　声は　ない。\n毎日　スレで　騒いどる　だけや",
			);
			await s.say("kiriko", "それも　りっぱな　声ンゴ。\n蓄音させてほしい");

			// 応援の声を蓄音する
			await s.say("nanj", "……しゃあないな。\nかっとばせー！　キーリーコー！");
			s.se("save");
			await s.narrate(
				"蓄音機が　くるくる　まわって、\nその声を　だいじに　ためた。",
			);
			s.face("date_nanj", "left");
			await s.say(
				"nanj",
				promised
					? "……なんや　照れるな。\n次スレ、立てといた　かいが　あったわ"
					: "……なんや　照れるな。\nほな、帰ろか。キリコ",
			);
			await s.say("kiriko", "うん。これからも　いっぱい\n呼んでほしいンゴ");
			// 約束は果たした（keep_ は次スレへ持ち越すので、ここで消す）
			if (promised) s.set("keep_nighter", false);
		}),
};
