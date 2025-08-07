import type { AxiosError } from "axios";
import type { RegisterFormData, User } from "../../types";
import { api } from "../api/api";
import { toast } from "react-toastify";

const API_BASE_URL = "/auth";

// Função de tratamento de erro centralizada com toast
function handleRequestError(error: unknown): never {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;
    const errorMessage =
      (axiosError.response?.data as any)?.message ||
      axiosError.message ||
      "Erro desconhecido na requisição.";

    console.error("Erro na requisição:", errorMessage);
    toast.error(errorMessage);
    throw axiosError.response?.data || { message: errorMessage };
  }

  toast.error("Erro inesperado.");
  throw new Error("Erro inesperado");
}

const userService = {
  async registerUser(data: RegisterFormData) {
    try {
      const { confirmPassword, ...payload } = data;
      console.log("Dados enviados para registro:", payload);
      const response = await api.post(`${API_BASE_URL}/register`, payload);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      handleRequestError(error);
      
    }
  },

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    try {
      const response = await api.post(`${API_BASE_URL}/login`, { email, password });
      localStorage.setItem("authToken", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Entrou com sucesso !");
      return response.data;
    } catch (error) {
      toast.error("Erro ao a fazer login")
      handleRequestError(error);
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await api.get(`${API_BASE_URL}/profile`);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  async updateProfile(data: { name: string; email: string }): Promise<User> {
    try {
      const response = await api.put(`${API_BASE_URL}/update-profile`, data);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  async uploadAvatar(file: File) {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post(`${API_BASE_URL}/upload-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  async changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }) {
    try {
      const response = await api.put(`${API_BASE_URL}/change-password`, data);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },

  async assignCompany(companyId: number) {
    try {
      const response = await api.patch(`${API_BASE_URL}/assign-company`, { companyId });
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
};

export default userService;
