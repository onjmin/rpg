// なんでも実況J町（拠点）。設計書 §11-2・§8-2・§8-7・§8-8・§9。
// 第一章: ch1_intro・勢い欄（古参ニキ）・ボイスニキ。
// 第四章: night_ev（前夜祭 → サイレントバルス → 負けイベント → おんJ民アク禁）、
//         沈黙期間（住民が消える）→ マッマ → テト登場 → スタジオへ。
// 古参ニキは倉庫での返し方（reply_kako。kakolog の kosan_k）をナイター前と前夜祭で拾う。
// ぷゆゆ🥺: 小花のそば (9,11) の任意の寄り道（scratchpad/puyuyu/spec.md）。第一章の到着で声だけ聞かせる。

import type {
	EventDef,
	GameState,
	MapDef,
	Story,
	TileDef,
} from "../../engine/defs";
import type { Dir } from "../../engine/types";
import { chest, npc, sign, warp } from "../helpers";
import { SPR } from "../sprites";
import { ks, lockedDoor, phono, resLine, silent } from "../story";
import { base, TOWN } from "../tiles";

/** J民系のモブ（黄色の名前欄・読み上げなし）。 */
const J = (s: Story, text: string, name: string) =>
	s.say("nanj", text, { name });
/** J民以外の人・生き物・物。 */
const N = (s: Story, text: string, name: string) => s.say(null, text, { name });

const flag = (name: string) => (st: GameState) => !!st.flags[name];
/** 「昼」の住民（前夜祭までは居て、負けイベントのあと消える）。 */
const day = (st: GameState) => !silent(st);

/** プレイヤーを (x, y) のほうへ向ける。 */
const faceToward = (s: Story, x: number, y: number): void => {
	const dx = x - s.state.x;
	const dy = y - s.state.y;
	if (!dx && !dy) return;
	const d: Dir =
		Math.abs(dx) > Math.abs(dy)
			? dx > 0
				? "right"
				: "left"
			: dy > 0
				? "down"
				: "up";
	s.face("player", d);
};

/** 沈黙期間は町の外へ出さない（ロゼが止めて1歩もどす）。止めたら true。 */
const holdSilent = async (
	s: Story,
	back: "u" | "d" | "l" | "r",
): Promise<boolean> => {
	if (!silent(s.state)) return false;
	await s.say("roze", "……今は、マッマの　ところへ\n行くアル");
	await s.move("player", back);
	return true;
};

// ───────────────── 第一章 ─────────────────

const ch1Intro = async (s: Story): Promise<void> => {
	await s.chapter("第一章", "宣伝の旅と先輩アル");
	s.set("ch", 1);
	// ぷゆゆ（小花のそば (9,11)）の前ふり。寄り道しない人も、ここで一度だけ見る
	faceToward(s, 9, 11);
	s.face("puyu", "player");
	await s.narrate("「ぷゆうゆ……」\n小花の　そばで、ちいさな　声が　した。");
	await s.say("kiriko", "……いまの、だれンゴ？");
	await s.say(
		"nanj",
		"ぷゆゆや。レスの　文末に　ついとる\n🥺が、歩きだしたようなもんや",
	);
	await s.say(
		"nanj",
		"ここが　なんでも実況J町や。\nまずは　広場の　勢い欄、見に行こか",
	);
};

/** 勢い欄（初回は古参ニキがサイレントバルスを説明する）。 */
const ikioi = async (s: Story): Promise<void> => {
	const f = s.state.flags;
	if (!f.ikioi_seen) {
		await s.narrate("勢い欄。スレタイが　ずらりと　ならんでいる。");
		await s.narrate(`1 ${resLine(s.state)}`);
		await s.wait(300);
		await s.narrate("……すぐ下の　スレタイが、ふっと　消えた。");
		s.face("kosan", "player");
		await J(
			s,
			"……また落ちた。主が　なんも\nしとらんのに、スレが　終わってまう",
			"古参ニキ",
		);
		await J(s, "おんJ七不思議「サイレントバルス」や", "古参ニキ");
		await s.say("nanj", "生まれたての　スレは、まっさきに　狙われるで");
		await s.say("kiriko", "吾輩のスレも……消えるンゴ？");
		await J(s, "1000レス　完走すりゃ、もう　手出しはでけへん", "古参ニキ");
		await J(
			s,
			"北のスレ街道の先に、落ちたスレが\n流れつく「過去ログ倉庫」がある。調べてみ",
			"古参ニキ",
		);
		await s.say("nanj", "宣伝しながら　行こか。レスも　たまるで");
		s.set("ikioi_seen");
		return;
	}
	if (silent(s.state)) {
		await s.narrate("勢い欄が　まっくろに　ぬりつぶされている……");
		return;
	}
	const second = !f.b2
		? "あ！今日土曜日ど！"
		: !f.b3
			? "【実況】おんJスタジアム　ナイター"
			: "【保守】キリコがんばれ";
	await s.narrate(`1 ${resLine(s.state)}\n2 ${second}`);
};

