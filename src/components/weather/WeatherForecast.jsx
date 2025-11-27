import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import WeatherCard from './WeatherCard';

const WeatherForecast = ({ days = 5 }) => {
  const { t } = useTranslation();
  const { forecast, loading } = useWeather();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
        {[...Array(days)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {t('weather.noForecast')}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">{t('weather.forecast')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {forecast.slice(0, days).map((day) => (
          <div key={day.date} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-3 bg-gray-50 dark:bg-gray-700">
              <div className="font-medium text-center">
                {format(new Date(day.date), 'EEE, MMM d')}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-2">
                <WeatherCard.WeatherIcon 
                  condition={day.condition} 
                  size={48} 
                  className="text-blue-500" 
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(day.temperature)}°C</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {day.condition.replace('-', ' ')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('weather.precipitation')}: {day.precipitation}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
