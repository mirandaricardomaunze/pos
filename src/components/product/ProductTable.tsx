import React, { useState, useEffect } from 'react';
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
import Modal from '../modal/modal';
import ProductForm from './productForm';
import type { Categories } from '../../types/categories';
import { CategorieService } from '../../services/categorieService/categorieService';
import { getCompanyIdFromToken } from '../../utils/getCompanyId/getCompanyId';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductFormData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        const companyId = user ? JSON.parse(user).companyId : getCompanyIdFromToken();
        if (!companyId) {
          toast.error("Empresa não identificada. Por favor, faça login novamente.");
          return;
        }
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          ProductService.getProductByCompanyId(),
          CategorieService.getCategoriesByCompanyId(Number(companyId))
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch products or categories:', err);
        setError('Falha ao carregar dados. Tente novamente mais tarde.');
        toast.error('Falha ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm) ||
      product.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategoryId ? product.categoryId === selectedCategoryId : true;

    return matchesSearch && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const confirmDeleteProduct = async () => {
    if (!productIdToDelete) return;
    try {
      await ProductService.deleteProduct(productIdToDelete);
      setProducts(products.filter(p => p.id !== productIdToDelete));
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
    return sellingPrice - purchasePrice - (iva / 100);
  };
const exportPDF = () => {
  try {
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont('helvetica', 'bold');
    doc.text("Relatório de Inventário de Produtos", 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${new Date().toLocaleDateString('pt-MZ')}`, 14, 30);
    doc.text(`Total de Produtos: ${filteredProducts.length}`, 14, 35);

    const headers = [
      "Nome", 
      "Quantidade", 
      "Código", 
      "Referência",
      "Preço Compra", 
      "Preço Venda", 
      "IVA", 
      "Lucro"
    ];

    const data = filteredProducts.map(product => {
      const profit = calculateProfit(product);
      return [
        product.name || '-',
        product.quantity || 0,
        product.barcode || '-',
        product.reference || '-',
        product.purchasePrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'Mzn' }) || 'Mzn 0,00',
        product.sellingPrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'Mzn' }) || 'Mzn 0,00',
        (product.iva ? (product.iva * 100) : 0) + '%',
        {
         
          content: profit.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }),
          styles: { textColor: profit >= 0 ? [0, 128, 0] as [number, number, number] : [255, 0, 0] as [number, number, number] }

        }
      ];
    });

    // Usa o autoTable importado
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'center' },
        7: { halign: 'right' }
      },
      didDrawPage: (dataArg) => {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Página ${dataArg.pageNumber}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 10
        );
      }
    });

    doc.save(`inventario_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    toast.error('Falha ao exportar PDF. Tente novamente.');
  }
};


const printInventory = () => {
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  if (!printWindow) return;

  // Formatação dos dados com estilo profissional
  const formattedProducts = filteredProducts.map(product => {
    const profit = calculateProfit(product);
    return `
      <tr class="hover:bg-gray-50">
        <td class="border-b border-gray-200 px-6 py-3">${product.name || '-'}</td>
        <td class="border-b border-gray-200 px-6 py-3 text-center">${product.quantity || 0}</td>
        <td class="border-b border-gray-200 px-6 py-3 text-center font-mono">${product.barcode || '-'}</td>
        <td class="border-b border-gray-200 px-6 py-3 text-center">${product.reference || '-'}</td>
        <td class="border-b border-gray-200 px-6 py-3 text-right font-medium">${
          product.purchasePrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'Mzn' }) || 'Mzn 0,00'
        }</td>
        <td class="border-b border-gray-200 px-6 py-3 text-right font-medium">${
          product.sellingPrice?.toLocaleString('pt-MZ', { style: 'currency', currency: 'Mzn' }) || 'Mzn 0,00'
        }</td>
        <td class="border-b border-gray-200 px-6 py-3 text-center">${(product.iva ? (product.iva * 100) : 0)}%</td>
        <td class="border-b border-gray-200 px-6 py-3 text-right font-medium ${
          profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
        }">
          ${profit.toLocaleString('pt-MZ', { style: 'currency', currency: 'Mzn' })}
        </td>
      </tr>
    `;
  }).join('');

  // HTML completo com design corporativo
  const printContent = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Inventário Corporativo</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #1e3a8a;
          --secondary: #1e40af;
          --accent: #3b82f6;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 2rem;
          color: #1f2937;
          background-color: #f9fafb;
        }
        
        .letterhead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .logo-placeholder {
          width: 48px;
          height: 48px;
          background-color: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .company-info {
          text-align: right;
        }
        
        .report-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary);
          margin: 2rem 0 0.5rem;
        }
        
        .report-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }
        
        .report-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        th {
          background-color: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        
        td {
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          font-size: 0.875rem;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-emerald-600 {
          color: #059669;
        }
        
        .text-rose-600 {
          color: #e11d48;
        }
        
        .font-mono {
          font-family: monospace;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
        }
        
        .print-btn {
          position: fixed;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .print-btn:hover {
          background-color: var(--secondary);
          transform: translateY(-1px);
        }
        
        @media print {
          body {
            padding: 0;
            background: white;
          }
          
          .no-print {
            display: none;
          }
          
          table {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <!-- Cabeçalho corporativo -->
      <div class="letterhead">
        <div class="logo-container">
          <div class="logo-placeholder">LOGO</div>
          <div>
            <h1 style="font-weight: 600; margin: 0; color: var(--primary);">Nome da Empresa</h1>
            <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">Sistema de Gestão de Inventário</p>
          </div>
        </div>
        <div class="company-info">
          <p style="margin: 0; font-weight: 500;">${new Date().toLocaleDateString('pt-MZ', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
          <p style="margin: 0.25rem 0 0; font-size: 0.875rem;">Relatório gerado automaticamente</p>
        </div>
      </div>
      
      <!-- Título do relatório -->
      <h2 class="report-title">Relatório de Inventário</h2>
      <p class="report-subtitle">Análise detalhada dos produtos em estoque</p>
      
      <!-- Metadados -->
      <div class="report-meta">
        <div>
          <strong>Total de Itens:</strong> ${filteredProducts.length}
        </div>
        <div>
          <strong>Filtros aplicados:</strong> 
          ${searchTerm ? `"${searchTerm}"` : 'Nenhum'} 
          ${selectedCategoryId ? `| Categoria: ${
            categories.find(c => c.id === selectedCategoryId)?.name || ''
          }` : ''}
        </div>
      </div>
      
      <!-- Tabela de dados -->
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd.</th>
            <th>Código</th>
            <th>Referência</th>
            <th class="text-right">Custo</th>
            <th class="text-right">Venda</th>
            <th>IVA</th>
            <th class="text-right">Lucro</th>
          </tr>
        </thead>
        <tbody>
          ${formattedProducts}
        </tbody>
      </table>
      
      <!-- Rodapé -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} Nome da Empresa. Todos os direitos reservados.</p>
        <p>Relatório confidencial - Uso interno</p>
      </div>
      
      <!-- Botão de impressão -->
      <button class="print-btn no-print" onclick="window.print()">
        Imprimir Relatório
      </button>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Focar na janela após um pequeno delay para garantir carregamento
  setTimeout(() => {
    printWindow.focus();
    
    // Adiciona um pequeno delay antes de mostrar o diálogo de impressão
    if (printWindow.document.readyState === 'complete') {
      printWindow.print();
    } else {
      printWindow.addEventListener('load', () => printWindow.print());
    }
  }, 500);
};

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="p-10 bg-white rounded-lg shadow">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
  {/* Busca */}
  <div className="w-full md:max-w-md">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        placeholder="Buscar produtos..."
        className="pl-10 h-10 w-full text-sm leading-10" // alinhamento vertical com select e botões
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />
    </div>
  </div>

  {/* Filtro de categoria */}
  <div className="w-full md:max-w-md">
    <select
      id="category-filter"
      className="block w-full h-10 text-sm  mb-4 leading-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={selectedCategoryId ?? ''}
      onChange={(e) => {
        const value = e.target.value;
        setSelectedCategoryId(value ? parseInt(value) : null);
        setCurrentPage(1);
      }}
    >
      <option value="">Todas categorias</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  </div>

  {/* Botões */}
  <div className="flex space-x-2  mb-4">
    <Button variant="outline" size="sm" className="h-10 px-4"
     onClick={exportPDF}
    >
      Exportar PDF
    </Button>
    <Button 
      onClick={printInventory}
      variant="outline" size="sm" className="h-10 px-4">
      Imprimir
    </Button>
  </div>
</div>


      {/* Tabela de Produtos */}
      <div id="inventory-table" className="mb-6">
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
                  <TableCell>{product.barcode || "-"}</TableCell>
                  <TableCell>{product.reference || "Sem referência"}</TableCell>
                  <TableCell className="text-right">
                    {product.purchasePrice?.toLocaleString("pt-MZ", {
                      style: "currency",
                      currency: "Mzn",
                    }) || "Mzn 0,00"}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.sellingPrice?.toLocaleString("pt-MZ", {
                      style: "currency",
                      currency: "Mzn",
                    }) || "Mzn 0,00"}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.iva ? product.iva * 100 : 0}%
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      calculateProfit(product) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {calculateProfit(product).toLocaleString("pt-MZ", {
                      style: "currency",
                      currency: "Mzn",
                    })}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProductToEdit(product);
                        setShowFormModal(true);
                      }}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setProductIdToDelete(product.id || null);
                        setShowDeleteModal(true);
                      }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-4 text-gray-500"
                >
                  {searchTerm
                    ? "Nenhum produto encontrado para a busca realizada"
                    : "Nenhum produto cadastrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modal de Edição/Criação */}
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
          initialData={productToEdit || undefined}
          onClose={() => {
            setShowFormModal(false);
            setProductToEdit(null);
          }}
          onSuccess={async () => {
            const updated = await ProductService.getProducts();
            setProducts(updated);
            toast.success("O produto foi atualizado com sucesso!");
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
        <p className="text-gray-700 mb-4">
          Tem certeza que deseja excluir este produto?
        </p>
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
            size="sm"
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