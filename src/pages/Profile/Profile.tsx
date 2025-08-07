import { useEffect, useState } from "react";
import type { User } from "../../types";
import userService from "../../services/userService/userService";
import EditProfileForm from "../../components/userProfile/EditProfileForm";
import { UserProfile } from "../../components/userProfile/UserProfile";
import ChangePasswordForm from "../../components/userProfile/ChangePasswordForm";
import AssignCompanyForm from "../../components/userProfile/AssignCompanyForm";

type ProfileTab = 'info' | 'password' | 'company';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  useEffect(() => {
    userService.getProfile()
      .then(setUser)
      .catch(() => alert("Erro ao carregar perfil"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Carregando informações do perfil...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro ao carregar perfil</h2>
        <p className="text-gray-600 mb-6">Não foi possível carregar as informações do seu perfil. Por favor, tente novamente mais tarde.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Header com banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 w-full">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-end">
          <h1 className="text-3xl font-bold text-white pb-6">Meu Perfil</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Perfil do usuário */}
        <UserProfile user={user} />
        
        {/* Navegação por abas */}
        <div className="bg-white shadow-md rounded-lg mt-8 overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('info')} 
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Informações Pessoais
            </button>
            <button 
              onClick={() => setActiveTab('company')} 
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'company' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Empresa
            </button>
            <button 
              onClick={() => setActiveTab('password')} 
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Segurança
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'info' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
                <EditProfileForm user={user} onUpdate={setUser} />
              </>
            )}
            
            {activeTab === 'company' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Associar Empresa</h2>
                <AssignCompanyForm
                  currentCompanyId={user.companyId}
                  onCompanyAssigned={(newCompanyId: number) => {
                    setUser(prev => prev ? { ...prev, companyId: newCompanyId } : prev);
                  }}
                />
              </>
            )}
            
            {activeTab === 'password' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Alterar Senha</h2>
                <ChangePasswordForm />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
