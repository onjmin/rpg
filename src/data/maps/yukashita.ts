// 床下（裏シナリオ「過疎板探検」の 底の 底。data/kaso.ts に 全体の 流れ）。
// 避難Jの 1000 の あと、床下で すずが 鳴り、猫を 追って 家の 床板の すきまから 来る（maps/hinan.ts の toUnder）。
//
// >>101 で「蓄音キリコ」と 呼ばれた 1人目（角刈り・100t・111歳）が、100t の レスと いっしょに 沈んだ 場所。
// ここに あるのは 事実だけ。だれも 意味を 説明しない。
//   100t の レス（土に めりこんでいる。res_100t）・床板の うらの >>998 の 写し（おわりの ほうだけ ンゴ）・
//   柱の 石の ンゴと 吾輩の 練習・猫の 寝床の となりの 重い くぼみ。
// 4つ 見ると：ホームニキが おりてくる → ヒナリー（過疎板の底から 避難Jの モニターを ぬけて）の 最終発表 →
//   ロゼ・フェリス・テト → 蓄音機の いちばん 内がわの みぞ「……ここは、どこ？」→ ura_101・keep_ura101
//   → 避難Jへ もどって ホームニキの「ここに うつすか？」（hinan.ts の offer）。
// フラグ: yk_100t・yk_998・yk_ngo・yk_kubomi（見た）・yk_home・yk_hinary（おりてきた）・ura_101・keep_ura101

import type { EventDef, MapDef, Story } from "../../engine/defs";
import { npc, warp } from "../helpers";
import { C, H, has, K, SUNK, sunkCount } from "../kaso";
import { SPR } from "../sprites";
import { silent } from "../story";
import { CAVE, PROPS } from "../tiles";
import { offer } from "./hinan";

/** 4つ 見たら 最終発表（自動イベント finale）。 */
const SEEN = ["yk_100t", "yk_998", "yk_ngo", "yk_kubomi"];

// ───────────────── 床下に あるもの ─────────────────

/** 床板の うら（上の 壁。下から 見あげる）。 */
const copies = async (s: Story): Promise<void> => {
	await s.narrate(
		"床板の　うらに、998の　写し。\nおわりの　ほうだけ、ンゴが　ついている。",
	);
	await s.narrate(
		"ネタは　ネタのまま　終わるんやろな。\nネタは　ネタのまま　終わるんやろな。",
	);
	await s.narrate(
		"同じ　一行が、何十も　ならんでいる。\n返事の　レスは、ひとつも　ない。",
	);
	await s.narrate("いちばん　おわりの　一行。\nネタは、ネタのまま　終わるンゴ");
	if (!s.flag("yk_998")) await s.narrate("キリコは、しばらく　見あげていた。");
	s.set("yk_998");
};

/** 柱の 石の 練習の 字。 */
const practice = async (s: Story): Promise<void> => {
	await s.narrate(
		"柱を　ささえる　石に、ひっかいた　字。\n『ンゴ』『ンゴ』『ンゴ』……",
	);
	await s.narrate(
		"『ンゴ？』『ンゴ。』『……ンゴ』\n何度も　消して、書きなおした　あと。",
	);
	await s.narrate("すみに、ちいさく『吾輩』。\n一回だけ　書いて、消してある。");
	s.set("yk_ngo");
};

/** 土に めりこんだ 100t の レス（大事なもの。もう 持っていれば あとだけ）。 */
const res100t = async (s: Story): Promise<void> => {
	if (s.has("res_100t") > 0) {
		await s.narrate("土に、四角く　しずんだ　あと。\n……もう　ひろってある。");
	} else {
		await s.narrate("土に、レスが　一枚　めりこんでいる。\n『体重：100t』");
		if (has(s, "roze")) await s.say("roze", "……ここまで　沈んでたアルか");
		await s.narrate("両手で　ひっぱると、\nずしりと　重い。");
		s.se("item");
		s.give("res_100t");
		await s.narrate("100トンのレスを　てにいれた！");
	}
	s.set("yk_100t");
};

/** 猫の 寝床の となりの くぼみ。 */
const kubomi = async (s: Story): Promise<void> => {
	await s.narrate(
		"猫の　寝床の　となりに、くぼみ。\nひざを　かかえた、人　ひとりぶん。",
	);
	await s.narrate(
		"土が、ふかく　しずんでいる。\nとても　重い　ものが、長く　いた　ように。",
	);
	s.set("yk_kubomi");
};

