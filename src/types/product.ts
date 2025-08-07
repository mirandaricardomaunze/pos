export interface ProductFormData {
  id?: number;
  name: string;
  quantity: number;
  barcode: string;
  reference: string;
  description: string;
  purchasePrice: number;
  expiryDate?: string | null;
  sellingPrice: number;
  imageUrl?: string;
  iva: number;
  supplierId: number | null;
  categoryId: number | null;
  category?: string | null;
  profit: number;
  createdAt?: string;
  updatedAt?: string;
}

export const initialFormData: ProductFormData = {
  name: "",
  quantity: 0,
  barcode: "",
  reference: "",
  description: "",
  purchasePrice: 0,
  sellingPrice: 0,
  iva: 0,
  supplierId: null,
  categoryId: null,
  profit: 0,
};

export type ProductFormProps = {
  initialData?: ProductFormData;
  onClose?: () => void;
  onSuccess?: (data?: ProductFormData) => void;
};
