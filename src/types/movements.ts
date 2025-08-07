// types/movements.ts

export interface MovementDetail {
  name: string;
  quantity: number;
  price: number;
}

export interface Movement {
  id: number;
  type: string;
  entityType: string;
  entityId: number;
  description: string;
  clientName: string;
  amountPaid: number;
  change: number;
  details:MovementDetail[] | MovementDetail | null;// agora é um array
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}
