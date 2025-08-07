import type { CreateVacationDto, Vacation } from "../../types/vacation";
import { api } from "../api/api";

export const vacationService = {
  async requestVacation(data: CreateVacationDto) {
    return await api.post('/vacations/request', data);
  },

  async getByEmployee(employeeId: number): Promise<Vacation[]> {
    const res = await api.get(`/vacations/by-employee/${employeeId}`);
    return res.data;
  },

  async getByCompany(): Promise<Vacation[]> {
    const res = await api.get('/vacations/by-company');
    return res.data;
  },

  async approve(id: number) {
    return await api.patch(`/vacations/approve/${id}`);
  },

  async reject(id: number) {
    return await api.patch(`/vacations/reject/${id}`);
  }
};
