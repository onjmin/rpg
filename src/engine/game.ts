// ゲーム本体：メインループ・フィールド操作・シナリオ（Story API）の実行。

import { el, nextFrame } from "../ui/dom";
import { ChoiceWindow, MessageWindow, type PortraitSpec } from "../ui/message";
import { preloadImages } from "./assets";
import type { GameAudio } from "./audio";
import { availableSkits, markSkitSeen } from "./bonds";
import type {
	BattleResult,
	EndingSummary,
	EventDef,
	GameData,
	GameState,
	MapDef,
	SayOptions,
	Script,
	SkitDef,
	Story,
} from "./defs";
import { Actor, Field } from "./field";
import type { Input } from "./input";
import {
	activeOf,
	gainExp as addExp,
	BENCH_HINT,
	backText,
	benchOf,
	benchText,
	expFor,
	fixParty,
	fromBench,
	healAll,
	learnTexts,
	MAX_ACTIVE,
	newMember,
	swapBench,
	tidyParty,
	toBench,
} from "./party";
import { writeSave } from "./save";
import type { Screen } from "./screen";
import { settings } from "./settings";
import { DIR_VEC, type Dir, OPPOSITE, sleep, TILE } from "./types";

/** スクリプトを中断してタイトルへ戻すための合図。 */
export class ResetToTitle extends Error {}

const WALK_MS = 170;

/** 戦闘・メニュー・タイトル等の画面（ui/ 側で実装して注入する）。 */
export type Scenes = {
	battle(
		game: Game,
		groupId: string,
		opt: { canLose?: boolean },
	): Promise<BattleResult>;
	menu(game: Game): Promise<void>;
	chapter(game: Game, label: string, title: string): Promise<void>;
	ending(game: Game, opt?: { summary?: EndingSummary }): Promise<void>;
};

export class Game {
	readonly data: GameData;
	readonly screen: Screen;
	readonly input: Input;
	readonly audio: GameAudio;
	readonly ui: HTMLElement;
	readonly msg: MessageWindow;
	readonly choice: ChoiceWindow;
	scenes!: Scenes;
	state!: GameState;
	field: Field | null = null;
	player!: Actor;
	followers: Actor[] = [];
	/** プレイヤーの足跡（隊列歩行用。先頭が直前の位置）。 */
	private trail: { x: number; y: number; dir: Dir }[] = [];
	private scriptDepth = 0;
	/** 操作で歩き始めた1歩がまだ着いていない（着いたら踏むイベントを調べる）。 */
	private stepPending = false;
	/** 隊列を出すか（おでかけ中は隠す）。 */
	private followersShown = true;
	/** マップを移ったので、スクリプトが終わったら自動セーブする。 */
	private autosavePending = false;
	/** スクリプトの終わりに出す知らせ（控えに回った・もどった）。 */
	private notes: string[] = [];
	/** gather のあと（マップを移るまで）控えも隊列に出す。 */
	private gatherAll = false;
	private path: Dir[] = [];
	private pathTalk: Actor | null = null;
	private marker: { x: number; y: number; t: number } | null = null;
	private stepsSinceBattle = 0;
	private time = 0;
	private last = 0;
	private camX = 0;
	private camY = 0;
	private running = false;
	private fadeEl: HTMLDivElement;
	private toastEl: HTMLDivElement;
	private rafId = 0;
	/** タイトルへ戻るとき呼ぶ（main.ts が設定）。 */
	onReset: (() => void) | null = null;

	constructor(
		data: GameData,
		screen: Screen,
		input: Input,
		audio: GameAudio,
		ui: HTMLElement,
	) {
		this.data = data;
		this.screen = screen;
		this.input = input;
		this.audio = audio;
		this.ui = ui;
		// 文送りと選択肢の決定は、鳴らしたばかりの効果音の区切りまで待つ（audio.ts）
		this.msg = new MessageWindow(
			ui,
			input,
			() => settings.textMs,
			() => audio.seSettled(),
		);
		this.choice = new ChoiceWindow(ui, input, () => audio.seHeld);
		this.fadeEl = el("div", { class: "fade" });
		this.toastEl = el("div", { class: "toast" });
		ui.append(this.fadeEl, this.toastEl);
		input.onFieldTap = (x, y) => this.onTap(x, y);
	}

	// ───────────────── 起動・停止 ─────────────────

	newState(): GameState {
		const st = this.data.start;
		const s: GameState = {
			mapId: st.mapId,
			x: st.x,
			y: st.y,
			dir: st.dir,
			flags: { ...(st.flags ?? {}) },
			party: [],
			items: { ...(st.items ?? {}) },
			playMs: 0,
		};
		for (const id of st.party) s.party.push(newMember(this.data, id, s.party));
		return s;
	}

