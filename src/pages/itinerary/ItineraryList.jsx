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
  Snackbar,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  FiPlus, 
  FiCalendar, 
  FiUsers, 
  FiEdit2, 
  FiTrash2, 
  FiAlertCircle, 
  FiFileText,
  FiMapPin,
  FiEye
} from 'react-icons/fi';
import { useItinerary } from '../../context/ItineraryContext';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  cursor: 'pointer',
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const TripTitle = styled(Typography)({
  fontWeight: 500,
  marginBottom: '8px',
});

const TripMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginBottom: '4px',
  '& svg': {
    fontSize: '1rem',
  },
}));

const ActionButtons = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
});

const EmptyState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  width: '100%',
}));

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
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
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
          sx={{ textTransform: 'none' }}
        >
          Create New Itinerary
        </Button>
      </Box>

      <Grid container spacing={3}>
        {trips && trips.length > 0 ? (
          trips.map((trip) => (
            <Grid item xs={12} sm={6} lg={4} key={trip.id}>
              <StyledCard>
                <StyledCardContent onClick={() => navigate(`/itinerary/${trip.id}`)}>
                  <TripTitle variant="h6" component="h2">
                    {trip.title || 'Untitled Trip'}
                  </TripTitle>
                  
                  {trip.destination && (
                    <TripMeta>
                      <FiMapPin />
                      <Typography variant="body2">{trip.destination}</Typography>
                    </TripMeta>
                  )}
                  
                  {trip.startDate && trip.endDate && (
                    <TripMeta>
                      <FiCalendar />
                      <Typography variant="body2">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </Typography>
                    </TripMeta>
                  )}
                  
                  {trip.travelers > 0 && (
                    <TripMeta>
                      <FiUsers />
                      <Typography variant="body2">
                        {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
                      </Typography>
                    </TripMeta>
                  )}
                </StyledCardContent>
                
                <ActionButtons>
                  <Box>
                    <Tooltip title="View Details">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/itinerary/${trip.id}`);
                        }}
                      >
                        <FiEye />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/itinerary/${trip.id}/edit`);
                        }}
                      >
                        <FiEdit2 />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Tooltip title="Delete">
                    <IconButton 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this trip?')) {
                          handleDeleteTrip(trip.id);
                        }
                      }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </Tooltip>
                </ActionButtons>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <EmptyState elevation={0}>
              <Box py={4}>
                <FiFileText size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  No itineraries found
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Get started by creating your first travel itinerary
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<FiPlus />}
                  onClick={() => navigate('/itinerary/create')}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Create Your First Itinerary
                </Button>
              </Box>
            </EmptyState>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ItineraryList;
