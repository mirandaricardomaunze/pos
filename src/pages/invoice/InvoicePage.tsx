import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import type { Invoice } from '../../types/invoice';
import invoiceService from '../../services/invoiceService/invoiceService';

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../../components/table/table';

const statusIcons = {
  PAID: <CheckCircleIcon className="h-5 w-5 text-green-500" title="Pago" />,
  PENDING: <ClockIcon className="h-5 w-5 text-yellow-500" title="Pendente" />,
  OVERDUE: <ExclamationCircleIcon className="h-5 w-5 text-red-500" title="Vencida" />,
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Navegador

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceService.getAll();
        setInvoices(data);
      } catch (error) {
        console.error('Erro ao buscar faturas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <div className="text-center p-4">Carregando faturas...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Faturas</h1>

        <button
          onClick={() => navigate('/invoices/new')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Fatura
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-gray-50">
              <TableCell>#{invoice.orderId}</TableCell>
              <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
              <TableCell>{statusIcons[invoice.status]}</TableCell>
              <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
