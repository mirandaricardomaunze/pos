import type { CreateInvoiceData, Invoice } from "../../types/invoice";
import { api } from "../api/api";
const API_URL="invoices"
 const invoiceService = {
  async createInvoice(data: CreateInvoiceData) {
    const response = await api.post(API_URL, data);
    return response.data;
  },

  async getAll(): Promise<Invoice[]> {
    const response = await api.get<Invoice[]>(API_URL);
    return response.data;
  }
};

export default invoiceService;