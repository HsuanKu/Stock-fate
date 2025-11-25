import React from 'react';
import { AIAnalysisResult } from '../types';

interface AnalysisResultProps {
  analysis: AIAnalysisResult | null;
  loading: boolean;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
         <p className="text-cyan-300 animate-pulse font-serif-tc text-lg">正在請示卦神與分析市場趨勢...</p>
         <p className="text-slate-500 text-sm mt-2">Consulting the Oracle & Analyzing Market Trends...</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 animate-fade-in-up">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-900/50 rounded-xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/><path d="M12 6A9 9 0 1 1 5.6 5.6"/></svg>
          <span className="font-serif-tc">預測結果分析</span>
          <span className="text-sm font-sans text-slate-500 font-normal mt-1 opacity-70">Financial Prediction</span>
        </h2>
        
        {/* Chinese Prediction */}
        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-lg text-slate-200 leading-relaxed whitespace-pre-line font-serif-tc">
            {analysis.prediction}
          </p>
        </div>

        {/* English Translation */}
        <div className="bg-slate-950/30 rounded-lg p-6 border border-slate-700/30">
           <h3 className="text-xs uppercase text-cyan-600 tracking-wider font-bold mb-3">English Translation</h3>
           <p className="text-sm text-slate-400 leading-relaxed font-sans">
             {analysis.predictionEnglish}
           </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <span className="text-xs uppercase text-cyan-500 tracking-wider font-bold block mb-2 font-serif-tc">本卦卦辭 (Original Text)</span>
            <p className="text-sm text-slate-400 font-serif-tc italic leading-6">{analysis.originalText}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <span className="text-xs uppercase text-red-400 tracking-wider font-bold block mb-2 font-serif-tc">動爻爻辭 (Moving Line Text)</span>
            <p className="text-sm text-slate-400 font-serif-tc italic leading-6">{analysis.movingLineText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;