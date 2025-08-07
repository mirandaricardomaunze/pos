export interface CreateInvoiceData {
  orderId: number;
}

export interface Invoice {
  id: number;
  orderId: number;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  createdAt: string;
}
