import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import { 
  ExpenseList, 
  ExpenseForm, 
  ExpenseSummary, 
  ExpenseChart, 
  ExpenseCategories 
} from '../../components/expenses';
import { useTranslation } from 'react-i18next';

const ExpensesPage = () => {
  const { tripId } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getTripById, updateTrip } = useItinerary();
  
  // State management
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');

  // Unified categories used across form, list, charts, and summary
  const categories = [
    { value: 'food', label: t('expenses.categories.food'), color: '#FF6B6B' },
    { value: 'accommodation', label: t('expenses.categories.accommodation'), color: '#4D96FF' },
    { value: 'transport', label: t('expenses.categories.transport'), color: '#6BCB77' },
    { value: 'activities', label: t('expenses.categories.activities'), color: '#FFD93D' },
    { value: 'shopping', label: t('expenses.categories.shopping'), color: '#A55EEA' },
    { value: 'sightseeing', label: t('expenses.categories.sightseeing'), color: '#FF9F1C' },
    { value: 'other', label: t('expenses.categories.other'), color: '#A5B4C0' }
  ];

  // Load trip and expenses
  useEffect(() => {
    const loadTrip = async () => {
      try {
        setIsLoading(true);
        if (!tripId) {
          setError('No trip selected');
          return;
        }
        
        const tripData = getTripById?.(tripId);
        if (!tripData) {
          setError('Trip not found');
          return;
        }
        
        setTrip(tripData);
        setExpenses(tripData.expenses || []);
        setError(null);
      } catch (err) {
        console.error('Error loading trip:', err);
        setError('Failed to load trip data');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrip();
  }, [tripId, getTripById]);

  // Handle save expense
  const handleSaveExpense = (expenseData) => {
    try {
      const updatedExpenses = editingExpense
        ? expenses.map(exp => 
            exp.id === editingExpense.id ? { ...exp, ...expenseData } : exp
          )
        : [...expenses, { ...expenseData, id: Date.now().toString() }];
      
      setExpenses(updatedExpenses);
      
      // Update trip in context
      if (trip) {
        updateTrip(trip.id, { expenses: updatedExpenses });
      }
      
      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      setError('Failed to save expense');
    }
  };

  // Handle delete expense
  const handleDeleteExpense = (expenseId) => {
    try {
      const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
      setExpenses(updatedExpenses);
      
      // Update trip in context
      if (trip) {
        updateTrip(trip.id, { expenses: updatedExpenses });
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Failed to delete expense');
    }
  };

  // Handle edit expense
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
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
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!tripId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No trip selected
          </Typography>
          <Typography variant="body1" paragraph>
            Please select a trip to view its expenses.
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

  if (!trip) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Trip not found
          </Typography>
          <Typography variant="body1" paragraph>
            The requested trip could not be found.
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Expenses for {trip.destination || 'Trip'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiPlus />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Expense
          </Button>
        </Box>

        {/* Summary Section */}
        <Box sx={{ mb: 4 }}>
          <ExpenseSummary 
            expenses={expenses}
            categories={categories}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Expenses List */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <ExpenseList 
                expenses={expenses}
                categories={categories}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </Paper>
          </Grid>

          {/* Charts and Categories */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <ExpenseChart expenses={expenses} categories={categories} />
            </Paper>
            <Paper sx={{ p: 2 }}>
              <ExpenseCategories 
                onChange={(updated) => {
                  if (trip) {
                    updateTrip(trip.id, { categories: updated });
                  }
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Expense Form Dialog */}
      <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        <DialogContent>
          <ExpenseForm 
            expense={editingExpense}
            categories={categories}
            onSubmit={handleSaveExpense}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ExpensesPage;
