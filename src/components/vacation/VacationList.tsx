import { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Vacation } from '../../types/vacation';
import { vacationService } from '../../services/vacationService/vacationService';

interface Props {
  mode: 'employee' | 'company';
  employeeId?: number;
}

export function VacationList({ mode, employeeId }: Props) {
  const [vacations, setVacations] = useState<Vacation[]>([]);

  useEffect(() => {
    const load = async () => {
      const data =
        mode === 'employee'
          ? await vacationService.getByEmployee(employeeId!)
          : await vacationService.getByCompany();
      setVacations(data);
    };
    load();
  }, [mode, employeeId]);

  const handleApprove = async (id: number) => {
    await vacationService.approve(id);
    setVacations(v => v.map(vac => (vac.id === id ? { ...vac, status: 'APPROVED' } : vac)));
  };

  const handleReject = async (id: number) => {
    await vacationService.reject(id);
    setVacations(v => v.map(vac => (vac.id === id ? { ...vac, status: 'REJECTED' } : vac)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Solicitações de Férias</h2>
          <p className="text-gray-600 mt-1">
            {mode === 'employee' ? 'Suas solicitações' : 'Solicitações da empresa'}
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {vacations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma solicitação encontrada
            </div>
          ) : (
            vacations.map(vac => (
              <div key={vac.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">Solicitação #{vac.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vac.status)}`}>
                        {vac.status === 'APPROVED' ? 'Aprovado' : 
                         vac.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p><span className="font-medium">Funcionário:</span> {vac.employeeId}</p>
                      <p><span className="font-medium">Período:</span> {new Date(vac.startDate).toLocaleDateString()} a {new Date(vac.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {vac.status === 'PENDING' && mode === 'company' && (
                    <div className="flex gap-2 self-start md:self-center">
                      <button
                        onClick={() => handleApprove(vac.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        <CheckIcon className="w-5 h-5" />
                        <span>Aprovar</span>
                      </button>
                      <button
                        onClick={() => handleReject(vac.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        <XMarkIcon className="w-5 h-5" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}