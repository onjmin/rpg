// あなたの1000レス目のスレ（自由度 F6。scratchpad/freedom/spec.md §4 F6・§6）。
// プレイヤーがしたこと（フラグ）から、レスの洪水（last）・エンディングの差分（thread）・
// まとめカード（スタッフロールのあと）の文を組み立てる。
// 文の幅は validate が FLAG_DOMAIN の値を1つずつ・ランダムに組み合わせて検査する。
// 結果は文の中にだけ出す（「〇〇は覚えている」のような通知・統計・％は出さない）。

import type { EndingSummary, GameState } from "../engine/defs";
import { meigenQuote, symCount } from "./freedom";

type Flags = GameState["flags"];
type Variant = (st: GameState) => string | null;

/** ここで読むフラグと、とりうる値（validate が総当たりに使う。undefined は「記録なし」）。 */
export const FLAG_DOMAIN: Record<
	string,
	(string | number | boolean | undefined)[]
> = {
	kakugari: [undefined, true],
	anka_100t: [undefined, true],
	b1_how: [undefined, "fight", "shukudai", "neta", "lose"],
	hw_help: [undefined, true],
	lose_b1: [undefined, 1, 2],
	reply_kako: [undefined, "uke", "kaesu", "neta"],
	reply_srv: [undefined, "uke", "kaesu", "neta", "chikuon"],
	daida: [undefined, 0, 1, 2],
	meigen3: [undefined, 0, 1, 2],
	sym_sym1: [undefined, "fight", "res"],
	sym_sym2: [undefined, "fight", "res"],
	sym_sym3: [undefined, "fight", "res"],
	balse_n: [undefined, 1, 12],
	lose_n: [undefined, 1, 15],
	date_roze: [undefined, true],
	date_feris: [undefined, true],
	date_teto: [undefined, true],
	date_nanj: [undefined, true],
	puyu: [undefined, "ame", "uta", "suwaru"],
	puyu_met: [undefined, true],
};

/** 文字列フラグの値で表を引く（記録なし・想定外の値は undefined）。 */
const byFlag = <T>(
	table: Partial<Record<string, T>>,
	v: Flags[string] | undefined,
): T | undefined =>
	typeof v === "string" && Object.hasOwn(table, v) ? table[v] : undefined;

/** 数のフラグ（数でなければ 0）。 */
const num = (f: Flags, k: string): number => {
	const v = f[k];
	return typeof v === "number" ? v : 0;
};

/** 代打の選択（0 打つ／1 見送る／2 バント。記録なしは -1）。 */
const daidaOf = (f: Flags): number => {
	const v = f.daida;
	return v === 0 || v === 1 || v === 2 ? v : -1;
};

// ───────────────── レスの洪水（last。>>991〜>>999 の3画面） ─────────────────

/** >>992 レスバJ民（reply_srv）。 */
const S992: Record<string, string> = {
	uke: "ソース、見に来たで",
	kaesu: "ソースは　キリコや",
	neta: "マーボー　持ってきた",
	chikuon: "ワイのも　ためとけ",
};
/** >>994 番長（b1_how。fight・記録なしは既存の文）。 */
const S994: Record<string, string> = {
	shukudai: "絵日記、花丸やったで",
	neta: "ファン1号は　ワイや",
	lose: "勝負は　ワイの勝ちや",
};

/** 恩赦のあとのレスの洪水。1要素 = narrate 1回。変わるのは >>992 と >>994 だけ。 */
export const floodScreens = (st: GameState): string[] => {
	const f = st.flags;
	const s992 = byFlag(S992, f.reply_srv) ?? "キリコがんばれ";
	const s994 = byFlag(S994, f.b1_how) ?? "宿題おわったで";
	return [
		`>>991 kskst　>>992 ${s992}\n>>993 ホゲェ　>>994 ${s994}`,
		">>995 避難Jを研究しているヒナリーです\n>>996 ﾌｪﾆｯｸｽ　>>997 アル？ナイ！",
		">>998 くっさ。……けど　保守しといたる\n>>999 ワイらが　もろたで！",
	];
};

