
import React, { useState, useEffect } from 'react';
import { analyzeMarketSymbol } from '../services/geminiService';
import { Search, Loader2, AlertCircle, CheckCircle2, Info, ExternalLink, Globe, History, Target, Sparkles, Clock, Columns, X } from 'lucide-react';

const Analyzer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [compareQuery, setCompareQuery] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [category, setCategory] = useState('bourse');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [compareResult, setCompareResult] = useState<any | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category !== 'bourse') {
      setQuery('');
      setCompareQuery('');
      setShowCompare(false);
    }
  }, [category]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalQuery1 = query;
    let finalQuery2 = compareQuery;

    if (category === 'gold') finalQuery1 = 'سکه امامی و طلای ۱۸ عیار';
    if (category === 'currency') finalQuery1 = 'دلار بازار آزاد';
    
    if (category === 'bourse' && !finalQuery1) {
      setError('لطفا نام نماد بورسی مورد نظر را وارد کنید.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCompareResult(null);

    try {
      const tasks = [analyzeMarketSymbol(finalQuery1, category)];
      if (showCompare && finalQuery2) {
        tasks.push(analyzeMarketSymbol(finalQuery2, category));
      }

      const [res1, res2] = await Promise.all(tasks);
      setResult(res1);
      if (res2) setCompareResult(res2);
    } catch (err) {
      console.error(err);
      setError('خطا در تحلیل زنده. هوش مصنوعی نتوانست دیتای معتبری برای امروز پیدا کند. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const getRecStyle = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'text-green-600 bg-green-50 border-green-200';
      case 'SELL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HOLD': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecLabel = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'پیشنهاد خرید';
      case 'SELL': return 'پیشنهاد فروش';
      case 'HOLD': return 'نگهداری';
      default: return 'خنثی';
    }
  };

  const renderResultCard = (data: any, isCompare = false) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col ${isCompare ? 'border-dashed border-blue-200' : ''}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-30" />
      
      <div className="flex flex-col justify-between mb-8 gap-4 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-gray-800">{data.symbol}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] mt-1 font-medium">
              <Clock size={12} className="text-blue-400" />
              دیتا: <span className="text-blue-600 font-bold">{data.dataDate || 'امروز'}</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border-2 font-black text-sm shadow-sm ${getRecStyle(data.recommendation)}`}>
            {getRecLabel(data.recommendation)}
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 border-gray-100 text-xs uppercase">
            <Globe size={14} className="text-blue-500" />
            تحلیل سیاسی امروز
          </h4>
          <p className="text-gray-600 leading-relaxed text-xs text-justify font-light">
            {data.politicalImpact}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2 border-gray-100 text-xs uppercase">
            <History size={14} className="text-indigo-500" />
            تطبیق تاریخی
          </h4>
          <p className="text-gray-600 leading-relaxed text-xs text-justify font-light">
            {data.historicalContext}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
          <div>
            <h5 className="text-[10px] font-bold text-gray-400 mb-2">تکنیکال</h5>
            <p className="text-[10px] text-gray-500 leading-tight line-clamp-3">{data.technicalSummary}</p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-gray-400 mb-2">فاندامنتال</h5>
            <p className="text-[10px] text-gray-500 leading-tight line-clamp-3">{data.fundamentalSummary}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase">تارگت‌ها و حد ضرر</span>
            <div className="flex items-center gap-1">
               <span className="text-[10px] text-gray-400">اعتماد:</span>
               <span className="text-[10px] font-bold text-blue-600">{data.confidence}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {data.targets.slice(0, 2).map((t: number, i: number) => (
              <div key={i} className="bg-green-50 text-green-700 p-2 rounded-lg text-center font-black text-xs">
                {t.toLocaleString('fa-IR')}
              </div>
            ))}
            <div className="col-span-2 bg-red-50 text-red-700 p-2 rounded-lg text-center font-black text-xs mt-1">
              Stop: {data.stopLoss.toLocaleString('fa-IR')}
            </div>
          </div>
        </div>
      </div>

      {data.sources && data.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {data.sources.slice(0, 2).map((source: any, idx: number) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-[9px] text-gray-400 hover:text-blue-600 transition-all border border-gray-100"
              >
                <ExternalLink size={8} />
                <span className="truncate max-w-[80px]">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="text-blue-600" size={24} />
            تحلیلگر استراتژیک عماد پازوکی
          </h2>
          {category === 'bourse' && (
            <button 
              onClick={() => setShowCompare(!showCompare)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                showCompare ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {showCompare ? <X size={14} /> : <Columns size={14} />}
              {showCompare ? 'لغو مقایسه' : 'مقایسه دو نماد'}
            </button>
          )}
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-gray-400 mb-2 mr-1 uppercase">بازار هدف</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-bold text-gray-700"
              >
                <option value="bourse">بورس اوراق بهادار</option>
                <option value="gold">طلا و مسکوکات</option>
                <option value="currency">بازار ارز و تتر</option>
              </select>
            </div>

            <div className={`${category === 'bourse' ? (showCompare ? 'md:col-span-7' : 'md:col-span-6') : 'md:col-span-6'}`}>
              {category === 'bourse' ? (
                <div className={`grid gap-4 ${showCompare ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 mr-1 uppercase">نماد اصلی</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثال: فملی"
                        className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 font-bold"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  {showCompare && (
                    <div className="animate-in slide-in-from-right-4">
                      <label className="block text-[10px] font-bold text-gray-400 mb-2 mr-1 uppercase">نماد مقایسه‌ای</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="مثال: شستا"
                          className="w-full px-4 py-3.5 pr-12 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-blue-50/30 font-bold"
                          value={compareQuery}
                          onChange={(e) => setCompareQuery(e.target.value)}
                        />
                        <Columns className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-blue-50/50 px-5 py-4 rounded-xl border border-blue-100 flex items-center gap-3 text-blue-700 font-medium">
                  <Sparkles size={20} className="shrink-0" />
                  <span className="text-sm">تحلیل هوشمند شاخص‌های کلیدی (TGJU)</span>
                </div>
              )}
            </div>

            <div className={`${showCompare ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'تحلیل زنده'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin text-blue-600" size={56} />
            <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-200" size={24} />
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-bold">در حال پردازش داده‌های لحظه‌ای TGJU...</p>
            <p className="text-gray-400 text-xs mt-1">مقایسه اخبار سیاسی و الگوهای تاریخی امروز</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className={`grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 ${compareResult ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
          <div className={compareResult ? '' : 'lg:col-span-2'}>
            {renderResultCard(result)}
          </div>
          
          {compareResult && (
            <div>
              {renderResultCard(compareResult, true)}
            </div>
          )}

          {!compareResult && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                <h4 className="font-bold text-gray-900 mb-8 flex items-center justify-between">
                  استراتژی معامله
                  <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </h4>
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-sm mb-3 font-bold">
                      <span className="text-gray-500">قدرت سیگنال</span>
                      <span className="text-blue-600">{result.confidence}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-r-2 border-blue-500 pr-2">تارگت‌های امروز</p>
                    {result.targets.map((target: number, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-green-50/40 rounded-2xl border border-green-100/50">
                        <span className="text-xs font-bold text-green-700">هدف {idx + 1}</span>
                        <span className="font-black text-green-900 text-lg">{target.toLocaleString('fa-IR')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-4 bg-red-50/40 rounded-2xl border border-red-100/50 mt-4">
                      <span className="text-xs font-bold text-red-700">حد ضرر (Stop)</span>
                      <span className="font-black text-red-900 text-lg">{result.stopLoss.toLocaleString('fa-IR')}</span>
                    </div>
                  </div>

                  <div className="pt-6 space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-r-2 border-red-500 pr-2">هشدار ریسک</p>
                     {result.risks.map((risk: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-red-700 font-medium">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analyzer;
