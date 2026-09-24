// おんJマイナーズ（おんJwiki の「一軍・二軍」まわりの顔文字キャラ）。本筋の寄り道。
// - にぃちぇ（町）… 「土曜日ど！」の派生。遊んでいる端末の曜日が日曜・土曜なら、ことばが変わる。
// - おんちゃん（町の広場）… 一軍（総選挙の「殿堂入り」）。「今日のおんちゃん」は遊んでいる端末の曜日で変わる。
// - おんすちゃん（スレ街道の北東のすみ）… だれも来ない おんS のお嬢さま。
// - ヤヤポジ・ポジハメ（スタジアムのスタンド）… ポジハメと、それを ひかえめにした子。5割が好き。
// - ンゴ姉・パン松・総選挙のはり紙（過去ログ倉庫の奥の間。B2 のあと、ムッジェのまわり）
// 総選挙は1票だけ（vote）。入れた子は、次に話しかけたとき1回だけ ひとこと足す（vote_thx）。
// 本筋との からみ：
// - 話の進み（沈黙のあいだ・声がもどったあと・完走のあと）で、1回だけの ひとことが出る（stageOnce）
// - たたかう仲間（ロゼ・フェリス・テト・おんJ民）が いると、口をはさむ
// - 2回目からは、その子の 雑談（仲間の口出しつき）を1本ずつ（chat）。ぜんぶ見たら いつもの ひとこと
// - 遊んでいる端末の日付（正月・クリスマスなど）で、期間限定の ひとことに変わる（weekday.ts の season）
// - 会った子は 終章の レスの洪水（>>995〜>>997）に 書きこむ（threadlog.ts の MINOR_POSTS）
// 設定は おんJwiki から、健全な ところだけ借りる（顔文字は フォントに無いので 文には出さない）。

import type { EventDef, GameState, Story } from "../engine/defs";
import { npc } from "./helpers";
import { SPR } from "./sprites";
import { ks, silent } from "./story";
import { bySeason, type Season, weekday } from "./weekday";

/** 名前欄だけの話し手（J民ではないので 白い名前欄・読み上げなし）。 */
const N = (s: Story, name: string, text: string) => s.say(null, text, { name });

/** その仲間が いま たたかう仲間に いる（控えや、おんJ民の アク禁中は いない）。 */
const active = (st: GameState, id: string): boolean =>
	!(id === "nanj" && st.flags.akukin) &&
	st.party.some((m) => m.id === id && !m.bench);

const day = (st: GameState) => !silent(st);

/**
 * 話の進み。early（B2 まで）→ mid（B2 のあと）→ silent（第四章の沈黙）
 * → back（声がもどったあと）→ clear（完走のあと）。
 */
type Stage = "early" | "mid" | "silent" | "back" | "clear";
const stage = (st: GameState): Stage => {
	const f = st.flags;
	if (f.clear) return "clear";
	if (silent(st)) return "silent";
	if (f.rec) return "back";
	return f.b2 ? "mid" : "early";
};

/** まだ立っていなければ立てて true（1回だけの ひとこと）。 */
const once = (s: Story, flag: string): boolean => {
	if (s.flag(flag)) return false;
	s.set(flag);
	return true;
};

/**
 * 話の進みごとに1回だけの ひとこと（その子の その段で まだ見ていなければ）。
 * 流したら true。フラグは `<id>_<stage>`。
 */
const stageOnce = async (
	s: Story,
	id: string,
	lines: Partial<Record<Stage, () => Promise<void>>>,
): Promise<boolean> => {
	const st = stage(s.state);
	const run = lines[st];
	if (!run || !once(s, `${id}_${st}`)) return false;
	await run();
	return true;
};

/** 雑談の1本（with の仲間が みんな たたかう仲間に いるときだけ）。 */
type Chat = {
	key: string;
	with?: string[];
	when?: (st: GameState) => boolean;
	run: (s: Story) => Promise<void>;
};

/**
 * 雑談（上から順に、当てはまって まだ見ていない1本）。流したら true。
 * フラグは `<id>_c_<key>`。ぜんぶ見たら false（いつもの ひとことへ）。
 */
const chat = async (s: Story, id: string, list: Chat[]): Promise<boolean> => {
	const c = list.find(
		(c) =>
			!s.flag(`${id}_c_${c.key}`) &&
			(c.with ?? []).every((w) => active(s.state, w)) &&
			(c.when?.(s.state) ?? true),
	);
	if (!c) return false;
	s.set(`${id}_c_${c.key}`);
	await c.run(s);
	return true;
};

/** 期間限定の ひとこと（あれば言って true）。 */
const seasonal = async (
	s: Story,
	name: string,
	table: Partial<Record<Season, string>>,
): Promise<boolean> => {
	const t = bySeason(table);
	if (!t) return false;
	await N(s, name, t);
	return true;
};

