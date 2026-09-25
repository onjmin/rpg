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
	flood_1: [undefined, "991", "992", "993", "994"],
	flood_2: [
		undefined,
		"995",
		"996",
		"997",
		"m_onsu",
		"m_onchan",
		"m_nichie",
		"m_panmatsu",
		"m_ngoane",
		"m_yayapoji",
	],
	// 洪水の >>995〜>>997 に書きこむ おんJマイナーズ（MINOR_POSTS）
	onsu_kaki: [undefined, true],
	onchan_met: [undefined, true],
	nichie_met: [undefined, true],
	pan_met: [undefined, true],
	ngoane_met: [undefined, true],
	yaya_met: [undefined, true],
	vote: [
		undefined,
		"mujje",
		"ngoane",
		"panmatsu",
		"nichie",
		"onsu",
		"yayapoji",
	],
	p2_n: [undefined, 2, 5],
	// 縛り（shibari）
	play_track: [undefined, true],
	play_item: [undefined, 1],
	play_song: [undefined, 1],
	f2_lv: [undefined, 8, 12], // 8 は LOW_LV（低レベルの さかい目）
	f2_solo: [undefined, true],
	// 洪水の >>998（もうひとつの おにぎり。town の nanjAku で立つ）
	onigiri_done: [undefined, true],
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

/** 洪水の中から 蓄音できる1レス。 */
export type FloodPick = {
	/** フラグに残す番号（まとめカードで引く）。 */
	key: string;
	/** 選択肢の見出し（全角14字まで。フラグで変わる本文は入れない）。 */
	label: string;
	/** ひろったときの キリコの一言。 */
	line: string;
	/** もらえる どうぐ。 */
	item: { id: string; n: number };
};

/** レスの洪水の1波。screen を読ませ、picks があれば そこから1つだけ蓄音できる。 */
export type FloodWave = { screen: string; picks: FloodPick[] };

/** 洪水の >>995〜>>997 に もとから流れるレス（おんJマイナーズが書きこむと、ﾌｪﾆｯｸｽ → アル？ナイ！ → ヒナリーの順に ゆずる）。 */
const WAVE2_BASE: (FloodPick & { text: string })[] = [
	{
		key: "995",
		text: "避難Jを研究しているヒナリーです",
		label: ">>995 ヒナリー",
		line: "となりの　スレの　声ンゴ",
		item: { id: "pan", n: 2 },
	},
	{
		key: "996",
		text: "ﾌｪﾆｯｸｽ",
		label: ">>996 ﾌｪﾆｯｸｽ",
		line: "……ちょっと　こげたンゴ",
		item: { id: "hane", n: 2 },
	},
	{
		key: "997",
		text: "アル？ナイ！",
		label: ">>997 アル？ナイ！",
		line: "やる気は……アルンゴ！",
		item: { id: "spray", n: 3 },
	},
];

/**
 * 会っていれば 洪水に書きこむ おんJマイナーズ（minors.ts）。先の子ほど前に出て、3人まで。
 * 総選挙で1票 入れた子は いちばん前。本文は2人で1行に ならぶので 全角7字まで。
 */
type MinorPost = {
	id: string;
	name: string;
	met: (f: Flags) => boolean;
	text: string;
	line: string;
	item: { id: string; n: number };
	/** まとめカードの文。 */
	sum: string;
};
export const MINOR_POSTS: MinorPost[] = [
	{
		id: "onsu",
		name: "おんすちゃん",
		met: (f) => !!f.onsu_kaki,
		text: "保守ですわ",
		line: "……保守、かえってきたンゴ",
		item: { id: "candy", n: 3 },
		sum: "おんすちゃんの　保守",
	},
	{
		id: "onchan",
		name: "おんちゃん",
		met: (f) => !!f.onchan_met,
		text: "がんばれだおん",
		line: "一軍の　声ンゴ……！",
		item: { id: "hane", n: 1 },
		sum: "おんちゃんの　声援",
	},
	{
		id: "nichie",
		name: "にぃちぇ",
		met: (f) => !!f.nichie_met,
		text: "日曜日だニィ",
		line: "……まだ　火曜日ンゴ",
		item: { id: "candy", n: 2 },
		sum: "にぃちぇの　日曜日",
	},
	{
		id: "panmatsu",
		name: "パン松",
		met: (f) => !!f.pan_met,
		text: "パンを　食え",
		line: "食パンの　声、ひろったンゴ",
		item: { id: "pan", n: 2 },
		sum: "パン松の　パン",
	},
	{
		id: "ngoane",
		name: "ンゴ姉",
		met: (f) => !!f.ngoane_met,
		text: "ンゴねぇ……",
		line: "……だれに　言ってるンゴ？",
		item: { id: "spray", n: 2 },
		sum: "ンゴ姉の　ンゴねぇ",
	},
	{
		id: "yayapoji",
		name: "ヤヤポジ",
		met: (f) => !!f.yaya_met,
		text: "5割で　いいんだ",
		line: "はんぶん、もらうンゴ",
		item: { id: "mabo", n: 1 },
		sum: "ヤヤポジの　5割",
	},
];

