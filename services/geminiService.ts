import { GoogleGenAI } from "@google/genai";
import { DivinationResult, AIAnalysisResult } from "../types";
import { getTrigramName } from "../constants";

export const interpretDivination = async (result: DivinationResult): Promise<AIAnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const upperOrig = getTrigramName(result.original.upperId);
  const lowerOrig = getTrigramName(result.original.lowerId);
  const upperNuc = getTrigramName(result.nuclear.upperId);
  const lowerNuc = getTrigramName(result.nuclear.lowerId);
  const upperChg = getTrigramName(result.changed.upperId);
  const lowerChg = getTrigramName(result.changed.lowerId);

  const prompt = `
    Role: You are a master of "Meihua Yishu" (Plum Blossom Divination) and a financial stock market expert.
    
    Task: Interpret the following divination result for a user asking if they will make money buying a specific stock.
    
    Context:
    - Stock Code: ${result.stockCode}
    - User Number: ${result.userNumber}
    - Divination Time: ${result.timestamp.toLocaleString()}
    
    Hexagrams:
    1. Original Hexagram (本卦): Upper ${upperOrig}, Lower ${lowerOrig}.
    2. Nuclear Hexagram (互卦): Upper ${upperNuc}, Lower ${lowerNuc}.
    3. Changed Hexagram (變卦): Upper ${upperChg}, Lower ${lowerChg}.
    4. Moving Line (動爻): Line ${result.movingLine}.

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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      originalText: "無法讀取資料。",
      movingLineText: "無法讀取資料。",
      nuclearText: "無法讀取資料。",
      changedText: "無法讀取資料。",
      prediction: "無法產生預測，請檢查您的網路連線或 API 金鑰。",
      predictionEnglish: "Failed to generate prediction. Please check your network connection or API Key."
    };
  }
};