// ───────────────── 総選挙 ─────────────────

type Candidate = {
	id: string;
	name: string;
	/** はり紙に 名前が 出る条件（会ったことがある）。 */
	when: (st: GameState) => boolean;
	/** 1票 入れてもらった子の ひとこと。 */
	thx: (s: Story) => Promise<void>;
};

const CANDIDATES: Candidate[] = [
	{
		id: "mujje",
		name: "ムッジェ",
		when: () => true,
		thx: async (s) => {
			await N(s, "ムッジェ", "ホゲェ！！");
			await s.narrate(
				"ムッジェは　はり紙の　ほうを\nなんども　ふりかえっている。",
			);
		},
	},
	{
		id: "ngoane",
		name: "ンゴ姉",
		when: () => true,
		thx: (s) => N(s, "ンゴ姉", "1票……！　これからは　私の\n時代ンゴねぇ……！"),
	},
	{
		id: "panmatsu",
		name: "パン松",
		when: () => true,
		thx: (s) => N(s, "パン松", "1票。……パン板の　勝利だ"),
	},
	{
		id: "nichie",
		name: "にぃちぇ",
		when: (st) => !!st.flags.nichie_met,
		thx: (s) => N(s, "にぃちぇ", "1票、入ってたニィ。\n……日曜日みたいだニィ"),
	},
	{
		id: "onsu",
		name: "おんすちゃん",
		when: (st) => !!st.flags.onsu_met,
		thx: async (s) => {
			await N(s, "おんすちゃん", "い、1票……！");
			await s.narrate("おんすちゃんは　ハンカチを\n目もとに　おしあてた。");
		},
	},
	{
		id: "yayapoji",
		name: "ヤヤポジ",
		when: (st) => !!st.flags.yaya_met,
		thx: (s) => N(s, "ヤヤポジ", "1票も……？\nちょっと　多いんだ"),
	},
];

/** 入れてもらった子なら、1回だけ ひとこと足す。 */
const thanks = async (s: Story, id: string): Promise<void> => {
	if (s.flag("vote") !== id || s.flag("vote_thx")) return;
	const c = CANDIDATES.find((x) => x.id === id);
	if (!c) return;
	s.set("vote_thx");
	await c.thx(s);
};

/** ムッジェ（kakolog の mujje_after）から呼ぶ。 */
export const mujjeThanks = (s: Story): Promise<void> => thanks(s, "mujje");

/** 奥の間の 古い掲示板の はり紙（(10,2)。(10,3) から調べる）。 */
export const senkyo = (x: number, y: number): EventDef => ({
	id: "senkyo",
	x,
	y,
	trigger: "talk",
	fixedDir: true,
	when: (st) => !!st.flags.b2,
	run: async (s) => {
		await s.narrate("かたすみに　はり紙。『おんJマイナーズ\n一軍選抜総選挙』");
		await s.narrate("『殿堂入り：おんちゃん』\n『開票日：未定』");
		const voted = CANDIDATES.find((c) => c.id === s.flag("vote"));
		if (voted) {
			await s.narrate(`${voted.name}の　欄に、\n線が　1本だけ　引いてある。`);
			return;
		}
		await s.narrate("すみに　投票箱が　ぶらさがっている。");
		const list = CANDIDATES.filter((c) => c.when(s.state));
		const i = await s.choose(
			[...list.map((c, k) => `>>${k + 1} ${c.name}`), "やめる"],
			{ cancel: list.length },
		);
		if (i >= list.length) return;
		s.set("vote", list[i].id);
		s.se("item");
		await s.narrate(`${list[i].name}に　1票　入れた。`);
		await ks(s, "……開票、いつンゴ？");
		if (s.flag("feris_in")) await s.say("feris", "未定、だって〜");
	},
});

// ───────────────── 過去ログ倉庫の奥の間（B2 のあと） ─────────────────

