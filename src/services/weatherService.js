import { kelvinToCelsius, getWeatherIcon } from '../utils/weatherUtils';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather for a location
export const getCurrentWeather = async (location) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Weather data not available');
    }

    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

// Get weather forecast
export const getForecast = async (location, days = 5) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Forecast data not available');
    }

    const data = await response.json();
    const forecast = data.list
      .filter((_, index) => index % (Math.ceil(data.list.length / days)) === 0)
      .map(item => formatWeatherData(item));

    return {
      city: data.city.name,
      country: data.city.country,
      forecast
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Format weather data
const formatWeatherData = (data) => {
  return {
    date: new Date(data.dt * 1000),
    temp: Math.round(kelvinToCelsius(data.main.temp)),
    feels_like: Math.round(kelvinToCelsius(data.main.feels_like)),
    humidity: data.main.humidity,
    wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    description: data.weather[0].description,
    icon: getWeatherIcon(data.weather[0].icon),
    main: data.weather[0].main
  };
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};