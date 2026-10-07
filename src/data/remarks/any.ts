// 「はなす」：どこでもの分（remarks.ts の いちばん最後）。
// その場所に 書いた ひとことが 無いとき、いまの区間（story.ts の SECTIONS）の 目的を その人の口で。
// 最後の 受け皿（map も when も無い）は 人ごとに 1つ（validate が見る）。

import type { RemarkDef } from "../../engine/defs";
import { during, has, scene } from "./lib";

export const any: RemarkDef[] = [
	// ───────── やきう ─────────
	...scene(
		{ when: during("ikioi") },
		{ nanj: "まずは　広場の　勢い欄や。\nスレの　調子、見とこ" },
	),
	...scene(
		{ when: during("road") },
		{ nanj: "宣伝は　足で　かせぐもんや。\n北の　スレ街道、行こか" },
	),
	...scene(
		{ when: during("bridge") },
		{ nanj: "橋の　番長、どうにか　せんと\n先へ　進めんで" },
	),
	...scene(
		{ when: during("kakolog") },
		{ nanj: "倉庫の　おくに　なにが　おるか、\nたしかめな　あかん" },
	),
	...scene(
		{ when: during("stadium") },
		{ nanj: "控えからでも　声は　出せる。\n……ほな、いくで" },
	),
	...scene(
		{ when: has("clear") },
		{ nanj: "次スレの　ことは、\n次スレの　ワイが　考えるわ" },
	),
	...scene({}, { nanj: "ま、なんとか　なるやろ" }),

	// ───────── ロゼ ─────────
	...scene(
		{ when: during("bridge") },
		{ roze: "橋の　番長、夏休みの\n宿題は　すんでるアル？" },
	),
	...scene(
		{ when: during("kakolog") },
		{ roze: "落ちた　スレは、倉庫で\n眠ってるアル。……そっと　行くアル" },
	),
	...scene(
		{ when: during("stadium") },
		{ roze: "ナイターは　夜アル。\n……わたしの　時間アル" },
	),
	...scene(
		{ when: during("mamma") },
		{ roze: "……マッマの　ところへ\n行くアル" },
	),
	...scene(
		{ when: during("server") },
		{ roze: "アク禁の　扉の　むこうに、\n1000レス目が　あるアル" },
	),
	...scene({ when: during("gate") }, { roze: "……もうすぐアル" }),
	...scene(
		{ when: has("clear") },
		{ roze: "完走の　あとの　夜も、\nわるくないアル" },
	),
	...scene({}, { roze: "……なにか　あったら、\n言うアル" }),

	// ───────── フェリス ─────────
	...scene(
		{ when: during("stadium") },
		{ feris: "やきうくんたちと、\nまた　勝負だね〜" },
	),
	...scene({ when: during("mamma") }, { feris: "……となり、いるからね〜" }),
	...scene(
		{ when: during("server") },
		{ feris: "下へ　下へ、だね〜。\nあとで　ちゃんと　ageようね〜" },
	),
	...scene(
		{ when: during("gate") },
		{ feris: "いちばん　上まで、\nいっしょに　とんでいこ〜" },
	),
	...scene(
		{ when: has("clear") },
		{ feris: "完走の　あとって、\nなんだか　ねむいね〜" },
	),
	...scene({}, { feris: "ん〜？　なあに〜？" }),

	// ───────── テト ─────────
	...scene(
		{ when: during("server") },
		{ teto: "……アク禁の　扉か。\nひらかないなら、ひらかせるまでだ" },
	),
	...scene(
		{ when: during("gate") },
		{ teto: "……行くぞ。\nのどの　準備は　できてるな" },
	),
	...scene(
		{ when: has("clear") },
		{ teto: "……完走か。\nまあ、悪くない　スレだった" },
	),
	...scene({}, { teto: "……用が　ないなら、\nボクは　パンでも　かじってる" }),
];
