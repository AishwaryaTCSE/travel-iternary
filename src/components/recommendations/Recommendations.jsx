// src/components/recommendations/Recommendations.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock, FiDollarSign, FiStar, FiFilter } from 'react-icons/fi';
import RecommendationCard from './RecommendationCard';
import RecommendationFilter from './RecommendationFilter';
import { getRecommendations } from '../../utils/recommendationUtils';

const Recommendations = ({ destination, dates, interests = [] }) => {
  const { t } = useTranslation();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 0
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await getRecommendations(destination, dates, interests, filters);
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchRecommendations();
    }
  }, [destination, dates, interests, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('recommendations.title')}
        </h2>
        <RecommendationFilter 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('recommendations.noResults')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((recommendation) => (
            <RecommendationCard 
              key={recommendation.id} 
              recommendation={recommendation} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;