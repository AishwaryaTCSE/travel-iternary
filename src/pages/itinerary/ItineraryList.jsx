import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Container, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { FiPlus, FiMap, FiCalendar, FiUsers, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useItinerary } from '../../context/ItineraryContext';

const ItineraryList = () => {
  const navigate = useNavigate();
  const { trips, loading, error, deleteTrip } = useItinerary();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
      setSnackbar({
        open: true,
        message: 'Trip deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete trip',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" icon={<FiAlertCircle />}>
          Error loading itineraries: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">My Itineraries</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<FiPlus />}
          onClick={() => navigate('/itinerary/create')}
        >
          Create New Itinerary
        </Button>
      </Box>

      <Grid container spacing={3}>
        {trips && trips.length > 0 ? (
          trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/itinerary/${trip.id}`)}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {trip.title || 'Untitled Trip'}
                  </Typography>
                  {trip.destination && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FiMap style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        {trip.destination}
                      </Typography>
                    </Box>
                  )}
                  {trip.startDate && trip.endDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FiCalendar style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  {trip.travelers && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FiUsers style={{ marginRight: 8 }} />
                      <Typography variant="body2" color="text.secondary">
                        {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    size="small" 
                    startIcon={<FiEdit2 />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/itinerary/${trip.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<FiTrash2 />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this trip?')) {
                        handleDeleteTrip(trip.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                No itineraries found. Create your first itinerary to get started!
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<FiPlus />}
                onClick={() => navigate('/itinerary/create')}
                sx={{ mt: 2 }}
              >
                Create New Itinerary
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ItineraryList;
