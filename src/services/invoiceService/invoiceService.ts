import { toast } from "react-toastify";
import type { CreateInvoiceData, Invoice } from "../../types/invoice";
import { api } from "../api/api";

const API_URL = "invoices";

const showError = (error: any): never => {
  let message = error?.response?.data?.message || "Erro inesperado";

  if (error.response) {
    const { status } = error.response;
    const messages: Record<number, string> = {
      400: `Requisição inválida: ${message}`,
      401: "Não autorizado. Faça login novamente.",
      403: "Acesso negado.",
      404: "Recurso não encontrado.",
      500: "Erro interno do servidor.",
    };
    message = messages[status] || message;
  } else if (error.request) {
    message = "Sem resposta do servidor. Verifique sua conexão.";
  } else {
    message = `Erro na requisição: ${error.message}`;
  }

  toast.error(message);
  throw new Error(message);
};

const handleSuccess = (msg: string) => toast.success(msg);

const invoiceService = {
  async createInvoice(data: CreateInvoiceData) {
    try {
      const { data: invoice } = await api.post<Invoice>(API_URL, data);
      handleSuccess("Fatura criada com sucesso!");
      return invoice;
    } catch (error) {
      return showError(error);
    }
  },

  async getAll() {
    try {
      const { data } = await api.get<Invoice[]>(API_URL);
       console.log("Faturas", data);
       
      return data;
    } catch (error) {
      return showError(error);
    }
  },

  async getById(id: number) {
    try {
      const { data } = await api.get<Invoice>(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      return showError(error);
    }
  },

  async updateInvoice(id: number, data: Partial<CreateInvoiceData>) {
    try {
      const { data: invoice } = await api.put<Invoice>(`${API_URL}/${id}`, data);
      handleSuccess("Fatura atualizada com sucesso!");
      return invoice;
    } catch (error) {
      return showError(error);
    }
  },

  async deleteInvoice(id: number) {
    try {
      await api.delete(`${API_URL}/${id}`);
      handleSuccess("Fatura excluída com sucesso!");
    } catch (error) {
      return showError(error);
    }
  },
};

export default invoiceService;
