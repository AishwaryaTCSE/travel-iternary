// src/components/recommendations/RecommendationFilter.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFilter, FiX } from 'react-icons/fi';

const RecommendationFilter = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { value: 'all', label: t('recommendations.categories.all') },
    { value: 'attraction', label: t('recommendations.categories.attraction') },
    { value: 'restaurant', label: t('recommendations.categories.restaurant') },
    { value: 'hotel', label: t('recommendations.categories.hotel') },
    { value: 'activity', label: t('recommendations.categories.activity') },
  ];

  const priceRanges = [
    { value: 'all', label: t('recommendations.priceRanges.all') },
    { value: 'budget', label: t('recommendations.priceRanges.budget') },
    { value: 'mid', label: t('recommendations.priceRanges.mid') },
    { value: 'luxury', label: t('recommendations.priceRanges.luxury') },
  ];

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handlePriceRangeChange = (e) => {
    onFilterChange({ priceRange: e.target.value });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ rating: rating === filters.rating ? 0 : rating });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      priceRange: 'all',
      rating: 0
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <FiFilter size={16} />
        <span>{t('common.filters')}</span>
        {(filters.category !== 'all' || filters.priceRange !== 'all' || filters.rating > 0) && (
          <span className="ml-1 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full">
            {[
              filters.category !== 'all' ? 1 : 0,
              filters.priceRange !== 'all' ? 1 : 0,
              filters.rating > 0 ? 1 : 0
            ].reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('common.filters')}
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('common.clearAll')}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('recommendations.filterByCategory')}
                </label>
                <select
                  value={filters.category}
                  onChange={handleCategoryChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('recommendations.filterByPrice')}
                </label>
                <select
                  value={filters.priceRange}
                  onChange={handlePriceRangeChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('recommendations.minimumRating')}
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-2xl ${
                        star <= filters.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-500'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  {filters.rating > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      {filters.rating}+
                    </span>
                  )}
                </div>
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

export default RecommendationFilter;