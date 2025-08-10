import React, { useState, useEffect } from "react";
import { 
  CheckIcon, 
  XCircleIcon, 
  MagnifyingGlassCircleIcon, 
  DocumentTextIcon 
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import type { CreateInvoiceData } from "../../types/invoice";
import invoiceService from "../../services/invoiceService/invoiceService";
import { orderService } from "../../services/orderService/orderService";
import { toast } from "react-toastify";
import type { Order } from "../../types/order";
import Input from "../ui/input";
import Button from "../ui/button";

const InvoiceForm: React.FC = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<number | "">("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    if (orderId !== "") clearMessages();
  }, [orderId]);

  const fetchOrders = async () => {
    if (!startDate || !endDate) {
      return toast.warn("Selecione as datas para buscar encomendas.");
    }
    try {
      setIsLoadingOrders(true);
      const data = await orderService.getOrdersByDate(startDate, endDate);
      setOrders(data);
      setOrderId("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      toast.error(`Erro ao buscar encomendas. ${msg}`);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId === "") {
      setError("Selecione ou insira um ID de pedido válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      await invoiceService.createInvoice({ orderId: Number(orderId) } as CreateInvoiceData);
      setSuccess("Fatura criada com sucesso!");
      toast.success("Fatura criada com sucesso!");
      setOrderId("");
      setOrders([]);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      toast.error(`Erro ao criar fatura. ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setOrders([]);
    setOrderId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-10 mb-15 bg-white rounded-2xl shadow-lg border border-gray-100"
      noValidate
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Criar Nova Fatura</h2>
        <p className="text-gray-500 mt-2">Preencha os dados para gerar uma fatura</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data inicial</label>
          <Input
            type="date"
            value={startDate}
            onChange={handleDateChange(setStartDate)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data final</label>
          <Input
            type="date"
            value={endDate}
            onChange={handleDateChange(setEndDate)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={fetchOrders}
        disabled={isLoadingOrders || isSubmitting}
        className="w-full mb-8"
      >
        <MagnifyingGlassCircleIcon className="w-5 h-5 mr-2" />
        {isLoadingOrders ? "Buscando..." : "Buscar Encomendas"}
      </Button>

      {orders.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Selecione a encomenda</label>
          <select
            onChange={(e) => setOrderId(Number(e.target.value))}
            value={orderId}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">Selecione a encomenda</option>
            {orders.map(({ id, clientName, createdAt }) => (
              <option key={id} value={id}>
                #{id} - {clientName} ({new Date(createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-8">
        <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
          ID do Pedido
        </label>
        <Input
          id="orderId"
          type="number"
          min={1}
          value={orderId}
          onChange={(e) => setOrderId(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Digite ou selecione o ID do pedido"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          <CheckIcon className="h-5 w-5" />
          {isSubmitting ? "Processando..." : "Criar Fatura"}
        </Button>

        <Button
          type="button"
          onClick={() => navigate("/invoices")}
          className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
        >
          <DocumentTextIcon className="h-5 w-5 mr-2" />
          Ver Tabela de Faturas
        </Button>
      </div>

      {success && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mt-6">
          <CheckIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mt-6">
          <XCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </form>
  );
};

export default InvoiceForm;
