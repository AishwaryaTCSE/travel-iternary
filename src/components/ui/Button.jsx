// src/components/ui/Button.jsx
import React from 'react';
import { FiLoader } from 'react-icons/fi';
import clsx from 'clsx';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || isLoading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading && <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {!isLoading && startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      {!isLoading && endIcon && <span className="ml-2">{endIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;