// ───────────────── 古参ニキの呼び返し（倉庫での reply_kako。spec §4 F3-2） ─────────────────

/** 第三章（b2〜b3）に町で話しかけたとき。なしは既存の「今夜は　ナイターや」。 */
const KOSAN_NIGHTER: Record<string, string> = {
	uke: "今夜は　ナイターや。\n昔の　祭りを　思い出すわ",
	kaesu: "今夜は　ナイターや。\n今の　おんJ、見せてもらうで",
	neta: "今夜は　ナイターや。\n……「昔のおんJ」予備軍やな",
};

/** 第四章の前夜祭（nightEv）。なしは既存の「明日には　完走やな！」。 */
const KOSAN_850: Record<string, string> = {
	uke: "850レスやて！　昔の　祭りにも\n負けとらんで！",
	kaesu: "850レスやて！　……しゃあない、\n今夜は　ワイも　書きこんだる",
	neta: "850レスやて！　こら　ほんまに\n「昔のおんJ」に　なる　勢いや",
};

// ───────────────── 第四章・前半（負けイベント） ─────────────────

const nightEv = async (s: Story): Promise<void> => {
	await s.chapter("第四章", "サイレントバルス");
	s.set("ch", 4);
	await s.narrate("その夜。町は　前夜祭で　おおにぎわいだった。");
	s.face("kosan", "player");
	await J(
		s,
		KOSAN_850[String(s.flag("reply_kako"))] ??
			"850レスやて！　明日には　完走やな！",
		"古参ニキ",
	);
	await s.say("kiriko", "あと150レス。明日には　完走だ");
	s.bgm(null);
	await s.wait(800);
	await s.narrate("――そのとき。音が、消えた。");
	await s.narrate(
		"勢い欄の　スレタイが、ひとつ、またひとつ\n黒く　ぬりつぶされていく。",
	);
	s.set("balus_on");
	s.show("balus"); // show で when を評価し直して姿を出す
	s.se("shock");
	faceToward(s, 12, 11);
	await s.say("roze", "足音が……しないアル。わたしより　静かアル");
	await N(s, "…………ネタは、ネタのまま　終わるンゴ", "サイレントバルス");
	await s.say("kiriko", "い、今……ンゴって……");
	await s.battle("g_balus_ev", { canLose: true }); // 負けるとエンジンが全回復する
	await s.fadeOut(800);
	s.set("res", 0);
	s.set("balus_lost"); // 沈黙期間の始まり（昼の住民が消え、文字化けの住民が出る）
	s.hide("balus");
	await s.fadeIn(800);
	s.bgm("sad");
	await s.narrate("【このスレッドは　終了しました】");
	await s.narrate("蓄音機の　レコードが　まっしろだ。\n（0/1000）");
	await ks(s, "…………！");
	await s.narrate(
		"キリコの　声が　出ない。\n足もとが、すうっと　うすれていく。",
	);
	await s.say("roze", "わたしと……おなじ……！　キリコ！");
	await s.say("nanj", "――――！　――――！");
	await s.narrate("おんJ民の　口もとに、【アク禁】の　ふだが\nはられている。");
	await s.say("feris", "書きこめないんだ……");
	await s.narrate(
		"おんJ民は　勢い欄を　ゆびさし、\nキリコの　せなかを　おした。",
	);
	await s.narrate(
		"「ここは　ワイが　見張っとく」――\nそう　言っている　ようだった。",
	);
	s.leave("nanj");
	s.set("akukin");
	s.show("nanj_aku"); // 勢い欄の前に残る
	await s.say("roze", "……まずは　休むアル。\nマッマの　ところへ　行くアル");
};

