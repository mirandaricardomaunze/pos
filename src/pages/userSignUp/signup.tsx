import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';
import Button from '../../components/ui/button';
import type { RegisterFormData } from '../../types/auth';
import userService from '../../services/userService/userService';
import { toast } from 'react-toastify';
import { api } from '../../services/api/api'; // para buscar empresas

const roleOptions = [
  { value: 'USER', label: 'Usuário' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'OPERATOR', label: 'Operador' },
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'SELLER', label: 'Vendedor' },

];

const SignUp = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    companyId: undefined,
  });

  const [companies, setCompanies] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Buscar empresas ao carregar a página
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies'); // certifique-se que essa rota existe
        setCompanies(res.data);
      } catch (err) {
        console.error('Erro ao buscar empresas:', err);
        toast.error('Erro ao carregar empresas.');
      }
    };
    fetchCompanies();
  }, []);

  const validate = (): boolean => {
    const errs: Partial<RegisterFormData> = {};
    if (!formData.name.trim()) errs.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errs.email = 'Email é obrigatório';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Email inválido';
    if (!formData.password) errs.password = 'Senha é obrigatória';
    else if (formData.password.length < 6) errs.password = 'Senha deve ter pelo menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Senhas não coincidem';
    if (!formData.companyId) errs.companyId  || 'Selecione uma empresa';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((f) => ({
      ...f,
      [name]: name === 'companyId' ? Number(value) : value,
    }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((e) => ({ ...e, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const res = await userService.registerUser(formData);
      console.log("CompanyId enviado",formData.companyId);
      
      if (res) {
        toast.success('Cadastro realizado com sucesso! Faça login.');
        navigate('/login');
      }
    } catch (err: any) {
      const msg = err?.message || 'Erro ao cadastrar. Tente novamente.';
      toast.error(msg);
      setErrors({ email: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Criar nova conta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Nome completo"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Senha"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            label="Confirmar senha"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Select
            label="Função"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={roleOptions}
          />

          <Select
            label="Empresa"
            id="companyId"
            name="companyId"
            value={formData.companyId?.toString() || ''}
            onChange={handleChange}
            options={companies.map((company) => ({
              value: company.id.toString(),
              label: company.name,
            }))}
          error={errors.companyId?.toString() }
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
