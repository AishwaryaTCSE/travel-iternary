import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';

const CreateTrip = () => {
  const { t } = useTranslation();
  const { createTrip } = useItinerary();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTrip = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    createTrip(newTrip);
    navigate(`/trip/${newTrip.id}/itinerary`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{t('createTrip.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('createTrip.destination')} *
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            required
            value={formData.destination}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder={t('createTrip.destinationPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('createTrip.startDate')} *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('createTrip.endDate')} *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('createTrip.notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder={t('createTrip.notesPlaceholder')}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('createTrip.createButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrip;