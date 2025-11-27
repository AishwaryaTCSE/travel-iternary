import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Divider, 
  Chip,
  IconButton
} from '@mui/material';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiInfo,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Mock data - replace with actual data fetching
  const itinerary = {
    id: id,
    title: 'Summer Vacation 2023',
    destination: 'Bali, Indonesia',
    startDate: '2023-07-15',
    endDate: '2023-07-25',
    description: 'A relaxing vacation exploring the beautiful beaches and culture of Bali.',
    travelers: 2,
    budget: 2500,
    status: 'upcoming',
    activities: [
      { id: 1, day: 1, title: 'Arrival in Denpasar', time: '14:00', location: 'Ngurah Rai International Airport' },
      { id: 2, day: 2, title: 'Ubud Tour', time: '09:00', location: 'Ubud' },
    ]
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/itinerary/edit/${id}`);
  };

  const handleDelete = () => {
    // Implement delete functionality
    console.log('Delete itinerary', id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<FiArrowLeft />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Itineraries
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {itinerary.title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Chip 
                icon={<FiMapPin size={16} />} 
                label={itinerary.destination} 
                variant="outlined" 
                size="small"
              />
              <Chip 
                icon={<FiCalendar size={16} />} 
                label={`${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`} 
                variant="outlined" 
                size="small"
              />
              <Chip 
                icon={<FiUsers size={16} />} 
                label={`${itinerary.travelers} ${itinerary.travelers === 1 ? 'Traveler' : 'Travelers'}`} 
                variant="outlined" 
                size="small"
              />
              <Chip 
                icon={<FiDollarSign size={16} />} 
                label={`$${itinerary.budget}`} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
            </Box>
          </Box>
          <Box>
            <IconButton onClick={handleEdit} color="primary" sx={{ mr: 1 }}>
              <FiEdit2 />
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
              <FiTrash2 />
            </IconButton>
          </Box>
        </Box>

        <Paper sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>About This Trip</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {itinerary.description}
          </Typography>
        </Paper>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Activities" />
          <Tab label="Accommodations" />
          <Tab label="Transportation" />
          <Tab label="Expenses" />
          <Tab label="Packing List" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>Upcoming Activities</Typography>
            {itinerary.activities.slice(0, 3).map(activity => (
              <Paper key={activity.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="subtitle2">Day {activity.day}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{activity.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <FiMapPin size={14} style={{ marginRight: 4 }} />
                      <Typography variant="body2" color="text.secondary">
                        {activity.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Button size="small" variant="outlined">View Details</Button>
                </Box>
              </Paper>
            ))}
            <Button 
              fullWidth 
              variant="text" 
              sx={{ mt: 1 }}
              onClick={() => setTabValue(1)}
            >
              View All Activities
            </Button>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Activities</Typography>
            {itinerary.activities.map(activity => (
              <Paper key={activity.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ textAlign: 'center', minWidth: 60 }}>
                    <Typography variant="subtitle2">Day {activity.day}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{activity.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <FiMapPin size={14} style={{ marginRight: 4 }} />
                      <Typography variant="body2" color="text.secondary">
                        {activity.location}
                      </Typography>
                    </Box>
                  </Box>
                  <Button size="small" variant="outlined">View Details</Button>
                </Box>
              </Paper>
            ))}
            <Button 
              variant="contained" 
              startIcon={<FiPlus />}
              sx={{ mt: 2 }}
            >
              Add Activity
            </Button>
          </Box>
        )}

        {tabValue !== 0 && tabValue !== 1 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Box sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}>
              {tabValue === 2 && '🏨'}
              {tabValue === 3 && '🚗'}
              {tabValue === 4 && '💰'}
              {tabValue === 5 && '🧳'}
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {tabValue === 2 && 'No Accommodations Added'}
              {tabValue === 3 && 'No Transportation Added'}
              {tabValue === 4 && 'No Expenses Tracked'}
              {tabValue === 5 && 'Packing List is Empty'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This section is coming soon!
            </Typography>
            <Button variant="outlined">Add New</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ItineraryDetail;
