import { onRequest } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";

// Firebase Cloud Function
// Accesses API_KEY from process.env (set via functions/.env file or Cloud Console)
export const predict = onRequest({ cors: true, region: "us-central1" }, async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send({ error: 'Method not allowed' });
    return;
  }

  try {
    const { 
      stockCode, 
      userNumber, 
      timestamp, 
      original, 
      nuclear, 
      changed, 
      movingLine 
    } = request.body;

    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error("API Key missing in environment variables.");
      response.status(500).send({ error: 'Server configuration error' });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Role: You are a master of "Meihua Yishu" (Plum Blossom Divination) and a financial stock market expert.
      
      Task: Interpret the following divination result for a user asking if they will make money buying a specific stock.
      
      Context:
      - Stock Code: ${stockCode}
      - User Number: ${userNumber}
      - Divination Time: ${timestamp}
      
      Hexagrams:
      1. Original Hexagram (本卦): Upper ${original.upper} (${original.upperNature}), Lower ${original.lower} (${original.lowerNature}).
      2. Nuclear Hexagram (互卦): Upper ${nuclear.upper} (${nuclear.upperNature}), Lower ${nuclear.lower} (${nuclear.lowerNature}).
      3. Changed Hexagram (變卦): Upper ${changed.upper} (${changed.upperNature}), Lower ${changed.lower} (${changed.lowerNature}).
      4. Moving Line (動爻): Line ${movingLine}.

      Requirements:
      Please provide the response in a valid JSON format WITHOUT markdown code blocks. 
      The primary language MUST be Traditional Chinese (Taiwan usage).
      
      The JSON structure must be:
      {
        "originalText": "本卦的卦辭與解釋 (Chinese).",
        "movingLineText": "動爻的爻辭與解釋 (Chinese).",
        "nuclearText": "互卦的含義簡述 (Chinese).",
        "changedText": "變卦的含義簡述 (Chinese).",
        "prediction": "綜合財務分析與預測。使用者會獲利嗎？趨勢如何？請結合五行生剋（體用關係）進行詳細分析 (Chinese).",
        "predictionEnglish": "A full translation of the prediction field into English."
      }
      
      Note: 
      1. Use Traditional Chinese for all fields except 'predictionEnglish'.
      2. Ensure the 'prediction' uses the relationships between the Element (Wu Xing) of the Trigrams (Self/Ti vs Object/Yong) to determine the outcome.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");

    response.set('Content-Type', 'application/json');
    response.status(200).send(text);

  } catch (error) {
    console.error("API Error:", error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});
