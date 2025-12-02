export const getEnv = () => {
  const v = import.meta.env || {};
  return {
    appName: v.VITE_APP_NAME,
    appVersion: v.VITE_APP_VERSION,
    appEnv: v.VITE_APP_ENV,
    apiUrl: v.VITE_API_URL,

    defaultLanguage: v.VITE_DEFAULT_LANGUAGE || 'en',
    defaultTheme: v.VITE_DEFAULT_THEME || 'light',

    googleMapsApiKey: v.VITE_GOOGLE_MAPS_API_KEY || v.REACT_APP_GOOGLE_MAPS_API_KEY,
    googlePlacesApiKey: v.VITE_GOOGLE_PLACES_API_KEY || v.REACT_APP_TRAVEL_ADVISOR_API_KEY,
    mapboxToken: v.VITE_MAPBOX_ACCESS_TOKEN,

    weatherApiKey: v.VITE_WEATHER_API_KEY || v.REACT_APP_OPENWEATHERMAP_API_KEY,
    weatherBaseUrl: v.VITE_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',

    foursquareApiKey: v.VITE_FOURSQUARE_API_KEY,
    foursquareBaseUrl: v.VITE_FOURSQUARE_BASE_URL || 'https://api.foursquare.com/v3/places',

    countryApiUrl: v.VITE_COUNTRY_API_URL || 'https://restcountries.com/v3.1'
  };
};

export const env = getEnv();

export const hasEnv = (key) => {
  const e = env[key];
  return typeof e === 'string' ? e.trim().length > 0 : !!e;
};

