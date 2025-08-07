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


export default function ReturnTable() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     const fetchDataOfReturns= async()=>{
        try {
            setLoading(true)
            const returnedProducts=await returnService.getAll();
            setReturns(returnedProducts);
            console.log(" returnedProducts ",returnedProducts);
            

        } catch (error) {
        }finally{
            setLoading(false)
        }
     }
     fetchDataOfReturns();
    }, []);

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
           <LoadingSpinner/>
          ) : returns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                Nenhum retorno registrado.
              </TableCell>
            </TableRow>
          ) : (
            returns.map((ret) => (
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
    </div>
  );
}