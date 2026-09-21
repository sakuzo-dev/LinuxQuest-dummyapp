# LinuxQuest-dummyapp

Node.js環境の動作テスト・ネットワーク導通・API動作検証用のシンプルかつモダンなWebアプリケーションです。

---

## 🎯 概要・機能

1. **プロジェクト基盤の構築**
   - `package.json`: Express等の依存パッケージ構成および各種スクリプトを定義
2. **バックエンドサーバーの実装**
   - `server.js`:
     - システムステータス（稼働時間、Node.jsバージョン、メモリ等）取得API (`/api/health`)
     - POST/GETデータの送受信テスト用 Echo API (`/api/echo`)
     - 指定HTTPステータスコード & 遅延時間のテストAPI (`/api/status/:code`)
3. **モダンWeb UIの実装**
   - `public/index.html`: ダッシュボードレイアウト
   - `public/style.css`: ダークモード対応・モダンデザインスタイリング
   - `public/app.js`: ステータス更新 & インタラクティブAPIテストスクリプト

---

## 💡 起動・使用方法

ローカルマシンで起動する場合は以下のコマンドを実行してください。

```bash
# 依存関係のインストール (初回のみ)
npm install

# サーバー起動 (ポート 3000)
npm start
```

ブラウザで `http://localhost:3000` にアクセスすると、動作確認ダッシュボードをご利用いただけます。
