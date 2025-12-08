import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Paper, Card, CardContent, Chip, Tabs, Tab, Grid, Divider, CircularProgress, Alert } from '@mui/material';
import { FiMapPin, FiStar, FiDollarSign, FiSun, FiPackage, FiFileText, FiNavigation, FiHome, FiCoffee } from 'react-icons/fi';
import { geocodeAddress, searchNearbyPlaces } from '../../api/mapsApi';
import { getCurrentWeather } from '../../api/weatherApi';
import { searchPlaces } from '../../api/placesApi';

// Fix for default marker icons in Leaflet - CRITICAL FOR MARKERS TO SHOW
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Ensure Leaflet CSS is loaded - add inline styles as backup
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .leaflet-container { z-index: 1 !important; }
    .leaflet-marker-icon { z-index: 1000 !important; position: absolute !important; }
    .leaflet-popup { z-index: 1001 !important; }
  `;
  if (!document.getElementById('leaflet-marker-fix')) {
    style.id = 'leaflet-marker-fix';
    document.head.appendChild(style);
  }
}

// Custom icons for different types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const EnhancedMapView = ({ itinerary }) => {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [zoom, setZoom] = useState(13);
  const [markers, setMarkers] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize with a test marker to ensure something shows
  useEffect(() => {
    if (markers.length === 0 && !loading && itinerary) {
      console.log('No markers found, adding test marker');
      const testMarker = {
        id: 'test-marker',
        position: mapCenter,
        type: 'attraction',
        title: 'Test Marker',
        description: 'This is a test marker to verify map rendering',
        category: 'attraction',
        icon: createCustomIcon('#f59e0b'),
        data: {}
      };
      setMarkers([testMarker]);
    }
  }, [markers.length, loading, itinerary, mapCenter]);

  // Fallback geocoding for common destinations
  const getFallbackLocation = useCallback((destination) => {
    const commonLocations = {
      'thailand': { lat: 13.7563, lng: 100.5018 },
      'bangkok': { lat: 13.7563, lng: 100.5018 },
      'hassan': { lat: 13.0067, lng: 76.0994 },
      'india': { lat: 20.5937, lng: 78.9629 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'new york': { lat: 40.7128, lng: -74.0060 },
    };
    
    const destLower = destination.toLowerCase();
    for (const [key, coords] of Object.entries(commonLocations)) {
      if (destLower.includes(key)) {
        return coords;
      }
    }
    
    // Default to Thailand if no match
    return { lat: 13.7563, lng: 100.5018 };
  }, []);

  const loadMapData = useCallback(async () => {
    console.log('loadMapData called with itinerary:', itinerary);
    console.log('Itinerary destination:', itinerary?.destination);
    console.log('Itinerary activities:', itinerary?.activities?.length || 0);
    console.log('Itinerary expenses:', itinerary?.expenses?.length || 0);
    
    setLoading(true);
    setError(null);
    let location;
    
    // If no destination, use fallback and show sample places
    if (!itinerary?.destination) {
      console.warn('No destination found in itinerary, using fallback');
      const fallbackLocation = getFallbackLocation('thailand');
      setMapCenter([fallbackLocation.lat, fallbackLocation.lng]);
      const fallbackPlaces = generateFallbackPlaces(fallbackLocation, itinerary || {});
      const fallbackMarkers = fallbackPlaces.map(place => ({
        id: place.id,
        position: place.coordinates,
        type: place.type,
        title: place.name,
        description: `${place.rating}⭐ • ${place.priceRange || ''}`,
        category: place.type,
        icon: createCustomIcon(place.color),
        data: place
      }));
      console.log('Setting fallback markers (no destination):', fallbackMarkers.length);
      setMarkers(fallbackMarkers);
      setLoading(false);
      setError('No destination specified. Showing sample locations.');
      return;
    }
    
    try {
      // Geocode destination
      location = await geocodeAddress(itinerary.destination);
      setMapCenter([location.lat, location.lng]);
    } catch (geocodeError) {
      console.warn('Geocoding failed, using fallback location:', geocodeError);
      // Use fallback location if geocoding fails
      location = getFallbackLocation(itinerary.destination);
      setMapCenter([location.lat, location.lng]);
      setError('Using approximate location. For accurate geocoding, please add API keys to your .env file.');
    }
    
    try {
      // Get weather
      try {
        const weather = await getCurrentWeather(itinerary.destination);
        setWeatherData(weather);
      } catch (err) {
        console.error('Weather error:', err);
      }

      // Generate all markers based on itinerary data
      const allMarkers = [];

      // 1. Activities from itinerary
      if (itinerary.activities && itinerary.activities.length > 0) {
        itinerary.activities.forEach(activity => {
          if (activity.location || activity.coordinates) {
            const coords = activity.coordinates || [location.lat + (Math.random() - 0.5) * 0.05, location.lng + (Math.random() - 0.5) * 0.05];
            allMarkers.push({
              id: `activity-${activity.id}`,
              position: coords,
              type: 'activity',
              title: activity.title || activity.name,
              description: activity.description || activity.notes || '',
              category: activity.type || 'activity',
              icon: createCustomIcon('#3b82f6'),
              data: activity
            });
          }
        });
      }

      // 2. Expenses locations
      if (itinerary.expenses && itinerary.expenses.length > 0) {
        itinerary.expenses.forEach(expense => {
          if (expense.location) {
            const coords = expense.coordinates || [location.lat + (Math.random() - 0.5) * 0.05, location.lng + (Math.random() - 0.5) * 0.05];
            allMarkers.push({
              id: `expense-${expense.id}`,
              position: coords,
              type: 'expense',
              title: expense.name || expense.category,
              description: `$${expense.amount} - ${expense.category}`,
              category: 'expense',
              icon: createCustomIcon('#10b981'),
              data: expense
            });
          }
        });
      }

      // 3. Fetch real places from APIs based on itinerary details
      const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
      const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (FOURSQUARE_API_KEY || GOOGLE_MAPS_API_KEY) {
        try {
          console.log('Attempting to fetch recommended places...');
          await fetchRecommendedPlaces(location, allMarkers, itinerary);
          console.log('Recommended places fetched, total markers:', allMarkers.length);
        } catch (apiError) {
          console.warn('API places fetch failed, using fallback:', apiError);
          // Fallback to mock data if API fails
          const fallbackPlaces = generateFallbackPlaces(location, itinerary);
          console.log('Generated fallback places:', fallbackPlaces.length);
          fallbackPlaces.forEach(place => {
            allMarkers.push({
              id: place.id,
              position: place.coordinates,
              type: place.type,
              title: place.name,
              description: `${place.rating}⭐ • ${place.priceRange || ''}`,
              category: place.type,
              icon: createCustomIcon(place.color),
              data: place
            });
          });
          console.log('After adding fallback places, total markers:', allMarkers.length);
        }
      } else {
        // No API keys configured, always use fallback
        console.log('No API keys configured, generating fallback places');
        const fallbackPlaces = generateFallbackPlaces(location, itinerary);
        console.log('Generated fallback places:', fallbackPlaces.length);
        fallbackPlaces.forEach(place => {
          allMarkers.push({
            id: place.id,
            position: place.coordinates,
            type: place.type,
            title: place.name,
            description: `${place.rating}⭐ • ${place.priceRange || ''}`,
            category: place.type,
            icon: createCustomIcon(place.color),
            data: place
          });
        });
        console.log('After adding fallback places, total markers:', allMarkers.length);
      }

      console.log('Markers before setting:', allMarkers.length, allMarkers);
      
      // ALWAYS ensure we have at least some markers - add fallback if empty
      if (allMarkers.length === 0) {
        console.log('No markers found, generating fallback places');
        const fallbackPlaces = generateFallbackPlaces(location, itinerary);
        console.log('Fallback places generated:', fallbackPlaces.length);
        fallbackPlaces.forEach(place => {
          allMarkers.push({
            id: place.id,
            position: place.coordinates,
            type: place.type,
            title: place.name,
            description: `${place.rating}⭐ • ${place.priceRange || ''}`,
            category: place.type,
            icon: createCustomIcon(place.color),
            data: place
          });
        });
        console.log('After adding fallback, total markers:', allMarkers.length);
      }
      
      // Add a test marker at the center to ensure something shows
      if (allMarkers.length > 0) {
        console.log('Setting markers:', allMarkers.length);
        console.log('First marker:', allMarkers[0]);
        setMarkers(allMarkers);
      } else {
        // Last resort - add a single marker at center
        console.warn('Still no markers, adding emergency center marker');
        const emergencyMarker = {
          id: 'emergency-center',
          position: [location.lat, location.lng],
          type: 'attraction',
          title: 'Map Center',
          description: 'This is the map center point',
          category: 'attraction',
          icon: createCustomIcon('#f59e0b'),
          data: { address: itinerary.destination || 'Unknown' }
        };
        setMarkers([emergencyMarker]);
        console.log('Emergency marker set at:', emergencyMarker.position);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
      // Even on error, try to show fallback places
      try {
        const fallbackLocation = location || getFallbackLocation(itinerary.destination);
        const fallbackPlaces = generateFallbackPlaces(fallbackLocation, itinerary);
        const fallbackMarkers = fallbackPlaces.map(place => ({
          id: place.id,
          position: place.coordinates,
          type: place.type,
          title: place.name,
          description: `${place.rating}⭐ • ${place.priceRange || ''}`,
          category: place.type,
          icon: createCustomIcon(place.color),
          data: place
        }));
        setMarkers(fallbackMarkers);
        setMapCenter([fallbackLocation.lat, fallbackLocation.lng]);
        setError('Using fallback data. For real places, please add API keys to your .env file.');
      } catch (fallbackError) {
        setError('Failed to load map data. Please check your API keys in .env file.');
      }
    } finally {
      setLoading(false);
    }
  }, [itinerary]);

  useEffect(() => {
    console.log('EnhancedMapView useEffect triggered, itinerary:', itinerary);
    if (itinerary?.destination) {
      console.log('Loading map data for destination:', itinerary.destination);
      loadMapData();
    } else if (itinerary) {
      console.warn('No destination in itinerary:', itinerary);
      setError('No destination specified in itinerary');
    } else {
      console.warn('No itinerary provided to EnhancedMapView');
      setError('No itinerary data available');
    }
  }, [itinerary, loadMapData]);

  // Set initial test marker immediately
  useEffect(() => {
    if (markers.length === 0 && itinerary?.destination) {
      console.log('Setting initial test marker');
      const testLocation = getFallbackLocation(itinerary.destination);
      const testMarker = {
        id: 'initial-test',
        position: [testLocation.lat, testLocation.lng],
        type: 'attraction',
        title: 'Initial Test Marker',
        description: 'This marker should appear immediately',
        category: 'attraction',
        icon: createCustomIcon('#3b82f6'),
        data: {}
      };
      setMarkers([testMarker]);
      setMapCenter([testLocation.lat, testLocation.lng]);
    }
  }, [itinerary?.destination]);

  // Debug: Log when markers change
  useEffect(() => {
    console.log('Markers state changed:', markers.length, markers);
    if (markers.length > 0) {
      console.log('First marker details:', {
        id: markers[0].id,
        position: markers[0].position,
        title: markers[0].title,
        hasIcon: !!markers[0].icon
      });
    }
  }, [markers]);

  // Fetch recommended places from APIs
  const fetchRecommendedPlaces = async (location, allMarkers, itinerary) => {
    const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Use Foursquare API if available
    if (FOURSQUARE_API_KEY) {
      try {
        // Fetch hotels
        const hotels = await searchPlaces('hotel', {
          lat: location.lat,
          lng: location.lng,
          radius: 5000,
          categories: '19031', // Foursquare category for hotels
          limit: 10
        });
        
        if (hotels?.results) {
          hotels.results.forEach((place, index) => {
            if (place.geocodes?.main) {
              allMarkers.push({
                id: `hotel-${place.fsq_id}`,
                position: [place.geocodes.main.latitude, place.geocodes.main.longitude],
                type: 'hotel',
                title: place.name,
                description: `${place.rating || 'N/A'}⭐ • ${place.price || 'N/A'}`,
                category: 'hotel',
                icon: createCustomIcon('#8b5cf6'),
                data: {
                  ...place,
                  address: place.location?.formatted_address || place.location?.address || '',
                  rating: place.rating,
                  priceRange: place.price
                }
              });
            }
          });
        }

        // Fetch restaurants
        const restaurants = await searchPlaces('restaurant', {
          lat: location.lat,
          lng: location.lng,
          radius: 3000,
          categories: '13000', // Foursquare category for restaurants
          limit: 15
        });
        
        if (restaurants?.results) {
          restaurants.results.forEach((place) => {
            if (place.geocodes?.main) {
              allMarkers.push({
                id: `restaurant-${place.fsq_id}`,
                position: [place.geocodes.main.latitude, place.geocodes.main.longitude],
                type: 'restaurant',
                title: place.name,
                description: `${place.rating || 'N/A'}⭐ • ${place.price || 'N/A'}`,
                category: 'restaurant',
                icon: createCustomIcon('#ef4444'),
                data: {
                  ...place,
                  address: place.location?.formatted_address || place.location?.address || '',
                  rating: place.rating,
                  priceRange: place.price
                }
              });
            }
          });
        }

        // Fetch attractions based on itinerary activities/interests
        const attractionCategories = getAttractionCategories(itinerary);
        for (const category of attractionCategories) {
          const attractions = await searchPlaces(category.query, {
            lat: location.lat,
            lng: location.lng,
            radius: 5000,
            categories: category.foursquareId,
            limit: 8
          });
          
          if (attractions?.results) {
            attractions.results.forEach((place) => {
              if (place.geocodes?.main) {
                allMarkers.push({
                  id: `attraction-${place.fsq_id}`,
                  position: [place.geocodes.main.latitude, place.geocodes.main.longitude],
                  type: 'attraction',
                  title: place.name,
                  description: `${place.rating || 'N/A'}⭐ • ${place.categories?.[0]?.name || 'Attraction'}`,
                  category: 'attraction',
                  icon: createCustomIcon('#f59e0b'),
                  data: {
                    ...place,
                    address: place.location?.formatted_address || place.location?.address || '',
                    rating: place.rating
                  }
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Foursquare API error:', error);
        throw error;
      }
    } 
    // Fallback to Google Places API if Foursquare is not available
    else if (GOOGLE_MAPS_API_KEY) {
      try {
        // Search nearby hotels
        const hotels = await searchNearbyPlaces(location, 5000, 'lodging');
        hotels.forEach((place, index) => {
          if (place.geometry?.location) {
            allMarkers.push({
              id: `hotel-${place.place_id}`,
              position: [place.geometry.location.lat, place.geometry.location.lng],
              type: 'hotel',
              title: place.name,
              description: `${place.rating || 'N/A'}⭐ • ${place.price_level ? '$'.repeat(place.price_level) : ''}`,
              category: 'hotel',
              icon: createCustomIcon('#8b5cf6'),
              data: {
                ...place,
                address: place.vicinity || place.formatted_address || '',
                rating: place.rating,
                priceRange: place.price_level ? '$'.repeat(place.price_level) : ''
              }
            });
          }
        });

        // Search nearby restaurants
        const restaurants = await searchNearbyPlaces(location, 3000, 'restaurant');
        restaurants.forEach((place) => {
          if (place.geometry?.location) {
            allMarkers.push({
              id: `restaurant-${place.place_id}`,
              position: [place.geometry.location.lat, place.geometry.location.lng],
              type: 'restaurant',
              title: place.name,
              description: `${place.rating || 'N/A'}⭐ • ${place.price_level ? '$'.repeat(place.price_level) : ''}`,
              category: 'restaurant',
              icon: createCustomIcon('#ef4444'),
              data: {
                ...place,
                address: place.vicinity || place.formatted_address || '',
                rating: place.rating,
                priceRange: place.price_level ? '$'.repeat(place.price_level) : ''
              }
            });
          }
        });

        // Search nearby attractions
        const attractions = await searchNearbyPlaces(location, 5000, 'tourist_attraction');
        attractions.forEach((place) => {
          if (place.geometry?.location) {
            allMarkers.push({
              id: `attraction-${place.place_id}`,
              position: [place.geometry.location.lat, place.geometry.location.lng],
              type: 'attraction',
              title: place.name,
              description: `${place.rating || 'N/A'}⭐ • Attraction`,
              category: 'attraction',
              icon: createCustomIcon('#f59e0b'),
              data: {
                ...place,
                address: place.vicinity || place.formatted_address || '',
                rating: place.rating
              }
            });
          }
        });
      } catch (error) {
        console.error('Google Places API error:', error);
        throw error;
      }
    } else {
      throw new Error('No API keys configured');
    }
  };

  // Get attraction categories based on itinerary activities
  const getAttractionCategories = (itinerary) => {
    const categories = [
      { query: 'museum', foursquareId: '10000', name: 'Museums' },
      { query: 'park', foursquareId: '16032', name: 'Parks' },
      { query: 'monument', foursquareId: '16000', name: 'Monuments' },
      { query: 'gallery', foursquareId: '10004', name: 'Art Galleries' },
      { query: 'landmark', foursquareId: '16000', name: 'Landmarks' }
    ];

    // If itinerary has activities, try to match categories
    if (itinerary.activities && itinerary.activities.length > 0) {
      const activityTypes = itinerary.activities.map(a => (a.type || '').toLowerCase());
      return categories.filter(cat => 
        activityTypes.some(type => type.includes(cat.query) || cat.query.includes(type))
      ).slice(0, 3);
    }

    // Default categories
    return categories.slice(0, 3);
  };

  // Fallback function to generate mock places if APIs fail
  const generateFallbackPlaces = (location, itinerary) => {
    const places = [];
    
    // Generate hotels
    const hotelNames = ['Grand Hotel', 'Plaza Hotel', 'Seaside Resort', 'City Center Hotel', 'Boutique Hotel'];
    for (let i = 0; i < 5; i++) {
      places.push({
        id: `hotel-${i}`,
        name: `${hotelNames[i % hotelNames.length]} ${i + 1}`,
        coordinates: [
          location.lat + (Math.random() - 0.5) * 0.1,
          location.lng + (Math.random() - 0.5) * 0.1
        ],
        type: 'hotel',
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        priceRange: '$'.repeat(Math.floor(Math.random() * 3) + 1),
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${itinerary.destination}`,
        color: '#8b5cf6'
      });
    }

    // Generate restaurants
    const restaurantNames = ['Fine Dining', 'Local Bistro', 'Seafood Restaurant', 'Traditional Café', 'Street Food Market'];
    for (let i = 0; i < 8; i++) {
      places.push({
        id: `restaurant-${i}`,
        name: `${restaurantNames[i % restaurantNames.length]} ${i + 1}`,
        coordinates: [
          location.lat + (Math.random() - 0.5) * 0.1,
          location.lng + (Math.random() - 0.5) * 0.1
        ],
        type: 'restaurant',
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        priceRange: '$'.repeat(Math.floor(Math.random() * 3) + 1),
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${itinerary.destination}`,
        color: '#ef4444'
      });
    }

    // Generate attractions
    const attractionNames = ['Historic Museum', 'Art Gallery', 'City Park', 'Monument', 'Cathedral'];
    for (let i = 0; i < 10; i++) {
      places.push({
        id: `attraction-${i}`,
        name: `${attractionNames[i % attractionNames.length]} ${i + 1}`,
        coordinates: [
          location.lat + (Math.random() - 0.5) * 0.1,
          location.lng + (Math.random() - 0.5) * 0.1
        ],
        type: 'attraction',
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${itinerary.destination}`,
        color: '#f59e0b'
      });
    }

    return places;
  };


  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };

  // Force markers to always have at least one - MUST BE DEFINED BEFORE categories
  const displayMarkers = markers.length > 0 ? markers : [{
    id: 'default-marker',
    position: mapCenter,
    type: 'attraction',
    title: 'Default Location',
    description: 'Map is ready. Loading places...',
    category: 'attraction',
    icon: createCustomIcon('#3b82f6'),
    data: {}
  }];

  const filteredDisplayMarkers = activeCategory === 'all' 
    ? displayMarkers 
    : displayMarkers.filter(m => m.type === activeCategory || m.category === activeCategory);

  const categories = [
    { value: 'all', label: 'All', count: displayMarkers.length },
    { value: 'activity', label: 'Activities', count: displayMarkers.filter(m => m.type === 'activity').length },
    { value: 'hotel', label: 'Hotels', count: displayMarkers.filter(m => m.type === 'hotel').length },
    { value: 'restaurant', label: 'Restaurants', count: displayMarkers.filter(m => m.type === 'restaurant').length },
    { value: 'attraction', label: 'Attractions', count: displayMarkers.filter(m => m.type === 'attraction').length },
    { value: 'expense', label: 'Expenses', count: displayMarkers.filter(m => m.type === 'expense').length },
  ];

  const getMarkerIcon = (type) => {
    const icons = {
      activity: <FiMapPin />,
      hotel: <FiHome />,
      restaurant: <FiCoffee />,
      attraction: <FiStar />,
      expense: <FiDollarSign />
    };
    return icons[type] || <FiMapPin />;
  };

  if (!itinerary) {
    return (
      <Alert severity="error">
        No itinerary data provided to map component
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Enhanced Map View - {itinerary?.destination || 'Loading...'}
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            To enable real places search, please add API keys to your .env file:
            <br />
            • VITE_FOURSQUARE_API_KEY (recommended) or VITE_GOOGLE_MAPS_API_KEY
            <br />
            • VITE_OPENWEATHER_API_KEY or VITE_WEATHER_API_KEY (for weather)
          </Typography>
        </Alert>
      )}

      {/* Weather Info */}
      {weatherData && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FiSun size={24} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Current Weather: {Math.round(weatherData.main?.temp)}°C
              </Typography>
              <Typography variant="body2">
                {weatherData.weather?.[0]?.description} • Humidity: {weatherData.main?.humidity}%
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Loading places and recommendations...
          </Typography>
        </Box>
      )}

      {/* Debug Info - ALWAYS SHOW */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Debug Info:</strong><br />
          Markers in state: {markers.length}<br />
          Display markers: {displayMarkers.length}<br />
          Filtered markers: {filteredDisplayMarkers.length}<br />
          Map Center: [{mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}]<br />
          Loading: {loading ? 'Yes' : 'No'}<br />
          Destination: {itinerary?.destination || 'None'}<br />
          Itinerary ID: {itinerary?.id || 'None'}
        </Typography>
      </Alert>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onChange={(e, v) => setActiveCategory(v)} sx={{ mb: 2 }}>
        {categories.map(cat => (
          <Tab 
            key={cat.value} 
            label={`${cat.label} (${cat.count})`} 
            value={cat.value}
          />
        ))}
      </Tabs>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 1, height: '600px', position: 'relative' }}>
            {/* Add a visible test div to verify component renders */}
            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, bgcolor: 'yellow', p: 1, borderRadius: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                MAP RENDERING TEST - Markers: {filteredDisplayMarkers.length}
              </Typography>
            </Box>
            
            <MapContainer
              center={mapCenter}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <ChangeView center={mapCenter} zoom={zoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* HARDCODED TEST MARKERS - These MUST show - Using explicit default icon */}
              <Marker 
                position={[51.505, -0.09]}
                key="hardcoded-london-marker"
              >
                <Popup>
                  <div style={{ padding: '10px' }}>
                    <strong>London Test Marker</strong><br />
                    This should always be visible<br />
                    Position: 51.505, -0.09
                  </div>
                </Popup>
              </Marker>
              
              <Marker 
                position={mapCenter}
                key="hardcoded-center-marker"
              >
                <Popup>
                  <div style={{ padding: '10px' }}>
                    <strong>Center Test Marker</strong><br />
                    Center: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}<br />
                    Total Markers: {filteredDisplayMarkers.length}
                  </div>
                </Popup>
              </Marker>
              
              {/* Add Thailand marker if destination is Thailand */}
              {itinerary?.destination?.toLowerCase().includes('thailand') && (
                <Marker position={[13.7563, 100.5018]} key="thailand-marker">
                  <Popup>
                    <div style={{ padding: '10px' }}>
                      <strong>Thailand Marker</strong><br />
                      Bangkok, Thailand
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Add Hassan marker if destination is Hassan */}
              {itinerary?.destination?.toLowerCase().includes('hassan') && (
                <Marker position={[13.0067, 76.0994]} key="hassan-marker">
                  <Popup>
                    <div style={{ padding: '10px' }}>
                      <strong>Hassan Marker</strong><br />
                      Hassan, India
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Render other markers */}
              {filteredDisplayMarkers.map((marker, index) => {
                // Validate marker position
                if (!marker.position || !Array.isArray(marker.position) || marker.position.length !== 2) {
                  console.warn('Invalid marker position:', marker);
                  return null;
                }
                
                const [lat, lng] = marker.position;
                if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                  console.warn('Invalid marker coordinates:', marker.position);
                  return null;
                }
                
                // Use default icon for now to ensure it renders
                return (
                  <Marker
                    key={marker.id || `marker-${index}`}
                    position={[lat, lng]}
                    eventHandlers={{
                      click: () => {
                        console.log('Marker clicked:', marker);
                        setSelectedMarker(marker);
                      }
                    }}
                  >
                    <Popup>
                      <div style={{ minWidth: '200px' }}>
                        <strong>{marker.title || 'Untitled Marker'}</strong><br />
                        {marker.description && <span>{marker.description}</span>}
                        {marker.data?.address && (
                          <div style={{ marginTop: '4px', fontSize: '12px' }}>
                            📍 {marker.data.address}
                          </div>
                        )}
                        {marker.data?.rating && (
                          <div style={{ marginTop: '4px', fontSize: '12px' }}>
                            ⭐ {marker.data.rating}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, maxHeight: '600px', overflow: 'auto' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {activeCategory === 'all' ? 'All Locations' : categories.find(c => c.value === activeCategory)?.label}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {filteredDisplayMarkers.length > 0 ? (
              filteredDisplayMarkers.map(marker => (
                <Card 
                  key={marker.id} 
                  sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                  onClick={() => setSelectedMarker(marker)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: marker.type === 'activity' ? '#3b82f6' : 
                                 marker.type === 'hotel' ? '#8b5cf6' :
                                 marker.type === 'restaurant' ? '#ef4444' :
                                 marker.type === 'attraction' ? '#f59e0b' : '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {getMarkerIcon(marker.type)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {marker.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {marker.description}
                        </Typography>
                        {marker.data?.location && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            <FiMapPin size={12} style={{ marginRight: 4 }} />
                            {marker.data.location}
                          </Typography>
                        )}
                        {marker.data?.address && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            <FiMapPin size={12} style={{ marginRight: 4 }} />
                            {marker.data.address}
                          </Typography>
                        )}
                        {marker.data?.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <FiStar size={12} color="#FFA500" />
                            <Typography variant="caption">{marker.data.rating}</Typography>
                          </Box>
                        )}
                        <Chip 
                          label={marker.type} 
                          size="small" 
                          sx={{ mt: 1 }}
                          color={marker.type === 'activity' ? 'primary' : 
                                 marker.type === 'hotel' ? 'secondary' :
                                 marker.type === 'restaurant' ? 'error' :
                                 marker.type === 'attraction' ? 'warning' : 'success'}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No locations found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedMapView;
