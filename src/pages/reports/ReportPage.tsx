import { useEffect, useState, useRef } from "react";
import { CalendarIcon, ArrowDownTrayIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ReportTableProps } from "../../types/report";
import { ReportTable } from "../../components/report/ReportTable";
import reportService from "../../services/reportservice/ReportService";
import Button from "../../components/ui/button";
import { utils, writeFile } from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

export default function ReportPage() {
  const [sales, setSales] = useState<ReportTableProps[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await reportService.getPeports(startDate, endDate);
        setSales(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [startDate, endDate]);

  // Dados para gráfico
  const chartData = sales.map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    total: item.total,
    quantity: item.items.reduce((acc: any, curr: { quantity: any; }) => acc + curr.quantity, 0),
  }));

  const handleExportExcel = async () => {
    setExportingExcel(true);
    
    try {
      // Preparar dados para Excel
      const excelData = sales.map(item => ({
        Data: new Date(item.createdAt).toLocaleDateString(),
        Cliente: item.sales.map(item=>item.name) || 'N/A',
        Produtos: item.items.map((i: { product: { name: any; }; }) => i.product?.name || 'N/A').join(', '),
        Quantidades: item.items.map((i: { quantity: any; }) => i.quantity).join(', '),
        'Valor Unitário': item.items.map((i: { price: number; }) => `MZN ${i.price?.toFixed(2) || '0.00'}`).join(', '),
        Total: `MZN ${item.total?.toFixed(2) || '0.00'}`,
    
      }));

      // Criar planilha
      const ws = utils.json_to_sheet(excelData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Relatório de Vendas");
      
      // Exportar arquivo
      writeFile(wb, `Relatorio_Vendas_${new Date().toISOString().slice(0,10)}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm"
      });

      // Adicionar título
      doc.setFontSize(16);
      doc.text("Relatório de Vendas", 140, 10, { align: "center" });

      // Adicionar período do relatório
      doc.setFontSize(10);
      const dateRange = `Período: ${startDate || 'Início'} - ${endDate || 'Fim'}`;
      doc.text(dateRange, 140, 18, { align: "center" });

      // Adicionar gráfico (com delay para renderização)
      if (chartRef.current) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Aguarda renderização
        const canvas = await html2canvas(chartRef.current, {
          logging: false,
          useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, 25, 270, 100);
      }

      // Adicionar tabela (com delay para renderização)
      if (tableRef.current) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Aguarda renderização
        const canvas = await html2canvas(tableRef.current, {
          logging: false,
          useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, 10, 270, 180);
      }

      // Salvar PDF
      doc.save(`Relatorio_Vendas_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar para PDF:", error);
    } finally {
      setExportingPDF(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório de Vendas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Análise detalhada do desempenho de vendas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {exportingExcel ? 'Exportando...' : 'Exportar para Excel'}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            {exportingPDF ? 'Exportando...' : 'Exportar para PDF'}
          </Button>
        </div>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por período</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Data inicial
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              Data final
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div ref={chartRef} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Faturamento</h3>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Total
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Quantidade
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6b7280' }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => `MZN ${value.toLocaleString()}`}
                tickMargin={10}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}
                formatter={(value, name) => {
                  if (name === 'total') return [`MZN ${Number(value).toLocaleString()}`, 'Total'];
                  return [value, 'Quantidade'];
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Total (MZN)"
              />
              <Line 
                type="monotone" 
                dataKey="quantity" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Quantidade"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tabela */}
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detalhes das Vendas</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {sales.length} {sales.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ReportTable  />
        )}
      </div>
    </div>
  );
}