const NGOANE_CHATS: Chat[] = [
	{
		key: "ngo",
		run: async (s) => {
			await ks(s, "ンゴ姉も、ンゴって　言うンゴね");
			await N(s, "ンゴ姉", "ンゴねぇ、ンゴねぇ……");
			await ks(s, "吾輩の　ンゴとは　ちがうンゴ");
			await N(s, "ンゴ姉", "……年季が　ちがうンゴねぇ……");
		},
	},
	{
		key: "roze",
		with: ["roze"],
		run: async (s) => {
			await s.say("roze", "フェリス先輩の、\nどこが　いいアル？");
			await N(s, "ンゴ姉", "ぜんぶンゴねぇ……");
			await s.say("roze", "……わかるアル");
			await s.narrate("ふたりは　かたく　あくしゅした。");
		},
	},
	{
		key: "otouto",
		run: async (s) => {
			await N(
				s,
				"ンゴ姉",
				"弟が　やきうで　負けると、\n家じゅう　しずかに　なるンゴねぇ……",
			);
			if (active(s.state, "nanj")) {
				await s.say("nanj", "……ワイの　ことちゃうで");
				await N(s, "ンゴ姉", "まだ　なにも　言ってないンゴねぇ……");
			}
		},
	},
	{
		key: "kushami",
		run: async (s) => {
			await N(
				s,
				"ンゴ姉",
				"フェリスちゃんの　くしゃみ、\n録音したいンゴねぇ……",
			);
			await ks(s, "蓄音機、かすンゴ？");
			await s.narrate("ンゴ姉は　しばらく\n蓄音機を　見つめていた。");
			await N(s, "ンゴ姉", "……や、やめておくンゴねぇ……\n燃えるンゴねぇ……");
		},
	},
	{
		key: "soko",
		run: async (s) => {
			await N(s, "ンゴ姉", "この　倉庫、しずかで\n好きンゴねぇ……");
			await s.narrate("奥で　ムッジェが「ホゲェ！」と　鳴いた。");
			await N(s, "ンゴ姉", "……ときどき　しずかンゴねぇ……");
		},
	},
];

const PAN_CHATS: Chat[] = [
	{
		key: "shoku",
		run: async (s) => {
			await ks(s, "パン松は、なにパンンゴ？");
			await N(s, "パン松", "食パンだ。六枚切りだ");
			await N(s, "パン松", "……八枚切りと　まちがえるな");
		},
	},
	{
		key: "feris",
		with: ["feris"],
		run: async (s) => {
			await s.say("feris", "トースト、する〜？");
			await N(s, "パン松", "……焼くな");
			await N(s, "パン松", "…………いや、すこし　焼け");
			await s.narrate("パン松は　すこし\nきつね色に　なった。");
		},
	},
	{
		key: "shinryaku",
		run: async (s) => {
			await N(s, "パン松", "侵略の　進みぐあいを\n報告する");
			await N(s, "パン松", "……この　倉庫の　すみ、\n1マスぶんだ");
			await ks(s, "……おめでとうンゴ");
		},
	},
	{
		key: "mabo",
		run: async (s) => {
			await ks(s, "パンに　マーボー、\nのせたら　どうンゴ？");
			await s.narrate("パン松は　しばらく\n考えこんだ。");
			await N(s, "パン松", "……あう。\nくやしいが　あう");
		},
	},
	{
		key: "nanj",
		with: ["nanj"],
		run: async (s) => {
			await s.say("nanj", "パン板って、どんな　とこや");
			await N(s, "パン松", "しずかだ。\n……パンの　話しか　しない");
			await s.say("nanj", "ええとこやんけ");
		},
	},
];

/** ンゴ姉（やきう民の お姉ちゃん。フェリスの枠を ねらっている）。 */
export const ngoane = (x: number, y: number): EventDef =>
	npc(
		"ngoane",
		x,
		y,
		SPR.ngoane,
		async (s) => {
			await thanks(s, "ngoane");
			const G = (t: string) => N(s, "ンゴ姉", t);
			if (!s.flag("ngoane_met")) {
				s.set("ngoane_met");
				await G("あら、フェリスちゃん……！\nなかよく　してほしいンゴねぇ……");
				if (active(s.state, "feris"))
					await s.say("feris", "いいよ〜。……えっと、\nだれだっけ〜？");
				await G("……道のりは　けわしいンゴねぇ……");
				if (active(s.state, "nanj")) {
					await s.say("nanj", "……ねえちゃん、こんな　とこで\nなに　しとんねん");
					await G("しーっ、ンゴねぇ……");
				}
				return;
			}
			// フェリスが いつのまにか 名前を おぼえている（いちどだけ）
			if (active(s.state, "feris") && once(s, "ngoane_feris")) {
				await s.say("feris", "あ、ンゴ姉だ〜。\nこんにちは〜");
				await s.narrate("ンゴ姉は　しばらく\nうごかなかった。");
				await G("……な、名前……\n……ンゴねぇ……！");
				return;
			}
			if (
				await stageOnce(s, "ngoane", {
					silent: async () => {
						await s.narrate(
							"ンゴ姉は　だまって、\nフェリスの　となりに　立った。",
						);
						await s.narrate("すこし　はなれて、\nまた　すこし　ちかづいた。");
					},
					back: async () => {
						await G("キリコちゃんの　声……\nわるくないンゴねぇ……");
						await G("……フェリスちゃんの　つぎに、\nンゴねぇ……");
					},
					clear: async () => {
						await G("完走、おめでとうンゴねぇ……");
						await G("次スレでは　わたしが\nとなりンゴねぇ……！");
						if (active(s.state, "feris"))
							await s.say("feris", "え〜？　となりは　キリコだよ〜");
					},
				})
			)
				return;
			if (
				await seasonal(s, "ンゴ姉", {
					newyear: "ことしこそ　フェリスちゃんの\nとなりンゴねぇ……！",
					valentine:
						"チョコ、つくったンゴねぇ……\nわたす　相手は　ひみつンゴねぇ",
					xmas: "フェリスちゃんと　ケーキ……\nゆめで　見たンゴねぇ……",
				})
			)
				return;
			if (await chat(s, "ngoane", NGOANE_CHATS)) return;
			await G("フェリスちゃんの　となりに　いれば\n……ふふ、ンゴねぇ……");
		},
		{ dir: "right", when: (st) => !!st.flags.b2 },
	);

