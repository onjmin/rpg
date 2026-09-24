// ゲームデータ（マップ・イベント・キャラ・敵）とシナリオ API の型。
// src/data/ 以下はこの型に沿って書く。

import type { Dir } from "./types";

// ───────────────── マップ ─────────────────

export type TileDef = {
	/** 下から順に重ねる画像参照（`sp:<id>` 等。engine/assets.ts の resolveRef）。 */
	layers: string[];
	/** 画像が読めないときの塗り色。 */
	color: string;
	/** 通れるか。 */
	passable: boolean;
	/** キャラより手前に描く画像（木の葉・屋根のひさし等）。 */
	above?: string[];
	/** カウンター（向こう側の人に話しかけられる）。 */
	counter?: boolean;
	/** ランダムエンカウントが起きる地形。 */
	encounter?: boolean;
};

export type EventTrigger =
	/** A ボタン／タップで話しかける。 */
	| "talk"
	/** 上に乗ったとき（扉・ワープ・イベント床）。 */
	| "touch"
	/** 条件を満たしたら自動で始まる（カットシーン）。`once` と併用が基本。 */
	| "auto";

export type EventDef = {
	id: string;
	x: number;
	y: number;
	/**
	 * 見た目。`char:<キャラID>`（キャラの歩行グラ）/ `sa:<id>`（RPGEN 歩行グラ）/
	 * `sp:<id>`（単体スプライト）/ `pub:<path>`。省略すると見えないイベント。
	 */
	sprite?: string;
	dir?: Dir;
	trigger: EventTrigger;
	/** 通り抜けられる（見えない踏みイベント・床の模様など）。見た目なしなら既定で true。 */
	through?: boolean;
	/** うろうろ歩く。 */
	wander?: boolean;
	/** 向きを変えない（看板・オブジェ等）。 */
	fixedDir?: boolean;
	/** 出現条件。偽の間はマップに居ない扱い。 */
	when?: (s: GameState) => boolean;
	/** 1回だけ実行する（実行後 `done:<map>:<id>` が立ち、以後は消える）。 */
	once?: boolean;
	run?: Script;
};

export type MapDef = {
	id: string;
	/** 画面に出す地名。 */
	name: string;
	/** BGM 名（data/bgm.ts）。null なら無音、省略なら前の曲を続ける。 */
	bgm?: string | null;
	/** 行の各文字 → タイル。 */
	tiles: Record<string, TileDef>;
	/** マップ本体（1文字 = 1マス）。全行同じ長さにする。 */
	rows: string[];
	events?: EventDef[];
	/** ランダムエンカウント（encounter: true の地形の上で1歩ごとに rate の確率）。 */
	encounters?: { rate: number; groups: string[] };
	/** マップに入るたびに走るスクリプト（ワープの後）。 */
	onEnter?: Script;
	/** マップの外側の色。 */
	outside?: string;
};

// ───────────────── キャラ ─────────────────

export type VoiceDef = {
	/** dtm の koe 音源キーワード（uc / roze / teto / rei …）。 */
	model: string;
	pitchOffset?: number;
	emotion?: "neutral" | "happy" | "sad" | "angry";
	style?: "neutral" | "calm" | "lively";
};

export type CharDef = {
	id: string;
	/** メッセージ窓の名前欄。 */
	name: string;
	/** 歩行グラ（`sa:<id>` / `pub:sprites/xxx.png`）。 */
	walk: string;
	/** 名前欄・ダミー立ち絵の色。 */
	color: string;
	/** 読み上げ音源（あれば UtauTTS で読み上げる）。 */
	voice?: VoiceDef;
	/**
	 * 立ち絵。透過 PNG を public/portraits/ に置いて `src` を指す。
	 * ファイルが無い／読めないときはダミー表示になる。
	 * - side: いつも立つ側（ほかの話し手でふさがっていれば自動で反対側へ回る）
	 * - facing: 絵のキャラが向いている向き（既定 "right"）。立つ側と合わなければ自動で左右反転する
	 * 透明な余白を切り詰め、全身の高さ・頭の位置を測って自動でそろえるので、キャンバスの大きさや余白は自由。
	 * scale / offsetX / offsetY は自動でそろえたあとの手直し（ふつうは要らない）。
	 */
	portrait?: {
		src: string;
		side?: "left" | "right";
		/** ふさがっていても反対側へ回らない（反転した絵を必ず見せたいときなど）。 */
		fixedSide?: boolean;
		/** 色を反転して出す（ほかのキャラの絵を使い回して別人に見せる）。 */
		invert?: boolean;
		facing?: "left" | "right";
		/** 全身絵の上から何割を見せるか（既定 0.58 ＝頭〜腰あたり。1 で全身）。 */
		crop?: number;
		/** 大きさの倍率（既定 1）。 */
		scale?: number;
		/** 描いた絵の右へずらす（全身の高さに対する割合。反転したときは逆へ）。 */
		offsetX?: number;
		/** 下へずらす（全身の高さに対する割合）。 */
		offsetY?: number;
	};
	/** 仲間になるキャラの戦闘能力。 */
	battle?: MemberStats;
};

