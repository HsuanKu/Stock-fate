import { TRIGRAMS } from '../constants';
import { DivinationResult, HexagramData, LineType } from '../types';

/**
 * Calculates the value of a stock code string.
 * Numbers are taken as is. Letters are converted (A=1, B=2...).
 * Chinese characters are ignored in this simplified version, or could take stroke count (but strictly complying to prompt: Letters/Numbers).
 */
const calculateStockValue = (code: string): number => {
  let sum = 0;
  const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

  for (let i = 0; i < cleanCode.length; i++) {
    const charCode = cleanCode.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
      // Is Number 0-9
      sum += parseInt(cleanCode[i], 10);
    } else if (charCode >= 65 && charCode <= 90) {
      // Is Letter A-Z
      sum += charCode - 64; // A(65) -> 1
    }
  }
  return sum;
};

/**
 * Constructs a hexagram from upper and lower trigram IDs.
 * Returns array of 6 lines (0=bottom, 5=top).
 */
const constructHexagramLines = (upperId: number, lowerId: number): LineType[] => {
  const upperLines = TRIGRAMS[upperId].lines; // Top, Middle, Bottom of Trigram
  const lowerLines = TRIGRAMS[lowerId].lines; // Top, Middle, Bottom of Trigram

  // Hexagram lines are typically counted from bottom up.
  // Trigram definition in constants: [Top, Middle, Bottom]
  
  // Bottom Trigram (Lower)
  const line1 = lowerLines[2]; // Bottom of Lower
  const line2 = lowerLines[1]; // Middle of Lower
  const line3 = lowerLines[0]; // Top of Lower

  // Top Trigram (Upper)
  const line4 = upperLines[2]; // Bottom of Upper
  const line5 = upperLines[1]; // Middle of Upper
  const line6 = upperLines[0]; // Top of Upper

  return [line1, line2, line3, line4, line5, line6];
};

/**
 * Identifies trigrams from a 6-line hexagram (lines 0-5).
 */
const identifyTrigrams = (lines: LineType[]): { upper: number, lower: number } => {
  const findTrigramId = (lTop: LineType, lMid: LineType, lBot: LineType): number => {
    // Find matching trigram in TRIGRAMS
    for (let i = 1; i <= 8; i++) {
      const t = TRIGRAMS[i];
      if (t.lines[0] === lTop && t.lines[1] === lMid && t.lines[2] === lBot) {
        return i;
      }
    }
    return 8; // Fallback
  };

  const lower = findTrigramId(lines[2], lines[1], lines[0]);
  const upper = findTrigramId(lines[5], lines[4], lines[3]);
  return { upper, lower };
};

export const performDivination = (stockCode: string, userNumber: number): DivinationResult => {
  const now = new Date();
  const seconds = now.getSeconds(); // 0-59
  const minutes = now.getMinutes(); // 0-59
  const stockValue = calculateStockValue(stockCode);

  // 1. Upper Trigram Calculation
  // (Seconds + StockValue + UserNumber) % 8
  let upperVal = (seconds + stockValue + userNumber) % 8;
  if (upperVal === 0) upperVal = 8;

  // 2. Lower Trigram Calculation
  // (Seconds + Minutes + StockValue + UserNumber) % 8
  let lowerVal = (seconds + minutes + stockValue + userNumber) % 8;
  if (lowerVal === 0) lowerVal = 8;

  // 3. Moving Line Calculation
  // (Seconds + Minutes + StockValue + UserNumber) % 6
  let movingLine = (seconds + minutes + stockValue + userNumber) % 6;
  if (movingLine === 0) movingLine = 6;

  // --- Construct Original Hexagram ---
  const originalLines = constructHexagramLines(upperVal, lowerVal);
  const originalHex: HexagramData = {
    upperId: upperVal,
    lowerId: lowerVal,
    lines: originalLines
  };

  // --- Construct Nuclear Hexagram (互卦) ---
  // Lower Nuclear Trigram is formed by lines 2, 3, 4 of original (indices 1, 2, 3)
  // Upper Nuclear Trigram is formed by lines 3, 4, 5 of original (indices 2, 3, 4)
  // Remember: our lines array is [1, 2, 3, 4, 5, 6] mapped to indices 0..5
  
  // Nuclear Lower: Lines 2, 3, 4 -> Indices 1, 2, 3
  // Wait, trigram logic is Top, Middle, Bottom.
  // Trigram from Lines 2,3,4: Top=4(idx3), Mid=3(idx2), Bot=2(idx1)
  
  // Nuclear Upper: Lines 3, 4, 5 -> Indices 2, 3, 4
  // Trigram from Lines 3,4,5: Top=5(idx4), Mid=4(idx3), Bot=3(idx2)

  // Wait, standard Nuclear construction:
  // Nuclear Lower Trigram = Lines 2,3,4. 
  // Nuclear Upper Trigram = Lines 3,4,5.
  
  // Let's reconstruct lines for Nuclear Hexagram
  // Index 0 (Bot) = Original[1] (Line 2)
  // Index 1 (Mid) = Original[2] (Line 3)
  // Index 2 (Top) = Original[3] (Line 4)
  // Index 3 (Bot) = Original[2] (Line 3)
  // Index 4 (Mid) = Original[3] (Line 4)
  // Index 5 (Top) = Original[4] (Line 5)
  
  const nuclearLines: LineType[] = [
    originalLines[1], 
    originalLines[2],
    originalLines[3],
    originalLines[2],
    originalLines[3],
    originalLines[4]
  ];
  
  const nuclearTrigrams = identifyTrigrams(nuclearLines);
  const nuclearHex: HexagramData = {
    upperId: nuclearTrigrams.upper,
    lowerId: nuclearTrigrams.lower,
    lines: nuclearLines
  };

  // --- Construct Changed Hexagram (變卦) ---
  // Flip the moving line
  const changedLines = [...originalLines];
  const movingIndex = movingLine - 1; // 1-based to 0-based
  changedLines[movingIndex] = changedLines[movingIndex] === LineType.YANG ? LineType.YIN : LineType.YANG;

  const changedTrigrams = identifyTrigrams(changedLines);
  const changedHex: HexagramData = {
    upperId: changedTrigrams.upper,
    lowerId: changedTrigrams.lower,
    lines: changedLines
  };

  return {
    original: originalHex,
    nuclear: nuclearHex,
    changed: changedHex,
    movingLine: movingLine,
    timestamp: now,
    stockCode,
    userNumber
  };
};