/** パン松（パン板から おんJを 侵略しに来た食パン）。はじめて会うと フランスパンを くれる。 */
export const panmatsu = (x: number, y: number): EventDef =>
	npc(
		"panmatsu",
		x,
		y,
		SPR.panmatsu,
		async (s) => {
			await thanks(s, "panmatsu");
			const P = (t: string) => N(s, "パン松", t);
			if (!s.flag("pan_met")) {
				await P("おんJ　侵略！　植民地化！");
				if (active(s.state, "roze")) await s.say("roze", "……ここ、倉庫アル");
				await s.narrate(
					"パン松は　口を　あけたまま\nしばらく　かたまっていた。",
				);
				await P("……手荒な　まねは　しない。\nこれを　受けとれ");
				s.set("pan_met");
				s.se("item");
				s.give("pan", 1);
				await s.narrate("フランスパンを　てにいれた！");
				await ks(s, "食パンが、フランスパン\nくれたンゴ……");
				return;
			}
			// フランスパンの人（テト）と会う（いちどだけ）
			if (active(s.state, "teto") && once(s, "pan_teto")) {
				await s.narrate("パン松と　テトが、\nおたがいの　パンを　見ている。");
				await P("……フランスか");
				await s.say("teto", "……食パンか");
				await s.narrate("ふたりは　だまって、\nパンを　交換した。");
				return;
			}
			if (
				await stageOnce(s, "pan", {
					silent: async () => {
						await P("しずかだな。\n……侵略の　好機か");
						await s.narrate("パン松は　動かなかった。");
					},
					back: async () => {
						await P("……声が　もどったか。");
						await P("侵略は　あとまわしだ。\nまず　パンを　食え");
					},
					clear: async () => {
						await P("1000か。\n……パン板は　まだ　200だ");
						await P("……いい　スレだった。\nパンを　食え");
					},
				})
			)
				return;
			if (
				await seasonal(s, "パン松", {
					newyear: "正月か。\n……もちより　パンだ",
					april: "侵略は　やめた。\n……うそだ",
					xmas: "クリスマスは　シュトーレンだ。\n……パンだ",
				})
			)
				return;
			if (await chat(s, "pan", PAN_CHATS)) return;
			await P("パンの　すばらしさを\n知ったか");
		},
		{ dir: "left", when: (st) => !!st.flags.b2 },
	);

// ───────────────── 町・街道・スタジアム ─────────────────

const NICHIE_CHATS: Chat[] = [
	{
		key: "nanisuru",
		run: async (s) => {
			await ks(s, "日曜日は、なにするンゴ？");
			await N(s, "にぃちぇ", "「日曜日だニィ」って\n言うニィ");
			await ks(s, "……それだけンゴ？");
			await N(s, "にぃちぇ", "それが　いちばん\nたのしいニィ");
		},
	},
	{
		key: "feris",
		with: ["feris"],
		run: async (s) => {
			await s.say("feris", "私は　毎日、日曜日\nみたいだよ〜");
			await s.narrate("にぃちぇは　フェリスを\nじっと　見た。");
			await N(s, "にぃちぇ", "……弟子に　してほしいニィ");
		},
	},
	{
		key: "kazoe",
		run: async (s) => {
			await N(s, "にぃちぇ", "日曜日まで、あと……");
			await s.narrate("にぃちぇは　ゆびを　おって、\nとちゅうで　やめた。");
			await N(s, "にぃちぇ", "……かぞえると、\n遠く　なるニィ");
		},
	},
	{
		key: "teto",
		with: ["teto"],
		run: async (s) => {
			await s.say("teto", "日曜日が　来たら、\nどうするのさ");
			await N(s, "にぃちぇ", "……また　待つニィ");
			await s.say("teto", "……ふうん");
		},
	},
	{
		key: "onchan",
		when: (st) => !!st.flags.onchan_met,
		run: async (s) => {
			await N(s, "にぃちぇ", "おんちゃんは、曜日を\nぜんぶ　知ってるニィ");
			await N(s, "にぃちぇ", "……えらいニィ");
		},
	},
];