/** うたと、覚えるレベル。 */
export type SongLearn = { id: string; lv: number };

export type MemberStats = {
	/** Lv1 の値と、1レベルごとの伸び。 */
	hp: [number, number];
	mp: [number, number];
	atk: [number, number];
	def: [number, number];
	spd: [number, number];
	/**
	 * 「うたう」で使う技（data/battle.ts の skills）と、覚えるレベル。覚える順に並べる。
	 * 加入したときは、そのレベル以下のうたを覚えている。こえ（mp）が 0 のキャラは空にする。
	 */
	skills: SongLearn[];
	/**
	 * 「たたかう」のときの文（ランダムに1つ）。{user} を名前に置き換える。
	 * UTAU の声が無い（こえ 0 の）キャラの持ち技は、ここで通常攻撃の演出として出す。
	 */
	attackTexts?: string[];
};

// ───────────────── 戦闘 ─────────────────

/**
 * とくぎの見た目（ui/battle.ts の playFx が出す）。絵は足さず CSS だけで作る。
 * - slash … ななめの筋で斬る・つりあげる（1体ずつ、相手の上）
 * - burst … はじける（1体ずつ）
 * - ring  … ひろがる波紋。回復（1人ずつ、札の上）
 * - aura  … 立ちのぼる気合。強化（1人ずつ）
 * - rain  … mark の字が降りそそぐ（列ぜんたい）
 * - spin  … まわる（列ぜんたい）
 */
export type FxSpec = {
	kind: "slash" | "burst" | "ring" | "aura" | "rain" | "spin";
	/** 演出の色（CSS の色。省略は白）。 */
	color?: string;
	/** rain で降らせる字（省略は ●）。 */
	mark?: string;
};

export type SkillDef = {
	id: string;
	name: string;
	/** 消費する「こえ」（MP）。 */
	mp: number;
	target: "enemy" | "enemies" | "ally" | "allies" | "self";
	/** 威力（攻撃は atk×power、回復は固定量×power）。 */
	power: number;
	kind: "attack" | "heal" | "guard" | "buff";
	/** 使ったときの文。{user} {target} を置き換える。 */
	text: string;
	se?: string;
	/** 見た目。省略すると画面がひかるだけ。 */
	fx?: FxSpec;
};

export type EnemyDef = {
	id: string;
	name: string;
	/** 見た目（`sa:<id>` の歩行グラの正面 or `sp:<id>`）。 */
	sprite: string;
	hp: number;
	atk: number;
	def: number;
	spd: number;
	exp: number;
	/** 落とすアイテムと確率。 */
	drop?: { item: string; rate: number };
	/** 行動（重み付き）。 */
	acts?: {
		weight: number;
		name: string;
		power: number;
		target?: "one" | "all";
		text: string;
	}[];
	/** 表示の大きさの倍率（既定 1、ボス戦は 1.5）。 */
	scale?: number;
	/**
	 * 召喚する敵（裏ボス）。stock を上から1体ずつ場に出す。ストックが残っているか、
	 * 呼んだ手下が場にいる間は、攻撃を必ずかわす。どちらも尽きると、どんな攻撃でも一撃で倒れる。
	 */
	summon?: SummonConfig;
	/** 倒れたときの文（既定「{user}を　たおした！」）。 */
	downText?: string;
};

/** 裏ボスが呼び出す1体。文は1要素＝ログ1枚（改行は効かない）。{user}＝呼ぶ敵、{name}＝出る敵。 */
export type SummonDef = {
	/** 出す敵の ID（data/battle.ts の enemies）。 */
	enemy: string;
	/** 出す前の文（1枚ごとにキーの音で すばやく。せりふ「名前「…」」は ふつうの待ち）。 */
	text: string[];
	/** 出した直後の文（既定「{name}を　デプロイした！」）。 */
	deploy?: string;
	/** 出したあとの文（手下のひと声など）。 */
	after?: string[];
	/** 出す前に、なかまの HP・こえを 最大値の rate だけ戻す（長いボスラッシュの息つぎ）。 */
	restore?: { rate: number; text: string };
};

export type SummonConfig = {
	stock: SummonDef[];
	/** 守りのあるうちに攻撃されたときの文（ランダムに1つ）。 */
	evade: string[];
	/** だれにも攻撃されずにターンが終わり、自分から呼ぶときの文。 */
	early?: string;
	/** ストックが尽きて守りがとけたときの文（順に流す）。 */
	exposed: string[];
	/** 守りがとけたあとの一撃の直前の文。 */
	finish: string;
};