// ───────────────── 第四章・後半（マッマ → テト） ─────────────────

const mammaNight = async (s: Story): Promise<void> => {
	await s.narrate("マッマは　なにも　言わずに\nおにぎりを　にぎってくれた。");
	s.heal();
	s.se("inn");
	await s.narrate("HPと　こえが　かいふくした。\n……でも、声は　出ない。");
	await s.narrate("キリコは　ふるえる手で　かきこんだ。");
	await ks(s, "「一週間で　落ちる」って……\nほんとに、なっちゃった");
	await ks(s, "吾輩の設定は、ぜんぶ　安価ンゴ。\n髪も、語尾も、体重も");
	await ks(s, "名言も、なんにも　ないンゴ");
	await ks(s, "どうせ　ネタで　生まれた　吾輩……");
	await s.narrate("……パリッ。\nフランスパンを　かじる音が　した。");
	s.set("teto_on");
	s.show("teto_ev"); // show で when を評価し直して (11,6) に姿を出す
	// 通りの東から歩いてきて (9,6) で止まる。隊列はいつもキリコから
	// 2マス以内なので、(6,6) 付近で話したときに仲間と重ならない。
	await s.move("teto_ev", "ll");
	faceToward(s, 9, 6);
	s.face("teto_ev", "player");
	await s.say("teto", "君は　じつに　馬鹿だな");
	await s.say("roze", "テト先輩……！　VIPの……");
	await s.say("teto", "重音テト。キメラで　31歳。\n……年のことは　聞くなよ");
	await s.say(
		"teto",
		"ボクは　2008年の　エイプリルフールの\nウソから　生まれた。「架空のボーカロイド」さ",
	);
	await s.say("teto", "君と　おなじ、ネタだよ");
	await ks(s, "……でも、テト先輩は　本物ンゴ");
	await s.say(
		"teto",
		"歌わせてくれる人が　いたからね。\nちなみに　ボクの苦手なことは、歌だ。公式でね",
	);
	await ks(s, "……え");
	await s.say("teto", "それでも、どんなマイクも　握るのさ。\n……来なよ");
	s.set("teto_met");
	await s.warp("studio", 7, 6, "up"); // ここで終了。スタジオの rec_ev が続く
};

const mamma = async (s: Story): Promise<void> => {
	if (silent(s.state) && !s.flag("teto_met")) {
		await mammaNight(s);
		return;
	}
	await J(s, "34キロしか　ないんやから、\nちゃんと　食べていき", "マッマ");
	s.heal();
	s.se("inn");
	await s.narrate("HPと　こえが　ぜんかいふくした！");
};

// ───────────────── 町の人たち ─────────────────

/** ボイス案内（§9）。 */
const voice = async (s: Story): Promise<void> => {
	if (s.flag("voice_told")) {
		await J(
			s,
			"ボイスは「せってい」→「ボイス」や。\nロゼちゃんも　テトさんも　しゃべるで",
			"ボイスニキ",
		);
		return;
	}
	await J(s, "おっ、キリコちゃんやんけ。\nええこと　教えたるで", "ボイスニキ");
	await J(s, "メニューの「せってい」→「ボイス」を\nONにしてみ", "ボイスニキ");
	await J(s, "キリコちゃんたちの　声が\n聞けるらしいで", "ボイスニキ");
	await J(
		s,
		"最初に　45MBくらい　読みこむから、\nWi-Fiの　とこで　やるんが　ええで",
		"ボイスニキ",
	);
	await J(s, "OFFのままでも　最後まで　遊べるで", "ボイスニキ");
	await s.say("kiriko", "吾輩の声……ちょっと　はずかしいンゴ");
	s.set("voice_told");
};

const kosan = async (s: Story): Promise<void> => {
	const f = s.state.flags;
	const line = !f.ikioi_seen
		? "勢い欄、見てみ。\n……えらいこっちゃで"
		: !f.b1
			? "1000いったら　ええもん　見れるで"
			: !f.b2
				? "過去ログ倉庫、閲覧専用やで" // ふだんは倉庫の kosan_k にいるので出ない
				: !f.b3
					? (KOSAN_NIGHTER[String(f.reply_kako)] ?? "今夜は　ナイターや")
					: // b3 のあとに人がいる＝録音のあと
						"スタジオから、歌が　聞こえたで。\n……ボカロも、悪ないな";
	await J(s, line, "古参ニキ");
};

