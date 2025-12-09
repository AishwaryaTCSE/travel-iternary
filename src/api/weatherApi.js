import axios from 'axios';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
  baseURL: WEATHER_BASE_URL,
  params: {
    appid: WEATHER_API_KEY,
    units: 'metric', // Use metric units (Celsius)
  },
});

export const getCurrentWeather = async (location) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: {
        q: location,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getForecast = async (location, days = 5) => {
  try {
    const response = await weatherApi.get('/forecast', {
      params: {
        q: location,
        cnt: days * 8, // 3-hour intervals, so 8 per day
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await weatherApi.get('/weather', {
      params: {
        lat,
        lon,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};
