import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';

import returnService from '../../services/returnService/returnService';
import type { CreateReturnDto, ReturSales } from '../../types/returns';

import Button from '../../components/ui/button';
import Input from '../ui/input';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

export default function ReturnForm() {
  const [sales, setSales] = useState<ReturSales[]>([]);
  const [filteredSales, setFilteredSales] = useState<ReturSales[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<
    ReturSales['items']
  >([]);

  const [form, setForm] = useState<CreateReturnDto>({
    saleId: 0,
    productId: 0,
    quantity: 1,
    returnedBy: '',
    reason: '',
    carPlate: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [salesData] = await Promise.all([
          returnService.getSales(),
          returnService.getProductsReturned(),
        ]);
        setSales(salesData);
        setFilteredSales(salesData);
      } catch (err) {
        toast.error('Erro ao carregar dados iniciais');
      }
    };

    fetchInitialData();
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      try {
        if (term.trim() === '') {
          setFilteredSales(sales);
          return;
        }
        const result = await returnService.searchSales(term);
        setFilteredSales(result);
      } catch (err) {
        toast.error('Erro ao buscar vendas');
      }
    }, 500),
    [sales]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSale = sales.find((s) => s.id === form.saleId);
    if (!selectedSale) {
      toast.error('Venda selecionada não encontrada.');
      return;
    }

    const selectedProduct = selectedSale.items.find(
      (item) => item.productId === form.productId
    );

    if (!selectedProduct) {
      toast.error('O produto selecionado não corresponde ao da venda.');
      return;
    }

    try {
      await returnService.create(form);
      toast.success('Retorno registrado com sucesso');
      navigate('/returns');
    } catch (err) {
      toast.error('Erro ao registrar retorno');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-10 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Registrar Retorno</h2>
        <Button onClick={() => navigate('/returns')} className="btn-primary">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de busca */}
        <div>
          <label className="block text-sm font-medium">Buscar venda</label>
          <Input
            type="text"
            placeholder="Digite nome do cliente ou ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Selecionar Venda */}
        <div>
          <label className="block text-sm font-medium">Venda</label>
          <select
            value={form.saleId}
            onChange={(e) => {
              const saleId = Number(e.target.value);
              const selectedSale = sales.find((s) => s.id === saleId);
              setForm({ ...form, saleId, productId: 0 });
              setFilteredProducts(selectedSale?.items || []);
            }}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecione uma venda</option>
            {filteredSales.map((sale) => (
              <option key={sale.id} value={sale.id}>
                Venda 00{sale.id} - Cliente: {sale.clientName ?? 'Não informado'} - Produto:{' '}
                {sale.items?.[0]?.product?.name ?? 'Sem produto'}
              </option>
            ))}
          </select>
        </div>

        {/* Selecionar Produto */}
        <div>
          <label className="block text-sm font-medium">Produto</label>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: Number(e.target.value) })}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Selecione um produto</option>
            {filteredProducts.map((item) => (
              <option key={item.product.id} value={item.productId}>
                {item.product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantidade */}
        <div>
          <label className="block text-sm font-medium">Quantidade</label>
          <Input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Quem devolveu */}
        <div>
          <label className="block text-sm font-medium">Quem devolveu</label>
          <Input
            type="text"
            value={form.returnedBy}
            onChange={(e) => setForm({ ...form, returnedBy: e.target.value })}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Matrícula */}
        <div>
          <label className="block text-sm font-medium">Matrícula do carro (opcional)</label>
          <Input
            type="text"
            value={form.carPlate}
            onChange={(e) => setForm({ ...form, carPlate: e.target.value })}
            className="w-full border border-gray-300 px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium">Motivo</label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 px-3 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <Button type="submit" className="btn-primary w-full">
          Registrar
        </Button>
      </form>
    </div>
  );
}
