// src/services/reportService.ts
import { api } from '../../services/api/api';

const reportService = {
  getReports: async (startDate: string, endDate: string) => {
    try {
      const response = await api.get(`/sales/report`, {
        params: { startDate, endDate },
      });
      console.log("Sales report fetched:", response.data);
      return response.data.sales;
    } catch (error: any) {
      console.error("Error fetching sales report:", error.response?.data || error.message || error);
      throw error.response?.data || error;
    }
  },

  deleteReport: async (id: number) => {
    try {
      await api.delete(`/sales/report/${id}`);
      console.log(`Report with id ${id} deleted successfully.`);
    } catch (error: any) {
      console.error(`Error deleting report with id ${id}:`, error.response?.data || error.message || error);
      throw error.response?.data || error;
    }
  },

  // Nova função para a rota do relatório com gráfico e tabela
  getOrdersReport: async (startDate?: string, endDate?: string) => {
    try {
      const response = await api.get(`/orders/orders-by-date`, {
        params: { startDate, endDate },
      });
      console.log("Orders report fetched:", response.data);
      return response.data; // orders + chartData
    } catch (error: any) {
      console.error("Error fetching orders report:", error.response?.data || error.message || error);
      throw error.response?.data || error;
    }
  },
};

export default reportService;
