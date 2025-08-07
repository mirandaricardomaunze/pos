import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import employeeService from '../../services/employeesService/employeesService';
import type { Employee } from '../../types/employee';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/table/table';
import Button from '../../components/ui/button';
import LoadingSpinner from '../loading/LoadingSpinner';
import { toast } from 'react-toastify';

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const companyId = useCallback(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).companyId : null;
  }, []);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getByCompanyId(Number(companyId()));
      setEmployees(data);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    toast.info('Atualizando lista de funcionários...');
    setRefreshing(true);
    loadEmployees();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;
    try {
      await employeeService.delete(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
    }
  };

  const handleEdit = (employee: Employee) => {
    navigate(`/employees/new/${employee.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Funcionários</h1>
          <p className="mt-1 text-sm text-gray-500">
            {employees.length} {employees.length === 1 ? 'funcionário' : 'funcionários'} registados
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
          
          <Button
            onClick={() => navigate('/employees/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            Novo Funcionário
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {loading && !refreshing ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner/>
          </div>
        ) : (
          <Table >
            <TableHeader>
              <TableRow>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salário
                </TableHead>
                <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody >
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900">
                        Nenhum funcionário encontrado
                      </h3>
                      <p className="text-gray-500 max-w-md text-center">
                        Você ainda não possui funcionários cadastrados. Clique no botão abaixo para adicionar o primeiro.
                      </p>
                      <Button
                        onClick={() => navigate('/employees/new')}
                        className="mt-2"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Cadastrar Funcionário
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-gray-50">
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{emp.fullName}</div>
                          <div className="text-sm text-gray-500">{emp.department || '—'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.position || '—'}
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.email || '—'}
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                      {emp.phone || '—'}
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {emp.salary ? `MZN ${emp.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          emp.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {emp.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          aria-label="Editar funcionário"
                          title="Editar funcionário"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          aria-label="Excluir funcionário"
                          title="Excluir funcionário"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}