/** にぃちぇ（町。遊んでいる端末が日曜日なら「日曜日だニィ」、土曜日なら あしたを 待つ）。 */
export const nichie = (x: number, y: number): EventDef =>
	npc(
		"nichie",
		x,
		y,
		SPR.nichie,
		async (s) => {
			await thanks(s, "nichie");
			const C = (t: string) => N(s, "にぃちぇ", t);
			const again = !!s.flag("nichie_met");
			s.set("nichie_met");
			const w = weekday();
			if (w === 6) {
				await C("あ！あした　日曜日だニィ！");
				await s.narrate("にぃちぇの　目が、いつもより\nひらいている。");
				return;
			}
			if (w === 0) {
				await C("あ！今日　日曜日だニィ！");
				if (active(s.state, "nanj")) {
					await s.say("nanj", "火曜日やぞ");
					await C("日曜日だニィ");
				}
				return;
			}
			if (!again) {
				await C("あ！今日　日曜日だ……");
				await s.narrate(
					"にぃちぇは　ゆびを　おって、\nしばらく　かぞえていた。",
				);
				await C("……まだだったニィ……");
				if (active(s.state, "roze")) {
					await s.say("roze", "……いっしょに　かぞえるアル");
					await s.narrate(
						"ふたりで　ゆびを　おった。\n……やっぱり　まだだった。",
					);
				}
				return;
			}
			if (
				await stageOnce(s, "nichie", {
					back: async () => {
						await C("町が　しずかな　あいだ、\n毎日　日曜日みたいだったニィ");
						await C("……ちがうニィ。\n日曜日は、もっと　うるさいニィ");
					},
					clear: async () => {
						await C("1000レス目、\n日曜日に　とどいたニィ？");
						await ks(s, "……火曜日ンゴ");
						await C("日曜日だニィ");
					},
				})
			)
				return;
			if (
				await seasonal(s, "にぃちぇ", {
					newyear: "お正月は、ずっと\n日曜日みたいだニィ",
					april: "あ！今日　日曜日だニィ！\n……うそだニィ",
					xmas: "クリスマスが　日曜日なら\n得なのか　損なのか　ニィ",
					omisoka: "あしたが　日曜日なら\nいいのにニィ",
				})
			)
				return;
			if (await chat(s, "nichie", NICHIE_CHATS)) return;
			await C("深淵を　のぞくとき……\n深淵も　日曜日を　まっているニィ");
		},
		{ dir: "left", when: day },
	);

/** 今日のおんちゃん（遊んでいる端末の曜日。日曜はじまり）。 */
const ONCHAN_TODAY = [
	"日曜日だおん。\nにぃちぇが　さわいでるおん",
	"月曜日だおん。\n……やきうも　お休みの日だおん",
	"火曜日だおん。\nなんにも　ない日だおん",
	"水曜日だおん。\n週の　まんなかだおん",
	"木曜日だおん。\n……なにする日だったおん？",
	"金曜日だおん！\nあしたは　お休みだおん！",
	"土曜日だおん！\n先住民が　今日は　正しいおん",
] as const;

/** 期間限定のおんちゃん（その日は「今日のおんちゃん」の かわりに言う）。 */
const ONCHAN_SEASON: Partial<Record<Season, string>> = {
	newyear: "あけおめだおん。\nことしも　一軍だおん",
	valentine: "チョコ、もらったおん。\n……じぶんで　買ったおん",
	april: "きょうから　二軍だおん。\n……うそだおん",
	tanabata: "たんざくに　『ずっと一軍』って\n書いたおん",
	halloween: "おばけの　かっこうだおん。\n……いつもと　同じだおん？",
	xmas: "サンタさん、おんJにも\n来るおん？",
	omisoka: "ことしの　スレも、\nそろそろ　1000だおん",
};

const ONCHAN_CHATS: Chat[] = [
	{
		key: "ichigun",
		run: async (s) => {
			await ks(s, "一軍って、なにするンゴ？");
			await N(s, "おんちゃん", "まるく　しているおん");
			await ks(s, "……それだけンゴ？");
			await N(s, "おんちゃん", "それが　いちばん\nむずかしいおん");
		},
	},
	{
		key: "nanj",
		with: ["nanj"],
		run: async (s) => {
			await s.say("nanj", "おんちゃん、いつから\nおるんや");
			await N(s, "おんちゃん", "……おぼえてないおん。\nずっと　まえからだおん");
			await s.say("nanj", "……ワイより　古参やな");
		},
	},
	{
		key: "kiriko",
		run: async (s) => {
			await N(s, "おんちゃん", "キリコちゃんも、\nまるく　なるおん？");
			await ks(s, "吾輩、34キロンゴ");
			await N(s, "おんちゃん", "……がんばるおん");
		},
	},
	{
		key: "feris",
		with: ["feris"],
		run: async (s) => {
			await s.say("feris", "今日も　まるい〜");
			await N(s, "おんちゃん", "毎日　まるいおん");
			await s.say("feris", "えら〜い");
		},
	},
	{
		key: "teto",
		with: ["teto"],
		run: async (s) => {
			await s.say("teto", "……その　まるさ、\nどうやって　たもってるのさ");
			await N(s, "おんちゃん", "ひみつだおん");
			await s.say("teto", "……べ、別に　知りたかった\nわけじゃない");
		},
	},
];

