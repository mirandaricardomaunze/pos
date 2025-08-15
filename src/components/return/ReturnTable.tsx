import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/table/table';
import returnService from '../../services/returnService/returnService';
import type { Return } from '../../types/returns';
import LoadingSpinner from '../loading/LoadingSpinner';
import { Pagination } from '../pagination/pagination';


export default function ReturnTable() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDataOfReturns = async () => {
      try {
        setLoading(true);
        const returnedProducts = await returnService.getAll();
        setReturns(returnedProducts);
        console.log('returnedProducts', returnedProducts);
      } catch (error) {
        console.error('Erro ao buscar retornos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataOfReturns();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReturns = returns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(Math.ceil(returns.length / itemsPerPage), 1);

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Quem devolveu</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Processado por</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : currentReturns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Nenhum retorno registrado.
              </TableCell>
            </TableRow>
          ) : (
            currentReturns.map((ret) => (
              <TableRow key={ret.id}>
                <TableCell>{ret.product?.name || '—'}</TableCell>
                <TableCell>{ret.quantity}</TableCell>
                <TableCell>{ret.reason || '—'}</TableCell>
                <TableCell>{ret.returnedBy}</TableCell>
                <TableCell>{ret.carPlate || '—'}</TableCell>
                <TableCell>{ret.processedBy?.name || '—'}</TableCell>
                <TableCell>{new Date(ret.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Paginação */}
      
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
    
    </div>
  );
}