	async start(state: GameState): Promise<void> {
		this.state = state;
		this.followersShown = true;
		this.running = true;
		this.notes = [];
		this.autosavePending = false;
		// 古いセーブ（たたかう仲間が4人）は、本編で控えに回る順に回して知らせる。
		// 直したら、知らせのあと（runEnter のスクリプトの終わり）に保存して、次に読んだとき また出ないように
		for (const id of fixParty(state.party, this.data.benchFirst ?? [])) {
			this.note(benchText(this.data.cast[id]?.name ?? id), true);
			this.autosavePending = true;
		}
		this.fadeEl.style.transition = "none";
		this.fadeEl.style.opacity = "1";
		await this.loadMap(state.mapId, state.x, state.y, state.dir);
		this.last = performance.now();
		cancelAnimationFrame(this.rafId);
		this.rafId = requestAnimationFrame((t) => this.frame(t));
		await this.fadeIn(400);
		this.runEnter();
	}

	stop(): void {
		this.running = false;
		this.notes = [];
		cancelAnimationFrame(this.rafId);
		this.msg.close();
		// エンディングなどで暗転したままタイトルへ戻らないようにする
		this.fadeEl.style.transition = "none";
		this.fadeEl.style.opacity = "0";
		this.field?.dispose();
		this.field = null;
	}

	// ───────────────── マップ ─────────────────

	mapDef(id: string): MapDef {
		const m = this.data.maps[id];
		if (!m) throw new Error(`マップ ${id} がありません`);
		return m;
	}

	private hiddenKey(mapId: string, id: string) {
		return `hide:${mapId}:${id}`;
	}

	private eventActive(mapId: string, e: EventDef): boolean {
		const f = this.state.flags;
		if (e.once && f[`done:${mapId}:${e.id}`]) return false;
		if (f[this.hiddenKey(mapId, e.id)]) return false;
		if (e.when && !e.when(this.state)) return false;
		return true;
	}

	spriteOf(ref: string | undefined): string {
		if (!ref) return "";
		if (ref.startsWith("char:"))
			return this.data.cast[ref.slice(5)]?.walk ?? "";
		return ref;
	}

	private async loadMap(
		mapId: string,
		x: number,
		y: number,
		dir: Dir,
	): Promise<void> {
		const def = this.mapDef(mapId);
		this.field?.dispose();
		const field = new Field(def);
		this.field = field;
		this.state.mapId = mapId;
		this.state.x = x;
		this.state.y = y;
		this.state.dir = dir;
		const leader = this.data.cast[this.state.party[0]?.id ?? "kiriko"];
		this.player = new Actor("player", x, y, dir, leader?.walk ?? "", null);
		this.player.through = false;
		this.trail = [];
		this.gatherAll = false;
		this.followers = this.lineup().map((m) =>
			this.newFollower(m.id, x, y, dir),
		);
		this.refreshActors();
		this.spreadFollowers();
		this.stepPending = false;
		this.path = [];
		this.pathTalk = null;
		this.stepsSinceBattle = 0;
		// 地形と人の画像を先に読む（読めなくても進む）
		const refs = [
			...field.imageRefs(),
			...field.actors.map((a) => a.sprite),
			this.player.sprite,
		];
		await Promise.race([preloadImages(refs.filter(Boolean)), sleep(2500)]);
		if (def.bgm !== undefined) this.audio.bgm(def.bgm);
		this.updateCamera();
		this.toast(def.name);
	}

	/** 隊列に出す仲間（リーダーの後ろ）。ふだんは控えを出さない。 */
	private lineup() {
		const party = this.state.party;
		return (this.gatherAll ? party : activeOf(party)).filter(
			(m) => m !== party[0],
		);
	}

	private newFollower(id: string, x: number, y: number, dir: Dir): Actor {
		const a = new Actor(
			`follower:${id}`,
			x,
			y,
			dir,
			this.data.cast[id]?.walk ?? "",
			null,
		);
		a.through = true;
		a.visible = this.followersShown;
		return a;
	}

