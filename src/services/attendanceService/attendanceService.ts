import type {
  Attendance,
  AttendanceList,
  CreateAttendanceDto,
} from "../../types/attendance";
import type { ReportRHData } from "../../types/reportRh";
import { api } from "../api/api";

type AbsencesResponse = {
  absences: string[]; // Ex: ["2025-07-01", "2025-07-05"]
  total: number;
};

const attendanceService = {
  create: async (data: CreateAttendanceDto): Promise<Attendance> => {
    const response = await api.post("/attendance", data);
    return response.data;
  },

  getAll: async (): Promise<Attendance[]> => {
    const response = await api.get("/attendance");
    return response.data;
  },

  getByDate: async (date?: string): Promise<AttendanceList[]> => {
    const url = date ? `/attendance/by-date?date=${date}` : "/attendance/by-date";
    const response = await api.get(url);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<{ checkOut: string }>
  ): Promise<Attendance> => {
    const response = await api.patch(`/attendance/${id}`, data);
    return response.data;
  },

  getAbsencesByMonth: async (
    employeeId: number,
    year: number,
    month: number
  ): Promise<AbsencesResponse> => {
    const response = await api.get(`/attendance/absences/${employeeId}`, {
      params: { year, month },
    });
    return response.data;
  },


   async getMonthlyReport(month: string): Promise<ReportRHData[]> {
    const response = await api.get(`/attendance/report?month=${month}`);
    return response.data;
  }
};

export default attendanceService;
