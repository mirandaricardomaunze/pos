import { VacationForm } from "../../components/vacation/VacationForm";
import { VacationList } from "../../components/vacation/VacationList";

export default function VacationsPage() {
  const employeeId = 1; // exemplo fixo (pode vir do contexto de auth)

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Gestão de Férias
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Solicite novas férias ou acompanhe seus pedidos
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Form Section */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow-xl rounded-2xl p-6 h-fit sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Nova Solicitação
              </h2>
              <VacationForm />
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Minhas Solicitações
                </h2>
              </div>
              <VacationList mode="employee" employeeId={employeeId} />
            </div>
          </div>
        </div>

        {/* Admin Section (comentado) */}
        {/*
        <div className="mt-12">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Solicitações da Empresa
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Visão administrativa de todas as solicitações
              </p>
            </div>
            <VacationList mode="company" />
          </div>
        </div>
        */}
      </div>
    </div>
  );
}