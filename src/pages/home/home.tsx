import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import saleService from "../../services/saleService/saleService";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale/pt";
import { orderService } from "../../services/orderService/orderService";
import type { Sale } from "../../types/sales";
import type { Order } from "../../types/order";
import { CubeIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/20/solid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table/table"; // ajuste o caminho se necessário

const Home: React.FC = () => {
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, orders] = await Promise.all([
          saleService.getRecent(),
          orderService.getRecent(),
        ]);
        console.log("vendas", sales || "vazio");
        console.log("Pedidos", orders || "vazio");

        setRecentSales(sales);
        setRecentOrders(Array.isArray(orders) ? orders : []);
      } catch (err) {
        console.error("Erro ao buscar dados recentes", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">
            Sistema de PDV e Estoque
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Gerencie suas vendas e pedidos com eficiência.
          </p>

          {/* Links rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link
              to="/pos"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-blue-100 hover:border-blue-300"
              style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
            >
              <div className="text-blue-600 mb-3">
                {/* ícone de carrinho */}
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Ponto de Venda</h3>
              <p className="text-gray-500 text-sm">Registre suas vendas</p>
            </Link>

            <Link
              to="/orders"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-blue-100 hover:border-blue-300"
              style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
            >
              <div className="text-blue-600 mb-3">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pedidos</h3>
              <p className="text-gray-500 text-sm">Veja e gerencie os pedidos</p>
            </Link>

            <Link
              to="/reports"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-blue-100 hover:border-blue-300"
              style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
            >
              <div className="text-blue-600 mb-3">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Relatórios</h3>
              <p className="text-gray-500 text-sm">Resumo do desempenho</p>
            </Link>
          </div>

          {/* Listas Recentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-10">
            {/* Últimas Vendas */}
            <div className="bg-white shadow-md rounded-lg p-5 overflow-auto">
              <h2 className="text-lg font-semibold mb-3 text-blue-600">
                <ShoppingCartIcon className="h-5 w-5 inline" /> Últimas Vendas
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.length > 0 ? (
                    recentSales.map((saleItem) => (
                      <TableRow key={saleItem.id}>
                        <TableCell>0{saleItem.id}</TableCell>
                        <TableCell>{saleItem?.clientName ?? "---"}</TableCell>
                        <TableCell>{saleItem?.items?.[0]?.product?.name ?? "---"}</TableCell>
                        <TableCell>{saleItem?.items?.[0]?.quantity ?? "---"}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(saleItem.createdAt), {
                            addSuffix: true,
                            locale: pt,
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="italic text-center text-gray-400">
                        Nenhuma venda recente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Últimos Pedidos */}
            <div className="bg-white shadow-md rounded-lg p-5 overflow-auto">
              <h2 className="text-lg font-semibold mb-3 text-blue-600">
                <CubeIcon className="h-5 w-5 inline" /> Últimos Pedidos
              </h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.items?.[0]?.product?.name ?? "---"}</TableCell>
                        <TableCell>{order.items?.[0]?.quantity ?? "---"}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(order.createdAt), {
                            addSuffix: true,
                            locale: pt,
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="italic text-center text-gray-400">
                        Nenhum pedido recente
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
