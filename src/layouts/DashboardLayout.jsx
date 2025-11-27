import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FiHome, 
  FiCalendar, 
  FiMap, 
  FiDollarSign, 
  FiSun, 
  FiPackage, 
  FiCompass, 
  FiFileText, 
  FiStar, 
  FiSettings,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useItinerary } from '../context/ItineraryContext';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { trips } = useItinerary();
  const { tripId } = useParams();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({});

  const currentTrip = trips.find(trip => trip.id === tripId);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      icon: <FiHome size={20} />,
      label: t('nav.overview'),
      to: `/trip/${tripId}`,
      exact: true
    },
    {
      icon: <FiCalendar size={20} />,
      label: t('nav.itinerary'),
      to: `/trip/${tripId}/itinerary`
    },
    {
      icon: <FiMap size={20} />,
      label: t('nav.map'),
      to: `/trip/${tripId}/map`
    },
    {
      icon: <FiDollarSign size={20} />,
      label: t('nav.expenses'),
      to: `/trip/${tripId}/expenses`
    },
    {
      icon: <FiSun size={20} />,
      label: t('nav.weather'),
      to: `/trip/${tripId}/weather`
    },
    {
      icon: <FiPackage size={20} />,
      label: t('nav.packing'),
      to: `/trip/${tripId}/packing`
    },
    {
      icon: <FiCompass size={20} />,
      label: t('nav.recommendations'),
      to: `/trip/${tripId}/recommendations`
    },
    {
      icon: <FiFileText size={20} />,
      label: t('nav.documents'),
      to: `/trip/${tripId}/documents`
    },
    {
      icon: <FiStar size={20} />,
      label: t('nav.reviews'),
      to: `/trip/${tripId}/reviews`
    },
    {
      icon: <FiSettings size={20} />,
      label: t('nav.settings'),
      to: `/trip/${tripId}/settings`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Mobile menu button */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentTrip?.destination || t('app.name')}
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out md:static md:transform-none`}
      >
        <div className="h-full flex flex-col">
          {/* Logo/Brand */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 hidden md:block">
            <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {t('app.name')}
            </Link>
          </div>

          {/* Current Trip Info */}
          {currentTrip && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-medium">
                    {currentTrip.destination.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentTrip.destination}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {new Date(currentTrip.startDate).toLocaleDateString()} -{' '}
                    {new Date(currentTrip.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-2 space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive(item.to)
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="mr-3">
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </span>
              {theme === 'dark' ? t('theme.lightMode') : t('theme.darkMode')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden md:block">
                  {currentTrip?.destination || t('app.name')}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Add any top-right navigation items here */}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;