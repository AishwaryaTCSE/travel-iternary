import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  FiMapPin, 
  FiDollarSign, 
  FiPackage, 
  FiPlus, 
  FiX,
  FiHome,
  FiStar,
  FiCamera
} from 'react-icons/fi';

// Load Google Maps script
const loadGoogleMapsScript = (apiKey, callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  script.onerror = () => {
    console.error('Failed to load Google Maps script');
  };
  document.head.appendChild(script);
};

const GoogleMapsItinerary = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  
  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    budget: '',
    startDate: '',
    endDate: '',
    travelers: 1
  });

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Initialize map
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.');
      return;
    }

    if (!mapRef.current) return;

    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY, () => {
      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20.5937, lng: 78.9629 }, // Default to India center
          zoom: 6,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();
        
        // Load saved itineraries from localStorage
        const saved = localStorage.getItem('googleMapsItineraries');
        if (saved) {
          const parsed = JSON.parse(saved);
          setItineraries(parsed);
          if (parsed.length > 0) {
            loadItineraryOnMap(parsed[0], map);
          }
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize Google Maps. Please check your API key.');
      }
    });
  }, [GOOGLE_MAPS_API_KEY]);

  // Geocode destination address
  const geocodeAddress = useCallback((address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }, []);

  // Search for places near a location
  const searchNearbyPlaces = useCallback((location, type, keyword) => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
      const request = {
        location: location,
        radius: 5000,
        type: type,
        keyword: keyword
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results || []);
        } else {
          resolve([]); // Return empty array instead of rejecting
        }
      });
    });
  }, []);

  // Load itinerary on map
  const loadItineraryOnMap = useCallback(async (itinerary, map) => {
    if (!map) map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    infoWindowRef.current.close();

    try {
      setLoading(true);
      setCurrentItinerary(itinerary);

      // Geocode destination
      const location = await geocodeAddress(itinerary.destination);
      map.setCenter(location);
      map.setZoom(13);

      // Add destination marker
      const destinationMarker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: itinerary.destination,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      const destinationInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0;">${itinerary.destination}</h3>
            <p><strong>Budget:</strong> $${itinerary.budget}</p>
            <p><strong>Dates:</strong> ${itinerary.startDate} to ${itinerary.endDate}</p>
            <p><strong>Travelers:</strong> ${itinerary.travelers}</p>
          </div>
        `
      });

      destinationMarker.addListener('click', () => {
        infoWindowRef.current.close();
        destinationInfoWindow.open(map, destinationMarker);
      });

      markersRef.current.push(destinationMarker);

      // Search for hotels
      const hotels = await searchNearbyPlaces(location, 'lodging', 'hotel');
      hotels.slice(0, 5).forEach((place, index) => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        const infoContent = createInfoWindowContent(place, 'hotel', itinerary);
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindowRef.current.close();
          infoWindow.open(map, marker);
          setSelectedMarker({ place, type: 'hotel', itinerary });
        });

        markersRef.current.push(marker);
      });

      // Search for attractions
      const attractions = await searchNearbyPlaces(location, 'tourist_attraction', 'attraction');
      attractions.slice(0, 8).forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
          }
        });

        const infoContent = createInfoWindowContent(place, 'attraction', itinerary);
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindowRef.current.close();
          infoWindow.open(map, marker);
          setSelectedMarker({ place, type: 'attraction', itinerary });
        });

        markersRef.current.push(marker);
      });

      // Search for restaurants
      const restaurants = await searchNearbyPlaces(location, 'restaurant', 'restaurant');
      restaurants.slice(0, 6).forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          }
        });

        const infoContent = createInfoWindowContent(place, 'restaurant', itinerary);
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          infoWindowRef.current.close();
          infoWindow.open(map, marker);
          setSelectedMarker({ place, type: 'restaurant', itinerary });
        });

        markersRef.current.push(marker);
      });

    } catch (err) {
      console.error('Error loading itinerary:', err);
      setError('Failed to load places. Please check your destination and try again.');
    } finally {
      setLoading(false);
    }
  }, [geocodeAddress, searchNearbyPlaces]);

  // Create info window content
  const createInfoWindowContent = (place, type, itinerary) => {
    const rating = place.rating ? `⭐ ${place.rating}` : 'No rating';
    const priceLevel = place.price_level ? '$'.repeat(place.price_level) : 'Price not available';
    const address = place.vicinity || place.formatted_address || 'Address not available';

    // Calculate expenses based on type
    const expenses = calculateExpenses(type, itinerary);
    const packingItems = getPackingItems(type, itinerary);

    return `
      <div style="padding: 15px; min-width: 300px; max-width: 400px;">
        <h3 style="margin: 0 0 10px 0; color: #1976d2;">${place.name}</h3>
        <p style="margin: 5px 0;"><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
        <p style="margin: 5px 0;"><strong>Rating:</strong> ${rating}</p>
        <p style="margin: 5px 0;"><strong>Price:</strong> ${priceLevel}</p>
        <p style="margin: 5px 0; color: #666; font-size: 12px;">📍 ${address}</p>
        <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
        <div style="margin-top: 15px;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px;">💰 Estimated Expenses:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
            ${expenses.map(exp => `<li>${exp}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 15px;">
          <h4 style="margin: 0 0 10px 0; font-size: 14px;">🎒 Packing Suggestions:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
            ${packingItems.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  };

  // Calculate expenses based on place type
  const calculateExpenses = (type, itinerary) => {
    const budget = parseFloat(itinerary.budget) || 1000;
    const travelers = itinerary.travelers || 1;
    const days = calculateDays(itinerary.startDate, itinerary.endDate);

    switch (type) {
      case 'hotel':
        const avgHotelPrice = budget * 0.4 / days / travelers;
        return [
          `Accommodation: $${avgHotelPrice.toFixed(0)}/night`,
          `Taxes & Fees: $${(avgHotelPrice * 0.15).toFixed(0)}`,
          `Total for ${days} nights: $${(avgHotelPrice * days * travelers).toFixed(0)}`
        ];
      case 'restaurant':
        const avgMealPrice = budget * 0.2 / (days * 3);
        return [
          `Average meal: $${avgMealPrice.toFixed(0)}`,
          `Daily food budget: $${(avgMealPrice * 3 * travelers).toFixed(0)}`,
          `Total food cost: $${(avgMealPrice * 3 * days * travelers).toFixed(0)}`
        ];
      case 'attraction':
        const avgTicketPrice = budget * 0.15 / days / travelers;
        return [
          `Entry ticket: $${avgTicketPrice.toFixed(0)}`,
          `Guided tour (optional): $${(avgTicketPrice * 1.5).toFixed(0)}`,
          `Total for ${travelers} travelers: $${(avgTicketPrice * travelers).toFixed(0)}`
        ];
      default:
        return ['Expense calculation not available'];
    }
  };

  // Get packing items based on place type
  const getPackingItems = (type, itinerary) => {
    const baseItems = ['Valid ID/Passport', 'Travel insurance documents', 'Phone charger'];
    
    switch (type) {
      case 'hotel':
        return [...baseItems, 'Comfortable sleepwear', 'Travel adapter', 'Toiletries'];
      case 'restaurant':
        return [...baseItems, 'Comfortable walking shoes', 'Dress code appropriate clothing'];
      case 'attraction':
        return [...baseItems, 'Camera/Phone', 'Comfortable shoes', 'Water bottle', 'Sunscreen', 'Hat'];
      default:
        return baseItems;
    }
  };

  // Calculate days between dates
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // Handle form submission
  const handleCreateItinerary = async () => {
    if (!formData.title || !formData.destination || !formData.budget) {
      setError('Please fill in all required fields');
      return;
    }

    const newItinerary = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updated = [...itineraries, newItinerary];
    setItineraries(updated);
    localStorage.setItem('googleMapsItineraries', JSON.stringify(updated));
    
    setShowCreateDialog(false);
    setFormData({
      title: '',
      destination: '',
      budget: '',
      startDate: '',
      endDate: '',
      travelers: 1
    });

    // Load new itinerary on map
    await loadItineraryOnMap(newItinerary);
  };

  // Handle itinerary selection
  const handleSelectItinerary = async (itinerary) => {
    await loadItineraryOnMap(itinerary);
  };

  // Delete itinerary
  const handleDeleteItinerary = (id) => {
    const updated = itineraries.filter(it => it.id !== id);
    setItineraries(updated);
    localStorage.setItem('googleMapsItineraries', JSON.stringify(updated));
    
    if (updated.length > 0) {
      loadItineraryOnMap(updated[0]);
    } else {
      // Clear map
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      setCurrentItinerary(null);
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Google Maps API Key Required
          </Typography>
          <Typography variant="body2">
            Please set VITE_GOOGLE_MAPS_API_KEY in your .env file to use this component.
            <br />
            Get your API key from: <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Travel Itinerary Planner
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage your travel itineraries with interactive maps
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Sidebar - Itinerary List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Your Itineraries</Typography>
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => setShowCreateDialog(true)}
                size="small"
              >
                New Itinerary
              </Button>
            </Box>

            {itineraries.length === 0 ? (
              <Alert severity="info">
                No itineraries yet. Create your first one!
              </Alert>
            ) : (
              <List>
                {itineraries.map((itinerary) => (
                  <Card
                    key={itinerary.id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      border: currentItinerary?.id === itinerary.id ? 2 : 1,
                      borderColor: currentItinerary?.id === itinerary.id ? 'primary.main' : 'divider',
                      '&:hover': { boxShadow: 4 }
                    }}
                    onClick={() => handleSelectItinerary(itinerary)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {itinerary.title}
                          </Typography>
                          <Chip
                            icon={<FiMapPin />}
                            label={itinerary.destination}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            <FiDollarSign style={{ display: 'inline', marginRight: 4 }} />
                            Budget: ${itinerary.budget}
                          </Typography>
                          {itinerary.startDate && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {itinerary.startDate} to {itinerary.endDate || 'TBD'}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItinerary(itinerary.id);
                          }}
                        >
                          <FiX />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Map Container */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 1, height: '600px', position: 'relative' }}>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  zIndex: 1000
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Create Itinerary Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Itinerary</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trip Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Vacation 2024"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destination *"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Bangkok, Thailand"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget ($) *"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                InputProps={{
                  startAdornment: <FiDollarSign style={{ marginRight: 8 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Travelers"
                type="number"
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateItinerary} variant="contained">
            Create Itinerary
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GoogleMapsItinerary;

