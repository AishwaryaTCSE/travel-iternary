// src/components/reminders/ReminderCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiArrowDown,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

const priorityIcons = {
  high: <FiAlertTriangle className="text-red-500" />,
  medium: <FiAlertCircle className="text-yellow-500" />,
  low: <FiArrowDown className="text-green-500" />
};

const ReminderCard = ({ 
  reminder, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  const { t } = useTranslation();

  const getDueDateText = (dueDate) => {
    if (!dueDate) return t('reminders.noDueDate');
    const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    if (isToday(date)) return t('reminders.today');
    if (isTomorrow(date)) return t('reminders.tomorrow');
    if (isPast(date)) return `${format(date, 'MMM d, yyyy')} (${t('reminders.overdue')})`;
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${
      reminder.priority === 'high' ? 'border-red-500' : 
      reminder.priority === 'medium' ? 'border-yellow-500' : 
      'border-green-500'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <button
                onClick={() => onToggleComplete(reminder.id)}
                className={`h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                  reminder.completed 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                    : 'border-2 border-gray-300 dark:border-gray-500'
                }`}
                aria-label={reminder.completed ? t('reminders.markIncomplete') : t('reminders.markComplete')}
              >
                {reminder.completed && <FiCheckCircle className="h-4 w-4" />}
              </button>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  reminder.completed 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {reminder.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <FiClock className="mr-1" size={12} />
                    <span>{getDueDateText(reminder.dueDate)}</span>
                  </div>
                  {reminder.priority && reminder.priority !== 'none' && (
                    <div className="flex items-center mr-4">
                      {priorityIcons[reminder.priority]}
                      <span className="ml-1 capitalize">{reminder.priority}</span>
                    </div>
                  )}
                  {reminder.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                      {reminder.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {reminder.notes && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {reminder.notes}
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex space-x-2">
            <button
              onClick={() => onEdit(reminder)}
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label={t('common.edit')}
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(reminder.id)}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              aria-label={t('common.delete')}
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;