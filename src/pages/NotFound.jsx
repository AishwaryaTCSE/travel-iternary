import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('notFound.title', 'Page Not Found')}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          {t('notFound.message', 'The page you are looking for does not exist or has been moved.')}
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiHome className="mr-2" />
            {t('notFound.goHome', 'Go to Home')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2" />
            {t('notFound.goBack', 'Go Back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;