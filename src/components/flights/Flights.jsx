import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { 
  FiNavigation, 
  FiClock, 
  FiMapPin, 
  FiDollarSign,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import { searchFlights, getPopularRoutes } from '../../api/flightsApi';

const Flights = ({ tripId, destination, startDate, endDate }) => {
  const [flights, setFlights] = useState({ outbound: [], return: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: destination || '',
    departureDate: startDate || '',
    returnDate: endDate || '',
    passengers: 1,
    tripType: 'round'
  });

  useEffect(() => {
    if (destination && startDate) {
      handleSearch();
    }
  }, [destination, startDate]);

  const handleSearch = async () => {
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchFlights(
        searchParams.origin,
        searchParams.destination,
        searchParams.departureDate,
        searchParams.tripType === 'round' ? searchParams.returnDate : null,
        searchParams.passengers
      );
      setFlights(results);
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return time;
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const FlightCard = ({ flight, type = 'outbound' }) => (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FiNavigation size={24} color="#1976d2" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {flight.airline}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {flight.flightNumber}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Typography variant="h6">{flight.departure.time}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {flight.departure.airport}
                </Typography>
              </Box>
              <FiArrowRight />
              <Box>
                <Typography variant="h6">{flight.arrival.time}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {flight.arrival.airport}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FiClock size={16} />
              <Typography variant="body2">{flight.duration}</Typography>
            </Box>
            {flight.stops > 0 && (
              <Chip 
                label={`${flight.stops} stop${flight.stops > 1 ? 's' : ''}`} 
                size="small" 
                color="warning"
                sx={{ mt: 0.5 }}
              />
            )}
            {flight.stops === 0 && (
              <Chip 
                label="Direct" 
                size="small" 
                color="success"
                sx={{ mt: 0.5 }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatPrice(flight.price, flight.currency)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {flight.class}
            </Typography>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              onClick={() => alert(`Booking flight ${flight.flightNumber}`)}
            >
              Book
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Flight Search
      </Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Trip Type</InputLabel>
              <Select
                value={searchParams.tripType}
                onChange={(e) => setSearchParams({ ...searchParams, tripType: e.target.value })}
                label="Trip Type"
              >
                <MenuItem value="one-way">One Way</MenuItem>
                <MenuItem value="round">Round Trip</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="From"
              value={searchParams.origin}
              onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
              placeholder="City or Airport"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="To"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              placeholder="City or Airport"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="Departure"
              value={searchParams.departureDate}
              onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {searchParams.tripType === 'round' && (
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Return"
                value={searchParams.returnDate}
                onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Passengers"
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) || 1 })}
              inputProps={{ min: 1, max: 9 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiSearch />}
              onClick={handleSearch}
              disabled={loading}
              fullWidth
              sx={{ mt: 1 }}
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Outbound Flights */}
      {!loading && flights.outbound.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Outbound Flights ({flights.outbound.length} found)
          </Typography>
          {flights.outbound.map(flight => (
            <FlightCard key={flight.id} flight={flight} type="outbound" />
          ))}
        </Box>
      )}

      {/* Return Flights */}
      {!loading && flights.return && flights.return.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Return Flights ({flights.return.length} found)
          </Typography>
          {flights.return.map(flight => (
            <FlightCard key={flight.id} flight={flight} type="return" />
          ))}
        </Box>
      )}

      {!loading && flights.outbound.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FiNavigation size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No flights found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Flights;

