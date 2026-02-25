# IPAプロジェクトデータ収集 & リサーチ

指定された年度・プログラムのIPAプロジェクトデータを自動収集し、各クリエーターのGitHub/ポートフォリオ等の外部リンクをリサーチして補完する。

## 引数

$ARGUMENTS

引数は以下の形式で指定:
- `--year 2025 --program it` — 年度とプログラム（it / advanced）
- `--period first` — advanced の場合の期（first / second）、省略時は first
- `--demo-day <URL>` — Demo Day リンクのパッチのみ実行（スクレイプ済みJSON必須）

## 出力ファイル

ファイルは `src/data/projects/` に以下の命名規則で保存される:
- IT: `{year}-it.json`
- Advanced: `{year}-advanced-{period}.json`（例: `2024-advanced-first.json`）

`src/data/projects.ts` は `scripts/generate-project-index.mjs` で自動生成される。新しいJSONファイルを追加した後は `npm run gen:projects` を実行してインデックスを再生成すること（`npm run build` / `npm run dev` 実行時にも自動で走る）。

## フロー

### Phase 1: IPAスクレイピング

`scripts/scrape-projects.ts` を実行してIPAのWebページからプロジェクトデータを収集する。

```bash
npx tsx scripts/scrape-projects.ts $ARGUMENTS
```

実行結果を確認し、取得件数が0件やエラーがあれば報告して停止する。

新しいファイルが追加された場合、インデックスを再生成する:

```bash
npm run gen:projects
```

### Phase 2: クリエーターリサーチ

出力された JSON ファイルを読み込み、Phase 1 で収集した全プロジェクトについて、各クリエーターの外部リンクを検索する。

#### データモデル

リンクは2種類ある:

- **プロジェクトリンク** (`project.links: string[]`): IPA詳細ページ、プロダクトLP、プロジェクトのGitHubリポジトリ、YouTube動画など。プロジェクトに1つ。
- **クリエーターリンク** (`creator.links?: string[]`): 個人のGitHubプロフィール、X/Twitter、ポートフォリオサイト、Zenn、Qiitaなど。メンバーごとに異なる。

リンクのラベルやスタイルはURL文字列から `src/utils/linkMeta.ts` が自動判定する（IPA / YouTube / GitHub / PDF / X / Web）。

#### 検索手順

各クリエーターについて以下の手順でリサーチする:

1. **Web検索**: 以下のクエリを順に試す（ヒットしたら次のクリエーターへ）
   - `"{クリエーター名}" {所属} GitHub`
   - `"{クリエーター名}" {プロジェクトタイトルのキーワード} GitHub OR ポートフォリオ`
   - `"{クリエーター名}" site:github.com`
   - `"{クリエーター名}" site:x.com OR site:twitter.com`
   - `{クリエーター名のローマ字推定} {所属の英語名} GitHub`

2. **本人確認**: 検索でヒットしたページについて、以下を確認する
   - 所属（大学・企業）が一致するか
   - プロジェクト内容や技術領域が一致するか
   - 未踏やIPAへの言及があるか
   - 確信度が低い場合はスキップする（誤リンクより無い方がマシ）

3. **JSON更新**: 本人と確認できたリンクをそのクリエーターの `links` 配列に追加する
   - 例: `{ "name": "山田太郎", "affiliation": "東京大学", "links": ["https://github.com/yamada", "https://x.com/yamada"] }`
   - プロダクトのリポジトリやLP（個人ではなくプロジェクト単位のもの）は `project.links` に追加する

### Phase 3: 結果レポート

全プロジェクトのリサーチ完了後、以下を報告する:

- リンクを追加できたクリエーター数 / 全クリエーター数
- 追加したリンクの一覧（ID、クリエーター名、追加URL）
- 見つからなかったクリエーターの一覧

### Phase 4: ビルド確認

```bash
npm run build
```

ビルドが通ることを確認する。

## 注意事項

- リサーチは1プロジェクトずつ順番に行う。並列エージェントでの検索は使わない（レート制限回避）
- 確信が持てないリンクは追加しない。誤った人物のリンクを追加するのは最悪の結果
- 既にクリエーターの `links` にURLが入っている場合は重複追加しない
- JSONファイルの書き込みは Edit ツールで該当クリエーターの `links` 部分だけ更新する
- プロジェクトレベルの `links` (IPA, YouTube, プロダクトLP等) とクリエーターレベルの `links` (個人GitHub, X, ポートフォリオ等) を混同しないこと
