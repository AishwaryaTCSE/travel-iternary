import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import { useTranslation } from 'react-i18next';
import PackingListComponent from '../components/packing/PackingList';
import { Box, Typography, Button, Container } from '@mui/material';
import { FiArrowLeft } from 'react-icons/fi';

const PackingListPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, getTripById } = useItinerary();
  const { t } = useTranslation();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        // Try to find trip in local state first
        const foundTrip = trips.find(t => t.id === tripId);
        
        if (foundTrip) {
          setTrip(foundTrip);
        } else if (getTripById) {
          // If not found, try to fetch it
          const fetchedTrip = await getTripById(tripId);
          if (fetchedTrip) {
            setTrip(fetchedTrip);
          }
        }
      } catch (error) {
        console.error('Error loading trip:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, trips, getTripById]);

  const handleUpdatePackingList = (updatedCategories) => {
    // You can implement saving logic here if needed
    console.log('Updated packing list:', updatedCategories);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button 
          startIcon={<FiArrowLeft />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          {t('common.back')}
        </Button>
        <Typography variant="h5" align="center" gutterBottom>
          {t('common.tripNotFound')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<FiArrowLeft />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        {t('common.back')}
      </Button>
      
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('packingList.title')} - {trip.destination}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {t('packingList.subtitle')}
        </Typography>
      </Box>

      <PackingListComponent 
        tripDetails={trip} 
        onUpdate={handleUpdatePackingList} 
      />
    </Container>
  );
};

export default PackingListPage;