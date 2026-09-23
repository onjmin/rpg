// おでかけ（feris）：星の見える丘。
// フェリスは UTAU の声が無いので うたえない。かわりに くしゃみの火花を夜空に上げて見せる。
// キリコは その笑い声を 蓄音機に録る。おもいでの品は memo_feris（はねのしおり）。
// 舞台は odekake マップの ② フェリスの区画（scratchpad/design/odekake-spots.md）。
import type { DateDef, GameState } from "../../../engine/defs";
import { ODEKAKE } from "../../maps/odekake";
import { dateTrip, silent } from "../../story";

const inParty = (st: GameState, id: string): boolean =>
	st.party.some((m) => m.id === id);

export const date: DateDef | null = {
	who: "feris",
	title: "星の　見える　丘",
	minBond: 3,
	when: (st) => !!st.flags.feris_in && inParty(st, "feris") && !silent(st),
	run: (s) =>
		dateTrip(s, "feris", { map: "odekake", ...ODEKAKE.feris }, async (s) => {
			s.bgm("field");
			await s.narrate("町はずれの　丘の上。\n空いっぱいに　星が　出ている。");
			s.face("date_feris", "left");
			s.face("player", "right");
			await s.say(
				"feris",
				"ここ、私の　とっておき〜。\nいちばん　空に　近いんだよ〜",
			);

			// 丸太のベンチへ（フェリスが先）。2人で夜空を見上げる
			await s.move("date_feris", "uurr");
			await s.move("player", "uurr");
			s.face("date_feris", "up");
			s.face("player", "up");
			await s.say(
				"kiriko",
				"囲碁盤にも　星が　あるンゴ。\nまんなかの　星は「天元」",
			);
			await s.say(
				"feris",
				"じゃあ、お月さまが　天元だね〜。\nいい　ところに　打ってあるね〜",
			);

			// 流れ星
			s.set("odk_star");
			s.show("odk_star");
			await s.move("odk_star", "llllllllllll", { through: true, speed: 4 });
			s.hide("odk_star");
			await s.say("kiriko", "あっ、流れ星！　ねがいごと……\n……まにあわなかった");
			s.face("date_feris", "left");
			await s.say(
				"feris",
				"私が　三回　言っといたよ〜。\n「キリコちゃんが　完走できますように」",
			);
			s.face("player", "right");
			await s.say("kiriko", "あの　一瞬で！？");

			// うたえない不死鳥の、かわりの火花
			// （「UTAUの声が無い」話はひとやすみ会話 b_nai_gumi でもするので、ここでは言い直さない）
			s.bgm("sad");
			s.face("date_feris", "up");
			await s.say(
				"feris",
				"流れ星って、ちょっと　私に　にてる〜。\n一回、ぱっと　消えちゃうとこ〜",
			);
			await s.say(
				"feris",
				"うたは　うたって　あげられないけど〜\nかわりに　空、見ててね〜",
			);
			await s.say("feris", "……ふぇ……ふぇ……");
			await s.move("date_feris", "u");
			await s.say("feris", "……フェニックス！");
			s.se("fire");
			await s.flash("#ffb040", 300);
			await s.shake(300);
			await s.move("date_feris", "d");
			s.face("date_feris", "up");
			await s.narrate(
				"ほのおの　くしゃみが　夜空で\nはじけて、火花の　雨に　なった。",
			);
			s.face("player", "up");
			await s.say("kiriko", "わあ……！　きれい……");
			s.face("date_feris", "left");
			await s.say(
				"feris",
				"火花は　すぐ　消えちゃうけど〜。\n消えても、また　飛べるよ〜",
			);
			await s.narrate(
				"ついでに　キリコの　防寒着の\nフードが、ちょっと　こげた。",
			);
			s.face("player", "right");
			await s.say("kiriko", "……あったかく　なったンゴ");
			await s.say("feris", "あはは〜。ほかほかだね〜");

			// 笑い声を蓄音する
			await s.say(
				"kiriko",
				"今の　笑い声、蓄音させて　ほしい。\nうたじゃなくても、フェリスの　声だから",
			);
			s.bgm(null);
			s.se("save");
			await s.wait(600);
			await s.narrate(
				"蓄音機が　くるくる　まわって、\nフェリスの　笑い声を　すいこんだ。",
			);
			// b_nai_gumi（蓄音機がこげる会話）を先に見ていても合うように「はじめて」とは言わない
			await s.say("feris", "……えへへ。私の　声、\n蓄音機に　入っちゃった〜");
			await s.say("feris", "じゃあ　お返しに、これ〜");
			s.give("memo_feris");
			s.se("item");
			await s.narrate(
				"フェリスの　はねのしおりを　もらった！\nほんのり　あったかい。",
			);

			// 小さな、あったかい おわり
			s.bgm("field");
			await s.say(
				"kiriko",
				"吾輩の　囲碁の　本に　はさんで、\nずっと　だいじに　するンゴ",
			);
			s.face("player", "up");
			s.face("date_feris", "up");
			await s.say("feris", "うん〜。また　いっしょに\n星、見に　来ようね〜");
			await s.wait(400);
		}),
};