// ───────────────── last・エンディングの差分 ─────────────────

/** 髪型・体重の安価の組み合わせ（ボツキリコ＝角刈り・100トン）。 */
const hairWeight = <T>(
	f: Flags,
	both: T,
	hairOnly: T,
	tonOnly: T,
	none: T,
): T =>
	f.kakugari ? (f.anka_100t ? both : hairOnly) : f.anka_100t ? tonOnly : none;

/** ボツキリコ（F1 のあと）：あの夜、どちらかを　えらんだか。 */
const botsuPick = (st: GameState): string =>
	hairWeight(
		st.flags,
		"……お前は　角刈りも　100トンも\nえらんでくれたな",
		"……お前は　一度、角刈りを　えらんでくれたな",
		"……お前は　一度、100トンを\nえらんでくれたな",
		"……お前は　一度も　吾輩を\nえらばなかったな",
	);

/** キリコ（F2 のあと）：ボツも　吾輩の一部。どちらもなしは出さない。 */
const botsuAnswer = (st: GameState): string | null =>
	hairWeight(
		st.flags,
		"それに　吾輩、角刈りも　100トンも\nいちどは　えらんだンゴ",
		"それに　吾輩、いちどは　角刈りを\nえらんだンゴ",
		"それに　吾輩、いちどは　100トンを\nえらんだンゴ",
		null,
	);

/** J民B：名言チャレンジ その3 と >>1000 をくらべる（その3 がないときは出さない）。 */
const meigenJb = (st: GameState): string | null => {
	const q = meigenQuote(st, 2);
	return q ? `「${q}」とは\nえらい　ちがいやな` : null;
};

/** 夏休みキッズ番長（b1_how）。 */
const bancho = (st: GameState): string =>
	byFlag(
		{
			shukudai: "絵日記、先生に　ほめられたで！",
			neta: "ファン1号として　来たったで！",
			lose: "宿題、おわったで！\n……勝負は、ワイの　勝ちやけどな",
		},
		st.flags.b1_how,
	) ?? "宿題、おわったで！";

/** テノヒラ監督（daida）。 */
const kantoku = (st: GameState): string =>
	[
		"代打の　フルスイング、\nやっぱ　神やったわ",
		"代打の　見送り……\nあれは　神の　選球眼や",
		"代打で　バント……\n渋すぎて　神やわ",
	][daidaOf(st.flags)] ?? "やっぱ　キリコは　神やわ";

/** 古参ニキ（reply_kako。記録なしは出さない）。 */
const kosan = (st: GameState): string | null =>
	byFlag(
		{
			uke: "過去ログの　話、\nまた　聞きに　来てな",
			kaesu: "今の　おんJ、ちゃんと\n見せてもろたで",
			neta: "……ほんまに「昔のおんJ」に\nなってまうかもな",
		},
		st.flags.reply_kako,
	) ?? null;

/** レイ（balse_n：!バルス でスレを崩壊させた回数）。 */
const rei = (st: GameState): string => {
	const n = num(st.flags, "balse_n");
	// 回数は出さない（通知・統計にしない）。うれしい、は残す
	return n > 0
		? "本日のログ、保守完了。\n……崩壊も　ふくめて、うれしい、です"
		: "本日のログ、保守完了。\n……当機も、うれしい、です";
};

/** ボツの声の2行目（「……悪くない　安価だったンゴ」のあと）。 */
const botsuVoice = (st: GameState): string =>
	hairWeight(
		st.flags,
		"角刈りも　100トンも、\nけっこう　似合ってたンゴ",
		"角刈りも、けっこう　似合ってたンゴ",
		"100トンも、けっこう\n似合ってたンゴ",
		"……こんど、角刈りも\nためしてほしいンゴ",
	);

/** おんJ民（「次スレ　立てといたで」のあと）：外野席デートを見逃したときだけ。 */
const nanjDate = (st: GameState): string | null =>
	st.flags.date_nanj ? null : "……ナイターは、次スレで\nいっしょに　行こな";

