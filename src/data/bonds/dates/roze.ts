// おでかけ（roze）：夜の屋台で、激辛の麻婆豆腐をいっしょに食べる。
// 行き先は odekake の①（maps/odekake.ts・odekake-spots.md）。キリコ (7,11)・ロゼ (8,11) に着く。
// 屋台の丸いす (7,9)(8,9) → 赤い縁台 (11,11)(12,11) へ移って、「覚えてる」話をする。
import type { DateDef } from "../../../engine/defs";
import { ODEKAKE } from "../../maps/odekake";
import { dateTrip, silent } from "../../story";

export const date: DateDef | null = {
	who: "roze",
	title: "夜の屋台で　麻婆豆腐",
	minBond: 3,
	when: (st) =>
		!!st.flags.roze_in && st.party.some((m) => m.id === "roze") && !silent(st),
	run: async (s) => {
		await dateTrip(
			s,
			"roze",
			{ map: "odekake", ...ODEKAKE.roze },
			async (s) => {
				s.bgm("town");
				await s.wait(300);
				await s.narrate(
					"町の　うら通り。\n麻婆豆腐の　屋台に　ちょうちんが　ともる。",
				);
				s.face("date_roze", "left");
				s.face("player", "right");
				await s.say(
					"roze",
					"今日は　わたしの　おごりアル。\n先輩の　つとめアル",
				);

				// 屋台の丸いすへ（ふたり同時に）
				await Promise.all([
					s.move("player", "uuU"),
					s.move("date_roze", "uuU"),
				]);
				await s.say(null, "(´・ω・｀) いらっしゃい。\nからさは　どうする？", {
					name: "原住民",
				});
				const hot = await s.choose(["激辛で", "ふつうで"]);
				s.face("date_roze", "left");
				await s.say(
					"roze",
					hot === 0
						? "さすが　わたしの　後輩アル。\n店主さん、激辛　ふたつアル"
						: "……この屋台に　ふつうは　ないアル。\n店主さん、激辛　ふたつアル",
				);
				s.face("date_roze", "up");
				await s.wait(400);
				s.set("odk_mabo");
				s.show("odk_mabo_l");
				s.show("odk_mabo_r");
				s.se("decide");
				await s.wait(400);

				await s.narrate("ひとくち　食べた。\n……口の中で　なにかが　はじけた！");
				s.se("fire");
				await s.shake(400);
				await s.say("kiriko", "か、からい……！\n舌が　ばくはつ　したンゴ！");
				s.face("date_roze", "left");
				await s.say(
					"roze",
					"それが　素粒子の　ロマンアル。\n舌の上で　ぶつかって、はじけるアル",
				);
				s.se("miss");
				await s.narrate(
					"もうもうと　湯気が　のぼる。\n……ロゼの　カツラが、ふわりと　ずれた。",
				);
				s.face("player", "right");
				await s.say(
					"kiriko",
					"吾輩、片目　かくれてるから\n半分しか　見てないンゴ",
				);
				await s.say("roze", "……半分は　見たアルね");

				// 食べおわったら、赤い縁台へ（ロゼが先）
				await s.wait(300);
				await s.move("date_roze", "drrrrdD");
				await s.move("player", "drrrrdD");
				s.bgm("sad");
				await s.narrate(
					"赤い　縁台に　ならんで　すわる。\n湯気が　夜空に　とけていく。",
				);
				await s.say("roze", "キリコは、こわいもの　あるアルか");
				await s.say(
					"kiriko",
					"スレが　落ちたら、吾輩の　ことも\nみんな　わすれちゃう　かな",
				);
				await s.wait(500);
				s.face("date_roze", "left");
				await s.say("roze", "わたしが　覚えてるアル");
				s.face("player", "right");
				await s.say(
					"roze",
					"今日の　からさも、キリコの　顔も。\nぜんぶ　覚えておくアル",
				);
				await s.say(
					"kiriko",
					"……吾輩も、ロゼ先輩の　こと\nぜったい　わすれない",
				);
				s.face("player", "down");
				s.face("date_roze", "down");
				await s.narrate("ふたりとも、なんとなく\n前を　向いた。");
				await s.wait(400);
				await s.say("roze", "……顔が　あついのは、\n麻婆豆腐の　せいアル");

				// おもいでの品
				s.face("date_roze", "left");
				s.face("player", "right");
				await s.say(
					"roze",
					"これ、あげるアル。\n店主さんに　もらった　レンゲアル",
				);
				s.give("memo_roze");
				s.se("item");
				await s.narrate("「屋台のレンゲ」を　もらった！");
				await s.say("kiriko", "今夜の　こと、蓄音機にも\nためておくンゴ");
				await s.say("roze", "からさまで　録音できたら\nノーベル賞アル");
				await s.wait(300);
				s.set("odk_mabo", false);
			},
		);
	},
};
