import React from 'react';
import useWeather from '../../hooks/useWeather';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiDayCloudy } from 'react-icons/wi';
import { useTranslation } from 'react-i18next';

const WeatherIcon = ({ condition, size = 24 }) => {
  const iconMap = {
    'sunny': <WiDaySunny size={size} />,
    'partly-cloudy': <WiDayCloudy size={size} />,
    'cloudy': <WiCloudy size={size} />,
    'rainy': <WiRain size={size} />,
    'thunderstorm': <WiThunderstorm size={size} />,
    'snowy': <WiSnow size={size} />,
  };

  return iconMap[condition] || <WiDaySunny size={size} />;
};

const WeatherCard = ({ date, location, className = '' }) => {
  const { t } = useTranslation();
  const { weather, forecast, loading, error, getWeatherForDate } = useWeather();
  
  const displayWeather = date ? getWeatherForDate(date) : weather;
  
  if (loading) {
    return (
      <div className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !displayWeather) {
    return (
      <div className={`p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ${className}`}>
        {t('weather.error')}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-white dark:bg-gray-800 shadow ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {date ? new Date(date).toLocaleDateString() : t('weather.current')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {location || displayWeather.location}
          </p>
        </div>
        <div className="text-4xl">
          <WeatherIcon condition={displayWeather.condition} size={40} />
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="text-4xl font-bold">
          {Math.round(displayWeather.temperature)}°C
        </div>
        <div className="text-right">
          <div className="capitalize">{displayWeather.condition.replace('-', ' ')}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('weather.humidity')}: {displayWeather.humidity}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('weather.wind')}: {displayWeather.windSpeed} km/h
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
