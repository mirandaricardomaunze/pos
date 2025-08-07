
export type ReportTableProps = {
  reportData: {
    sales: any[];
    total?: number;
  } | null;
}


 export type DateFilterProps = {
  startDate: string;
  endDate: string;
  onChange: (type: 'start' | 'end', value: string) => void;
};


export type SalesReportData = {
  sales: any[];
  total?: number;
};

export interface Sale {
  id: number;
  createdAt: string;
  total: number;
}

export interface SalesData {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  reason: string;
  returnedBy: string;
  processedById: number;
  clientName: string | null;
  carPlate: string;
  createdAt: string;
  updatedAt: string;
  items: {
    quantity: number; // ADICIONADO para evitar erro com RecentSalesItem
    product: {
      id: number;
      name: string;
      reference: string;
      expiryDate: string | null;
      description: string;
      iva: number;
      quantity: number;
      barcode: string;
      purchasePrice: number;
      sellingPrice: number;
      profit: number;
    };
    sale: {
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
      updatedAt: string;
    };
    processedBy: {
      id: number;
      name: string;
    };
  };
}

export interface Product {
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
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  purchasePrice: number;
  price: number;
  product: Product;
}

export interface Sale {
  id: number;
  clientName: string | null;
  createdAt: string;
  updatedAt: string;
  total: number;
  iva: number;
  amountPaid: number;
  change: number;
  subTotal: number;
  userId: number;
  items: SaleItem [];
}



  