/** 詰碁（任意。正解は「真下」）。 */
const igo = async (s: Story): Promise<void> => {
	await J(s, "詰碁、やってくか？", "囲碁J民");
	if ((await s.choose(["やる", "やめとく"], { cancel: 1 })) === 1) return;
	await s.narrate("●○●　（盤の　いちばん上）\n＋＋＋");
	await J(s, "黒番。白を　とるには？", "囲碁J民");
	if ((await s.choose(["左上", "右下", "真下"])) !== 2) {
		await J(s, "おしい。呼吸点を　数えるんや", "囲碁J民");
		return;
	}
	if (s.flag("tsumego")) {
		await J(s, "正解や。……ほうびは　もう　やったで", "囲碁J民");
		return;
	}
	await J(s, "正解や！　ほな、ほうびや", "囲碁J民");
	s.give("candy", 2);
	s.set("tsumego");
	s.se("item");
	await s.narrate("のどあめを　2こ　てにいれた！");
	await s.say("kiriko", "ふふん。シチョウは、吾輩の\nとっておきンゴ");
};

const nanjAku = async (s: Story): Promise<void> => {
	await s.say("nanj", "――――！");
	if (silent(s.state)) {
		await s.narrate("おんJ民は　勢い欄を　ゆびさして\n親指を　立てた。");
		return;
	}
	await s.narrate(
		"おんJ民は　キリコの　声を　聞いて\nうれしそうに　親指を　立てた。",
	);
	await s.say("kiriko", "待ってて。……かならず　完走するンゴ");
};

// ───────────────── ぷゆゆ🥺（任意の寄り道。scratchpad/puyuyu/spec.md） ─────────────────
// 小花のそば (9,11) に ずっと おる、おんJ生まれの 絵文字の住民。こたえ方（puyu）を
// 沈黙期間・録音のあと・エンディング・次スレの >>5 で拾う（通知は出さない）。
// 「黄色い」とは書かない。キリコを「ぷゆゆ」とは呼ばない（lore の AVOID）。

type Puyu = "ame" | "uta" | "suwaru";
/** ぷゆゆのセリフ（J民と同じ 黄色の名前欄・読み上げなし）。 */
const P = (s: Story, text: string) => J(s, text, "ぷゆゆ");
/** 沈黙期間のぷゆゆ（書きこめるのは絵文字だけ。名前欄も 🥺）。 */
const P0 = (s: Story, text: string) => J(s, text, "🥺");
const puyuOf = (st: GameState): Puyu | undefined => {
	const v = st.flags.puyu;
	return v === "ame" || v === "uta" || v === "suwaru" ? v : undefined;
};
/** おんJ民が隊列にいる（アク禁の前）。 */
const nanjHere = (st: GameState) => !!st.flags.nanj_in && !st.flags.akukin;

/** こたえたあとの昼（曜日の話の次から）。 */
const PUYU_AGAIN: Record<Puyu, string> = {
	ame: "ハッカの　のどあめ、\nちょっと　すきに　なったゆ🥺",
	uta: "サビの　入り、\nれんしゅう　ちた？🥺",
	suwaru: "となり、あいてゆ🥺",
};

const puyuAme = async (s: Story): Promise<void> => {
	s.take("candy");
	await s.narrate("のどあめを　ひとつ　わたした。");
	await P(s, "おかち、わけてくれゆの？\nきみ、いいひとぷゆ🥺");
	await s.narrate("ぷゆゆは　のどあめを\nころころ　なめた。");
	await P(s, "……ぷゆ……🤪");
	await P(s, "……これ、ハッカ。からい。");
	await P(s, "……でも、なめゆ🥺");
	await ks(s, "からくても、げんき　でるンゴ");
};

