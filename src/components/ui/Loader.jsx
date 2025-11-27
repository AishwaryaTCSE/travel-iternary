// src/components/ui/Loader.jsx
import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loader = ({ 
  size = 'md', 
  color = 'primary', 
  fullScreen = false,
  className = '',
  text = 'Loading...' 
}) => {
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
  };

  const colors = {
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    light: 'text-gray-300 dark:text-gray-500',
    dark: 'text-gray-800 dark:text-gray-200',
  };

  const loader = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FiLoader
        className={`animate-spin ${sizes[size]} ${colors[color]}`}
        aria-hidden="true"
      />
      {text && (
        <span className={`mt-2 text-sm ${colors[color]}`}>{text}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
};

// Page Loader
export const PageLoader = ({ className = '' }) => (
  <div className={`flex items-center justify-center min-h-screen ${className}`}>
    <Loader size="lg" color="primary" text="Loading your experience..." />
  </div>
);

// Content Loader (Skeleton)
export const ContentLoader = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse flex space-x-4"
      >
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Button Loader
export const ButtonLoader = ({ size = 'md' }) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  return (
    <FiLoader
      className={`animate-spin ${sizes[size]} text-current`}
      aria-hidden="true"
    />
  );
};

export default Loader;