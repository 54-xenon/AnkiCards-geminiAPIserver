# AnkiCards-geminiAPIserver

Flutter から **question / answer** を送信し、
サーバー側（Express + Gemini API）が **学習用の解説（example）** を生成して返す Web API です。

個人開発の学習アプリ（AnkiCards 想定）向けに、
**シンプル・安全・拡張しやすい構成**を目指しています。

---

## 構成概要

```
Flutter
  ↓ POST(JSON)
Express Web API
  ↓ Gemini API
Express Web API
  ↓ JSON
Flutter
```

* Gemini API キーは **サーバー側のみで管理**
* Flutter 側は HTTP リクエストを送るだけ
* Gemini の生レスポンスは返さず、使いやすい JSON に整形

---

## 使用技術

* Node.js
* Express
* Google Gemini API（@google/genai）
* dotenv

---

## ディレクトリ構成

```
project/
├── index.js
├── .env
├── package.json
└── README.md
```

※ 今回は機能がシンプルなため **1ファイル構成**

---

## 事前準備

### 1. Node.js

```
node -v
```

* v18 以上推奨

---

### 2. Gemini API キー取得

Google AI Studio から API キーを取得し、`.env` に設定。

```
GEMINI_API_KEY=your_api_key_here
```

⚠️ APIキーは **GitHubにコミットされていないことを確認**

---

## インストール

```
npm install express @google/genai dotenv
```

---

## サーバー起動

```
node index.js
```

起動すると以下が表示されます。

```
server running 繋がったよ: http://localhost:8080
```

---

## API 仕様

### エンドポイント

```
POST /api/gemini/example
```

---

### リクエスト（JSON）

```json
{
  "question": "HTTPのGETとPOSTの違いは？",
  "answer": "GETは取得、POSTは送信"
}
```

---

### レスポンス（成功時）

```json
{
  "example": "GETは主にデータの取得に使われ、URLにパラメータを含めて送信します。一方POSTはリクエストボディにデータを含めて送信するため、ログイン処理などで利用されます。"
}
```

---

### エラーレスポンス例

#### 400 Bad Request

```json
{
  "message": "question and answer are required"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Gemini API error"
}
```

---

## curl での動作確認

```
curl -X POST http://localhost:8080/api/gemini/example \
  -H "Content-Type: application/json" \
  -d '{
    "question": "HTTPとは何か",
    "answer": "通信の仕組み"
  }'
```

---

## Gemini に渡しているプロンプト設計

サーバー側で以下の形式のプロンプトを生成しています。

* 初学者向け
* 日本語
* 5〜8文
* 箇条書き禁止
* 解説文のみ出力

これにより、Flutter 側で整形処理を行う必要がありません。

---

## 実装上のポイント

* `express.json()` を必ず使用（POST JSON 対応）
* API キーは環境変数で管理
* レスポンスは Flutter でそのまま使える形に整形
* 1ファイル構成だが、将来 service / route に分割可能

---

## 今後の拡張案

* 解説レベル指定（beginner / intermediate）
* 英語対応
* 解説文の文字数制限
* 履歴を DB（Isar 等）に保存
* ストリーミング対応

---

## 想定用途
フラッシュカードアプリ(AnkiCards)での、解説の生成を主に想定している。
* 学習用フラッシュカードアプリ
* 問題＋答えからの自動解説生成
* 個人開発 / ポートフォリオ用途