/** おんちゃん（町の広場。一軍。ムッジェは おんちゃんの絵から生まれた）。 */
export const onchan = (x: number, y: number): EventDef =>
	npc(
		"onchan",
		x,
		y,
		SPR.onchan,
		async (s) => {
			const O = (t: string) => N(s, "おんちゃん", t);
			if (!s.flag("onchan_met")) {
				s.set("onchan_met");
				await O("キリコちゃん、はじめましてだおん");
				if (active(s.state, "nanj"))
					await s.say("nanj", "おんちゃんや。\n……ワイらより　有名やで");
				if (active(s.state, "feris")) {
					await s.say("feris", "まるい〜。……さわって　いい〜？");
					await O("……ちょっとだけ　だおん");
				}
				if (active(s.state, "teto")) {
					await s.say("teto", "……べ、別に　まるいのが\n好きなわけじゃない");
					await O("まだ　なにも　きいてないおん");
				}
			}
			await O(bySeason(ONCHAN_SEASON) ?? ONCHAN_TODAY[weekday()]);
			// ムッジェに会ったあと（B2）。いちどだけ
			if (s.flag("b2") && once(s, "onchan_mujje")) {
				await O("……ムッジェ、元気に\nしてるおん？");
				await ks(s, "「ホゲェ」って　言ってたンゴ");
				await O("……そっかぁ。\nよかったおん");
				return;
			}
			const staged = await stageOnce(s, "onchan", {
				back: async () => {
					await s.narrate(
						"おんちゃんの　足もとに、\n小石が　たくさん　ならんでいる。",
					);
					await O("かぞえてたおん。\n……何日ぶん　だったかおん");
					if (active(s.state, "roze"))
						await s.say("roze", "……ならべかたが　きれいアル");
				},
				clear: async () => {
					await O("1000、おめでとうだおん");
					if (active(s.state, "nanj"))
						await s.say(
							"nanj",
							"殿堂入りに　ほめられたで。\n……一軍やな、ワイら",
						);
					await s.narrate("おんちゃんは　小石を\nひとつ　キリコに　わたした。");
				},
			});
			if (!staged) await chat(s, "onchan", ONCHAN_CHATS);
		},
		{ dir: "down", when: day },
	);

const ONSU_CHATS: Chat[] = [
	{
		key: "tea",
		run: async (s) => {
			await N(s, "おんすちゃん", "お紅茶、いかがぁ？");
			await s.narrate(
				"カップが　いくつも　出てきた。\nどれも　つめたく　なっている。",
			);
			await N(s, "おんすちゃん", "……い、いれたてよぉ");
		},
	},
	{
		key: "nanj",
		with: ["nanj"],
		run: async (s) => {
			await s.say("nanj", "おんSって、実況　せんのか");
			await N(s, "おんすちゃん", "しないわよぉ！");
			await s.say("nanj", "ほな、なに　するんや");
			await N(s, "おんすちゃん", "……お話よぉ。\nこういうのよぉ");
		},
	},
	{
		key: "jikkyo",
		run: async (s) => {
			await N(s, "おんすちゃん", "わたくし、実況は\nにがて　なのよぉ");
			await N(
				s,
				"おんすちゃん",
				"……だって、みんな\n書くのが　はやいんだものぉ",
			);
		},
	},
	{
		key: "roze",
		with: ["roze"],
		run: async (s) => {
			await s.say("roze", "おんSも、1000　いくアル？");
			await N(s, "おんすちゃん", "い、いくわよぉ！\n……いつかぁ");
			await s.say("roze", "……ときどき、保守しに\n来るアル");
		},
	},
	{
		key: "hankachi",
		run: async (s) => {
			await s.narrate("おんすちゃんは　ハンカチを\n何枚も　もっている。");
			await N(s, "おんすちゃん", "……ぜんぶ、かみしめる\n用よぉ");
		},
	},
];

