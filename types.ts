
export interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'bourse' | 'gold' | 'currency';
  lastUpdate: string;
}

export interface AnalysisResult {
  symbol: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD' | 'NEUTRAL';
  confidence: number; // 0 to 100
  technicalSummary: string;
  fundamentalSummary: string;
  risks: string[];
  targets: number[];
  stopLoss: number;
  sources: { title: string; uri: string }[];
}

export enum MarketView {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  NEWS = 'NEWS',
  PORTFOLIO = 'PORTFOLIO'
}
