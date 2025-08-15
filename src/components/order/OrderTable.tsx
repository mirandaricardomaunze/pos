import React, { useRef, useState, useEffect } from 'react';
import useWebSocket from '../../hooks/useWebSocket/useWebSocket';
import { useOrders } from '../../hooks/useOrder/useOrder';
import OrderCard from '../../components/order/OrderCard';
import type { OrderStatus, Order } from '../../types/order';
import { FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../loading/LoadingSpinner';
import { toast } from 'react-toastify';
import Button from '../../components/ui/button';
import { Pagination } from '../pagination/pagination';

const OrderTable: React.FC = () => {
  const { orders, loading, error, fetchOrders, changeOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;
  const notificationSoundRef = useRef(new Audio('/notification.mp3'));

  // WebSocket para atualizar pedidos em tempo real
  useWebSocket(import.meta.env.VITE_WS_URL, {
    order_created: (newOrder: Order) => {
      if (statusFilter === 'ALL' || newOrder.status === statusFilter) {
        fetchOrders(statusFilter === 'ALL' ? undefined : statusFilter);
        notificationSoundRef.current.play().catch(() => {});
      }
    },
    order_updated: (_: Order) => {
      fetchOrders(statusFilter === 'ALL' ? undefined : statusFilter);
    },
  });

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const subtotal = order.items.reduce(
      (sum, item) => sum + item.product.sellingPrice * item.quantity,
      0
    );

    const totalIva = order.items.reduce((sum, item) => {
      const iva = item.product.iva ?? 0;
      return sum + item.product.sellingPrice * item.quantity * iva;
    }, 0);

    const total = subtotal + totalIva;

    const companyInfo = {
      name: "Empresa Exemplo, Lda.",
      address: "Av. Eduardo Mondlane, Maputo",
      nif: "123456789",
    };

    printWindow.document.write(`
      <html>
        <head>
          <title>Comprovante do Pedido #${order.id}</title>
          <style>
            * { font-family: monospace; font-size: 11px; line-height: 1.4; }
            body { width: 300px; padding: 10px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .items { margin-top: 10px; width: 100%; }
            .items td { padding: 2px 0; }
            .totals { margin-top: 10px; }
            .totals td { padding: 3px 0; }
            hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="center bold">${companyInfo.name}</div>
          <div class="center">${companyInfo.address}</div>
          <div class="center">NIF: ${companyInfo.nif}</div>
          <hr />
          <div class="center bold">PEDIDO #${order.id}</div>
          <div class="center">${new Date(order.createdAt).toLocaleString('pt-BR')}</div>
          ${order.clientName ? `<div><strong>Cliente:</strong> ${order.clientName}</div>` : ''}
          <div><strong>Operador:</strong> ${order.employee?.fullName ?? '---'}</div>
          <div><strong>Pagamento:</strong> ${order.paymentMethod}</div>
          <hr />
          <table class="items">
            ${order.items
              .map(
                (item) => `
                <tr>
                  <td colspan="2">${item.product.name}</td>
                </tr>
                <tr>
                  <td>${item.quantity} x ${item.product.sellingPrice.toFixed(2)}</td>
                  <td style="text-align:right;">${(item.product.sellingPrice * item.quantity).toFixed(2)}</td>
                </tr>
              `
              )
              .join('')}
          </table>
          <hr />
          <table class="totals" style="width:100%;">
            <tr>
              <td>Subtotal</td>
              <td style="text-align:right;">MZN ${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>IVA</td>
              <td style="text-align:right;">MZN ${totalIva.toFixed(2)}</td>
            </tr>
            <tr class="bold">
              <td>Total</td>
              <td style="text-align:right;">MZN ${total.toFixed(2)}</td>
            </tr>
          </table>
          ${order.notes ? `<div><em>Obs: ${order.notes}</em></div>` : ''}
          <hr />
          <div class="center">Processado por: ${order.employee?.fullName ?? '---'}</div>
          <div class="center">Obrigado pela preferência!</div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
  };

  const handleStartProcessing = async (orderId: number) => {
    try {
      await changeOrderStatus(orderId, 'IN_PROGRESS');
      toast.success('Pedido em andamento com sucesso!');
    } catch (err) {
      console.error('Failed to start processing order:', err);
      toast.error('Erro ao iniciar o processamento do pedido');
    }
  };

  const handleComplete = async (orderId: number) => {
    try {
      await changeOrderStatus(orderId, 'COMPLETED');
      toast.success('Pedido concluído com sucesso!');
    } catch (err) {
      console.error('Failed to complete order:', err);
      toast.error('Erro ao concluir o pedido');
    }
  };

  // Filtra pedidos pelo status
  const filteredOrders =
    statusFilter === 'ALL'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(Math.ceil(filteredOrders.length / itemsPerPage), 1);

  useEffect(() => {
    setCurrentPage(1); // Reseta página ao trocar filtro
  }, [statusFilter, orders]);

  const handleRefresh = () => {
    toast.info('Atualizando lista de pedidos...');
    setRefreshing(true);
    fetchOrders(statusFilter === 'ALL' ? undefined : statusFilter).finally(() =>
      setRefreshing(false)
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => {
              const value = e.target.value as OrderStatus | 'ALL';
              setStatusFilter(value);
              fetchOrders(value === 'ALL' ? undefined : value);
            }}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendentes</option>
            <option value="IN_PROGRESS">Em preparo</option>
            <option value="COMPLETED">Concluídos</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {currentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum pedido encontrado</div>
        ) : (
          currentOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPrint={() => handlePrint(order)}
              onStartProcessing={handleStartProcessing}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default OrderTable;
