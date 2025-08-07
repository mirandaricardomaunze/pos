import type { Customer } from '../../types/customer';
import { api } from '../api/api';


const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const res = await api.get('/customers');
    return res.data;
  },
  create: async (data: Partial<Customer>): Promise<Customer> => {
    const res = await api.post('/customers', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const res = await api.put(`/customers/${id}`, data);
    return res.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};

export default customerService;