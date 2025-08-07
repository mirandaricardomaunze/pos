
import type { Employee } from './employee';

// Status possíveis para um pedido
export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

// Item do pedido
export interface OrderItem {
  productId: number ; // Pode ser string se for um ID de produto vindo de uma API externa
  quantity: number;
  sellingPrice:number;
  name?: string
  product: {
    id: number;
    name: string;
    iva?:number;
    sellingPrice: number;
    quantity: number;
  };
}

// Estrutura completa de um pedido
export interface Order {
  id: number;
  employeeId: number;
  employee: Employee;
  clientName?: string | null;
  paymentMethod?:string | null;
  items: OrderItem[];
  notes: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Tipo usado para criar um novo pedido (envio para backend)
export interface CreateOrderDto {
  employeeId: number;
  clientName?: string | null;
  paymentMethod?:string | null;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  notes?: string | null;
}
