// src/components/recommendations/RecommendationCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';

const RecommendationCard = ({ recommendation }) => {
  const { t } = useTranslation();
  const { name, category, location, priceLevel, rating, imageUrl, description } = recommendation;

  const renderPriceLevel = (level) => {
    return <span>{'$'.repeat(level)}</span>;
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-yellow-400 ${
              i < Math.floor(rating) ? 'fill-current' : ''
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {t('recommendations.noImage')}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
          <FiMapPin className="mr-1" size={14} />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiDollarSign className="mr-1" size={14} />
            <span>{priceLevel ? renderPriceLevel(priceLevel) : t('recommendations.free')}</span>
          </div>
          {rating > 0 && renderRating(rating)}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            {t('common.viewDetails')}
          </button>
          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            {t('common.addToPlan')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;