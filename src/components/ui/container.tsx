import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
  as?: React.ElementType;
}

/**
 * Componente Container responsivo para envolver conteúdo com margens adequadas
 * @param children - Conteúdo a ser exibido dentro do container
 * @param className - Classes adicionais para personalização
 * @param fluid - Se verdadeiro, o container terá largura total
 * @param as - Elemento HTML a ser renderizado (div por padrão)
 */
const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  fluid = false,
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`mx-auto px-2 xs:px-3 sm:px-4 md:px-6 ${fluid ? 'w-full' : 'max-w-7xl'} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Container;