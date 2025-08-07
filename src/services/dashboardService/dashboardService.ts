import { api } from '../api/api';
import type { DashboardStats, SaleData, TopProduct } from '../../types/dashboard';

export const dashboardService={


 getDashboardStats:async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<DashboardStats>(`/dashboard`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao carregar dados do dashboard');
 }
},

getSalesStats: async (): Promise<SaleData[]> => {
  try {
    const response = await api.get<SaleData[]>('/sales/stats');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao carregar dados de vendas');
  }
},

getTopProducts: async (): Promise<TopProduct[]> => {
  try {
    const response = await api.get<TopProduct[]>('/sales/top-products');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao carregar produtos mais vendidos');
  }
}
}