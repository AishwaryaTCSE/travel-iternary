import { useState, useEffect, useCallback } from 'react';
import { useItinerary } from '../context/ItineraryContext';

// Mock weather data generator
const generateMockWeather = (date, location) => {
  const weatherTypes = ['sunny', 'partly-cloudy', 'cloudy', 'rainy', 'thunderstorm', 'snowy'];
  const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  // Generate temperature based on weather type and season
  const getTemp = (type) => {
    const baseTemps = {
      'sunny': 28,
      'partly-cloudy': 24,
      'cloudy': 20,
      'rainy': 18,
      'thunderstorm': 16,
      'snowy': -2
    };
    
    // Add some randomness
    return baseTemps[type] + Math.floor(Math.random() * 8) - 4;
  };

  return {
    date: date || new Date().toISOString(),
    location: location || 'Unknown',
    temperature: getTemp(randomType),
    condition: randomType,
    humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
    windSpeed: (Math.random() * 15).toFixed(1), // 0-15 km/h
    icon: `wi-${randomType}`,
    forecast: Array(5).fill().map((_, i) => ({
      date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString(),
      high: getTemp(randomType) + 3,
      low: getTemp(randomType) - 3,
      condition: weatherTypes[Math.floor(Math.random() * weatherTypes.length)],
      precipitation: Math.floor(Math.random() * 30) // 0-30% chance
    }))
  };
};

const useWeather = () => {
  const { currentTrip } = useItinerary();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState([]);

  // Fetch weather for a specific location and date range
  const fetchWeather = useCallback(async (location, startDate, endDate) => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to a weather service
      // For demo purposes, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Generate mock weather data for the trip duration
      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date(start);
      end.setDate(end.getDate() + 7); // Default to 7 days if no end date
      
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const forecastData = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        forecastData.push(generateMockWeather(date.toISOString(), location));
      }
      
      setWeatherData(forecastData[0]); // Current day's weather
      setForecast(forecastData);
      return forecastData;
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch weather when currentTrip changes
  useEffect(() => {
    if (currentTrip?.destination) {
      fetchWeather(
        currentTrip.destination,
        currentTrip.startDate,
        currentTrip.endDate
      );
    }
  }, [currentTrip, fetchWeather]);

  // Get weather for a specific date
  const getWeatherForDate = useCallback((date) => {
    if (!forecast.length) return null;
    
    const targetDate = new Date(date).toDateString();
    return forecast.find(day => 
      new Date(day.date).toDateString() === targetDate
    ) || forecast[0];
  }, [forecast]);

  // Get weather icon class based on condition
  const getWeatherIcon = (condition) => {
    const icons = {
      'sunny': 'wi-day-sunny',
      'partly-cloudy': 'wi-day-cloudy',
      'cloudy': 'wi-cloudy',
      'rainy': 'wi-rain',
      'thunderstorm': 'wi-thunderstorm',
      'snowy': 'wi-snow'
    };
    return icons[condition] || 'wi-day-sunny';
  };

  // Get weather suggestions based on forecast
  const getPackingSuggestions = useCallback(() => {
    if (!forecast.length) return [];
    
    const suggestions = [];
    const conditions = new Set(forecast.map(day => day.condition));
    const avgTemp = forecast.reduce((sum, day) => sum + day.temperature, 0) / forecast.length;
    
    // Clothing suggestions
    if (avgTemp < 10) {
      suggestions.push('Warm jacket', 'Thermal wear', 'Gloves', 'Scarf', 'Beanie');
    } else if (avgTemp < 20) {
      suggestions.push('Light jacket', 'Sweater', 'Jeans');
    } else {
      suggestions.push('T-shirts', 'Shorts', 'Sunglasses', 'Sunscreen');
    }
    
    // Weather-specific items
    if (conditions.has('rainy') || conditions.has('thunderstorm')) {
      suggestions.push('Umbrella', 'Waterproof shoes', 'Raincoat');
    }
    
    if (conditions.has('snowy')) {
      suggestions.push('Snow boots', 'Thermal socks', 'Winter gloves');
    }
    
    // General travel essentials
    suggestions.push(
      'Passport/ID',
      'Travel adapter',
      'Medications',
      'Toiletries',
      'Phone charger',
      'Headphones'
    );
    
    return [...new Set(suggestions)]; // Remove duplicates
  }, [forecast]);

  return {
    weather: weatherData,
    forecast,
    loading,
    error,
    getWeatherForDate,
    getWeatherIcon,
    getPackingSuggestions,
    refresh: () => currentTrip?.destination && fetchWeather(
      currentTrip.destination,
      currentTrip.startDate,
      currentTrip.endDate
    )
  };
};

export default useWeather;