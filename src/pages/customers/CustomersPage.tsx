import { PlusIcon } from '@heroicons/react/16/solid';
import CustomerTable from '../../components/customers/CustomersTable';
import Button from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CustomersPage() {
  const navigate=useNavigate();

  return (
    <div className="p-6 space-y-6">
         <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Clientes</h2>
               <Button
                 onClick={()=> {navigate('/customers/new') }}
               >
                  <PlusIcon className='h-4 w-4 mr-1'/>
                   Novo cliente
               </Button>
            </div>
      <CustomerTable />
    </div>
  );
}