
import React from 'react';
import { MarketItem } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketCardProps {
  item: MarketItem;
}

const MarketCard: React.FC<MarketCardProps> = ({ item }) => {
  const isPositive = item.change > 0;
  const isNeutral = item.change === 0;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-xs font-medium mb-1">{item.name}</h3>
          <p className="text-lg font-bold text-gray-800">{item.symbol}</p>
        </div>
        <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-50 text-green-600' : isNeutral ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? <TrendingUp size={20} /> : isNeutral ? <Minus size={20} /> : <TrendingDown size={20} />}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold tracking-tight">
          {item.price.toLocaleString('fa-IR')}
        </span>
        <span className="text-xs text-gray-400">ریال</span>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{item.changePercent.toLocaleString('fa-IR')}%
        </span>
        <span className="text-xs text-gray-400">({item.change.toLocaleString('fa-IR')})</span>
      </div>
    </div>
  );
};

export default MarketCard;
