import { useNavigate } from 'react-router-dom';
import ReturnTable from '../../components/return/ReturnTable';
import Button from '../../components/ui/button';
import { PlusIcon } from '@heroicons/react/16/solid';

export default function ReturnPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Retornos</h1>
        <Button
          onClick={() => navigate('/returns/new')}
          className="btn-primary"
        >
         <PlusIcon className='h-4 w-4'/>
          Novo Retorno
        </Button>
      </div>

      {/* Tabela com histórico de retornos */}
      <section>
        <ReturnTable />
      </section>
    </div>
  );
}