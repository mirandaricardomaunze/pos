import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ContextSidebarProvider } from './context/contextsidebar/contextsidebar';
import { AuthProvider } from './context/userContext/usercontext';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoutes } from './components/protecteRoutes/ProtectedRoutes';
import Layout from './layout/mainlayout/layout'; // Layout com <Outlet />
import LoadingSpinner from './components/loading/LoadingSpinner';
import { CartProvider } from './context/cartContext/cartContext';
import MovementsPage from './pages/movements/MovementsPage';




// Lazy-loaded pages
const Home = lazy(() => import('./pages/home/home'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const BenefitsPage = lazy(() => import('./pages/Rh/BenefitsPage'));
const Reports = lazy(() => import('./pages/reports/ReportPage'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const InvoiceForm = lazy(()=>import ('./components/invoice/InvoiceForm'))
const InvoicesPage = lazy(()=>import ('./pages/invoice/InvoicePage'))
const Pos = lazy(() => import('./pages/Pos/Pos'));
const Login = lazy(() => import('./pages/userLogin/login'));
const SignUp = lazy(() => import('./pages/userSignUp/signup'));
const ProductForm = lazy(() => import('./components/product/productForm'));
const ProductsPage = lazy(() => import('./pages/products/productsPage'));
const CategoriesPage = lazy(() => import('./pages/categories/categoriesPage'));
const CategoryForm = lazy(() => import('./components/category/categoryForm'));
const SuppliersFormPage = lazy(() => import('./pages/suppliers/supliersFormPage'));
const SupliersPage = lazy(() => import('./pages/suppliers/supliersPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const SettingForm = lazy(() => import('./components/settings/SettingForm'));
const CompaniesPage = lazy(() => import('./pages/company/CompaniesPage'));
const CompanyForm = lazy(() => import('./components/company/CompanyForm'));
const EmployeesPage = lazy(() => import('./pages/employee/EmployeePage'));
const EmployeeForm = lazy(() => import('./components/employees/EmployeeForm'));
const CustomerForm = lazy(() => import('./components/customers/CustomersForm'));
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'));
const ReturnPage = lazy(() => import('./pages/return/ReturnPage'));
const ShiftsPage = lazy(() => import('./pages/Rh/ShiftsPage'));
const ReturnForm = lazy(() => import('./components/return/ReturnForm'));
const OrderForm = lazy(() => import('./components/order/OrderForm'));
const OrderPage = lazy(() => import('./pages/order/OrderPage'));
const AttendanceByDatePage = lazy(() => import('./components/attendance/AttendanceByDatePage'));
const AttendancePage = lazy(() => import('./pages/attendance/AttendancePage'));
const AbsencePage = lazy(() => import('./pages/absence/AbsencePage'));
const VacationPage = lazy(() => import('./pages/vacationPage/VacationPage'));
const PayrollPage = lazy(() => import('./pages/payroll/PayrollPage'));
const PayrollForm = lazy(() => import('./components/payroll/PayrollForm'));
const RHPage = lazy(() => import('./pages/Rh/RhPage'));
const DashboardRH = lazy(() => import('./pages/Rh/DashboardRh'));
const ReportRh = lazy(() => import('./pages/Rh/ReportRh'));
const PerformanceEvaluationPage = lazy(() => import('./pages/Rh/PerformanceEvaluationPage'));
const DepartmentsPage = lazy(() => import('./pages/Rh/DepartmentsPage'));
const TrainingsPage = lazy(() => import('./pages/Rh/TrainingsPage'));
const RecruitmentPage = lazy(() => import('./pages/Rh/RecruitmentPage'));

const App = () => {
  return (
    <ContextSidebarProvider>
        <CartProvider>
          <AuthProvider>
            <ToastContainer />
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <LoadingSpinner />
              </div>
            }>
              {/* Rotas principais */}
              <Routes>
                {/* Rotas com layout */}
                <Route element={<Layout />}>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER', 'USER', 'OPERATOR']}>
                        <Home />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER', 'USER', 'OPERATOR']}>
                        <Dashboard />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER', 'USER', 'OPERATOR']}>
                        <ProductsPage />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/invoices"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER']}>
                        <InvoicesPage />
                      </ProtectedRoutes>
                    }
                  />
                   <Route
                    path="/invoices/new"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER']}>
                        <InvoiceForm />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER', 'USER', 'OPERATOR']}>
                        <Reports />
                      </ProtectedRoutes>
                    }
                  />
                  <Route
                    path="/profiles"
                    element={
                      <ProtectedRoutes roles={['ADMIN', 'SELLER', 'MANAGER', 'USER', 'OPERATOR']}>
                        <Profile />
                      </ProtectedRoutes>
                    }
                  />
                  <Route path="/rh/shifts" element={<ShiftsPage />} />
                  <Route path="/rh/reports" element={<ReportRh />} />
                  <Route path="/rh/benefits" element={<BenefitsPage />} />
                  <Route path="/rh/performance" element={<PerformanceEvaluationPage />} />
                  <Route path="/rh/departments" element={<DepartmentsPage />} />
                  <Route path="/rh/trainings" element={<TrainingsPage />} />
                  <Route path="/rh/recruitment" element={<RecruitmentPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/movements" element={<MovementsPage />} />
                  <Route path="/new/product" element={<ProductForm />} />
                  <Route path="/suppliers/new" element={<SuppliersFormPage />} />
                  <Route path="/suppliers" element={<SupliersPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories_new" element={<CategoryForm />} />
                  <Route path="/settings/:key" element={<SettingForm />} />
                  <Route path="/companies" element={<CompaniesPage />} />
                  <Route path="/companies/new" element={<CompanyForm />} />
                  <Route path="/employees" element={<EmployeesPage />} />
                  <Route path="/employees/new" element={<EmployeeForm />} />
                  <Route path="/attendance/by-date" element={<AttendanceByDatePage />} />
                  <Route path="/employees-absences" element={<AbsencePage />} />
                  <Route path="/vacations" element={<VacationPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/rh" element={<RHPage />} />
                  <Route path="/rh/dashboard" element={<DashboardRH />} />
                  <Route path="/payroll" element={<PayrollPage />} />
                  <Route path="/payroll/new" element={<PayrollForm onSuccess={() => {}} />} />
                  <Route path="/customers/new" element={<CustomerForm />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/returns" element={<ReturnPage />} />
                  <Route path="/returns/new" element={<ReturnForm />} />
                  <Route path="/orders/new" element={<OrderForm />} />
                  <Route path="/orders" element={<OrderPage />} />
                  <Route path="/pos" element={<Pos />} />
                </Route>

                {/* Rotas fora do layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
               
                

                {/* Página 404 */}
                <Route
                  path="*"
                  element={
                    <div className="flex items-center justify-center min-h-screen">
                      <h1 className="text-2xl font-bold text-gray-800">404 - Página não encontrada</h1>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </AuthProvider>
        </CartProvider>
    </ContextSidebarProvider>
  );
};

export default App;
