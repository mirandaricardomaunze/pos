export interface Employee {
  id: number;
  fullName: string;
  position?: string;
  email?: string;
  phone?: string;
  department?: string;
  address?: string;
  salary?: number;
  hireDate?: string;
  isActive: boolean;
  userId?: number;
  companyId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeWithAttendanceStatus {
  id: number;
  name: string;
  position?: string;
  hasOpenAttendance: boolean;
  hasCheckedInToday: boolean;
  lastAttendanceId: number | null;
}