const puyuUta = async (s: Story): Promise<void> => {
	await s.narrate("キリコは　ちいさな　声で\nはなうたを　うたった。");
	await ks(s, "ふん、ふふん、ふふ……ふーん");
	await P(s, "うゆ……いいうた🥺");
	await P(s, "……サビの　入りが、半拍　はやい。");
	await ks(s, "は、半拍……！");
	if (nanjHere(s.state))
		await s.say("nanj", "ぷゆゆ、たまに　ふつうに\nしゃべるんよな");
	else if (s.flag("roze_in")) await s.say("roze", "……耳が　いいアル");
	await P(s, "……うゆ？🥺");
	await ks(s, "……つぎは、ちゃんと　入るンゴ");
	await P(s, "うゆ。まってゆ🥺");
};

const puyuSuwaru = async (s: Story): Promise<void> => {
	await s.narrate("キリコは　ぷゆゆの　となりに\nこしを　おろした。");
	await s.narrate("小花が、かぜに　ゆれている。");
	// 名無しの住民みんな（lore の元の意味）。名前のある キリコは ふくめない
	await P(s, "スレの　名無しは\nみんな　ぷゆゆなんだよ🥺");
	if (nanjHere(s.state)) {
		await s.say("nanj", "……ワイもか？");
		await P(s, "きみも🥺");
		await s.say("nanj", "……ほな、ちょっとだけ\nぷゆっとくわ");
	} else {
		await ks(s, "……名無しは、みんな？");
		await P(s, "うゆ。みーんなゆ🥺");
	}
	s.heal();
	s.se("inn");
	await s.narrate(
		"しばらく　ひとやすみした。\nHPと　こえが　ぜんかいふくした！",
	);
};

type PuyuOpt = { id: Puyu; label: string; run: (s: Story) => Promise<void> };

/** こたえ方（記録する安価）。のどあめが無ければ その選択肢は出さない。「またこんど」は記録しない。 */
const puyuAsk = async (s: Story): Promise<void> => {
	await P(s, "うゆ……おかち、たべたいゆ。\nひとりは　さみちいゆ🥺");
	const opts: PuyuOpt[] = [];
	if (s.has("candy") > 0)
		opts.push({ id: "ame", label: "のどあめを　あげる", run: puyuAme });
	opts.push(
		{ id: "uta", label: "はなうたを　きかせる", run: puyuUta },
		{ id: "suwaru", label: "となりに　すわる", run: puyuSuwaru },
	);
	const i = await s.choose(
		[...opts.map((o, k) => `>>${k + 1} ${o.label}`), "またこんど"],
		{ cancel: opts.length },
	);
	if (i >= opts.length) {
		await P(s, "うゆ……またきてゆ🥺");
		return;
	}
	await opts[i].run(s);
	s.set("puyu", opts[i].id);
	// 録音のあとに 初めて こたえた人は、次に話しかけたとき 蓄音の場面（puyuRec）から。
	// すわった人に「となり、あけといたゆ」は重ねない。のどあめの人には おかえしを わたす
	if (s.flag("balus_lost") && opts[i].id !== "ame") s.set("puyu_back");
};

/** 沈黙期間（こたえた人の前にだけ残る。ことばは使わない）。 */
const puyuSilent = async (s: Story, how: Puyu): Promise<void> => {
	await P0(s, "🥺");
	if (s.flag("puyu_back")) return;
	s.set("puyu_back");
	if (how === "ame") {
		await s.narrate("ぷゆゆは　のどあめを　ふたつ、\nキリコの　手に　のせた。");
		s.give("candy", 2);
		s.se("item");
		await s.narrate("のどあめを　2こ　てにいれた！");
		await ks(s, "……声が　もどったら、\nいっしょに　なめよう");
		await P0(s, "✋🥺");
	} else if (how === "uta") {
		await s.narrate("ぷゆゆが　ちいさく\nからだを　ゆらしはじめた。");
		await s.narrate(
			"……キリコの　はなうたの　リズムだ。\nサビの　入りまで、そのままだった。",
		);
		await ks(s, "……半拍、はやい");
		await P0(s, "🥺");
	} else {
		await s.narrate(
			"ぷゆゆは　なにも　言わずに、\nキリコの　となりに　すわった。",
		);
		await P0(s, "✋🥺");
		await s.narrate("うすれかけた　足もとが、\nすこしだけ　あたたかい。");
	}
};

