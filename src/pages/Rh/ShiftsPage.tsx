import { useState, useEffect } from 'react';
import { ClockIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Tipos para a página de turnos
interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  breakTime: number; // em minutos
  weekDays: string[];
  department?: string;
  isActive: boolean;
}

// Dados de exemplo (substituir por chamada à API real)
const mockShifts: Shift[] = [
  {
    id: 1,
    name: 'Turno Comercial',
    startTime: '08:00',
    endTime: '17:00',
    breakTime: 60,
    weekDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    department: 'Administrativo',
    isActive: true
  },
  {
    id: 2,
    name: 'Turno Noturno',
    startTime: '22:00',
    endTime: '06:00',
    breakTime: 45,
    weekDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    department: 'Operacional',
    isActive: true
  },
  {
    id: 3,
    name: 'Meio Período',
    startTime: '13:00',
    endTime: '17:00',
    breakTime: 15,
    weekDays: ['Segunda', 'Quarta', 'Sexta'],
    department: 'Suporte',
    isActive: true
  }
];

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  
  // Formulário
  const [form, setForm] = useState({
    name: '',
    startTime: '',
    endTime: '',
    breakTime: 0,
    weekDays: [] as string[],
    department: '',
    isActive: true
  });

  // Dias da semana para seleção
  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      // Simulando chamada à API
      setTimeout(() => {
        setShifts(mockShifts);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar turnos:', error);
      toast.error('Não foi possível carregar os turnos');
      setIsLoading(false);
    }
  };

  const handleOpenModal = (shift: Shift | null = null) => {
    if (shift) {
      setCurrentShift(shift);
      setForm({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        breakTime: shift.breakTime,
        weekDays: [...shift.weekDays],
        department: shift.department || '',
        isActive: shift.isActive
      });
    } else {
      setCurrentShift(null);
      setForm({
        name: '',
        startTime: '',
        endTime: '',
        breakTime: 0,
        weekDays: [],
        department: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleWeekDayToggle = (day: string) => {
    setForm(prev => {
      const weekDays = [...prev.weekDays];
      if (weekDays.includes(day)) {
        return { ...prev, weekDays: weekDays.filter(d => d !== day) };
      } else {
        return { ...prev, weekDays: [...weekDays, day] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!form.name || !form.startTime || !form.endTime || form.weekDays.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Simulando salvamento
    if (currentShift) {
      // Atualização
      const updatedShifts = shifts.map(s => 
        s.id === currentShift.id ? { ...form, id: currentShift.id } as Shift : s
      );
      setShifts(updatedShifts);
      toast.success('Turno atualizado com sucesso!');
    } else {
      // Criação
      const newShift: Shift = {
        ...form,
        id: Math.max(0, ...shifts.map(s => s.id)) + 1
      };
      setShifts([...shifts, newShift]);
      toast.success('Novo turno criado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este turno?')) {
      setShifts(shifts.filter(s => s.id !== id));
      toast.success('Turno excluído com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-lg shadow">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Turnos e Horários
              </h1>
              <p className="text-gray-600">
                Gerencie os turnos e escalas de trabalho
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchShifts}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Turno
            </button>
          </div>
        </div>

        {/* Shifts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shifts.map(shift => (
            <div key={shift.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{shift.name}</h3>
                    <p className="text-sm text-gray-500">{shift.department || 'Todos os departamentos'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shift.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {shift.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {shift.startTime} - {shift.endTime} ({shift.breakTime} min de intervalo)
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-500 block mb-1">Dias da semana:</span>
                    <div className="flex flex-wrap gap-1">
                      {shift.weekDays.map(day => (
                        <span key={day} className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(shift)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shifts.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum turno cadastrado</h3>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro turno de trabalho.</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Criar Turno
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentShift ? 'Editar Turno' : 'Novo Turno'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Turno *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora Início *
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Hora Fim *
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="breakTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Tempo de Intervalo (minutos)
                    </label>
                    <input
                      type="number"
                      id="breakTime"
                      name="breakTime"
                      value={form.breakTime}
                      onChange={handleChange}
                      min="0"
                      max="180"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Dias da Semana *
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleWeekDayToggle(day)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${form.weekDays.includes(day) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Turno ativo
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      {currentShift ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}