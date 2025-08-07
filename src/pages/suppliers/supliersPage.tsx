import { PlusIcon } from '@heroicons/react/20/solid';
import {SupplierTable} from '../../components/suppliers/suppliersTable';
import Button from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const SupliersPage = () => {
  const navigate = useNavigate();
  return (
    <div className="mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:justify-between items-start xs:items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Fornecedores</h1>
          <Button onClick={()=>navigate("/suppliers/new")} className="gap-2">
          <PlusIcon className='h-4 w-4' />
           Novo Fornecedor
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <SupplierTable />
      </div>
    </div>
  );
};

export default SupliersPage;