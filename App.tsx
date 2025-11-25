import React, { useState } from 'react';
import { performDivination } from './utils/divinationLogic';
import { interpretDivination } from './services/geminiService';
import { DivinationResult, AIAnalysisResult } from './types';
import HexagramDisplay from './components/HexagramDisplay';
import AnalysisResult from './components/AnalysisResult';

const App: React.FC = () => {
  const [stockCode, setStockCode] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDivinate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockCode || !userNumber) return;

    const num = parseInt(userNumber);
    if (isNaN(num)) {
      setError('請輸入有效的數字 (Please enter a valid number)');
      return;
    }

    setError('');
    setLoading(true);
    setAnalysis(null);

    // 1. Math Calculation (Instant)
    const divResult = performDivination(stockCode, num);
    setResult(divResult);

    // 2. AI Interpretation (Async)
    try {
      const aiResult = await interpretDivination(divResult);
      setAnalysis(aiResult);
    } catch (err) {
      console.error(err);
      setError('無法取得 AI 解讀，請檢查 API 金鑰設定。(Failed to fetch AI interpretation)');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const min = date.getMinutes();
    const s = date.getSeconds();
    return `${y}年 ${m}月 ${d}日 ${h}時 ${min}分 ${s}秒`;
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-cyan-900 rounded-lg flex items-center justify-center border border-cyan-700">
              <span className="text-2xl">🌸</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-serif-tc">梅花易數股市預測</h1>
              <p className="text-xs text-cyan-400 font-medium">Plum Blossom Stock Divination</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-10">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-serif-tc text-center mb-2 text-slate-200">開始排盤</h2>
            <p className="text-center text-slate-500 text-sm mb-6">Start Your Prediction</p>
            
            <form onSubmit={handleDivinate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex flex-col">
                    <span className="font-serif-tc text-slate-200">股票代碼</span>
                    <span className="text-xs scale-90 origin-top-left">Stock Code</span>
                  </label>
                  <input
                    type="text"
                    value={stockCode}
                    onChange={(e) => setStockCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AAPL or 2330"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-slate-600 font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex flex-col">
                    <span className="font-serif-tc text-slate-200">自選數字</span>
                    <span className="text-xs scale-90 origin-top-left">Lucky Number</span>
                  </label>
                  <input
                    type="number"
                    value={userNumber}
                    onChange={(e) => setUserNumber(e.target.value)}
                    placeholder="任意整數 (Any integer)"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm text-center font-serif-tc">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-lg text-lg font-bold transition-all transform active:scale-95 flex flex-col items-center justify-center gap-1 ${
                  loading
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25'
                }`}
              >
                {loading ? (
                  <span>排盤中 (Divining)...</span>
                ) : (
                  <>
                    <span className="font-serif-tc tracking-widest text-xl">預測吉凶</span>
                    <span className="text-xs font-sans opacity-80 uppercase tracking-wide">Predict Outcome</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in space-y-12">
            
            {/* System Time Display */}
            <div className="flex justify-center">
              <div className="bg-slate-900/80 border border-cyan-900/50 px-6 py-3 rounded-full flex flex-col items-center shadow-lg">
                <span className="text-cyan-500 text-xs uppercase tracking-widest mb-1">System Time (排盤時間)</span>
                <span className="text-xl font-mono text-cyan-200 font-bold tracking-wide">
                  {formatDate(result.timestamp)}
                </span>
              </div>
            </div>
            
            {/* Hexagram Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HexagramDisplay 
                data={result.original} 
                title="本卦 (Original)" 
                highlightLine={result.movingLine}
                description={analysis?.originalText}
              />
              <HexagramDisplay 
                data={result.nuclear} 
                title="互卦 (Nuclear)" 
                description={analysis?.nuclearText}
              />
              <HexagramDisplay 
                data={result.changed} 
                title="變卦 (Changed)" 
                description={analysis?.changedText}
              />
            </div>

            {/* AI Analysis */}
            <AnalysisResult analysis={analysis} loading={loading} />

          </div>
        )}
      </main>
    </div>
  );
};

export default App;