/** >>995〜>>997 に ならぶレス（番号の順）。 */
const wave2Posts = (f: Flags): (FloodPick & { text: string })[] => {
	const met = MINOR_POSTS.filter((m) => m.met(f));
	const voted = met.findIndex((m) => m.id === f.vote);
	if (voted > 0) met.unshift(...met.splice(voted, 1));
	const minors = met.slice(0, 3);
	// 長いヒナリーは いつも1行目（残っていれば）。マイナーズは2行目に ならぶ
	const base = WAVE2_BASE.slice(0, 3 - minors.length);
	return [
		...base,
		...minors.map((m, i) => {
			const no = 995 + base.length + i;
			return {
				key: `m_${m.id}`,
				text: m.text,
				label: `>>${no} ${m.name}`,
				line: m.line,
				item: m.item,
			};
		}),
	];
};

/**
 * 洪水で ひろわなかった レス（番号の若い順・5つまで）。1000の先の5レスで使う（thread.ts）。
 * 1波目は4つから1つ、2波目は3つから1つ ひろうので、流れるのは いつも ちょうど5つ
 * （flood_* の無い 古いクリア済みセーブは、7つのうち 先頭の5つ）。
 */
export const floodLeft = (f: Flags): { key: string; no: number }[] =>
	[
		...["991", "992", "993", "994"]
			.filter((k) => k !== f.flood_1)
			.map((k) => ({ key: k, no: Number(k) })),
		...wave2Posts(f)
			.map((p, i) => ({ key: p.key, no: 995 + i }))
			.filter((p) => p.key !== f.flood_2),
	].slice(0, 5);

/** 2波目（>>995〜>>997）。1行目に1レス、2行目に2レス。 */
const wave2 = (f: Flags): FloodWave => {
	const posts = wave2Posts(f);
	const res = posts.map((p, i) => `>>${995 + i} ${p.text}`);
	return {
		screen: `${res[0]}\n${res[1]}　${res[2]}`,
		picks: posts.map(({ text: _, ...p }) => p),
	};
};

/**
 * 恩赦のあとのレスの洪水。流れていくレスは、1波につき1つしか蓄音できない
 * （拾わなかった声は そのまま流れる）。変わるのは >>992・>>994 の本文と、
 * >>995〜>>997 に書きこむ おんJマイナーズ（会った子だけ）と、>>998（onigiri_done）。
 */
export const floodWaves = (st: GameState): FloodWave[] => {
	const f = st.flags;
	const s992 = byFlag(S992, f.reply_srv) ?? "キリコがんばれ";
	const s994 = byFlag(S994, f.b1_how) ?? "宿題おわったで";
	return [
		{
			screen: `>>991 kskst　>>992 ${s992}\n>>993 ホゲェ　>>994 ${s994}`,
			picks: [
				{
					key: "991",
					label: ">>991 kskst",
					line: "加速の　声。……のどに　いいンゴ",
					item: { id: "spray", n: 2 },
				},
				{
					key: "992",
					label: ">>992 レスバJ民",
					line: "あの夜の　返しンゴ",
					item: { id: "mabo", n: 2 },
				},
				{
					key: "993",
					label: ">>993 ホゲェ",
					line: "ホゲェ……　なんでも　ためるンゴ",
					item: { id: "candy", n: 3 },
				},
				{
					key: "994",
					label: ">>994 番長",
					line: "あの夏の　声ンゴ",
					item: { id: "hane", n: 1 },
				},
			],
		},
		wave2(f),
		{
			// おにぎりを 届けていれば、恩赦のあとの やきうの 最初のレスが その礼（town の nanjAku）
			screen: f.onigiri_done
				? ">>998 くっさ。……けど　ごちそうさん\n>>999 ワイらが　もろたで！"
				: ">>998 くっさ。……けど　保守しといたる\n>>999 ワイらが　もろたで！",
			picks: [],
		},
	];
};

/** 蓄音したレス（まとめカード）。 */
const FLOOD_SUM: Record<string, string> = {
	"991": "kskst（>>991）",
	"992": "レスバJ民の　ソース（>>992）",
	"993": "ホゲェ（>>993）",
	"994": "番長の　夏（>>994）",
	"995": "ヒナリーの　あいさつ（>>995）",
	"996": "ﾌｪﾆｯｸｽ（>>996）",
	"997": "アル？ナイ！（>>997）",
};

