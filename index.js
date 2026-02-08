import express from "express";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

// expressの初期化
const app = express();
// expressがjson形式のデータを扱えるようにするための宣言
app.use(express.json());
// 開くポートを指定 
const port = 8080;

// GoogleGenAIの初期化 
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// 指定のポートで開く
app.listen(port, () => {
    console.log(`server running 繋がったよ:http://localhost:${port}`);
});

// POST -> geminiでexampleを生成する
app.post('/api/gemini/example', async (req, res) => {
    // 定数を使って、exampleとanswerを取得する -> reqのURLのから探す
    const { question, answer } = req.body;

    // exampleとanswerが空 -> messageをjson形式で返す
    if (!question || !answer) {
        // ステータスコード400で、json形式にしたテキストをレスポンスとして返す
        return res.status(400).json({
            message: "quesiton and answer are required",
        });
    }

    // try-catchでGeminiAPIに情報(example, answer)を渡して処理を行う
    try {
        // 実際にGeminiに食わせる文章を格納する定数 -> 一回入れると買えないから定数でいい
        const prompt = buildPrompt(question, answer);
        // respose -> Geminiの使用するモデルとさっきのプロンプトを渡している
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // respose -> json形式でexampleをレスポンスとして返す
        res.status(200).json({
            // .textで文字列に変換？している
            example: response.text
        });
    } catch (e) {
        // 一応コンソールにもエラー出力
        console.log("erroe messeage: " + e);
        // respose -> 
        res.json({
            error: 'Gemini API error',
            errorCode: e,
        });
    }

})


// プロンプト作成メソッド
    /* 
        フラッシュカードの解説で最適な文章が作成できるように、条件とかを定めておく
    */
function buildPrompt(question, answer) {
    return `
あなたは学習用フラッシュカードの解説を作るアシスタントです。

【問題】
${question}

【答え】
${answer}

条件：
- 初学者にも分かる日本語
- 3〜5文程度
- 箇条書きは禁止
- 余計な前置きや結論は書かない
- 解説文のみを出力する
`;
}





// GET -> Geminiの使ってるモデルとか、webAPIの状態を返す