	/**
	 * 隊列を仲間の並び（加入・脱退・いれかえ）に合わせる。メニューのいれかえからも呼ぶ。
	 * 隊列のN番目は、いまのN番目の立ち位置（その後ろは足跡の最後尾）に立つ。
	 * だれかが抜けたら後ろの人が詰め（となりなら歩く）、入れかえで入る人は抜けた人の場所から、
	 * 加わる人は最後尾（場所が無ければプレイヤーの位置）から出る。
	 */
	refreshFollowers(): void {
		const old = this.followers;
		const next = this.lineup();
		const spots = old.map((f) => ({ x: f.x, y: f.y, dir: f.dir }));
		// 最後尾の後ろは足跡から（前の人のとなりのときだけ。ワープなどで ずれていたら使わない）
		for (let i = spots.length; i < next.length + 1; i++) {
			const t = this.trail[i];
			const front = spots[i - 1] ?? this.player;
			if (!t || Math.abs(t.x - front.x) + Math.abs(t.y - front.y) !== 1) break;
			spots.push({ ...t });
		}
		this.followers = next.map((m, i) => {
			const spot = spots[i];
			const keep = old.find((f) => f.id === `follower:${m.id}`);
			if (!keep) {
				const at = spot ?? this.player;
				return this.newFollower(m.id, at.x, at.y, at.dir);
			}
			if (spot && (spot.x !== keep.x || spot.y !== keep.y)) {
				const dx = spot.x - keep.x;
				const dy = spot.y - keep.y;
				if (Math.abs(dx) + Math.abs(dy) === 1 && !keep.moving)
					void keep.walk(
						dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up",
						WALK_MS,
					);
				else keep.setPos(spot.x, spot.y);
			}
			return keep;
		});
		// 足跡を新しい立ち位置にそろえる（次の1歩で、みんなが1マスずつ前へ）
		this.trail = spots.slice(0, this.followers.length + 1);
	}

	/** マップに入ったとき、隊列をプレイヤーの後ろへ並べる（通れなければ同じマスに重ねる）。 */
	private spreadFollowers(): void {
		const field = this.field;
		if (!field) return;
		const back = DIR_VEC[OPPOSITE[this.player.dir]];
		let px = this.player.x;
		let py = this.player.y;
		this.trail = [];
		for (const f of this.followers) {
			const nx = px + back.dx;
			const ny = py + back.dy;
			if (field.tileAt(nx, ny).passable && !field.blockerAt(nx, ny)) {
				px = nx;
				py = ny;
			}
			f.setPos(px, py);
			f.dir = this.player.dir;
			this.trail.push({ x: px, y: py, dir: this.player.dir });
		}
	}

	/** イベントの出現状態を反映する（スクリプトの後などに呼ぶ）。 */
	refreshActors(): void {
		const field = this.field;
		if (!field) return;
		const mapId = field.def.id;
		const keep: Actor[] = [];
		for (const e of field.def.events ?? []) {
			const active = this.eventActive(mapId, e);
			const existing = field.actors.find((a) => a.def === e);
			if (active) {
				keep.push(
					existing ??
						new Actor(
							e.id,
							e.x,
							e.y,
							e.dir ?? "down",
							this.spriteOf(e.sprite),
							e,
						),
				);
			}
		}
		field.actors = keep;
	}

	// ───────────────── メインループ ─────────────────

	private frame(t: number): void {
		if (!this.running) return;
		const dt = Math.min(50, t - this.last);
		this.last = t;
		this.time += dt;
		this.state.playMs += dt;
		this.update(dt);
		this.render();
		this.rafId = requestAnimationFrame((tt) => this.frame(tt));
	}

	private get idle(): boolean {
		return this.scriptDepth === 0 && !this.input.busy;
	}

	private update(dt: number): void {
		const field = this.field;
		if (!field) return;
		const wasMoving = this.player.moving;
		this.player.update(dt);
		// プレイヤーが操作で歩いて1マス着いたら、次の1歩を始める前にここで踏むイベント・エンカウントを調べる
		// （歩きの Promise の続きは次のマイクロタスクになるので、押しっぱなしだと先に次のマスへ進んでしまう）
		if (wasMoving && !this.player.moving && this.stepPending) {
			this.stepPending = false;
			this.state.x = this.player.x;
			this.state.y = this.player.y;
			this.state.dir = this.player.dir;
			if (this.scriptDepth === 0) this.afterStep();
		}
		for (const f of this.followers) f.update(dt);
		for (const f of this.followers) f.visible = this.followersShown;
		for (const a of field.actors) {
			a.update(dt);
			if (a.def?.wander && !a.moving && this.scriptDepth === 0) {
				a.wanderWait -= dt;
				if (a.wanderWait <= 0) {
					a.wanderWait = 1200 + Math.random() * 2500;
					const dirs: Dir[] = ["up", "right", "down", "left"];
					const d = dirs[Math.floor(Math.random() * 4)];
					const nx = a.x + DIR_VEC[d].dx;
					const ny = a.y + DIR_VEC[d].dy;
					// 元の位置から2マス以上は離れない
					const home = a.def;
					if (
						Math.abs(nx - home.x) <= 2 &&
						Math.abs(ny - home.y) <= 2 &&
						field.canEnter(nx, ny, a) &&
						!(nx === this.player.x && ny === this.player.y)
					) {
						void a.walk(d, WALK_MS * 1.6);
					} else {
						a.dir = d;
					}
				}
			}
		}
		if (this.idle && !this.player.moving) this.control();
		this.updateCamera();
	}

