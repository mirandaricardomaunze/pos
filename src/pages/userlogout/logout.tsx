import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../components/ui/button';
import { useAuth } from '../../context/userContext/usercontext';
import { toast } from 'react-toastify';
import Modal from '../../components/modal/modal'; // Certifique-se de que o caminho está correto

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout(); // se for síncrona, remova await
      toast.success('Logout efetuado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao tentar sair. Tente novamente.');
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        className="justify-items-center items-center"
        onClick={() => setIsModalOpen(true)}
      >
        Sair
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmação de Logout"
        size="sm"
      >
        <p className="text-blue-700 mb-4">
          Tem certeza que deseja sair da aplicação?
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Saindo...' : 'Confirmar'}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LogoutButton;
