export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nuit?: string;
  isActive: boolean;
  companyId?: number;
  createdAt: string;
  updatedAt: string;
}