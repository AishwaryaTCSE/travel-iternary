// src/components/ui/Pagination.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'react-feather';
import clsx from 'clsx';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showPageNumbers = true,
  showPrevNext = true,
  showFirstLast = false,
  variant = 'primary',
  size = 'md',
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <PageNumber
          key={1}
          page={1}
          isActive={false}
          onClick={() => handlePageChange(1)}
          variant={variant}
          size={size}
        />
      );
      if (startPage > 2) {
        pageNumbers.push(
          <PageNumber
            key="ellipsis-start"
            page={<MoreHorizontal className="h-4 w-4" />}
            isDisabled
            variant={variant}
            size={size}
          />
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          page={i}
          isActive={i === currentPage}
          onClick={() => handlePageChange(i)}
          variant={variant}
          size={size}
        />
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PageNumber
            key="ellipsis-end"
            page={<MoreHorizontal className="h-4 w-4" />}
            isDisabled
            variant={variant}
            size={size}
          />
        );
      }
      pageNumbers.push(
        <PageNumber
          key={totalPages}
          page={totalPages}
          isActive={false}
          onClick={() => handlePageChange(totalPages)}
          variant={variant}
          size={size}
        />
      );
    }

    return pageNumbers;
  };

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
  };

  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <nav
      className={clsx('flex items-center justify-between', className)}
      aria-label="Pagination"
    >
      <div className="flex-1 flex items-center">
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={clsx(
              'inline-flex items-center px-3 py-1.5 rounded-md font-medium',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variants[variant],
              sizes[size]
            )}
          >
            First
          </button>
        )}
        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={clsx(
              'ml-2 inline-flex items-center px-3 py-1.5 rounded-md font-medium',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variants[variant],
              sizes[size]
            )}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </button>
        )}

        {showPageNumbers && (
          <div className="hidden md:flex mx-4 space-x-1">
            {renderPageNumbers()}
          </div>
        )}

        {showPrevNext && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={clsx(
              'ml-2 inline-flex items-center px-3 py-1.5 rounded-md font-medium',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variants[variant],
              sizes[size]
            )}
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={clsx(
              'ml-2 inline-flex items-center px-3 py-1.5 rounded-md font-medium',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variants[variant],
              sizes[size]
            )}
          >
            Last
          </button>
        )}
      </div>
    </nav>
  );
};

const PageNumber = ({ page, isActive, onClick, variant, size, isDisabled = false }) => {
  const variants = {
    primary: isActive
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    secondary: isActive
      ? 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
    outline: isActive
      ? 'border-blue-500 text-blue-600 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-900/30'
      : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
  };

  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center rounded-md border font-medium',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size]
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  );
};

export default Pagination;