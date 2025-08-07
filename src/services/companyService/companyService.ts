// services/companyService.ts
import type { Company } from '../../types/company';
import { api } from '../api/api'; // importa o axios já configurado

const API_URL = '/companies'; 
const companyService = {

 async getCompanies  (): Promise<Company[]>  {
  const res = await api.get<Company[]>(API_URL);
  return res.data;
}
,
 async createCompany  (company: Partial<Company>): Promise<Company>  {
  const res = await api.post<Company>(API_URL, company);
  return res.data;
},

 async updateCompany  (id: number, company: Partial<Company>): Promise<Company>{
  const res = await api.put<Company>(`${API_URL}/${id}`, company);
  return res.data;
},
  async deleteCompany  (id: number): Promise<void> {
  await api.delete(`${API_URL}/${id}`);
  return;
  },
  async getCompanyById  (id: number): Promise<Company> {
    const res = await api.get<Company>(`${API_URL}/${id}`);
    return res.data;
  }
}

export default companyService;
