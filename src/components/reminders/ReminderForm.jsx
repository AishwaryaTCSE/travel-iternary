// src/components/reminders/ReminderForm.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX, FiCalendar, FiClock as FiTime } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReminderForm = ({ reminder, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    dueDate: new Date(),
    dueTime: '',
    priority: 'medium',
    category: '',
    completed: false
  });

  useEffect(() => {
    if (reminder) {
      const dueDate = reminder.dueDate ? new Date(reminder.dueDate) : new Date();
      setFormData({
        title: reminder.title || '',
        notes: reminder.notes || '',
        dueDate: dueDate,
        dueTime: reminder.dueTime || '',
        priority: reminder.priority || 'medium',
        category: reminder.category || '',
        completed: reminder.completed || false
      });
    }
  }, [reminder]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reminderData = {
      ...formData,
      dueDate: formData.dueDate.toISOString()
    };
    onSave(reminderData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {reminder ? t('reminders.editReminder') : t('reminders.newReminder')}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <FiX size={24} />
        </button>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('reminders.title')} *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('reminders.dueDate')}
          </label>
          <div className="relative">
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => setFormData({...formData, dueDate: date})}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-10"
            />
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('reminders.time')}
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiTime className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="time"
              name="dueTime"
              id="dueTime"
              value={formData.dueTime}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('reminders.priority')}
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="high">{t('reminders.priorityHigh')}</option>
            <option value="medium">{t('reminders.priorityMedium')}</option>
            <option value="low">{t('reminders.priorityLow')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('reminders.category')}
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{t('reminders.selectCategory')}</option>
            <option value="booking">{t('reminders.categoryBooking')}</option>
            <option value="packing">{t('reminders.categoryPacking')}</option>
            <option value="transport">{t('reminders.categoryTransport')}</option>
            <option value="activity">{t('reminders.categoryActivity')}</option>
            <option value="other">{t('reminders.categoryOther')}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('reminders.notes')}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {reminder ? t('common.saveChanges') : t('common.addReminder')}
        </button>
      </div>
    </form>
  );
};

export default ReminderForm;