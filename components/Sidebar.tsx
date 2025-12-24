
import React from 'react';
import { MarketView } from '../types';
import { LayoutDashboard, Search, Newspaper, Briefcase, TrendingUp } from 'lucide-react';

interface SidebarProps {
  currentView: MarketView;
  onViewChange: (view: MarketView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: MarketView.DASHBOARD, label: 'پیشخوان', icon: LayoutDashboard },
    { id: MarketView.ANALYZER, label: 'تحلیلگر هوشمند', icon: Search },
    { id: MarketView.NEWS, label: 'اخبار و فیلترها', icon: Newspaper },
    { id: MarketView.PORTFOLIO, label: 'سبد دارایی', icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col h-full sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <TrendingUp className="text-blue-600 w-8 h-8" />
        <h1 className="text-xl font-bold text-gray-800">ارزیفای</h1>
      </div>
      
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
          <p className="text-xs opacity-80 mb-2 font-bold">نسخه حرفه‌ای</p>
          <p className="text-sm font-medium mb-3">دسترسی به سیگنال‌های VIP</p>
          <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all">
            ارتقا حساب
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
