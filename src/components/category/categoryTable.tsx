import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table/table";
import Input from "../ui/input";
import { useState, useEffect, useMemo } from "react";
import { CategorieService } from "../../services/categorieService/categorieService";
import LoadingSpinner from "../loading/LoadingSpinner";
import { toast } from "react-toastify";
import type { Categories } from "../../types/categories";
import Button from "../ui/button";
import  Modal  from "../modal/modal";
import { getCompanyIdFromToken } from "../../utils/getCompanyId/getCompanyId";


const CategoryTable = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Categories[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Categories | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const user= localStorage.getItem("user") ;
        const companyId = user ? JSON.parse(user).companyId : getCompanyIdFromToken();
        if (!companyId) {
          toast.error("Empresa não identificada. Por favor, faça login novamente.");
          return;
        }
        console.log('Fetching categories for company ID:', companyId);

        const response = await CategorieService.getCategoriesByCompanyId(companyId);
        console.log( "Categorias ",response);
        
        setCategory(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Falha ao carregar categorias. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      if (!selectedCategory) return;
      await CategorieService.deleteCategory(id);
      setCategory(prev => prev.filter(cat => cat.id?.toString() !== id));
      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria. Tente novamente.");
    } finally {
      setLoading(false);
      setIsOpenModal(false);
      setSelectedCategory(null);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      const updated = await CategorieService.updateCategory(selectedCategory.id!, editForm);
      setCategory(prev =>
        prev.map(catego =>
          catego.id === updated.id ? updated : catego
        )
      );
      toast.success("Categoria atualizada com sucesso!");
      setIsOpenModal(false);
      setSelectedCategory(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      toast.error("Erro ao atualizar categoria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return category;
    return category.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [category, searchTerm]);

  return (
    <div className="overflow-x-auto">
      <div className="relative w-full md:w-96 mb-4">
        <MagnifyingGlassIcon className="absolute h-5 w-5 left-3 top-6 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar categoria..."
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhuma categoria encontrada.
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell>{new Date(cat.createdAt || "-").toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="danger"
                    title="Excluir"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsOpenModal(true);
                    }}
                  >
                    <TrashIcon className="h-5 w-5 text-white hover:text-white" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    title="Editar"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setEditForm({ name: cat.name, description: cat.description || "" });
                      setIsEditing(true);
                      setIsOpenModal(true);
                    }}
                  >
                    <PencilIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setIsEditing(false);
          setSelectedCategory(null);
        }}
        title={isEditing ? "Editar Categoria" : "Confirmar a exclusão"}
        size="sm"
      >
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <Input
                value={editForm.name}
                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <Input
                value={editForm.description}
                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsOpenModal(false);
                setIsEditing(false);
                setSelectedCategory(null);
              }}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleUpdateCategory}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Tem certeza que deseja excluir a categoria <strong>{selectedCategory?.name}</strong>?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpenModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  selectedCategory &&
                  handleDelete(selectedCategory.id?.toString() || "")
                }
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CategoryTable;
