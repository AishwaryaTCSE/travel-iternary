import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiDollarSign, 
  FiCalendar, 
  FiTag, 
  FiInfo,
  FiPieChart,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiArrowLeft,
  FiAlertCircle
} from 'react-icons/fi';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

// Sample categories - you might want to fetch these from your backend
const categories = [
  'Accommodation',
  'Food & Drinks',
  'Transportation',
  'Activities',
  'Shopping',
  'Flights',
  'Others'
];

// Sample currency options
const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR'];

const Expenses = () => {
  const { tripId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { getTripById } = useItinerary();
  
  // State for expenses data
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date(),
    notes: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    dailyAverage: 0
  });

  // Load trip and expenses data
  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        if (tripId && getTripById) {
          const tripData = await getTripById(tripId);
          if (tripData) {
            setTrip(tripData);
            // If the trip has expenses, use them; otherwise, use sample data
            if (tripData.expenses && tripData.expenses.length > 0) {
              setExpenses(tripData.expenses);
            } else {
              // Fallback to sample data if no expenses exist
              const sampleExpenses = [
                { id: 1, description: 'Hotel Booking', amount: 120, category: 'Accommodation', date: new Date(), notes: '2 nights at Grand Hotel' },
                { id: 2, description: 'Dinner', amount: 45.50, category: 'Food & Drinks', date: new Date(), notes: 'Italian restaurant' },
                { id: 3, description: 'Museum Tickets', amount: 28, category: 'Activities', date: new Date(), notes: 'City Museum entrance' },
              ];
              setExpenses(sampleExpenses);
            }
          }
        }
      } catch (err) {
        console.error('Error loading trip:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId, getTripById]);
    
    setExpenses(sampleExpenses);
    calculateStats(sampleExpenses);
  }, [id]);
  
  // Calculate statistics
  const calculateStats = (expensesList) => {
    const total = expensesList.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = {};
    
    expensesList.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });
    
    // Calculate daily average (simple implementation)
    const days = new Set(expensesList.map(exp => exp.date.toDateString())).size;
    const dailyAverage = days > 0 ? total / days : 0;
    
    setStats({
      total,
      byCategory,
      dailyAverage: parseFloat(dailyAverage.toFixed(2))
    });
  };
  
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
    
    if (!formData.description || !formData.amount || !formData.category) {
      // Show validation error
      return;
    }
    
    if (editingExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(exp => 
        exp.id === editingExpense.id ? { ...formData, id: editingExpense.id } : exp
      );
      setExpenses(updatedExpenses);
      calculateStats(updatedExpenses);
    } else {
      // Add new expense
      const newExpense = {
        ...formData,
        id: expenses.length > 0 ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1
      };
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      calculateStats(updatedExpenses);
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
      calculateStats(updatedExpenses);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: Object.keys(stats.byCategory),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(stats.byCategory),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(159, 159, 159, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">Expenses</Typography>
          <Box>
            <Button 
              variant="contained" 
              startIcon={<FiPlus />}
              onClick={() => setOpenDialog(true)}
              sx={{ mr: 1 }}
            >
              Add Expense
            </Button>
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
                <Typography color="textSecondary" gutterBottom>Total Spent</Typography>
                <Typography variant="h4" component="div">
                  {currency} {stats.total.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  for {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Daily Average</Typography>
                <Typography variant="h4" component="div">
                  {currency} {stats.dailyAverage.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  per day
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Top Category</Typography>
                {Object.keys(stats.byCategory).length > 0 ? (
                  <>
                    <Typography variant="h6" component="div">
                      {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0][0]}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {currency} {Math.max(...Object.values(stats.byCategory)).toFixed(2)}
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
        
        {/* Chart */}
        {Object.keys(stats.byCategory).length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ height: 300 }}>
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
                  <TableCell align="right">Amount ({currency})</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length > 0 ? (
                  [...expenses]
                    .sort((a, b) => b.date - a.date)
                    .map((expense) => (
                      <TableRow hover key={expense.id}>
                        <TableCell>
                          {expense.date.toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={expense.category} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">{expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          {expense.notes && (
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
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        margin="normal" 
                        required
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
