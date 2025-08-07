import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AttendanceList } from '../../types/attendance';
import attendanceService from '../../services/attendanceService/attendanceService';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/table/table';

import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  PlusCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const AttendanceByDatePage = () => {
  const [attendances, setAttendances] = useState<AttendanceList[]>([]);
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchAttendances = async (selectedDate?: string) => {
    setIsLoading(true);
    try {
      const data = await attendanceService.getByDate(selectedDate);
      setAttendances(data);
    } catch (error) {
      console.error('Erro ao buscar presenças:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setDate(selected);
    fetchAttendances(selected);
  };

  const handleShowAll = () => {
    setDate('');
    fetchAttendances();
  };
  const goToCheckIn = () => {
    navigate('/attendance');
  };

   const goToAbsences = () => {
    navigate('/employees-absences');
  };
  const formatDateTime = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg shadow-md">
              <ClockIcon className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Controle de Ponto
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Registros de entrada e saída dos colaboradores
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
           
            <button
              onClick={goToCheckIn}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <PlusCircleIcon className="h-5 w-5" /> Novo Registro
            </button>
            <button
              onClick={goToAbsences}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md"
            >
              <CalendarIcon className="h-5 w-5" /> Ver Faltas
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-5 rounded-xl shadow-md mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClockIcon className="text-blue-500 h-5 w-5" /> Filtros
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Selecione uma data
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="text-gray-400 text-xl h-5 w-5" />
                </div>
                <input
                  id="date-filter"
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleShowAll}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg transition-colors border border-gray-200"
              >
                <ArrowPathIcon className="h-5 w-5" /> Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircleIcon className="text-blue-500 h-5 w-5" /> Registros de Ponto
            </h3>
            <span className="text-sm text-gray-500">
              {date ? `Mostrando dados de ${format(new Date(date), "dd/MM/yyyy")}` : 'Mostrando todos os registros'}
            </span>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <UserIcon className="text-blue-500 h-5 w-5" /> Colaborador
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="text-blue-500 h-5 w-5" /> Entrada
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <XCircleIcon className="text-blue-500 h-5 w-5" /> Saída
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Carregando registros...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : attendances.length > 0 ? (
                attendances.map((att) => (
                  <TableRow key={att.id} className="hover:bg-blue-50 transition-colors">
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {att.employee?.name?.charAt(0) || '—'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {att.employee?.position || '—'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {att.employee?.department || 'Departamento não informado'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="text-green-500 h-5 w-5" />
                        <span className="text-sm font-medium text-gray-900">
                          {att.checkIn ? formatDateTime(att.checkIn) : '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {att.checkOut ? (
                        <div className="flex items-center gap-2">
                          <ArrowRightOnRectangleIcon className="text-red-500 h-5 w-5" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDateTime(att.checkOut)}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pendente
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <CalendarIcon className="text-4xl opacity-50 h-10 w-10" />
                      <p className="font-medium">Nenhum registro encontrado</p>
                      <p className="text-sm">{date ? 'para a data selecionada' : 'no momento'}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceByDatePage;
