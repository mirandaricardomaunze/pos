import React from 'react';

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  gap?: GridGap;
  as?: React.ElementType;
}

/**
 * Componente Grid responsivo para layouts em grade
 * @param children - Elementos a serem exibidos na grade
 * @param className - Classes adicionais para personalização
 * @param cols - Configuração de colunas para diferentes breakpoints
 * @param gap - Espaçamento entre os itens da grade
 * @param as - Elemento HTML a ser renderizado (div por padrão)
 */
const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 'md',
  as: Component = 'div',
}) => {
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getColsClass = (breakpoint: string, value?: GridColumns) => {
    if (!value) return '';
    return `${breakpoint}:grid-cols-${value}`;
  };

  const colsClasses = [
    getColsClass('', cols.xs),
    getColsClass('sm', cols.sm),
    getColsClass('md', cols.md),
    getColsClass('lg', cols.lg),
    getColsClass('xl', cols.xl),
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={`grid ${colsClasses} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Grid;