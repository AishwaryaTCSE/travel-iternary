import React, { useState, useEffect } from 'react';
import { FiX, FiMapPin, FiClock, FiCalendar, FiDollarSign, FiLink, FiPhone, FiInfo } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const ACTIVITY_TYPES = [
  { value: 'sightseeing', label: 'Sightseeing', emoji: '🏛️' },
  { value: 'food', label: 'Food & Drink', emoji: '🍽️' },
  { value: 'hotel', label: 'Accommodation', emoji: '🏨' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'activity', label: 'Activity', emoji: '🎡' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'flight', label: 'Flight', emoji: '✈️' },
  { value: 'other', label: 'Other', emoji: '📍' },
];

const ActivityForm = ({ 
  initialData = {}, 
  onSave, 
  onCancel,
  onDelete,
  isEdit = false,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'other',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    duration: 60,
    notes: '',
    website: '',
    phone: '',
    cost: '',
    currency: 'USD',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = t('validation.required');
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = t('validation.invalidDuration');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Format the data before saving
      const dataToSave = {
        ...formData,
        duration: parseInt(formData.duration, 10),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        // Ensure time is in HH:MM format
        time: formData.time.includes(':') ? formData.time : `${formData.time}:00`
      };
      
      onSave(dataToSave);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEdit ? t('itinerary.editActivity') : t('itinerary.addActivity')}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('itinerary.activityTitle')} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                placeholder={t('itinerary.activityTitlePlaceholder')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('itinerary.activityType')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ACTIVITY_TYPES.map((type) => (
                    <label 
                      key={type.value}
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                        formData.type === type.value 
                          ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/30 dark:border-blue-700' 
                          : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-lg mr-1">{type.emoji}</span>
                      <span className="text-xs">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('itinerary.location')}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t('itinerary.locationPlaceholder')}
                  />
                </div>
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('common.date')}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('common.time')}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('itinerary.duration')} ({t('itinerary.minutes')})
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`block w-full rounded-md shadow-sm ${
                    errors.duration ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>
                )}
              </div>
              
              {/* Cost */}
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('itinerary.cost')}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    min="0"
                    step="0.01"
                    value={formData.cost || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 dark:text-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-r-md"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                      <option value="AUD">AUD</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('itinerary.website')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('itinerary.phone')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('itinerary.notes')}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <FiInfo className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder={t('itinerary.notesPlaceholder')}
                />
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                {isEdit && onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(initialData.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {t('common.delete')}
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('common.saving') : (isEdit ? t('common.saveChanges') : t('common.addActivity'))}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;