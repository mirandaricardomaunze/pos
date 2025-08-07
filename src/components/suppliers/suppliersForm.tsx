import React, { useState, useEffect, useMemo } from 'react';
import Input from '../ui/input';
import Button from '../ui/button';
import { toast } from 'react-toastify';
import type { SupplierFormData } from '../../types/suppliers';
import type SupplierFormProps from '../../types/suppliers';
import { SupplierService } from '../../services/suppliersService/suppliersService'; // ✅ import serviço

const initialState: SupplierFormData = {
  name: '',
  legalBusinessName: '',
  tradingName: '',
  nuit: '',
  address: '',
  addressNumber: '',
  neighborhood: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  contactPerson: '',
  contactPosition: '',
  phone: '',
  mobile: '',
  email: '',
  website: '',
  bankName: '',
  bankAccountNumber: '',
  bankBranch: '',
  isActive: true,
};

const SupplierForm: React.FC<SupplierFormProps> = ({
  onCancel,
  initialValues,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<SupplierFormData>(initialValues || initialState);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const companyId = useMemo(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).companyId : null;
    } catch {
      return null;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
      toast.error('ID da empresa não encontrado.');
      return;
    }

    const dataToSubmit = { ...formData, companyId };

    try {
      if (initialValues?.id) {
        await SupplierService.updateSupplier(initialValues.id.toString(), dataToSubmit);
        toast.success('Fornecedor atualizado com sucesso!');
      } else {
        await SupplierService.createSupplier(dataToSubmit);
        toast.success('Fornecedor cadastrado com sucesso!');
      }
      setFormData(initialState);
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao salvar fornecedor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <div className="md:col-span-2 space-y-4 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="name"
              label="Nome do Fornecedor*"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Fornecedor Ativo
              </label>
            </div>
          </div>
        </div>

        {/* Informações Legais */}
        <div className="md:col-span-2 space-y-4 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Informações Legais</h2>
          <Input
            name="legalBusinessName"
            label="Razão Social*"
            value={formData.legalBusinessName}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="tradingName"
              label="Nome Fantasia*"
              value={formData.tradingName}
              onChange={handleChange}
              required
            />
            <Input
              name="nuit"
              label="NUIT*"
              value={formData.nuit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="md:col-span-2 space-y-4 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="address"
              label="Endereço*"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <Input
              name="addressNumber"
              label="Número*"
              value={formData.addressNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="neighborhood"
              label="Bairro*"
              value={formData.neighborhood}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              name="city"
              label="Cidade*"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Input
              name="state"
              label="Estado*"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <Input
              name="country"
              label="País*"
              value={formData.country}
              onChange={handleChange}
              required
            />
            <Input
              name="postalCode"
              label="CEP"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contato */}
        <div className="md:col-span-2 space-y-4 pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="contactPerson"
              label="Pessoa de Contato*"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />
            <Input
              name="contactPosition"
              label="Cargo do Contato*"
              value={formData.contactPosition}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="phone"
              label="Telefone Fixo*"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              name="mobile"
              label="Celular/WhatsApp*"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="email"
              label="E-mail*"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="website"
              label="Website (opcional)"
              type="url"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Dados Bancários */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Dados Bancários</h2>
          <Input
            name="bankName"
            label="Banco*"
            value={formData.bankName}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="bankAccountNumber"
              label="Número da Conta*"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="bankBranch"
              label="Agência*"
              value={formData.bankBranch}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="w-full md:w-auto"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          onClick={() => setFormData(initialState)}
          variant="outline"
          className="w-full md:w-auto"
        >
          Limpar Formulário
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {initialValues ? 'Atualizar Fornecedor' : 'Cadastrar Fornecedor'}
        </Button>
      </div>
    </form>
  );
};
export default SupplierForm;