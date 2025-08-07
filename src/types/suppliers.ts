export interface SupplierFormData {
  id?: number;
  // Informações básicas
  name: string;
  isActive: boolean;
  
  // Informações legais
  legalBusinessName: string;
  tradingName: string;
  nuit: string;
  
  // Endereço
  address: string;
  addressNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  
  // Contato
  contactPerson: string;
  contactPosition: string;
  phone: string;
  mobile: string;
  email: string;
  website?: string;
  
  // Dados bancários
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
  companyId?: number; // ID da empresa associada
  // Metadados
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export default interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => Promise<void> | void;
  isLoading?: boolean;
  initialValues?: SupplierFormData;
  onCancel?: () => void;
}