// Sidebar.tsx (modificado com botão de logout profissional)

import { NavLink } from "react-router-dom";
import { routesSidebar } from "../../routes/routes";
import { XMarkIcon, Bars3Icon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useContextSideBar } from "../../context/contextsidebar/contextsidebar";
import { useAuth } from "../../context/userContext/usercontext";
import { useNavigate } from "react-router-dom";
import {  useEffect, useState } from "react";
import { toast } from "react-toastify";
import companyService from "../../services/companyService/companyService";

const Sidebar = () => {
  const { isSideBarOpen, toggleSideBar } = useContextSideBar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string>("");

  const {user}=useAuth();
  const handleCompanyGetName = async() => {
    const companyId=user?.companyId;
    if (!companyId) return;
    try {
      const company = await companyService.getCompanyById(companyId);
      setCompanyName(company.name);
    } catch (error) {
      console.error("Erro ao obter nome da empresa:", error);
      toast.error("Erro ao obter nome da empresa.");
    } 
  }

  useEffect(() => {
    handleCompanyGetName();
  }, [user?.companyId]);


  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("Logout efetuado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao tentar sair. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        aria-label={isSideBarOpen ? "Close menu" : "Open menu"}
        className="md:hidden fixed top-3 left-2 z-30 h-8 w-8 text-white focus:outline-none focus:ring-2 focus:shadow-lg focus:ring-blue-500 focus:ring-opacity-50 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out"
        onClick={toggleSideBar}
      >
        {isSideBarOpen ? (
          <XMarkIcon className="h-full w-full" />
        ) : (
          <Bars3Icon className="h-full w-full" />
        )}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out transform ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-hidden`}
      >
        <div
          className="flex flex-col h-full overflow-y-auto p-2 xs:p-3 sm:p-4 pt-4"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Header */}
          <header className="mb-1 mt-12 p-2 ">
            <div className="flex flex-col  ">
              <h1 title={companyName} className="text-xl rounded-full w-5 h-5 bg-blue-500 p-5 border-white border-2 flex  justify-center items-center  font-bold text-center break-words  overflow-hidden text-ellipsis">
                {companyName.charAt(0) || "Empresa"}
              </h1>
            </div>
          </header>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {routesSidebar.map((route) => (
                <li key={route.to}>
                  <NavLink
                    to={route.to}
                    title={route.title}
                    className={({ isActive }) =>
                      `flex items-center py-3 px-4 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-500 font-medium"
                          : "hover:bg-blue-500/80"
                      }`
                    }
                    onClick={() =>
                      window.innerWidth < 768 && toggleSideBar()
                    }
                  >
                    <span className="flex-shrink-0">{route.icon}</span>
                    <span className="ml-3">{route.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Divider + Logout */}
          <div className="border-t border-blue-400 mt-4 pt-4">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex items-center py-3 px-4 rounded-lg hover:bg-blue-500/80 text-white font-medium transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-white flex-shrink-0" />
              <span className="ml-3">{loading ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          onClick={toggleSideBar}
        />
      )}
    </div>
  );
};

export default Sidebar;
