import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/employeesService/employeesService';
import type { Employee } from '../../types/employee';
import Input from '../ui/input';
import Button from '../ui/button';
import { toast } from 'react-toastify';

export default function EmployeeForm() {
  const [form, setForm] = useState<Partial<Employee>>({
    fullName: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    salary: undefined,
    department: '', // Novo campo
    isActive: true,
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;
    setForm({ ...form, [name]: parsedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await EmployeeService.create(form);
      setForm({
        fullName: '',
        position: '',
        email: '',
        phone: '',
        address: '',
        salary: undefined,
        department: '', // Reset
        isActive: true,
      });
      toast.success(`Funcionário ${form.fullName} criado com sucesso!`);
    } catch (err) {
      alert('Erro ao enviar formulário');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4 mb-10 mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Novo Funcionário</h2>
        <Button type="button" onClick={() => navigate('/employees')}>
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="fullName"
          placeholder="Nome completo"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <Input
          name="position"
          placeholder="Cargo"
          value={form.position}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          name="address"
          placeholder="Endereço"
          value={form.address}
          onChange={handleChange}
        />
        <Input
          name="salary"
          type="number"
          placeholder="Salário"
          value={form.salary ?? ''}
          onChange={handleChange}
        />

        {/* Campo de Departamento */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Departamento
          </label>
          <select
            name="department"
            id="department"
            value={form.department}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Selecione um departamento</option>
            <option value="HR">Recursos Humanos</option>
            <option value="FINANCE">Financeiro</option>
            <option value="IT">TI</option>
            <option value="OPERATIONS">Operações</option>
            <option value="MARKETING">Marketing</option>
            <option value="SALES">Vendas</option>
          </select>
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Funcionário
        </Button>
      </form>
    </div>
  );
}
