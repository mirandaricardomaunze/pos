import { useEffect, useState, useCallback } from 'react';
import type { CreateVacationDto } from '../../types/vacation';
import { vacationService } from '../../services/vacationService/vacationService';
import { toast } from 'react-toastify';

export function VacationForm() {
  const [form, setForm] = useState<Omit<CreateVacationDto, 'companyId'>>({
    employeeId: 0,
    startDate: '',
    endDate: '',
    reason: '',
    notes: '',
  });

  const employeeId = useCallback(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.employeeId;
    }
    return null;
  }, []);

  useEffect(() => {
    if (employeeId()) {
      setForm((prev) => ({
        ...prev,
        employeeId: employeeId(),
      }));
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await vacationService.requestVacation(form);
        toast.success('Solicitação enviada!');
        setForm((prev) => ({
          ...prev,
          startDate: '',
          endDate: '',
          reason: '',
          notes: '',
        }));
      } catch (err:any) {
        console.error(err);
        toast.error(`Erro ao solicitar férias. ${ err.response?.data?.message || 'Tente novamente.' }`);
      }
    },
    [form]
  );

  return (
    <div className="max-w-md mx-auto my-8 bg-white  rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Solicitar Férias</h2>
          <p className="text-gray-600 mt-2">Preencha os dados para sua solicitação</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Término
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Motivo
              </label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Descreva o motivo das férias"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                value={form.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações (Opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Adicione qualquer informação adicional"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
                value={form.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Enviar Solicitação
          </button>
        </form>
      </div>
    </div>
  );
}