	private control(): void {
		const field = this.field;
		if (!field) return;
		const key = this.input.takeField();
		if (key === "b") {
			this.path = [];
			void this.runScript(async () => {
				await this.scenes.menu(this);
			});
			return;
		}
		if (key === "a") {
			this.path = [];
			this.talkFront();
			return;
		}
		const held = this.input.heldDir();
		if (held) {
			this.path = [];
			this.pathTalk = null;
			void this.tryStep(held);
			return;
		}
		if (this.path.length) {
			const d = this.path.shift() as Dir;
			const v = DIR_VEC[d];
			if (
				!field.canEnter(this.player.x + v.dx, this.player.y + v.dy, this.player)
			) {
				this.path = [];
				this.pathTalk = null;
				this.player.dir = d;
				return;
			}
			void this.tryStep(d).then(() => {
				// 歩いた先でイベントや戦闘が始まっていたら、話しかけはやめる
				if (!this.idle) {
					this.pathTalk = null;
					return;
				}
				if (!this.path.length && this.pathTalk) {
					const target = this.pathTalk;
					this.pathTalk = null;
					this.faceTo(this.player, target.x, target.y);
					this.talkFront();
				}
			});
			return;
		}
		if (this.pathTalk) {
			const target = this.pathTalk;
			this.pathTalk = null;
			this.faceTo(this.player, target.x, target.y);
			this.talkFront();
		}
	}

	private faceTo(a: Actor, x: number, y: number): void {
		const dx = x - a.x;
		const dy = y - a.y;
		if (dx === 0 && dy === 0) return;
		a.dir =
			Math.abs(dx) > Math.abs(dy)
				? dx > 0
					? "right"
					: "left"
				: dy > 0
					? "down"
					: "up";
	}

	/** プレイヤーを1歩進める（通れなければ向きだけ変える）。 */
	private async tryStep(d: Dir): Promise<void> {
		const field = this.field;
		if (!field) return;
		const v = DIR_VEC[d];
		const nx = this.player.x + v.dx;
		const ny = this.player.y + v.dy;
		this.player.dir = d;
		if (!field.canEnter(nx, ny, this.player)) return;
		// 着いたときの判定は update() が行う（stepPending）
		this.stepPending = true;
		await this.stepPlayer(d, WALK_MS);
	}

	/** 隊列を引き連れて1歩。 */
	private stepPlayer(d: Dir, ms: number): Promise<void> {
		this.trail.unshift({
			x: this.player.x,
			y: this.player.y,
			dir: this.player.dir,
		});
		this.trail.length = Math.min(this.trail.length, this.followers.length + 1);
		this.followers.forEach((f, i) => {
			const spot = this.trail[i];
			if (!spot) return;
			if (spot.x === f.x && spot.y === f.y) return;
			const dx = spot.x - f.x;
			const dy = spot.y - f.y;
			if (Math.abs(dx) + Math.abs(dy) === 1) {
				void f.walk(
					dx > 0 ? "right" : dx < 0 ? "left" : dy > 0 ? "down" : "up",
					ms,
				);
			} else {
				f.setPos(spot.x, spot.y);
			}
		});
		return this.player.walk(d, ms);
	}

	private afterStep(): void {
		const field = this.field;
		if (!field) return;
		const { x, y } = this.player;
		// 踏むイベント
		const touch = field.actors.find(
			(a) => a.def?.trigger === "touch" && a.x === x && a.y === y && a.def.run,
		);
		if (touch?.def) {
			this.path = [];
			this.pathTalk = null;
			void this.runEvent(touch.def);
			return;
		}
		// ランダムエンカウント
		this.stepsSinceBattle++;
		const enc = field.def.encounters;
		if (
			enc?.groups.length &&
			field.tileAt(x, y).encounter &&
			this.stepsSinceBattle > 6 &&
			Math.random() < enc.rate
		) {
			this.path = [];
			this.pathTalk = null;
			const g =
				enc.rare && Math.random() < enc.rare.rate
					? enc.rare.group
					: enc.groups[Math.floor(Math.random() * enc.groups.length)];
			void this.runScript(async (s) => {
				await s.battle(g);
			});
		}
	}

