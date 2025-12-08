import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCalendar, FiTag, FiPlus, FiX, FiSave } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ExpenseForm = ({ 
  expense, 
  onSubmit = () => console.warn('onSubmit handler not provided to ExpenseForm'), 
  onCancel = () => console.warn('onCancel handler not provided to ExpenseForm'), 
  categories = [] 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: categories[0]?.value || 'other',
    description: '',
    receipt: null,
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id || '',
        amount: expense.amount || '',
        date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
        category: expense.category || (categories[0]?.value || 'other'),
        description: expense.description || '',
        receipt: expense.receipt || null,
      });
    }
  }, [expense, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
      });
    } else {
      console.error('onSubmit is not a function', { onSubmit });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('expenses.amount')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('common.date')}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md"
              required
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('expenses.category')}
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('common.description')} <span className="text-xs text-gray-500">({t('common.optional')})</span>
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={t('expenses.descriptionPlaceholder')}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('expenses.receipt')} <span className="text-xs text-gray-500">({t('common.optional')})</span>
          </label>
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
              <FiPlus className="h-4 w-4 mr-1 inline" />
              {formData.receipt ? formData.receipt.name : t('expenses.uploadReceipt')}
              <input
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept="image/*,.pdf"
              />
            </label>
            {formData.receipt && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, receipt: null }))}
                className="ml-2 p-1 text-gray-400 hover:text-red-500"
                title={t('common.remove')}
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiSave className="mr-2 h-4 w-4" />
          {expense ? t('common.save') : t('expenses.addExpense')}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
