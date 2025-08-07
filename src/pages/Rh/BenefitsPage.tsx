import { useState, useEffect } from 'react';
import { GiftIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Tipos para a página de benefícios
interface Benefit {
  id: number;
  name: string;
  description: string;
  provider: string;
  cost: number;
  type: 'health' | 'food' | 'transportation' | 'education' | 'other';
  eligibility: 'all' | 'management' | 'senior' | 'custom';
  isActive: boolean;
  enrolledEmployees: number;
  createdAt: string;
}

// Dados de exemplo (substituir por chamada à API real)
const mockBenefits: Benefit[] = [
  {
    id: 1,
    name: 'Plano de Saúde Premium',
    description: 'Cobertura nacional com rede credenciada ampla',
    provider: 'Saúde Total',
    cost: 450,
    type: 'health',
    eligibility: 'all',
    isActive: true,
    enrolledEmployees: 32,
    createdAt: '2023-01-10'
  },
  {
    id: 2,
    name: 'Vale Refeição',
    description: 'Crédito mensal para alimentação',
    provider: 'Alelo',
    cost: 800,
    type: 'food',
    eligibility: 'all',
    isActive: true,
    enrolledEmployees: 35,
    createdAt: '2023-01-15'
  },
  {
    id: 3,
    name: 'Vale Transporte',
    description: 'Auxílio para deslocamento',
    provider: 'VT Express',
    cost: 220,
    type: 'transportation',
    eligibility: 'all',
    isActive: true,
    enrolledEmployees: 28,
    createdAt: '2023-01-15'
  },
  {
    id: 4,
    name: 'Bolsa de Estudos',
    description: 'Auxílio para cursos de especialização e pós-graduação',
    provider: 'Empresa',
    cost: 1200,
    type: 'education',
    eligibility: 'senior',
    isActive: true,
    enrolledEmployees: 8,
    createdAt: '2023-02-20'
  },
  {
    id: 5,
    name: 'Plano Odontológico',
    description: 'Cobertura para tratamentos odontológicos',
    provider: 'Dental Care',
    cost: 120,
    type: 'health',
    eligibility: 'all',
    isActive: true,
    enrolledEmployees: 30,
    createdAt: '2023-03-05'
  }
];

// Mapeamento de tipos para ícones e cores
const benefitTypeConfig = {
  health: { icon: '❤️', color: 'bg-red-100 text-red-800' },
  food: { icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
  transportation: { icon: '🚌', color: 'bg-blue-100 text-blue-800' },
  education: { icon: '🎓', color: 'bg-purple-100 text-purple-800' },
  other: { icon: '🎁', color: 'bg-gray-100 text-gray-800' }
};

// Mapeamento de elegibilidade para texto
const eligibilityLabels = {
  all: 'Todos os funcionários',
  management: 'Apenas gerência',
  senior: 'Funcionários seniores',
  custom: 'Personalizado'
};

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState<Benefit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Formulário
  const [form, setForm] = useState({
    name: '',
    description: '',
    provider: '',
    cost: 0,
    type: 'other' as 'health' | 'food' | 'transportation' | 'education' | 'other',
    eligibility: 'all' as 'all' | 'management' | 'senior' | 'custom',
    isActive: true
  });

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    setIsLoading(true);
    try {
      // Simulando chamada à API
      setTimeout(() => {
        setBenefits(mockBenefits);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar benefícios:', error);
      toast.error('Não foi possível carregar os benefícios');
      setIsLoading(false);
    }
  };

  const handleOpenModal = (benefit: Benefit | null = null) => {
    if (benefit) {
      setCurrentBenefit(benefit);
      setForm({
        name: benefit.name,
        description: benefit.description,
        provider: benefit.provider,
        cost: benefit.cost,
        type: benefit.type,
        eligibility: benefit.eligibility,
        isActive: benefit.isActive
      });
    } else {
      setCurrentBenefit(null);
      setForm({
        name: '',
        description: '',
        provider: '',
        cost: 0,
        type: 'other',
        eligibility: 'all',
        isActive: true
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
    if (!form.name || !form.provider) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Simulando salvamento
    if (currentBenefit) {
      // Atualização
      const updatedBenefits = benefits.map(b => 
        b.id === currentBenefit.id ? { 
          ...currentBenefit,
          ...form
        } : b
      );
      setBenefits(updatedBenefits);
      toast.success('Benefício atualizado com sucesso!');
    } else {
      // Criação
      const newBenefit: Benefit = {
        ...form,
        id: Math.max(0, ...benefits.map(b => b.id)) + 1,
        enrolledEmployees: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBenefits([...benefits, newBenefit]);
      toast.success('Novo benefício criado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este benefício?')) {
      setBenefits(benefits.filter(b => b.id !== id));
      toast.success('Benefício excluído com sucesso!');
    }
  };

  // Filtragem de benefícios
  const filteredBenefits = benefits.filter(benefit => {
    const matchesSearch = 
      benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || benefit.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Formatação de valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600 rounded-lg shadow">
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Benefícios
              </h1>
              <p className="text-gray-600">
                Gerencie os benefícios oferecidos aos funcionários
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchBenefits}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Benefício
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">Buscar benefícios</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Buscar benefícios..."
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="filterType" className="sr-only">Filtrar por tipo</label>
              <select
                id="filterType"
                name="filterType"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos os tipos</option>
                <option value="health">Saúde</option>
                <option value="food">Alimentação</option>
                <option value="transportation">Transporte</option>
                <option value="education">Educação</option>
                <option value="other">Outros</option>
              </select>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBenefits.map((benefit) => (
            <div key={benefit.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full text-xl" aria-hidden="true">
                      {benefitTypeConfig[benefit.type].icon}
                    </span>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-800">{benefit.name}</h3>
                      <p className="text-sm text-gray-500">{benefit.provider}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${benefit.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {benefit.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{benefit.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Custo por funcionário:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(benefit.cost)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Elegibilidade:</span>
                    <span className="font-medium text-gray-900">{eligibilityLabels[benefit.eligibility]}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Funcionários inscritos:</span>
                    <span className="font-medium text-gray-900">{benefit.enrolledEmployees}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tipo:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${benefitTypeConfig[benefit.type].color}`}>
                      {benefit.type === 'health' && 'Saúde'}
                      {benefit.type === 'food' && 'Alimentação'}
                      {benefit.type === 'transportation' && 'Transporte'}
                      {benefit.type === 'education' && 'Educação'}
                      {benefit.type === 'other' && 'Outros'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(benefit)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(benefit.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBenefits.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'Nenhum benefício encontrado' : 'Nenhum benefício cadastrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
                : 'Comece criando seu primeiro benefício.'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Criar Benefício
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-green-600" />
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentBenefit ? 'Editar Benefício' : 'Novo Benefício'}
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
                      Nome do Benefício *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                      Fornecedor *
                    </label>
                    <input
                      type="text"
                      id="provider"
                      name="provider"
                      value={form.provider}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                      Custo por Funcionário (R$) *
                    </label>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={form.cost}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Benefício *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="health">Saúde</option>
                      <option value="food">Alimentação</option>
                      <option value="transportation">Transporte</option>
                      <option value="education">Educação</option>
                      <option value="other">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-1">
                      Elegibilidade *
                    </label>
                    <select
                      id="eligibility"
                      name="eligibility"
                      value={form.eligibility}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="all">Todos os funcionários</option>
                      <option value="management">Apenas gerência</option>
                      <option value="senior">Funcionários seniores</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Benefício ativo
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {currentBenefit ? 'Atualizar' : 'Criar'}
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