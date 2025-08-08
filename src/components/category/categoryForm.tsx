import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircleIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import Button from '../ui/button';
import { CategorieService } from '../../services/categorieService/categorieService';
import { toast } from 'react-toastify';
import Input from '../ui/input';

type FormStatus = {
  type: 'success' | 'error' | null;
  message: string;
};

type FormValues = {
  name: string;
  description: string;
};

export default function CategoryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ 
    type: null, 
    message: '' 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setStatus({
        type: 'error',
        message: 'O nome da categoria é obrigatório'
      });
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });
    const user = localStorage.getItem('user');
    const companyId = user ? JSON.parse(user).companyId : null;
    console.log('Company ID from localStorage:', companyId);
    
    if (!companyId) {
      toast.error('Empresa não encontrada. Por favor, faça login novamente.');
      setIsSubmitting(false);
      return;
    }

    
    try {
      await CategorieService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        companyId: companyId
      });

      setStatus({
        type: 'success',
        message: 'Categoria cadastrada com sucesso!'
      });
      
      resetForm();

      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 3000);
      toast.success('Categoria cadastrada com sucesso!');
      navigate('/categories');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Ocorreu um erro ao cadastrar a categoria'
      });
      toast.error('Erro ao cadastrar categoria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusMessage = ({ status }: { status: FormStatus }) => {
    if (!status.type) return null;
    
    return (
      <div className={`mb-4 p-3 rounded flex items-center ${
        status.type === 'success' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        {status.type === 'success' ? (
          <CheckCircleIcon className="h-5 w-5 mr-2" />
        ) : (
          <XMarkIcon className="h-5 w-5 mr-2" />
        )}
        {status.message}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cadastrar Categoria</h1>
        <Button
          onClick={() => navigate('/categories')}
          icon={<ArrowLeftIcon className="h-5 w-5" />}
        >
          Voltar
        </Button>
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <StatusMessage status={status} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Eletrônicos"
                disabled={isSubmitting}
              />
              {status.type === 'error' && !formData.name.trim() && (
                <p className="mt-1 text-sm text-red-600">Este campo é obrigatório</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
                <span className="text-gray-400 ml-1">(opcional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                placeholder="Descreva brevemente esta categoria"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                isSubmitting || !formData.name.trim() 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Cadastrar Categoria
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}