/** 録音のあと（声がもどった）。初めての1回だけ、ぷゆゆの声を蓄音する。 */
const puyuRec = async (s: Story, how: Puyu): Promise<void> => {
	if (s.flag("puyu_rec")) {
		await P(s, "生きてこそだ✋🥺");
		return;
	}
	await P(s, "こえ、もどったゆ🥺\n……生きてこそだ✋🥺");
	if (how === "uta") {
		// 半拍はやかった 入りの、その後（ふつうの言葉で）
		await P(s, "スタジオの　うた、きこえた。\n……入り、ぴったりだった。");
		if (s.flag("teto_in")) await s.say("teto", "……いい耳だ");
	} else if (!s.flag("puyu_back")) {
		// 沈黙期間に 会いそびれた人の拾い
		if (how === "ame") {
			await P(s, "これ、おかえちゆ🥺\nハッカじゃ　ないやつ");
			s.give("candy", 2);
			s.se("item");
			await s.narrate("のどあめを　2こ　てにいれた！");
		} else await P(s, "おかえりぷゆ🥺\nとなり、あけといたゆ");
	}
	s.set("puyu_back");
	await ks(s, "……ぷゆゆの　声も、\n蓄音させて　ほしい");
	await P(s, "ぼくちんの　こえ？\n……ぷゆうゆ🥺");
	// おんJ民のおでかけと同じ形（wait で窓を閉じると、場面のとちゅうで 十字キーが見える）
	s.se("save");
	await s.narrate("蓄音機が　くるくる　まわって、\nちいさな　声を　ためた。");
	s.set("puyu_rec");
};

/** 話しかけたとき。 */
const puyuTalk = async (s: Story): Promise<void> => {
	const st = s.state;
	const how = puyuOf(st);
	if (silent(st)) {
		if (how) await puyuSilent(s, how); // when で、こたえた人の前にだけ いる
		return;
	}
	if (how && st.flags.rec) {
		await puyuRec(s, how);
		return;
	}
	if (how) {
		if (st.flags.puyu_day) {
			await P(s, PUYU_AGAIN[how]);
			return;
		}
		// 2026-08-18 は火曜日（先住民の「土曜日ど！」→ おんJ民「火曜日やぞ」と同じ日）
		await P(s, "きょうは　火曜日だから\nぷゆってる🥺");
		await ks(s, "……曜日、関係あるンゴ？");
		await P(s, "ないゆ🥺");
		if (nanjHere(st)) await s.say("nanj", "……曜日だけは、ちゃんと\n合っとるな");
		s.set("puyu_day");
		return;
	}
	if (!st.flags.puyu_met) {
		await P(s, "ぷゆゆ🥺　きみ、はじめて\nみる　かおぷゆ？");
		await ks(s, "吾輩、蓄音キリコ。\n安価で　生まれた　ボカロンゴ");
		await P(
			s,
			"ぼくちん、ずっと　この町に　いゆの。\n……2019ねん　くらいから？🥺",
		);
		// 「先輩」は ボカロの系譜（ロゼ・フェリス・テト）に とっておく
		await ks(s, "……吾輩より　ずっと　前ンゴ！\nおんJの　大御所……");
		await P(s, "おおごしょ？　うゆ……てれゆ🥺");
		s.set("puyu_met");
	}
	await puyuAsk(s);
};

// ───────────────── タイル ─────────────────

const TURF = base(0, 4);
const PLAZA = base(2, 46);
const C_TURF = "#6fae3a";
/** 通れる飾り（芝生の小花）。§11 の通行はそのまま。 */
const flowers = (img: string): TileDef => ({
	layers: [TURF, img],
	color: C_TURF,
	passable: true,
});

const tiles: Record<string, TileDef> = {
	...TOWN,
	v: flowers(base(5, 11)), // 芝生に咲く小花（ピンク）
	y: flowers(base(7, 11)), // 芝生に咲く小花（黄）
	"!": { layers: [TURF, base(3, 38)], color: C_TURF, passable: false }, // 芝生に立つ看板
	K: { layers: [PLAZA, base(6, 37, 1, 2)], color: "#8a7a6a", passable: false }, // 勢い欄（広場の石畳の上）
	k: { layers: [PLAZA, base(7, 37, 1, 2)], color: "#8a7a6a", passable: false },
};

