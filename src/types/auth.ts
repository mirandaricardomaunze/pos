export type UserRole = 'ADMIN' | 'USER' | 'OPERATOR' | 'MANAGER'| 'SELLER';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  companyId?: number  |  undefined;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?:string;
  avatarUrl?: string;
  createdAt?: string;
  companyId?: number| null;
}

export interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  updateToken: (newToken: string) => void;
}
