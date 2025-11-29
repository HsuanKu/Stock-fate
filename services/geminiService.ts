import { DivinationResult, AIAnalysisResult } from "../types";
import { getTrigramName, TRIGRAMS } from "../constants";

export const interpretDivination = async (result: DivinationResult): Promise<AIAnalysisResult> => {
  // Prepare data to send to the backend
  // We send the Names/Natures to avoid the backend needing to import 'constants.ts' and handle path aliasing issues.
  const payload = {
    stockCode: result.stockCode,
    userNumber: result.userNumber,
    timestamp: result.timestamp.toLocaleString(),
    movingLine: result.movingLine,
    original: {
      upper: getTrigramName(result.original.upperId),
      upperNature: TRIGRAMS[result.original.upperId].nature,
      lower: getTrigramName(result.original.lowerId),
      lowerNature: TRIGRAMS[result.original.lowerId].nature,
    },
    nuclear: {
      upper: getTrigramName(result.nuclear.upperId),
      upperNature: TRIGRAMS[result.nuclear.upperId].nature,
      lower: getTrigramName(result.nuclear.lowerId),
      lowerNature: TRIGRAMS[result.nuclear.lowerId].nature,
    },
    changed: {
      upper: getTrigramName(result.changed.upperId),
      upperNature: TRIGRAMS[result.changed.upperId].nature,
      lower: getTrigramName(result.changed.lowerId),
      lowerNature: TRIGRAMS[result.changed.lowerId].nature,
    }
  };

  try {
    // Call our own backend API
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
    console.error("API Request Error:", error);
    return {
      originalText: "無法讀取資料。",
      movingLineText: "無法讀取資料。",
      nuclearText: "無法讀取資料。",
      changedText: "無法讀取資料。",
      prediction: "無法連線至伺服器。請確認網路狀態。",
      predictionEnglish: "Failed to connect to server. Please check your network."
    };
  }
};