// ───────────────── 最終発表 ─────────────────

const hinary = (s: Story, text: string): Promise<void> => s.say("hinary", text);

/** 時刻の 行を 2行ずつ 読む（拾っていない 行は false で とばす）。 */
const readRows = async (s: Story, rows: (string | false)[]): Promise<void> => {
	const r = rows.filter((x): x is string => !!x);
	for (let i = 0; i < r.length; i += 2)
		await hinary(s, r.slice(i, i + 2).join("\n"));
};

/** ホームニキ → ヒナリーの 最終発表 → 知っていた 人たち → 蓄音機 → 避難Jへ（offer）。 */
const finale = async (s: Story): Promise<void> => {
	await s.wait(400);
	await s.narrate("はしごが、ぎしり、と　鳴った。");
	s.set("yk_home");
	s.show("home_y");
	await s.move("home_y", "dr", { through: true });
	await s.narrate("ホームニキが　おりてきた。\n床板の　うらを、見あげている。");
	await s.narrate("それから、猫の　寝床の　となりの\nくぼみを　見た。");
	await H(s, "……知らんかった。\nねこが　床下ばっかり　行く　思とった");

	// ヒナリーは 過疎板の底で 避難Jを 研究していた。1000 で つながった モニターから 来る
	await s.narrate("はしごが、もう一度　鳴った。\n白衣の　子が　おりてくる。");
	s.set("yk_hinary");
	s.show("hinary_y");
	await s.move("hinary_y", "d", { through: true });
	await hinary(
		s,
		"避難Jの　モニターから　来ました。\n研究の、さいごの　発表です",
	);
	await H(s, "……>>4 か。\nまだ　研究しとったんか");
	await hinary(
		s,
		`沈んだ　レス　${sunkCount(s)}件と、100トンの　レス。\n時刻の　順に　ならべます`,
	);
	await s.narrate("ヒナリーは、レスを　土の　上に\n一枚ずつ　ならべた。");
	await hinary(
		s,
		">>101の　前に　決まっていたのは、\n角刈りと、100tの　模様です",
	);
	// 拾った レスだけ 読む（>>130 の 紙は、うらに >>380 も ある）
	const held = (id: string) => s.has(id) > 0;
	const before = [
		"23時34分　>>101　名前：蓄音キリコ",
		held("sunk_111") && "23時36分　>>111　111歳",
		held("sunk_130") && "23時38分　>>130　好きなもの：バラムツ",
		held("sunk_145") && "23時40分　>>145　趣味：釣り",
	];
	const after = [
		held("sunk_329") && "0時09分　>>329　服装：エスキモー",
		held("sunk_130") && "0時14分　>>380　再安価：囲碁",
	];
	await readRows(s, before);
	await hinary(s, "ここで、日付が　かわります");
	await readRows(s, after);
	await hinary(s, "0時20分　再安価：ポニーテール");
	const lost = SUNK.length - sunkCount(s);
	if (lost > 0)
		await hinary(s, `……${lost}件、まだ　見つかっていない\n模様です`);
	await s.wait(400);
	await hinary(s, "一回目の　蓄音キリコさんは、\n角刈りの　模様です");
	await hinary(s, "これで　発表を　終わりたいと\n思います");

	// 知っていた 人たち（いっしょに 来ている 仲間だけ）
	if (has(s, "roze")) {
		await s.say(
			"roze",
			"……見てたアル。名前が　出たとき、\nあの子は　角刈りだったアル",
		);
		await s.say("roze", "わたしの　前にも、\nひとり　いたアル");
		await s.narrate("ロゼは　だまって、キリコの　手を　とった。");
	}
	if (has(s, "feris")) await s.say("feris", "1羽目と、2羽目だね〜");
	if (has(s, "teto"))
		await s.narrate("テトは　なにも　言わず、\nパンを　半分に　割った。");

	// 蓄音機の いちばん 内がわの みぞ（音の ない 夜でも、ここだけは 鳴る）
	await s.wait(400);
	await s.narrate("キリコは　蓄音機を　おろして、\nハンドルを　まわした。");
	await s.narrate("針が、いちばん　内がわの　みぞへ\nすべりこんだ。");
	if (silent(s.state))
		await s.narrate("音の　ない　夜。\n……その　みぞだけが、鳴った。");
	await s.say("kiriko", "……ここは、どこ？", {
		name: "蓄音機",
		noPortrait: true,
	});
	await K(s, "……吾輩の　声ンゴ。\nでも、ンゴが　ないンゴ");
	s.set("ura_101");
	s.set("keep_ura101");
	await s.wait(600);

	await s.narrate("はしごを　のぼって、家を　出た。");
	await s.warp("hinan", 11, 4, "right", { se: "stairs" });
	s.face("home", "player");
	await offer(s);
};

