import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import { MagnifyingGlassCircleIcon, TrashIcon } from "@heroicons/react/16/solid";
import Input from "../ui/input";
import LoadingSpinner from "../loading/LoadingSpinner";
import { toast } from "react-toastify";
import { Pagination } from "../pagination/pagination";
import Button from "../ui/button";
import Modal from "../modal/modal";
import { LineChart } from "@mui/x-charts/LineChart";
import reportService from "../../services/reportservice/ReportService";
import { format, subDays, parseISO, isAfter, isBefore } from "date-fns";
import { pt } from "date-fns/locale";

type Product = { id: number; name: string; description: string; price: number; };
type SaleItem = { product: Product; quantity: number; price: number; };
type SaleReport = { id: number; createdAt: string; iva: number; items: SaleItem[]; };
type ChartData = { date: string; count: number; total: number; };
type DateRange = { start: string; end: string; };

const DEFAULT_DATE_RANGE_DAYS = 30;
const ITEMS_PER_PAGE = 5;

const formatCurrency = (value?: number) =>
  value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', minimumFractionDigits: 2 }) || "Mzn 0,00";

const formatDate = (dateString: string) =>
  format(parseISO(dateString), 'dd/MM/yyyy', { locale: pt });

export const ReportSalesTable: React.FC = () => {
  const [sales, setSales] = useState<SaleReport[]>([]);
  const [salesChart, setSalesChart] = useState<ChartData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<SaleReport | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: format(subDays(new Date(), DEFAULT_DATE_RANGE_DAYS), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });

  // Fetch vendas
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const salesData = await reportService.getReports(dateRange.start, dateRange.end);
      setSales(salesData);
      setSalesChart(transformToDailyData(salesData));
    } catch (error) {
      toast.error("Erro ao carregar vendas");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const transformToDailyData = (salesData: SaleReport[]): ChartData[] => {
    const dailyData: Record<string, { count: number; total: number }> = {};
    salesData.forEach(sale => {
      const date = sale.createdAt.split('T')[0];
      if (!dailyData[date]) dailyData[date] = { count: 0, total: 0 };
      sale.items.forEach(item => {
        dailyData[date].count += item.quantity;
        dailyData[date].total += item.price * item.quantity;
      });
    });
    return Object.entries(dailyData)
      .map(([date, { count, total }]) => ({ date, count, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const filteredSales = useMemo(() => sales.filter(sale =>
    sale.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [sales, searchTerm]);

  const paginatedSales = useMemo(() => filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ), [filteredSales, currentPage]);

  const totalSalesValue = useMemo(() => sales.reduce((sum, sale) =>
    sum + sale.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0
  ), [sales]);

  const totalItemsSold = useMemo(() => sales.reduce((sum, sale) =>
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  ), [sales]);

  const handleDelete = async () => {
    if (!reportToDelete) return;
    try {
      setLoading(true);
      await reportService.deleteReport(reportToDelete.id);
      await fetchSales();
      toast.success("Venda excluída com sucesso");
    } catch {
      toast.error("Erro ao excluir venda");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const newDate = e.target.value;
    if ((type === 'start' && isAfter(parseISO(newDate), parseISO(dateRange.end))) ||
        (type === 'end' && isBefore(parseISO(newDate), parseISO(dateRange.start)))) {
      toast.warning("Período inválido");
      return;
    }
    setDateRange(prev => ({ ...prev, [type]: newDate }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 mb-10">
      {/* Filtros e resumo */}
      <section className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatório de Vendas</h1>
          <p className="text-sm text-gray-500">Período: {formatDate(dateRange.start)} - {formatDate(dateRange.end)}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
          <label className="text-sm text-gray-600 whitespace-nowrap">Filtrar por data:</label>
          <div className="flex items-center gap-2">
            <Input type="date" value={dateRange.start} onChange={e => handleDateChange(e, 'start')} max={dateRange.end} className="w-full"/>
            <span className="text-gray-500">até</span>
            <Input type="date" value={dateRange.end} onChange={e => handleDateChange(e, 'end')} min={dateRange.start} className="w-full"/>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-blue-600">Total em Vendas</h3>
          <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalSalesValue)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-green-600">Itens Vendidos</h3>
          <p className="text-2xl font-bold text-green-800">{totalItemsSold}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-purple-600">Vendas Registradas</h3>
          <p className="text-2xl font-bold text-purple-800">{sales.length}</p>
        </div>
      </section>

      {/* Tabela */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Detalhes das Vendas</h2>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="pl-10 w-full"
              placeholder="Pesquisar por produto..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg"/></div>
        ) : sales.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma venda encontrada no período selecionado.</p>
            <Button variant="outline" className="mt-4" onClick={fetchSales}>Tentar novamente</Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-24">Data</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="min-w-40">Descrição</TableHead>
                    <TableHead className="w-20">Qtd.</TableHead>
                    <TableHead className="w-32">Preço Unit.</TableHead>
                    <TableHead className="w-32">Total</TableHead>
                    <TableHead className="w-20">IVA</TableHead>
                    <TableHead className="w-20">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.flatMap(sale =>
                    sale.items.map((item, index) => (
                      <TableRow key={`${sale.id}-${index}`} className="hover:bg-gray-50 even:bg-gray-50/50">
                        <TableCell>{formatDate(sale.createdAt)}</TableCell>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>{item.product.description || "—"}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                        <TableCell>{sale.iva}%</TableCell>
                        <TableCell>
                          <Button size="sm" variant="danger" onClick={() => { setReportToDelete(sale); setShowDeleteModal(true); }}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredSales.length > ITEMS_PER_PAGE && (
              <div className="mt-6">
                <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredSales.length / ITEMS_PER_PAGE)} onPageChange={setCurrentPage}/>
              </div>
            )}
          </>
        )}
      </section>

      {/* Gráfico LineChart */}
      {salesChart.length > 0 && (
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Evolução de Vendas</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <LineChart
              xAxis={[{ data: salesChart.map(d => formatDate(d.date)), label: "Data", scaleType: 'band' }]}
              series={[
                { data: salesChart.map(d => d.count), label: "Qtd. Vendida", color: '#3b82f6', area: true },
                { data: salesChart.map(d => d.total), label: "Valor Total (Mzn)", color: '#10b981', area: true }
              ]}
              height={400}
              margin={{ top: 20, bottom: 60, left: 50, right: 50 }}
              grid={{ vertical: true, horizontal: true }}
              slotProps={{ legend: { position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </div>
        </section>
      )}

      {/* Modal exclusão */}
      <Modal title="Confirmar Exclusão" isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <div className="space-y-4">
          <p className="text-gray-700">Tem certeza que deseja excluir a venda de <strong>{reportToDelete ? formatDate(reportToDelete.createdAt) : ''}</strong>?</p>
          {reportToDelete && (
            <div className="bg-red-50 p-3 rounded border border-red-100">
              <p className="text-sm text-red-800"><strong>Itens:</strong> {reportToDelete.items.map(i => i.product.name).join(', ')}</p>
              <p className="text-sm text-red-800 mt-1"><strong>Total:</strong> {formatCurrency(reportToDelete.items.reduce((sum, item) => sum + item.price*item.quantity, 0))}</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={loading}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete}>Confirmar Exclusão</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
