import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Chip,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  FiSearch, 
  FiMapPin, 
  FiDroplet,
  FiWind,
  FiSun,
  FiSunrise,
  FiSunset,
  FiCloud,
  FiCloudRain,
  FiCloudSnow,
  FiCloudLightning,
  FiCloudOff,
  FiNavigation
} from 'react-icons/fi';

// Sample weather data - in a real app, this would come from a weather API
const sampleWeatherData = {
  location: 'New York, NY',
  current: {
    temp: 72,
    feels_like: 74,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
    humidity: 65,
    wind_speed: 8,
    wind_deg: 180,
    sunrise: '06:45',
    sunset: '19:30',
    uv_index: 6,
    visibility: 10,
    pressure: 1012,
    last_updated: '2023-06-15T14:30:00Z'
  },
  forecast: [
    {
      date: '2023-06-16',
      day: 'Fri',
      temp_max: 78,
      temp_min: 65,
      condition: 'Sunny',
      icon: 'sunny',
      precipitation: 0,
      humidity: 50,
      wind_speed: 7
    },
    {
      date: '2023-06-17',
      day: 'Sat',
      temp_max: 82,
      temp_min: 68,
      condition: 'Partly Cloudy',
      icon: 'partly-cloudy',
      precipitation: 20,
      humidity: 55,
      wind_speed: 6
    },
    {
      date: '2023-06-18',
      day: 'Sun',
      temp_max: 75,
      temp_min: 62,
      condition: 'Rain',
      icon: 'rain',
      precipitation: 80,
      humidity: 85,
      wind_speed: 10
    },
    {
      date: '2023-06-19',
      day: 'Mon',
      temp_max: 70,
      temp_min: 60,
      condition: 'Cloudy',
      icon: 'cloudy',
      precipitation: 30,
      humidity: 75,
      wind_speed: 8
    },
    {
      date: '2023-06-20',
      day: 'Tue',
      temp_max: 85,
      temp_min: 70,
      condition: 'Sunny',
      icon: 'sunny',
      precipitation: 0,
      humidity: 45,
      wind_speed: 5
    }
  ]
};

// Weather icon mapping
const weatherIcons = {
  'sunny': <FiSun size={24} />,
  'partly-cloudy': <FiCloud size={24} />,
  'cloudy': <FiCloud size={24} />,
  'rain': <FiCloudRain size={24} />,
  'snow': <FiCloudSnow size={24} />,
  'thunderstorm': <FiCloudLightning size={24} />,
  'clear': <FiSun size={24} />,
  'mist': <FiCloudOff size={24} />
};

