import { useState, useEffect } from 'react';
import { ClipboardDocumentCheckIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, UserIcon,  DocumentTextIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Tipos para a página de avaliação de desempenho
interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  managerId?: number;
}

interface EvaluationCriteria {
  id: number;
  name: string;
  description: string;
  weight: number; // Peso do critério na avaliação total (0-100)
}

interface EvaluationForm {
  id: number;
  title: string;
  description: string;
  targetGroups: string[]; // Departamentos ou cargos alvo
  criteria: EvaluationCriteria[];
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

interface EvaluationPeriod {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  formId: number;
  status: 'upcoming' | 'active' | 'completed';
}

interface EvaluationScore {
  criteriaId: number;
  score: number; // 1-5
  comment?: string;
}

interface EmployeeEvaluation {
  id: number;
  periodId: number;
  employeeId: number;
  evaluatorId: number;
  scores: EvaluationScore[];
  overallScore: number; // Média ponderada
  strengths?: string;
  improvements?: string;
  goals?: string;
  status: 'pending' | 'in_progress' | 'completed';
  submittedAt?: string;
  employee?: Employee;
  evaluator?: Employee;
}

// Dados de exemplo (substituir por chamada à API real)
const mockEmployees: Employee[] = [
  { id: 1, name: 'João Silva', position: 'Desenvolvedor Front-end', department: 'Tecnologia', hireDate: '2021-03-15', managerId: 5 },
  { id: 2, name: 'Maria Oliveira', position: 'Desenvolvedora Back-end', department: 'Tecnologia', hireDate: '2020-06-10', managerId: 5 },
  { id: 3, name: 'Carlos Santos', position: 'Designer UX/UI', department: 'Design', hireDate: '2022-01-20', managerId: 6 },
  { id: 4, name: 'Ana Costa', position: 'Analista de Marketing', department: 'Marketing', hireDate: '2021-08-05', managerId: 7 },
  { id: 5, name: 'Roberto Alves', position: 'Gerente de Tecnologia', department: 'Tecnologia', hireDate: '2019-04-12' },
  { id: 6, name: 'Juliana Lima', position: 'Gerente de Design', department: 'Design', hireDate: '2020-02-28' },
  { id: 7, name: 'Marcos Pereira', position: 'Gerente de Marketing', department: 'Marketing', hireDate: '2018-11-15' },
];

const mockEvaluationForms: EvaluationForm[] = [
  {
    id: 1,
    title: 'Avaliação de Desempenho - Equipe Técnica',
    description: 'Formulário para avaliação de colaboradores das áreas técnicas.',
    targetGroups: ['Tecnologia', 'Design'],
    criteria: [
      { id: 1, name: 'Conhecimento Técnico', description: 'Domínio das tecnologias e ferramentas utilizadas.', weight: 25 },
      { id: 2, name: 'Qualidade do Trabalho', description: 'Precisão, organização e atenção aos detalhes.', weight: 20 },
      { id: 3, name: 'Produtividade', description: 'Eficiência na entrega de resultados dentro dos prazos.', weight: 20 },
      { id: 4, name: 'Trabalho em Equipe', description: 'Colaboração e comunicação com os colegas.', weight: 15 },
      { id: 5, name: 'Resolução de Problemas', description: 'Capacidade de identificar e resolver problemas de forma eficaz.', weight: 20 },
    ],
    status: 'active',
    createdAt: '2023-01-10',
  },
  {
    id: 2,
    title: 'Avaliação de Desempenho - Gestores',
    description: 'Formulário para avaliação de líderes e gestores.',
    targetGroups: ['Gerência'],
    criteria: [
      { id: 6, name: 'Liderança', description: 'Capacidade de inspirar e orientar a equipe.', weight: 25 },
      { id: 7, name: 'Tomada de Decisão', description: 'Qualidade e eficácia das decisões tomadas.', weight: 20 },
      { id: 8, name: 'Gestão de Equipe', description: 'Habilidade em desenvolver, motivar e reter talentos.', weight: 20 },
      { id: 9, name: 'Comunicação', description: 'Clareza e eficácia na comunicação com a equipe e stakeholders.', weight: 15 },
      { id: 10, name: 'Visão Estratégica', description: 'Capacidade de alinhar ações com os objetivos da empresa.', weight: 20 },
    ],
    status: 'active',
    createdAt: '2023-01-15',
  },
  {
    id: 3,
    title: 'Avaliação de Desempenho - Marketing',
    description: 'Formulário para avaliação de colaboradores da área de marketing.',
    targetGroups: ['Marketing'],
    criteria: [
      { id: 11, name: 'Criatividade', description: 'Capacidade de gerar ideias inovadoras.', weight: 25 },
      { id: 12, name: 'Análise de Dados', description: 'Habilidade em interpretar métricas e resultados.', weight: 20 },
      { id: 13, name: 'Execução de Campanhas', description: 'Eficácia na implementação de estratégias de marketing.', weight: 20 },
      { id: 14, name: 'Comunicação', description: 'Clareza e persuasão na comunicação.', weight: 15 },
      { id: 15, name: 'Conhecimento de Mercado', description: 'Compreensão do mercado e tendências.', weight: 20 },
    ],
    status: 'draft',
    createdAt: '2023-02-05',
  },
];

const mockEvaluationPeriods: EvaluationPeriod[] = [
  {
    id: 1,
    title: 'Avaliação Semestral 1/2023',
    description: 'Primeiro ciclo de avaliações do ano de 2023.',
    startDate: '2023-01-15',
    endDate: '2023-02-15',
    formId: 1,
    status: 'completed',
  },
  {
    id: 2,
    title: 'Avaliação Semestral 2/2023',
    description: 'Segundo ciclo de avaliações do ano de 2023.',
    startDate: '2023-07-01',
    endDate: '2023-07-31',
    formId: 1,
    status: 'active',
  },
  {
    id: 3,
    title: 'Avaliação de Gestores 2023',
    description: 'Ciclo anual de avaliação de líderes e gestores.',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    formId: 2,
    status: 'upcoming',
  },
];

const mockEmployeeEvaluations: EmployeeEvaluation[] = [
  {
    id: 1,
    periodId: 1,
    employeeId: 1,
    evaluatorId: 5,
    scores: [
      { criteriaId: 1, score: 4, comment: 'Bom conhecimento técnico, mas pode aprofundar em algumas áreas.' },
      { criteriaId: 2, score: 5, comment: 'Excelente qualidade de código e documentação.' },
      { criteriaId: 3, score: 4, comment: 'Entrega consistentemente dentro dos prazos.' },
      { criteriaId: 4, score: 3, comment: 'Pode melhorar a comunicação com a equipe.' },
      { criteriaId: 5, score: 4, comment: 'Resolve problemas de forma eficiente.' },
    ],
    overallScore: 4.1,
    strengths: 'Qualidade de código, documentação e conhecimento técnico.',
    improvements: 'Comunicação com a equipe e compartilhamento de conhecimento.',
    goals: 'Melhorar habilidades de comunicação e assumir mais responsabilidades de liderança técnica.',
    status: 'completed',
    submittedAt: '2023-02-10',
  },
  {
    id: 2,
    periodId: 1,
    employeeId: 2,
    evaluatorId: 5,
    scores: [
      { criteriaId: 1, score: 5, comment: 'Excelente domínio técnico.' },
      { criteriaId: 2, score: 4, comment: 'Boa qualidade, mas pode melhorar em testes.' },
      { criteriaId: 3, score: 5, comment: 'Altamente produtiva.' },
      { criteriaId: 4, score: 5, comment: 'Ótima colaboradora, sempre ajuda os colegas.' },
      { criteriaId: 5, score: 4, comment: 'Boa capacidade de resolução de problemas.' },
    ],
    overallScore: 4.6,
    strengths: 'Conhecimento técnico, produtividade e trabalho em equipe.',
    improvements: 'Cobertura de testes e documentação.',
    goals: 'Desenvolver habilidades de mentoria e liderar projetos mais complexos.',
    status: 'completed',
    submittedAt: '2023-02-08',
  },
  {
    id: 3,
    periodId: 2,
    employeeId: 1,
    evaluatorId: 5,
    status: 'in_progress',
    scores: [],
    overallScore: 0,
  },
];

// Mapeamento de status para cores e texto
const evaluationStatusConfig = {
  pending: { color: 'bg-gray-100 text-gray-800', label: 'Pendente' },
  in_progress: { color: 'bg-yellow-100 text-yellow-800', label: 'Em Andamento' },
  completed: { color: 'bg-green-100 text-green-800', label: 'Concluída' },
};

const periodStatusConfig = {
  upcoming: { color: 'bg-blue-100 text-blue-800', label: 'Futuro' },
  active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
  completed: { color: 'bg-gray-100 text-gray-800', label: 'Concluído' },
};

const formStatusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
  active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
  archived: { color: 'bg-red-100 text-red-800', label: 'Arquivado' },
};

