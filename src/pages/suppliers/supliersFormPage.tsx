import type React from "react";
import SupplierForm from "../../components/suppliers/suppliersForm";
import type{ SupplierFormData}  from "../../types/suppliers";
import { BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { SupplierService } from "../../services/suppliersService/suppliersService";
import { useToast } from "../../context/contextToast/contextToast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";


const SuppliersFormPage:React.FC = () => {
const navigate = useNavigate();
const  {addToast} = useToast();

const onCancel=() => {
    navigate("/suppliers");
}
const handleFormSubmit = async (data: SupplierFormData) => {
try {
    await SupplierService.createSupplier(data);
    console.log(data);
    addToast("Fornecedor cadastrado com sucesso!", "success",5000);  
} catch (error) {
    addToast("Erro ao cadastrar fornecedor: " + error, "error", 5000);
  }

}
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
     <div className="md:flex md:justify-between ">
      <div className="flex items-center gap-3 mb-6">
        <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Cadastro de Fornecedor</h1>
      </div>
        <Button 
        onClick={onCancel}
         icon={<ArrowLeftIcon className="h-5 w-5"/>}
        >
          Fornecedores
        </Button>
     </div>
      
      <SupplierForm 
        onSubmit={handleFormSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
export default SuppliersFormPage;