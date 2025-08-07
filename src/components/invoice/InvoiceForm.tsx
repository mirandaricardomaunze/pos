import React, { useState } from 'react';
import { CheckIcon, XCircleIcon } from '@heroicons/react/24/solid';
import type { CreateInvoiceData } from '../../types/invoice';
import invoiceService from '../../services/invoiceService/invoiceService';

 const InvoiceForm: React.FC = () => {
  const [orderId, setOrderId] = useState<number>(0);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data: CreateInvoiceData = { orderId };
      await invoiceService.createInvoice(data);
      setSuccess('Fatura criada com sucesso!');
      setError(null);
    } catch (err) {
      setError('Erro ao criar fatura.');
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-md shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Criar Fatura</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">ID do Pedido</label>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(Number(e.target.value))}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        <CheckIcon className="h-5 w-5" />
        Criar Fatura
      </button>

      {success && (
        <div className="flex items-center gap-2 text-green-600 mt-2">
          <CheckIcon className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 mt-2">
          <XCircleIcon className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
export default InvoiceForm;
