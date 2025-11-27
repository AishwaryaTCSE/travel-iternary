import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '../utils/storageUtils';

const STORAGE_KEYS = {
  AUTH: 'travel_planner_auth',
  THEME: 'travel_planner_theme',
  LANGUAGE: 'travel_planner_language',
  RECENT_TRIPS: 'travel_planner_recent_trips',
};

// Auth
export const getAuthToken = () => getFromLocalStorage(STORAGE_KEYS.AUTH)?.token;
export const setAuthData = (authData) => saveToLocalStorage(STORAGE_KEYS.AUTH, authData);
export const clearAuthData = () => removeFromLocalStorage(STORAGE_KEYS.AUTH);

// Theme
export const getThemePreference = () => getFromLocalStorage(STORAGE_KEYS.THEME) || 'light';
export const setThemePreference = (theme) => saveToLocalStorage(STORAGE_KEYS.THEME, theme);

// Language
export const getLanguagePreference = () => getFromLocalStorage(STORAGE_KEYS.LANGUAGE) || 'en';
export const setLanguagePreference = (language) => 
  saveToLocalStorage(STORAGE_KEYS.LANGUAGE, language);

// Recent Trips
export const getRecentTrips = () => getFromLocalStorage(STORAGE_KEYS.RECENT_TRIPS) || [];
export const addRecentTrip = (trip) => {
  const recentTrips = getRecentTrips();
  // Remove if already exists
  const updatedTrips = recentTrips.filter(t => t.id !== trip.id);
  // Add to the beginning
  updatedTrips.unshift(trip);
  // Keep only last 5 trips
  saveToLocalStorage(STORAGE_KEYS.RECENT_TRIPS, updatedTrips.slice(0, 5));
};

// Clear all app data
export const clearAppData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromLocalStorage(key);
  });
};