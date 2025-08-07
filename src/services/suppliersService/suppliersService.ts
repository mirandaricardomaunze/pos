import { api } from '../api/api';
import type { SupplierFormData } from '../../types/suppliers';

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const SupplierService = {
  /**
   * Cria um novo fornecedor
   * @param supplierData Dados do fornecedor (deve conter companyId)
   */
  async createSupplier(supplierData: SupplierFormData): Promise<SupplierFormData> {
    try {
      console.log("Enviando dados do fornecedor:", supplierData);
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw SupplierService.handleError(error);
    }
  },

  /**
   * Atualiza um fornecedor existente
   * @param id ID do fornecedor
   * @param supplierData Dados parciais para atualizar
   */
  async updateSupplier(id: string, supplierData: Partial<SupplierFormData>): Promise<SupplierFormData> {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw SupplierService.handleError(error);
    }
  },

  /**
   * Retorna todos os fornecedores (sem filtro de empresa)
   */
  async getSuppliers(): Promise<SupplierFormData[]> {
    try {
      const response = await api.get('/suppliers');
      return response.data;
    } catch (error) {
      throw SupplierService.handleError(error);
    }
  },

  /**
   * Retorna um fornecedor pelo ID
   * @param id ID do fornecedor
   */
  async getSupplier(id: string): Promise<SupplierFormData> {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw SupplierService.handleError(error);
    }
  },

  /**
   * Exclui um fornecedor
   * @param id ID do fornecedor
   */
  async deleteSupplier(id: string): Promise<void> {
    try {
      await api.delete(`/suppliers/${id}`);
    } catch (error) {
      throw SupplierService.handleError(error);
    }
  },

  /**
   * Retorna os fornecedores por empresa
   * @param companyId ID da empresa
   */
  async getSuppliersByCompanyId(companyId: number): Promise<SupplierFormData[]> {
    try {
      const response = await api.get(`/suppliers?company=${companyId}`);
      console.log("Fornecedores da empresa:", response.data);
      return response.data;
    } catch (error) {
      throw SupplierService.handleError(error);
    }
  },

  /**
   * Tratamento centralizado de erros
   */
  handleError(error: any): ApiError {
    if (error.response) {
      const apiError: ApiError = {
        message: error.response.data.message || 'Erro desconhecido',
        status: error.response.status,
        data: error.response.data,
      };
      console.error('Erro na API:', apiError);
      return apiError;
    } else {
      console.error('Erro de rede:', error.message);
      return { message: error.message };
    }
  },
};
