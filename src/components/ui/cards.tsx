// components/ui/Card.tsx
import React, { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: any;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  variant?: "default" | "outline" | "elevated";
  hoverEffect?: boolean;
}

const Card = ({
  children,
  title,
  actions,
  footer,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  variant = "default",
  hoverEffect = false,
  ...props
}: CardProps) => {
  const variantClasses = {
    default: "bg-white shadow-sm",
    outline: "border border-gray-200",
    elevated: "bg-white shadow-lg",
  };

  const hoverClasses = hoverEffect 
    ? "transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-0.5" 
    : "";

  return (
    <article
      className={`rounded-lg overflow-hidden ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {/* Header */}
      {(title || actions) && (
        <header className={`border-b border-gray-100 ${headerClassName}`}>
          <div className="px-4 py-3 flex items-center justify-between">
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </header>
      )}

      {/* Body */}
      <section className={`p-4 ${bodyClassName}`}>
        {children}
      </section>

      {/* Footer */}
      {footer && (
        <footer className={`border-t border-gray-100 ${footerClassName}`}>
          <div className="px-4 py-3">
            {footer}
          </div>
        </footer>
      )}
    </article>
  );
};

export default Card;