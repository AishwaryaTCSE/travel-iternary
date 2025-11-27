import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun, FiGlobe, FiSave, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const Settings = () => {
  const { tripId } = useParams();
  const { trips, updateTrip, deleteTrip } = useItinerary();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [tripData, setTripData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const trip = trips.find(t => t.id === tripId) || {};

  // Initialize form data when trip is loaded
  React.useEffect(() => {
    if (trip) {
      setTripData({
        destination: trip.destination || '',
        startDate: trip.startDate ? trip.startDate.split('T')[0] : '',
        endDate: trip.endDate ? trip.endDate.split('T')[0] : '',
        notes: trip.notes || ''
      });
    }
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tripData) return;
    
    updateTrip(tripId, {
      ...tripData,
      startDate: new Date(tripData.startDate).toISOString(),
      endDate: new Date(tripData.endDate).toISOString()
    });
  };

  const handleDeleteTrip = () => {
    if (window.confirm(t('settings.confirmDelete'))) {
      deleteTrip(tripId);
      // In a real app, you would navigate away after deletion
    }
    setShowDeleteConfirm(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  if (!trip || !tripData) {
    return <div className="p-6 text-center">{t('common.tripNotFound')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('settings.title')} - {trip.destination}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trip Settings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              {t('settings.tripSettings')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.destination')} *
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={tripData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.startDate')} *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={tripData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('settings.endDate')} *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={tripData.endDate}
                    onChange={handleChange}
                    min={tripData.startDate}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('settings.notes')}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={tripData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
              </div>
              
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <FiSave className="mr-2" />
                  {t('common.saveChanges')}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-red-200 dark:border-red-900/50">
            <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-100 dark:border-red-900/50">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center">
                <FiAlertTriangle className="mr-2" />
                {t('settings.dangerZone')}
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('settings.deleteTrip')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.deleteTripWarning')}
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  {t('settings.deleteTripButton')}
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p className="text-red-700 dark:text-red-300 mb-4">
                    {t('settings.confirmDelete')}
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteTrip}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      {t('common.delete')}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              {t('settings.appSettings')}
            </h2>
            
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {t('settings.theme')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.themeDescription')}
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label={theme === 'dark' ? t('settings.switchToLight') : t('settings.switchToDark')}
                >
                  {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
              </div>

              {/* Language Selector */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('settings.language')}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'es', name: 'Español' },
                    { code: 'fr', name: 'Français' },
                    { code: 'de', name: 'Deutsch' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-4 py-2 rounded-lg border ${
                        i18n.language.startsWith(lang.code)
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export/Import */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('settings.data')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const data = JSON.stringify(trip, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `trip-${trip.destination.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                  >
                    {t('settings.exportTrip')}
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, you would implement file import
                      alert(t('settings.importNotImplemented'));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                  >
                    {t('settings.importTrip')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('settings.about')}
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <p>
                {t('settings.appName')} v1.0.0
              </p>
              <p>
                {t('settings.copyright', { year: new Date().getFullYear() })}
              </p>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {t('settings.legal')}
                </h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(t('settings.comingSoon'));
                    }}
                  >
                    {t('settings.termsOfService')}
                  </a>
                  <a
                    href="#"
                    className="block text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(t('settings.comingSoon'));
                    }}
                  >
                    {t('settings.privacyPolicy')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;