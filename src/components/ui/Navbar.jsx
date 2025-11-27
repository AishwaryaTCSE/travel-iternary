// src/components/ui/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

const Navbar = ({ isDarkMode, toggleTheme, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/trips', label: t('nav.myTrips') },
    { to: '/destinations', label: t('nav.destinations') },
    { to: '/activities', label: t('nav.activities') },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm'
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                TravelPlanner
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === link.to
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                aria-label={isDarkMode ? t('actions.lightMode') : t('actions.darkMode')}
              >
                {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {/* Language Selector */}
              <Dropdown
                button={
                  <Button variant="ghost" size="sm" className="uppercase">
                    {i18n.language}
                  </Button>
                }
              >
                <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('hi')}>हिंदी</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('ta')}>தமிழ்</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('te')}>తెలుగు</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('kn')}>ಕನ್ನಡ</Dropdown.Item>
              </Dropdown>

              {/* User Dropdown */}
              {user ? (
                <Dropdown
                  button={
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        size="sm"
                        className="ring-2 ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user.name}
                      </span>
                    </button>
                  }
                >
                  <Dropdown.Item
                    icon={<FiUser className="mr-2 h-4 w-4" />}
                    onClick={() => (window.location.href = '/profile')}
                  >
                    {t('nav.profile')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    icon={<FiSettings className="mr-2 h-4 w-4" />}
                    onClick={() => (window.location.href = '/settings')}
                  >
                    {t('nav.settings')}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    icon={<FiLogOut className="mr-2 h-4 w-4" />}
                    onClick={onLogout}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    {t('nav.logout')}
                  </Dropdown.Item>
                </Dropdown>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = '/login')}
                  >
                    {t('auth.login')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => (window.location.href = '/signup')}
                  >
                    {t('auth.signup')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">{t('actions.openMenu')}</span>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.to
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {user ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="md"
                    className="ring-2 ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {t('auth.signup')}
                </Link>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-5">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('actions.theme')}
                </span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label={isDarkMode ? t('actions.lightMode') : t('actions.darkMode')}
                >
                  {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
              </div>
              <div className="mt-2 px-5">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('actions.language')}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={i18n.language === 'en' ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </Button>
                  <Button
                    variant={i18n.language === 'hi' ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => changeLanguage('hi')}
                  >
                    हिंदी
                  </Button>
                  <Button
                    variant={i18n.language === 'ta' ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => changeLanguage('ta')}
                  >
                    தமிழ்
                  </Button>
                  <Button
                    variant={i18n.language === 'te' ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => changeLanguage('te')}
                  >
                    తెలుగు
                  </Button>
                  <Button
                    variant={i18n.language === 'kn' ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => changeLanguage('kn')}
                  >
                    ಕನ್ನಡ
                  </Button>
                </div>
              </div>
              {user && (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;