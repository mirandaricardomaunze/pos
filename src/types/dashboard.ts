// types/dashboard.ts
export interface DashboardStats {
  totalProducts: number;
  todaySales: string;
  salesTrend: 'up' | 'down' | 'neutral';
  salesChange: string;
  lowStockItems: number;
  stockTrend:  'up' | 'down' | 'neutral';
  stockChange: string;
  growthRate: string;
  growthTrend:'up' | 'down' | 'neutral';
  growthChange: string;
  totalProfit: number;
}

export interface SaleData {
  month: string;
  total: number;
  profit: number;
}

export interface TopProduct {
  id: string;
  name: string;
  quantitySold: number;
}


export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  changeText: string;
  bgColor: string;
  textColor: string;
}