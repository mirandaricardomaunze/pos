import React from "react";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import { useContextSideBar } from "../../context/contextsidebar/contextsidebar";
import { Outlet } from "react-router-dom"; // IMPORTANTE

const Layout: React.FC = () => {
  const { isMobile, isSideBarOpen } = useContextSideBar();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <div className="flex-1 flex flex-col w-full">
          <div
            className={`bg-gray-50 flex-1 transition-all duration-300 ${isSideBarOpen ? "md:ml-64" : "ml-0"} ${isMobile && isSideBarOpen ? "opacity-50" : "opacity-100"}`}
          >
            <main className="flex-1 p-2 xs:p-3 sm:p-4 mx-auto max-w-7xl">
              <Outlet /> {/* <-- Aqui é onde vai o conteúdo da rota */}
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
