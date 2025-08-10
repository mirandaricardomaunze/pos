import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../../hooks/useProduct';
import { useOrders } from '../../hooks/useOrder/useOrder';
import employeeService from '../../services/employeesService/employeesService';
import {
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import type { Employee } from '../../types/employee';
import type { OrderItem } from '../../types/order';
import Button from '../ui/button';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingSpinner from '../loading/LoadingSpinner';
import { toast } from 'react-toastify';
import Input from '../ui/input';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid';

const OrderForm: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<number | ''>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | ''>('');
  const [productSearch, setProductSearch]=useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const companyId = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).companyId : null;
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await employeeService.getByCompanyId(Number(companyId()));
        setEmployees(data);
      } catch (err) {
        console.error('Erro ao carregar funcionários:', err);
        toast.error('Erro ao carregar funcionários');
      } finally {
        setEmployeesLoading(false);
      }
    };
    fetchEmployees();
  }, [companyId]);

  const handleAddItem = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existingItem = orderItems.find(item => item.productId === product.id);

    if (existingItem) {
      const novosItens = orderItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setOrderItems(novosItens);
      toast.info(`Quantidade aumentada para ${product.name}`);
    } else {
      const newItem: OrderItem = {
        name: product.name,
        sellingPrice: product.sellingPrice,
        productId: product.id ?? 0,
        quantity,
        product: {
          ...product,
          id: product.id ?? 0,
        },
      };
      setOrderItems([...orderItems, newItem]);
      toast.success(`${product.name} adicionado ao pedido`);
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId: number) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setOrderItems(
      orderItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedEmployee) {
      setError('Selecione um funcionário');
      return;
    }
    if (!paymentMethod) {
      setError('Selecione a forma de pagamento');
      return;
    }
    if (orderItems.length === 0) {
      setError('Adicione pelo menos um produto ao pedido');
      return;
    }

    try {
      await addOrder({
        employeeId: selectedEmployee,
        clientName,
        paymentMethod,
        notes,
        items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      toast.success('Pedido criado com sucesso!');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      setError('Erro ao criar pedido. Tente novamente.');
      toast.error('Erro ao criar pedido.');
    }
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.product.sellingPrice * item.quantity,
    0
  );

  const totalIva = orderItems.reduce((sum, item) => {
    let iva = item.product.iva ?? 0;
    if (iva>0) {
      iva=iva/100
    }
    const itemTotal = item.product.sellingPrice * item.quantity;
    return sum + itemTotal * iva;
  }, 0);


  const total = subtotal + totalIva;

  const filtredProducts=products
  .filter((product)=>product.quantity>0)
  .filter(product=>product.name.toLowerCase().includes(productSearch.toLowerCase().trim()))

  if (productsLoading || employeesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto mb-10 mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={() => navigate('/orders')}
          type="button"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Novo Pedido</h1>
        <div className="w-20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
      <label className="block text-sm font-medium text-gray-700 mb-1">Pesquisar Produto</label>
      <div className="relative mb-2">
        <MagnifyingGlassCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="Digite para buscar produto"
          className="w-full pl-10 rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
        {/* Funcionário */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Funcionário <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(Number(e.target.value) || '')}
            required
            className="w-full outline-0 rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Selecione um funcionário</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Forma de Pagamento */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Forma de Pagamento <span className="text-red-500">*</span>
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="w-full rounded-lg outline-0 border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Selecione...</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
            <option value="Transferência">Transferência</option>
            <option value="M-pesa">M-pesa</option>
          </select>
        </div>

        {/* Produtos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Adicionar Produtos</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center items-center ">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(Number(e.target.value) || '')}
                className="w-full outline-0 rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Selecione um produto</option>
                {filtredProducts
                  .filter((product) => product.quantity > 0)
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.sellingPrice)} (Estoque: {product.quantity})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                >
                  <MinusIcon className="h-4 w-4 text-gray-700" />
                </button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <PlusIcon className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              disabled={!selectedProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
            >
              Adicionar
            </button>
          </div>

          {/* Lista de itens adicionados */}
          {orderItems.length > 0 ? (
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderItems.map((item) => (
                    <tr key={item.productId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </button>
                          <span className="text-sm text-gray-700">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrency(item.product.sellingPrice)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">
                        {formatCurrency(item.product.sellingPrice * item.quantity)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 bg-gray-50">
              Nenhum produto adicionado ao pedido
            </div>
          )}
        </div>

        {/* Notas e Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nome do Cliente</label>
            <Input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do cliente (opcional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
             <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: entregar urgente..."
              className="w-full rounded-lg outline-0 border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:shadow-md focus:shadow-blue-100 transition-all resize"
            />
          </div>
        </div>

        {/* Total e Enviar */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 gap-4">
          <div className="text-lg font-semibold bg-gray-100 px-4 py-2 rounded-lg">
            Total: <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>

          <div className="flex gap-3 w-full max-w-sm sm:max-w-none">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={orderItems.length === 0 || !selectedEmployee || !paymentMethod}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[42px]"
            >
              <CheckIcon className="h-5 w-5" />
              Enviar Pedido
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
