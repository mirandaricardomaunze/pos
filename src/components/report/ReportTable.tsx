import { useEffect, useState } from "react";
import type { ReportTableProps } from "../../types/report";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import reportService from "../../services/reportservice/ReportService";
import { MagnifyingGlassCircleIcon, TrashIcon } from "@heroicons/react/16/solid";
import Input from "../ui/input";
import LoadingSpinner from "../loading/LoadingSpinner";
import { toast } from "react-toastify";
import { Pagination } from "../pagination/pagination";
import Button from "../ui/button";
import  Modal  from "../modal/modal";

export const ReportTable: React.FC = () => {
  const [sales, setSales] = useState<ReportTableProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reportToDelete, setReportToDelete] = useState<ReportTableProps | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const resultReport = await reportService.getPeports(startDate, endDate);
        setSales(resultReport);
      } catch (error) {
        toast.error("Ocorreu um erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const filteredReports = sales.filter((report) =>
    report.items.some((item: any) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;

    try {
      setLoading(true);
      await reportService.deleteReport(reportToDelete.id);
      setSales((prevSales) =>
        prevSales.filter((sale) => sale.id !== reportToDelete.id)
      );
      toast.success("Relatório excluído com sucesso.");
    } catch (error) {
      toast.error("Não foi possível excluir o relatório.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassCircleIcon className="absolute h-5 w-5 left-3 top-6 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Pesquisar o nome do produto"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : paginatedReports.length === 0 ? (
        <p className="text-gray-500 mt-4">
          {searchTerm
            ? "Nenhum produto encontrado para a busca realizada."
            : "Nenhuma venda encontrada."}
        </p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição do Produto</TableHead>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>IVA</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((sale) =>
                sale.items.map((item: any, index: number) => (
                  <TableRow key={`${sale.id}-${index}`}>
                    <TableCell>
                      {new Date(sale.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{item.product.description || "—"}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{sale.iva.toLocaleString()}</TableCell>
                    <TableCell>{item.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setReportToDelete(sale);
                          setShowDeleteModal(true);
                        }}
                      >
                       <TrashIcon className="h-5 w-5"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredReports.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredReports.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <Modal
        title="Excluir Relatório"
        onClose={() => {
          setShowDeleteModal(false);
          setReportToDelete(null);
        }}
        isOpen={showDeleteModal}
      >
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir a venda do produto{" "}
            <strong>
              {reportToDelete?.items[0]?.product.name ?? "Desconhecido"}
            </strong>
            ?
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
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