export type EnemyGroup = {
	id: string;
	enemies: string[];
	/** 逃げられない（ボス戦）。 */
	boss?: boolean;
	bgm?: string;
	/** 戦闘開始時の文。 */
	intro?: string;
	/** 勝ったときの文（既定「あらしを　しずめた！」）。仲良くなる相手などに。 */
	victory?: string;
};

export type ItemDef = {
	id: string;
	name: string;
	desc: string;
	/** 使ったときの効果。 */
	effect?: { hp?: number; mp?: number; revive?: boolean; all?: boolean };
	/** 大事なもの（使えない・減らない）。 */
	key?: boolean;
};

// ───────────────── セーブされる状態 ─────────────────

export type MemberState = {
	id: string;
	lv: number;
	exp: number;
	hp: number;
	mp: number;
	/** 控え（隊列・戦闘・経験値に入らない）。無い・false なら たたかう仲間。 */
	bench?: boolean;
};

export type GameState = {
	mapId: string;
	x: number;
	y: number;
	dir: Dir;
	flags: Record<string, number | boolean | string>;
	/**
	 * 仲間全員。たたかう仲間（隊列の順。先頭はキリコ＝リーダー・いつも たたかう）のあとに控え。
	 * 並びかえは engine/party.ts（toBench・fromBench・swapBench・tidyParty）で。
	 */
	party: MemberState[];
	items: Record<string, number>;
	playMs: number;
};

// ───────────────── 仲間との親睦（なかよし度） ─────────────────

/** 仲間どうしの掛け合い（ひとやすみ会話）。蓄音機やメニューの「なかま」から見る。 */
export type SkitDef = {
	id: string;
	/** 一覧に出す題名。 */
	title: string;
	/** 全員がパーティにいるときだけ見られる（キリコは常にいるので書かなくてよい）。 */
	members: string[];
	/** 見られる条件（章・フラグ・なかよし度など）。 */
	when?: (s: GameState) => boolean;
	run: Script;
};

/** 「なかまと はなす」の一言。同じ人の分は上から順に調べ、最初に当てはまったものを使う。 */
export type ChatDef = {
	who: string;
	when?: (s: GameState) => boolean;
	run: Script;
};

/** プロフィール（なかよし度で少しずつ読めるようになる）。 */
export type ProfileDef = {
	who: string;
	pages: { bond: number; title: string; lines: string[] }[];
};

/**
 * おでかけ（デート）。なかよし度が minBond になると、メニューの「なかま」から行ける。
 * 1人1回。見たら date_<who> が立ち、なかよし度が上がる。
 */
export type DateDef = {
	who: string;
	/** 一覧に出す行き先。 */
	title: string;
	/** 解放に要るなかよし度（既定 3）。 */
	minBond?: number;
	/** 行ける条件（章・フラグ）。 */
	when?: (s: GameState) => boolean;
	run: Script;
};

export type BondData = {
	skits: SkitDef[];
	chats: ChatDef[];
	profiles: ProfileDef[];
	dates?: DateDef[];
};

// ───────────────── ゲーム全体のデータ ─────────────────

export type GameData = {
	title: string;
	subtitle?: string;
	maps: Record<string, MapDef>;
	cast: Record<string, CharDef>;
	enemies: Record<string, EnemyDef>;
	groups: Record<string, EnemyGroup>;
	items: Record<string, ItemDef>;
	skills: Record<string, SkillDef>;
	/** BGM 名 → MML。 */
	bgm: Record<string, string>;
	/** 効果音名 → `rpgen:<id>`（RPGEN の mp3）か MML。 */
	sfx: Record<string, string>;
	/** 戦闘曲（グループで指定が無いとき）。 */
	battleBgm: string;
	bossBgm: string;
	victoryBgm?: string;
	titleBgm: string;
	endingBgm: string;
	start: {
		mapId: string;
		x: number;
		y: number;
		dir: Dir;
		party: string[];
		items?: Record<string, number>;
		flags?: Record<string, number | boolean | string>;
	};
	/** スタッフロール（1要素 = 1行。空文字で間を空ける。"# " で始まる行は見出し）。 */
	credits: string[];
	/** 仲間との親睦（ひとやすみ会話・なかまと話す・プロフィール）。 */
	bonds?: BondData;
	/** 古いセーブで たたかう仲間が多すぎたとき、先に控えへ回す順（本編で控えに回る順）。無ければ いちばん新しい仲間。 */
	benchFirst?: string[];
	/** デバッグルームの入口（開発中か URL に ?debug があるとき、タイトルに「デバッグルーム」を出す）。 */
	debug?: { mapId: string; x: number; y: number; dir: Dir };
};

// ───────────────── シナリオ API ─────────────────

export type Script = (s: Story) => Promise<void>;

