import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CubeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Input from "../ui/input";
import Button from "../ui/button";
import { ProductService } from "../../services/productService/productService";
import { SupplierService } from "../../services/suppliersService/suppliersService";
import { CategorieService } from "../../services/categorieService/categorieService";
import { initialFormData, type ProductFormData, type ProductFormProps } from "../../types/product";
import type { SupplierFormData } from "../../types/suppliers";
import type { Categories } from "../../types/categories";
import { toast } from "react-toastify";

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ProductFormData>(initialData ?? initialFormData);
  const [suppliers, setSuppliers] = useState<SupplierFormData[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isEditing = Boolean(initialData);

  const companyId = useMemo(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).companyId : null;
    } catch {
      return null;
    }
  }, []);

  // Busca fornecedores e categorias ao montar ou quando companyId muda
  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        const [suppliersData, categoriesData] = await Promise.all([
          SupplierService.getSuppliersByCompanyId(companyId),
          CategorieService.getCategoriesByCompanyId(companyId),
        ]);
        setSuppliers(suppliersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar fornecedores ou categorias:", error);
        toast.error("Erro ao carregar fornecedores ou categorias");
      }
    };

    fetchData();
  }, [companyId]);

  // cálculo do preço de custo com IVA aplicado
  const purchasePriceWithIva = useMemo(() => {
    if (!formData.purchasePrice || !formData.iva) return 0;
    return formData.purchasePrice + (formData.purchasePrice * formData.iva) / 100;
  }, [formData.purchasePrice, formData.iva]);

  // cálculo do lucro real
  const profit = useMemo(() => {
    if (!formData.sellingPrice) return 0;
    return formData.sellingPrice - purchasePriceWithIva;
  }, [formData.sellingPrice, purchasePriceWithIva]);

  const profitPercentage = useMemo(() => {
    if (!purchasePriceWithIva) return "0";
    return ((profit / purchasePriceWithIva) * 100).toFixed(2);
  }, [profit, purchasePriceWithIva]);

  // Atualiza estado do formulário
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      let parsedValue: string | number | null = value;
      if (["supplierId", "categoryId"].includes(name)) {
        parsedValue = value ? Number(value) : null;
      } else if (name.match(/Price|iva|quantity/)) {
        const parsedNum = parseFloat(value);
        parsedValue = isNaN(parsedNum) ? 0 : parsedNum;
      }

      setFormData(prev => ({ ...prev, [name]: parsedValue }));
    },
    []
  );

  // Validação do formulário (pode ser melhorada para retornar lista de erros)
  const validate = useCallback((): string | null => {
    const requiredFields: (keyof ProductFormData)[] = [
      "name",
      "quantity",
      "barcode",
      "reference",
      "description",
      "expiryDate",
      "iva",
      "purchasePrice",
      "sellingPrice",
      "supplierId",
      "categoryId",
    ];
    for (const field of requiredFields) {
      const value = formData[field];
      if (value === null || value === undefined || value === "") {
        return `${field} é obrigatório.`;
      }
      if (typeof value === "number" && value === 0) {
        return `${field} não pode ser zero.`;
      }
    }
    return null;
  }, [formData]);

  // Submit do formulário
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const error = validate();
      if (error) {
        toast.error(error);
        return;
      }

      try {
        setIsLoading(true);
        if (isEditing && initialData?.id) {
          await ProductService.updateProduct(initialData.id, formData);
        } else {
          await ProductService.createProduct(formData);
          setFormData(initialFormData);
        }
        onSuccess?.();
        onClose?.();
      } catch (err) {
        toast.error("Erro ao salvar produto");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, initialData, isEditing, onClose, onSuccess, validate]
  );

  return (
    <div className="max-w-4xl mx-auto mb-10 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <CubeIcon className="w-6 h-6" />
              <h1 className="text-xl font-bold">{isEditing ? "Editar Produto" : "Cadastrar Novo Produto"}</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex items-center space-x-1 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna 1 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações Básicas</h2>

            <Input name="name" label="Nome do Produto" type="text" value={formData.name} onChange={handleChange} required placeholder="Ex: Notebook Dell Inspiron" />

            <div className="grid grid-cols-2 gap-4">
              <Input name="quantity" label="Quantidade" type="number" value={formData.quantity} onChange={handleChange} required min={0} />
              <Input name="barcode" label="Código de Barras" type="text" value={formData.barcode} onChange={handleChange} required placeholder="Ex: 7891234567890" />
            </div>

            <Input name="reference" label="Referência" type="text" value={formData.reference} onChange={handleChange} required placeholder="Código interno ou SKU" />
            <Input name="description" label="Descrição" type="text" value={formData.description} onChange={handleChange} required placeholder="Detalhes sobre o produto" />
            <Input
              name="expiryDate"
              label="Data de Validade"
              type="date"
              value={formData.expiryDate ? formData.expiryDate.split("T")[0] : ""}
              onChange={handleChange}
            />
          </div>

          {/* Coluna 2 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Informações Financeiras</h2>

            <div className="grid grid-cols-2 gap-4">
              <Input
                name="purchasePrice"
                label="Preço de Custo"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                prefix="Mzn"
              />

              <Input
                name="sellingPrice"
                label="Preço de Venda"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                prefix="Mzn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input name="iva" label="IVA (%)" type="number" value={formData.iva} onChange={handleChange} required min={0} max={100} />

              <Input name="profit" label="Lucro (Mzn)" type="number" value={profit.toFixed(2)} disabled prefix="Mzn" />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Margem de lucro:</span> {profitPercentage}%
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Fornecedor *</label>
              <select
                name="supplierId"
                value={formData.supplierId ?? ""}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition duration-150 ease-in-out"
                required
              >
                <option value="">Selecione um fornecedor...</option>
                {suppliers.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Categoria *</label>
              <select
                name="categoryId"
                value={formData.categoryId ?? ""}
                onChange={handleChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition duration-150 ease-in-out"
                required
              >
                <option value="">Selecione uma categoria...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-300">
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">
            {isLoading ? <span className="flex items-center justify-center">Processando...</span> : isEditing ? "Atualizar Produto" : "Cadastrar Produto"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
