import { api } from "../api/api";
import type { CreateOrderDto, Order, OrderStatus } from "../../types/order";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  return "Erro inesperado ao comunicar com o servidor.";
}

export const orderService = {
  getOrders: async (status?: OrderStatus): Promise<Order[]> => {
    try {
      const response = await api.get<Order[]>("/orders", {
        params: status ? { status } : undefined,
      });
      return response.data;
    } catch (error) {
      toast.error("Erro ao buscar pedidos.");
      console.error("getOrders Error:", error);
      return [];
    }
  },

  getOrderById: async (id: number): Promise<Order | null> => {
    try {
      const response = await api.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Erro ao buscar pedido por ID.");
      console.error("getOrderById Error:", error);
      return null;
    }
  },

  createOrder: async (orderData: CreateOrderDto): Promise<Order | null> => {
    try {
      const response = await api.post<Order>("/orders", orderData);
      toast.success("Pedido criado com sucesso!");
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("createOrder Error:", error);
      return null;
    }
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order | null> => {
    try {
      const response = await api.patch<Order>(`/orders/${id}`, { status });
      toast.success("Status do pedido atualizado!");
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("updateOrderStatus Error:", error);
      return null;
    }
  },

  startOrderProcessing: async (id: number): Promise<Order | null> => {
    try {
      const response = await api.patch<Order>(`/orders/${id}/start-processing`);
      toast.success("Processamento do pedido iniciado!");
      return response.data;
    } catch (error) {
      toast.error("Erro ao iniciar processamento.");
      console.error("startOrderProcessing Error:", error);
      return null;
    }
  },

  completeOrder: async (id: number): Promise<Order | null> => {
    try {
      const response = await api.patch<Order>(`/orders/${id}/complete`);
      toast.success("Pedido finalizado com sucesso!");
      return response.data;
    } catch (error) {
      toast.error("Erro ao completar o pedido.");
      console.error("completeOrder Error:", error);
      return null;
    }
  },

  deleteOrder: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/orders/${id}`);
      toast.success("Pedido excluído com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao excluir o pedido.");
      console.error("deleteOrder Error:", error);
      return false;
    }
  },

  getRecent: async (): Promise<Order | null> => {
    try {
      const res = await api.get("/orders/recent");
      console.log("Pedidos recentes:", res.data);
      return res.data;
    } catch (error) {
      toast.error("Erro ao buscar últimos pedidos.");
      console.error("getRecent Error:", error);
      return null;
    }
  },

};
