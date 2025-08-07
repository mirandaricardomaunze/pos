

export type ReportTableProps = {
  iva: number;
  items: any;
  id: number;
    total:number;
    createdAt:string;
  sales: {
    id: number;
    total: number;
    iva:number;
    name:string;
    createdAt: string;
    items: {
      id: number;
      productId: number;
      name: string;
      iva:number
      quantity: number;
      price: number;
      createdAt: string;
      product:{
        id: number;
        name: string;
        description: string;
      }
    }[];
  }[];
};


// types/sales.ts
export interface Product {
  id: number;
  name: string;
  barcode: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  profit: number;
  iva: number;
  quantity: number;
  categoryId: number;
  supplierId: number | null;
  createdAt: string;
  updatedAt: string;
  expiryDate: string | null;
  reference: string | null;
  notificationId: number | null;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  purchasePrice: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: number;
  userId: number;
  items: SaleItem[];
  subTotal: number;
  total: number;
  iva: number;
  profit: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesReport {
  sales: Sale[];
  total: number;
}
