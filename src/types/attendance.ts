export interface Attendance {
  id: number;
  employeeId: number;
  checkIn: string;
  checkOut: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendanceDto {
  employeeId: number;
}

export interface AttendanceList extends Attendance {
  id: number;
  checkIn: string;
  employee: {
    id: number;
    name: string;
    position?: string;
    department?: string;
  };
  company: {
    id: number;
    name: string;
  };
}
