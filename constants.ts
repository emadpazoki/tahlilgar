
import { MarketItem } from './types';

export const MOCK_MARKET_DATA: MarketItem[] = [
  { id: '1', name: 'شاخص کل بورس', symbol: 'TSE', price: 2154320, change: 12500, changePercent: 0.58, category: 'bourse', lastUpdate: '1402/12/20' },
  { id: '2', name: 'سکه تمام طرح جدید', symbol: 'SEKE', price: 33450000, change: -120000, changePercent: -0.36, category: 'gold', lastUpdate: '1402/12/20' },
  { id: '3', name: 'طلای ۱۸ عیار', symbol: 'GOLD18', price: 2845000, change: 5000, changePercent: 0.18, category: 'gold', lastUpdate: '1402/12/20' },
  { id: '4', name: 'دلار (بازار آزاد)', symbol: 'USD', price: 59500, change: 200, changePercent: 0.34, category: 'currency', lastUpdate: '1402/12/20' },
  { id: '5', name: 'نماد خودرو', symbol: 'IKCO', price: 2840, change: 45, changePercent: 1.61, category: 'bourse', lastUpdate: '1402/12/20' },
  { id: '6', name: 'نماد شستا', symbol: 'SSHASTA', price: 1120, change: -12, changePercent: -1.06, category: 'bourse', lastUpdate: '1402/12/20' },
];

export const APP_CONFIG = {
  primaryColor: '#2563eb',
  accentColor: '#10b981',
  dangerColor: '#ef4444',
};
