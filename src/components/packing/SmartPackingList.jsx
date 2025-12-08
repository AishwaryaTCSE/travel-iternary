import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Checkbox, FormControlLabel, Chip, Button, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { FiPackage, FiCheckCircle, FiCircle, FiSun, FiCloudRain, FiCloudSnow } from 'react-icons/fi';
import { getCurrentWeather } from '../../api/weatherApi';

const SmartPackingList = ({ destination, startDate, endDate, travelers = 1 }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [packingItems, setPackingItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (destination) {
      loadWeatherAndGenerateList();
    }
  }, [destination, startDate, endDate, travelers]);

  const loadWeatherAndGenerateList = async () => {
    setLoading(true);
    try {
      // Get weather data
      const weather = await getCurrentWeather(destination);
      setWeatherData(weather);

      // Generate packing list based on weather, destination, and duration
      const items = generatePackingList(weather, destination, startDate, endDate, travelers);
      setPackingItems(items);
    } catch (error) {
      console.error('Error loading weather:', error);
      // Generate basic list even if weather fails
      const items = generatePackingList(null, destination, startDate, endDate, travelers);
      setPackingItems(items);
    } finally {
      setLoading(false);
    }
  };

  const generatePackingList = (weather, destination, startDate, endDate, travelers) => {
    const temp = weather?.main?.temp || 20; // Default to 20°C
    const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';
    const days = startDate && endDate 
      ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      : 7;

    const items = [];

    // Essential Documents
    items.push(...[
      { id: 'doc-1', name: 'Passport', category: 'Documents', essential: true, packed: false },
      { id: 'doc-2', name: 'Visa (if required)', category: 'Documents', essential: true, packed: false },
      { id: 'doc-3', name: 'Travel Insurance', category: 'Documents', essential: true, packed: false },
      { id: 'doc-4', name: 'Flight Tickets', category: 'Documents', essential: true, packed: false },
      { id: 'doc-5', name: 'Hotel Reservations', category: 'Documents', essential: true, packed: false },
      { id: 'doc-6', name: 'ID/Driver License', category: 'Documents', essential: true, packed: false },
    ]);

    // Clothing based on temperature
    if (temp < 10) {
      items.push(...[
        { id: 'cloth-1', name: 'Warm Jacket', category: 'Clothing', quantity: 1, packed: false },
        { id: 'cloth-2', name: 'Sweaters', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
        { id: 'cloth-3', name: 'Long Pants', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
        { id: 'cloth-4', name: 'Thermal Underwear', category: 'Clothing', quantity: 2, packed: false },
        { id: 'cloth-5', name: 'Warm Socks', category: 'Clothing', quantity: days, packed: false },
        { id: 'cloth-6', name: 'Gloves', category: 'Clothing', quantity: 1, packed: false },
        { id: 'cloth-7', name: 'Scarf', category: 'Clothing', quantity: 1, packed: false },
      ]);
    } else if (temp < 20) {
      items.push(...[
        { id: 'cloth-1', name: 'Light Jacket', category: 'Clothing', quantity: 1, packed: false },
        { id: 'cloth-2', name: 'Long Sleeve Shirts', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
        { id: 'cloth-3', name: 'Long Pants', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
        { id: 'cloth-4', name: 'T-Shirts', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
      ]);
    } else {
      items.push(...[
        { id: 'cloth-1', name: 'T-Shirts', category: 'Clothing', quantity: days, packed: false },
        { id: 'cloth-2', name: 'Shorts', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
        { id: 'cloth-3', name: 'Light Pants', category: 'Clothing', quantity: Math.ceil(days / 2), packed: false },
        { id: 'cloth-4', name: 'Swimwear', category: 'Clothing', quantity: 1, packed: false },
        { id: 'cloth-5', name: 'Sun Hat', category: 'Clothing', quantity: 1, packed: false },
      ]);
    }

    // Weather-specific items
    if (condition.includes('rain')) {
      items.push(
        { id: 'weather-1', name: 'Umbrella', category: 'Accessories', quantity: 1, packed: false },
        { id: 'weather-2', name: 'Rain Jacket', category: 'Clothing', quantity: 1, packed: false },
        { id: 'weather-3', name: 'Waterproof Shoes', category: 'Footwear', quantity: 1, packed: false }
      );
    }

    if (condition.includes('snow')) {
      items.push(
        { id: 'weather-1', name: 'Winter Boots', category: 'Footwear', quantity: 1, packed: false },
        { id: 'weather-2', name: 'Warm Hat', category: 'Clothing', quantity: 1, packed: false }
      );
    }

    if (temp > 25) {
      items.push(
        { id: 'weather-1', name: 'Sunscreen SPF 30+', category: 'Toiletries', quantity: 1, packed: false },
        { id: 'weather-2', name: 'Sunglasses', category: 'Accessories', quantity: 1, packed: false }
      );
    }

    // Standard items
    items.push(...[
      { id: 'std-1', name: 'Underwear', category: 'Clothing', quantity: days + 2, packed: false },
      { id: 'std-2', name: 'Socks', category: 'Clothing', quantity: days, packed: false },
      { id: 'std-3', name: 'Pajamas', category: 'Clothing', quantity: 1, packed: false },
      { id: 'std-4', name: 'Comfortable Walking Shoes', category: 'Footwear', quantity: 1, packed: false },
      { id: 'std-5', name: 'Toothbrush', category: 'Toiletries', quantity: travelers, packed: false },
      { id: 'std-6', name: 'Toothpaste', category: 'Toiletries', quantity: 1, packed: false },
      { id: 'std-7', name: 'Shampoo', category: 'Toiletries', quantity: 1, packed: false },
      { id: 'std-8', name: 'Soap/Body Wash', category: 'Toiletries', quantity: 1, packed: false },
      { id: 'std-9', name: 'Deodorant', category: 'Toiletries', quantity: travelers, packed: false },
      { id: 'std-10', name: 'Phone Charger', category: 'Electronics', quantity: travelers, packed: false },
      { id: 'std-11', name: 'Power Bank', category: 'Electronics', quantity: 1, packed: false },
      { id: 'std-12', name: 'Camera', category: 'Electronics', quantity: 1, packed: false },
      { id: 'std-13', name: 'Medications', category: 'Health', quantity: 1, packed: false },
      { id: 'std-14', name: 'First Aid Kit', category: 'Health', quantity: 1, packed: false },
    ]);

    return items;
  };

  const handleToggleItem = (id) => {
    setPackingItems(items =>
      items.map(item =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const categories = [...new Set(packingItems.map(item => item.category))];
  const packedCount = packingItems.filter(item => item.packed).length;
  const totalCount = packingItems.length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Smart Packing List for {destination}
        </Typography>
        <Chip 
          label={`${packedCount}/${totalCount} packed`} 
          color={packedCount === totalCount ? 'success' : 'default'}
        />
      </Box>

      {weatherData && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="body2">
            <strong>Weather-based recommendations:</strong> {Math.round(weatherData.main?.temp)}°C, 
            {weatherData.weather?.[0]?.description}. Packing list adjusted accordingly.
          </Typography>
        </Paper>
      )}

      {categories.map(category => {
        const categoryItems = packingItems.filter(item => item.category === category);
        return (
          <Paper key={category} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              {category} ({categoryItems.length})
            </Typography>
            <List>
              {categoryItems.map(item => (
                <ListItem key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.packed}
                        onChange={() => handleToggleItem(item.id)}
                        icon={<FiCircle />}
                        checkedIcon={<FiCheckCircle color="primary" />}
                      />
                    }
                    label={
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ textDecoration: item.packed ? 'line-through' : 'none' }}
                        >
                          {item.name}
                          {item.quantity > 1 && ` (${item.quantity})`}
                        </Typography>
                        {item.essential && (
                          <Chip label="Essential" size="small" color="error" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        );
      })}
    </Box>
  );
};

export default SmartPackingList;

