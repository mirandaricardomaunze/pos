import { useState } from 'react';
import customerService from '../../services/customersService/customersService';
import type { Customer } from '../../types/customer';
import Input from '../ui/input';
import Button from '../ui/button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CustomerForm() {
  const [form, setForm] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    nuit: '',
    isActive: true,
  });
  const navigate=useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customerService.create(form);
      setForm({ name: '', email: '', phone: '', address: '', nuit: '', isActive: true });
      toast.success(`Cliente ${form.name} criado com sucesso!`);
    } catch (err) {
      toast.error('Erro ao salvar cliente');
      console.error(err);
    }
  };

  return (
  <div  className='mt-6 mb-6'>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-xl mx-auto">
       <div className="mb-4 flex items-center justify-between">
               <h2 className="text-xl font-bold">Novo Cliente</h2>
              <Button
              type="button"
              onClick={() => navigate('/customers')}
              >
              Voltar
              </Button> 
          </div>
      <Input name="name" placeholder="Nome" value={form.name} onChange={handleChange} className="input" required />
      <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
      <Input name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} className="input" />
      <Input name="address" placeholder="Endereço" value={form.address} onChange={handleChange} className="input" />
      <Input name="nuit" placeholder="NUIT" value={form.nuit} onChange={handleChange} className="input" />
      <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar Cliente</Button>
    </form>
  </div>
  );
}