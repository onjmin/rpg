// 設定（端末ごとに localStorage へ保存）。

const KEY = "kiriko-rpg/settings";

export type Settings = {
	/** BGM と効果音をまとめて消す（画面右上のボタン）。 */
	mute: boolean;
	/** セリフの読み上げ（初回に約45MBのデータを取得する）。既定 OFF。 */
	voice: boolean;
	/** BGM の鳴らし方。hq = SoundFont（楽器の音色つき）/ light = 内蔵シンセ / off。 */
	bgm: "hq" | "light" | "off";
	/** 0-100 */
	bgmVolume: number;
	seVolume: number;
	voiceVolume: number;
	/** 1文字あたりの表示時間（ms）。0 で一瞬。 */
	textMs: number;
	/** 画面の十字キーを出す（タップ移動だけで遊ぶ人は消せる）。 */
	pad: boolean;
	/** 戦闘で仲間を「おまかせ」にする。 */
	autoAllies: boolean;
};

const DEFAULTS: Settings = {
	mute: false,
	voice: false,
	bgm: "hq",
	bgmVolume: 40,
	seVolume: 60,
	voiceVolume: 80,
	textMs: 12,
	pad: true,
	autoAllies: true,
};

/**
 * 既定値を変えたときに上げる。v3 より古い保存値は音量を、v4 より古くて文字の速さが
 * 前の「ふつう」（28）のままなら文字の速さを、v5 より古くて文字の速さが
 * 前の「ふつう」（18）のままなら文字の速さを、新しい既定値に戻す。
 */
const VERSION = 5;

const load = (): Settings => {
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const saved = JSON.parse(raw) as Partial<Settings> & { v?: number };
			if ((saved.v ?? 1) < VERSION) {
				delete saved.bgmVolume;
				delete saved.seVolume;
				delete saved.voiceVolume;
			}
			if ((saved.v ?? 1) < 5 && saved.textMs !== undefined) {
				// 旧スケールの値を新スケールへ丸める（45→28、18→12、12→7）
				const map: Record<number, number> = { 45: 28, 28: 28, 18: 12, 12: 7 };
				saved.textMs = map[saved.textMs] ?? saved.textMs;
			}
			return { ...DEFAULTS, ...saved };
		}
	} catch {
		// 壊れていたら既定値
	}
	return { ...DEFAULTS };
};

export const settings: Settings = load();

const listeners = new Set<() => void>();

export const onSettingsChange = (fn: () => void): (() => void) => {
	listeners.add(fn);
	return () => listeners.delete(fn);
};

export const saveSettings = (patch: Partial<Settings>): void => {
	Object.assign(settings, patch);
	try {
		localStorage.setItem(KEY, JSON.stringify({ ...settings, v: VERSION }));
	} catch {
		// プライベートモード等で保存できなくても遊べる
	}
	for (const fn of listeners) fn();
};
