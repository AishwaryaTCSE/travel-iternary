import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.travel-planner.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Something happened in setting up the request
      return Promise.reject({ message: error.message });
    }
  }
);

export default {
  // Auth endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (userData) => apiClient.put('/auth/me', userData),

  // Trips
  getTrips: () => apiClient.get('/trips'),
  getTrip: (id) => apiClient.get(`/trips/${id}`),
  createTrip: (tripData) => apiClient.post('/trips', tripData),
  updateTrip: (id, tripData) => apiClient.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => apiClient.delete(`/trips/${id}`),

  // Activities
  getActivities: (tripId) => apiClient.get(`/trips/${tripId}/activities`),
  addActivity: (tripId, activity) => apiClient.post(`/trips/${tripId}/activities`, activity),
  updateActivity: (tripId, activityId, activity) => 
    apiClient.put(`/trips/${tripId}/activities/${activityId}`, activity),
  deleteActivity: (tripId, activityId) => 
    apiClient.delete(`/trips/${tripId}/activities/${activityId}`),

  // Expenses
  getExpenses: (tripId) => apiClient.get(`/trips/${tripId}/expenses`),
  addExpense: (tripId, expense) => apiClient.post(`/trips/${tripId}/expenses`, expense),
  updateExpense: (tripId, expenseId, expense) => 
    apiClient.put(`/trips/${tripId}/expenses/${expenseId}`, expense),
  deleteExpense: (tripId, expenseId) => 
    apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`),

  // Documents
  uploadDocument: (tripId, formData) => 
    apiClient.post(`/trips/${tripId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getDocuments: (tripId) => apiClient.get(`/trips/${tripId}/documents`),
  deleteDocument: (tripId, docId) => 
    apiClient.delete(`/trips/${tripId}/documents/${docId}`),

  // External APIs
  getWeather: (location, date) => 
    apiClient.get('/external/weather', { params: { location, date } }),
  getPlaces: (query, location) => 
    apiClient.get('/external/places', { params: { query, location } }),
  getExchangeRates: () => apiClient.get('/external/exchange-rates'),
};