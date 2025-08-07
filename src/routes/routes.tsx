import {
  HomeIcon,
  ChartBarIcon,
  QrCodeIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
  BuildingStorefrontIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  PresentationChartLineIcon,
  TruckIcon,
  BriefcaseIcon,
  ClockIcon,
  UsersIcon,
  CogIcon,
  UserPlusIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { RouteType } from '../types/routes';

const routesSidebar: RouteType[] = [
  {
    to: '/',
    title: 'Inicio',
    text: 'Inicio',
    icon: <HomeIcon className="h-6 w-6" />,
  },
  {
    to: '/dashboard',
    title: 'Painel',
    text: 'Painel',
    icon: <ChartBarIcon className="h-6 w-6" />,
  },
  {
    to: '/products',
    title: 'Produtos',
    text: 'Produtos',
    icon: <QrCodeIcon className="h-6 w-6" />,
  },
  {
    to: '/orders',
    title: 'Pedidos',
    text: 'Pedidos',
    icon: <ShoppingCartIcon className="h-5 w-5" />,
  },
  {
    to: '/returns',
    title: 'Devoluções',
    text: 'Devoluções',
    icon: <ArrowPathIcon className="h-6 w-6" />,
  },
  {
    to: '/suppliers',
    title: 'Fornecedores',
    text: 'Fornecedores',
    icon: <BuildingStorefrontIcon className="h-6 w-6" />,
  },
  {
    to: '/categories',
    title: 'Categorias',
    text: 'Categorias',
    icon: <Squares2X2Icon className="h-6 w-6" />,
  },
  {
    to: '/pos',
    title: 'Ponto de venda',
    text: 'PDV',
    icon: <ShoppingBagIcon className="h-6 w-6" />,
  },
  {
    to: '/reports',
    title: 'Relatórios',
    text: 'Relatórios',
    icon: <PresentationChartLineIcon className="h-6 w-6" />,
  },
  {
    to: '/movements',
    title: 'Movimentos',
    text: 'Movimentos',
    icon: <TruckIcon className="h-6 w-6" />,
    role: ['admin'],
  },
  {
    to: '/companies',
    title: 'Empresa',
    text: 'Empresa',
    icon: <BuildingOfficeIcon className="h-6 w-6" />,
    role: ['admin'],
  },
  {
    to: '/employees',
    title: 'Funcionários',
    text: 'Funcionários',
    icon: <BriefcaseIcon className="h-6 w-6" />,
    role: ['admin'],
  },
  {
    to: '/attendance',
    title: 'Presença',
    text: 'Presença',
    icon: <ClockIcon className="h-6 w-6" />,
    role: ['ADMIN', 'EMPLOYEE'],
  },
  {
    to: '/rh',
    title: 'Recursos Humanos',
    text: 'RH',
    icon: <UsersIcon className="h-8 w-8" />,
    role: ['ADMIN', 'EMPLOYEE'],
  },
  {
    to: '/customers',
    title: 'Clientes',
    text: 'Clientes',
    icon: <UsersIcon className="h-6 w-6" />,
    role: ['admin'],
  },
  {
    to: '/settings',
    title: 'Definições',
    text: 'Definições',
    icon: <CogIcon className="h-6 w-6" />,
  },
  {
    to: '/register',
    title: 'Cadastrar',
    text: 'Cadastrar',
    icon: <UserPlusIcon className="h-6 w-6" />,
  },
  {
    to: '/login',
    title: 'Login',
    text: 'Login',
    icon: <UserCircleIcon className="h-6 w-6" />,
  },

];

const routesNavbar: RouteType[] = [
  {
    to: '/profiles',
    title: 'Perfil',
    text: 'Perfil',
    icon: <UserCircleIcon className="h-6 w-6 text-white" />,
  },
];

export { routesSidebar, routesNavbar };
