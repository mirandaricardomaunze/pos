import { useState, useEffect } from 'react';
import { BriefcaseIcon, PlusIcon, PencilIcon, TrashIcon, ArrowPathIcon, UserIcon, ChevronRightIcon, EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

// Tipos para a página de recrutamento
interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  appliedDate: string;
  status: 'new' | 'screening' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected';
  notes?: string;
  rating?: number;
}

interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary';
  description: string;
  requirements: string;
  salary?: string;
  postedDate: string;
  closingDate?: string;
  status: 'draft' | 'open' | 'closed' | 'filled';
  candidates: Candidate[];
}

// Dados de exemplo (substituir por chamada à API real)
const mockJobPositions: JobPosition[] = [
  {
    id: 1,
    title: 'Desenvolvedor Front-end',
    department: 'Tecnologia',
    location: 'São Paulo - Remoto',
    type: 'full_time',
    description: 'Desenvolvimento de interfaces de usuário utilizando React e TypeScript.',
    requirements: 'Experiência com React, TypeScript, HTML5, CSS3. Conhecimento em UI/UX é um diferencial.',
    salary: 'R$ 6.000 - R$ 8.000',
    postedDate: '2023-05-10',
    status: 'open',
    candidates: [
      {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        resumeUrl: '/resumes/joao-silva.pdf',
        appliedDate: '2023-05-12',
        status: 'interview',
        notes: 'Bom conhecimento técnico, comunicação pode melhorar.',
        rating: 4
      },
      {
        id: 2,
        name: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        phone: '(11) 91234-5678',
        resumeUrl: '/resumes/maria-oliveira.pdf',
        appliedDate: '2023-05-15',
        status: 'technical',
        notes: 'Excelente comunicação, experiência relevante.',
        rating: 5
      }
    ]
  },
  {
    id: 2,
    title: 'Analista de Recursos Humanos',
    department: 'RH',
    location: 'São Paulo - Presencial',
    type: 'full_time',
    description: 'Responsável por processos de recrutamento, seleção e onboarding de novos colaboradores.',
    requirements: 'Formação em Psicologia ou áreas correlatas. Experiência em recrutamento e seleção.',
    salary: 'R$ 4.500 - R$ 5.500',
    postedDate: '2023-05-15',
    status: 'open',
    candidates: [
      {
        id: 3,
        name: 'Carlos Mendes',
        email: 'carlos.mendes@email.com',
        phone: '(11) 97777-8888',
        resumeUrl: '/resumes/carlos-mendes.pdf',
        appliedDate: '2023-05-18',
        status: 'screening',
        notes: 'Experiência em empresas de tecnologia.',
        rating: 3
      }
    ]
  },
  {
    id: 3,
    title: 'Gerente de Marketing',
    department: 'Marketing',
    location: 'São Paulo - Híbrido',
    type: 'full_time',
    description: 'Liderar equipe de marketing e desenvolver estratégias para aumentar a visibilidade da marca.',
    requirements: 'Experiência em gestão de equipes e campanhas de marketing digital. Formação em Marketing ou áreas relacionadas.',
    salary: 'R$ 10.000 - R$ 12.000',
    postedDate: '2023-04-20',
    closingDate: '2023-06-20',
    status: 'open',
    candidates: [
      {
        id: 4,
        name: 'Ana Costa',
        email: 'ana.costa@email.com',
        phone: '(11) 96666-7777',
        resumeUrl: '/resumes/ana-costa.pdf',
        appliedDate: '2023-04-25',
        status: 'offer',
        notes: 'Excelente experiência e perfil de liderança.',
        rating: 5
      },
      {
        id: 5,
        name: 'Roberto Alves',
        email: 'roberto.alves@email.com',
        phone: '(11) 95555-6666',
        resumeUrl: '/resumes/roberto-alves.pdf',
        appliedDate: '2023-04-28',
        status: 'rejected',
        notes: 'Bom perfil, mas não atende aos requisitos de experiência.',
        rating: 2
      }
    ]
  },
  {
    id: 4,
    title: 'Estágio em Desenvolvimento',
    department: 'Tecnologia',
    location: 'São Paulo - Presencial',
    type: 'internship',
    description: 'Estágio para estudantes de Ciência da Computação ou áreas relacionadas.',
    requirements: 'Cursando Ciência da Computação, Engenharia de Software ou áreas afins. Conhecimento básico em programação.',
    salary: 'R$ 1.800',
    postedDate: '2023-05-20',
    status: 'open',
    candidates: []
  }
];