	/** 目の前の人に話しかける（カウンター越しも）。 */
	private talkFront(): void {
		const field = this.field;
		if (!field) return;
		const v = DIR_VEC[this.player.dir];
		let tx = this.player.x + v.dx;
		let ty = this.player.y + v.dy;
		let target = field.actors.find(
			(a) => a.x === tx && a.y === ty && a.def?.trigger === "talk",
		);
		if (!target && field.tileAt(tx, ty).counter) {
			tx += v.dx;
			ty += v.dy;
			target = field.actors.find(
				(a) => a.x === tx && a.y === ty && a.def?.trigger === "talk",
			);
		}
		if (!target?.def?.run) return;
		if (!target.def.fixedDir && !target.still)
			target.dir = OPPOSITE[this.player.dir];
		void this.runEvent(target.def);
	}

	/** x・y は canvas の左上から数えた CSS 画素。 */
	private onTap(x: number, y: number): void {
		const field = this.field;
		if (!field || !this.idle) return;
		const p = this.screen.cssToSource(x, y);
		const tx = Math.floor((p.x + this.camX) / TILE);
		const ty = Math.floor((p.y + this.camY) / TILE);
		if (!field.inBounds(tx, ty)) return;
		const talk = field.actors.find(
			(a) => a.x === tx && a.y === ty && a.def?.trigger === "talk" && a.visible,
		);
		// カウンターの向こうの人をタップしたときは、カウンターの手前まで行く
		let goalX = tx;
		let goalY = ty;
		if (talk) {
			for (const d of ["up", "down", "left", "right"] as Dir[]) {
				const cx = tx + DIR_VEC[d].dx;
				const cy = ty + DIR_VEC[d].dy;
				if (field.tileAt(cx, cy).counter) {
					const bx = cx + DIR_VEC[d].dx;
					const by = cy + DIR_VEC[d].dy;
					if (
						field.canEnter(bx, by, this.player) ||
						(bx === this.player.x && by === this.player.y)
					) {
						goalX = cx;
						goalY = cy;
					}
				}
			}
		}
		if (
			talk &&
			Math.abs(tx - this.player.x) + Math.abs(ty - this.player.y) === 1
		) {
			this.faceTo(this.player, tx, ty);
			this.talkFront();
			return;
		}
		const path = field.findPath(
			this.player.x,
			this.player.y,
			goalX,
			goalY,
			this.player,
		);
		if (!path) return;
		this.path = path;
		this.pathTalk = talk ?? null;
		this.marker = { x: tx, y: ty, t: this.time };
	}

	private updateCamera(): void {
		const field = this.field;
		if (!field) return;
		const { width, height } = this.screen;
		const mw = field.w * TILE;
		const mh = field.h * TILE;
		const cx = this.player.fx * TILE + TILE / 2 - width / 2;
		const cy = this.player.fy * TILE + TILE / 2 - height / 2;
		// 画面下にメッセージ窓・ボタンが重なるので、少し上寄りに見せる
		const bias = Math.min(height * 0.12, TILE * 2);
		/*
		 * いちばん上の段には 出入り口が置かれることがある（町の北口は y=0）。
		 * そこが画面の上ぴったり、あるいは画面の外に出てしまうと、タップで歩いて行けない
		 * （スマホではブラウザのバーのすぐ下にもなる）。半マスぶん 余白をあける。
		 * とくに マップが画面より低いときは、上の bias をそのまま足すと
		 * マップごと上へ押し出されて、いちばん上の段が画面から消えていた
		 */
		const topPad = TILE / 2;
		/** マップが収まるとき、上下に残る余白（片側）。 */
		const slack = Math.max(0, (height - mh) / 2);
		this.camX =
			mw <= width ? (mw - width) / 2 : Math.max(0, Math.min(mw - width, cx));
		this.camY =
			mh <= height
				? // 収まるとき：真ん中から bias だけ上へ寄せる。ただし上の余白は
					// topPad を下回らせず、下がはみ出すほど（余白の合計を超えては）寄せない
					-Math.min(2 * slack, Math.max(topPad, slack - bias))
				: Math.max(-topPad, Math.min(mh - height + bias, cy + bias));
		this.camX = this.screen.snap(this.camX);
		this.camY = this.screen.snap(this.camY);
	}

