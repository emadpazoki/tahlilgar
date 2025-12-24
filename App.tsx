
import React, { useState, useEffect } from 'react';
import { MarketView, MarketItem } from './types';
import { getDetailedMarketSentiment, getLiveMarketPrices, getTopOpportunities } from './services/geminiService';
import Sidebar from './components/Sidebar';
import MarketCard from './components/MarketCard';
import Analyzer from './components/Analyzer';
import { Bell, User, Clock, ShieldCheck, Sparkles, RefreshCcw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<MarketView>(MarketView.DASHBOARD);
  const [sentiment, setSentiment] = useState<string>('در حال واکاوی داده‌های سایت tgju.org و اخبار سیاسی...');
  const [livePrices, setLivePrices] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sentimentText, prices, opps] = await Promise.all([
        getDetailedMarketSentiment(),
        getLiveMarketPrices(),
        getTopOpportunities()
      ]);
      setSentiment(sentimentText);
      setLivePrices(prices);
      setOpportunities(opps);
    } catch (err) {
      console.error(err);
      setSentiment('خطا در دریافت قیمت‌های لحظه‌ای از tgju.org. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case MarketView.DASHBOARD:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-xl border border-white/10 text-blue-300">
                  <Sparkles size={14} />
                  هوش مصنوعی: تحلیل استراتژیک روز
                </div>
                <h2 className="text-4xl font-black mb-6 leading-tight">پایش هوشمند بازار ایران</h2>
                <div className="bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/5 shadow-inner">
                  <p className="text-base leading-relaxed text-gray-200 text-justify italic font-light">
                    {sentiment}
                  </p>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
              <div className="absolute left-1/2 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
            </div>

            <section>
              <div className="flex justify-between items-center mb-6 px-2">
                <h2 className="text-2xl font-black text-gray-800">قیمت‌های لحظه‌ای (Live - TGJU)</h2>
                <button 
                  onClick={fetchDashboardData}
                  className="flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-all border border-blue-100 shadow-sm"
                >
                  <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                  بروزرسانی زنده
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {livePrices.length > 0 ? livePrices.map((item, idx) => (
                  <MarketCard 
                    key={idx} 
                    item={{
                      id: String(idx),
                      name: item.name,
                      symbol: item.symbol,
                      price: item.price,
                      change: 0,
                      changePercent: item.changePercent,
                      category: 'gold', 
                      lastUpdate: 'لحظه‌ای'
                    }} 
                  />
                )) : Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-40 bg-white border border-gray-100 rounded-3xl animate-pulse flex flex-col p-6 gap-4">
                     <div className="w-1/2 h-4 bg-gray-100 rounded-full" />
                     <div className="w-full h-8 bg-gray-50 rounded-xl" />
                     <div className="w-1/3 h-4 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-black text-gray-800 px-2">فرصت‌های معاملاتی (Top 10)</h2>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                  <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">۱۰ نماد برتر با کمترین ریسک</h3>
                      <p className="text-xs opacity-70">پیشنهاد هوش مصنوعی بر اساس تابلوی معاملات امروز</p>
                    </div>
                    <ShieldCheck size={32} className="opacity-50" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                          <th className="px-6 py-4">نام و نماد</th>
                          <th className="px-6 py-4">سود تخمینی</th>
                          <th className="px-6 py-4">سطح ریسک</th>
                          <th className="px-6 py-4">سیگنال</th>
                          <th className="px-6 py-4">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {opportunities.length > 0 ? opportunities.map((opp, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="text-sm font-black text-gray-800">{opp.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold">{opp.symbol}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-green-600 font-black text-sm">
                                <TrendingUp size={14} />
                                {opp.expectedReturn}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-black ${opp.riskLevel === 'Low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {opp.riskLevel === 'Low' ? 'بسیار کم' : 'متوسط'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                                <CheckCircle size={14} />
                                {opp.recommendation === 'BUY' ? 'خرید پله‌ای' : 'نگهداری'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => setCurrentView(MarketView.ANALYZER)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                              >
                                تحلیل فنی
                              </button>
                            </td>
                          </tr>
                        )) : Array(10).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan={5} className="px-6 py-4 h-16 bg-gray-50/50" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-800 px-2">وضعیت ریسک بازار</h2>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
                   <div className="space-y-3">
                     <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-tighter">
                       <span>ریسک تنش‌های سیاسی</span>
                       <span className="text-red-500 font-black">بالا (۷۵٪)</span>
                     </div>
                     <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                       <div className="h-full bg-red-500 w-[75%] shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex justify-between text-xs font-black text-gray-500 uppercase tracking-tighter">
                       <span>ثبات نرخ ارز (TGJU)</span>
                       <span className="text-amber-500 font-black">متوسط (۴۵٪)</span>
                     </div>
                     <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                       <div className="h-full bg-amber-500 w-[45%] shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                     </div>
                   </div>
                   <div className="pt-6 border-t border-gray-50">
                     <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck size={14} className="text-green-500" />
                       <span className="text-[10px] font-bold text-gray-800">اعتبارسنجی شده توسط هوش مصنوعی</span>
                     </div>
                     <p className="text-[10px] text-gray-400 leading-relaxed text-justify">
                       داده‌ها بر اساس پایش ۲۴ ساعته سایت tgju.org و اخبار خبرگزاری‌های معتبر اقتصادی تنظیم شده‌اند.
                     </p>
                   </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex gap-4">
                  <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-amber-800 mb-1">هشدار استراتژیک</h4>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      به دلیل نوسانات شدید نرخ دلار در سایت TGJU، پیشنهاد می‌شود در معاملات بورس حد ضرر را در ۵٪ تنظیم کنید.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case MarketView.ANALYZER:
        return <Analyzer />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-32 text-gray-300">
            <Sparkles size={80} className="mb-6 opacity-10" />
            <p className="text-xl font-black">این بخش برای عماد پازوکی در حال شخصی‌سازی است...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex font-['Vazirmatn']">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
            <h2 className="text-xl font-black text-gray-800">
              {currentView === MarketView.DASHBOARD ? 'میز استراتژیک عماد پازوکی' : 
               currentView === MarketView.ANALYZER ? 'واحد تحلیل هوشمند' : 'پنل کاربری'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-gray-400 text-xs font-bold border-l border-gray-100 pl-6 h-10">
              <Clock size={16} />
              <span>{new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative group">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform" />
            </button>
            <div className="flex items-center gap-4 pr-6 border-r border-gray-100 h-10">
              <div className="text-right">
                <p className="text-sm font-black text-gray-800 leading-tight">عماد پازوکی</p>
                <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest mt-0.5">سرمایه‌گذار ویژه</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl overflow-hidden text-white">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1700px] mx-auto w-full flex-1">
          {renderContent()}
        </div>

        <footer className="py-12 border-t border-gray-100 bg-white text-center">
          <div className="flex justify-center gap-8 mb-4 opacity-30 grayscale">
            <img src="https://www.tgju.org/logo.png" alt="TGJU" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            ارزیفای نسخه اختصاصی عماد پازوکی | کلیه تحلیل‌ها بر اساس داده‌های شبکه هوشمند و tgju.org است
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
