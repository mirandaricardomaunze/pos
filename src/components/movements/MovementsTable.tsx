import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Movement } from "../../types/movements";
import {
  getMovements,
  deleteMovement,
} from "../../services/movementService/movementsSerivce";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/table/table";
import Input from "../../components/ui/input";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import { toast } from "react-toastify";
import { Pagination } from "../../components/pagination/pagination";
import { Modal } from "../../components/modal/modal";
import Button from "../../components/ui/button";

export default function MovementsTable() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [movementIdToDelete, setMovementIdToDelete] = useState<number | null>(null);

  // Busca todos os movimentos
  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const data = await getMovements();
        setMovements(data);
      } catch (error) {
        toast.error("Erro ao buscar movimentos.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  // Função para excluir um movimento
  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteMovement(id);
      setMovements((prev) => prev.filter((m) => m.id !== id));
      toast.success("Movimento excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir movimento:", error);
      toast.error("Erro ao excluir o movimento.");
    } finally {
      setIsDeleting(null);
      setShowDeleteModal(false);
      setMovementIdToDelete(null);
    }
  };

  // Filtro de busca
  const filteredMovements = movements.filter((movement) =>
    movement?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reseta a página para 1 ao fazer uma nova busca
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Cores para tipo de movimento
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "entrada":
        return "text-green-600 bg-green-50";
      case "saída":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Paginação
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
  const paginatedMovements = filteredMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl mb-10 border border-gray-200">
      <h1 className="text-2xl font-bold mb-4">Movimentos</h1>

      {/* Campo de pesquisa */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative w-full md:w-96">
          <MagnifyingGlassIcon className="absolute h-5 w-5 left-3 top-6 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Digite nome, código de barras ou referência..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela ou loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor Pago</TableHead>       {/* NOVO */}
                <TableHead>Troco</TableHead>            {/* NOVO */}
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMovements.length > 0 ? (
                paginatedMovements.map((movement, index) => {
                  const totalQuantity = Array.isArray(movement.details)
                    ? movement.details.reduce((sum, d) => sum + d.quantity, 0)
                    : (movement.details?.quantity ?? 0);

                  return (
                    <TableRow
                      key={movement.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className={`font-medium ${getTypeColor(movement.type)}`}>
                        {movement.type}
                      </TableCell>
                      <TableCell>{movement.entityType}</TableCell>
                      <TableCell>{movement.description}</TableCell>
                      <TableCell>{totalQuantity}</TableCell>
                      <TableCell>{movement.user?.name}</TableCell>
                      <TableCell>{movement.clientName || '---'}</TableCell>
                      <TableCell>
                        {new Date(movement.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        {movement.amountPaid !== undefined && movement.amountPaid !== null
                          ? `Mtn ${movement.amountPaid.toFixed(2)}`
                          : "---"}
                      </TableCell>
                      <TableCell>
                        {movement.change !== undefined && movement.change !== null
                          ? `Mtn ${movement.change.toFixed(2)}`
                          : "---"}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setMovementIdToDelete(movement.id);
                          }}
                          className="p-1 rounded hover:bg-red-50 transition-colors"
                          title="Excluir"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4 text-gray-500">
                    {searchTerm
                      ? "Nenhum movimento encontrado para a busca realizada"
                      : "Nenhum movimento realizado"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMovementIdToDelete(null);
        }}
        title="Confirmar Exclusão"
        size="sm"
      >
        <p className="text-gray-700 mb-4">
          Tem certeza que deseja excluir este movimento?
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteModal(false);
              setMovementIdToDelete(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (movementIdToDelete !== null) {
                handleDelete(movementIdToDelete);
              }
            }}
            disabled={isDeleting !== null}
          >
            {isDeleting ? "Excluindo..." : "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
