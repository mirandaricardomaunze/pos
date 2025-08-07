import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Hook para gerenciar a responsividade do aplicativo
 * Permite verificar o tamanho atual da tela e se está em um determinado breakpoint
 */
const useResponsive = () => {
  // Configuração dos breakpoints (em pixels)
  const breakpoints: BreakpointConfig = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  // Estado para armazenar a largura da janela
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Estado para armazenar o breakpoint atual
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');

  // Atualiza a largura da janela e o breakpoint atual quando a janela é redimensionada
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      // Determina o breakpoint atual
      if (width < breakpoints.sm) {
        setCurrentBreakpoint('xs');
      } else if (width < breakpoints.md) {
        setCurrentBreakpoint('sm');
      } else if (width < breakpoints.lg) {
        setCurrentBreakpoint('md');
      } else if (width < breakpoints.xl) {
        setCurrentBreakpoint('lg');
      } else if (width < breakpoints['2xl']) {
        setCurrentBreakpoint('xl');
      } else {
        setCurrentBreakpoint('2xl');
      }
    };

    // Configura o listener para redimensionamento
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Chama uma vez para inicializar
    }

    // Remove o listener quando o componente é desmontado
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Funções auxiliares para verificar breakpoints
  const isXs = windowWidth < breakpoints.sm;
  const isSm = windowWidth >= breakpoints.sm && windowWidth < breakpoints.md;
  const isMd = windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  const isLg = windowWidth >= breakpoints.lg && windowWidth < breakpoints.xl;
  const isXl = windowWidth >= breakpoints.xl && windowWidth < breakpoints['2xl'];
  const is2Xl = windowWidth >= breakpoints['2xl'];

  const isMobile = windowWidth < breakpoints.md;
  const isTablet = windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  const isDesktop = windowWidth >= breakpoints.lg;

  // Verifica se a largura atual é maior ou igual a um determinado breakpoint
  const up = (breakpoint: Breakpoint): boolean => {
    return windowWidth >= breakpoints[breakpoint];
  };

  // Verifica se a largura atual é menor que um determinado breakpoint
  const down = (breakpoint: Breakpoint): boolean => {
    return windowWidth < breakpoints[breakpoint];
  };

  // Verifica se a largura atual está entre dois breakpoints
  const between = (start: Breakpoint, end: Breakpoint): boolean => {
    return windowWidth >= breakpoints[start] && windowWidth < breakpoints[end];
  };

  return {
    windowWidth,
    currentBreakpoint,
    breakpoints,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,
    up,
    down,
    between,
  };
};

export default useResponsive;