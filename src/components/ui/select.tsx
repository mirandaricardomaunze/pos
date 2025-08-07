import { forwardRef } from "react";
import type { SelectProps } from "../../types/ui";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      className = "",
      containerClass = "",
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`mb-4 ${containerClass}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block text-sm font-medium mb-1 ${
              error ? "text-red-500" : "text-gray-700"
            }`}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          {...props}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          } ${className}`}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
