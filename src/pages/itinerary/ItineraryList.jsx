import React from 'react';
import { Typography, Box, Container, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { FiPlus, FiMap, FiCalendar, FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ItineraryList = () => {
  // Mock data - replace with actual data from your API/state
  const itineraries = [
    {
      id: 1,
      title: 'Summer Vacation 2023',
      destination: 'Bali, Indonesia',
      startDate: '2023-07-15',
      endDate: '2023-07-25',
      travelers: 2
    },
    // Add more sample itineraries as needed
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">My Itineraries</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<FiPlus />}
          href="/itinerary/create"
        >
          Create New Itinerary
        </Button>
      </Box>

      <Grid container spacing={3}>
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <Grid item xs={12} sm={6} md={4} key={itinerary.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {itinerary.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FiMap style={{ marginRight: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      {itinerary.destination}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FiCalendar style={{ marginRight: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FiUsers style={{ marginRight: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      {itinerary.travelers} {itinerary.travelers === 1 ? 'Traveler' : 'Travelers'}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button size="small" startIcon={<FiEdit2 />} href={`/itinerary/edit/${itinerary.id}`}>
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<FiTrash2 />}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="subtitle1" color="text.secondary">
                No itineraries found. Create your first itinerary to get started!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ItineraryList;