/** おんすちゃん（スレ街道の すみ。だれも来ない おんS のお嬢さま。沈黙のあいだも いる）。 */
export const onsu = (x: number, y: number): EventDef =>
	npc(
		"onsu",
		x,
		y,
		SPR.onsu,
		async (s) => {
			await thanks(s, "onsu");
			const O = (t: string) => N(s, "おんすちゃん", t);
			if (s.flag("onsu_kaki")) {
				if (
					await stageOnce(s, "onsu", {
						silent: async () => {
							await s.narrate("おんすちゃんは　キリコの　顔を\nのぞきこんだ。");
							await O("……あなたも、書きこまない\n日が　あるのねぇ");
							await s.narrate(
								"ハンカチを　ひとつ、\nキリコの　手に　にぎらせた。",
							);
						},
						back: async () => {
							await O("声、もどったのねぇ。\n……ふ、ふん。知ってたわぁ");
							await s.narrate("ハンカチは、まだ\nキリコが　もっている。");
						},
						clear: async () => {
							await O("1000レス……。\nおんSは、まだ　38レスよぉ");
							await s.narrate(
								"おんすちゃんは　ハンカチを　たたんで、\nポケットに　しまった。",
							);
							await O("……39レス目、\n書きこんで　くださる？");
						},
					})
				)
					return;
				if (
					await seasonal(s, "おんすちゃん", {
						newyear: "あけまして……。\n今年も　おんSを　よろしくてよ",
						valentine: "チョ、チョコなんて\n用意して　ないわよぉ",
						xmas: "クリスマスも　おんSは\n……いつもどおりよぉ",
					})
				)
					return;
				if (s.flag("onsu_2")) {
					if (await chat(s, "onsu", ONSU_CHATS)) return;
					await O("……また　来たのぉ？\nふ、ふん");
					await s.narrate("ハンカチが、すこし\nかわいている。");
					return;
				}
				s.set("onsu_2");
				await O("今日は　新しく　2人も\n書きこんで　くれたのよぉ……！");
				if (s.flag("roze_in"))
					await s.say("roze", "……もう　ひとりは、わたしアル");
				return;
			}
			if (!s.flag("onsu_met")) {
				s.set("onsu_met");
				await s.narrate(
					"街道の　すみっこで、だれかが\nハンカチを　かみしめている。",
				);
				await O("何で　おんSには　だれも\n来ないのよぉー！");
				await O("……あら？");
				await ks(s, "吾輩、スレの　宣伝に　来たンゴ");
				if (active(s.state, "feris")) {
					await s.say(
						"feris",
						"おんS？　きいたこと\nあるような〜　ないような〜",
					);
					await O("ないのよぉー！");
				}
			}
			await O("せ、宣伝……！？　だったら、\nおんSにも　書きこんで　くださる？");
			const c = await s.choose([">>1 書きこむ", ">>2 また　こんど"], {
				cancel: 1,
			});
			if (c === 1) {
				await O("……そう。\nわかってたわぁ……");
				return;
			}
			s.set("onsu_kaki");
			await s.narrate("キリコは　おんSに\nひとこと　書きこんだ。「保守」");
			await O("…………（ジワッ）");
			await O("べ、べつに　実況じゃなくても\nいいのよ。雑談でも　ネタでも……");
			if (active(s.state, "teto")) {
				await s.say(
					"teto",
					"……ボクも、ときどきなら\n書きこんで　やっても　いい",
				);
				await s.narrate("おんすちゃんは　ハンカチを\nもう　一枚　出した。");
			}
			s.se("item");
			s.give("candy", 1);
			await s.narrate("のどあめを　てにいれた！");
		},
		{ dir: "left" },
	);

const YAYA_CHATS: Chat[] = [
	{
		key: "score",
		run: async (s) => {
			await N(s, "ヤヤポジ", "好きな　スコアは、\n3対3なんだ");
			await ks(s, "4対3は？");
			await N(s, "ヤヤポジ", "……ちょっと　多いんだ");
		},
	},
	{
		key: "nanj",
		with: ["nanj"],
		run: async (s) => {
			await s.say("nanj", "勝ったら、うれしいやろ");
			await N(s, "ヤヤポジ", "……うれしいのは、\n5割くらいなんだ");
			await s.say("nanj", "のこりの　5割は　なんやねん");
			await N(s, "ヤヤポジ", "……あしたが　こわいんだ");
		},
	},
	{
		key: "tonari",
		run: async (s) => {
			await N(
				s,
				"ヤヤポジ",
				"となりが　ああだから、\nわたしは　これで　いいんだ",
			);
			await s.narrate("となりで　ポジハメが\n「優勝なんだ！」と　さけんだ。");
		},
	},
	{
		key: "teto",
		with: ["teto"],
		run: async (s) => {
			await s.say("teto", "ボクは、勝つのが　好きだ");
			await N(s, "ヤヤポジ", "……それも　いいんだ。\nはんぶん　くらいなら");
		},
	},
];