// Mapeamento de status de candidato para cores e texto
const candidateStatusConfig = {
  new: { color: 'bg-gray-100 text-gray-800', label: 'Novo' },
  screening: { color: 'bg-blue-100 text-blue-800', label: 'Triagem' },
  interview: { color: 'bg-yellow-100 text-yellow-800', label: 'Entrevista' },
  technical: { color: 'bg-purple-100 text-purple-800', label: 'Teste Técnico' },
  offer: { color: 'bg-green-100 text-green-800', label: 'Proposta' },
  hired: { color: 'bg-indigo-100 text-indigo-800', label: 'Contratado' },
  rejected: { color: 'bg-red-100 text-red-800', label: 'Rejeitado' }
};

// Mapeamento de status de vaga para cores e texto
const jobStatusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho' },
  open: { color: 'bg-green-100 text-green-800', label: 'Aberta' },
  closed: { color: 'bg-yellow-100 text-yellow-800', label: 'Fechada' },
  filled: { color: 'bg-blue-100 text-blue-800', label: 'Preenchida' }
};

// Mapeamento de tipos de vaga para texto
const jobTypeLabels = {
  full_time: 'Tempo Integral',
  part_time: 'Meio Período',
  contract: 'Contrato',
  internship: 'Estágio',
  temporary: 'Temporário'
};

