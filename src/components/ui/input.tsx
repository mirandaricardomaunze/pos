import  { forwardRef } from 'react';
import type { InputProps } from '../../types/ui';


const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      label, 
      error, 
      icon, 
      iconPosition = 'left',
      className = "", 
      containerClass = "",
      labelClass = "",
      ...props 
    },
    ref
  ) => {
    const hasIconLeft = icon && iconPosition === 'left';
    const hasIconRight = icon && iconPosition === 'right';

    return (
      <div className={`mb-4 ${containerClass}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium mb-1 ${
              error ? "text-red-500" : "text-gray-700"
            } ${labelClass}`}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {hasIconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            {...props}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
              hasIconLeft ? "pl-10" : ""
            } ${
              hasIconRight ? "pr-10" : ""
            } ${
              error
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            } ${className}`}
          />
          
          {hasIconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;