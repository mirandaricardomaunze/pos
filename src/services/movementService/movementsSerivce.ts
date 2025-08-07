import { api } from "../../services/api/api";
import type{ Movement } from "../../types/movements";


export const getMovements = async (): Promise<Movement[]> => {
  const response = await api.get<Movement[]>("/movements");
  if (response.status !== 200) throw new Error("Erro ao buscar movimentos");
  console.log("Movimentos", response.data);
  
  return response.data;
};

export const createMovement = async (movement: Partial<Movement>) => {
  const response = await api.post<Movement>("/movements", movement);
  if (response.status !== 201) throw new Error("Erro ao criar movimento");
  return response.data;
};

export const deleteMovement = async (id: number) => {
  const response = await api.delete(`/movements/${id}`);
  if (response.status !== 204) throw new Error("Erro ao deletar movimento");
};