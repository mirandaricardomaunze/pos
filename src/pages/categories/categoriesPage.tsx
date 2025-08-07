import { useNavigate } from "react-router-dom";
import CategoryTable from "../../components/category/categoryTable";
import Button from "../../components/ui/button";
import { PlusIcon } from "@heroicons/react/16/solid";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const handleCreateCategory = () => {
    navigate("/categories_new");
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>
        <Button onClick={handleCreateCategory} className="w-full sm:w-auto">
          <PlusIcon className="h-5 w-5 mr-2" />
          <span className="whitespace-nowrap">Cria Categoria</span>
        </Button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <CategoryTable />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;