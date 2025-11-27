import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const PublicLayout = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
              <nav className="hidden md:flex space-x-8">
                <Link
                  to="/features"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  {t('nav.features')}
                </Link>
                <Link
                  to="/pricing"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  {t('nav.pricing')}
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  {t('nav.about')}
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  {t('nav.contact')}
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 text-sm font-medium"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('auth.signUp')}
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
                >
                  {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('app.name')}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                {t('footer.tagline')}
              </p>
              <div className="flex space-x-6">
                {/* Add social media links here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                    {t('footer.solutions')}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link
                        to="/solutions/travelers"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.forTravelers')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/solutions/agencies"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.forAgencies')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/solutions/teams"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.forTeams')}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                    {t('footer.support')}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link
                        to="/help"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.helpCenter')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.blog')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('nav.contact')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                    {t('footer.company')}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link
                        to="/about"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('nav.about')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/careers"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.careers')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/press"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.press')}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 tracking-wider uppercase">
                    {t('footer.legal')}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link
                        to="/privacy"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.privacy')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/terms"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.terms')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cookies"
                        className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {t('footer.cookies')}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-base text-gray-400 dark:text-gray-500 text-center">
              &copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;