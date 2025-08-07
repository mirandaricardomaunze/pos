// src/services/reportService.ts
import { api } from '../../services/api/api';

const reportService ={
   getPeports:async (startDate: string, endDate: string) =>{
  const response = await api.get(`/sales/report?startDate=${startDate}&endDate=${endDate}`);
  console.log("Sales report fetched:", response.data);
  return response.data.sales;
},
 deleteReport: async (id: number) => {
    await api.delete(`$sales/report/${id}`);
  }
}

export default reportService;