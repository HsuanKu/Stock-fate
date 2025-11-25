import { LineType, Trigram } from './types';

export const TRIGRAMS: Record<number, Trigram> = {
  1: { id: 1, name: 'Qian', chineseName: '乾', nature: 'Heaven', lines: [LineType.YANG, LineType.YANG, LineType.YANG] },
  2: { id: 2, name: 'Dui', chineseName: '兌', nature: 'Lake', lines: [LineType.YIN, LineType.YANG, LineType.YANG] },
  3: { id: 3, name: 'Li', chineseName: '離', nature: 'Fire', lines: [LineType.YANG, LineType.YIN, LineType.YANG] },
  4: { id: 4, name: 'Zhen', chineseName: '震', nature: 'Thunder', lines: [LineType.YIN, LineType.YIN, LineType.YANG] },
  5: { id: 5, name: 'Xun', chineseName: '巽', nature: 'Wind', lines: [LineType.YANG, LineType.YANG, LineType.YIN] },
  6: { id: 6, name: 'Kan', chineseName: '坎', nature: 'Water', lines: [LineType.YIN, LineType.YANG, LineType.YIN] },
  7: { id: 7, name: 'Gen', chineseName: '艮', nature: 'Mountain', lines: [LineType.YANG, LineType.YIN, LineType.YIN] },
  8: { id: 8, name: 'Kun', chineseName: '坤', nature: 'Earth', lines: [LineType.YIN, LineType.YIN, LineType.YIN] },
};

// Helper to get Trigram Name by ID
export const getTrigramName = (id: number): string => {
  return TRIGRAMS[id]?.chineseName || '';
};
