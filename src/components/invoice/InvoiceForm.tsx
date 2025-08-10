import React, { useState } from 'react';
import { CheckIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';
import type { CreateInvoiceData } from '../../types/invoice';
import invoiceService from '../../services/invoiceService/invoiceService';
import {orderService} from '../../services/orderService/orderService'; // <-- precisa existir
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import type { Order } from '../../types/order';

const InvoiceForm: React.FC = () => {
  const [orderId, setOrderId] = useState<number | ''>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchOrders = async () => {
    if (!startDate || !endDate) {
      toast.warn('Selecione as datas para buscar encomendas.');
      return;
    }
    try {
      setIsLoadingOrders(true);
      const data = await orderService.getOrdersByDate(startDate, endDate);
      setOrders(data);
    } catch (err) {
      toast.error('Erro ao buscar encomendas.');
      console.error(err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderId === '') {
      setError('Por favor, selecione ou insira um ID de pedido válido.');
      setSuccess(null);
      return;
    }

    try {
      setIsSubmitting(true);
      const data: CreateInvoiceData = { orderId: Number(orderId) };
      await invoiceService.createInvoice(data);
      setSuccess('Fatura criada com sucesso!');
      setError(null);
      setOrderId('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(`Erro ao criar fatura. ${axiosError.response?.data?.message ?? ''}`);
      setSuccess(null);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200"
      noValidate
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Criar Fatura</h2>

      {/* FILTRO POR DATA */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Data inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Data final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={fetchOrders}
        disabled={isLoadingOrders}
        className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition disabled:opacity-50"
      >
        <MagnifyingGlassCircleIcon className="w-5 h-5" />
        {isLoadingOrders ? 'Buscando...' : 'Buscar encomendas'}
      </button>

      {/* SELECT DE ENCOMENDAS */}
      {orders.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Selecione a encomenda</label>
          <select
            onChange={(e) => setOrderId(Number(e.target.value))}
            value={orderId}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Selecione --</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                #{order.id} - {order.clientName} ({order.createdAt})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* INPUT ID DO PEDIDO */}
      <div className="mb-5 mt-4">
        <label
          htmlFor="orderId"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          ID do Pedido
        </label>
        <input
          id="orderId"
          type="number"
          min={1}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Digite ou selecione o ID do pedido"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* BOTÃO SUBMIT */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center gap-3 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckIcon className="h-6 w-6" />
        {isSubmitting ? 'Processando...' : 'Criar Fatura'}
      </button>

      {/* ALERTAS */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-400 text-green-700 rounded-md px-4 py-3 mt-5" role="alert">
          <CheckIcon className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-400 text-red-700 rounded-md px-4 py-3 mt-5" role="alert">
          <XCircleIcon className="h-6 w-6 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </form>
  );
};

export default InvoiceForm;
