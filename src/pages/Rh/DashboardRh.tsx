import { useEffect, useState } from 'react';
import { payrollService } from '../../services/payrollService/payrollService';
import { BarChart, LineChart } from '@mui/x-charts';
import { format } from 'date-fns';
import type { SummaryItem } from '../../types/dasboardRh';


import {
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/solid';

export default function DashboardRH() {
  const [filter, setFilter] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await payrollService.getSummary(filter);
        setSummary(data);
      } catch (error) {
        console.error('Erro ao buscar dados do RH:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [filter]);

  const labels = summary.map((item) => format(new Date(item.month + '-01'), 'MMM yyyy'));
  const salaryData = summary.map((item) => item.totalNetSalary);
  const employeeData = summary.map((item) => item.totalEmployees);
  const absenceData = summary.map((item) => item.totalAbsences);
  const totalHoursData = summary.map((item) => item.totalHours || 0);

  const avgSalaryData = summary.map((item) =>
    item.totalEmployees ? item.totalNetSalary / item.totalEmployees : 0
  );

  const percentAbsences = summary.map((item) => {
    const totalPossible = item.totalEmployees * 22;
    return totalPossible ? (item.totalAbsences / totalPossible) * 100 : 0;
  });

  const colors = {
    blue: '#3B82F6',
    red: '#EF4444',
    purple: '#8B5CF6',
    green: '#10B981',
    yellow: '#F59E0B',
    gray: '#6B7280',
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen mb-10 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard de Recursos Humanos</h1>
          <p className="text-sm text-gray-500 mt-1">Visão geral dos indicadores de RH</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 hidden sm:block">Período:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={isLoading}
          >
            <option value="1m">Último Mês</option>
            <option value="3m">Últimos 3 Meses</option>
            <option value="6m">Últimos 6 Meses</option>
            <option value="1y">Último Ano</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Conteúdo principal */}
      {!isLoading && (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 min-w-0">
            <Card
              title="Funcionários"
              value={employeeData.at(-1) || 0}
              icon={<UsersIcon className="w-5 h-5 text-blue-500" />}
              trend={employeeData.length > 1 ? employeeData.at(-1)! - employeeData.at(-2)! : 0}
              color={colors.blue}
            />
            <Card
              title="Salário Líquido"
              value={(salaryData.at(-1) || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'MZN',
              })}
              icon={<CurrencyDollarIcon className="w-5 h-5 text-green-500" />}
              trend={
                salaryData.length > 1
                  ? ((salaryData.at(-1)! - salaryData.at(-2)!) / salaryData.at(-2)!) * 100
                  : 0
              }
              color={colors.green}
            />
            <Card
              title="Média Salarial"
              value={(avgSalaryData.at(-1) || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'MZN',
              })}
              icon={<ChartBarIcon className="w-5 h-5 text-yellow-500" />}
              trend={
                avgSalaryData.length > 1
                  ? ((avgSalaryData.at(-1)! - avgSalaryData.at(-2)!) / avgSalaryData.at(-2)!) * 100
                  : 0
              }
              color={colors.yellow}
            />
            <Card
              title="Horas Trabalhadas"
              value={`${(totalHoursData.at(-1) || 0).toFixed(1)}h`}
              icon={<ClockIcon className="w-5 h-5 text-purple-500" />}
              trend={
                totalHoursData.length > 1
                  ? ((totalHoursData.at(-1)! - totalHoursData.at(-2)!) / totalHoursData.at(-2)!) *
                    100
                  : 0
              }
              color={colors.purple}
            />
            <Card
              title="% de Faltas"
              value={`${(percentAbsences.at(-1) || 0).toFixed(1)}%`}
              icon={<ExclamationTriangleIcon className="w-5 h-5 text-red-500" />}
              trend={percentAbsences.length > 1 ? percentAbsences.at(-1)! - percentAbsences.at(-2)! : 0}
              color={colors.red}
              inverseTrend
            />
          </div>

          {/* Gráfico comparativo */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 mb-8 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Comparativo de Indicadores</h2>
              <div className="flex gap-2 text-sm">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Salário
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Faltas
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span> Horas
                </span>
              </div>
            </div>
            <div className="min-w-[600px]">
              <BarChart
                xAxis={[{ scaleType: 'band', data: labels, tickLabelStyle: { fontSize: 12, fill: colors.gray } }]}
                series={[
                  { data: salaryData, label: 'Salário Líquido', color: colors.blue },
                  { data: absenceData, label: 'Faltas', color: colors.red },
                  { data: totalHoursData, label: 'Horas Trabalhadas', color: colors.purple },
                ]}
                height={400}
                sx={{
                  '.MuiChartsAxis-line': { stroke: '#e5e7eb' },
                  '.MuiChartsAxis-tick': { stroke: '#e5e7eb' },
                  '.MuiBarElement-root': { rx: 4, ry: 4 },
                }}
              />
            </div>
          </div>

          {/* Gráficos em grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Evolução de Funcionários */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolução de Funcionários</h2>
              <LineChart
                xAxis={[{ scaleType: 'point', data: labels }]}
                series={[
                  {
                    data: employeeData,
                    label: 'Total de Funcionários',
                    color: colors.green,
                    curve: 'natural',
                  },
                ]}
                height={350}
                sx={{
                  '.MuiLineElement-root': { strokeWidth: 3 },
                  '.MuiChartsAxis-line': { stroke: '#e5e7eb' },
                  '.MuiChartsAxis-tick': { stroke: '#e5e7eb' },
                  '.MuiMarkElement-root': { fill: colors.green, stroke: 'white', strokeWidth: 2 },
                }}
              />
            </div>

            {/* Média Salarial */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Média Salarial</h2>
              <LineChart
                xAxis={[{ scaleType: 'point', data: labels }]}
                series={[
                  {
                    data: avgSalaryData,
                    label: 'Média Salarial',
                    color: colors.yellow,
                    curve: 'natural',
                  },
                ]}
                height={350}
                sx={{
                  '.MuiLineElement-root': { strokeWidth: 3 },
                  '.MuiChartsAxis-line': { stroke: '#e5e7eb' },
                  '.MuiChartsAxis-tick': { stroke: '#e5e7eb' },
                  '.MuiMarkElement-root': { fill: colors.yellow, stroke: 'white', strokeWidth: 2 },
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  trend,
  color,
  inverseTrend = false,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  color: string;
  inverseTrend?: boolean;
}) {
  const trendPositive = trend ? (inverseTrend ? trend < 0 : trend > 0) : false;
  const trendNeutral = trend === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-all duration-200 min-w-0">
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1 truncate">{title}</p>
          <p
            className="text-xl sm:text-2xl font-bold truncate"
            style={{ color }}
            title={typeof value === 'string' ? value : undefined}
          >
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center text-xs sm:text-sm">
          {!trendNeutral && (
            <span
              className={`inline-flex items-center ${
                trendPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trendPositive ? (
                <ArrowUpIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              )}
              {typeof trend === 'number' && Math.abs(trend).toFixed(1)}
              {typeof trend === 'number' && (title.includes('%') || Math.abs(trend) > 100) ? '' : '%'}
            </span>
          )}
          <span className="text-gray-400 ml-2 truncate">vs período anterior</span>
        </div>
      )}
    </div>
  );
}
