// おでかけ（teto）：パン屋でフランスパンを半分こ → 奥の小さなカラオケ。
// 行き先は odekake の③（maps/odekake.ts・odekake-spots.md）。キリコ (63,11)・テト (64,11) に着く。
// カウンターの前 (59,6)(60,6) → テーブルのいす (58,8)(60,8) → ステージ (67,4)(69,4)。
// テーブルとステージへは、ふたりの道が重ならない（または2マス離れている）ので同時に歩かせる。
// 次スレで 前のパンのふくろを持っていれば（again）、テトが約束どおり「1曲だけ」いっしょに歌う
// （隠しイベント「ふたつめの　おもいで」。次スレの キリコは 前スレを覚えていない）。
import type { DateDef } from "../../../engine/defs";
import { ODEKAKE } from "../../maps/odekake";
import { dateTrip, silent } from "../../story";

export const date: DateDef | null = {
	who: "teto",
	title: "パン屋と　カラオケ",
	minBond: 3,
	when: (st) =>
		!!st.flags.teto_in && st.party.some((m) => m.id === "teto") && !silent(st),
	run: async (s) => {
		await dateTrip(
			s,
			"teto",
			{ map: "odekake", ...ODEKAKE.teto },
			async (s) => {
				// 次スレで、前の周の おもいでの品を持っている（give の前に決める）
				const again = !!s.flag("p2") && s.has("memo_teto") > 0;
				s.bgm("town");
				await s.wait(300);
				s.face("date_teto", "left");
				s.face("player", "right");
				await s.say(
					"teto",
					"ここの　フランスパンは　絶品だ。\n……ボクの　行きつけさ",
				);

				// パンのカウンターへ（テトは少しおくれて、キリコのあとを歩く。
				// すぐ後ろを同時に歩くと、動いている途中のキリコにぶつかって1歩たりなくなる）
				await Promise.all([
					s.move("player", "uuuuullllU"),
					s.move("date_teto", "wwuuuuullllU"),
				]);
				await s.say(null, "いらっしゃい。フランスパン、\nやきたてだよ", {
					name: "パン屋",
				});
				await s.say("teto", "1本で　いい。……ふたりで　わけるから");
				s.face("player", "right");
				await s.say("kiriko", "はんぶんこ！　先輩と　はんぶんこ！");

				// テーブルのいすへ（向かい合って座る）
				await Promise.all([
					s.move("player", "lddR"),
					s.move("date_teto", "ddL"),
				]);
				s.set("odk_pan");
				s.show("odk_pan");
				s.se("decide");
				await s.narrate("パリッ。\nテトは　大きいほうを　キリコに　よこした。");
				await s.say("kiriko", "この音……あの夜と　おなじ音ンゴ");
				await s.say("teto", "……覚えてたのか。\nいいから　食え。冷めるぞ");
				await s.say("kiriko", "先輩の　ぶんが、小さい");
				await s.say("teto", "ボクは　小食なんだ。……キメラだからな");
				await s.say("kiriko", "キメラ、関係あるンゴ？");
				await s.say(
					"teto",
					"……食べたら、奥の　カラオケだ。\n腹ごなしに　ちょうどいい",
				);

				// 奥のステージへ（テトが右前を歩く）
				await s.wait(300);
				await Promise.all([
					s.move("player", "drrrrrrrrruuuuuR"),
					s.move("date_teto", "drrrrrrrrruuuuuL"),
				]);
				await s.say(
					"teto",
					"前にも　言ったろ。ボクの\n苦手なことは　歌だ。公式でね",
				);
				await s.say(
					"kiriko",
					"でも　吾輩が　歌える曲は、\nふたつとも　先輩の曲",
				);
				const song = await s.choose([
					"オーバーライド",
					"好きな惣菜発表ドラゴン",
				]);
				s.face("date_teto", "down");
				await s.say(
					"teto",
					song === 0
						? "……よりによって、それか。\n本人の　前で　歌うのか"
						: "……ドラゴンの　ほうか。\n本人の　前で　歌うのか",
				);

				if (again) {
					// 前スレの約束（「次は……1曲だけ、いっしょに　歌ってやる」）。ふたりで歌う
					await s.narrate("テトが、もう　1本の　マイクを\nにぎった。");
					await s.say("kiriko", "……先輩も？");
					await s.say("teto", "……1曲だけ、だ");
					s.face("player", "up");
					s.face("date_teto", "up");
					s.se("decide");
					s.bgm("field2");
					await s.wait(600);
					await s.narrate("ふたりで　歌った。\n半音　ずれた　声が、ふたつ。");
					await s.wait(1200);
					s.bgm("sad");
					s.face("player", "right");
					s.face("date_teto", "left");
					await s.say("teto", "……ふたりとも、半音\nずれてた");
					await s.say("kiriko", "……おそろいンゴ");
				} else {
					// キリコが歌う
					s.face("player", "up");
					s.se("decide");
					s.bgm("field2");
					await s.wait(600);
					await s.narrate(
						"キリコは　マイクを　にぎって　歌った。\n吐息の多い、ちいさな　歌声で。",
					);
					await s.wait(1200);
					s.bgm("sad");
					s.face("player", "right");
					s.face("date_teto", "left");
					await s.say(
						"teto",
						"……音程、半音　ずれてた。\n……でも、ボクの曲が　君の声で　鳴ってた",
					);
					await s.say("kiriko", "苦手でも、先輩の歌は\n吾輩の　いちばんンゴ");
				}
				await s.say("teto", "……君は　じつに　馬鹿だな");
				await s.narrate(
					"あの夜と　おなじ　セリフ。\nでも、いちばん　やさしい　言い方だった。",
				);

				// おみやげ
				await s.say(
					"kiriko",
					"この　パンのふくろ、とっておく。\n先輩と　はんぶんこした　記念ンゴ",
				);
				s.give("memo_teto");
				s.se("item");
				await s.narrate(
					"「はんぶんこの　パンのふくろ」を\nたいせつに　しまった。",
				);
				if (again)
					await s.narrate(
						"カバンの　なかで、紙ぶくろが\nかさりと　かさなった。",
					);
				s.face("date_teto", "down");
				await s.say(
					"teto",
					again
						? "……ただの　紙ぶくろだぞ。\n……次も、1曲だけだ"
						: "……ただの　紙ぶくろだぞ。\n次は……1曲だけ、いっしょに　歌ってやる",
				);
				await s.wait(500);
				s.set("odk_pan", false);
			},
		);
	},
};
