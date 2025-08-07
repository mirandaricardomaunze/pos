import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ContextSidebarProps {
  isSideBarOpen: boolean;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSideBar: () => void;
  closeSideBar: () => void;
  openSideBar: () => void;
  isMobile:boolean;
  openMobile:()=>void;
}

const ContextSidebar = createContext<ContextSidebarProps | undefined>(undefined);

export const ContextSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [isMobile,setIsMobileOpen]=useState<boolean>(false)
  
  const toggleSideBar = useCallback(() => {
    setIsSideBarOpen(prev => !prev);
  }, []);
  
  const closeSideBar = useCallback(() => {
    setIsSideBarOpen(false);
  }, []);
  
  const openSideBar = useCallback(() => {
    setIsSideBarOpen(true);
  }, []);

  const openMobile=useCallback(()=>{
        setIsMobileOpen(!isMobile)
  },[])

useEffect(() => {
  const handleMobileOpenAndClose = () => {
    // Verifica se a tela é mobile (menor que 768px)
    const isMobileScreen = window.innerWidth < 768;
    
    // Em telas mobile, fecha a sidebar por padrão
    if (isMobileScreen) {
      setIsSideBarOpen(false);
    } else {
      // Em telas desktop, abre a sidebar por padrão
      setIsSideBarOpen(true);
    }
    
    // Atualiza o estado de mobile
    setIsMobileOpen(isMobileScreen);
  };
  
  handleMobileOpenAndClose();
  window.addEventListener("resize", handleMobileOpenAndClose);
  return () => window.removeEventListener("resize", handleMobileOpenAndClose);
}, []);


  useEffect(() => {
    const handleResize = () => {
      // Abre a sidebar quando a tela for maior ou igual a 768px
      if (window.innerWidth >= 768) {
        openSideBar();
      } else {
        closeSideBar();
      }
    };
    
    // Verifica o tamanho da tela no carregamento inicial
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openSideBar, closeSideBar]);

  return (
    <ContextSidebar.Provider 
      value={{
        isSideBarOpen,
        setIsSideBarOpen,
        toggleSideBar,
        closeSideBar,
        openSideBar,
        isMobile,
        openMobile
      }}
    >
      {children}
    </ContextSidebar.Provider>
  );
};

export const useContextSideBar = (): ContextSidebarProps => {
  const context = useContext(ContextSidebar);
  if (context === undefined) {
    throw new Error("useContextSideBar must be used within a ContextSidebarProvider");
  }
  return context;
};