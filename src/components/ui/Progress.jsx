// src/components/ui/Progress.jsx
import React from 'react';
import clsx from 'clsx';

const Progress = ({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-cyan-500',
  };

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };

  return (
    <div className={clsx('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {value}%
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {max}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700',
          sizes[size]
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default Progress;