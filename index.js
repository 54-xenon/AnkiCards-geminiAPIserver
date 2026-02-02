import express  from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config({path: '../.env'});
const apiKey = process.env.GEMINI_API_KEY;

// expressの初期化
const app = express();
// 開くポートを指定 
const port = 8080;

// GoogleGenAIの初期化 
const ai = new GoogleGenAI({
    // API keyをここに記述
    apiKey
 });


// 指定のポートで開く
app.listen(port, () => {
    console.log("server running http://localhost:${port} ");
});

// POST -> Flutterアプリからのリクエストを受けて、expample(解説)を生成して返す

// GET -> GeminiAPIの無料枠の残りと、使用しているモデル名とかを返す