export default function RecruitmentPage() {
  const [jobPositions, setJobPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobPosition | null>(null);
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  
  // Formulário de vaga
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full_time' as 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary',
    description: '',
    requirements: '',
    salary: '',
    closingDate: '',
    status: 'draft' as 'draft' | 'open' | 'closed' | 'filled'
  });

  // Formulário de candidato
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    status: 'new' as 'new' | 'screening' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected',
    notes: '',
    rating: 0
  });

  useEffect(() => {
    fetchJobPositions();
  }, []);

  const fetchJobPositions = async () => {
    setIsLoading(true);
    try {
      // Simulando chamada à API
      setTimeout(() => {
        setJobPositions(mockJobPositions);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      toast.error('Não foi possível carregar as vagas');
      setIsLoading(false);
    }
  };

  // Manipulação de modal de vaga
  const handleOpenJobModal = (job: JobPosition | null = null) => {
    if (job) {
      setCurrentJob(job);
      setJobForm({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        description: job.description,
        requirements: job.requirements,
        salary: job.salary || '',
        closingDate: job.closingDate || '',
        status: job.status
      });
    } else {
      setCurrentJob(null);
      setJobForm({
        title: '',
        department: '',
        location: '',
        type: 'full_time',
        description: '',
        requirements: '',
        salary: '',
        closingDate: '',
        status: 'draft'
      });
    }
    setIsJobModalOpen(true);
  };

  const handleCloseJobModal = () => {
    setIsJobModalOpen(false);
  };

  // Manipulação de modal de candidato
  const handleOpenCandidateModal = (jobId: number, candidate: Candidate | null = null) => {
    const job = jobPositions.find(j => j.id === jobId);
    if (!job) return;

    setSelectedJob(job);

    if (candidate) {
      setCurrentCandidate(candidate);
      setCandidateForm({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        resumeUrl: candidate.resumeUrl,
        status: candidate.status,
        notes: candidate.notes || '',
        rating: candidate.rating || 0
      });
    } else {
      setCurrentCandidate(null);
      setCandidateForm({
        name: '',
        email: '',
        phone: '',
        resumeUrl: '',
        status: 'new',
        notes: '',
        rating: 0
      });
    }
    setIsCandidateModalOpen(true);
  };

  const handleCloseCandidateModal = () => {
    setIsCandidateModalOpen(false);
  };

  // Manipulação de formulários
  const handleJobFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCandidateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setCandidateForm(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setCandidateForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submissão de formulários
  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!jobForm.title || !jobForm.department || !jobForm.location) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Simulando salvamento
    if (currentJob) {
      // Atualização
      const updatedJobs = jobPositions.map(job => 
        job.id === currentJob.id ? { 
          ...currentJob,
          ...jobForm,
          candidates: currentJob.candidates // Mantém os candidatos existentes
        } : job
      );
      setJobPositions(updatedJobs);
      toast.success('Vaga atualizada com sucesso!');
    } else {
      // Criação
      const newJob: JobPosition = {
        ...jobForm,
        id: Math.max(0, ...jobPositions.map(job => job.id)) + 1,
        postedDate: new Date().toISOString().split('T')[0],
        candidates: []
      };
      setJobPositions([...jobPositions, newJob]);
      toast.success('Nova vaga criada com sucesso!');
    }

    handleCloseJobModal();
  };

  const handleCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) return;
    
    // Validação básica
    if (!candidateForm.name || !candidateForm.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Simulando salvamento
    if (currentCandidate) {
      // Atualização
      const updatedJobs = jobPositions.map(job => {
        if (job.id === selectedJob.id) {
          const updatedCandidates = job.candidates.map(candidate => 
            candidate.id === currentCandidate.id ? { 
              ...currentCandidate,
              ...candidateForm
            } : candidate
          );
          return { ...job, candidates: updatedCandidates };
        }
        return job;
      });
      setJobPositions(updatedJobs);
      toast.success('Candidato atualizado com sucesso!');
    } else {
      // Criação
      const newCandidate: Candidate = {
        ...candidateForm,
        id: Math.max(0, ...selectedJob.candidates.map(c => c.id), 0) + 1,
        appliedDate: new Date().toISOString().split('T')[0]
      };
      
      const updatedJobs = jobPositions.map(job => 
        job.id === selectedJob.id ? { 
          ...job, 
          candidates: [...job.candidates, newCandidate] 
        } : job
      );
      
      setJobPositions(updatedJobs);
      toast.success('Novo candidato adicionado com sucesso!');
    }

    handleCloseCandidateModal();
  };

  const handleDeleteJob = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      setJobPositions(jobPositions.filter(job => job.id !== id));
      toast.success('Vaga excluída com sucesso!');
    }
  };

  const handleDeleteCandidate = (jobId: number, candidateId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este candidato?')) {
      const updatedJobs = jobPositions.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            candidates: job.candidates.filter(candidate => candidate.id !== candidateId)
          };
        }
        return job;
      });
      
      setJobPositions(updatedJobs);
      toast.success('Candidato excluído com sucesso!');
    }
  };

  // Filtragem de vagas
  const filteredJobs = jobPositions.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || job.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Lista de departamentos únicos para o filtro
  const departments = Array.from(new Set(jobPositions.map(job => job.department)));

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
            <div className="p-3 bg-blue-600 rounded-lg shadow">
              <BriefcaseIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Recrutamento e Seleção
              </h1>
              <p className="text-gray-600">
                Gerencie vagas e candidatos
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchJobPositions}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm transition"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <button
              onClick={() => handleOpenJobModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <PlusIcon className="h-5 w-5" />
              Nova Vaga
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">Buscar vagas</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Buscar vagas..."
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
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos os status</option>
                <option value="draft">Rascunho</option>
                <option value="open">Aberta</option>
                <option value="closed">Fechada</option>
                <option value="filled">Preenchida</option>
              </select>
            </div>
            
            <div className="w-full md:w-48">
              <label htmlFor="filterDepartment" className="sr-only">Filtrar por departamento</label>
              <select
                id="filterDepartment"
                name="filterDepartment"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">Todos os departamentos</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Positions List */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jobStatusConfig[job.status].color}`}>
                        {jobStatusConfig[job.status].label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{jobTypeLabels[job.type]}</span>
                      {job.salary && (
                        <>
                          <span>•</span>
                          <span>{job.salary}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenJobModal(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Requisitos:</strong> {job.requirements}
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Descrição:</strong> {job.description}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-6">
                  <div>
                    <span className="font-medium">Publicada em:</span> {formatDate(job.postedDate)}
                  </div>
                  {job.closingDate && (
                    <div>
                      <span className="font-medium">Encerra em:</span> {formatDate(job.closingDate)}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Candidatos:</span> {job.candidates.length}
                  </div>
                </div>
                
                {/* Candidates Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Candidatos</h4>
                    <button
                      onClick={() => handleOpenCandidateModal(job.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="-ml-0.5 mr-1 h-4 w-4" />
                      Adicionar
                    </button>
                  </div>
                  
                  {job.candidates.length > 0 ? (
                    <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {job.candidates.map((candidate) => (
                          <li key={candidate.id} className="hover:bg-gray-50">
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center min-w-0">
                                <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                  </div>
                                </div>
                                <div className="ml-4 min-w-0">
                                  <div className="flex items-center">
                                    <p className="text-sm font-medium text-gray-900 truncate">{candidate.name}</p>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${candidateStatusConfig[candidate.status].color}`}>
                                      {candidateStatusConfig[candidate.status].label}
                                    </span>
                                  </div>
                                  <div className="mt-1 flex text-sm text-gray-500">
                                    <p className="truncate">{candidate.email}</p>
                                    <span className="mx-1">•</span>
                                    <p className="truncate">{candidate.phone}</p>
                                  </div>
                                  {candidate.rating && (
                                    <div className="mt-1 flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <svg
                                          key={i}
                                          className={`h-4 w-4 ${i < candidate.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenCandidateModal(job.id, candidate)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Editar candidato"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCandidate(job.id, candidate.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                  title="Excluir candidato"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-md border border-gray-200">
                      <UserIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Nenhum candidato para esta vaga</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' ? 'Nenhuma vaga encontrada' : 'Nenhuma vaga cadastrada'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' 
                ? 'Tente ajustar seus filtros para encontrar o que está procurando.'
                : 'Comece criando sua primeira vaga.'}
            </p>
            {!searchTerm && filterStatus === 'all' && filterDepartment === 'all' && (
              <button
                onClick={() => handleOpenJobModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Criar Vaga
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Job Modal */}
        {isJobModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentJob ? 'Editar Vaga' : 'Nova Vaga'}
                  </h2>
                  <button
                    onClick={handleCloseJobModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleJobSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Título da Vaga *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={jobForm.title}
                      onChange={handleJobFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento *
                      </label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={jobForm.department}
                        onChange={handleJobFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Localização *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={jobForm.location}
                        onChange={handleJobFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Contratação *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={jobForm.type}
                        onChange={handleJobFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="full_time">Tempo Integral</option>
                        <option value="part_time">Meio Período</option>
                        <option value="contract">Contrato</option>
                        <option value="internship">Estágio</option>
                        <option value="temporary">Temporário</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={jobForm.status}
                        onChange={handleJobFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="draft">Rascunho</option>
                        <option value="open">Aberta</option>
                        <option value="closed">Fechada</option>
                        <option value="filled">Preenchida</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                        Faixa Salarial
                      </label>
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={jobForm.salary}
                        onChange={handleJobFormChange}
                        placeholder="Ex: R$ 3.000 - R$ 4.000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Encerramento
                      </label>
                      <input
                        type="date"
                        id="closingDate"
                        name="closingDate"
                        value={jobForm.closingDate}
                        onChange={handleJobFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                      Requisitos *
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      rows={3}
                      value={jobForm.requirements}
                      onChange={handleJobFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição da Vaga *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseJobModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {currentJob ? 'Atualizar' : 'Criar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Modal */}
        {isCandidateModalOpen && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentCandidate ? 'Editar Candidato' : 'Novo Candidato'}
                  </h2>
                  <button
                    onClick={handleCloseCandidateModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 text-sm text-gray-500">
                  <p>Vaga: <span className="font-medium text-gray-700">{selectedJob.title}</span></p>
                </div>

                <form onSubmit={handleCandidateSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={candidateForm.name}
                      onChange={handleCandidateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={candidateForm.email}
                      onChange={handleCandidateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={candidateForm.phone}
                      onChange={handleCandidateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Link para Currículo
                    </label>
                    <input
                      type="text"
                      id="resumeUrl"
                      name="resumeUrl"
                      value={candidateForm.resumeUrl}
                      onChange={handleCandidateFormChange}
                      placeholder="URL do currículo ou LinkedIn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={candidateForm.status}
                      onChange={handleCandidateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="new">Novo</option>
                      <option value="screening">Triagem</option>
                      <option value="interview">Entrevista</option>
                      <option value="technical">Teste Técnico</option>
                      <option value="offer">Proposta</option>
                      <option value="hired">Contratado</option>
                      <option value="rejected">Rejeitado</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={candidateForm.notes}
                      onChange={handleCandidateFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                      Avaliação (1-5)
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCandidateForm(prev => ({ ...prev, rating: star }))}
                          className="p-1 focus:outline-none"
                        >
                          <svg
                            className={`h-6 w-6 ${star <= candidateForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseCandidateModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {currentCandidate ? 'Atualizar' : 'Adicionar'}
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