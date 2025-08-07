import type { Employee, EmployeeWithAttendanceStatus } from "../../types/employee";
import { api } from "../api/api";

const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    console.log('funcionários:', response.data);
    return response.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: Partial<Employee>): Promise<Employee> => {
    const response = await api.post('/employees', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  getByCompanyId: async (companyId: number): Promise<Employee[]> => {
    const response = await api.get(`/employees/company/${companyId}`);
    return response.data;
  },

  getActiveWithAttendance: async (): Promise<EmployeeWithAttendanceStatus[]> => {
    const response = await api.get('/attendance/active-with-status');
    console.log('Funcionários ativos com status de presença:', response.data);
    return response.data;
  }
};

export default employeeService;