// ───────────────── マップ ─────────────────

const events: EventDef[] = [
	{
		id: "arrive",
		x: 2,
		y: 3,
		trigger: "auto",
		once: true,
		run: async (s) => {
			await s.narrate("床下。\n土の　におい。床板の　すきまから、光。");
			await s.narrate("板猫が、おくの　寝床で　丸くなった。");
			await s.narrate(
				"見あげると、床板の　うら　いちめんに\n字が　書いてある。",
			);
		},
	},
	{
		// 4つ 見おわった 調べの あとに 始まる
		id: "finale",
		x: 2,
		y: 3,
		trigger: "auto",
		once: true,
		when: (st) => !st.flags.ura_101 && SEEN.every((f) => st.flags[f]),
		run: finale,
	},
	// はしご（上り階段の 左右）→ ホームの 家の 床板の 横
	...[2, 3].map((x) =>
		warp(
			`to_home_${x}`,
			x,
			2,
			{ map: "hinan_home", x: 3, y: 6, dir: "down" },
			{ se: "stairs" },
		),
	),
	// 床板の うら（(4..10,3) から 上を 向いて 調べる）
	...[4, 5, 6, 7, 8, 9, 10].map(
		(x): EventDef => ({
			id: `copies_${x}`,
			x,
			y: 2,
			trigger: "talk",
			fixedDir: true,
			run: copies,
		}),
	),
	{
		id: "practice",
		x: 5,
		y: 4,
		trigger: "talk",
		fixedDir: true,
		run: practice,
	},
	{
		id: "res100t",
		x: 7,
		y: 5,
		sprite: PROPS.crackFloor,
		trigger: "talk",
		fixedDir: true,
		run: res100t,
	},
	npc(
		"cat_y",
		9,
		5,
		SPR.cat,
		async (s) => {
			await C(s);
			await s.narrate(
				"猫は　寝床で　丸くなっている。\nとなりの　くぼみに、しっぽを　のせて。",
			);
		},
		{ dir: "right" },
	),
	{
		// 床の マスなので、ふさがないと 上に 乗れてしまい 調べられない
		id: "kubomi",
		x: 10,
		y: 5,
		trigger: "talk",
		through: false,
		fixedDir: true,
		run: kubomi,
	},
	// 最終発表で おりてくる 2人（発表の あとは いない）
	npc(
		"home_y",
		2,
		2,
		SPR.j_so,
		async (s) => {
			await H(s, "…………");
		},
		{ when: (st) => !!st.flags.yk_home && !st.flags.ura_101 },
	),
	npc(
		"hinary_y",
		2,
		2,
		SPR.hinary,
		async (s) => {
			await hinary(s, "これで　発表を　終わりたいと\n思います");
		},
		{ when: (st) => !!st.flags.yk_hinary && !st.flags.ura_101 },
	),
];

export const yukashita: MapDef = {
	id: "yukashita",
	name: "床下",
	bgm: null,
	tiles: CAVE,
	// 12×8。上の 壁が 床板の うら。はしご (2,2)(3,2) → ホームの 家。
	// 柱の 石 (5,4) に 練習の 字、100t (7,5)、猫の 寝床 (9,5)・くぼみ (10,5)
	rows: [
		"############", // y0
		"#WWWWWWWWWW#", // y1
		"#w()wwwwwww#", // y2  はしご (2,2)(3,2)。床板の うら (4..10,2)
		"#..........#", // y3  到着 (2,3)
		"#....o.....#", // y4  柱の 石 (5,4)
		"#.r......,,#", // y5  100t (7,5)。寝床 (9,5)・くぼみ (10,5)
		"#.....o....#", // y6
		"############", // y7
	],
	events,
};
