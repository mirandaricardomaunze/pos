export interface Return {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  reason?: string;
  returnedBy: string;
  carPlate?: string;
  createdAt: string;
  product: {
    name: string;
  };
  processedBy: {
    name: string;
  };
}

export interface CreateReturnDto {
  saleId: number;
  productId: number;
  quantity: number;
  reason?: string;
  returnedBy: string;
  carPlate?: string;
}

export interface ReturnProduct{
  id: number;
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
  sale?: {
    id: number;
    profit: number;
    iva: number;
    clientName: string | null;
    amountPaid: number | null;
    change: number | null;
    subTotal: number;
    total: number;
    userId: number;
    companyId: number | null;
    createdAt: string;
  }
}



export interface ReturSales {
  id: number;
  clientName: string;
  amountPaid: number;
  change: number;
  iva: number;
  profit: number;
  subTotal: number;
  total: number;
  createdAt: string;
  companyId: number;
  items: {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    price: number;
    purchasePrice: number;
    createdAt: string;
    updatedAt: string;
    product: {
      id: number;
      name: string;
      barcode: string;
      description: string;
      expiryDate: string | null;
      iva: number;
      quantity: number;
      reference: string;
      sellingPrice: number;
      profit: number;
      purchasePrice: number;
      categoryId: number | null;
      supplierId: number | null;
    };
  }[];
}

