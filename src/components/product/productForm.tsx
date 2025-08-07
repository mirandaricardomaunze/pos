import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CubeIcon, ArrowLeftIcon } from "@heroicons/react/16/solid";
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
  const [formData, setFormData] = useState<ProductFormData>(initialData || initialFormData);
  const [suppliers, setSuppliers] = useState<SupplierFormData[] >([]);
  const [categories, setCategories] = useState<Categories[] >([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const companyId = useMemo(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).companyId : null;
    } catch {
      return null;
    }
  }, []);
  
useEffect(() => {
  if (!companyId) return;
  const fetchData = async () => {
    try {
      console.log("Buscando dados para companyId:", companyId);
      const [suppliersData, categoriesData] = await Promise.all([
        SupplierService.getSuppliersByCompanyId(companyId),
        CategorieService.getCategoriesByCompanyId(companyId)
      ]);
      console.log("Fornecedores:", suppliersData);
      console.log("Categorias:", categoriesData);
      setSuppliers(suppliersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar fornecedores ou categorias!");
    }
  };

  fetchData();
}, [companyId]);


   
  const profit = useMemo(() => {
    return formData.sellingPrice - formData.purchasePrice;
  }, [formData.sellingPrice, formData.purchasePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsed = ["supplierId", "categoryId"].includes(name)
      ? +value || null
      : name.match(/Price|iva|quantity/)
      ? Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value)
      : value;

    setFormData(prev => ({ ...prev, [name]: parsed }));
  };

  const validate = (): string | null => {
    const requiredFields: (keyof ProductFormData)[] = [
      "name", "quantity", "barcode", "reference", "description","expiryDate", "iva",
      "purchasePrice", "sellingPrice", "supplierId", "categoryId"
    ];
    for (const field of requiredFields) {
      if (formData[field] === null || formData[field] === undefined || formData[field] === "") {
        return `${field} é obrigatório.`;
      }
      if (formData[field] === 0) {
        return `${field} não pode ser zero.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    try {
      setIsLoading(true);
      if (isEditing && initialData?.id) {
        await ProductService.updateProduct(initialData.id, formData);
        toast.success("Produto atualizado com sucesso");
      } else {
        await ProductService.createProduct({ ...formData });
        toast.success("Produto cadastrado com sucesso");
        setFormData(initialFormData);
      }
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white mb-10 shadow p-6 rounded-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center">
          <CubeIcon className="w-5 h-5 text-blue-600 mr-2" />
          {isEditing ? "Editar Produto" : "Cadastrar Produto"}
        </h1>
        <Button icon={<ArrowLeftIcon className="w-5 h-5" />} onClick={() => navigate("/products")}>Voltar</Button>
      </div>

      {/* Inputs declarados individualmente */}
      <Input
        name="name"
        label="Nome"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        name="quantity"
        label="Quantidade"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        required
      />

      <Input
        name="barcode"
        label="Código de Barras"
        type="text"
        value={formData.barcode}
        onChange={handleChange}
        required
      />

      <Input
        name="reference"
        label="Referência"
        type="text"
        value={formData.reference}
        onChange={handleChange}
        required
      />

      <Input
        name="description"
        label="Descrição"
        type="text"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <Input
        name="expiryDate"
        label="Data de Validade"
        type="date"
        value={formData.expiryDate ? formData.expiryDate.split("T")[0] : ""}
        onChange={handleChange}
      />
      <Input
        name="purchasePrice"
        label="Preço de Compra"
        type="number"
        value={formData.purchasePrice}
        onChange={handleChange}
        required
      />

      <Input
        name="sellingPrice"
        label="Preço de Venda"
        type="number"
        value={formData.sellingPrice}
        onChange={handleChange}
        required
      />

      <Input
        name="iva"
        label="IVA (%)"
        type="number"
        value={formData.iva}
        onChange={handleChange}
        required
      />

      <Input
        name="profit"
        label="Lucro"
        type="number"
        value={profit.toFixed(2)}
        disabled
      />

      {/* Fornecedor */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
        <select
          name="supplierId"
          value={formData.supplierId || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Selecione...</option>
          {suppliers?.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          name="categoryId"
          value={formData.categoryId || ""}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Selecione...</option>
          {categories?.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"}
      </Button>
    </form>
  );
};

export default ProductForm;
