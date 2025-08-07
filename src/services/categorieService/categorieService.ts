import type { Categories } from "../../types/categories";
import { api } from "../api/api";

export const CategorieService = {
    getCategories: async (): Promise<Categories[]> => {
    const response = await api.get('/categories');
    console.log('Response from getCategories:', response.data);
    return response.data.categories;
  },
  createCategory: async (category: Categories): Promise<Categories> => {
    const response = await api.post('/categories', category);
    return response.data;
  },
  updateCategory: async (id: number, category: Partial<Categories>): Promise<Categories> => {
    const response = await api.put(`/categories${id}`, category);
    return response.data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
  getCategoriesByCompanyId: async (companyId: number): Promise<Categories[]> => {
    const response = await api.get(`/categories?companyId=${companyId}`);
    console.log('Response from getCategoriesByCompanyId:', response.data);
    return response.data;
  }

}