import React from 'react';
import type { Order } from '../../types/order';
import {
  PrinterIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface OrderCardProps {
  order: Order;
  onPrint: (order: Order) => void;
  onStartProcessing: (id: number) => void;
  onComplete: (id: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPrint,
  onStartProcessing,
  onComplete,
}) => {
  const getStatusBadge = () => {
    let text = '';
    let color = '';

    switch (order.status) {
      case 'PENDING':
        text = 'Pendente';
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'IN_PROGRESS':
        text = 'Em preparo';
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'COMPLETED':
        text = 'Concluído';
        color = 'bg-green-100 text-green-800';
        break;
    }

    return (
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${color}`}
      >
        {text}
      </span>
    );
  };

  // Calcula subtotal (sem IVA)
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );

  // Calcula valor total do IVA somando IVA de cada item
  const totalIva = order.items.reduce((sum, item) => {
    const ivaPercent = item.product.iva ?? 0; // pega o IVA do produto (ex: 0.17 para 17%)
    const itemTotal = item.product.sellingPrice * item.quantity;
    return sum + itemTotal * ivaPercent;
  }, 0);

  // Total final com IVA
  const totalComIva = subtotal + totalIva;

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white mb-6 transition hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Pedido #{order.id}
        </h3>
        {getStatusBadge()}
      </div>

      <div className="text-sm text-gray-600 mb-3 space-y-1">
        <p>
          <span className="font-medium text-gray-700">Funcionário:</span>{' '}
          {order.employee.fullName}
        </p>
        {order.clientName && (
          <p>
            <span className="font-medium text-gray-700">Cliente:</span>{' '}
            {order.clientName}
          </p>
        )}
        <p>
          <span className="font-medium text-gray-700">Data:</span>{' '}
          {new Date(order.createdAt).toLocaleString('pt-MZ')}
        </p>
        <p>
          <span className="font-medium text-gray-700">Pagamento:</span>{' '}
          {order.paymentMethod ||"Não definido"}
        </p>
      </div>

      {order.notes && (
        <div className="bg-gray-50 border border-gray-100 p-3 rounded-md mb-4">
          <p className="text-sm italic text-gray-500">"{order.notes}"</p>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Itens:</h4>
        <ul className="text-sm space-y-2">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between border-b pb-1 text-gray-700"
            >
              <span>
                {item.quantity} x {item.product.name}
              </span>
              <span>
                MZN {(item.product.sellingPrice * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm font-semibold text-gray-700 space-y-1 mb-4">
        <p>
          Subtotal:{' '}
          <span className="text-gray-800">MZN {subtotal.toFixed(2)}</span>
        </p>
        <p>
          IVA:{' '}
          <span className="text-yellow-700">MZN {totalIva.toFixed(2)}</span>
        </p>
        <p>
          Total com IVA:{' '}
          <span className="text-green-600 font-bold">
            MZN {totalComIva.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm font-semibold text-gray-700">
          {/* Você pode optar por repetir o total aqui, ou deixar vazio */}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onPrint(order)}
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
            title="Imprimir"
          >
            <PrinterIcon className="h-5 w-5" />
          </button>

          {order.status === 'PENDING' && (
            <button
              onClick={() => onStartProcessing(order.id)}
              className="p-2 rounded hover:bg-blue-100 text-blue-600"
              title="Iniciar preparo"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          )}

          {order.status !== 'COMPLETED' && (
            <button
              onClick={() => onComplete(order.id)}
              className="p-2 rounded hover:bg-green-100 text-green-600"
              title="Concluir pedido"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