/** ぷゆゆ（puyu：町の小花のそばでの こたえ方）。記録なし（会っていない・またこんど）は既定の一言。 */
const puyu = (st: GameState): string =>
	byFlag(
		{
			ame: "おめでとぷゆ🥺\nおいわいの　おかち、もってきたゆ",
			uta: "うた、たのちみぷゆ🥺\nいちばん　まえで　きくゆ",
			suwaru: "みんな　あつまったゆ🥺\nきょうは、となりが　いっぱいゆ",
		},
		st.flags.puyu,
	) ?? "うゆおー！　かわいいぼくちんも\nおいわいに　きたぷゆ🥺";

/** エンディングと last の差分（null は「その行を出さない」）。 */
export const VARIANTS = {
	botsuPick,
	botsuAnswer,
	meigenJb,
	bancho,
	kantoku,
	kosan,
	rei,
	botsuVoice,
	nanjDate,
	puyu,
} satisfies Record<string, Variant>;

// ───────────────── まとめカード（スタッフロールのあと） ─────────────────

/**
 * 見出し（上から最初に当てはまるもの）。
 * 返し方（reply_srv）は見出しにしない（1つだけ見出しにすると、それが正解に見える）。
 * 負けて通してもらったときも「負け」を見出しにしない。100トン・角刈りは再安価で流れたので「生まれる」と書かない。
 */
const headline = (f: Flags): string =>
	byFlag(
		{
			shukudai: "番長の絵日記を手伝う",
			neta: "番長をファンにする",
			lose: "番長に3回いどむ",
		},
		f.b1_how,
	) ??
	(f.anka_100t
		? "100トンからはじまる"
		: f.kakugari
			? "角刈りからはじまる"
			: "1000レス目で歌う");

/** おでかけの相手（上から順に並べる）。 */
const DATES: [id: string, name: string][] = [
	["roze", "ロゼ"],
	["feris", "フェリス"],
	["teto", "テト"],
	["nanj", "おんJ民"],
];

/** 自分の道（>>101〜1000）。当てはまらない行は出さない。 */
const myThread = (st: GameState): string[] => {
	const f = st.flags;
	const lines: string[] = [];
	const res = (no: string, text: string | null | undefined) => {
		if (text) lines.push(`${no} ${text}`);
	};
	res(
		">>101",
		hairWeight(
			f,
			"角刈り・100トン→再安価で　誕生",
			"角刈り→再安価で　誕生",
			"100トン→再安価で　誕生",
			"ポニテ・34キロで　誕生",
		),
	);
	// 記録なし（旧セーブ）は、勝負で越えるしかなかったので fight
	res(
		">>350",
		byFlag(
			{
				fight: "番長と　勝負して　勝つ",
				shukudai: "番長の　絵日記を　手伝う",
				neta: "番長が　ファン1号に",
				lose: "番長に　通してもらう",
			},
			f.b1_how ?? "fight",
		),
	);
	res(
		">>600",
		byFlag(
			{
				uke: "古参ニキに　昔の話を　聞く",
				kaesu: "古参ニキに　今の　おんJを　語る",
				neta: "古参ニキと　草で　わかりあう",
			},
			f.reply_kako,
		),
	);
	const d = ["フルスイング", "見送り", "まさかの　バント"][daidaOf(f)];
	res(">>850", d && `代打キリコ、${d}`);
	const r = symCount(st, "res");
	const k = symCount(st, "fight");
	res(
		">>851",
		r > 0 && k > 0
			? `ヤジJ民　${r}人と　和解、${k}組と　勝負`
			: r > 0
				? `ヤジJ民　${r}人と　レスで　和解`
				: k > 0
					? `ヤジJ民を　${k}組　しずめる`
					: null,
	);
	const lose = num(f, "lose_n");
	res(">>990", lose > 0 ? `${lose}回　負けても　立っとったな` : null);
	const dates = DATES.filter(([id]) => f[`date_${id}`]).map(([, n]) => n);
	res(
		">>995",
		dates.length === DATES.length
			? "みんなと　おでかけ"
			: dates.length > 0
				? `${dates.join("・")}と　おでかけ`
				: null,
	);
	res(
		">>999",
		byFlag(
			{
				uke: "ソースは、まだ　ない",
				kaesu: "ソースは、吾輩",
				neta: "ソースは、マーボー",
				chikuon: "ソースごと　蓄音",
			},
			f.reply_srv,
		),
	);
	res("1000", "名前：蓄音キリコ");
	return lines;
};

