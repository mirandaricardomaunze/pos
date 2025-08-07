import { api } from "../api/api";
import type { Notification } from "../../types/notifications";

export const notificationService = {
   getAll : async () => {
    const response = await api.get<Notification[]>('/notification/pending');
    console.log("Notificacoes", response.data);
    
    return response.data;
  },
  markAsRead: async (id: number) => {
    const response = await api.patch(`/notification/${id}/read`);
    return response.data;
  },
  getUnreadCount: async () => {
    const response = await api.get<{ count: number }>('/notification/unread-count');
    return response.data.count;
  },
};