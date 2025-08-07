import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ProductsTable from "../../components/product/ProductTable";
import Button from "../../components/ui/button";
import { useNavigate } from "react-router-dom";


const ProductPage=()=>{
    const navigate=useNavigate();
    const handleNavigate=()=>{
        navigate("/new/product")
    }

    return (
        <div className="mx-auto p-3 sm:p-4 md:p-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:justify-between items-start xs:items-center gap-3 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Produtos</h1>
                <Button onClick={handleNavigate}>
                    <PlusIcon className='h-4 w-4' />
                    Adicionar Produto
                </Button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <ProductsTable />
            </div>
        </div>
    )
}
export default ProductPage;