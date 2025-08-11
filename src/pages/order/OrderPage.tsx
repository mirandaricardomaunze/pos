import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTable from '../../components/order/OrderTable';

const OrderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex-grow bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Pedidos
          </h1>

          <button
            onClick={() => navigate('/orders/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Novo Pedido
          </button>
        </div>

        <OrderTable />
      </div>
    </main>
  );
};

export default OrderPage;