/** 番長の越え方（>>2）。宿題 → ファン → 勝負 の順に回し、自分の越え方の「つぎ」から見る。 */
const B1_OTHER: [route: string, line: string][] = [
	["shukudai", ">>2 ワイは　番長の　宿題　手伝ったで"],
	["neta", ">>2 ワイは　番長を　ファンに　したで"],
	["fight", ">>2 ワイは　番長と　ガチ勝負したで"],
];
/**
 * >>2：この周で　通っていない越え方。負けてから宿題に切りかえた（lose_b1）なら勝負は通った、
 * 宿題を引き受けてから勝負した（hw_help）なら宿題は通った、として飛ばす。
 */
const b1Other = (f: Flags): string => {
	// 記録なし（旧セーブ）は勝負で越えたとみなす（>>350 と同じ）
	const v = typeof f.b1_how === "string" ? f.b1_how : "fight";
	const how = v === "lose" ? "fight" : v;
	const taken = new Set([how]);
	if (num(f, "lose_b1") > 0) taken.add("fight");
	if (f.hw_help) taken.add("shukudai");
	const k = B1_OTHER.findIndex(([r]) => r === how);
	for (let i = 1; i <= B1_OTHER.length; i++) {
		const [r, line] = B1_OTHER[(k + i) % B1_OTHER.length];
		if (!taken.has(r)) return line;
	}
	return B1_OTHER[0][1];
};

/** >>4：返し方（reply_srv）の「つぎ」の返し方（どれか1つを正解のように指さない）。 */
const S4: Record<string, string> = {
	uke: ">>4 ソースは　吾輩って　返したやつ　おる？",
	kaesu: ">>4 ソースは　マーボーやったやつ　おる？",
	neta: ">>4 ソースごと　蓄音したやつ　おる？",
	chikuon: ">>4 ソースは　まだ　ない派　おる？",
};

/**
 * >>5：ぷゆゆ（puyu）。会っていない人の次スレには「はじめまして」、
 * 会って「またこんど」だけの人には「またきてゆ」が書きこまれる。
 */
const S5: Record<string, string> = {
	ame: ">>5 おかち　もってくゆ🥺",
	uta: ">>5 サビの　入り、まってゆ🥺",
	suwaru: ">>5 となり、あいてゆ？🥺",
};

/** 次スレ：ほかの名無しが、自分が　えらばなかった道を　書きこむ（>>5 は ぷゆゆ）。 */
const nextThread = (f: Flags): string[] => [
	">>1 たておつ",
	b1Other(f),
	// 安価は絶対（どちらも再安価で流れた）ので、「ワイのキリコは　100トン」とは書かない
	!f.anka_100t
		? ">>3 ワイは　100トン　えらんだで"
		: !f.kakugari
			? ">>3 ワイは　角刈り　えらんだで"
			: ">>3 ワイは　ポニテ派や",
	byFlag(S4, f.reply_srv) ?? S4.neta,
	byFlag(S5, f.puyu) ??
		(f.puyu_met ? ">>5 またきてゆ🥺" : ">>5 きみ、はじめて　みるかおぷゆ？🥺"),
];

/** スタッフロールのあとの「このスレの　まとめ」（1行22字まで・1セクション10行まで）。 */
export const threadSummary = (st: GameState): EndingSummary => ({
	sections: [
		{
			title: `【完走】蓄音キリコ、${headline(st.flags)}`,
			lines: myThread(st),
		},
		{
			title: "【次スレ】蓄音キリコのうた　Part2",
			lines: nextThread(st.flags),
		},
	],
});