/** 蓄音したレスの まとめカードの文（おんJマイナーズは 番号を 並びから引く）。 */
const floodSum = (
	f: Flags,
	v: Flags[string] | undefined,
): string | undefined => {
	const m = typeof v === "string" && MINOR_POSTS.find((x) => `m_${x.id}` === v);
	if (!m) return byFlag(FLOOD_SUM, v);
	const no = wave2Posts(f).findIndex((p) => p.key === v);
	return no < 0 ? m.sum : `${m.sum}（>>${995 + no}）`;
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

/** やきう（「次スレ　立てといたで」のあと）：外野席デートを見逃したときだけ。 */
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

// ───────────────── 縛り（仕様では できるが、ふつうは しない 遊び方） ─────────────────
// play_track は このしくみを入れたあとに はじめた記録にだけ立つ（古いセーブを「縛り」と まちがえない）。
// play_item・play_song は仲間が どうぐ・うたを 使った回数（engine/party.ts の countPlay）。
// f2_lv・f2_solo は ボツキリコ（F2）に勝ったときの キリコのレベルと、ひとりで たたかったか（last.ts）。

/** これ以下のレベルで F2 に勝ったら「低レベル」（目安は Lv10〜11。勝ったあとの けいけんちも ふくむ）。 */
export const LOW_LV = 8;

type Shibari = "item" | "song" | "lv" | "solo";

/** 当てはまる縛り（見出しの順）。 */
export const shibari = (f: Flags): Shibari[] => {
	const out: Shibari[] = [];
	if (f.play_track && !num(f, "play_item")) out.push("item");
	if (f.play_track && !num(f, "play_song")) out.push("song");
	const lv = num(f, "f2_lv");
	if (lv > 0 && lv <= LOW_LV) out.push("lv");
	if (f.f2_solo) out.push("solo");
	return out;
};

/** まとめカードの呼び名。 */
const SHIBARI_NAME: Record<Shibari, string> = {
	item: "どうぐ縛り",
	song: "うた縛り",
	lv: "低レベル",
	solo: "キリコひとり",
};

/** まとめカード（>>998）。2つまでは 並べ、3つ以上は まとめる。 */
const shibariLine = (f: Flags): string | null => {
	const list = shibari(f);
	if (!list.length) return null;
	if (list.length > 2) return "縛りまみれで　1000ゲット";
	return `${list.map((k) => SHIBARI_NAME[k]).join("・")}で　1000ゲット`;
};

/** どうぐを1つも使わずに完走（テトが気づく）。 */
const shibariItem = (st: GameState): string | null =>
	shibari(st.flags).includes("item")
		? "……君、ここまで　のどあめ\nひとつも　なめてないだろ"
		: null;

/** うたを1度も歌わずに完走（ロゼが気づく）。 */
const shibariSong = (st: GameState): string | null =>
	shibari(st.flags).includes("song")
		? "……キリコ、ここまで　ずっと\nなぐってた　だけアル？"
		: null;

/** 低レベルで ボツキリコに勝つ（やきうが気づく）。 */
const shibariLv = (st: GameState): string | null =>
	shibari(st.flags).includes("lv")
		? "……いま　気づいたけど、\nワイら　めっちゃ　弱ない？"
		: null;

/** キリコひとりで ボツキリコに勝つ（フェリスが気づく）。 */
const shibariSolo = (st: GameState): string | null =>
	shibari(st.flags).includes("solo")
		? "ボツキリコの　とき、わたしたち\nうしろで　見てた　だけ〜"
		: null;

/** 縛りが2つ以上（スレの住民が気づく）。 */
const shibariJ = (st: GameState): string | null => {
	const n = shibari(st.flags).length;
	if (n >= 4) return "……おい、このスレ、\nぜんぶ　縛って　完走しとるで";
	if (n >= 2) return "縛りプレイで　1000とか、\nこのスレ　どうなっとんねん";
	return null;
};

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
	shibariItem,
	shibariSong,
	shibariLv,
	shibariSolo,
	shibariJ,
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
	["nanj", "やきう"],
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
	res(">>998", shibariLine(f));
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

/** いま何スレ目か（次スレを立てていなければ 1）。 */
const partNo = (f: Flags): number => Math.max(1, num(f, "p2_n") || 1);

/** 洪水で ひろえた声（ひろっていなければ セクションごと出さない）。 */
const floodSection = (f: Flags): EndingSummary["sections"] => {
	const got = [f.flood_1, f.flood_2]
		.map((v) => floodSum(f, v))
		.filter((x): x is string => !!x);
	if (!got.length) return [];
	return [
		{
			title: "【蓄音】ひろった　レス",
			lines: [...got, "ワイらが　もろたで！（>>999）"],
		},
	];
};

/** スタッフロールのあとの「このスレの　まとめ」（1行22字まで・1セクション10行まで）。 */
export const threadSummary = (st: GameState): EndingSummary => ({
	sections: [
		{
			title: `【完走】蓄音キリコ、${headline(st.flags)}`,
			lines: myThread(st),
		},
		...floodSection(st.flags),
		{
			title: `【次スレ】蓄音キリコのうた　Part${partNo(st.flags) + 1}`,
			lines: nextThread(st.flags),
		},
	],
});
