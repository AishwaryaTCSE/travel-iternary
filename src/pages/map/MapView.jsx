import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import EnhancedMapView from '../../components/maps/EnhancedMapView';
import { 
  Box, 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Button 
} from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';

const MapPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, getTripById } = useItinerary();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItinerary = () => {
      try {
        setLoading(true);
        const foundTrip = getTripById ? getTripById(tripId) : trips.find(t => t.id === tripId);
        
        if (!foundTrip) {
          setError('Itinerary not found');
          return;
        }
        
        setItinerary(foundTrip);
        setError(null);
      } catch (err) {
        setError('Failed to load itinerary');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      loadItinerary();
    } else {
      setError('No trip ID provided');
      setLoading(false);
    }
  }, [tripId, trips, getTripById]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !itinerary) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Itinerary not found'}
        </Alert>
        <Button startIcon={<FiArrowLeft />} onClick={() => navigate('/itinerary')}>
          Back to Itineraries
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<FiArrowLeft />} 
          onClick={() => navigate(`/itinerary/${tripId}`)}
          sx={{ mb: 2 }}
        >
          Back to Itinerary
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Map View - {itinerary.title || itinerary.name || 'Untitled Trip'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {itinerary.destination}
        </Typography>
      </Box>
      
      {itinerary && (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Debug Info:</strong> Destination: {itinerary.destination || 'Not set'}, 
              Activities: {itinerary.activities?.length || 0}, 
              Expenses: {itinerary.expenses?.length || 0}
            </Typography>
          </Alert>
          <EnhancedMapView itinerary={itinerary} />
        </>
      )}
    </Container>
  );
};

export default MapPage;
