import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Paper, 
  TextField, 
  Grid, 
  InputAdornment,
  Divider,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { 
  FiArrowLeft, 
  FiSave, 
  FiPlus, 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiInfo
} from 'react-icons/fi';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const steps = ['Basic Info', 'Trip Details', 'Review'];

const ItineraryCreate = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { createTrip, updateTrip, trips } = useItinerary();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: null,
    endDate: null,
    travelers: 1,
    budget: '',
    description: '',
    tripType: 'leisure',
    privacy: 'private'
  });
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    } else if (step === 1) {
      if (formData.travelers < 1) newErrors.travelers = 'Number of travelers must be at least 1';
      if (formData.budget && isNaN(formData.budget)) newErrors.budget = 'Budget must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'travelers' ? parseInt(value, 10) || '' : value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async () => {
    try {
      const tripData = {
        title: formData.title,
        destination: formData.destination,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        travelers: formData.travelers,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        description: formData.description,
        tripType: formData.tripType,
        privacy: formData.privacy,
        activities: [],
        expenses: [],
        documents: []
      };

      if (tripId) {
        // Update existing trip
        const existingTrip = trips.find(t => t.id === tripId);
        if (existingTrip) {
          updateTrip(tripId, tripData);
          navigate(`/itinerary/${tripId}`);
        }
      } else {
        // Create new trip
        const newTrip = createTrip(tripData);
        navigate(`/itinerary/${newTrip.id}`);
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trip Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiInfo />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                error={!!errors.destination}
                helperText={errors.destination}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMapPin />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiCalendar />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  minDate={formData.startDate}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!errors.endDate}
                      helperText={errors.endDate}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiCalendar />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.travelers}>
                <InputLabel>Number of Travelers</InputLabel>
                <Select
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <FiUsers />
                    </InputAdornment>
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map((num) => (
                    <MenuItem key={num} value={num === '9+' ? 9 : num}>
                      {num} {num === 1 ? 'Person' : 'People'}
                    </MenuItem>
                  ))}
                </Select>
                {errors.travelers && <FormHelperText>{errors.travelers}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget (optional)"
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                error={!!errors.budget}
                helperText={errors.budget}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiDollarSign />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trip Type</InputLabel>
                <Select
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                >
                  <MenuItem value="leisure">Leisure/Vacation</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="backpacking">Backpacking</MenuItem>
                  <MenuItem value="family">Family Visit</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Privacy</InputLabel>
                <Select
                  name="privacy"
                  value={formData.privacy}
                  onChange={handleChange}
                >
                  <MenuItem value="private">Private (Only Me)</MenuItem>
                  <MenuItem value="shared">Shared with Travelers</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Tell us about your trip..."
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Review Your Trip</Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">TRIP TITLE</Typography>
              <Typography variant="body1" gutterBottom>{formData.title}</Typography>
              
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>DESTINATION</Typography>
              <Typography variant="body1" gutterBottom>{formData.destination}</Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">DATES</Typography>
                  <Typography variant="body1">
                    {formData.startDate ? formData.startDate.toLocaleDateString() : 'Not set'} - 
                    {formData.endDate ? formData.endDate.toLocaleDateString() : 'Not set'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">TRAVELERS</Typography>
                  <Typography variant="body1">{formData.travelers}</Typography>
                </Box>
                {formData.budget && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">BUDGET</Typography>
                    <Typography variant="body1">${formData.budget}</Typography>
                  </Box>
                )}
              </Box>
              
              {formData.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">NOTES</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{formData.description}</Typography>
                </Box>
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Ready to create your itinerary? Click "Create Itinerary" to continue.
            </Typography>
          </Paper>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<FiArrowLeft />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {activeStep === steps.length - 1 ? 'Review & Create' : 'Create New Itinerary'}
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            onClick={handleBack} 
            sx={{ mr: 2 }}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNext}
            startIcon={activeStep === steps.length - 1 ? <FiSave /> : null}
          >
            {activeStep === steps.length - 1 ? 'Create Itinerary' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ItineraryCreate;
