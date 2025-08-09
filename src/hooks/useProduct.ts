import { useEffect, useState } from "react";
import { api } from "../services/api/api";
import type { ProductFormData } from "../types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const companyId = user?.companyId;

        if (!companyId) {
          console.error('Nenhuma empresa encontrada no usuário');
          return;
        }

        const res = await api.get(`/products/company`);
        setProducts(res.data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { products, loading };
};
