import React, { useState } from 'react';
import { FiFilter, FiSearch, FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import ExpenseItem from './ExpenseItem';
import ExpenseForm from './ExpenseForm';

const ExpenseList = ({
  expenses = [],
  categories = [],
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onViewReceipt,
  currency = 'USD',
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchTerm === '' || 
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.amount.toString().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      expense.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryOptions = [
    { value: 'all', label: t('common.all') },
    ...categories
  ];

  const handleSubmit = (expenseData) => {
    if (editingExpense) {
      onUpdateExpense(expenseData);
    } else {
      onAddExpense(expenseData);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('expenses.expenses')}
        </h2>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          {t('expenses.addExpense')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t('expenses.totalExpenses')}
            </p>
            <p className="text-2xl font-bold text-blue-900 dark:text-white">
              {new Intl.NumberFormat(undefined, { 
                style: 'currency', 
                currency: currency 
              }).format(totalAmount)}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t('expenses.averagePerDay')}
            </p>
            <p className="text-2xl font-bold text-green-900 dark:text-white">
              {new Intl.NumberFormat(undefined, { 
                style: 'currency', 
                currency: currency 
              }).format(expenses.length > 0 ? totalAmount / 7 : 0)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
              {t('expenses.totalExpenses')}
            </p>
            <p className="text-2xl font-bold text-purple-900 dark:text-white">
              {expenses.length}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('expenses.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="w-full sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isFormOpen && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingExpense ? t('expenses.editExpense') : t('expenses.addExpense')}
              </h3>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingExpense(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">{t('common.close')}</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ExpenseForm
              expense={editingExpense}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingExpense(null);
              }}
            />
          </div>
        )}

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <FiDollarSign className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('expenses.noExpenses')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? t('expenses.noMatchingExpenses')
                : t('expenses.getStarted')}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                {t('expenses.addExpense')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                categories={categories}
                currency={currency}
                onEdit={handleEdit}
                onDelete={onDeleteExpense}
                onViewReceipt={onViewReceipt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
