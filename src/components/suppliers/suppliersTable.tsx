import React, { useState, useEffect } from 'react';
import { SupplierService } from '../../services/suppliersService/suppliersService';
import type { SupplierFormData } from '../../types/suppliers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table/table';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import { Pagination } from '../pagination/pagination';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import  Modal  from '../modal/modal';
import { toast } from 'react-toastify';
import LoadingSpinner from '../loading/LoadingSpinner';
import SupplierForm from './suppliersForm';

const ITEMS_PER_PAGE = 10;

export const SupplierTable: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierFormData[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierFormData | null>(null);

  // Buscar fornecedores
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        const data = await SupplierService.getSuppliers();
        setSuppliers(data);
        setFilteredSuppliers(data);
      } catch (error) {
        toast.error('Erro ao buscar fornecedores');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Filtrar fornecedores
  useEffect(() => {
    const filtered = suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.legalBusinessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.nuit.includes(searchTerm)
    );
    setFilteredSuppliers(filtered);
    setCurrentPage(1);
  }, [searchTerm, suppliers]);

  // Paginação
  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Excluir fornecedor
  const handleDelete = async () => {
    if (!selectedSupplier) return;

    try {
      await SupplierService.deleteSupplier(selectedSupplier.id!.toString());
      setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
      toast.success('Fornecedor excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir fornecedor');
    } finally {
      setDeleteModalOpen(false);
      setSelectedSupplier(null);
    }
  };

  // Criar ou atualizar fornecedor
  const handleEdit = async (supplier: SupplierFormData) => {
    try {
      let result: SupplierFormData;
      if (supplier.id) {
        // Atualizar
        result = await SupplierService.updateSupplier(supplier.id.toString(), supplier);
        setSuppliers(prev => prev.map(s => (s.id === result.id ? result : s)));
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        // Criar novo
        result = await SupplierService.createSupplier(supplier);
        setSuppliers(prev => [...prev, result]);
       toast.success('Fornecedor criado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao salvar fornecedor');
    } finally {
      setEditModalOpen(false);
      setSelectedSupplier(null);
    }
  };

  return (
    <div className="space-y-4 p-10">
      {/* Barra de ações */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute h-5 w-5 left-3 top-6 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Pesquisar fornecedores..."
            className="pl-10"
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>NUIT</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : paginatedSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhum fornecedor encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.legalBusinessName}</TableCell>
                  <TableCell>{supplier.nuit}</TableCell>
                  <TableCell>{supplier.city}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      supplier.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setEditModalOpen(true);
                      }}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {filteredSuppliers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal de Edição/Criação */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={selectedSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      >
        <SupplierForm
          initialValues={selectedSupplier || undefined}
          onSubmit={handleEdit}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir o fornecedor{' '}
            <strong>{selectedSupplier?.name}</strong>?
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Confirmar Exclusão
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default SupplierTable;