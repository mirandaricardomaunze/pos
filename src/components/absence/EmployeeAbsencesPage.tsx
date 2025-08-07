import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  CalendarIcon, 
  UserIcon, 
  DocumentArrowDownIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  CalendarIcon as CalendarIconSolid,
  UserIcon as UserIconSolid 
} from '@heroicons/react/24/solid';
import employeeService from '../../services/employeesService/employeesService';
import attendanceService from '../../services/attendanceService/attendanceService';
import type { Employee } from '../../types/employee';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function EmployeeAbsencesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [absences, setAbsences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Estado para faltas gerais de todos os funcionários
  const [allAbsences, setAllAbsences] = useState<{ employeeId: number; fullName: string; totalAbsences: number }[]>([]);

  // Busca funcionários e faltas gerais para o mês/ano atual
  useEffect(() => {
    const fetchEmployeesAndAbsences = async () => {
      setIsRefreshing(true);
      try {
        const empData = await employeeService.getAll();
        setEmployees(empData);

        // Busca faltas para todos os funcionários
        const absencesResults = await Promise.all(
          empData.map(async (emp) => {
            const res = await attendanceService.getAbsencesByMonth(emp.id, year, month);
            return {
              employeeId: emp.id,
              fullName: emp.fullName,
              totalAbsences: res.absences.length,
            };
          })
        );
        // Filtra só quem tem faltas
        setAllAbsences(absencesResults.filter(r => r.totalAbsences > 0));
      } catch (error) {
        console.error('Erro ao buscar funcionários ou faltas gerais', error);
      } finally {
        setIsRefreshing(false);
      }
    };
    fetchEmployeesAndAbsences();
  }, [month, year]);

  // Busca faltas e gráfico do funcionário selecionado
  const fetchAbsences = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      const response = await attendanceService.getAbsencesByMonth(selectedEmployee, year, month);
      setAbsences(response.absences);
      
      // Gráfico de faltas por mês para o ano
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const results = await Promise.all(
        months.map(async (m) => {
          const res = await attendanceService.getAbsencesByMonth(selectedEmployee, year, m);
          return { 
            mes: format(new Date(year, m - 1), 'MMM', { locale: ptBR }), 
            faltas: res.absences.length 
          };
        })
      );
      setChartData(results);
    } catch (error) {
      console.error('Erro ao buscar faltas do funcionário', error);
    } finally {
      setLoading(false);
    }
  };

  // Quando mudar funcionário selecionado, busca dados
  useEffect(() => {
    if (selectedEmployee) {
      fetchAbsences();
    } else {
      setAbsences([]);
      setChartData([]);
    }
  }, [selectedEmployee, month, year]);

  const handleSearch = () => {
    // Se funcionário selecionado, busca detalhado
    if (selectedEmployee) {
      fetchAbsences();
    } else {
      // Se não, busca faltas gerais atualizadas (caso queira atualizar sem selecionar)
      // Reutilizamos o mesmo fetch do useEffect para garantir atualização
      (async () => {
        setIsRefreshing(true);
        try {
          const absencesResults = await Promise.all(
            employees.map(async (emp) => {
              const res = await attendanceService.getAbsencesByMonth(emp.id, year, month);
              return {
                employeeId: emp.id,
                fullName: emp.fullName,
                totalAbsences: res.absences.length,
              };
            })
          );
          setAllAbsences(absencesResults.filter(r => r.totalAbsences > 0));
        } catch (error) {
          console.error('Erro ao buscar faltas gerais', error);
        } finally {
          setIsRefreshing(false);
        }
      })();
    }
  };

  // Exporta CSV do funcionário selecionado
  const exportCSV = () => {
    if (!selectedEmployee) return;
    const csvContent = `data:text/csv;charset=utf-8,Faltas em ${month}/${year}\n` + absences.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `faltas_funcionario_${selectedEmployee}_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-lg shadow">
              <UserIconSolid className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Controle de Faltas
              </h1>
              <p className="text-gray-600">
                Acompanhamento de ausências dos colaboradores
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isRefreshing || loading}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-red-500" /> Filtros de Busca
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" /> Funcionário
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={selectedEmployee ?? ''}
                onChange={(e) => setSelectedEmployee(Number(e.target.value) || null)}
              >
                <option value="">Selecione um funcionário</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mês</label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {format(new Date(2000, i), 'MMMM', { locale: ptBR })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ano</label>
              <input
                type="number"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition disabled:opacity-70"
            >
              {loading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <CalendarIconSolid className="h-5 w-5" />
              )}
              Buscar Faltas
            </button>

            <button
              onClick={exportCSV}
              disabled={absences.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition disabled:opacity-70"
            >
              <DocumentArrowDownIcon className="h-5 w-5" /> 
              Exportar Relatório
            </button>
          </div>
        </div>
           {/* Faltas gerais - todos funcionários com faltas */}
        <div className="mb-8 p-4 bg-white rounded shadow border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            Funcionários com Faltas em {format(new Date(year, month - 1), 'MMMM/yyyy', { locale: ptBR })}
          </h2>
          {allAbsences.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-auto border rounded p-3">
              {allAbsences.map(({ employeeId, fullName, totalAbsences }) => (
                <li 
                  key={employeeId} 
                  className={`flex justify-between cursor-pointer px-2 py-1 rounded ${
                    selectedEmployee === employeeId ? 'bg-red-100 font-semibold' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedEmployee(employeeId)}
                >
                  <span>{fullName}</span>
                  <span className="text-red-600">{totalAbsences} falta(s)</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum funcionário com faltas nesse período.</p>
          )}
        </div>
        {/* Results: detalhamento do funcionário selecionado */}
        {selectedEmployee && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-red-500" />
                {selectedEmployeeData?.fullName || 'Funcionário selecionado'}
              </h2>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0">
                Total de faltas: {absences.length}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <ArrowPathIcon className="h-8 w-8 animate-spin text-red-500" />
              </div>
            ) : absences.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Datas de ausência:</h3>
                <ul className="divide-y divide-gray-200">
                  {absences.map((date, index) => (
                    <li key={index} className="py-3 flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <CalendarIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(date), 'EEEE', { locale: ptBR })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma falta registrada para o período selecionado.
              </div>
            )}
          </div>
        )}

        {/* Chart mensal para o funcionário selecionado */}
        {selectedEmployee && chartData.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-red-500" />
              Faltas Mensais em {year}
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="faltas" 
                    fill="#dc2626" 
                    radius={[4, 4, 0, 0]} 
                    name="Faltas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
