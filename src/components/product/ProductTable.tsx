import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../table/table';
import { Pagination } from '../../components/pagination/pagination';
import Input from '../../components/ui/input';
import { ProductService } from '../../services/productService/productService';
import type { ProductFormData } from '../../types/product';

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import LoadingSpinner from '../loading/LoadingSpinner';
import { toast } from 'react-toastify';
import Button from '../ui/button';
import  Modal  from '../modal/modal';
import ProductForm from './productForm';

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getProductByCompanyId();
        setProducts(data);
        setTotalProducts(data.length);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Falha ao carregar produtos. Tente novamente mais tarde.');
        toast.error('Falha ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar produtos com base no termo de busca
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(searchTerm) ||
    product.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obter produtos para a página atual
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const confirmDeleteProduct = async () => {
  if (productIdToDelete === null) return;
  try {
    await ProductService.deleteProduct(productIdToDelete);
    setProducts(products.filter(product => product.id !== productIdToDelete));
    setTotalProducts(prev => prev - 1);
    toast.success('Produto excluído com sucesso');
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    toast.error('Falha ao excluir produto. Tente novamente.');
  } finally {
    setShowDeleteModal(false);
    setProductIdToDelete(null);
  }
};


  const calculateProfit = (product: ProductFormData) => {
    const sellingPrice = product.sellingPrice || 0;
    const purchasePrice = product.purchasePrice || 0;
    const iva = product.iva || 0;
    
    // Cálculo simplificado do lucro (pode ser ajustado conforme sua lógica de negócios)
    return sellingPrice - purchasePrice -(iva / 100);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-10 bg-white rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute  h-5 w-5 left-3 top-6 transform -translate-y-1/2 text-gray-400" /> 
          <Input
            placeholder="Digite nome, código de barras ou referência..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Código de Barras</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead className="text-right">Preço de Compra</TableHead>
            <TableHead className="text-right">Preço de Venda</TableHead>
            <TableHead className="text-right">IVA</TableHead>
            <TableHead className="text-right">Lucro</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {product.name}
                </TableCell>
                <TableCell>{product.quantity || 0}</TableCell>
                <TableCell>{product.barcode || '-'}</TableCell>
                <TableCell>{product.reference || 'Sem referência'}</TableCell>
                <TableCell className="text-right">
                  {product.purchasePrice?.toLocaleString('pt-MZ', {
                    style: 'currency',
                    currency: 'Mzn'
                  }) || 'Mzn 0,00'}
                </TableCell>
                <TableCell className="text-right">
                  {product.sellingPrice?.toLocaleString('pt-MZ', {
                    style: 'currency',
                    currency: 'Mzn'
                  }) || 'Mzn 0,00'}
                </TableCell>
                <TableCell className="text-right">
                  {product.iva*100 || 0}%
                </TableCell>
                <TableCell className={`text-right font-medium ${
                  calculateProfit(product) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {calculateProfit(product).toLocaleString('pt-MZ', {
                    style: 'currency',
                    currency: 'Mzn'
                  })}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                   variant='outline'
                   size='sm'
                    onClick={() => {
                      setProductToEdit(product);
                      setShowFormModal(true);
                    }}
                  >
                   <PencilIcon className='h-5 w-5'/>
                  </Button>
                  <Button 
                   variant='danger'
                   size='sm'
                    onClick={() => 
                    {
                      setProductIdToDelete(product.id|| null);
                      setShowDeleteModal(true);
                    }
                    }
                  >
                   <TrashIcon className='h-5 w-5'/>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                {searchTerm ? 'Nenhum produto encontrado para a busca realizada' : 'Nenhum produto cadastrado'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}

          {/* Modal de Edição */}
        <Modal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setProductToEdit(null);
          }}
          title={productToEdit ? "Editar Produto" : "Cadastrar Produto"}
          size="lg"
        >
          <ProductForm
            initialData={productToEdit ||undefined}
            onClose={() => {
              setShowFormModal(false);
              setProductToEdit(null);
            }}
            onSuccess={async () => {
              try {
                const updated = await ProductService.getProducts();
                setProducts(updated);
                setTotalProducts(updated.length);
                toast.success("O produto foi atualizado com sucesso!");
              } catch {
                toast.error("Erro ao atualizar lista de produtos");
              }
            }}
          />
        </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setProductIdToDelete(null);
        }}
        title="Confirmar Exclusão"
        size="sm"
      >
        <p className="text-gray-700 mb-4">Tem certeza que deseja excluir este produto?</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false);
              setProductIdToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            variant="danger"
            onClick={confirmDeleteProduct}
          >
            Confirmar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsTable;