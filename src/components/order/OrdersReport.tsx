import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/table";
import Input from "../ui/input";
import LoadingSpinner from "../loading/LoadingSpinner";
import { LineChart } from "@mui/x-charts/LineChart";
import reportService from "../../services/reportservice/ReportService";
import type { OrderReport } from "../../types/report";

type ChartData = {
  date: string;
  count: number;
  total: number;
};

// Função para formatar datas
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-MZ"); // dd/MM/yyyy
};

// Função para formatar valores monetários
const formatCurrency = (value?: number) =>
  value?.toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 2
  }) || "Mzn 0,00";

export const OrdersReport: React.FC = () => {
  const [orders, setOrders] = useState<OrderReport[]>([]);
  const [ordersChart, setOrdersChart] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const itemsPerPage = 5;

  // Buscar pedidos do servidor
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await reportService.getOrdersReport(dateRange.start, dateRange.end);

      // Formata chartData para exibição
      const chartData: ChartData[] = (data.chartData || []).map((d: { date: string; count: any; total: any }) => ({
        date: formatDate(d.date),
        count: Number(d.count),
        total: Number(d.total),
      }));

      // Calcula total de cada pedido somando quantity * price de cada item
      const ordersWithTotal: OrderReport[] = (data.orders || []).map((order: { items: any[] }) => ({
        ...order,
        total: order.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
      }));

      setOrders(ordersWithTotal);
      setOrdersChart(chartData);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  // Paginação
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
    setDateRange(prev => ({ ...prev, [type]: e.target.value }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 mb-15">
      {/* Filtros de datas */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Relatório de Pedidos</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Período:</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange(e, "start")}
                max={dateRange.end}
              />
              <span className="text-gray-500">até</span>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange(e, "end")}
                min={dateRange.start}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabela de pedidos */}
      <section className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">Nenhum pedido encontrado no período selecionado.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map(order => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.clientName || "—"}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "completed" ? "bg-green-100 text-green-800" :
                          order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>{order.paymentMethod || "—"}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação Next / Previous */}
            {orders.length > itemsPerPage && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Gráfico de pedidos */}
      {ordersChart.length > 0 && (
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Evolução de Pedidos</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <LineChart
              xAxis={[{
                data: ordersChart.map(d => d.date),
                label: "Data",
                scaleType: "band"
              }]}
              series={[
                { data: ordersChart.map(d => d.count), label: "Quantidade de Pedidos", color: "#8b5cf6" },
                { data: ordersChart.map(d => d.total), label: "Valor Total (Mzn)", color: "#ec4899" },
              ]}
              height={300}
              margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>
        </section>
      )}
    </div>
  );
};
