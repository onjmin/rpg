// 仲間との親睦：ひとやすみ会話（仲間どうしの掛け合い）・なかまと話す・プロフィール。
// なかよし度（♥0〜5）は会話を見るたびに上がり、プロフィールが少しずつ読めるようになる。
// 中身は src/data/bonds/ に分けて書く（章のフラグ ch・b1・b2… を when に使う）。

import type { BondData } from "../engine/defs";
import * as chatsRozeFeris from "./bonds/chats-roze-feris";
import * as chatsTetoNanj from "./bonds/chats-teto-nanj";
import { dates } from "./bonds/dates";
import * as skitsA from "./bonds/skits-a";
import * as skitsB from "./bonds/skits-b";

const parts = [skitsA, skitsB, chatsRozeFeris, chatsTetoNanj];

export const bonds: BondData = {
	skits: parts.flatMap((p) => p.skits),
	chats: parts.flatMap((p) => p.chats),
	profiles: parts.flatMap((p) => p.profiles),
	dates,
};
