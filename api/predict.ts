import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Log version for debugging
  console.log("Vercel Function v1.0.5 executing...");

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { stockCode, userNumber, timestamp, upperOrig, lowerOrig, upperNuc, lowerNuc, upperChg, lowerChg, movingLine } = req.body;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return res.status(500).json({ error: "Server Error: API Key not configured" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Role: You are a master of "Meihua Yishu" (Plum Blossom Divination) and a financial stock market expert.
      
      Task: Interpret the following divination result for a user asking if they will make money buying a specific stock.
      
      Context:
      - Stock Code: ${stockCode}
      - User Number: ${userNumber}
      - Divination Time: ${timestamp}
      
      Hexagrams:
      1. Original Hexagram (本卦): Upper ${upperOrig}, Lower ${lowerOrig}.
      2. Nuclear Hexagram (互卦): Upper ${upperNuc}, Lower ${lowerNuc}.
      3. Changed Hexagram (變卦): Upper ${upperChg}, Lower ${lowerChg}.
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up potential Markdown formatting (```json ... ```)
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse JSON to ensure validity before sending back
    const jsonResponse = JSON.parse(text);
    return res.status(200).json(jsonResponse);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate prediction", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}