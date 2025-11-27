import React from 'react';
import { FiClock, FiMapPin, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import ActivityCard from './ActivityCard';
import { format, parseISO, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns';

const DayItinerary = ({ 
  date, 
  activities = [], 
  onAddActivity, 
  onEditActivity, 
  onDeleteActivity,
  onViewActivity,
  isExpanded = true,
  onToggleExpand
}) => {
  const { t, i18n } = useTranslation();
  
  const formatDayLabel = (dateString) => {
    const dateObj = new Date(dateString);
    
    if (isToday(dateObj)) {
      return t('common.today');
    } else if (isTomorrow(dateObj)) {
      return t('common.tomorrow');
    } else if (isYesterday(dateObj)) {
      return t('common.yesterday');
    } else {
      return format(dateObj, 'EEEE, MMMM d', { locale: i18n.language });
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    // Sort by time if available, otherwise by title
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    return (a.title || '').localeCompare(b.title || '');
  });

  const hasActivities = sortedActivities.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div 
        className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
          hasActivities ? 'bg-gray-50 dark:bg-gray-800/50' : ''
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {formatDayLabel(date)}
            </h3>
            {hasActivities && (
              <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {sortedActivities.length} {t('itinerary.activities', { count: sortedActivities.length })}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActivities && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {isExpanded ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddActivity(date);
              }}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-1" size={14} />
              {t('itinerary.addActivity')}
            </button>
          </div>
        </div>
        
        {!hasActivities && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t('itinerary.noActivitiesForDay')}
          </p>
        )}
      </div>
      
      {isExpanded && hasActivities && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedActivities.map((activity, index) => (
            <div 
              key={activity.id || index} 
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <ActivityCard
                activity={activity}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
                onViewDetails={onViewActivity}
                className="shadow-none border-0 p-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayItinerary;