# 蓄音キリコの大冒険

おんJ（おーぷん2ちゃんねる なんでも実況J）発の UTAU 音源「蓄音キリコ」が主人公の、スマホでサクッと遊べる RPG です。

- 遊ぶ: https://onjmin.github.io/rpg/
- 操作: 画面の十字キーと A/B（B でメニュー）、または行きたい場所・話したい人をタップ。PC はキーボード（矢印/WASD・Z/Enter・X/Esc）。
- 右上の 🔊 で BGM・効果音をまとめてミュートできます。
- セリフの読み上げ（ボイス）は既定で OFF です。メニューの「せってい」→「ボイス」で ON にできます（初回に約45MBのデータを取得します）。

## 立ち絵の差し替え

キリコ・ロゼ・フェリス・テト・足立レイの5人は、描き下ろしの立ち絵が入っています（表情差分なし・1枚絵）。
差し替えるときは、透過 PNG を次の名前で `public/portraits/` に置けば、そのまま表示されます。ファイルが無いキャラはダミー（キャラ色のシルエット）になります。

| キャラ | ファイル | ふだんの立ち位置 |
|---|---|---|
| キリコ | `public/portraits/kiriko.png` | 左 |
| ロゼ | `public/portraits/roze.png` | 右 |
| テト | `public/portraits/teto.png` | 右 |
| フェリス | `public/portraits/feris.png` | 右 |
| 足立レイ | `public/portraits/rei.png` | 右 |

**全員「右向き」（画面の右側を見る向き）で描いてください。** あとは自動で調整します。

- 向き: 右側に立つときは自動で左右反転して、画面の中央を向きます（左右非対称の髪型や文字も反転します）。
- 大きさ: 透明な余白は自動で切り詰めます。キャンバスの大きさや余白はバラバラで構いません。**全身絵で描いてください**。会話では上から約6割（頭〜腰）を切り出して大きく見せます（`src/data/cast.ts` の `portrait.crop` でキャラごとに変更可。1 で全身）。
- 立ち位置: ふだんの側がほかの話し手でふさがっているとき（ロゼとテトが話す場面など）は、空いている側へ自動で回ります。

反転させたくないキャラは、左向きで描いて `src/data/cast.ts` の `portrait` に `facing: "left"` を足してください（右側に立つときはそのまま、左側に立つときに反転します）。ほかのキャラに立ち絵を足すのも同じ場所です。

## 開発

```bash
pnpm install
pnpm dev
```

- `pnpm build` … 型チェックして `build/` に出力（`GITHUB_PAGES=true` で `/rpg/` 配下向け）
- `pnpm lint` … Biome
- `pnpm validate` … ゲームデータの検証（マップの形・ワープ先・話し手・戦闘グループ・セリフの長さなど。イベントを空の Story で走らせて調べる）
- `node scripts/make-sprites.mjs` … 素材が無かったドット絵（ムッジェ・ボツキリコ・蓄音機）を作り直す
- 開発中は URL でタイトルを飛ばして好きな場所から始められます（`pnpm dev` のときだけ）:
  `http://localhost:5173/?map=town&x=11&y=16&flags={"p_tut":true}&party=kiriko,nanj&lv=5`
- main に push すると GitHub Actions（`.github/workflows/gh-pages.yml`）が `gh-pages` ブランチへデプロイします。リポジトリの Settings → Pages で「Deploy from a branch: gh-pages」を選んでください。

### 構成

- `src/engine/` … エンジン（画面・入力・マップ・イベント実行・音・セーブ）
- `src/ui/` … メッセージ窓・立ち絵・メニュー・戦闘・タイトル・エンディング
- `src/data/` … ゲームの中身（キャラ・マップ・シナリオ・敵・BGM・効果音）
  - マップとイベントは `src/data/maps/*.ts`。シナリオは `async (s) => { await s.say("kiriko", "……") }` の形で書きます（使える命令は `src/engine/defs.ts` の `Story`）。
  - マップチップは unj-reze と同じ同梱シート（`public/assets/rpg-reze/Base.png`・`field.png`、`public/assets/rpgen/map.png`）から切り出しています。
  - キャラ・敵の歩行グラと効果音は、unj-reze の GameMaker と同じく RPGEN（rpgen-search）の素材を id で直リンクしています。

## クレジット

- 蓄音キリコ © おーぷん2ちゃんねる有志（音声: 野良 / キャラクター: 釣りンゴ / ロゴ: ロゴ太郎） https://suzuhete.wixsite.com/home
- 束音ロゼ（音声: 面倒ミル / キャラクター: wQ8G） https://tabaneroze.ninja-web.net/
- 重音テト © 線・小山乃舞世／TWINDRILL https://kasaneteto.jp/
- 足立レイ © Mechanical Girl https://mechanicalgirl.jp/
- フェリス・おんJ民（やきう民）: なんJ・おんJ のみんな
- 歩行グラ・マップチップ・効果音: RPGEN の素材（rpgen-search） / キリコの歩行グラ: https://i.imgur.com/hNXnQHv.png
- 音楽・音声合成: [@onjmin/dtm](https://github.com/onjmin/dtm)・koe UtauTTS
- HTS voice tohoku-f01 © 2015 Intelligent Communication Network (Ito-Nose) Laboratory, Tohoku University（CC BY 4.0）
- フォント: DotGothic16（SIL Open Font License）

このゲームは非営利のファンゲームです。各キャラクター・音源の利用規約に従っています。
