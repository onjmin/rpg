// ゲームデータをまとめる（設計書 §12-3・§12-4）。

import type { GameData } from "../engine/defs";
import { enemies, groups, items, skills } from "./battle";
import { bgm } from "./bgm";
import { bonds } from "./bonds";
import { cast } from "./cast";
import { registerItemNames } from "./helpers";
import { kakolog } from "./maps/kakolog";
import { last } from "./maps/last";
import { odekake } from "./maps/odekake";
import { road } from "./maps/road";
import { server } from "./maps/server";
import { stadium } from "./maps/stadium";
import { studio } from "./maps/studio";
import { thread } from "./maps/thread";
import { town } from "./maps/town";
import { sfx } from "./sfx";

export const data: GameData = {
	title: "蓄音キリコ\n〜1000レス目のうた〜",
	subtitle: "おんJ発UTAU RPG",
	maps: { thread, town, road, kakolog, stadium, studio, server, last, odekake },
	cast,
	enemies,
	groups,
	items,
	skills,
	bonds,
	bgm,
	sfx,
	battleBgm: "battle",
	bossBgm: "boss",
	victoryBgm: "title",
	titleBgm: "title",
	endingBgm: "ending",
	start: {
		mapId: "thread",
		x: 6,
		y: 7,
		dir: "up",
		party: ["kiriko"],
		items: { candy: 3 },
		flags: { ch: 0, res: 0 },
	},
	credits: [
		"# 蓄音キリコ　〜1000レス目のうた〜",
		"",
		"# 登場キャラクター",
		"蓄音キリコ",
		"© おーぷん2ちゃんねる有志",
		"（音声: 野良 / キャラクター: 釣りンゴ / ロゴ: ロゴ太郎）",
		"https://suzuhete.wixsite.com/home",
		"",
		"束音ロゼ",
		"（音声: 面倒ミル / キャラクター: wQ8G）",
		"https://tabaneroze.ninja-web.net/",
		"",
		"重音テト",
		"© 線・小山乃舞世／TWINDRILL",
		"",
		"足立レイ",
		"© Mechanical Girl",
		"",
		"フェリス・ヒナリー・ムッジェ・やきう民",
		"なんJ・おんJ のみんな",
		"",
		"（本作のキャラクターの口調・設定の一部は",
		"　非公式の創作です）",
		"",
		"# BGM",
		"うんｊレゼ「AI作曲スレ」",
		"名無し2rt さん",
		"",
		"# 効果音・ドット絵",
		"RPGEN 素材",
		"キリコの歩行グラ: https://i.imgur.com/hNXnQHv.png",
		"",
		"# 音声合成（ボイスON時）",
		"@onjmin/dtm・koe UtauTTS",
		"HTS voice tohoku-f01",
		"(CC BY 4.0, Tohoku University)",
		"",
		"# フォント",
		"DotGothic16",
		"",
		"# スペシャルサンクス",
		"おーぷん2ちゃんねる　なんでも実況J のみんな",
		"",
		"# おしまい",
	],
};

registerItemNames(
	Object.fromEntries(Object.values(items).map((i) => [i.id, i.name])),
);