const POSI_CHATS: Chat[] = [
	{
		key: "ame",
		run: async (s) => {
			await N(s, "ポジハメ", "雨で　中止でも、\n負けては　いないんだ！");
			await s.narrate("となりの　ヤヤポジが、\nちいさく　うなずいた。");
		},
	},
	{
		key: "kiriko",
		run: async (s) => {
			await N(s, "ポジハメ", "キリコちゃんの　うたは、\n日本一なんだ！");
			await ks(s, "まだ　あんまり\nうたって　ないンゴ");
			await N(s, "ポジハメ", "じゃあ、これから\n日本一なんだ！");
		},
	},
	{
		key: "roze",
		with: ["roze"],
		run: async (s) => {
			await s.say("roze", "……負けたら、どうするアル");
			await N(
				s,
				"ポジハメ",
				"負けは　ないんだ！\nあしたの　勝ちが　のびただけなんだ！",
			);
			await s.say("roze", "……べんりな　頭アル");
		},
	},
	{
		key: "feris",
		with: ["feris"],
		run: async (s) => {
			await s.say("feris", "ポジハメちゃん、\nつかれない〜？");
			await N(s, "ポジハメ", "つかれたら、\nよく　ねむれるんだ！");
			await s.say("feris", "……ほんとだ〜");
		},
	},
];

/** ヤヤポジ（スタジアムのスタンド。ひかえめな ポジハメ）。 */
export const yayapoji = (x: number, y: number): EventDef =>
	npc(
		"yayapoji",
		x,
		y,
		SPR.yayapoji,
		async (s) => {
			await thanks(s, "yayapoji");
			const Y = (t: string) => N(s, "ヤヤポジ", t);
			if (!s.flag("yaya_met")) {
				s.set("yaya_met");
				await Y("引き分けに　なりそうな\n試合が　好きなんだ");
				if (active(s.state, "feris")) {
					await s.say("feris", "……勝ちたく　ないの〜？");
					await Y("勝ちすぎると、\nこわいんだ");
				}
				return;
			}
			if (
				await stageOnce(s, "yaya", {
					back: async () => {
						await Y("しずかな　あいだ、\n試合も　なかったんだ");
						await Y("……0対0。\nちょうど　5割なんだ");
					},
					clear: async () => {
						await Y("1000……。\n半分の　500でも　よかったんだ");
						await s.narrate(
							"ヤヤポジは　すこし　考えて、\nちいさく　手を　たたいた。",
						);
						await Y("……1000で、いいんだ");
					},
				})
			)
				return;
			if (
				await seasonal(s, "ヤヤポジ", {
					newyear: "今年は　5割で　いいんだ。\n……毎年　言ってるんだ",
					april: "……うそでも、\n勝つとは　言えないんだ",
				})
			)
				return;
			if (await chat(s, "yaya", YAYA_CHATS)) return;
			if (s.flag("b3")) {
				await Y("はんぶんこ。\n……ちょうど　5割なんだ");
				return;
			}
			await Y("引き分けに　なりそうな\n試合が　好きなんだ");
		},
		{ dir: "left", when: day },
	);

/** ポジハメ（スタジアムのスタンド。ヤヤポジの となり。なんでも 前向き）。 */
export const posihame = (x: number, y: number): EventDef =>
	npc(
		"posihame",
		x,
		y,
		SPR.posihame,
		async (s) => {
			const P = (t: string) => N(s, "ポジハメ", t);
			if (!s.flag("posi_met")) {
				s.set("posi_met");
				await P("今夜は　ぜったい　勝てるんだ！\n優勝も　まちがいないんだ！");
				await s.narrate("となりの　ヤヤポジが、ちいさく\nくびを　ふった。");
				if (active(s.state, "nanj")) {
					await s.say("nanj", "ポジハメは　負けた　日も\nこれやからな");
					await P("負けた　日は、あした\n勝てるんだ！");
				}
				return;
			}
			if (
				await stageOnce(s, "posi", {
					back: async () => {
						await P(
							"もどってくるって　思ってたんだ！\n最初から　わかってたんだ！",
						);
						await s.narrate("となりの　ヤヤポジが、\nちいさく　うなずいた。");
					},
					clear: async () => {
						await P("次スレも　完走\nまちがいなしなんだ！");
						if (active(s.state, "roze"))
							await s.say("roze", "……それは、常識アル");
					},
				})
			)
				return;
			if (
				await seasonal(s, "ポジハメ", {
					newyear: "今年は　優勝なんだ！\n毎年　言ってるんだ！",
					april: "今年は　全勝なんだ！\n……これは　ほんとなんだ！",
					xmas: "サンタさんは　優勝旗を\nくれるんだ！",
				})
			)
				return;
			if (await chat(s, "posi", POSI_CHATS)) return;
			if (s.flag("b3")) {
				await P("はんぶんこ！　つまり\nマスコットが　2倍なんだ！");
				return;
			}
			await P("今夜は　ぜったい　勝てるんだ！\n優勝も　まちがいないんだ！");
		},
		{ dir: "left", when: day },
	);
