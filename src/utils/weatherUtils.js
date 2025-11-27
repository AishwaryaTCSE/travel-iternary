// Map OpenWeatherMap icon codes to weather conditions
export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': 'sun',          // clear sky (day)
    '01n': 'moon',         // clear sky (night)
    '02d': 'cloud-sun',    // few clouds (day)
    '02n': 'cloud-moon',   // few clouds (night)
    '03d': 'cloud',        // scattered clouds
    '03n': 'cloud',
    '04d': 'clouds',       // broken clouds
    '04n': 'clouds',
    '09d': 'cloud-rain',   // shower rain
    '09n': 'cloud-rain',
    '10d': 'cloud-sun-rain', // rain (day)
    '10n': 'cloud-moon-rain',// rain (night)
    '11d': 'bolt',         // thunderstorm
    '11n': 'bolt',
    '13d': 'snowflake',    // snow
    '13n': 'snowflake',
    '50d': 'smog',         // mist/fog
    '50n': 'smog'
  };

  return iconMap[iconCode] || 'question';
};

// Convert Kelvin to Celsius
export const kelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

// Convert Kelvin to Fahrenheit
export const kelvinToFahrenheit = (kelvin) => {
  return Math.round((kelvin - 273.15) * 9/5 + 32);
};

// Get weather description
export const getWeatherDescription = (weatherData) => {
  if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
    return 'No weather data available';
  }
  return weatherData.weather[0].description
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get weather forecast for a specific day
export const getForecastForDay = (forecastList, targetDate) => {
  if (!forecastList || !targetDate) return null;
  
  const targetDay = new Date(targetDate).toDateString();
  return forecastList.filter(item => {
    const itemDay = new Date(item.dt * 1000).toDateString();
    return itemDay === targetDay;
  });
};