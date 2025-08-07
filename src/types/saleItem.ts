
export interface SaleItem {
  productId:number;
  quantity: number;
  iva:number;
  name:string;
  sellingPrice:number;
  clientName?: string,
  amountPaid?: number, 
  change?: number
}

export interface CreateSalePayload {
 clientName?: string,
 amountPaid?: number, 
 change?: number
  items: {
    productId: number;
    quantity: number;
  }[];
}