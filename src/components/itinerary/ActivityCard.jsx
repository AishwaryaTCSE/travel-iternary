import React from 'react';
import { FiMapPin, FiClock, FiCalendar, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ActivityCard = ({ 
  activity, 
  onEdit, 
  onDelete,
  onViewDetails,
  isEditable = true,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActivityTypeIcon = (type) => {
    const icons = {
      flight: '✈️',
      hotel: '🏨',
      food: '🍽️',
      sightseeing: '🏛️',
      activity: '🎡',
      transport: '🚗',
      shopping: '🛍️',
      other: '📍'
    };
    return icons[type?.toLowerCase()] || '📌';
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
              {getActivityTypeIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {activity.title}
              </h3>
              {activity.location && (
                <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <FiMapPin className="mr-1.5 flex-shrink-0" />
                  <span className="truncate">{activity.location}</span>
                </p>
              )}
              {(activity.date || activity.time) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {activity.date && (
                    <span className="flex items-center">
                      <FiCalendar className="mr-1.5 flex-shrink-0" />
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  )}
                  {activity.time && (
                    <span className="flex items-center">
                      <FiClock className="mr-1.5 flex-shrink-0" />
                      {formatTime(activity.time)}
                    </span>
                  )}
                </div>
              )}
              {activity.duration && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {t('itinerary.duration')}: {activity.duration} {t('itinerary.minutes')}
                </p>
              )}
            </div>
          </div>
          
          {isEditable && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(activity)}
                className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                title={t('common.edit')}
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(activity.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title={t('common.delete')}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          )}
        </div>
        
        {activity.notes && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            <p className="whitespace-pre-line">{activity.notes}</p>
          </div>
        )}
        
        {(activity.website || activity.phone || activity.cost) && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 text-sm">
              {activity.website && (
                <a 
                  href={activity.website.startsWith('http') ? activity.website : `https://${activity.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FiExternalLink className="mr-1.5" size={14} />
                  {t('itinerary.website')}
                </a>
              )}
              
              {activity.phone && (
                <a 
                  href={`tel:${activity.phone}`}
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <span className="mr-1.5">📞</span>
                  {activity.phone}
                </a>
              )}
              
              {activity.cost && (
                <span className="inline-flex items-center text-gray-600 dark:text-gray-300">
                  <span className="mr-1.5">💲</span>
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: activity.currency || 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(activity.cost)}
                </span>
              )}
            </div>
          </div>
        )}
        
        {onViewDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onViewDetails(activity)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('common.viewDetails')} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;