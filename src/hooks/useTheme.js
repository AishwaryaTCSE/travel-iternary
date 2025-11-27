// src/hooks/useTheme.js
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [isMounted, setIsMounted] = useState(false);

  // Set theme class on initial mount and when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Set the data-theme attribute for CSS variables
    root.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#1a202c' : '#ffffff'
      );
    }
    
    setIsMounted(true);
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // Set theme directly
  const setThemeMode = useCallback((newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  }, [setTheme]);

  // Check system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    };

    // Only run this if no theme is set in localStorage
    if (!localStorage.getItem('theme')) {
      mediaQuery.addEventListener('change', handleChange);
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setTheme: setThemeMode,
    isMounted,
  };
}