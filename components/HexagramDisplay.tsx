import React from 'react';
import { HexagramData, LineType } from '../types';
import { TRIGRAMS } from '../constants';

interface HexagramDisplayProps {
  data: HexagramData;
  title: string;
  highlightLine?: number; // 1-6, optional
  description?: string; // AI Text
}

const HexagramDisplay: React.FC<HexagramDisplayProps> = ({ data, title, highlightLine, description }) => {
  const linesReversed = [...data.lines].reverse(); // Render top line first visually

  const upperTrigram = TRIGRAMS[data.upperId];
  const lowerTrigram = TRIGRAMS[data.lowerId];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-cyan-900/20 transition-shadow duration-300">
      <h3 className="text-xl font-serif-tc font-bold text-cyan-400 mb-4 tracking-widest">{title}</h3>
      
      {/* Hexagram Visual */}
      <div className="flex flex-col gap-2 mb-6 w-32 relative group">
        {linesReversed.map((line, index) => {
          // data.lines index 5 is Top. linesReversed index 0 is Top.
          // Line Number (1-6) = 6 - index
          const lineNumber = 6 - index; 
          const isMoving = lineNumber === highlightLine;

          return (
            <div key={index} className="w-full flex justify-between items-center h-4 relative">
              {line === LineType.YANG ? (
                // Yang Line (Solid)
                <div className={`h-full w-full rounded-sm transition-colors duration-500 ${isMoving ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-slate-200'}`}></div>
              ) : (
                // Yin Line (Broken)
                <div className="h-full w-full flex justify-between">
                  <div className={`h-full w-[42%] rounded-sm transition-colors duration-500 ${isMoving ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-slate-200'}`}></div>
                  <div className={`h-full w-[42%] rounded-sm transition-colors duration-500 ${isMoving ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' : 'bg-slate-200'}`}></div>
                </div>
              )}
              {isMoving && (
                <span className="absolute -right-8 text-xs text-red-400 font-bold whitespace-nowrap font-serif-tc">動</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Trigram Names */}
      <div className="text-sm text-slate-400 mb-4 flex gap-4">
        <div className="text-center">
          <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Upper</span>
          <span className="font-serif-tc text-lg text-slate-200 block">{upperTrigram.chineseName}</span>
          <span className="text-xs text-slate-500">({upperTrigram.nature})</span>
        </div>
        <div className="w-[1px] bg-slate-700"></div>
        <div className="text-center">
          <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Lower</span>
          <span className="font-serif-tc text-lg text-slate-200 block">{lowerTrigram.chineseName}</span>
          <span className="text-xs text-slate-500">({lowerTrigram.nature})</span>
        </div>
      </div>

      {/* Description / Meaning */}
      {description ? (
        <div className="mt-2 text-sm text-slate-300 leading-relaxed font-serif-tc text-justify border-t border-slate-700 pt-3 w-full">
           {description}
        </div>
      ) : (
        <div className="mt-2 h-20 w-full animate-pulse bg-slate-700/50 rounded"></div>
      )}
    </div>
  );
};

export default HexagramDisplay;