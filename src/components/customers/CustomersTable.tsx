import { useEffect, useState } from 'react';
import customerService from '../../services/customersService/customersService';
import type { Customer } from '../../types/customer';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/table/table';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import LoadingSpinner from '../loading/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataCustomers = async () => {
      try {
        setLoading(true);
        const customersData = await customerService.getAll();
        setCustomers(customersData);
      } catch (error) {
        console.error(error);
        toast.error('Não foi possível carregar os clientes');
      } finally {
        setLoading(false);
      }
    };
    fetchDataCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir este cliente?')) return;
    try {
      await customerService.delete(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success('Cliente excluído com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir o cliente');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow mb-10 mt-10">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>NUIT</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email || '—'}</TableCell>
                  <TableCell>{c.phone || '—'}</TableCell>
                  <TableCell>{c.nuit || '—'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.isActive ? 'Sim' : 'Não'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/clientes/editar/${c.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label="Editar cliente"
                        title="Editar cliente"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Excluir cliente"
                        title="Excluir cliente"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}