	private render(): void {
		const ctx = this.screen.begin();
		const field = this.field;
		ctx.fillStyle = field?.def.outside ?? "#000";
		ctx.fillRect(0, 0, this.screen.width, this.screen.height);
		if (!field) return;
		const ox = this.camX;
		const oy = this.camY;
		field.drawBelow(ctx, ox, oy);
		if (this.marker && this.path.length) {
			const a = 0.5 + 0.3 * Math.sin((this.time - this.marker.t) / 120);
			ctx.strokeStyle = `rgba(255,255,255,${a})`;
			ctx.lineWidth = 1;
			ctx.strokeRect(
				this.marker.x * TILE - ox + 1.5,
				this.marker.y * TILE - oy + 1.5,
				TILE - 3,
				TILE - 3,
			);
		}
		const actors = [...field.actors, ...this.followers, this.player].sort(
			(a, b) => a.fy - b.fy,
		);
		for (const a of actors) a.draw(ctx, ox, oy, this.time);
		field.drawAbove(ctx, ox, oy);
	}

	// ───────────────── スクリプト ─────────────────

	private runEnter(): void {
		const def = this.field?.def;
		// 知らせ（古いセーブで控えに回った）があれば、onEnter が無くても出してから自動イベントへ
		if (def?.onEnter || this.notes.length) {
			void this.runScript(async (s) => {
				await def?.onEnter?.(s);
			}).then(() => this.checkAuto());
		} else {
			this.checkAuto();
		}
	}

	/** スクリプトの終わりに出す知らせをためる。hint ならいれかえの案内も（まだなら1回だけ）。 */
	private note(text: string, hint = false): void {
		this.notes.push(text);
		if (hint && !this.state.flags.bench_hint) {
			this.state.flags.bench_hint = true;
			this.notes.push(BENCH_HINT);
		}
	}

	/** 条件を満たした自動イベントを始める。 */
	private checkAuto(): void {
		const field = this.field;
		if (!field || this.scriptDepth > 0) return;
		const auto = field.actors.find(
			(a) => a.def?.trigger === "auto" && a.def.run,
		);
		if (auto?.def) void this.runEvent(auto.def);
	}

	private async runEvent(e: EventDef): Promise<void> {
		const mapId = this.field?.def.id;
		// ほかのスクリプトが動いている間は始めない（二重起動の防止）
		if (!e.run || !mapId || this.scriptDepth > 0) return;
		await this.runScript(async (s) => {
			await e.run?.(s);
			if (e.once) this.state.flags[`done:${mapId}:${e.id}`] = true;
		});
	}

	/** スクリプトを実行する。入れ子（戦闘→勝利後の会話など）にも対応。 */
	async runScript(fn: Script): Promise<void> {
		this.scriptDepth++;
		this.input.clearField();
		try {
			await fn(this.story);
			// いちばん外のスクリプトの終わりに、たまった知らせ（控えに回った・もどった）を出す
			while (this.scriptDepth === 1 && this.notes.length)
				await this.say(null, this.notes.shift() as string);
		} catch (e) {
			if (e instanceof ResetToTitle) {
				this.scriptDepth = 0;
				this.onReset?.();
				return;
			}
			console.error("[script]", e);
		} finally {
			if (this.scriptDepth > 0) this.scriptDepth--;
		}
		if (this.scriptDepth === 0 && this.running) {
			this.msg.close();
			this.refreshActors();
			this.input.clearField();
			// イベントの途中で保存すると続き（仲間加入など）が失われるので、終わってから保存する
			if (this.autosavePending) {
				this.autosavePending = false;
				writeSave(this.state);
			}
			this.checkAuto();
		}
	}

	// ───────────────── 演出 ─────────────────

	async fadeOut(ms = 300, color = "#000"): Promise<void> {
		this.fadeEl.style.background = color;
		this.fadeEl.style.transition = `opacity ${ms}ms linear`;
		await nextFrame();
		this.fadeEl.style.opacity = "1";
		await sleep(ms);
	}

	async fadeIn(ms = 300): Promise<void> {
		this.fadeEl.style.transition = `opacity ${ms}ms linear`;
		await nextFrame();
		this.fadeEl.style.opacity = "0";
		await sleep(ms);
	}

	toast(text: string): void {
		this.toastEl.textContent = text;
		this.toastEl.classList.remove("shown");
		void this.toastEl.offsetWidth;
		this.toastEl.classList.add("shown");
	}

	portraitOf(who: string): PortraitSpec | null {
		const c = this.data.cast[who];
		if (!c?.portrait) return null;
		return {
			id: c.id,
			name: c.name,
			color: c.color,
			...c.portrait,
			side: c.portrait.side ?? "right",
		};
	}

	/** ひとやすみ会話を1つ流し、はじめてならなかよし度を上げる（メニューからも使う）。 */
	async playSkit(skit: SkitDef): Promise<void> {
		this.msg.close();
		await skit.run(this.story);
		const up = markSkitSeen(this.state, skit);
		if (up.length) {
			const names = up.map((id) => this.data.cast[id]?.name ?? id).join("と　");
			this.audio.se("item");
			await this.say(null, `${names}との　なかよし度が　あがった！`);
		}
		this.msg.close();
	}

