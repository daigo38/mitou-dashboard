# 未踏プロジェクトダッシュボード

IPA 未踏事業（未踏IT人材発掘・育成事業 / 未踏アドバンスト事業）のプロジェクトを一覧・検索できるダッシュボードです。

## 機能

- 年度・事業区分（IT / アドバンスト）・PM によるフィルタリング
- プロジェクト名・クリエイター名・概要のフリーテキスト検索
- プロジェクト詳細ページ（提案書・成果報告書・デモ動画等へのリンク）
- フィルター状態の自動保存（sessionStorage）

## 技術スタック

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [Tailwind CSS](https://tailwindcss.com) 4
- TypeScript

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 で開きます。

## データの更新

プロジェクトデータは `src/data/projects/` に年度・事業区分ごとの JSON ファイルとして格納されています。

```bash
# IPA サイトからスクレイピング
npx tsx scripts/scrape-projects.ts

# JSON からインデックスファイルを再生成
npm run gen:projects
```

## 情報の修正・お問い合わせ

データの誤りや追加情報がある場合は [Issue](https://github.com/daigo38/mitou-dashboard/issues) または Pull Request でお知らせください。
