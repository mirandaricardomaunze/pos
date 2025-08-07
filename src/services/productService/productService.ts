
import { toast } from 'react-toastify';
import type { ProductFormData} from '../../types/product';
import { api } from '../api/api';


export const ProductService = {
  getProducts: async (): Promise<ProductFormData[]> => {
    const response = await api.get('/products/products');
    return response.data;
  },

createProduct: async (product: ProductFormData): Promise<ProductFormData | undefined> => {
  try {
    const productData = {
      ...product,
      supplierId: String(product.supplierId),
      categoryId: Number(product.categoryId),
      purchasePrice: Number(product.purchasePrice),
      sellingPrice: Number(product.sellingPrice),
      iva: Number(product.iva),
    };

    const response = await api.post('/products', productData);
    toast.success('Produto criado com sucesso!');
    console.log("Data", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro do servidor", error);
    toast.error('Erro ao criar produto');
  }
},

  updateProduct: async (id: number, product: Partial<ProductFormData>): Promise<ProductFormData> => {
    const response = await api.put(`/products/${id}`, product);
    toast.success('Produto atualizado com sucesso!');
    return response.data;
  },

  deleteProduct: async (id: any): Promise<void> => {
    await api.delete(`/products/${id}`);
    toast.success('Produto excluído com sucesso!');
  },


  getTotalOfProducts:async ()=>{
    const response= await api.get("/products/total")
    return response.data;
  },
  getProductByCompanyId: async (companyId: number): Promise<ProductFormData[]> => {
    const response = await api.get(`/products/company/${companyId}`);
    return response.data;
  },
};
