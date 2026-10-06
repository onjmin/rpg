# 引き継ぎメモ（2026-10-06・裏シナリオ「避難J」）

次に続ける人（人でも Claude でも）向け。何を足して、何を確かめ、何がまだかを書く。設計の正本は README の「裏シナリオ：避難J（過疎板探検）」。

## 足したもの（このコミット）

| 場所 | 中身 |
|---|---|
| `src/data/maps/hinan.ts` | 新マップ「避難J」。ホームニキ・板猫・勢い欄・ベンチ・看板。>>999 → 1000ゲッター戦 → 1000 → レコード → ルート分岐（もどる／スレをうつす）。避難ルートのエンディング（`moveThread`）と、つづきからの戻し（`afterEnd`） |
| `src/data/maps/server.ts` | 入口 `rack_other`（(17,9)。`dig_hinan` が立っていれば避難Jへ） |
| `src/data/maps/kakolog.ts` | ヒナリーの研究発表に 2本（`dig_hinan` の手がかり・`hinan_1000` のあと） |
| `src/data/battle.ts` | 敵 `getter`（1000ゲッター）、組 `g_hin1`・`g_hin2`・`g_getter`、大事なもの `rec_hinan` |
| `src/data/threadlog.ts` | `MINOR_POSTS` に `home`（洪水の「おかえり」）、`FLAG_DOMAIN` に `hinan_1000`・`m_home`、見出し「避難Jをホームにする」、次スレ >>6、避難ルートのまとめ `hinanSummary` |
| `src/data/maps/thread.ts` | 1000の先の返事 `m_home`、エンディングの一言、輪の中の `end_home`（(9,8)） |
| `src/data/reichat.ts` | レイの雑談 `hinan` |
| `src/data/bgm/hinan.mml`・`src/data/bgm.ts` | 新曲 `hinan`（AI作曲スレ >>17「くもり空をパクったやつ」）。#volume 23 → 17 |
| `src/data/maps/debug.ts` | デバッグルーム左下 `cp9`（ラックの前。`dig_hinan` 済み） |
| `scripts/balance.mjs` | 「避難J」の雑魚と「裏 ゲッター」の行 |
| `README.md` | 「裏シナリオ：避難J（過疎板探検）」の節 |

フラグ：`hinan_1000`（1000まで見た）・`hinan_back`（もどると決めた）・`hinan_end`（避難ルートのエンディングを見た。つづきからで戻すと false に）・`hinan_undo`・`home_trace`・`home_n`・`home_end_n`。`clear` は避難ルートでは立てない（次スレは出ない）。

## 確かめたこと

- `scripts/validate.mjs` と同じ検査を、vite 無しで走らせて **0 errors, 0 warnings**（Node 22 の `module.stripTypeScriptTypes` で .ts を読み、`?raw` と `import.meta.env` だけ差しかえるローダ。Linux の作業環境に TS7 のバイナリも esbuild も無かったため）。手元では ふつうに `pnpm validate` を。
- `pnpm balance` 相当（同じやり方で 1000 回）：避難Jの雑魚は Lv9 HP-19%・Lv10 HP-16%（サーバーの底と同じ帯）。1000ゲッターは Lv9 テトなし 73%・テト入り 88%、Lv10 88%／96%。
- 新曲のラウドネス：公開版（onjmin.github.io/rpg）のページ上で `@onjmin/dtm@2.1.28` を jsdelivr から読み、`createDtmStudio({masterVolume:100})` → `studio.play` に `setVolume(#volume × 0.2)`（既定の BGM 音量 40 と同じ）→ `startWavRecording` で 40 秒 → BS.1770（K特性・400ms ブロック・絶対/相対ゲート）で I。参照の town（#volume=31）が **-24.2** で bgm.ts の表の値と一致。くもり空は #volume=23 で -21.3 → **17 で -23.9**（secret・extra と同じ -24 目標）。ついでに測った候補：鉱石風respect（#volume=50 で -15.6 → -24 なら 19）、Speder2リスペクト（-11.9 → 12）。

## まだのこと（優先順）

1. **手元で `pnpm check && pnpm lint && pnpm validate`**。tsc（TypeScript 7）と biome は作業環境で動かせなかった。型は目で追ったが未検証。
2. **実機で一周**：デバッグルームの `cp9` → ラック → 避難J → >>999 → 1000ゲッター → 分岐の両方。とくに
   - 避難ルートのエンディングのあと「つづきから」で避難Jに戻り、ホームニキで移転を戻せるか（`hinan_end` → false）。
   - 本編に戻ったあとのエンディングの輪で `end_home` (9,8) が ほかと重ならないか、洪水の >>995〜 に「おかえり」が並ぶか。
   - 1000ゲッター戦の `s.battle("g_getter")` は負けると ふつうの「もういちど／タイトルへ」。寄り道なので canLose にしていない。
3. **ホームニキの歩行グラ**：いまは「風吹けば名無し」（`SPR.j_nanashi`。ボイスニキと同じ）を使い回し。rpgen-search で探して差しかえる：`GET https://rpgen-search.pages.dev/api/rpgen/sprite-anims?q=<前方一致>&limit=60`（`Authorization: Bearer <unj-reze の NEXT_PUBLIC_RPGEN_SEARCH_TOKEN>`）。見つけた `id` を `hinan.ts` の `npc("home", 12, 4, SPR.j_nanashi, …)` に。`sprites.ts` に名前を足すなら `home:` あたり。
4. **曲の聞きくらべ**：くもり空は曲名と作り（retro_game・simple・4トラック・t116）で選んだ。聞いて合わなければ 鉱石風（#volume=19）か Speder2（#volume=12）に差しかえられる（上の実測値）。
5. **roguelike の `STORY.md`**（シリーズの正本）に、1作目の裏シナリオとして 避難J・ホームニキ・「板の時間は外とちがう」を 1行 足すか検討。1の正史は動かしていない（本編の流れ・1000・次スレは そのまま。避難ルートは任意で、戻せる）。

## 決めたこと・やめたこと

- 元ネタは おんJwiki「過疎板探検」（約900の専門板のほとんどが無人・最後のレスが1000日前・人が増えると信じてレスし続けた開拓者）と、倉庫の発掘ログ「避難Jを立てたで」の >>2。
- 「おんJ発の他のボカロ（親音ハハ・雲地アル・優音アイ・解音ゼロ・革命シヨ など）を掘り下げる」案は、作者の判断で **やめて避難Jに戻した**。親音ハハは名前を出さず、勢い欄2番目「（スレ主が消した）」とホームニキの一言（「ロゼにあこがれた子が立てて、自分で消した。消したのも、その子の安価や」）にとどめ、キリコは蓄音しない。
- 避難ルートは「別の完走」ではなく **戻れる寄り道**にした（`clear` を立てない。「ここの時間は外とちがう。むこうは、まだ同じ夜や」）。次スレの時間遡行と同じ理屈。
- まとめカードの行をふやさないため、避難Jは見出し（「避難Jをホームにする」）で拾う（1セクション10行の上限）。
