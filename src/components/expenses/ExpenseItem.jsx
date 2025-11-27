import React from 'react';
import { FiDollarSign, FiTag, FiCalendar, FiEdit2, FiTrash2, FiFile } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ExpenseItem = ({ 
  expense, 
  onEdit, 
  onDelete, 
  onViewReceipt,
  categories = [],
  currency = 'USD'
}) => {
  const { t } = useTranslation();
  
  const getCategoryIcon = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found?.icon || <FiTag className="h-4 w-4" />;
  };

  const getCategoryName = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found?.label || category;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat(undefined, { 
                    style: 'currency', 
                    currency: currency 
                  }).format(expense.amount)}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getCategoryName(expense.category)}
                </p>
              </div>
            </div>
            
            {expense.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {expense.description}
              </p>
            )}
            
            <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
              <div className="flex items-center">
                <FiCalendar className="mr-1" />
                {new Date(expense.date).toLocaleDateString()}
              </div>
              {expense.receipt && (
                <button 
                  onClick={() => onViewReceipt(expense)}
                  className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FiFile className="mr-1" />
                  {t('expenses.viewReceipt')}
                </button>
              )}
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0 flex space-x-1">
            <button
              onClick={() => onEdit(expense)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              title={t('common.edit')}
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              title={t('common.delete')}
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
