import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService/dashboardService';
import type { DashboardStats, SaleData, TopProduct } from '../../types/dashboard';
import DashboardCard from '../../components/dashboardCard/DashboardCard';
import {  BarChart, PieChart } from '@mui/x-charts';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SaleData []>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardStats, salesStats, topProductsRes] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getSalesStats(),
          dashboardService.getTopProducts()
        ]);
        setStats(dashboardStats);
        setSalesData(salesStats);
        setTopProducts(topProductsRes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 w-full bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total de Vendas"
          value={stats.todaySales?.toLocaleString() || "0"}
          icon={<ChartBarSquareIcon className="w-6 h-6" />}
          trend={stats.salesTrend}
          changeText={stats.salesChange}
          bgColor="bg-blue-100"
          textColor="text-blue-800"
        />
        <DashboardCard
          title="Lucro Total"
          value={formatCurrency(stats.totalProfit)}
          icon={stats.growthTrend === 'up' ? <ArrowUpIcon className="w-6 h-6" /> : <ArrowDownIcon className="w-6 h-6" />}
          trend={stats.growthTrend}
          changeText={stats.growthChange}
          bgColor="bg-green-100"
          textColor="text-green-800"
        />
        <DashboardCard
          title="Produtos Vendidos"
          value={stats.totalProducts?.toLocaleString() || "0"}
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          trend="neutral"
          changeText=""
          bgColor="bg-purple-100"
          textColor="text-purple-800"
        />
        <DashboardCard
          title="Itens com Baixo Estoque"
          value={stats.lowStockItems?.toLocaleString() || "0"}
          icon={<ExclamationTriangleIcon className="w-6 h-6" />}
          trend={stats.stockTrend}
          changeText={stats.stockChange}
          bgColor="bg-amber-100"
          textColor="text-amber-800"
        />
      </div>
      
      {/* Gráficos */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="p-4 mb-4 mt-4">
            <h2 className="text-xl font-bold mb-2">Vendas e Lucro Mensal</h2>
            <BarChart
              xAxis={[{ data: salesData.map((s) => s.month), label: "Mês" }]}
              series={[
                {
                  data: salesData.map((s) => s.total),
                  label: "Vendas (Mzn)",
                  color: "#1976d2",
                },
                {
                  data: salesData.map((s) => s.profit),
                  label: "Lucro (Mzn)",
                  color: "#2e7d32",
                },
              ]}
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Produtos Mais Vendidos</h2>
            <BarChart
              xAxis={[{
                scaleType: "band",
                data: topProducts.map((p) => p.name),
                label: "Produto",
              }]}
              series={[{
                data: topProducts.map((p) => p.quantitySold),
                label: "Quantidade Vendida",
                color: "#ff9800",
              }]}
              width={400}
              height={300}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Distribuição de Lucro</h2>
            <PieChart
              series={[{
                data: salesData.map((s) => ({ 
                  id: s.month, 
                  value: s.profit, 
                  label: s.month 
                })),
                innerRadius: 60,
                outerRadius: 100,
              }]}
              width={400}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;