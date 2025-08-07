export interface CreateVacationDto {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  notes?: string;
}

export interface Vacation extends CreateVacationDto {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}


export type VacationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VacationFilter {
  employeeId?: number;
  status?: VacationStatus;
  startDate?: string; // ISO string ex: '2025-07-01'
  endDate?: string;   // ISO string
}
