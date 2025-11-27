// src/components/ui/Alert.jsx
import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'react-feather';
import clsx from 'clsx';

const Alert = ({
  variant = 'info',
  title,
  message,
  className = '',
  onClose,
  closable = true,
  icon: Icon,
  ...props
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-800',
      icon: <Info className="h-5 w-5 text-blue-400" />,
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-200 dark:border-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-200',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-200',
      border: 'border-red-200 dark:border-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
    },
  };

  const { bg, text, border, icon: defaultIcon } = variants[variant] || variants.info;

  return (
    <div
      className={clsx(
        'rounded-md p-4 border',
        bg,
        text,
        border,
        className
      )}
      {...props}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {Icon ? <Icon className="h-5 w-5" /> : defaultIcon}
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <div className="mt-1 text-sm">{message}</div>}
        </div>
        {closable && (
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;