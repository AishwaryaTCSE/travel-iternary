// src/components/ui/Badge.jsx
import React from 'react';
import clsx from 'clsx';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium';

  const variants = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    secondary:
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    dark: 'bg-gray-800 text-white dark:bg-gray-900 dark:text-gray-200',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        roundedStyles[rounded],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;