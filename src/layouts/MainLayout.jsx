import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiPlusCircle, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {t('app.name')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/')
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/create-trip"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/create-trip')
                      ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('nav.createTrip')}
                </Link>
              </nav>
              <div className="flex items-center">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;