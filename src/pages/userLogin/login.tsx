import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/input';
import Button from '../../components/ui/button';
import userService from '../../services/userService/userService';
import { useAuth } from '../../context/userContext/usercontext'; // Importa o hook


const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth(); // <- Aqui usamos o contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { access_token, user } = await userService.login(email, password);
      login(user, access_token);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Bem-vindo de volta
        </h1>

        {error && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm animate-pulse">
            <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01m-.01-10a9 9 0 11-9 9 9 9 0 019-9z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="transition-all duration-150 focus:ring-2 focus:ring-blue-500"
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="transition-all duration-150 focus:ring-2 focus:ring-blue-500"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-200"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
