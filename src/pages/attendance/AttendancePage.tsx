import { useEffect, useState } from 'react';
import type { EmployeeWithAttendanceStatus } from '../../types/employee';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';
import employeeService from '../../services/employeesService/employeesService';
import attendanceService from '../../services/attendanceService/attendanceService';
import { Link } from 'react-router-dom';

export default function AttendancePage() {
  const [employees, setEmployees] = useState<EmployeeWithAttendanceStatus[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEmployees = async () => {
    setIsRefreshing(true);
    try {
      const data = await employeeService.getActiveWithAttendance();
      setEmployees(data);
    } catch (error) {
      console.error('Erro ao buscar funcionários', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCheckInOut = async (employee: EmployeeWithAttendanceStatus) => {
    setLoadingId(employee.id);
    try {
      if (employee.hasOpenAttendance && employee.lastAttendanceId) {
        await attendanceService.update(employee.lastAttendanceId, {
          checkOut: new Date().toISOString(),
        });
      } else {
        await attendanceService.create({ employeeId: employee.id });
      }
      await fetchEmployees();
    } catch (error) {
      console.error('Erro ao marcar presença', error);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg shadow">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Controle de Ponto
              </h1>
              <p className="text-gray-600">
                Registre a entrada e saída dos colaboradores
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchEmployees}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <Link
              to="/attendance/by-date"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <CalendarIcon className="h-5 w-5" />
              Registros por Data
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Colaboradores</p>
                <p className="text-2xl font-semibold text-gray-800">{employees.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Em Expediente</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {employees.filter(e => e.hasOpenAttendance).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ClockIconSolid className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Fora do Expediente</p>
                <p className="text-2xl font-semibold text-gray-800">
                  {employees.filter(e => !e.hasOpenAttendance).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((employee) => (
              <div
                key={employee.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border transition-all hover:shadow-md ${
                  employee.hasOpenAttendance ? 'border-green-100' : 'border-gray-100'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.position || 'Cargo não informado'}</p>
                    </div>
                    <div className={`p-2 rounded-full ${
                      employee.hasOpenAttendance ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {employee.hasOpenAttendance ? (
                        <CheckBadgeIcon className="h-5 w-5" />
                      ) : (
                        <ClockIcon className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  
                  <div className={`mb-4 text-sm px-3 py-2 rounded-lg ${
                    employee.hasOpenAttendance 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    {employee.hasOpenAttendance ? (
                      <span className="flex items-center gap-1">
                        <ClockIconSolid className="h-4 w-4" /> Em expediente
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" /> Fora do expediente
                      </span>
                    )}
                  </div>
                  
                  <button
                    disabled={loadingId === employee.id}
                    onClick={() => handleCheckInOut(employee)}
                    className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition ${
                      employee.hasOpenAttendance
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } ${
                      loadingId === employee.id ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loadingId === employee.id ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : employee.hasOpenAttendance ? (
                      <>
                        <XCircleIcon className="h-5 w-5" />
                        Check-out
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Check-in
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}