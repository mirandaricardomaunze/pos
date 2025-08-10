import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  PlusIcon
} from '@heroicons/react/24/solid';
import type { Invoice } from '../../types/invoice';
import invoiceService from '../../services/invoiceService/invoiceService';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '../../components/table/table';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import Modal from '../../components/modal/modal';
import Button from '../../components/ui/button';
import type { Company } from '../../types/company';
import companyService from '../../services/companyService/companyService';


export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [companyDetails, setCompanyDetails] = useState<Company>();
  const navigate = useNavigate();

  // Pega o companyId do usuário armazenado no localStorage
  const getCompanyId = useCallback(() => {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;

    try {
      const user = JSON.parse(userJson);
      return user.companyId || null;
    } catch {
      return null;
    }
  }, []);

  // Busca dados da empresa ao carregar a página
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const company = await companyService.getCompanyById(getCompanyId());
        setCompanyDetails(company);
      } catch (error) {
        console.error('Erro ao buscar dados da empresa:', error);
      }
    };
    fetchCompanyDetails();
  }, [getCompanyId]);

  // Busca todas as faturas ao carregar a página
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await invoiceService.getAll();
        setInvoices(data);
      } catch (error) {
        console.error('Erro ao buscar faturas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Abre modal com a fatura selecionada
  const handleOpenModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  // Fecha modal
  const handleCloseModal = () => {
    setSelectedInvoice(null);
    setIsModalOpen(false);
  };

  // Imprime a fatura aberta no modal
  const handlePrint = () => {
    if (!invoiceRef.current || !selectedInvoice) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Clona o conteúdo para impressão para evitar modificações no DOM principal
    const contentToPrint = invoiceRef.current.cloneNode(true) as HTMLElement;
    contentToPrint.classList.add('invoice-container');

    // Estilos para impressão
    const printStyles = `
      <style>
        @page {
          size: A4;
          margin: 12mm;
        }
        body {
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          color: #333;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          margin: 0;
          padding: 0;
        }
        .invoice-container {
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
          padding: 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 4px 6px;
          text-align: left;
        }
        th {
          background-color: #f3f3f3;
        }
        .text-right {
          text-align: right;
        }
        .no-print {
          display: none !important;
        }
        h1, h2, h3 {
          margin: 0;
          padding: 0;
        }
        .totals {
          margin-top: 12px;
        }
        .footer {
          margin-top: 20px;
          font-size: 10px;
          text-align: center;
          color: #666;
        }
        .footer p {
          margin: 2px 0;
        }
      </style>
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Fatura #${selectedInvoice.orderId}</title>
          ${printStyles}
        </head>
        <body>
          <div class="invoice-container">
            ${contentToPrint.innerHTML}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Exporta a fatura aberta no modal para PDF usando html2canvas + jsPDF
  const handleExportPDF = async () => {
    if (!invoiceRef.current || !selectedInvoice) return;

    try {
      // Clone para evitar interferência no DOM principal
      const clone = invoiceRef.current.cloneNode(true) as HTMLElement;

      // Ajuste básico para PDF: largura A4, padding e fonte legível
      clone.style.width = '210mm';
      clone.style.padding = '10mm';
      clone.style.margin = '0 auto';
      clone.style.boxSizing = 'border-box';
      clone.style.fontFamily = 'Arial, sans-serif';
      clone.style.backgroundColor = '#fff';

      // Remove classes problemáticas do Tailwind (cores, hover, etc)
      clone.querySelectorAll('*').forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.classList.remove('no-print');
        Array.from(htmlEl.classList).forEach(className => {
          if (
            className.startsWith('bg-') ||
            className.startsWith('text-') ||
            className.startsWith('border-') ||
            className.startsWith('hover:')
          ) {
            htmlEl.classList.remove(className);
          }
        });

        // Adiciona estilos inline básicos para tabela
        if (htmlEl.tagName === 'TABLE') {
          htmlEl.style.borderCollapse = 'collapse';
          htmlEl.style.width = '100%';
        }
        if (htmlEl.tagName === 'TH' || htmlEl.tagName === 'TD') {
          htmlEl.style.border = '1px solid #ddd';
          htmlEl.style.padding = '4px';
        }
        if (htmlEl.tagName === 'TH') {
          htmlEl.style.backgroundColor = '#f5f5f5';
        }
      });

      // Insere clone temporariamente no body (necessário para html2canvas funcionar direito)
      clone.style.visibility = 'hidden';
      document.body.appendChild(clone);

      // Gera canvas da fatura
      const canvas = await html2canvas(clone, {
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Remove clone do DOM
      document.body.removeChild(clone);

      // Calcula tamanho para manter proporção e caber no A4
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = {
        width: canvas.width,
        height: canvas.height,
      };

      const pdfWidth = pageWidth - 20; // margem 10mm ambos lados
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Caso a imagem seja maior que uma página, adiciona páginas extras
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      // Salva o arquivo com o número da fatura
      pdf.save(`fatura-${selectedInvoice.orderId}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Faturas</h1>
        <button
          onClick={() => navigate('/invoices/new')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          aria-label="Nova Fatura"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Fatura
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-gray-50">
              <TableCell>0{invoice.orderId}</TableCell>
              <TableCell>{invoice.order?.clientName || 'Não informado'}</TableCell>
              <TableCell>Mzn {invoice?.totalAmount?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.order?.status === 'PAGO'
                    ? 'bg-green-100 text-green-800'
                    : invoice.order?.status === 'PENDENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.order?.status || 'Desconhecido'}
                </span>
              </TableCell>
              <TableCell>
                {invoice.issuedAtISO
                  ? new Date(invoice.issuedAtISO).toLocaleDateString('pt-MZ')
                  : '—'}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleOpenModal(invoice)}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition mr-2"
                  aria-label={`Ver detalhes da fatura ${invoice.orderId}`}
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Ver
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Detalhes da Fatura #${selectedInvoice?.orderId}`}
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            {/* Botões de imprimir e exportar PDF */}
            <div className="flex justify-end gap-2 mb-4 no-print">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <PrinterIcon className="h-5 w-5" />
                Imprimir
              </Button>
              <Button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Exportar PDF
              </Button>
            </div>

            {/* Conteúdo da fatura */}
            <div
              ref={invoiceRef}
              className="bg-white p-4 rounded-sm border border-gray-200 text-xs leading-tight"
              style={{ maxWidth: '720px', margin: '0 auto' }}
            >
              {/* Cabeçalho */}
              <div className="flex justify-between items-start mb-4 border-b pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-800">FATURA/RECIBO</h1>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      ORIGINAL
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Nº: {selectedInvoice?.orderId || 'N/A'}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[11px] text-gray-600">
                    Data:{' '}
                    {selectedInvoice?.issuedAtISO
                      ? new Date(selectedInvoice.issuedAtISO).toLocaleDateString('pt-MZ')
                      : 'N/A'}
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Vencimento:{' '}
                    {selectedInvoice?.issuedAtISO
                      ? new Date(selectedInvoice.issuedAtISO).toLocaleDateString('pt-MZ')
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Emitente e Cliente */}
              <div style={{display:'flex ', justifyContent:'space-between'}} className="flex justify-between mb-4 gap-8">
                <div className="flex-1 bg-indigo-50 p-3 rounded-md">
                  <h3 className="text-[11px] font-semibold text-indigo-800 mb-1">EMITENTE</h3>
                  <p className="text-[11px] font-medium text-indigo-900">{companyDetails?.name}, LDA</p>
                  <p className="text-[10px] text-indigo-700">NUIT: {companyDetails?.Nuit}</p>
                  <p className="text-[10px] text-indigo-700">{companyDetails?.address}</p>
                  <p className="text-[10px] text-indigo-700">Tel: {companyDetails?.phone}</p>
                </div>

                <div className="flex-1 bg-gray-50 p-3 rounded-md">
                  <h3 className="text-[11px] font-semibold text-gray-800 mb-1">CLIENTE</h3>
                  <p className="text-[11px] font-medium text-gray-900">{selectedInvoice?.order?.clientName || 'Não informado'}</p>
                  <p className="text-[10px] text-gray-600">NUIT: {'Não informado'}</p>
                  <p className="text-[10px] text-gray-600">{'Endereço não informado'}</p>
                  <p className="text-[10px] text-gray-600">Tel: {'Não informado'}</p>
                </div>
              </div>

                {/* Tabela de itens + totais */}
                <div className="mb-3">
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-1 px-2 text-left font-semibold border border-gray-200">Descrição</th>
                        <th className="py-1 px-2 text-right font-semibold border border-gray-200 w-16">Qtd.</th>
                        <th className="py-1 px-2 text-right font-semibold border border-gray-200 w-20">Preço Unit.</th>
                        <th className="py-1 px-2 text-right font-semibold border border-gray-200 w-20">Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Array.isArray(selectedInvoice?.order?.items) && selectedInvoice.order.items.length > 0 ? (
                        selectedInvoice.order.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-200">
                            <td className="py-1 px-2 text-gray-800 border border-gray-200">
                              {item.product?.name || 'Produto não especificado'}
                            </td>
                            <td className="py-1 px-2 text-right text-gray-600 border border-gray-200">
                              {item.quantity || 0}
                            </td>
                            <td className="py-1 px-2 text-right text-gray-600 border border-gray-200">
                              Mzn {(item.price || 0).toFixed(2)}
                            </td>
                            <td className="py-1 px-2 text-right font-medium text-gray-900 border border-gray-200">
                              Mzn {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-3 text-center text-gray-500 italic">
                            Nenhum item registado nesta fatura
                          </td>
                        </tr>
                      )}

                      {/* Linha subtotal */}
                      <tr>
                        <td colSpan={3} className="py-1 px-2 text-right text-gray-600 border border-gray-200">
                          Subtotal:
                        </td>
                        <td className="py-1 px-2 text-right font-medium border border-gray-200">
                          Mzn {(selectedInvoice?.subTotal || 0).toFixed(2)}
                        </td>
                      </tr>

                      {/* Linha IVA */}
                      <tr>
                        <td colSpan={3} className="py-1 px-2 text-right text-gray-600 border border-gray-200">
                          IVA (16%):
                        </td>
                        <td className="py-1 px-2 text-right font-medium border border-gray-200">
                          Mzn {(selectedInvoice?.iva || 0).toFixed(2)}
                        </td>
                      </tr>

                      {/* Linha total */}
                      <tr>
                        <td colSpan={3} className="py-1 px-2 text-right font-bold text-gray-800 border border-gray-200">
                          TOTAL:
                        </td>
                        <td className="py-1 px-2 text-right font-bold text-blue-600 border border-gray-200">
                          Mzn {(selectedInvoice?.totalAmount || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>


              {/* Observações e rodapé */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                {selectedInvoice?.order?.notes && (
                  <div className="mb-3">
                    <h3 className="text-[10px] font-semibold text-gray-700 mb-1">OBSERVAÇÕES</h3>
                    <p className="text-[10px] text-gray-600">"{selectedInvoice.order.notes}"</p>
                  </div>
                )}
                <div className="text-center text-[10px] text-gray-500 space-y-1">
                  <p>Pagamento por transferência bancária:</p>
                  <p className="font-medium">Banco: BIM • IBAN: MZ59000100000000000000000</p>
                  <p>Documento gerado automaticamente - válido sem assinatura</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
