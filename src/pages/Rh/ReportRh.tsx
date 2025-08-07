import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import type { ReportRHData } from "../../types/reportRh";
import attendanceService from "../../services/attendanceService/attendanceService";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/table/table";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ReportRh = () => {
  const [month, setMonth] = useState(() => format(new Date(), "yyyy-MM"));
  const [reportData, setReportData] = useState<ReportRHData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getMonthlyReport(month);
      setReportData(data);
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      toast.error("Erro ao carregar relatório.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-20">
      <h2 className="text-2xl font-bold mb-4">Relatório RH</h2>

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="month" className="font-medium text-gray-700 flex items-center gap-1">
          <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
          Mês:
        </label>
        <input
          id="month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead className="text-center">Horas Trabalhadas</TableHead>
                <TableHead className="text-center">Dias Presentes</TableHead>
                <TableHead className="text-center">Faltas</TableHead>
                <TableHead className="text-center">Salário (MZN)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.length > 0 ? (
                reportData.map((item) => (
                  <TableRow key={item.employeeId} className="hover:bg-gray-50">
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">{item.totalHours}h</TableCell>
                    <TableCell className="text-center">{item.totalDaysPresent}</TableCell>
                    <TableCell className="text-center text-red-600 font-medium">
                      {item.totalDaysAbsent}
                    </TableCell>
                    <TableCell className="text-center text-green-600 font-semibold">
                      {item.salary?.toLocaleString()} MZN
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum dado encontrado para o mês selecionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* GRÁFICO */}
          <div className="w-full h-[450px] mt-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalHours" fill="#3B82F6" name="Horas Trabalhadas" />
                <Bar dataKey="totalDaysPresent" fill="#10B981" name="Presenças" />
                <Bar dataKey="totalDaysAbsent" fill="#EF4444" name="Faltas" />
                <Bar dataKey="salary" fill="#F59E0B" name="Salário (MZN)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportRh;
