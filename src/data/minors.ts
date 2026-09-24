// おんJマイナーズ（おんJwiki の「一軍・二軍」まわりの顔文字キャラ）。本筋には からまない寄り道。
// - にぃちぇ（町）… 「土曜日ど！」の派生。遊んでいる端末の曜日が日曜日なら、ことばが変わる。
// - おんすちゃん（スレ街道の北東のすみ）… だれも来ない おんS のお嬢さま。
// - ヤヤポジ（スタジアムのスタンド）… ポジハメを ひかえめにした子。5割が好き。
// - ンゴ姉・パン松・総選挙のはり紙（過去ログ倉庫の奥の間。B2 のあと、ムッジェのまわり）
// 総選挙は1票だけ（vote）。入れた子は、次に話しかけたとき1回だけ ひとこと足す（vote_thx）。
// 設定は おんJwiki から、健全な ところだけ借りる（顔文字は フォントに無いので 文には出さない）。

import type { EventDef, GameState, Story } from "../engine/defs";
import { npc } from "./helpers";
import { SPR } from "./sprites";
import { ks, silent } from "./story";

/** 名前欄だけの話し手（J民ではないので 白い名前欄・読み上げなし）。 */
const N = (s: Story, name: string, text: string) => s.say(null, text, { name });

/** おんJ民が いま たたかう仲間に いる（控えや アク禁中は いない）。 */
const nanjActive = (st: GameState): boolean =>
	!st.flags.akukin && st.party.some((m) => m.id === "nanj" && !m.bench);

const day = (st: GameState) => !silent(st);

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

/** ンゴ姉（やきう民の お姉ちゃん。フェリスの枠を ねらっている）。 */
export const ngoane = (x: number, y: number): EventDef =>
	npc(
		"ngoane",
		x,
		y,
		SPR.ngoane,
		async (s) => {
			await thanks(s, "ngoane");
			if (s.flag("ngoane_met")) {
				await N(
					s,
					"ンゴ姉",
					"フェリスちゃんの　となりに　いれば\n……ふふ、ンゴねぇ……",
				);
				return;
			}
			s.set("ngoane_met");
			await N(
				s,
				"ンゴ姉",
				"あら、フェリスちゃん……！\nなかよく　してほしいンゴねぇ……",
			);
			if (s.flag("feris_in"))
				await s.say("feris", "いいよ〜。……えっと、\nだれだっけ〜？");
			await N(s, "ンゴ姉", "……道のりは　けわしいンゴねぇ……");
			if (nanjActive(s.state)) {
				await s.say("nanj", "……ねえちゃん、こんな　とこで\nなに　しとんねん");
				await N(s, "ンゴ姉", "しーっ、ンゴねぇ……");
			}
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
			if (s.flag("pan_met")) {
				await N(s, "パン松", "パンの　すばらしさを\n知ったか");
				return;
			}
			await N(s, "パン松", "おんJ　侵略！　植民地化！");
			if (s.flag("roze_in")) await s.say("roze", "……ここ、倉庫アル");
			await s.narrate("パン松は　口を　あけたまま\nしばらく　かたまっていた。");
			await N(s, "パン松", "……手荒な　まねは　しない。\nこれを　受けとれ");
			s.set("pan_met");
			s.se("item");
			s.give("pan", 1);
			await s.narrate("フランスパンを　てにいれた！");
			await ks(s, "食パンが、フランスパン\nくれたンゴ……");
		},
		{ dir: "left", when: (st) => !!st.flags.b2 },
	);

// ───────────────── 町・街道・スタジアム ─────────────────

/** にぃちぇ（町。遊んでいる端末が日曜日なら「日曜日だニィ」）。 */
export const nichie = (x: number, y: number): EventDef =>
	npc(
		"nichie",
		x,
		y,
		SPR.nichie,
		async (s) => {
			await thanks(s, "nichie");
			const again = !!s.flag("nichie_met");
			s.set("nichie_met");
			if (new Date().getDay() === 0) {
				await N(s, "にぃちぇ", "あ！今日　日曜日だニィ！");
				if (nanjActive(s.state)) {
					await s.say("nanj", "火曜日やぞ");
					await N(s, "にぃちぇ", "日曜日だニィ");
				}
				return;
			}
			if (again) {
				await N(
					s,
					"にぃちぇ",
					"深淵を　のぞくとき……\n深淵も　日曜日を　まっているニィ",
				);
				return;
			}
			await N(s, "にぃちぇ", "あ！今日　日曜日だ……");
			await s.narrate("にぃちぇは　ゆびを　おって、\nしばらく　かぞえていた。");
			await N(s, "にぃちぇ", "……まだだったニィ……");
		},
		{ dir: "left", when: day },
	);

/** おんすちゃん（スレ街道の すみ。だれも来ない おんS のお嬢さま）。 */
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
				if (s.flag("onsu_2")) {
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
			s.se("item");
			s.give("candy", 1);
			await s.narrate("のどあめを　てにいれた！");
		},
		{ dir: "left" },
	);

/** ヤヤポジ（スタジアムのスタンド。ひかえめな ポジハメ）。 */
export const yayapoji = (x: number, y: number): EventDef =>
	npc(
		"yayapoji",
		x,
		y,
		SPR.yayapoji,
		async (s) => {
			await thanks(s, "yayapoji");
			s.set("yaya_met");
			const Y = (t: string) => N(s, "ヤヤポジ", t);
			if (s.flag("b3")) {
				await Y("はんぶんこ。\n……ちょうど　5割なんだ");
				return;
			}
			await Y("引き分けに　なりそうな\n試合が　好きなんだ");
			if (s.flag("feris_in")) {
				await s.say("feris", "……勝ちたく　ないの〜？");
				await Y("勝ちすぎると、\nこわいんだ");
			}
		},
		{ dir: "left", when: day },
	);
