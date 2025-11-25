export enum LineType {
  YIN = 0,
  YANG = 1,
}

export interface Trigram {
  id: number;
  name: string;
  chineseName: string;
  nature: string;
  lines: [LineType, LineType, LineType]; // Top, Middle, Bottom
}

export interface HexagramData {
  upperId: number;
  lowerId: number;
  name?: string; // To be filled by AI or lookup
  lines: LineType[]; // 6 lines, index 0 is bottom, index 5 is top (Standard I Ching counting)
}

export interface DivinationResult {
  original: HexagramData;
  nuclear: HexagramData;
  changed: HexagramData;
  movingLine: number; // 1-6
  timestamp: Date;
  stockCode: string;
  userNumber: number;
}

export interface AIAnalysisResult {
  originalText: string; // Gua Ci (Chinese)
  movingLineText: string; // Yao Ci (Chinese)
  nuclearText: string; // Hu Gua meaning (Chinese)
  changedText: string; // Bian Gua meaning (Chinese)
  prediction: string; // Main analysis (Chinese)
  predictionEnglish: string; // Main analysis (English translation)
}