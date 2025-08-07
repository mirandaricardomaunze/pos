import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Company } from '../../types/company';
import Input from '../ui/input';
import Button from '../ui/button';
import { toast } from 'react-toastify';
import companyService from '../../services/companyService/companyService';


export default function CompanyForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Company>>({
    name: '',
    Nuit: '',
    phone: '',
    email: '',
    address: '',
    logoUrl: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await companyService.createCompany(form);
      toast.success('Empresa cadastrada com sucesso!');
      setForm({
        name: '',
        Nuit: '',
        phone: '',
        email: '',
        address: '',
        logoUrl: '',
      });
    } catch (error) {
      toast.error('Erro ao cadastrar empresa.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cadastrar Empresa</h2>
        <Button onClick={() => navigate('/companies')} className="btn-secondary">
          Voltar para lista
        </Button>
      </div>

      <form
        className="space-y-4 bg-white p-6 rounded shadow"
        onSubmit={handleSubmit}
      >
        <Input name="name" placeholder="Nome" value={form.name || ''} onChange={handleChange} />
        <Input name="Nuit" placeholder="NUIT" value={form.Nuit || ''} onChange={handleChange} />
        <Input name="phone" placeholder="Telefone" value={form.phone || ''} onChange={handleChange} />
        <Input name="email" placeholder="Email" value={form.email || ''} onChange={handleChange} />
        <Input name="address" placeholder="Endereço" value={form.address || ''} onChange={handleChange} />
        <Input name="logoUrl" placeholder="Logo URL" value={form.logoUrl || ''} onChange={handleChange} />
        <Button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  );
}
