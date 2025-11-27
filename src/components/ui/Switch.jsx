// src/components/ui/Switch.jsx
import React from 'react';
import clsx from 'clsx';

const Switch = ({
  checked = false,
  onChange = () => {},
  label = '',
  className = '',
  disabled = false,
  ...props
}) => {
  const handleChange = (e) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      className={clsx(
        'inline-flex items-center cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        <div
          className={clsx(
            'block w-14 h-8 rounded-full transition-colors duration-200',
            checked
              ? 'bg-blue-600 dark:bg-blue-500'
              : 'bg-gray-200 dark:bg-gray-700'
          )}
        />
        <div
          className={clsx(
            'absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200',
            checked && 'transform translate-x-6'
          )}
        />
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;