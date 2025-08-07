import React, { useContext, useEffect, useState, type ReactNode, useCallback } from "react";
import { createContext } from "react";
import type { AuthContextData, User } from "../../types";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Tempo de tolerância para expiração do token (5 minutos)
const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000; 

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o token está expirado ou prestes a expirar
  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode(token) as { exp: number };
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime - (TOKEN_EXPIRATION_BUFFER / 1000);
    } catch (error) {
      console.error("Token inválido:", error);
      return false;
    }
  }, []);

  const login = useCallback((userData: User, authToken: string) => {
    if (!isTokenValid(authToken)) {
      console.warn("Token inválido ou expirado");
      return;
    }

    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", authToken);
  }, [isTokenValid]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    console.log("Logout realizado com sucesso");
  }, []);

  // Verificação inicial ao carregar o provider
useEffect(() => {
  const initializeAuth = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');

      if (storedUser && storedToken && isTokenValid(storedToken)) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error("Erro ao inicializar autenticação:", error);
    } finally {
      setIsLoading(false); // 🔄 Finaliza apenas uma vez!
    }
  };

  initializeAuth();
  // ✅ Roda apenas uma vez, pois sem dependências
}, []);

  // Adicione esta função se precisar atualizar o usuário
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, []);

  // Adicione esta função se precisar atualizar o token
  const updateToken = useCallback((newToken: string) => {
    if (!isTokenValid(newToken)) {
      console.warn("Novo token é inválido");
      return;
    }
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
  }, [isTokenValid]);

  // Valor do contexto
  const contextValue = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
    updateToken,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};