const Weather = () => {
  const { id } = useParams(); // Itinerary ID
  const theme = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const [unit, setUnit] = useState('f'); // 'f' for Fahrenheit, 'c' for Celsius
  
  // In a real app, you would fetch weather data from an API
  useEffect(() => {
    // Simulate API call
    const fetchWeatherData = () => {
      setLoading(true);
      // In a real app, you would make an API call here
      // For example: fetch(`/api/weather?location=${searchQuery || 'New York'}`)
      
      // Simulate API delay
      setTimeout(() => {
        setWeatherData(sampleWeatherData);
        setLoading(false);
      }, 1000);
    };
    
    fetchWeatherData();
  }, [searchQuery]);
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a new API call
      console.log('Searching for:', searchQuery);
    }
  };
  
  // Toggle temperature unit
  const toggleUnit = () => {
    setUnit(unit === 'f' ? 'c' : 'f');
  };
  
  // Convert temperature based on selected unit
  const convertTemp = (tempF) => {
    if (unit === 'c') {
      return Math.round((tempF - 32) * 5/9);
    }
    return Math.round(tempF);
  };
  
  // Get wind direction from degrees
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };
  
  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return weatherIcons.sunny;
    } else if (conditionLower.includes('partly')) {
      return weatherIcons['partly-cloudy'];
    } else if (conditionLower.includes('cloud')) {
      return weatherIcons.cloudy;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return weatherIcons.rain;
    } else if (conditionLower.includes('snow')) {
      return weatherIcons.snow;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return weatherIcons.thunderstorm;
    } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
      return weatherIcons.mist;
    }
    
    return weatherIcons.sunny; // Default
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" component="h1">Weather Forecast</Typography>
          
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Button 
              type="submit" 
              variant="contained"
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </Box>
          
          <Box>
            <Button 
              variant={unit === 'f' ? 'contained' : 'outlined'} 
              size="small" 
              onClick={toggleUnit}
              sx={{ minWidth: 40 }}
            >
              °F
            </Button>
            <Button 
              variant={unit === 'c' ? 'contained' : 'outlined'} 
              size="small" 
              onClick={toggleUnit}
              sx={{ minWidth: 40, ml: 1 }}
            >
              °C
            </Button>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : weatherData ? (
          <>
            {/* Current Weather Card */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FiMapPin /> {weatherData.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(weatherData.current.last_updated).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Updated at {new Date(weatherData.current.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Box sx={{ textAlign: 'center', mr: 4 }}>
                      <Box sx={{ fontSize: '4rem', lineHeight: 1, mb: 1 }}>
                        {getWeatherIcon(weatherData.current.condition.toLowerCase())}
                      </Box>
                      <Typography variant="h6">{weatherData.current.condition}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h2" component="div" sx={{ lineHeight: 1 }}>
                        {convertTemp(weatherData.current.temp)}°
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Feels like {convertTemp(weatherData.current.feels_like)}°
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FiDroplet style={{ marginRight: 8, color: theme.palette.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Humidity</Typography>
                          <Typography>{weatherData.current.humidity}%</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FiWind style={{ marginRight: 8, color: theme.palette.primary.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Wind</Typography>
                          <Typography>
                            {weatherData.current.wind_speed} mph {getWindDirection(weatherData.current.wind_deg)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FiSunrise style={{ marginRight: 8, color: theme.palette.warning.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Sunrise</Typography>
                          <Typography>{weatherData.current.sunrise}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FiSunset style={{ marginRight: 8, color: theme.palette.warning.dark }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Sunset</Typography>
                          <Typography>{weatherData.current.sunset}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FiNavigation style={{ marginRight: 8, color: theme.palette.info.main }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">UV Index</Typography>
                          <Typography>{weatherData.current.uv_index} of 10</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FiCloud style={{ marginRight: 8, color: theme.palette.grey[500] }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">Pressure</Typography>
                          <Typography>{weatherData.current.pressure} hPa</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Forecast Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Today" value="today" />
                <Tab label="5-Day Forecast" value="forecast" />
                <Tab label="Hourly" value="hourly" disabled />
                <Tab label="Radar" value="radar" disabled />
              </Tabs>
            </Box>
            
            {/* Forecast Content */}
            {activeTab === 'today' || activeTab === 'forecast' ? (
              <Grid container spacing={2}>
                {weatherData.forecast.map((day, index) => (
                  <Grid item xs={6} sm={4} md={2.4} key={day.date}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        ...(index === 0 && activeTab === 'today' ? {
                          borderColor: 'primary.main',
                          borderWidth: 2
                        } : {})
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {index === 0 ? 'Today' : day.day}
                        </Typography>
                        <Box sx={{ my: 1 }}>
                          {getWeatherIcon(day.condition.toLowerCase())}
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {day.condition}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {convertTemp(day.temp_max)}°
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            / {convertTemp(day.temp_min)}°
                          </Typography>
                        </Box>
                        {day.precipitation > 0 && (
                          <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                            {day.precipitation}% rain
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  {activeTab === 'hourly' 
                    ? 'Hourly forecast not available in demo' 
                    : 'Weather radar not available in demo'}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No weather data available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching for a different location
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Weather;
