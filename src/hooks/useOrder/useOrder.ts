// hooks/useOrder/useOrder.ts
import { useState, useEffect } from 'react';
import type { Order, OrderStatus, CreateOrderDto } from '../../types/order';
import { orderService } from '../../services/orderService/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async (status?: OrderStatus) => {
    try {
      setLoading(true);
      const data = await orderService.getOrders(status);
      setOrders(data);
      console.log("Orders fetched successfully", data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      setError('Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (dto: CreateOrderDto) => {
    try {
      const newOrder = await orderService.createOrder(dto);
      if (!newOrder) throw new Error('Erro ao criar pedido');
      setOrders(prev => [newOrder, ...prev]);
    } catch (err: any) {
      console.error('Erro ao adicionar pedido:', err);
      setError(err?.message || 'Erro ao adicionar pedido');
    }
  };

  const changeOrderStatus = async (orderId: number, status: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      if (!updated) throw new Error('Pedido não encontrado ou erro ao atualizar');

      setOrders(prev =>
        prev.map(order => (order.id === updated.id ? updated : order))
      );
    } catch (err: any) {
      console.error('Erro ao mudar status do pedido:', err);
      setError(err?.message || 'Erro ao mudar status do pedido');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    changeOrderStatus,
  };
};
