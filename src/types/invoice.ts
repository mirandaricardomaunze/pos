export interface CreateInvoiceData {
  orderId: number;
}

export interface Invoice {
  id: number;
  orderId: number;
  subTotal:number;
  iva:number;
  totalAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  issuedAtISO: string;
  order?:{
     totalAmount: number;
     status:string;
     clientName:string
     iva:number;
     notes:string;
     items?:{
      product?:{
         name:string;
         quantity:number;
         sellingPrice:number
      }
     }
  }
}
