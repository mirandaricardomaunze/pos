import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:3000'; // Altere para sua URL real

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicione interceptadores se necessário
api.interceptors.request.use(config => {
  // Você pode adicionar tokens de autenticação aqui
  const token = localStorage.getItem('authToken');
  console.log(`Token de autenticação: ${token}`); // Log do token para depuração
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // Tratamento global de erros
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Tratar não autorizado
            console.error('Usuário não autorizado. Redirecionando para login...');
            toast.error("Usuário não autorizado. Redirecionando para login...")
          break;
        case 404:
          // Tratar não encontrado
            console.error('Recurso não encontrado. Verifique a URL ou o ID do produto.');  
          break;
        case 500:
          // Tratar erro do servidor
            console.error('Erro interno do servidor. Tente novamente mais tarde.');        
          break;
        default:
          // Tratar outros erros
      }
    }
    return Promise.reject(error);
  }
);