// ───────────────── イベント ─────────────────

const events: EventDef[] = [
	// 自動イベント
	{
		id: "ch1_intro",
		x: 1,
		y: 16,
		trigger: "auto",
		once: true,
		when: flag("p_tut"),
		run: ch1Intro,
	},
	{
		id: "night_ev",
		x: 2,
		y: 16,
		trigger: "auto",
		once: true,
		when: (st) => !!st.flags.night && !st.flags.balus_lost,
		run: nightEv,
	},

	// 北口 → スレ街道（勢い欄を見るまでは おんJ民が止める）
	...[0, 1].map(
		(i): EventDef => ({
			id: `to_road_${i}`,
			x: 11 + i,
			y: 0,
			trigger: "touch",
			through: true,
			run: async (s) => {
				if (!s.flag("ikioi_seen")) {
					await s.say("nanj", "ちょい待ち。先に　広場の　勢い欄、見とこや");
					await s.move("player", "d");
					return;
				}
				if (await holdSilent(s, "d")) return;
				await s.warp("road", 11 + i, 18, "up");
			},
		}),
	),

	// 広場の勢い欄（掲示板の上。(11,8)(12,8) から話す）
	{ id: "ikioi_l", x: 11, y: 7, trigger: "talk", run: ikioi },
	{ id: "ikioi_r", x: 12, y: 7, trigger: "talk", run: ikioi },
	// 古参ニキ。B1 のあと B2 までは過去ログ倉庫にいる（kakolog の kosan_k）ので、町からは消える
	npc("kosan", 9, 8, SPR.j_shinkan, kosan, {
		dir: "up",
		when: (st) => day(st) && !(st.flags.b1 && !st.flags.b2),
	}),
	phono("phono_town", 14, 8),

	// マッマ（回復。第四章は無言のおにぎり）と開かない扉
	npc("mamma", 5, 6, SPR.mamma, mamma),
	lockedDoor("mamma_door", 4, 5, "カギが　かかっている。"),
	lockedDoor("ne_door", 18, 5, "カギが　かかっている。"),

	// ボイス案内（到着位置のすぐ右）
	npc("voice", 12, 16, SPR.j_nanashi, voice, { dir: "left", when: day }),

	// お絵かきニキと誤字看板
	npc(
		"oekaki",
		19,
		6,
		SPR.j_hikoki,
		async (s) => {
			if (s.flag("rec")) {
				await J(
					s,
					"声、もどったんやな！　記念に\nあちこちに　キリコちゃん　描いといたで",
					"お絵かきニキ",
				);
				await s.say("kiriko", "……字、なおってるンゴ？");
				await J(s, "…………", "お絵かきニキ");
				return;
			}
			await J(s, "キリコちゃんの　看板、描いといたで！", "お絵かきニキ");
			await s.say("kiriko", "……「畜」ちがうンゴ。\n蓄えるほうの「蓄」ンゴ");
		},
		{ when: day },
	),
	sign("kanban", 21, 6, "『畜音キリコ　ようこそ』\n……字が　ちがう。"),

	// 先住民（うろうろ）
	npc(
		"senju",
		18,
		10,
		SPR.townsfolk,
		async (s) => {
			await N(s, "あ！今日土曜日ど！", "先住民");
			if (s.flag("nanj_in") && !s.flag("akukin"))
				await s.say("nanj", "火曜日やぞ");
		},
		{ wander: true, when: day },
	),

	// 囲碁J民（詰碁）
	npc("igo", 19, 13, SPR.j_shinkan, igo, { dir: "left", when: day }),
	// ぷゆゆ🥺（任意の寄り道。小花のそば）。昼はいつも いる。沈黙期間は こたえた人の前にだけ 残る
	npc("puyu", 9, 11, SPR.puyu, puyuTalk, {
		when: (st) => day(st) || !!puyuOf(st),
	}),

	// 東門 → おんJスタジアム（B2 のあと開く）
	npc(
		"eastgate",
		22,
		9,
		SPR.j_yakiu,
		async (s) =>
			J(
				s,
				"今夜の　ナイターは　準備中や。\n過去ログの　騒ぎが　片づいたらな",
				"やきう民",
			),
		{ dir: "left", when: (st) => !st.flags.b2 },
	),
	npc(
		"eastgate2",
		22,
		8,
		SPR.j_yakiu,
		async (s) =>
			J(
				s,
				s.flag("b3") // b3 のあとに人がいる＝録音のあと
					? "急に　静かに　なって、びびったわ。\n……おんJは、うるさいほうが　ええ"
					: "ナイター開幕や！　実況スレ、\n盛り上がっとるで",
				"やきう民",
			),
		{ dir: "down", when: (st) => !!st.flags.b2 && !silent(st) },
	),
	{
		id: "to_stadium",
		x: 23,
		y: 9,
		trigger: "touch",
		through: true,
		when: flag("b2"),
		run: async (s) => {
			if (await holdSilent(s, "l")) return;
			await s.warp("stadium", 1, 15, "right");
		},
	},

	// 第四章：サイレントバルス・アク禁のおんJ民・文字化けの住民・テト
	npc(
		"balus",
		12,
		11,
		SPR.e_shinmax,
		async (s) => N(s, "…………", "サイレントバルス"),
		{
			dir: "up",
			when: (st) => !!st.flags.balus_on && !st.flags.balus_lost,
		},
	),
	npc("nanj_aku", 12, 8, "char:nanj", nanjAku, {
		dir: "up",
		when: (st) => !!st.flags.akukin && !st.flags.onsha,
	}),
	npc(
		"night_j",
		16,
		8,
		SPR.j_tights,
		async (s) => J(s, "縺ｧ縺ｯ……（文字化けしている）", "蜷咲┌縺"),
		{
			when: silent,
		},
	),
	npc("teto_ev", 11, 6, "char:teto", async (s) => s.say("teto", "……来なよ"), {
		dir: "left",
		when: (st) => !!st.flags.teto_on && !st.flags.teto_met,
	}),

	// テトのスタジオ（テト加入まではカギ）
	lockedDoor(
		"studio_locked",
		4,
		12,
		"『スタジオ　本日休業』\nカギが　かかっている。",
		(st) => !st.flags.teto_in,
	),
	warp(
		"studio_door",
		4,
		12,
		{ map: "studio", x: 1, y: 5, dir: "right" },
		{ se: "door", when: flag("teto_in") },
	),
	{
		id: "studio_sign",
		x: 6,
		y: 13,
		trigger: "talk",
		run: async (s) => {
			await s.narrate("テトのスタジオ\n〜どんなマイクも握ります〜");
		},
	},

	// スレの建物 → 誕生スレ
	{
		id: "thread_door",
		x: 11,
		y: 15,
		trigger: "touch",
		through: true,
		when: (st) => !st.flags.clear,
		run: async (s) => {
			if (await holdSilent(s, "d")) return;
			await s.warp("thread", 6, 9, "up", { se: "door" });
		},
	},

	...chest("town1", 22, 16, "candy", 2),
];

