import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiInfo, FiArrowRight } from 'react-icons/fi';
import LeafletMapView from '../../components/maps/MapView';
import { useItinerary } from '../../context/ItineraryContext';
import { geocodeDestination } from '../../services/maps';
import { getItineraryRecommendations } from '../../services/recommendations';
import { calculateTripExpenses } from '../../services/expenses';
import { getWeatherForecast } from '../../services/weather';
import { generatePackingList } from '../../services/packing';
import { getRequiredDocuments } from '../../services/documents';

const MapView = () => {
  const [searchParams] = useSearchParams();
  const { tripId: paramTripId } = useParams();
  const { trips, currentTrip, setCurrentTrip } = useItinerary();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [markers, setMarkers] = useState([]);
  const [recommendations, setRecommendations] = useState({ places: [], food: [], activities: [] });
  
  // Get trip ID from URL params or session storage
  const tripId = paramTripId || searchParams.get('tripId') || sessionStorage.getItem('currentTripId');
  const trip = tripId ? trips.find(t => t.id === tripId) : currentTrip;

  useEffect(() => {
    if (trip) {
      setCurrentTrip(trip);
      sessionStorage.setItem('currentTripId', trip.id);
      loadTripData(trip);
    } else if (tripId) {
      setError('Trip not found. Please create a new itinerary.');
      setIsLoading(false);
    } else {
      setError('No trip selected. Please create or select an itinerary.');
      setIsLoading(false);
    }
  }, [tripId, trip]);

  const loadTripData = async (tripData) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Get location coordinates
      const geo = await geocodeDestination(tripData.destination);
      const coords = geo ? [geo.lat, geo.lng] : center;
      setCenter(coords);

      // 2. Get recommendations (places, food, activities)
      const recs = await getItineraryRecommendations(tripData, { lat: coords[0], lng: coords[1] });
      setRecommendations(recs);

      // 3. Create map markers from places
      const placeMarkers = (recs.places || []).map((place) => ({
        id: place.id,
        position: place.position || [coords[0] + (Math.random() * 0.02 - 0.01), coords[1] + (Math.random() * 0.02 - 0.01)],
        title: place.name,
        description: `
          ${place.vicinity || place.formatted_address || ''}
          ${place.rating ? `\n⭐ ${place.rating}${place.user_ratings_total ? ` (${place.user_ratings_total} reviews)` : ''}` : ''}
          ${place.price_level ? `\n${'$'.repeat(place.price_level)}` : ''}
        `.trim(),
        link: place.website || place.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id || place.id}`,
        popup: true,
        type: place.type || 'place'
      }));
      setMarkers(placeMarkers);

      // 4. Calculate expenses
      const expenses = await calculateTripExpenses(tripData);
      
      // 5. Get weather forecast
      const weather = await getWeatherForecast(tripData.destination, tripData.startDate, tripData.endDate);
      
      // 6. Generate packing list
      const packingList = await generatePackingList(tripData, weather);
      
      // 7. Get required documents
      const requiredDocs = await getRequiredDocuments(tripData.destination);

      // Store all data in session storage for other pages
      const tripWithDetails = {
        ...tripData,
        coordinates: coords,
        recommendations: recs,
        weather,
        expenses,
        packingList,
        requiredDocuments: requiredDocs
      };
      
      sessionStorage.setItem(`trip_${tripData.id}`, JSON.stringify(tripWithDetails));
      
    } catch (err) {
      console.error('Error loading trip data:', err);
      setError('Failed to load trip data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading your trip details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = '/itinerary/new'}
          startIcon={<FiArrowRight />}
        >
          Create New Itinerary
        </Button>
      </Paper>
    );
  }

  if (!trip) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No trip selected
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.href = '/itinerary/new'}
          startIcon={<FiArrowRight />}
        >
          Create New Itinerary
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {trip.destination} Trip
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
          <Box display="flex" alignItems="center" mr={2}>
            <FiCalendar style={{ marginRight: 8 }} />
            <Typography variant="body1">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mr={2}>
            <FiUsers style={{ marginRight: 8 }} />
            <Typography variant="body1">
              {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
            </Typography>
          </Box>
          {trip.budget && (
            <Box display="flex" alignItems="center">
              <FiDollarSign style={{ marginRight: 8 }} />
              <Typography variant="body1">
                Budget: ${trip.budget.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        <Box sx={{ flex: 1, height: '70vh', minHeight: '500px', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
          <LeafletMapView 
            center={center} 
            zoom={13}
            markers={markers}
            style={{ height: '100%', width: '100%' }}
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', lg: '350px' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <FiMapPin style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Top Places to Visit
            </Typography>
            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {recommendations.places?.slice(0, 5).map((place, index) => (
                <Box key={place.id || index} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle2">{place.name}</Typography>
                  <Box display="flex" alignItems="center" mt={0.5}>
                    {place.rating && (
                      <Box display="flex" alignItems="center" mr={1.5}>
                        <span style={{ color: '#ffc107', fontSize: '0.9rem' }}>★</span>
                        <Typography variant="caption" color="textSecondary" ml={0.5}>
                          {place.rating} {place.user_ratings_total ? `(${place.user_ratings_total})` : ''}
                        </Typography>
                      </Box>
                    )}
                    {place.price_level > 0 && (
                      <Typography variant="caption" color="textSecondary">
                        {Array(place.price_level).fill('$').join('')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {recommendations.places?.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  No places found. Try adjusting your search.
                </Typography>
              )}
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <FiInfo style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => window.location.href = `/expenses?tripId=${trip.id}`}
                startIcon={<FiDollarSign />}
              >
                View Expenses
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => window.location.href = `/weather?tripId=${trip.id}`}
                startIcon={<span>🌤️</span>}
              >
                Check Weather
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => window.location.href = `/packing?tripId=${trip.id}`}
                startIcon={<span>🧳</span>}
              >
                Packing List
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={() => window.location.href = `/documents?tripId=${trip.id}`}
                startIcon={<span>📄</span>}
              >
                Required Documents
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default MapView;
