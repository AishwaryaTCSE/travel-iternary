import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow } from 'react-icons/fi';
import { getCurrentWeather, getForecast } from '../../api/weatherApi';

const Weather = ({ destination, startDate, endDate }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (destination) {
      loadWeather();
    }
  }, [destination]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const current = await getCurrentWeather(destination);
      setWeatherData(current);
      
      if (startDate && endDate) {
        const forecast = await getForecast(destination, 5);
        setForecastData(forecast);
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || '';
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <FiCloudRain size={40} />;
    } else if (conditionLower.includes('cloud')) {
      return <FiCloud size={40} />;
    } else if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
      return <FiCloudSnow size={40} />;
    } else {
      return <FiSun size={40} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!weatherData) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Weather data not available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please enter a destination to view weather information.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Weather Forecast for {destination}
      </Typography>

      {/* Current Weather */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getWeatherIcon(weatherData.weather?.[0]?.main)}
              <Box>
                <Typography variant="h4">
                  {Math.round(weatherData.main?.temp)}°C
                </Typography>
                <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                  {weatherData.weather?.[0]?.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Feels Like</Typography>
                <Typography variant="body1">{Math.round(weatherData.main?.feels_like)}°C</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Humidity</Typography>
                <Typography variant="body1">{weatherData.main?.humidity}%</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Wind</Typography>
                <Typography variant="body1">{weatherData.wind?.speed} m/s</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" color="text.secondary">Pressure</Typography>
                <Typography variant="body1">{weatherData.main?.pressure} hPa</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Forecast */}
      {forecastData && forecastData.list && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            5-Day Forecast
          </Typography>
          <Grid container spacing={2}>
            {forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 5).map((item, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formatDate(item.dt_txt)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                      {getWeatherIcon(item.weather?.[0]?.main)}
                    </Box>
                    <Typography variant="h6" align="center">
                      {Math.round(item.main?.temp)}°C
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
                      {item.weather?.[0]?.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Weather;

