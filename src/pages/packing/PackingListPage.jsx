import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import { generatePackingList } from '../../services/packing';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  IconButton,
  TextField
} from '@mui/material';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiPlus, 
  FiTrash2,
  FiEdit2,
  FiSave
} from 'react-icons/fi';

const PackingListPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, currentTrip } = useItinerary();
  const [packingList, setPackingList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Clothing');

  const categories = [
    'Clothing',
    'Toiletries',
    'Electronics',
    'Documents',
    'Accessories',
    'Medication',
    'Other'
  ];

  useEffect(() => {
    const loadPackingList = async () => {
      try {
        setIsLoading(true);
        const activeTripId = tripId || currentTrip?.id;
        
        if (!activeTripId) {
          setError('No trip selected');
          return;
        }

        // Try to get trip data from session storage first
        const tripData = JSON.parse(sessionStorage.getItem(`trip_${activeTripId}`));
        
        if (!tripData) {
          setError('Trip data not found');
          return;
        }

        // If packing list is already in trip data, use it
        if (tripData.packingList) {
          setPackingList(tripData.packingList);
          return;
        }

        // Otherwise, generate a new packing list
        const list = await generatePackingList(tripData, tripData.weather);
        setPackingList(list);
        
        // Update trip data in session storage with new packing list
        const updatedTrip = { ...tripData, packingList: list };
        sessionStorage.setItem(`trip_${activeTripId}`, JSON.stringify(updatedTrip));
        
      } catch (err) {
        console.error('Error loading packing list:', err);
        setError('Failed to generate packing list. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPackingList();
  }, [tripId, currentTrip]);

  const toggleItem = (category, itemId) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId ? { ...item, packed: !item.packed } : item
      )
    }));
  };

  const addItem = () => {
    if (!newItem.trim() || !newCategory) return;
    
    const newItemObj = {
      id: Date.now().toString(),
      name: newItem.trim(),
      packed: false,
      custom: true
    };
    
    setPackingList(prev => ({
      ...prev,
      [newCategory]: [...(prev[newCategory] || []), newItemObj]
    }));
    
    setNewItem('');
  };

  const deleteItem = (category, itemId) => {
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (category, itemId, newName) => {
    if (!newName.trim()) return;
    
    setPackingList(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === itemId ? { ...item, name: newName.trim() } : item
      )
    }));
    
    setEditingItem(null);
  };

  const savePackingList = () => {
    const activeTripId = tripId || currentTrip?.id;
    if (!activeTripId) return;
    
    const tripData = JSON.parse(sessionStorage.getItem(`trip_${activeTripId}`)) || {};
    const updatedTrip = { ...tripData, packingList };
    sessionStorage.setItem(`trip_${activeTripId}`, JSON.stringify(updatedTrip));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!tripId && !currentTrip?.id) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No trip selected
          </Typography>
          <Typography variant="body1" paragraph>
            Please select a trip to view its packing list.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/itinerary')}
            startIcon={<FiArrowLeft />}
          >
            Back to Itineraries
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!packingList) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Packing list not available
          </Typography>
          <Typography variant="body1" paragraph>
            We couldn't generate a packing list for this trip.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  const packedCount = Object.values(packingList).reduce((count, items) => {
    return count + items.filter(item => item.packed).length;
  }, 0);
  
  const totalItems = Object.values(packingList).reduce((count, items) => count + items.length, 0);
  const progress = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Packing List
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {packedCount} of {totalItems} items packed ({progress}%)
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<FiSave />}
            onClick={savePackingList}
          >
            Save Changes
          </Button>
        </Box>
        
        <Box sx={{ mb: 4, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
          <Box 
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
              overflow: 'hidden',
              mb: 2
            }}
          >
            <Box 
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: 'primary.main',
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary" align="right">
            {progress}% complete
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Add New Item */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add New Item
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Item name"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  sx={{ flex: 1, minWidth: 200 }}
                />
                <TextField
                  select
                  size="small"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: 150 }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </TextField>
                <Button 
                  variant="contained" 
                  startIcon={<FiPlus />}
                  onClick={addItem}
                  disabled={!newItem.trim()}
                >
                  Add
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Packing List Categories */}
          {Object.entries(packingList).map(([category, items]) => (
            <Grid item xs={12} md={6} lg={4} key={category}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="h2">
                      {category}
                    </Typography>
                    <Chip 
                      label={`${items.filter(i => i.packed).length}/${items.length}`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <List dense>
                    {items.map(item => (
                      <ListItem 
                        key={item.id} 
                        dense 
                        button
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Checkbox
                            edge="start"
                            checked={item.packed}
                            onChange={() => toggleItem(category, item.id)}
                            size="small"
                            color="primary"
                          />
                        </ListItemIcon>
                        
                        {editingItem?.id === item.id ? (
                          <Box display="flex" width="100%" alignItems="center">
                            <TextField
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                              size="small"
                              fullWidth
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  updateItem(category, item.id, editingItem.name);
                                } else if (e.key === 'Escape') {
                                  setEditingItem(null);
                                }
                              }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => updateItem(category, item.id, editingItem.name)}
                              color="primary"
                            >
                              <FiCheck />
                            </IconButton>
                          </Box>
                        ) : (
                          <>
                            <ListItemText 
                              primary={
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    textDecoration: item.packed ? 'line-through' : 'none',
                                    color: item.packed ? 'text.secondary' : 'text.primary'
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              } 
                            />
                            <Box>
                              {item.custom && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => setEditingItem(item)}
                                  sx={{ mr: 0.5 }}
                                >
                                  <FiEdit2 size={16} />
                                </IconButton>
                              )}
                              {item.custom && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => deleteItem(category, item.id)}
                                  color="error"
                                >
                                  <FiTrash2 size={16} />
                                </IconButton>
                              )}
                            </Box>
                          </>
                        )}
                      </ListItem>
                    ))}
                    
                    {items.length === 0 && (
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic', pl: 4 }}>
                        No items in this category
                      </Typography>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default PackingListPage;
