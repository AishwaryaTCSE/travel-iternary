// src/components/ui/Breadcrumb.jsx
import React from 'react';
import { ChevronRight, Home } from 'react-feather';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const Breadcrumb = ({ items, className = '', homeIcon = true }) => {
  return (
    <nav className={clsx('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {homeIcon && (
          <li>
            <div>
              <Link
                to="/"
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
        )}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-5 w-5 text-gray-400" />
            {item.href ? (
              <Link
                to={item.href}
                className={clsx(
                  'ml-2 text-sm font-medium',
                  index === items.length - 1
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                )}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  'ml-2 text-sm font-medium',
                  'text-gray-500 dark:text-gray-400'
                )}
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;