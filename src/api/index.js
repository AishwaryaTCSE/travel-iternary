import apiClient from './apiClient';

// Import individual API modules
import auth from './auth';
import * as weather from './weatherApi';
import * as places from './placesApi';
import maps from './mapsApi';
import expense from './expenseApi';
import * as flights from './flightsApi';

// Re-export all API modules
export * from './auth';
export * from './weatherApi';
export * from './placesApi';
export * from './mapsApi';
export * from './expenseApi';
export * from './flightsApi';

// Unified API object
const api = {
  ...apiClient,
  auth,
  weather,
  places,
  maps,
  expense,
  flights
};

export default api;
