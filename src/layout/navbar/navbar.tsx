import { Link, useNavigate } from 'react-router-dom';
import {routesNavbar} from "../../routes/routes";
import { useAuth } from '../../context/userContext/usercontext';
import { NotificationList } from '../../components/notification/NotificationsList';
import {  useEffect, useState } from 'react';

const Navbar: React.FC = () => {
const [loggedUser ,setLoggedUser]=useState<string | null>(null);

const {user}=useAuth();
const navigate = useNavigate();
useEffect(() => {
  setLoggedUser(user?.name || null);
  if (!user) {
    navigate('/login');
  }
}, [user]);
  return (
    <nav className="bg-blue-600 w-full sticky top-0 z-30 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-end p-2 xs:p-3">
         {/* Espaço vazio à esquerda para evitar sobreposição com o botão hamburguer */}
         <div className="w-8 md:hidden"></div>    
         {/* Nome do usuário no centro */}
         <div className="flex items-center justify-center text-sm">
           {loggedUser && (
             <div className=" flex   items-center justify-center bg-blue-500 text-white px-1 py-1 xs:px-3 xs:py-1  w-5 h-5 p-1 rounded-full border-white border-1 text-xs xs:text-sm sm:text-base truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
               <p className="truncate text-sm" title={loggedUser}>{loggedUser.charAt(0)}</p>
             </div>
           )}
         </div>
         
         {/* Ícones de perfil e notificações à direita */}
         <div className="flex items-center space-x-1 xs:space-x-2">
           <div title='Notificações' className="flex items-center py-1 px-2 xs:py-2 xs:px-3 rounded-full hover:bg-blue-500 transition-colors duration-200">
             <NotificationList />
           </div>
           {/* Navbar links */}
           {routesNavbar.map((route) => (
             <Link
               key={route.to}
               to={route.to}
               title={route.title}
               className="flex items-center py-1 px-2 xs:py-2 xs:px-3 rounded-full hover:bg-blue-500 transition-colors duration-200"
             >
               <span className='mr-1 xs:mr-2'>
                 {route.icon}
               </span>
             </Link>
           ))}
         </div>
      </div>
    </nav>
  );
}

export default Navbar;