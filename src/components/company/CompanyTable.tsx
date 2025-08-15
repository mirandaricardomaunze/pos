import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Company } from '../../types/company';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../components/table/table';
import Button from '../../components/ui/button';
import { toast } from 'react-toastify';
import companyService from '../../services/companyService/companyService';
import { Pagination } from '../pagination/pagination';

export default function CompanyTablePage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err) {
      toast.error('Erro ao buscar empresas.');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(Math.ceil(companies.length / itemsPerPage), 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Empresas</h2>
        <Button
          onClick={() => navigate('/companies/new')}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Nova Empresa
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 w-auto">
        {companies.length === 0 ? (
          <p className="text-gray-500 text-sm flex justify-center items-center">
            Nenhuma empresa cadastrada.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>NUIT</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.phone}</TableCell>
                    <TableCell>{company.Nuit}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/empresas/editar/${company.id}`)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
