export interface CreatePayrollDto {
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
}

export interface Payroll {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  status: 'PENDING' | 'PAID';
  paymentDate: string | null;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  employee: {
    fullName: string;
  };
}