	/** セリフを出す（ui/battle.ts からも使う）。 */
	say(who: string | null, text: string, opt: SayOptions = {}): Promise<void> {
		const c = who ? this.data.cast[who] : undefined;
		if (who && !c) console.warn(`[say] 未登録のキャラ ${who}`);
		const voice = c?.voice;
		return this.msg.show({
			name: opt.name ?? c?.name ?? (who ? who : undefined),
			color: c?.color,
			text,
			portrait: opt.noPortrait || !who ? null : this.portraitOf(who),
			onShow:
				voice && settings.voice && !opt.noVoice
					? () =>
							this.audio.speak(text, {
								...voice,
								emotion: opt.emotion ?? voice.emotion,
							})
					: undefined,
		});
	}

	private actorFor(target: string): Actor | undefined {
		if (target === "player") return this.player;
		if (target.startsWith("follower:"))
			return this.followers.find((f) => f.id === target);
		return this.field?.actor(target);
	}

	/** Story API（シナリオから使う命令）。 */
	readonly story: Story = this.makeStory();

	private makeStory(): Story {
		const game = this;
		return {
			get state(): GameState {
				return game.state;
			},
			say: (who, text, opt) => this.say(who, text, opt),
			narrate: (text) => this.say(null, text),
			choose: async (options, opt) => {
				const n = await this.choice.choose(options, opt?.cancel, (name) =>
					this.audio.se(name),
				);
				return n;
			},
			wait: (ms) => {
				this.msg.hideWindow();
				return sleep(ms);
			},
			fadeOut: (ms, color) => this.fadeOut(ms, color),
			fadeIn: (ms) => this.fadeIn(ms),
			bgm: (name) => this.audio.bgm(name),
			se: (name) => this.audio.se(name),
			flag: (name) => this.state.flags[name],
			set: (name, value = true) => {
				this.state.flags[name] = value;
			},
			warp: async (mapId, x, y, dir, opt) => {
				const fade = opt?.fade ?? true;
				if (opt?.se) this.audio.se(opt.se);
				this.msg.close();
				if (fade) await this.fadeOut(250);
				await this.loadMap(mapId, x, y, dir ?? this.player.dir);
				this.autosavePending = true;
				if (fade) await this.fadeIn(250);
				const def = this.field?.def;
				if (def?.onEnter) await def.onEnter(this.story);
			},
			move: async (target, route, opt) => {
				const a = this.actorFor(target);
				if (!a) {
					console.warn(`[move] ${target} がいません`);
					return;
				}
				const ms = WALK_MS / (opt?.speed ?? 1);
				const map: Record<string, Dir> = {
					u: "up",
					d: "down",
					l: "left",
					r: "right",
				};
				for (const ch of route) {
					if (ch === "w") {
						await sleep(250);
						continue;
					}
					const face = map[ch.toLowerCase()];
					if (!face) continue;
					if (ch === ch.toUpperCase()) {
						a.dir = face;
						await sleep(120);
						continue;
					}
					const v = DIR_VEC[face];
					const nx = a.x + v.dx;
					const ny = a.y + v.dy;
					if (!opt?.through && this.field && !this.field.canEnter(nx, ny, a)) {
						a.dir = face;
						await sleep(ms);
						continue;
					}
					if (a === this.player) await this.stepPlayer(face, ms);
					else await a.walk(face, ms);
				}
				if (a === this.player) {
					this.state.x = a.x;
					this.state.y = a.y;
					this.state.dir = a.dir;
				}
			},
			face: (target, dir) => {
				const a = this.actorFor(target);
				if (!a) return;
				if (dir === "player") this.faceTo(a, this.player.x, this.player.y);
				else a.dir = dir;
			},
			show: (id) => {
				const mapId = this.field?.def.id ?? "";
				delete this.state.flags[this.hiddenKey(mapId, id)];
				this.refreshActors();
			},
			hide: (id) => {
				const mapId = this.field?.def.id ?? "";
				this.state.flags[this.hiddenKey(mapId, id)] = true;
				this.refreshActors();
			},
			place: (id, x, y, dir) => {
				const a = this.actorFor(id);
				if (!a) return;
				a.setPos(x, y);
				if (dir) a.dir = dir;
			},
			battle: async (groupId, opt) => {
				this.msg.hideWindow();
				const r = await this.scenes.battle(this, groupId, opt ?? {});
				this.stepsSinceBattle = 0;
				return r;
			},
			join: (id, opt) => {
				const party = this.state.party;
				if (party.some((m) => m.id === id)) return;
				const m = newMember(this.data, id, activeOf(party));
				// 次スレ（Part2）では、前の周で育てたレベルのまま加わる（engine/newgame.ts）
				const kept = Number(this.state.flags[`p2_lv_${id}`] ?? 0);
				if (kept > m.lv) {
					m.lv = kept;
					m.exp = expFor(kept);
					healAll(this.data, [m]);
				}
				const full = activeOf(party).length >= MAX_ACTIVE;
				if (opt?.bench || full) m.bench = true;
				// たたかう仲間なら隊列の最後尾、控えなら控えの最後に入る
				party.push(m);
				tidyParty(party);
				if (full && !opt?.bench) {
					console.warn(
						`[join] たたかう仲間が いっぱいなので ${id} を控えに入れた（先に s.bench するか { bench: true }）`,
					);
					this.note(benchText(this.data.cast[id]?.name ?? id), true);
				}
				this.refreshFollowers();
			},
			leave: (id) => {
				const party = this.state.party;
				const gone = party.find((m) => m.id === id);
				if (!gone) return;
				// たたかう仲間が抜けたら、控えの先頭が その隊列の位置に入る
				const next = gone.bench ? undefined : benchOf(party)[0];
				if (next && swapBench(party, id, next.id))
					this.note(backText(this.data.cast[next.id]?.name ?? next.id));
				this.state.party = party.filter((m) => m !== gone);
				this.refreshFollowers();
			},
			bench: (id) => {
				if (toBench(this.state.party, id)) this.refreshFollowers();
				else console.warn(`[bench] ${id} は控えに回せない`);
			},
			unbench: (id) => {
				if (fromBench(this.state.party, id)) this.refreshFollowers();
				else console.warn(`[unbench] ${id} は控えから戻せない`);
			},
			gather: () => {
				this.gatherAll = true;
				this.refreshFollowers();
			},
			give: (id, n = 1) => {
				this.state.items[id] = (this.state.items[id] ?? 0) + n;
			},
			take: (id, n = 1) => {
				const have = this.state.items[id] ?? 0;
				if (have < n) return false;
				if (have === n) delete this.state.items[id];
				else this.state.items[id] = have - n;
				return true;
			},
			has: (id) => this.state.items[id] ?? 0,
			heal: () => healAll(this.data, this.state.party),
			shake: async (ms = 400) => {
				this.msg.hideWindow();
				document.body.classList.add("shake");
				await sleep(ms);
				document.body.classList.remove("shake");
			},
			flash: async (color = "#fff", ms = 200) => {
				this.msg.hideWindow();
				const f = el("div", { class: "flash" });
				f.style.background = color;
				this.ui.appendChild(f);
				await sleep(ms);
				f.remove();
			},
			chapter: (label, title) => this.scenes.chapter(this, label, title),
			saveMenu: async () => {
				await this.say(null, "ここまでの　きろくを　のこしますか？");
				const n = await this.story.choose(["のこす", "やめておく"], {
					cancel: 1,
				});
				if (n === 0) {
					const ok = writeSave(this.state);
					this.audio.se(ok ? "save" : "cancel");
					await this.say(
						null,
						ok
							? "きろくを　のこしました。"
							: "きろくできませんでした……（ブラウザの保存領域が使えないようです）",
					);
				}
			},
			gainExp: async (n) => {
				if (!(n > 0)) return;
				await this.say(null, `${n}ポイントの　けいけんちを　かくとく！`);
				// レベルアップの音は1回だけ（何人も上がると音が重なってうるさい）。控えには入らない
				let leveled = false;
				for (const m of activeOf(this.state.party)) {
					const from = m.lv;
					if (addExp(this.data, m, n) > 0) {
						if (!leveled) this.audio.se("levelup");
						leveled = true;
						await this.say(
							null,
							`${this.data.cast[m.id]?.name ?? m.id}は　レベル${m.lv}に　あがった！`,
						);
						for (const t of learnTexts(this.data, m.id, from, m.lv))
							await this.say(null, t);
					}
				}
			},
			ending: (opt) => this.scenes.ending(this, opt),
			followers: (show) => {
				this.followersShown = show;
				for (const f of this.followers) f.visible = show;
			},
			restTalk: async () => {
				const list = availableSkits(this.data.bonds, this.state);
				if (!list.length) return false;
				await this.say(null, "みんなが　なにか　話したそうだ。");
				const n = await this.story.choose(["ひとやすみ　する", "あとにする"], {
					cancel: 1,
				});
				if (n !== 0) return false;
				await this.playSkit(list[0]);
				return true;
			},
		};
	}
}
