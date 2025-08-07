import type { ProductFormData } from "./product";

export interface ProductListProps {
  products: ProductFormData[];
  loading: boolean;
  error: string | null;
  onAddToCart:(product: ProductFormData)=>void
}