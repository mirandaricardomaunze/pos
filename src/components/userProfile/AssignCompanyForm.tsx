import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import userService from "../../services/userService/userService";
import companyService from "../../services/companyService/companyService";


interface Company {
  id: number;
  name: string;
}

interface AssignCompanyFormProps {
  currentCompanyId?: number | null;
  onCompanyAssigned: (companyId: number) => void;
}

const AssignCompanyForm: React.FC<AssignCompanyFormProps> = ({
  currentCompanyId,
  onCompanyAssigned,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyIdInput, setCompanyIdInput] = useState<number | "">(currentCompanyId ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companyService.getCompanies();
        setCompanies(res);
      } catch (err: any) {
        toast.error("Erro ao carregar empresas.");
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyIdInput || companyIdInput <= 0) {
      toast.warn("Por favor, selecione uma empresa válida.");
      return;
    }

    try {
      setLoading(true);
      const res = await userService.assignCompany(Number(companyIdInput));
      toast.success(res.message || "Empresa associada com sucesso!");
      onCompanyAssigned(Number(companyIdInput));
    } catch (err: any) {
      console.error("erro ", err);
      toast.error(err?.message || "Erro ao associar empresa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="overflow-hidden"
    >
      <p className="text-sm text-gray-500 mb-6">Selecione a empresa à qual você deseja se vincular</p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <div className="relative">
            <select
              id="companyId"
              value={companyIdInput}
              onChange={(e) => setCompanyIdInput(Number(e.target.value))}
              className="
                w-full 
                p-3
                border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                transition 
                disabled:bg-gray-100 disabled:cursor-not-allowed
                text-gray-800
                appearance-none
              "
              disabled={loading}
            >
              <option value=""> Selecione uma empresa </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {companies.length === 0 && (
            <p className="mt-2 text-sm text-yellow-600">Nenhuma empresa disponível para seleção</p>
          )}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading || companies.length === 0}
            className="
              w-full 
              bg-blue-600 
              text-white 
              font-medium 
              py-3 rounded-lg 
              hover:bg-blue-700 
              disabled:opacity-50 
              disabled:cursor-not-allowed
              transition-colors
              shadow-md
              flex items-center justify-center
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Associando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Associar Empresa
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AssignCompanyForm;
