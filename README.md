# ちばらきAIコミュニティ 公式サイト

松戸・柏・我孫子・取手・土浦・北千住エリアを対象とした「ちばらきAIコミュニティ」の公式Webサイトです。

## 構成

| ファイル | 内容 |
|---|---|
| `index.html` | トップページ（LP）。コンセプト・活動内容・料金・入会フロー・FAQ |
| `thanks.html` | Stripe決済完了後のリダイレクト先。Discord招待リンクを案内 |
| `tokushoho.html` | 特定商取引法に基づく表記（有料サブスクに必須） |
| `style.css` | 共通スタイル（ブランドカラー：ブルー→グリーンのグラデーション） |
| `assets/logo.svg` | ロゴ（コミュニティアイコンをSVGで再現） |
| `docs/discord-setup-plan.md` | Discordロール設計・Stripe連携の設定計画書 |
| `docs/launch-plan.md` | 価格設計・初期集客・導線設計の立ち上げ計画書 |
| `.github/workflows/static.yml` | GitHub Pagesへの自動デプロイ（mainブランチ） |

## 公開前にやること（TODOの差し替え）

HTML内に `TODO` コメント付きのプレースホルダーURLがあります。以下を実物に差し替えてください。

1. **LINE公式アカウントURL**（`https://lin.ee/XXXXXXX`）— `index.html` 内3箇所
2. **Stripe Payment Link**（`https://buy.stripe.com/XXXXXXXX`）— `index.html` 内2箇所
   - Stripeで月額3,000円のサブスクリプション商品を作成し、Payment Linkを発行
   - 決済完了後のリダイレクト先を公開後の `thanks.html` のURLに設定
3. **Discord招待リンク**（`https://discord.gg/XXXXXXX`）— `thanks.html` 内1箇所
   - 無期限・使用回数無制限で発行したものを使用
4. **ThreadsアカウントURL** — `index.html` フッター
5. **特商法表記**（`tokushoho.html`）— 事業者情報を記入
6. **ロゴ画像** — 手元にオリジナルのアイコン画像（PNG）があれば `assets/` に追加し、差し替え可能

## 公開方法

GitHub Pagesで公開します。リポジトリの Settings → Pages → Source を「GitHub Actions」に設定すると、mainブランチへのpushで自動デプロイされます。

## 入会フロー（サイトが担う導線）

```
Threads → LINE登録 → 無料イベント → 本サイト料金ページ
  → Stripe決済 → thanks.html → Discord参加 → 会員ロール付与
```

詳細は `docs/` 配下の計画書を参照してください。
