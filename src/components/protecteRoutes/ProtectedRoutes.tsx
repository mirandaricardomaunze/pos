import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { JSX } from "react";
import { useAuth } from "../../context/userContext/usercontext";
import type { ProtectedRoutesTypes } from "../../types/protectedRoutes";
import LoadingSpinner from "../loading/LoadingSpinner";

export const ProtectedRoutes = ({ children, roles }: ProtectedRoutesTypes): JSX.Element | null => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner/>; 

  if (!user) {
    toast.dismiss();
    toast.error("Acesso negado. Faça login para continuar.");
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user?.role??"")) {
    toast.dismiss();
    toast.error("Acesso negado. Você não tem permissão para acessar esta página.");
    return <Navigate to="/login" replace />;
  }

  return children;
};
