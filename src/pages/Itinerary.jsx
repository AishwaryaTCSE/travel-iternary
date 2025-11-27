import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiTrash2, FiEdit2, FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';
import { format, parseISO, addDays } from 'date-fns';

const Itinerary = () => {
  const { tripId } = useParams();
  const { trips, updateTrip } = useItinerary();
  const { t } = useTranslation();
  const [newActivity, setNewActivity] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const trip = trips.find(t => t.id === tripId);
  const days = trip?.days || [];

  const addDay = () => {
    if (!trip) return;
    
    const newDay = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      activities: []
    };
    
    updateTrip(tripId, {
      days: [...days, newDay]
    });
  };

  const addActivity = (dayId) => {
    if (!newActivity.trim() || !trip) return;
    
    const activity = {
      id: Date.now().toString(),
      text: newActivity.trim(),
      time: '09:00',
      location: '',
      notes: ''
    };
    
    updateTrip(tripId, {
      days: days.map(day => 
        day.id === dayId 
          ? { ...day, activities: [...day.activities, activity] }
          : day
      )
    });
    
    setNewActivity('');
  };

  const updateActivity = (dayId, activityId, updates) => {
    updateTrip(tripId, {
      days: days.map(day => {
        if (day.id !== dayId) return day;
        
        return {
          ...day,
          activities: day.activities.map(activity => 
            activity.id === activityId 
              ? { ...activity, ...updates }
              : activity
          )
        };
      })
    });
  };

  const deleteActivity = (dayId, activityId) => {
    updateTrip(tripId, {
      days: days.map(day => {
        if (day.id !== dayId) return day;
        
        return {
          ...day,
          activities: day.activities.filter(a => a.id !== activityId)
        };
      })
    });
  };

  const startEditing = (activity) => {
    setEditingId(activity.id);
    setEditText(activity.text);
  };

  const saveEdit = (dayId, activityId) => {
    updateActivity(dayId, activityId, { text: editText });
    setEditingId(null);
  };

  if (!trip) {
    return <div className="p-6 text-center">{t('itinerary.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {trip.destination} {t('itinerary.itinerary')}
        </h1>
        <button
          onClick={addDay}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          {t('itinerary.addDay')}
        </button>
      </div>

      {days.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
          <p className="text-gray-500 dark:text-gray-400">
            {t('itinerary.noDays')}
          </p>
          <button
            onClick={addDay}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('itinerary.addYourFirstDay')}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {days.map((day, dayIndex) => {
            const dayDate = parseISO(day.date);
            const displayDate = format(
              isNaN(dayDate.getTime()) 
                ? addDays(new Date(trip.startDate), dayIndex)
                : dayDate,
              'EEEE, MMMM d, yyyy'
            );

            return (
              <div key={day.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <h2 className="text-xl font-semibold">
                    {t('itinerary.day')} {dayIndex + 1}: {displayDate}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <div className="flex-1">
                          {editingId === activity.id ? (
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-3 py-1 border rounded"
                              />
                              <button
                                onClick={() => saveEdit(day.id, activity.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                              >
                                {t('common.save')}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded"
                              >
                                {t('common.cancel')}
                              </button>
                            </div>
                          ) : (
                            <h3 className="font-medium">{activity.text}</h3>
                          )}
                          
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <FiClock className="mr-1" />
                              <span>{activity.time}</span>
                            </div>
                            {activity.location && (
                              <div className="flex items-center">
                                <FiMapPin className="mr-1" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                          
                          {activity.notes && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEditing(activity)}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteActivity(day.id, activity.id)}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex">
                    <input
                      type="text"
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addActivity(day.id)}
                      placeholder={t('itinerary.addActivityPlaceholder')}
                      className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button
                      onClick={() => addActivity(day.id)}
                      className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <FiPlus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Itinerary;