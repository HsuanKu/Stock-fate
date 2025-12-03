import { DivinationResult, AIAnalysisResult } from "../types";
import { getTrigramName } from "../constants";

export const interpretDivination = async (result: DivinationResult): Promise<AIAnalysisResult> => {
  
  // Prepare data to send to the backend Vercel function
  const payload = {
    stockCode: result.stockCode,
    userNumber: result.userNumber,
    timestamp: result.timestamp.toLocaleString(),
    movingLine: result.movingLine,
    upperOrig: getTrigramName(result.original.upperId),
    lowerOrig: getTrigramName(result.original.lowerId),
    upperNuc: getTrigramName(result.nuclear.upperId),
    lowerNuc: getTrigramName(result.nuclear.lowerId),
    upperChg: getTrigramName(result.changed.upperId),
    lowerChg: getTrigramName(result.changed.lowerId),
  };

  try {
    // Call the Vercel Serverless Function (/api/predict)
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data as AIAnalysisResult;

  } catch (error) {
    console.error("API Service Error:", error);
    return {
      originalText: "伺服器連線失敗。",
      movingLineText: "無法讀取資料。",
      nuclearText: "無法讀取資料。",
      changedText: "無法讀取資料。",
      prediction: "無法產生預測，請檢查您的網路連線或稍後再試。",
      predictionEnglish: "Failed to connect to the server. Please try again later."
    };
  }
};