export type SayOptions = {
	/** 名前欄を差し替える（「？？？」等）。 */
	name?: string;
	/** 立ち絵を出さない。 */
	noPortrait?: boolean;
	/** 読み上げない。 */
	noVoice?: boolean;
	/** 読み上げの感情を一時的に変える。 */
	emotion?: VoiceDef["emotion"];
};

export type BattleResult = "win" | "lose" | "escape";

/** エンディングのまとめカード（スタッフロールのあとに出す）。1行は全角22字まで。 */
export type EndingSummary = { sections: { title: string; lines: string[] }[] };

export type Story = {
	readonly state: GameState;
	/** セリフ。who は キャラID（data/cast.ts）か null（地の文）。 */
	say(who: string | null, text: string, opt?: SayOptions): Promise<void>;
	/** 地の文。 */
	narrate(text: string): Promise<void>;
	/** 選択肢。選ばれた番号を返す。 */
	choose(options: string[], opt?: { cancel?: number }): Promise<number>;
	wait(ms: number): Promise<void>;
	fadeOut(ms?: number, color?: string): Promise<void>;
	fadeIn(ms?: number): Promise<void>;
	/** BGM を切り替える（null で止める）。 */
	bgm(name: string | null): void;
	/** 効果音（data/sfx.ts の名前）。 */
	se(name: string): void;
	flag(name: string): number | boolean | string | undefined;
	set(name: string, value?: number | boolean | string): void;
	/** マップ移動。 */
	warp(
		mapId: string,
		x: number,
		y: number,
		dir?: Dir,
		opt?: { fade?: boolean; se?: string },
	): Promise<void>;
	/**
	 * 歩かせる。target は "player" かイベント ID。
	 * route は "uuddlr" のような文字列（u/d/l/r = 1歩, U/D/L/R = その方向を向くだけ, w = 少し待つ）。
	 */
	move(
		target: string,
		route: string,
		opt?: { speed?: number; through?: boolean },
	): Promise<void>;
	face(target: string, dir: Dir | "player"): void;
	/** イベントを出す／消す（マップ上の見た目。フラグで管理されセーブされる）。 */
	show(eventId: string): void;
	hide(eventId: string): void;
	/** イベントの位置を変える（見た目だけ。マップを出ると元に戻る）。 */
	place(eventId: string, x: number, y: number, dir?: Dir): void;
	/**
	 * 戦闘。負けたときは通常「もういちど／タイトルへ」を選ばせる。
	 * canLose: true なら負けてもそのまま "lose" を返す（負けイベント）。
	 */
	battle(groupId: string, opt?: { canLose?: boolean }): Promise<BattleResult>;
	/**
	 * 仲間にする（たたかう仲間の平均レベルで入る）。bench: true なら控えで入る。
	 * たたかう仲間が MAX_ACTIVE 人いるときは、控えに入れて知らせる（シナリオで先に bench するか bench: true で）。
	 */
	join(charId: string, opt?: { bench?: boolean }): void;
	/** パーティから外す。たたかう仲間が抜けて控えがいれば、控えの先頭が入る。 */
	leave(charId: string): void;
	/** 控えに回す（キリコは回せない）。隊列からも外れる。 */
	bench(charId: string): void;
	/** 控えから戻す（たたかう仲間がいっぱいなら何もしない）。 */
	unbench(charId: string): void;
	/** 控えもふくめて全員を隊列に出す（見た目だけ。マップを移るまで）。エンディング用。 */
	gather(): void;
	give(itemId: string, n?: number): void;
	take(itemId: string, n?: number): boolean;
	has(itemId: string): number;
	/** 全員（控えもふくむ）全回復。 */
	heal(): void;
	shake(ms?: number): Promise<void>;
	flash(color?: string, ms?: number): Promise<void>;
	/** 章タイトルを出す。 */
	chapter(label: string, title: string): Promise<void>;
	/** セーブ画面（はい／いいえ）。 */
	saveMenu(): Promise<void>;
	/**
	 * まだ見ていない「ひとやすみ会話」があれば、見るかどうか聞いて1つ流す。
	 * 流したら true。蓄音機（セーブ点）から呼ぶ。
	 */
	restTalk(): Promise<boolean>;
	/**
	 * 隊列（後ろをついてくる仲間）を隠す／出す。おでかけ（デート）など、
	 * キリコと誰かの二人きりの場面で使う。マップを移っても続く。
	 */
	followers(show: boolean): void;
	/**
	 * 経験値を たたかう仲間（控えでない）に足す（戦わずに越えた・負けて通してもらった）。
	 * 獲得・レベルアップ・覚えたうたの文も出す。
	 */
	gainExp(n: number): Promise<void>;
	/** エンディング（スタッフロール → まとめカード → おわり → タイトルへ）。 */
	ending(opt?: { summary?: EndingSummary }): Promise<void>;
};
