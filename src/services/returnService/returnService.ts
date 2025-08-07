import { toast } from 'react-toastify';
import type { CreateReturnDto, Return, ReturnProduct, ReturSales } from '../../types/returns';
import { api } from '../api/api';

const API_URL = '/return';

const returnService = {
  async create(data: CreateReturnDto): Promise<Return> {
    try {
      const response = await api.post(API_URL, data);
      console.log("Retornos nos serviços", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar retorno:", error?.response?.data || error.message);
      throw new Error("Erro ao criar retorno");
    }
  },

  async getAll(): Promise<Return[]> {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar retornos:", error?.response?.data || error.message);
      throw new Error("Erro ao buscar retornos");
    }
  },
  async getProductsReturned(): Promise<ReturnProduct[]> {
    try {
      const response = await api.get(`/products/products-all`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar produtos retornados:", error?.response?.data || error.message);
      throw new Error("Erro ao buscar produtos retornados");
    }
  },

  async getSales(): Promise<ReturSales[]> {
    try {
      const response = await api.get(`/sales/sales`);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar vendas:", error?.response?.data || error.message);
      throw new Error("Erro ao buscar vendas");
    }
  },

   async searchSales(query: string): Promise<ReturSales[]> {
      try {
        const response = await api.get(`sales/search?q=${query}`);
        return response.data;
      } catch (error) {
        toast.error("Erro ao pesquisar vendas.");
        console.error("searchSales Error:", error);
        return [];
      }
    }
};

export default returnService;
