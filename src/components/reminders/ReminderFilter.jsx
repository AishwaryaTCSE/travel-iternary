// src/components/reminders/ReminderFilter.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiFilter, FiX } from 'react-icons/fi';

const ReminderFilter = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: t('reminders.allStatuses') },
    { value: 'pending', label: t('reminders.pending') },
    { value: 'completed', label: t('reminders.completed') }
  ];

  const priorityOptions = [
    { value: 'all', label: t('reminders.allPriorities') },
    { value: 'high', label: t('reminders.priorityHigh') },
    { value: 'medium', label: t('reminders.priorityMedium') },
    { value: 'low', label: t('reminders.priorityLow') }
  ];

  const categoryOptions = [
    { value: 'all', label: t('reminders.allCategories') },
    { value: 'booking', label: t('reminders.categoryBooking') },
    { value: 'packing', label: t('reminders.categoryPacking') },
    { value: 'transport', label: t('reminders.categoryTransport') },
    { value: 'activity', label: t('reminders.categoryActivity') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      category: 'all'
    });
  };

  const activeFilterCount = [
    filters.status !== 'all' ? 1 : 0,
    filters.priority !== 'all' ? 1 : 0,
    filters.category !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiFilter className="mr-2" size={16} />
        {t('common.filters')}
        {activeFilterCount > 0 && (
          <span className="ml-1.5 py-0.5 px-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('common.filters')}
              </h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('common.clearAll')}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reminders.status')}
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reminders.priority')}
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={filters.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('reminders.category')}
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
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
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 text-right rounded-b-md">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('common.apply')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderFilter;