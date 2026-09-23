// BGM（MML）。出典: うんｊレゼ「AI作曲スレ」https://unj-reze.onjmin.workers.dev/post/1318 （名無し2rt さん）
// 歌入りの曲も playMML / studio.play では歌詞行（@@n）が除かれ、インストとして鳴る。

import battle from "./bgm/battle.mml?raw"; // b5ed6f97d24d49a4「ゲームっぽい」
import boss from "./bgm/boss.mml?raw"; // 028dced82045410e「歌抜いたら戦闘曲っぽい？」
import dungeon from "./bgm/dungeon.mml?raw"; // 5c8b9ca2c4514e10
import ending from "./bgm/ending.mml?raw"; // b312cbafed564277「変ト長調 (G♭) デュエット」
import field from "./bgm/field.mml?raw"; // 164e63f5f56643c2「何か」
import field2 from "./bgm/field2.mml?raw"; // 789ecdd88cb049f8「？」
import lastboss from "./bgm/lastboss.mml?raw"; // e2aae8c7641b40ab「短調バイオリン」
import sad from "./bgm/sad.mml?raw"; // 155deb066bc94429「イ短調（Aマイナー）」
import tense from "./bgm/tense.mml?raw"; // 1d9e7eed2db44ce7「荒ぶるメロディライン」
import title from "./bgm/title.mml?raw"; // 6c5cd6e3edc4433b「ゲーム音楽っぽい何か」
import town from "./bgm/town.mml?raw"; // 2826c0b1ce744003「？」

export const bgm: Record<string, string> = {
	title,
	town,
	field,
	field2,
	dungeon,
	battle,
	boss,
	sad,
	tense,
	lastboss,
	ending,
};
