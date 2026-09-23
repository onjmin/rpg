// 起動：画面・入力・音・ゲームを組み立て、タイトル → 本編 → タイトル… を回す。

import "./style.css";
import { data } from "./data";
import { GameAudio } from "./engine/audio";
import type { GameState } from "./engine/defs";
import { Game } from "./engine/game";
import { Input } from "./engine/input";
import { expFor, healAll, newMember } from "./engine/party";
import { Screen } from "./engine/screen";
import { runBattle } from "./ui/battle";
import { mountHud } from "./ui/hud";
import { fieldMenu } from "./ui/menu";
import { chapterCard, endingRoll } from "./ui/scenes";
import { showTitle } from "./ui/title";

const app = document.getElementById("app");
if (!app) throw new Error("#app がありません");

const screen = new Screen(app);
const ui = document.createElement("div");
ui.id = "ui";
app.appendChild(ui);

const input = new Input();
input.bindField(screen.canvas);
const audio = new GameAudio(data.bgm, data.sfx);
input.onAnyInput = () => {
	const first = !audio.unlocked;
	audio.unlock();
	if (first)
		audio.preloadSe([
			"cursor",
			"decide",
			"cancel",
			"enemyDown",
			"door",
			"attack",
			"damage",
			"encounter",
		]);
};

const hud = mountHud(app, input);
const game = new Game(data, screen, input, audio, ui);
// 開発用：コンソールから game を触れるようにする（pnpm dev のときだけ）
if (import.meta.env.DEV) (window as unknown as { __game: Game }).__game = game;

game.scenes = {
	battle: runBattle,
	menu: fieldMenu,
	chapter: chapterCard,
	ending: endingRoll,
};

// 会話・メニュー中は十字キーと A/B を隠す（タップでどこでも送れる）
const syncHud = () => {
	hud.classList.toggle("modal", input.busy);
	requestAnimationFrame(syncHud);
};
syncHud();

// iOS Safari の拡大ジェスチャ・長押しメニューを止める
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("contextmenu", (e) => e.preventDefault());

/**
 * 開発用：URL でタイトルを飛ばして好きな場所から始める（pnpm dev のときだけ）。
 * 例 `?map=town&x=11&y=16&dir=up&flags={"p_tut":true}&party=kiriko,nanj&lv=5`
 * `&bench=nanj` でその仲間を控えにして始める。
 */
const devStart = (): GameState | null => {
	if (!import.meta.env.DEV) return null;
	const q = new URLSearchParams(location.search);
	const map = q.get("map");
	if (!map) return null;
	const st = game.newState();
	st.mapId = map;
	st.x = Number(q.get("x") ?? st.x);
	st.y = Number(q.get("y") ?? st.y);
	st.dir = (q.get("dir") as GameState["dir"]) ?? st.dir;
	try {
		Object.assign(st.flags, JSON.parse(q.get("flags") ?? "{}"));
	} catch {
		console.warn("[dev] flags の JSON が読めません");
	}
	const party = q.get("party");
	if (party) {
		st.party = [];
		for (const id of party.split(","))
			st.party.push(newMember(data, id, st.party));
	}
	const lv = Number(q.get("lv") ?? 0);
	if (lv > 1) {
		for (const m of st.party) {
			m.lv = lv;
			m.exp = expFor(lv);
		}
		healAll(data, st.party);
	}
	// 控えにする仲間（bench=nanj,teto）。無ければ たたかう仲間の多すぎる分を start が控えに回す
	for (const id of q.get("bench")?.split(",") ?? []) {
		const m = st.party.find((x) => x.id === id);
		if (m && m !== st.party[0]) m.bench = true;
	}
	return st;
};

const loop = async () => {
	let first = devStart();
	for (;;) {
		hud.classList.add("hidden");
		const state = first ?? (await showTitle(game));
		first = null;
		hud.classList.remove("hidden");
		await new Promise<void>((resolve) => {
			game.onReset = () => {
				game.stop();
				resolve();
			};
			void game.start(state);
		});
	}
};

void loop();
