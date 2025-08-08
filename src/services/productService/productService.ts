import { toast } from 'react-toastify';
import type { ProductFormData } from '../../types/product';
import { api } from '../api/api';

export const ProductService = {
  /**
   * Busca todos os produtos.
   */
  getProducts: async (): Promise<ProductFormData[]> => {
    try {
      const response = await api.get<ProductFormData[]>('/products/all');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Cria um novo produto.
   */
  createProduct: async (
    product: ProductFormData
  ): Promise<ProductFormData | undefined> => {
    try {
      const productData = {
        ...product,
        supplierId: product.supplierId ? String(product.supplierId) : undefined,
        categoryId: product.categoryId ? Number(product.categoryId) : undefined,
        purchasePrice: product.purchasePrice ? Number(product.purchasePrice) : 0,
        sellingPrice: product.sellingPrice ? Number(product.sellingPrice) : 0,
        iva: product.iva ? Number(product.iva) : 0,
      };

      const response = await api.post<ProductFormData>('/products', productData);
      toast.success('Produto criado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast.error('Erro ao criar produto');
      throw error; // para o caller tratar, se quiser
    }
  },

  /**
   * Atualiza um produto pelo ID.
   */
  updateProduct: async (
    id: number,
    product: Partial<ProductFormData>
  ): Promise<ProductFormData> => {
    try {
      const response = await api.put<ProductFormData>(`/products/${id}`, product);
      toast.success('Produto atualizado com sucesso!');
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
      throw error;
    }
  },

  /**
   * Exclui um produto pelo ID.
   */
  deleteProduct: async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
      throw error;
    }
  },

  /**
   * Retorna o total de produtos.
   */
  getTotalOfProducts: async (): Promise<number> => {
    try {
      const response = await api.get<number>('/products/count/total');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar total de produtos:', error);
      throw error;
    }
  },

  /**
   * Busca produtos por ID da empresa.
   */
  getProductByCompanyId: async (
  ): Promise<ProductFormData[]> => {
    try {
      const response = await api.get<ProductFormData[]>(
        `/products/company`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos da empresa:', error);
      throw error;
    }
  },
};