export default function PerformanceEvaluationPage() {
  const [activeTab, setActiveTab] = useState<'periods' | 'forms' | 'evaluations'>('periods');
  const [evaluationForms, setEvaluationForms] = useState<EvaluationForm[]>([]);
  const [evaluationPeriods, setEvaluationPeriods] = useState<EvaluationPeriod[]>([]);
  const [employeeEvaluations, setEmployeeEvaluations] = useState<EmployeeEvaluation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<EvaluationForm | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<EvaluationPeriod | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<EmployeeEvaluation | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  
  // Formulário de avaliação
  const [formForm, setFormForm] = useState({
    title: '',
    description: '',
    targetGroups: [] as string[],
    status: 'draft' as 'draft' | 'active' | 'archived',
    criteria: [] as EvaluationCriteria[],
  });

  // Formulário de período
  const [periodForm, setPeriodForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    formId: 0,
    status: 'upcoming' as 'upcoming' | 'active' | 'completed',
  });

  // Formulário de avaliação de funcionário
  const [evaluationForm, setEvaluationForm] = useState({
    periodId: 0,
    employeeId: 0,
    evaluatorId: 0,
    scores: [] as EvaluationScore[],
    strengths: '',
    improvements: '',
    goals: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulando chamada à API
      setTimeout(() => {
        setEvaluationForms(mockEvaluationForms);
        setEvaluationPeriods(mockEvaluationPeriods);
        setEmployeeEvaluations(mockEmployeeEvaluations);
        setEmployees(mockEmployees);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Não foi possível carregar os dados');
      setIsLoading(false);
    }
  };

  // Manipulação de modal de formulário de avaliação
  const handleOpenFormModal = (form: EvaluationForm | null = null) => {
    if (form) {
      setCurrentForm(form);
      setFormForm({
        title: form.title,
        description: form.description,
        targetGroups: [...form.targetGroups],
        status: form.status,
        criteria: [...form.criteria],
      });
    } else {
      setCurrentForm(null);
      setFormForm({
        title: '',
        description: '',
        targetGroups: [],
        status: 'draft',
        criteria: [],
      });
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  // Manipulação de modal de período de avaliação
  const handleOpenPeriodModal = (period: EvaluationPeriod | null = null) => {
    if (period) {
      setCurrentPeriod(period);
      setPeriodForm({
        title: period.title,
        description: period.description,
        startDate: period.startDate,
        endDate: period.endDate,
        formId: period.formId,
        status: period.status,
      });
    } else {
      setCurrentPeriod(null);
      setPeriodForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        formId: evaluationForms.length > 0 ? evaluationForms[0].id : 0,
        status: 'upcoming',
      });
    }
    setIsPeriodModalOpen(true);
  };

  const handleClosePeriodModal = () => {
    setIsPeriodModalOpen(false);
  };

  // Manipulação de modal de avaliação de funcionário
  const handleOpenEvaluationModal = (evaluation: EmployeeEvaluation | null = null) => {
    if (evaluation) {
      // Buscar detalhes completos da avaliação
      const fullEvaluation = {
        ...evaluation,
        employee: employees.find(e => e.id === evaluation.employeeId),
        evaluator: employees.find(e => e.id === evaluation.evaluatorId),
      };
      
      setCurrentEvaluation(fullEvaluation);
      setEvaluationForm({
        periodId: evaluation.periodId,
        employeeId: evaluation.employeeId,
        evaluatorId: evaluation.evaluatorId,
        scores: [...evaluation.scores],
        strengths: evaluation.strengths || '',
        improvements: evaluation.improvements || '',
        goals: evaluation.goals || '',
        status: evaluation.status,
      });
    } else {
      setCurrentEvaluation(null);
      setEvaluationForm({
        periodId: evaluationPeriods.find(p => p.status === 'active')?.id || 0,
        employeeId: 0,
        evaluatorId: 0,
        scores: [],
        strengths: '',
        improvements: '',
        goals: '',
        status: 'pending',
      });
    }
    setIsEvaluationModalOpen(true);
  };

  const handleCloseEvaluationModal = () => {
    setIsEvaluationModalOpen(false);
  };

  // Manipulação de formulários
  const handleFormFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePeriodFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPeriodForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEvaluationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvaluationForm(prev => ({ ...prev, [name]: value }));
  };

  // Manipulação de critérios no formulário de avaliação
  const handleAddCriteria = () => {
    const newCriteria: EvaluationCriteria = {
      id: Math.max(0, ...formForm.criteria.map(c => c.id)) + 1,
      name: '',
      description: '',
      weight: 0,
    };
    setFormForm(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriteria],
    }));
  };

  const handleCriteriaChange = (index: number, field: keyof EvaluationCriteria, value: string | number) => {
    const updatedCriteria = [...formForm.criteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: field === 'weight' ? Number(value) : value,
    };
    setFormForm(prev => ({ ...prev, criteria: updatedCriteria }));
  };

  const handleRemoveCriteria = (index: number) => {
    const updatedCriteria = [...formForm.criteria];
    updatedCriteria.splice(index, 1);
    setFormForm(prev => ({ ...prev, criteria: updatedCriteria }));
  };

  // Manipulação de scores na avaliação de funcionário
  const handleScoreChange = (criteriaId: number, field: 'score' | 'comment', value: string | number) => {
    const updatedScores = [...evaluationForm.scores];
    const scoreIndex = updatedScores.findIndex(s => s.criteriaId === criteriaId);
    
    if (scoreIndex >= 0) {
      updatedScores[scoreIndex] = {
        ...updatedScores[scoreIndex],
        [field]: field === 'score' ? Number(value) : value,
      };
    } else {
      updatedScores.push({
        criteriaId,
        score: field === 'score' ? Number(value) : 0,
        comment: field === 'comment' ? value as string : '',
      });
    }
    
    setEvaluationForm(prev => ({ ...prev, scores: updatedScores }));
  };

  // Submissão de formulários
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formForm.title || formForm.criteria.length === 0) {
      toast.error('Preencha o título e adicione pelo menos um critério');
      return;
    }

    // Verificar se os pesos somam 100%
    const totalWeight = formForm.criteria.reduce((sum, criteria) => sum + criteria.weight, 0);
    if (totalWeight !== 100) {
      toast.error('A soma dos pesos dos critérios deve ser 100%');
      return;
    }

    // Simulando salvamento
    if (currentForm) {
      // Atualização
      const updatedForms = evaluationForms.map(form => 
        form.id === currentForm.id ? { 
          ...currentForm,
          ...formForm,
          createdAt: currentForm.createdAt,
        } : form
      );
      setEvaluationForms(updatedForms);
      toast.success('Formulário atualizado com sucesso!');
    } else {
      // Criação
      const newForm: EvaluationForm = {
        ...formForm,
        id: Math.max(0, ...evaluationForms.map(form => form.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setEvaluationForms([...evaluationForms, newForm]);
      toast.success('Novo formulário criado com sucesso!');
    }

    handleCloseFormModal();
  };

  const handlePeriodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!periodForm.title || !periodForm.startDate || !periodForm.endDate || !periodForm.formId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar datas
    if (new Date(periodForm.startDate) >= new Date(periodForm.endDate)) {
      toast.error('A data de início deve ser anterior à data de término');
      return;
    }

    // Simulando salvamento
    if (currentPeriod) {
      // Atualização
      const updatedPeriods = evaluationPeriods.map(period => 
        period.id === currentPeriod.id ? { 
          ...currentPeriod,
          ...periodForm,
        } : period
      );
      setEvaluationPeriods(updatedPeriods);
      toast.success('Período atualizado com sucesso!');
    } else {
      // Criação
      const newPeriod: EvaluationPeriod = {
        ...periodForm,
        id: Math.max(0, ...evaluationPeriods.map(period => period.id)) + 1,
      };
      setEvaluationPeriods([...evaluationPeriods, newPeriod]);
      toast.success('Novo período criado com sucesso!');
    }

    handleClosePeriodModal();
  };

  const handleEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!evaluationForm.employeeId || !evaluationForm.evaluatorId) {
      toast.error('Selecione o funcionário e o avaliador');
      return;
    }

    // Calcular pontuação geral
    let overallScore = 0;
    let totalWeight = 0;
    
    if (evaluationForm.scores.length > 0) {
      const period = evaluationPeriods.find(p => p.id === evaluationForm.periodId);
      if (period) {
        const form = evaluationForms.find(f => f.id === period.formId);
        if (form) {
          form.criteria.forEach(criteria => {
            const score = evaluationForm.scores.find(s => s.criteriaId === criteria.id);
            if (score) {
              overallScore += (score.score * criteria.weight);
              totalWeight += criteria.weight;
            }
          });
          
          if (totalWeight > 0) {
            overallScore = parseFloat((overallScore / 100).toFixed(1));
          }
        }
      }
    }

    // Simulando salvamento
    if (currentEvaluation) {
      // Atualização
      const updatedEvaluations = employeeEvaluations.map(evaluation => 
        evaluation.id === currentEvaluation.id ? { 
          ...currentEvaluation,
          ...evaluationForm,
          overallScore,
          submittedAt: evaluationForm.status === 'completed' ? new Date().toISOString() : undefined,
        } : evaluation
      );
      setEmployeeEvaluations(updatedEvaluations);
      toast.success('Avaliação atualizada com sucesso!');
    } else {
      // Criação
      const newEvaluation: EmployeeEvaluation = {
        ...evaluationForm,
        id: Math.max(0, ...employeeEvaluations.map(evaluation => evaluation.id)) + 1,
        overallScore,
        submittedAt: evaluationForm.status === 'completed' ? new Date().toISOString() : undefined,
      };
      setEmployeeEvaluations([...employeeEvaluations, newEvaluation]);
      toast.success('Nova avaliação criada com sucesso!');
    }

    handleCloseEvaluationModal();
  };

  // Funções de exclusão
  const handleDeleteForm = (id: number) => {
    // Verificar se o formulário está sendo usado em algum período
    const isUsed = evaluationPeriods.some(period => period.formId === id);
    if (isUsed) {
      toast.error('Este formulário está sendo usado em um ou mais períodos de avaliação e não pode ser excluído.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este formulário?')) {
      setEvaluationForms(evaluationForms.filter(form => form.id !== id));
      toast.success('Formulário excluído com sucesso!');
    }
  };

  const handleDeletePeriod = (id: number) => {
    // Verificar se o período tem avaliações
    const hasEvaluations = employeeEvaluations.some(evaluation => evaluation.periodId === id);
    if (hasEvaluations) {
      toast.error('Este período possui avaliações e não pode ser excluído.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este período?')) {
      setEvaluationPeriods(evaluationPeriods.filter(period => period.id !== id));
      toast.success('Período excluído com sucesso!');
    }
  };

  const handleDeleteEvaluation = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      setEmployeeEvaluations(employeeEvaluations.filter(evaluation => evaluation.id !== id));
      toast.success('Avaliação excluída com sucesso!');
    }
  };

  // Filtragem de dados
  const filteredPeriods = evaluationPeriods.filter(period => {
    const matchesSearch = period.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || period.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredForms = evaluationForms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || form.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredEvaluations = employeeEvaluations.filter(evaluation => {
    const employee = employees.find(e => e.id === evaluation.employeeId);
    const evaluator = employees.find(e => e.id === evaluation.evaluatorId);
    
    const matchesSearch = 
      (employee?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evaluator?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || evaluation.status === filterStatus;
    
    const matchesDepartment = filterDepartment === 'all' || 
      (employee && employee.department === filterDepartment);
    
    return matchesSearch && matchesStatus && matchesDepartment;
  }).map(evaluation => ({
    ...evaluation,
    employee: employees.find(e => e.id === evaluation.employeeId),
    evaluator: employees.find(e => e.id === evaluation.evaluatorId),
  }));

  // Lista de departamentos únicos para o filtro
  const departments = Array.from(new Set(employees.map(employee => employee.department)));

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
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Avaliação de Desempenho
              </h1>
              <p className="text-gray-600">
                Gerencie ciclos de avaliação e acompanhe o desempenho dos colaboradores
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            {activeTab === 'periods' && (
              <button
                onClick={() => handleOpenPeriodModal()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
              >
                <PlusIcon className="h-5 w-5" />
                Novo Período
              </button>
            )}
            
            {activeTab === 'forms' && (
              <button
                onClick={() => handleOpenFormModal()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
              >
                <PlusIcon className="h-5 w-5" />
                Novo Formulário
              </button>
            )}
            
            {activeTab === 'evaluations' && (
              <button
                onClick={() => handleOpenEvaluationModal()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
              >
                <PlusIcon className="h-5 w-5" />
                Nova Avaliação
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('periods')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm ${activeTab === 'periods' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Períodos de Avaliação
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm ${activeTab === 'forms' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Formulários
            </button>
            <button
              onClick={() => setActiveTab('evaluations')}
              className={`flex-1 py-4 px-4 text-center font-medium text-sm ${activeTab === 'evaluations' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Avaliações
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">Buscar</label>
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
                  placeholder={`Buscar ${activeTab === 'periods' ? 'períodos' : activeTab === 'forms' ? 'formulários' : 'avaliações'}...`}
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                {activeTab === 'periods' && (
                  <>
                    <option value="upcoming">Futuros</option>
                    <option value="active">Ativos</option>
                    <option value="completed">Concluídos</option>
                  </>
                )}
                {activeTab === 'forms' && (
                  <>
                    <option value="draft">Rascunho</option>
                    <option value="active">Ativos</option>
                    <option value="archived">Arquivados</option>
                  </>
                )}
                {activeTab === 'evaluations' && (
                  <>
                    <option value="pending">Pendentes</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluídas</option>
                  </>
                )}
              </select>
            </div>
            
            {activeTab === 'evaluations' && (
              <div className="w-full md:w-48">
                <label htmlFor="filterDepartment" className="sr-only">Filtrar por departamento</label>
                <select
                  id="filterDepartment"
                  name="filterDepartment"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">Todos os departamentos</option>
                  {departments.map((department, index) => (
                    <option key={index} value={department}>{department}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'periods' && (
          <div className="space-y-6">
            {filteredPeriods.map((period) => {
              const form = evaluationForms.find(f => f.id === period.formId);
              const evaluationsCount = employeeEvaluations.filter(e => e.periodId === period.id).length;
              const completedCount = employeeEvaluations.filter(e => e.periodId === period.id && e.status === 'completed').length;
              
              return (
                <div key={period.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-800">{period.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${periodStatusConfig[period.status].color}`}>
                            {periodStatusConfig[period.status].label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{period.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenPeriodModal(period)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePeriod(period.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Período</div>
                        <div className="text-gray-800">
                          {formatDate(period.startDate)} - {formatDate(period.endDate)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Formulário</div>
                        <div className="text-gray-800">
                          {form ? form.title : 'Formulário não encontrado'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Progresso</div>
                        <div className="text-gray-800">
                          {completedCount} de {evaluationsCount} avaliações concluídas
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${evaluationsCount > 0 ? (completedCount / evaluationsCount) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setActiveTab('evaluations');
                          setFilterStatus(period.status === 'completed' ? 'completed' : 'all');
                          setSearchTerm('');
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Ver Avaliações
                        <ChevronRightIcon className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredPeriods.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'Nenhum período encontrado' : 'Nenhum período cadastrado'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
                    : 'Comece criando seu primeiro período de avaliação.'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => handleOpenPeriodModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Criar Período
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'forms' && (
          <div className="space-y-6">
            {filteredForms.map((form) => (
              <div key={form.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{form.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formStatusConfig[form.status].color}`}>
                          {formStatusConfig[form.status].label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{form.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenFormModal(form)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteForm(form.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.targetGroups.map((group, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                          {group}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Criado em:</span> {formatDate(form.createdAt)}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Critérios de Avaliação</h4>
                    <div className="space-y-3">
                      {form.criteria.map((criteria) => (
                        <div key={criteria.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-medium text-gray-800">{criteria.name}</h5>
                              <p className="text-xs text-gray-600 mt-1">{criteria.description}</p>
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                              Peso: {criteria.weight}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredForms.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'Nenhum formulário encontrado' : 'Nenhum formulário cadastrado'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
                    : 'Comece criando seu primeiro formulário de avaliação.'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => handleOpenFormModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Criar Formulário
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            {filteredEvaluations.map((evaluation) => {
              const period = evaluationPeriods.find(p => p.id === evaluation.periodId);
              
              return (
                <div key={evaluation.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {evaluation.employee?.name || 'Funcionário não encontrado'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${evaluationStatusConfig[evaluation.status].color}`}>
                            {evaluationStatusConfig[evaluation.status].label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {period?.title || 'Período não encontrado'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEvaluationModal(evaluation)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvaluation(evaluation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Avaliador</div>
                        <div className="text-gray-800">
                          {evaluation.evaluator?.name || 'Avaliador não encontrado'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Departamento</div>
                        <div className="text-gray-800">
                          {evaluation.employee?.department || 'N/A'}
                        </div>
                      </div>
                      
                      {evaluation.status === 'completed' && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">Pontuação Geral</div>
                          <div className="flex items-center">
                            <div className="text-xl font-semibold text-gray-800 mr-2">
                              {evaluation.overallScore.toFixed(1)}
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-5 w-5 ${star <= Math.round(evaluation.overallScore) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {evaluation.status !== 'completed' && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                          <div className="text-gray-800">
                            {evaluation.status === 'pending' ? 'Pendente de Avaliação' : 'Avaliação em Andamento'}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {evaluation.status === 'completed' && evaluation.submittedAt && (
                      <div className="text-sm text-gray-500 mb-4">
                        <span className="font-medium">Concluída em:</span> {formatDate(evaluation.submittedAt)}
                      </div>
                    )}
                    
                    {evaluation.status === 'completed' && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Pontos Fortes</h4>
                            <p className="text-sm text-gray-600">{evaluation.strengths || 'Não informado'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Pontos de Melhoria</h4>
                            <p className="text-sm text-gray-600">{evaluation.improvements || 'Não informado'}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Metas e Objetivos</h4>
                          <p className="text-sm text-gray-600">{evaluation.goals || 'Não informado'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredEvaluations.length === 0 && !isLoading && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' ? 'Nenhuma avaliação encontrada' : 'Nenhuma avaliação cadastrada'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' 
                    ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
                    : 'Comece criando sua primeira avaliação de desempenho.'}
                </p>
                {!searchTerm && filterStatus === 'all' && filterDepartment === 'all' && (
                  <button
                    onClick={() => handleOpenEvaluationModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Criar Avaliação
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <ArrowPathIcon className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        )}

        {/* Modal de Formulário de Avaliação */}
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentForm ? 'Editar Formulário' : 'Novo Formulário'}
                  </h2>
                  <button
                    onClick={handleCloseFormModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título do Formulário *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formForm.title}
                      onChange={handleFormFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      value={formForm.description}
                      onChange={handleFormFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grupos Alvo
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Tecnologia', 'Design', 'Marketing', 'Vendas', 'RH', 'Gerência'].map((group) => (
                        <label key={group} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={formForm.targetGroups.includes(group)}
                            onChange={(e) => {
                              const updatedGroups = e.target.checked
                                ? [...formForm.targetGroups, group]
                                : formForm.targetGroups.filter(g => g !== group);
                              setFormForm(prev => ({ ...prev, targetGroups: updatedGroups }));
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{group}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formForm.status}
                      onChange={handleFormFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="active">Ativo</option>
                      <option value="archived">Arquivado</option>
                    </select>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Critérios de Avaliação</h3>
                      <button
                        type="button"
                        onClick={handleAddCriteria}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                        Adicionar Critério
                      </button>
                    </div>
                    
                    {formForm.criteria.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Nenhum critério adicionado</p>
                    ) : (
                      <div className="space-y-4">
                        {formForm.criteria.map((criteria, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="flex-grow space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                                  <input
                                    type="text"
                                    value={criteria.name}
                                    onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                  <input
                                    type="text"
                                    value={criteria.description}
                                    onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%) *</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={criteria.weight}
                                    onChange={(e) => handleCriteriaChange(index, 'weight', e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveCriteria(index)}
                                className="ml-4 p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="bg-gray-100 p-3 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Total dos pesos:</span>
                            <span className="text-sm font-semibold">
                              {formForm.criteria.reduce((sum, criteria) => sum + criteria.weight, 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseFormModal}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {currentForm ? 'Atualizar Formulário' : 'Criar Formulário'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Período de Avaliação */}
        {isPeriodModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentPeriod ? 'Editar Período' : 'Novo Período'}
                  </h2>
                  <button
                    onClick={handleClosePeriodModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handlePeriodSubmit} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título do Período *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={periodForm.title}
                      onChange={handlePeriodFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      value={periodForm.description}
                      onChange={handlePeriodFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Início *
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={periodForm.startDate}
                        onChange={handlePeriodFormChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        value={periodForm.endDate}
                        onChange={handlePeriodFormChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="formId" className="block text-sm font-medium text-gray-700 mb-1">
                      Formulário de Avaliação *
                    </label>
                    <select
                      id="formId"
                      name="formId"
                      value={periodForm.formId}
                      onChange={handlePeriodFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Selecione um formulário</option>
                      {evaluationForms.filter(form => form.status === 'active').map((form) => (
                        <option key={form.id} value={form.id}>{form.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={periodForm.status}
                      onChange={handlePeriodFormChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="upcoming">Futuro</option>
                      <option value="active">Ativo</option>
                      <option value="completed">Concluído</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClosePeriodModal}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {currentPeriod ? 'Atualizar Período' : 'Criar Período'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Avaliação de Funcionário */}
        {isEvaluationModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentEvaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
                  </h2>
                  <button
                    onClick={handleCloseEvaluationModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleEvaluationSubmit} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="periodId" className="block text-sm font-medium text-gray-700 mb-1">
                        Período de Avaliação *
                      </label>
                      <select
                        id="periodId"
                        name="periodId"
                        value={evaluationForm.periodId}
                        onChange={handleEvaluationFormChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Selecione um período</option>
                        {evaluationPeriods.map((period) => (
                          <option key={period.id} value={period.id}>{period.title}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={evaluationForm.status}
                        onChange={handleEvaluationFormChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                        Funcionário Avaliado *
                      </label>
                      <select
                        id="employeeId"
                        name="employeeId"
                        value={evaluationForm.employeeId}
                        onChange={handleEvaluationFormChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Selecione o funcionário</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>{employee.name} ({employee.department})</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="evaluatorId" className="block text-sm font-medium text-gray-700 mb-1">
                        Avaliador *
                      </label>
                      <select
                        id="evaluatorId"
                        name="evaluatorId"
                        value={evaluationForm.evaluatorId}
                        onChange={handleEvaluationFormChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Selecione o avaliador</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>{employee.name} ({employee.position})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {evaluationForm.periodId > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Critérios de Avaliação</h3>
                      
                      {(() => {
                        const period = evaluationPeriods.find(p => p.id === evaluationForm.periodId);
                        if (!period) return null;
                        
                        const form = evaluationForms.find(f => f.id === period.formId);
                        if (!form) return null;
                        
                        return (
                          <div className="space-y-4">
                            {form.criteria.map((criteria) => {
                              const score = evaluationForm.scores.find(s => s.criteriaId === criteria.id);
                              
                              return (
                                <div key={criteria.id} className="bg-gray-50 p-4 rounded-md">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="text-sm font-medium text-gray-800">{criteria.name}</h4>
                                      <p className="text-xs text-gray-600 mt-1">{criteria.description}</p>
                                    </div>
                                    <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                      Peso: {criteria.weight}%
                                    </span>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Pontuação (1-5)
                                    </label>
                                    <div className="flex items-center gap-2">
                                      {[1, 2, 3, 4, 5].map((value) => (
                                        <label key={value} className="inline-flex items-center">
                                          <input
                                            type="radio"
                                            name={`score-${criteria.id}`}
                                            checked={score?.score === value}
                                            onChange={() => handleScoreChange(criteria.id, 'score', value)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                          />
                                          <span className="ml-2 text-sm text-gray-700">{value}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <label htmlFor={`comment-${criteria.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                      Comentários
                                    </label>
                                    <textarea
                                      id={`comment-${criteria.id}`}
                                      name={`comment-${criteria.id}`}
                                      rows={2}
                                      value={score?.comment || ''}
                                      onChange={(e) => handleScoreChange(criteria.id, 'comment', e.target.value)}
                                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  
                  {evaluationForm.status === 'completed' && (
                    <>
                      <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="strengths" className="block text-sm font-medium text-gray-700 mb-1">
                              Pontos Fortes
                            </label>
                            <textarea
                              id="strengths"
                              name="strengths"
                              rows={3}
                              value={evaluationForm.strengths}
                              onChange={handleEvaluationFormChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="improvements" className="block text-sm font-medium text-gray-700 mb-1">
                              Pontos de Melhoria
                            </label>
                            <textarea
                              id="improvements"
                              name="improvements"
                              rows={3}
                              value={evaluationForm.improvements}
                              onChange={handleEvaluationFormChange}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                          Metas e Objetivos
                        </label>
                        <textarea
                          id="goals"
                          name="goals"
                          rows={3}
                          value={evaluationForm.goals}
                          onChange={handleEvaluationFormChange}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseEvaluationModal}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {currentEvaluation ? 'Atualizar Avaliação' : 'Salvar Avaliação'}
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