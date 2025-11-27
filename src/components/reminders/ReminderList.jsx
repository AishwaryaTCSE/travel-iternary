// src/components/reminders/ReminderList.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiArrowUp, 
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

const ReminderList = ({ reminders, onEdit, onDelete, onToggleComplete }) => {
  const { t } = useTranslation();

  const getDueDateText = (dueDate) => {
    const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    if (isToday(date)) return t('reminders.today');
    if (isTomorrow(date)) return t('reminders.tomorrow');
    if (isPast(date)) return format(date, 'MMM d, yyyy') + ' (' + t('reminders.overdue') + ')';
    return format(date, 'MMM d, yyyy');
  };

  if (reminders.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          {t('reminders.noReminders')}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('reminders.getStarted')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {reminders.map((reminder) => (
          <li key={reminder.id} className={reminder.completed ? 'bg-gray-50 dark:bg-gray-700/50' : ''}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => onToggleComplete(reminder.id)}
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      reminder.completed 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : 'border-2 border-gray-300 dark:border-gray-500'
                    }`}
                  >
                    {reminder.completed && <FiCheckCircle className="h-4 w-4" />}
                  </button>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      reminder.completed 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {reminder.title}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <FiClock className="mr-1" size={12} />
                      <span>{getDueDateText(reminder.dueDate)}</span>
                      {reminder.priority && reminder.priority !== 'none' && (
                        <span className="ml-3 flex items-center">
                          {priorityIcons[reminder.priority]}
                          <span className="ml-1 capitalize">{reminder.priority}</span>
                        </span>
                      )}
                      {reminder.category && (
                        <span className="ml-3 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          {reminder.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(reminder)}
                    className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(reminder.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              {reminder.notes && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {reminder.notes}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;