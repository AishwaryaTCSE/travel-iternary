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
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import { 
  ExpenseList, 
  ExpenseForm, 
  ExpenseSummary, 
  ExpenseChart, 
  ExpenseCategories 
} from '../../components/expenses';

const Expenses = () => {
  const { tripId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { getTripById, updateTrip } = useItinerary();
  
  // State management
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Load trip and expenses
  const [filters] = useState({
    category: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    amount: '',
    category: '',
    date: new Date(),
    notes: ''
  });

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    dailyAverage: 0,
  });

  // Calculate statistics - Wrapped in useCallback for dependency array in useEffect
  const calculateStats = useCallback((expensesList) => {
    const total = expensesList.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = {};

    expensesList.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });

    // Calculate daily average (simple implementation)
    // Map dates to Date objects and then to date strings to count unique days
    const days = new Set(expensesList.map(exp => new Date(exp.date).toDateString())).size;
    const dailyAverage = days > 0 ? total / days : 0;

    setStats({
      total,
      byCategory,
      dailyAverage: parseFloat(dailyAverage.toFixed(2)),
    });
  }, []); // Empty dependency array as it only uses local variables and state setters

  // Load trip and expenses data
  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        if (tripId && getTripById) {
          const tripData = await getTripById(tripId);
          if (tripData) {
            setTrip(tripData);

            // Ensure date objects are correctly created from stored dates (if they are strings)
            const processedExpenses = (tripData.expenses || []).map(exp => ({
                ...exp,
                date: new Date(exp.date),
            }));

            if (processedExpenses.length > 0) {
              setExpenses(processedExpenses);
            } else {
              // Fallback to sample data if no expenses exist
              const sampleExpenses = [
                { id: 1, description: 'Hotel Booking', amount: 120, category: 'Accommodation', date: new Date(), notes: '2 nights at Grand Hotel' },
                { id: 2, description: 'Dinner', amount: 45.50, category: 'Food & Drinks', date: new Date(Date.now() - 86400000), notes: 'Italian restaurant' },
                { id: 3, description: 'Museum Tickets', amount: 28, category: 'Activities', date: new Date(), notes: 'City Museum entrance' },
              ];
              setExpenses(sampleExpenses);
            }
          }
        }
      } catch (err) {
        console.error('Error loading trip:', err);
        setError(err.message || 'Failed to load trip data.');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, getTripById]);

  // **FIXED:** Recalculate stats whenever expenses change.
  useEffect(() => {
    calculateStats(expenses);
  }, [expenses, calculateStats]);


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date || new Date()
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all required fields (Description, Amount, Category, Date).');
      return;
    }

    if (editingExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(exp =>
        exp.id === editingExpense.id ? { ...formData, id: editingExpense.id, amount: parseFloat(formData.amount) } : exp
      );
      setExpenses(updatedExpenses);
    } else {
      // Add new expense
      const newExpense = {
        ...formData,
        id: expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1,
        amount: parseFloat(formData.amount)
      };
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
    }

    // Reset form and close dialog
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date(),
      notes: ''
    });
    setEditingExpense(null);
    setOpenDialog(false);
  };

  // Handle edit expense
  const handleEdit = (expense) => {
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes || ''
    });
    setEditingExpense(expense);
    setOpenDialog(true);
  };

  // Handle delete expense
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(exp => exp.id !== id);
      setExpenses(updatedExpenses);
    }
  };

  // Prepare chart data using useMemo for optimization
  const chartData = useMemo(() => {
    const categoryLabels = Object.keys(stats.byCategory);
    const categoryData = Object.values(stats.byCategory);
    const backgroundColors = [
      'rgba(54, 162, 235, 0.6)', // Blue
      'rgba(255, 99, 132, 0.6)', // Red
      'rgba(255, 206, 86, 0.6)', // Yellow
      'rgba(75, 192, 192, 0.6)', // Green
      'rgba(153, 102, 255, 0.6)', // Purple
      'rgba(255, 159, 64, 0.6)', // Orange
      'rgba(199, 199, 199, 0.6)'  // Grey
    ];

    return {
      labels: categoryLabels,
      datasets: [
        {
          label: `Amount Spent (${currency.symbol})`,
          data: categoryData,
          backgroundColor: categoryLabels.map((_, index) => backgroundColors[index % backgroundColors.length]),
          borderColor: categoryLabels.map((_, index) => backgroundColors[index % backgroundColors.length].replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  }, [stats.byCategory, currency.symbol]); // Re-calculate when stats change

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart height to be managed by the parent container
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: `Amount (${currency.symbol})`,
        },
      },
    },
  };
  
  // Find the top category for the stats card
  const topCategoryEntry = useMemo(() => {
    if (Object.keys(stats.byCategory).length === 0) return null;
    return Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0];
  }, [stats.byCategory]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Trip Data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography>Error: {error}</Typography>
          <Typography variant="body2">Could not load trip expenses for Trip ID: {tripId}</Typography>
        </Alert>
        <Button 
          startIcon={<FiArrowLeft />} 
          onClick={() => navigate(-1)} 
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Expenses for Trip: **{trip?.name || 'Unnamed Trip'}**
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => {
                // Reset form state before opening for new expense
                setEditingExpense(null);
                setFormData({
                  description: '',
                  amount: '',
                  category: '',
                  date: new Date(),
                  notes: ''
                });
                setOpenDialog(true);
              }}
              sx={{ mr: 1 }}
            >
              Add Expense
            </Button>
            {/* The following icons are present but not implemented with logic */}
            <Tooltip title="Export as CSV">
              <IconButton>
                <FiDownload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton>
                <FiPrinter />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>💰 Total Spent</Typography>
                <Typography variant="h4" component="div">
                  {currency.symbol} {stats.total.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  for **{expenses.length}** {expenses.length === 1 ? 'expense' : 'expenses'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>🗓️ Daily Average</Typography>
                <Typography variant="h4" component="div">
                  {currency.symbol} {stats.dailyAverage.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  per day (based on recorded expense dates)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>🏆 Top Category</Typography>
                {topCategoryEntry ? (
                  <>
                    <Typography variant="h6" component="div">
                      {topCategoryEntry[0]}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currency.symbol} {topCategoryEntry[1].toFixed(2)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No expenses yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Chart  */}
        {Object.keys(stats.byCategory).length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ height: 350 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        )}

        {/* Expenses Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="expenses table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount ({currency.code})</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length > 0 ? (
                  [...expenses]
                    // Sort by date descending
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((expense) => (
                      <TableRow hover key={expense.id}>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={expense.category}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                            **{currency.symbol} {expense.amount.toFixed(2)}**
                        </TableCell>
                        <TableCell>
                          {expense.notes && expense.notes.length > 0 && (
                            <Tooltip title={expense.notes} arrow>
                              <IconButton size="small">
                                <FiInfo />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(expense)}
                            color="primary"
                          >
                            <FiEdit2 />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(expense.id)}
                            color="error"
                          >
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <FiDollarSign size={48} color={theme.palette.text.secondary} style={{ opacity: 0.5, marginBottom: 16 }} />
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                          No expenses added yet
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          Track your travel expenses to see them here
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<FiPlus />}
                          onClick={() => setOpenDialog(true)}
                        >
                          Add Your First Expense
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Add/Edit Expense Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingExpense(null);
          setFormData({
            description: '',
            amount: '',
            category: '',
            date: new Date(),
            notes: ''
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiInfo />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiDollarSign />
                      </InputAdornment>
                    ),
                    inputProps: { step: '0.01', min: '0' } // Ensure decimal support and positive values
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    startAdornment={
                      <InputAdornment position="start">
                        <FiTag />
                      </InputAdornment>
                    }
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: "normal",
                          required: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <FiCalendar />
                              </InputAdornment>
                            ),
                          },
                        }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingExpense(null);
                setFormData({
                  description: '',
                  amount: '',
                  category: '',
                  date: new Date(),
                  notes: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingExpense ? 'Update' : 'Add'} Expense
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Expenses;