export const town: MapDef = {
	id: "town",
	name: "なんでも実況J町",
	bgm: "town",
	tiles,
	rows: [
		// v y は通れる小花（見た目だけ。§11 の , と同じく通れる）
		"|||||||||||..|||||||||||",
		"|,v,,,,y,,,..,,,y,,,,v,|",
		"|,nnnnn,,v,..,,,zzzzz,,|",
		"|,^^^^^,,,,..,y,ZZZZZ,,|",
		"|,%W%W%,y,,..,,,[w[w[,v|",
		"|v##D##,,,,..,,,]]e]],,|",
		"|......................|",
		"|,,y,,,,:::Kk:::,,,,,v,|",
		"|v,,,,,,::::::::,,,,,,,|",
		"|,aaaaa,::::::::........",
		"|,AAAAA,::::::::,,,,,y,|",
		"|,(w(w(,,,v,,,,,,,,,,,,|",
		"|,))d)),,nnnnnn,,,,v,,y|",
		"|,v,,,!,,^^^^^^,,,,,,,,|",
		"|,,,y,,,,%W%%W%,y,,,,,,|",
		"|,,,,,,v,##D###,,,,,v,,|",
		"|......................|",
		"||||||||||||||||||||||||",
	],
	events,
	onEnter: async (s) => {
		if (silent(s.state)) s.bgm("sad");
	},
};
