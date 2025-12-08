import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
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
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiPlus,
  FiMap,
  FiSun,
  FiPackage,
  FiFileText,
  FiNavigation,
  FiClock,
  FiDollarSign as FiCurrency
} from 'react-icons/fi';

// Import components
import EnhancedMapView from '../../components/maps/EnhancedMapView';
import PlacesMap from '../../components/places/PlacesMap';
import Weather from '../../components/weather/Weather';
import Flights from '../../components/flights/Flights';
import CurrencyConverter from '../../components/currency/CurrencyConverter';
import SmartPackingList from '../../components/packing/SmartPackingList';
import DocumentChecklist from '../../components/documents/DocumentChecklist';
import TripRecommendations from '../../components/recommendations/TripRecommendations';
import { ExpenseList, ExpenseSummary } from '../../components/expenses';
import ActivityForm from '../../components/itinerary/ActivityForm';

const ItineraryDetail = () => {
  const { id, tripId } = useParams();
  const detailId = id || tripId;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'overview';
  
  const { trips, deleteTrip, updateTrip, addActivity, updateActivity, deleteActivity } = useItinerary();
  const [tabValue, setTabValue] = useState(tabParam);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [expenses, setExpenses] = useState(() => {
    // Initialize expenses from the current trip if available
    const foundTrip = trips.find(t => t.id === (id || tripId));
    return foundTrip?.expenses || [];
  });
  
  // Update tab value when URL changes
  useEffect(() => {
    setTabValue(tabParam);
  }, [tabParam]);

  useEffect(() => {
    const loadItinerary = () => {
      try {
        setLoading(true);
        const foundTrip = trips.find(t => t.id === detailId);
        
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

    loadItinerary();
  }, [detailId, trips]);

  // Reload itinerary after CRUD operations
  useEffect(() => {
    if (trips.length > 0) {
      const foundTrip = trips.find(t => t.id === detailId);
      if (foundTrip) {
        setItinerary(foundTrip);
        // Update expenses when the trip data changes
        if (foundTrip.expenses) {
          setExpenses(foundTrip.expenses);
        }
      }
    }
  }, [trips, detailId]);

  const handleTabChange = (event, newValue) => {
    setSearchParams({ tab: newValue });
  };

  const handleBack = () => {
    navigate('/itinerary');
  };

  const handleEdit = () => {
    navigate(`/itinerary/create?id=${detailId}`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      deleteTrip(detailId);
      navigate('/itinerary');
    }
  };

  const handleSaveActivity = (activityData) => {
    if (editingActivity) {
      updateActivity(detailId, editingActivity.id, activityData);
    } else {
      addActivity(detailId, activityData);
    }
    setShowActivityForm(false);
    setEditingActivity(null);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowActivityForm(true);
  };

  const handleDeleteActivity = (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      deleteActivity(detailId, activityId);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !itinerary) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Itinerary not found'}
        </Alert>
        <Button startIcon={<FiArrowLeft />} onClick={handleBack}>
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
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Itineraries
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {itinerary.title || itinerary.name || 'Untitled Trip'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Chip 
                icon={<FiMapPin size={16} />} 
                label={itinerary.destination} 
                variant="outlined" 
                size="small"
              />
              {itinerary.startDate && itinerary.endDate && (
                <Chip 
                  icon={<FiCalendar size={16} />} 
                  label={`${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`} 
                  variant="outlined" 
                  size="small"
                />
              )}
              {itinerary.travelers && (
                <Chip 
                  icon={<FiUsers size={16} />} 
                  label={`${itinerary.travelers} ${itinerary.travelers === 1 ? 'Traveler' : 'Travelers'}`} 
                  variant="outlined" 
                  size="small"
                />
              )}
              {itinerary.budget && (
                <Chip 
                  icon={<FiDollarSign size={16} />} 
                  label={`$${itinerary.budget}`} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
              )}
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

        {itinerary.description && (
          <Paper sx={{ mb: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>About This Trip</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {itinerary.description}
            </Typography>
          </Paper>
        )}

        <Tabs 
          value={tabValue}
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="overview" icon={<FiMapPin />} label="Overview" iconPosition="start" />
          <Tab value="map" icon={<FiMap />} label="Map" iconPosition="start" />
          <Tab value="weather" icon={<FiSun />} label="Weather" iconPosition="start" />
          <Tab value="expenses" icon={<FiDollarSign />} label="Expenses" iconPosition="start" />
          <Tab value="packing" icon={<FiPackage />} label="Packing" iconPosition="start" />
          <Tab value="documents" icon={<FiFileText />} label="Documents" iconPosition="start" />
          <Tab value="flights" icon={<FiNavigation />} label="Flights" iconPosition="start" />
          <Tab value="currency" icon={<FiCurrency />} label="Currency" iconPosition="start" />
        </Tabs>

      <Divider sx={{ mb: 3 }} />

      {/* Overview Tab */}
      {tabValue === 'overview' && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Trip Overview</Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Trip Details
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Destination:</strong> {itinerary.destination}
                  </Typography>
                  {itinerary.startDate && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Start Date:</strong> {new Date(itinerary.startDate).toLocaleDateString()}
                    </Typography>
                  )}
                  {itinerary.endDate && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>End Date:</strong> {new Date(itinerary.endDate).toLocaleDateString()}
                    </Typography>
                  )}
                  {itinerary.travelers && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Travelers:</strong> {itinerary.travelers}
                    </Typography>
                  )}
                  {itinerary.budget && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Budget:</strong> ${itinerary.budget}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Activities ({itinerary.activities?.length || 0})
                  </Typography>
                  <Button 
                    size="small" 
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={() => {
                      setEditingActivity(null);
                      setShowActivityForm(true);
                    }}
                  >
                    Add Activity
                  </Button>
                </Box>
                
                {showActivityForm && (
                  <Box sx={{ mb: 2 }}>
                    <ActivityForm
                      initialData={editingActivity || {}}
                      onSave={handleSaveActivity}
                      onCancel={() => {
                        setShowActivityForm(false);
                        setEditingActivity(null);
                      }}
                      onDelete={editingActivity ? () => handleDeleteActivity(editingActivity.id) : null}
                      isEdit={!!editingActivity}
                    />
                  </Box>
                )}

                {itinerary.activities && itinerary.activities.length > 0 ? (
                  <Box sx={{ mt: 1 }}>
                    {itinerary.activities.map((activity, index) => (
                      <Paper 
                        key={activity.id || index} 
                        sx={{ mb: 1, p: 1.5, bgcolor: 'action.hover', borderRadius: 1, '&:hover': { bgcolor: 'action.selected' } }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {activity.title || activity.name}
                            </Typography>
                            {activity.location && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                <FiMapPin size={12} style={{ marginRight: 4 }} />
                                {activity.location}
                              </Typography>
                            )}
                            {activity.time && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                <FiClock size={12} style={{ marginRight: 4 }} />
                                {activity.time}
                              </Typography>
                            )}
                            {activity.description && (
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                {activity.description}
                              </Typography>
                            )}
                          </Box>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditActivity(activity)}
                              sx={{ mr: 0.5 }}
                            >
                              <FiEdit2 size={16} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteActivity(activity.id)}
                            >
                              <FiTrash2 size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    No activities yet. Click "Add Activity" to get started.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Packing List Tab - Smart packing based on weather and destination */}
      {tabValue === 'packing' && (
        <Box>
          <SmartPackingList
            destination={itinerary.destination}
            startDate={itinerary.startDate}
            endDate={itinerary.endDate}
            travelers={itinerary.travelers || 1}
          />
        </Box>
      )}

      {/* Map Tab */}
      {tabValue === 'map' && (
        <Box>
          <EnhancedMapView
            itinerary={itinerary}
          />
        </Box>
      )}

      {/* Weather Tab */}
      {tabValue === 'weather' && (
        <Box>
          <Weather
            destination={itinerary.destination}
            startDate={itinerary.startDate}
            endDate={itinerary.endDate}
          />
        </Box>
      )}

      {/* Expenses Tab */}
      {tabValue === 'expenses' && (
        <Box>
          <ExpenseSummary tripId={detailId} />
          <ExpenseList 
            tripId={detailId}
            expenses={expenses}
            onAddExpense={(newExpense) => {
              const updatedExpenses = [...expenses, { 
                ...newExpense, 
                id: Date.now().toString(),
                date: new Date().toISOString() // Ensure date is in correct format
              }];
              setExpenses(updatedExpenses);
              
              // Update the trip with the new expenses
              const updatedTrip = {
                ...itinerary,
                expenses: updatedExpenses
              };
              updateTrip(detailId, updatedTrip);
            }}
            onUpdateExpense={(updatedExpense) => {
              const updatedExpenses = expenses.map(exp => 
                exp.id === updatedExpense.id ? updatedExpense : exp
              );
              setExpenses(updatedExpenses);
              
              // Update the trip with the updated expenses
              const updatedTrip = {
                ...itinerary,
                expenses: updatedExpenses
              };
              updateTrip(detailId, updatedTrip);
            }}
            onDeleteExpense={(expenseId) => {
              const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
              setExpenses(updatedExpenses);
              
              // Update the trip with the filtered expenses
              const updatedTrip = {
                ...itinerary,
                expenses: updatedExpenses
              };
              updateTrip(detailId, updatedTrip);
            }}
            onViewReceipt={(receiptUrl) => {
              if (receiptUrl) {
                window.open(receiptUrl, '_blank');
              }
            }}
            currency="USD"
            categories={[
              { value: 'food', label: '🍔 Food & Drinks' },
              { value: 'accommodation', label: '🏨 Accommodation' },
              { value: 'transport', label: '🚗 Transportation' },
              { value: 'activities', label: '🎡 Activities' },
              { value: 'shopping', label: '🛍️ Shopping' },
              { value: 'sightseeing', label: '🏛️ Sightseeing' },
              { value: 'health', label: '🏥 Health' },
              { value: 'other', label: '📌 Other' }
            ]}
          />
        </Box>
      )}

      {/* Documents Tab - Checklist based on destination */}
      {tabValue === 'documents' && (
        <Box>
          <DocumentChecklist
            destination={itinerary.destination}
            startDate={itinerary.startDate}
            endDate={itinerary.endDate}
          />
        </Box>
      )}

      {/* Flights Tab */}
      {tabValue === 'flights' && (
        <Box>
          <Flights
            tripId={detailId}
            destination={itinerary.destination}
            startDate={itinerary.startDate}
            endDate={itinerary.endDate}
          />
        </Box>
      )}

      {/* Currency Tab */}
      {tabValue === 'currency' && (
        <Box>
          <CurrencyConverter
            destination={itinerary.destination}
            baseCurrency="USD"
          />
        </Box>
      )}
      </Box>
    </Container>
  );
};

export default ItineraryDetail;
