import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">T</span>
                </div>
              </div>
              <h2 className="ml-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {t('app.name')}
              </h2>
            </div>
          </Link>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('auth.tagline')}
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <Link
              to={isAuthenticated ? '/' : '/auth/login'}
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={(e) => {
                if (isAuthenticated) {
                  e.preventDefault();
                  window.location.href = '/';
                }
              }}
            >
              <FiArrowLeft className="mr-1" />
              {t('common.backToHome')}
            </Link>
          </div>
          <Outlet />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;