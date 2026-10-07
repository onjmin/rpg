// 「はなす」（フィールドのメニューの いちばん上）。ドラクエ7の「はなす」のように、
// いる場所・いまの場面について、仲間が 順に ひとことずつ言う（たたかう仲間の隊列の順、そのあと控え）。
// 何回でも聞ける。なかよし度は 上がらない（1対1の話は「なかま」→ その人 →「ふたりで　はなす」）。
//
// 書き方：
// - 同じ人の分は 上から順に調べ、最初に当てはまったものを使う。せまい場所・特別な条件を上に、
//   マップ全体を その下に。どこでもの分（map を書かない）は remarks/any.ts の 最後に。
// - 1人 1〜2窓。キリコの返しは あっても 1行。全員ぶん 続けて流れるので、長くしない。
// - その場で 見えるもの・起きたことへの 感想だけ。説明は させない（README「セリフの書き方」）。
//   裏シナリオの 真相は、だれも 口に しない（remarks/kaso.ts の 頭）。
// - キリコの行は 沈黙中なら 書きこみに なる（ks）。

import type { RemarkDef, RemarkLine, Story } from "../engine/defs";
import { after } from "./remarks/after";
import { any } from "./remarks/any";
import { kakolog } from "./remarks/kakolog";
import { kaso } from "./remarks/kaso";
import { road } from "./remarks/road";
import { stadium } from "./remarks/stadium";
import { thread } from "./remarks/thread";
import { town } from "./remarks/town";
import { voice } from "./remarks/voice";
import { ks } from "./story";

/** ひとこと1つぶんを流す。 */
export const playRemark = async (
	s: Story,
	lines: RemarkLine[],
): Promise<void> => {
	for (const [who, text] of lines) {
		if (who === null) await s.narrate(text);
		else if (who === "kiriko") await ks(s, text);
		else await s.say(who, text);
	}
};

export const remarks: RemarkDef[] = [
	...thread,
	...town,
	...road,
	...kakolog,
	...stadium,
	...voice,
	...after,
	...kaso,
	...any,
];
