import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  GiftIcon,
  ChartBarIcon,
  StarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { SunIcon } from '@heroicons/react/16/solid';

const RHPage = () => {
  const navigate = useNavigate();

  const links = [
  {
    label: 'Dashboard de RH',
    path: '/rh/dashboard',
    Icon: ChartBarIcon,
    description: 'Visualize gráficos e indicadores estratégicos',
    color: 'text-cyan-600'
   },
    { 
      label: 'Funcionários', 
      path: '/employees',
      Icon: UserGroupIcon,
      description: 'Gerencie os dados dos colaboradores e equipes',
      color: 'text-blue-600'
    },
    { 
      label: 'Presenças', 
      path: '/attendance',
      Icon: ClipboardDocumentCheckIcon,
      description: 'Controle de frequência e registros diários',
      color: 'text-green-600'
    },
    { 
      label: 'Faltas', 
      path: '/employees-absences',
      Icon: ExclamationTriangleIcon,
      description: 'Acompanhe ausências e justificativas',
      color: 'text-amber-600'
    },
    { 
      label: 'Folha de Pagamento', 
      path: '/payroll',
      Icon: CurrencyDollarIcon,
      description: 'Processamento e histórico de pagamentos',
      color: 'text-emerald-600'
    },
     { 
      label: 'Ferias', 
      path: '/vacations',
      Icon: SunIcon,
      description: 'Ferias e licenças dos colaboradores',
      color: 'text-purple-600'
    },
    { 
      label: 'Turnos e Horários', 
      path: '/rh/shifts',
      Icon: ClockIcon,
      description: 'Gestão de escalas e jornadas de trabalho',
      color: 'text-purple-600'
    },
    { 
      label: 'Benefícios', 
      path: '/rh/benefits',
      Icon: GiftIcon,
      description: 'Administração de benefícios corporativos',
      color: 'text-rose-600'
    },
    { 
      label: 'Avaliação de Desempenho', 
      path: '/rh/performance',
      Icon: StarIcon,
      description: 'Sistema de avaliações e feedback',
      color: 'text-yellow-600'
    },
    { 
      label: 'Departamentos', 
      path: '/rh/departments',
      Icon: BuildingOfficeIcon,
      description: 'Gestão de departamentos e estrutura organizacional',
      color: 'text-gray-600'
    },
    { 
      label: 'Treinamentos', 
      path: '/rh/trainings',
      Icon: AcademicCapIcon,
      description: 'Programas de capacitação e desenvolvimento',
      color: 'text-blue-600'
    },
    { 
      label: 'Recrutamento', 
      path: '/rh/recruitment',
      Icon: BriefcaseIcon,
      description: 'Gestão de vagas e processo seletivo',
      color: 'text-green-600'
    },
    { 
      label: 'Relatórios de RH', 
      path: '/rh/reports',
      Icon: ChartBarIcon,
      description: 'Analytics e relatórios gerenciais',
      color: 'text-indigo-600'
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-50 mb-10 min-h-screen">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Recursos Humanos</h1>
        <p className="text-gray-600 mt-2">Gestão completa de talentos e operações de RH</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {links.map(({ label, path, Icon, description, color }) => (
          <div
            key={path}
            onClick={() => navigate(path)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-200 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${color} bg-opacity-10 group-hover:bg-opacity-20 mr-4 transition-all`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {label}
                </h2>
              </div>
              <p className="text-gray-500 text-sm pl-[52px]">{description}</p>
              <div className="mt-5 flex justify-end">
                <span className="text-blue-500 text-sm font-medium group-hover:underline flex items-center">
                  Acessar
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RHPage;