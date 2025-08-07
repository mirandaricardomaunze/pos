import { useState, useEffect } from 'react';
import { AcademicCapIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, UserIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Tipos para a página de treinamentos
interface Training {
  id: number;
  title: string;
  description: string;
  instructor: string;
  type: 'course' | 'workshop' | 'certification' | 'webinar' | 'other';
  startDate: string;
  endDate: string;
  duration: number; // em horas
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
  department?: string;
  cost: number;
  isRequired: boolean;
}

// Dados de exemplo (substituir por chamada à API real)
const mockTrainings: Training[] = [
  {
    id: 1,
    title: 'Introdução ao React',
    description: 'Curso básico de React para desenvolvedores front-end',
    instructor: 'João Silva',
    type: 'course',
    startDate: '2023-06-15',
    endDate: '2023-06-20',
    duration: 20,
    location: 'Sala de Treinamento 1',
    maxParticipants: 15,
    currentParticipants: 12,
    status: 'completed',
    department: 'Tecnologia',
    cost: 1200,
    isRequired: false
  },
  {
    id: 2,
    title: 'Liderança e Gestão de Equipes',
    description: 'Workshop para desenvolvimento de habilidades de liderança',
    instructor: 'Maria Oliveira',
    type: 'workshop',
    startDate: '2023-07-10',
    endDate: '2023-07-11',
    duration: 16,
    location: 'Auditório Principal',
    maxParticipants: 30,
    currentParticipants: 25,
    status: 'completed',
    department: 'Recursos Humanos',
    cost: 2500,
    isRequired: true
  },
  {
    id: 3,
    title: 'Certificação em Segurança da Informação',
    description: 'Preparação para certificação ISO 27001',
    instructor: 'Carlos Mendes',
    type: 'certification',
    startDate: '2023-08-05',
    endDate: '2023-09-15',
    duration: 40,
    location: 'Online',
    maxParticipants: 20,
    currentParticipants: 18,
    status: 'in_progress',
    department: 'TI',
    cost: 3500,
    isRequired: false
  },
  {
    id: 4,
    title: 'Atendimento ao Cliente',
    description: 'Técnicas avançadas de atendimento e resolução de conflitos',
    instructor: 'Ana Costa',
    type: 'course',
    startDate: '2023-09-20',
    endDate: '2023-09-22',
    duration: 12,
    location: 'Sala de Treinamento 2',
    maxParticipants: 25,
    currentParticipants: 10,
    status: 'scheduled',
    department: 'Comercial',
    cost: 800,
    isRequired: true
  },
  {
    id: 5,
    title: 'Novas Tendências em Marketing Digital',
    description: 'Webinar sobre as últimas tendências em marketing digital',
    instructor: 'Roberto Alves',
    type: 'webinar',
    startDate: '2023-10-05',
    endDate: '2023-10-05',
    duration: 3,
    location: 'Online',
    maxParticipants: 100,
    currentParticipants: 45,
    status: 'scheduled',
    department: 'Marketing',
    cost: 0,
    isRequired: false
  }
];

// Mapeamento de tipos para ícones e cores
const trainingTypeConfig = {
  course: { color: 'bg-blue-100 text-blue-800' },
  workshop: { color: 'bg-purple-100 text-purple-800' },
  certification: { color: 'bg-green-100 text-green-800' },
  webinar: { color: 'bg-yellow-100 text-yellow-800' },
  other: { color: 'bg-gray-100 text-gray-800' }
};

// Mapeamento de status para cores
const statusConfig = {
  scheduled: { color: 'bg-yellow-100 text-yellow-800', label: 'Agendado' },
  in_progress: { color: 'bg-blue-100 text-blue-800', label: 'Em Andamento' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Concluído' },
  canceled: { color: 'bg-red-100 text-red-800', label: 'Cancelado' }
};

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTraining, setCurrentTraining] = useState<Training | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Formulário
  const [form, setForm] = useState({
    title: '',
    description: '',
    instructor: '',
    type: 'course' as 'course' | 'workshop' | 'certification' | 'webinar' | 'other',
    startDate: '',
    endDate: '',
    duration: 0,
    location: '',
    maxParticipants: 0,
    status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'canceled',
    department: '',
    cost: 0,
    isRequired: false
  });

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      // Simulando chamada à API
      setTimeout(() => {
        setTrainings(mockTrainings);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar treinamentos:', error);
      toast.error('Não foi possível carregar os treinamentos');
      setIsLoading(false);
    }
  };

  const handleOpenModal = (training: Training | null = null) => {
    if (training) {
      setCurrentTraining(training);
      setForm({
        title: training.title,
        description: training.description,
        instructor: training.instructor,
        type: training.type,
        startDate: training.startDate,
        endDate: training.endDate,
        duration: training.duration,
        location: training.location,
        maxParticipants: training.maxParticipants,
        status: training.status,
        department: training.department || '',
        cost: training.cost,
        isRequired: training.isRequired
      });
    } else {
      setCurrentTraining(null);
      setForm({
        title: '',
        description: '',
        instructor: '',
        type: 'course',
        startDate: '',
        endDate: '',
        duration: 0,
        location: '',
        maxParticipants: 0,
        status: 'scheduled',
        department: '',
        cost: 0,
        isRequired: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!form.title || !form.instructor || !form.startDate || !form.endDate) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validação de datas
    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error('A data de início deve ser anterior à data de término');
      return;
    }

    // Simulando salvamento
    if (currentTraining) {
      // Atualização
      const updatedTrainings = trainings.map(t => 
        t.id === currentTraining.id ? { 
          ...currentTraining,
          ...form,
          currentParticipants: currentTraining.currentParticipants // Mantém o número atual de participantes
        } : t
      );
      setTrainings(updatedTrainings);
      toast.success('Treinamento atualizado com sucesso!');
    } else {
      // Criação
      const newTraining: Training = {
        ...form,
        id: Math.max(0, ...trainings.map(t => t.id)) + 1,
        currentParticipants: 0
      };
      setTrainings([...trainings, newTraining]);
      toast.success('Novo treinamento criado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este treinamento?')) {
      setTrainings(trainings.filter(t => t.id !== id));
      toast.success('Treinamento excluído com sucesso!');
    }
  };

  // Filtragem de treinamentos
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = 
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (training.department && training.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || training.type === filterType;
    const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-lg shadow">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Treinamentos
              </h1>
              <p className="text-gray-600">
                Gerencie os treinamentos e capacitações da empresa
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchTrainings}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Treinamento
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">Buscar treinamentos</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Buscar treinamentos..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="filterType" className="sr-only">Filtrar por tipo</label>
              <select
                id="filterType"
                name="filterType"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="course">Curso</option>
                <option value="workshop">Workshop</option>
                <option value="certification">Certificação</option>
                <option value="webinar">Webinar</option>
                <option value="other">Outros</option>
              </select>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="filterStatus" className="sr-only">Filtrar por status</label>
              <select
                id="filterStatus"
                name="filterStatus"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="scheduled">Agendado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trainings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{training.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[training.status].color}`}>
                    {statusConfig[training.status].label}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{training.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{training.instructor}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {formatDate(training.startDate)} - {formatDate(training.endDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{training.duration} horas</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{training.location}</span>
                  </div>
                  
                  {training.department && (
                    <div className="flex items-center text-sm">
                      <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-700">{training.department}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Participantes:</span>
                    <span className="font-medium text-gray-900">
                      {training.currentParticipants} / {training.maxParticipants}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Custo:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(training.cost)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Tipo:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trainingTypeConfig[training.type].color}`}>
                      {training.type === 'course' && 'Curso'}
                      {training.type === 'workshop' && 'Workshop'}
                      {training.type === 'certification' && 'Certificação'}
                      {training.type === 'webinar' && 'Webinar'}
                      {training.type === 'other' && 'Outro'}
                    </span>
                  </div>
                  
                  {training.isRequired && (
                    <div className="flex items-center text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">Obrigatório</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(training)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(training.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTrainings.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 'Nenhum treinamento encontrado' : 'Nenhum treinamento cadastrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
                : 'Comece criando seu primeiro treinamento.'}
            </p>
            {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Criar Treinamento
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentTraining ? 'Editar Treinamento' : 'Novo Treinamento'}
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
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título do Treinamento *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                      Instrutor *
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={form.instructor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Treinamento *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="course">Curso</option>
                      <option value="workshop">Workshop</option>
                      <option value="certification">Certificação</option>
                      <option value="webinar">Webinar</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Início *
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Término *
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duração (horas) *
                      </label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
                        Máximo de Participantes *
                      </label>
                      <input
                        type="number"
                        id="maxParticipants"
                        name="maxParticipants"
                        value={form.maxParticipants}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Local *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                      Custo (R$) *
                    </label>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={form.cost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="scheduled">Agendado</option>
                      <option value="in_progress">Em Andamento</option>
                      <option value="completed">Concluído</option>
                      <option value="canceled">Cancelado</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRequired"
                      name="isRequired"
                      checked={form.isRequired}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRequired" className="ml-2 block text-sm text-gray-700">
                      Treinamento obrigatório
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {currentTraining ? 'Atualizar' : 'Criar'}
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