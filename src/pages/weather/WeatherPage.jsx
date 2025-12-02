import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import { getWeatherForecast } from '../../services/weather';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Button
} from '@mui/material';
import { FiArrowLeft, FiSun, FiCloud, FiCloudRain, FiCloudSnow } from 'react-icons/fi';

const WeatherPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, currentTrip } = useItinerary();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setIsLoading(true);
        const activeTripId = tripId || currentTrip?.id;
        
        if (!activeTripId) {
          setError('No trip selected');
          return;
        }

        // Try to get trip data from session storage first
        const tripData = JSON.parse(sessionStorage.getItem(`trip_${activeTripId}`));
        
        if (!tripData) {
          setError('Trip data not found');
          return;
        }

        // If weather data is already in trip data, use it
        if (tripData.weather) {
          setWeatherData(tripData.weather);
          return;
        }

        // Otherwise, fetch fresh weather data
        const weather = await getWeatherForecast(
          tripData.destination, 
          tripData.startDate, 
          tripData.endDate
        );
        
        setWeatherData(weather);
        
        // Update trip data in session storage with fresh weather data
        const updatedTrip = { ...tripData, weather };
        sessionStorage.setItem(`trip_${activeTripId}`, JSON.stringify(updatedTrip));
        
      } catch (err) {
        console.error('Error loading weather data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();
  }, [tripId, currentTrip]);

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!tripId && !currentTrip?.id) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No trip selected
          </Typography>
          <Typography variant="body1" paragraph>
            Please select a trip to view its weather forecast.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/itinerary')}
            startIcon={<FiArrowLeft />}
          >
            Back to Itineraries
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!weatherData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Weather data not available
          </Typography>
          <Typography variant="body1" paragraph>
            We couldn't fetch weather data for this location.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Weather Forecast for {weatherData.location}
        </Typography>
        
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {formatDate(weatherData.startDate)} - {formatDate(weatherData.endDate)}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        {weatherData.forecast && weatherData.forecast.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              Daily Forecast
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {weatherData.forecast.map((day, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box sx={{ mr: 2 }}>
                          {getWeatherIcon(day.condition)}
                        </Box>
                        <Box>
                          <Typography variant="h6">
                            {formatDate(day.date)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {day.condition}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <Box>
                          <Typography variant="h5">
                            {Math.round(day.temp_max)}°{weatherData.unit === 'metric' ? 'C' : 'F'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            High
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="h5" color="textSecondary">
                            {Math.round(day.temp_min)}°{weatherData.unit === 'metric' ? 'C' : 'F'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" align="right">
                            Low
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box mt={2}>
                        <Typography variant="body2">
                          <strong>Humidity:</strong> {day.humidity}%
                        </Typography>
                        <Typography variant="body2">
                          <strong>Wind:</strong> {day.wind_speed} {weatherData.unit === 'metric' ? 'm/s' : 'mph'} {day.wind_direction}
                        </Typography>
                        {day.precipitation > 0 && (
                          <Typography variant="body2">
                            <strong>Precipitation:</strong> {day.precipitation}mm
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {weatherData.recommendations && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Travel Tips
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {weatherData.recommendations.map((tip, i) => (
                      <li key={i} style={{ marginBottom: 8 }}>
                        <Typography variant="body1">{tip}</Typography>
                      </li>
                    ))}
                  </ul>
                </Paper>
              </Box>
            )}
          </>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No weather forecast data available for the selected dates.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default WeatherPage;
