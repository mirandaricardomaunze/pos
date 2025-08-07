import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  noPadding?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  as?: React.ElementType;
}

/**
 * Componente Card responsivo para exibir conteúdo em um contêiner estilizado
 * @param children - Conteúdo principal do card
 * @param className - Classes adicionais para personalização
 * @param title - Título opcional do card
 * @param subtitle - Subtítulo opcional do card
 * @param footer - Conteúdo opcional do rodapé
 * @param noPadding - Se verdadeiro, remove o padding interno
 * @param bordered - Se verdadeiro, adiciona borda ao card
 * @param hoverable - Se verdadeiro, adiciona efeito hover
 * @param as - Elemento HTML a ser renderizado (div por padrão)
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  noPadding = false,
  bordered = true,
  hoverable = false,
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden
        ${bordered ? 'border border-gray-200' : ''}
        ${hoverable ? 'transition-shadow hover:shadow-md' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-2 xs:p-3 sm:p-4'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </Component>
  );
};

export default Card;