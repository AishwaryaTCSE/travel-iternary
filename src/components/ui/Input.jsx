// src/components/ui/Input.jsx
import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import clsx from 'clsx';

const Input = React.forwardRef(
  (
    {
      className,
      error,
      label,
      helperText,
      startIcon,
      endIcon,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <div className={clsx('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              hasError &&
                'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {endIcon}
            </div>
          )}
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiAlertCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={clsx(
              'text-sm',
              hasError ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {helperText}
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error.message}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;