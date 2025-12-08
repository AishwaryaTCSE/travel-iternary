import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, CircularProgress, Tabs, Tab, Button } from '@mui/material';
import { FiMapPin, FiStar, FiDollarSign, FiClock, FiExternalLink } from 'react-icons/fi';
import MapView from '../maps/MapView';
import { geocodeAddress, searchNearbyPlaces } from '../../api/mapsApi';
import { searchPlaces } from '../../api/placesApi';

const PlacesMap = ({ destination, startDate, endDate }) => {
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [markers, setMarkers] = useState([]);
  const [places, setPlaces] = useState({ attractions: [], hotels: [], restaurants: [] });
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (destination) {
      loadPlaces();
    }
  }, [destination]);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      // Geocode destination to get coordinates
      const location = await geocodeAddress(destination);
      setMapCenter([location.lat, location.lng]);

      // Generate mock places data (in production, use real APIs)
      const mockAttractions = generateMockPlaces('attraction', location);
      const mockHotels = generateMockPlaces('hotel', location);
      const mockRestaurants = generateMockPlaces('restaurant', location);

      setPlaces({
        attractions: mockAttractions,
        hotels: mockHotels,
        restaurants: mockRestaurants
      });

      // Create markers for map
      const allMarkers = [
        ...mockAttractions.map(p => ({ ...p, type: 'attraction', color: 'blue' })),
        ...mockHotels.map(p => ({ ...p, type: 'hotel', color: 'green' })),
        ...mockRestaurants.map(p => ({ ...p, type: 'restaurant', color: 'red' }))
      ];

      setMarkers(allMarkers.map(p => ({
        id: p.id,
        position: p.coordinates,
        title: p.name,
        description: `${p.category} • ${p.rating}⭐ • ${p.priceRange}`,
        popup: {
          title: p.name,
          description: `${p.category} • ${p.rating}⭐ • ${p.priceRange} • ${p.address}`
        },
        type: p.type
      })));

    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPlaces = (type, location) => {
    const baseNames = {
      attraction: ['Museum', 'Park', 'Monument', 'Gallery', 'Landmark', 'Tower', 'Palace', 'Cathedral'],
      hotel: ['Grand Hotel', 'Plaza Hotel', 'Royal Inn', 'Seaside Resort', 'City Center Hotel', 'Boutique Hotel'],
      restaurant: ['Bistro', 'Café', 'Restaurant', 'Trattoria', 'Brasserie', 'Steakhouse', 'Sushi Bar', 'Pizzeria']
    };

    return Array(8).fill().map((_, i) => {
      const name = baseNames[type][i % baseNames[type].length];
      const offsetLat = (Math.random() - 0.5) * 0.1;
      const offsetLng = (Math.random() - 0.5) * 0.1;
      
      return {
        id: `${type}-${i}`,
        name: `${name} ${i + 1}`,
        category: type,
        coordinates: [location.lat + offsetLat, location.lng + offsetLng],
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviewCount: Math.floor(Math.random() * 5000) + 100,
        priceRange: '$'.repeat(Math.floor(Math.random() * 3) + 1),
        address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${destination}`,
        description: `A wonderful ${type} in ${destination} with great reviews and excellent service.`,
        image: `https://source.unsplash.com/400x300/?${type},${i}`
      };
    });
  };

  const getFilteredPlaces = () => {
    if (activeCategory === 'all') {
      return [...places.attractions, ...places.hotels, ...places.restaurants];
    }
    return places[activeCategory] || [];
  };

  const PlaceCard = ({ place }) => (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>{place.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FiStar size={16} color="#FFA500" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>{place.rating}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  ({place.reviewCount})
                </Typography>
              </Box>
              <Chip label={place.priceRange} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <FiMapPin size={14} style={{ marginRight: 4 }} />
              {place.address}
            </Typography>
            <Typography variant="body2">{place.description}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Places, Hotels & Restaurants in {destination}
      </Typography>

      <Tabs value={activeCategory} onChange={(e, v) => setActiveCategory(v)} sx={{ mb: 2 }}>
        <Tab label="All" value="all" />
        <Tab label={`Attractions (${places.attractions.length})`} value="attractions" />
        <Tab label={`Hotels (${places.hotels.length})`} value="hotels" />
        <Tab label={`Restaurants (${places.restaurants.length})`} value="restaurants" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MapView
                center={mapCenter}
                zoom={13}
                markers={markers.filter(m => activeCategory === 'all' || m.type === activeCategory)}
                height="500px"
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, maxHeight: '500px', overflow: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              {activeCategory === 'all' ? 'All Places' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </Typography>
            {getFilteredPlaces().length > 0 ? (
              getFilteredPlaces().map(place => (
                <PlaceCard key={place.id} place={place} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No places found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlacesMap;

