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
        department: '',
        isActive: true,
      });
      toast.success(`Funcionário ${form.fullName} criado com sucesso!`);
    } catch (err) {
      toast.error('Erro ao enviar formulário');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6 mb-10 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Novo Funcionário</h2>
        <Button
          type="button"
          onClick={() => navigate('/employees')}
          className="bg-blue-500 text-white-700 hover:bg-blue-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Inputs agrupados */}
        <Input
          name="fullName"
          placeholder="Nome completo"
          value={form.fullName}
          onChange={handleChange}
          required
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          name="position"
          placeholder="Cargo"
          value={form.position}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          name="phone"
          placeholder="Telefone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          name="address"
          placeholder="Endereço"
          value={form.address}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          name="salary"
          type="number"
          placeholder="Salário"
          value={form.salary ?? ''}
          onChange={handleChange}
          className="rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Select departamento */}
        <div>
          <label
            htmlFor="department"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Departamento
          </label>
          <select
            name="department"
            id="department"
            value={form.department}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-gray-300 bg-white py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            <option value="" disabled>
              Selecione um departamento
            </option>
            <option value="HR">Recursos Humanos</option>
            <option value="FINANCE">Financeiro</option>
            <option value="IT">TI</option>
            <option value="OPERATIONS">Operações</option>
            <option value="MARKETING">Marketing</option>
            <option value="SALES">Vendas</option>
          </select>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        >
          Salvar Funcionário
        </Button>
      </form>
    </div>
  );
}
