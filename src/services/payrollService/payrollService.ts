import type { SummaryItem } from '../../types/dasboardRh';
import type { CreatePayrollDto, Payroll } from '../../types/payroll';
import { api } from '../api/api'; // <- axios instance configurado com baseURL e token


export const payrollService = {
  async create(data: CreatePayrollDto): Promise<Payroll> {
    const res = await api.post('/payrolls', data);
    return res.data;
  },

  async getAll(): Promise<Payroll[]> {
    const res = await api.get('/payrolls/company');
    console.log('Payrolls fetched:', res.data);  
    return res.data;
  },

  async markAsPaid(id: number): Promise<Payroll> {
   const res= await api.patch(`/payrolls/pay/${id}`);
    console.log('Payroll marked as paid:', res.data);
    return res.data;

  },

  async getSummary(period: '1m' | '3m' | '6m' | '1y' = '6m'): Promise<SummaryItem[]> {
    const res = await api.get(`/payrolls/summary?period=${period}`);
    console.log('Payroll summary:', res.data);
    return res.data;
  },
};
