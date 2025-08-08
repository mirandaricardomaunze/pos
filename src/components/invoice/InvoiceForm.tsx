import React, { useState } from 'react';
import { CheckIcon, XCircleIcon } from '@heroicons/react/24/solid';
import type { CreateInvoiceData } from '../../types/invoice';
import invoiceService from '../../services/invoiceService/invoiceService';

const InvoiceForm: React.FC = () => {
  const [orderId, setOrderId] = useState<number | ''>('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (orderId === '') {
      setError('Por favor, insira um ID de pedido válido.');
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
      setError('Erro ao criar fatura. Tente novamente.');
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

      <div className="mb-5">
        <label
          htmlFor="orderId"
          className="block text-sm font-semibold text-gray-700 mb-2"
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
          placeholder="Digite o ID do pedido"
          required
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center items-center gap-3 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <CheckIcon className="h-6 w-6" />
        {isSubmitting ? 'Processando...' : 'Criar Fatura'}
      </button>

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
