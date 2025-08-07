import React from "react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "blue" | "purple" | "green" | "red" | "gray" | "white";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "blue",
  className = "",
  text,
  fullScreen = false,
}) => {
  const sizeClasses = {
    xs: "h-3 w-3 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-3",
    lg: "h-8 w-8 border-4",
    xl: "h-12 w-12 border-4",
  };

  const colorClasses = {
    blue: "border-blue-500",
    purple: "border-purple-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500",
    white: "border-white",
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen fixed inset-0 bg-gray-900/50 z-50' : ''}`}>
      <div
        className={`inline-block animate-spin rounded-full border-t-transparent border-r-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        role="status"
        aria-label="loading"
      />
      {text && <p className={`mt-2 text-sm ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>{text}</p>}
    </div>
  );

  return spinner;
};

export default LoadingSpinner;
