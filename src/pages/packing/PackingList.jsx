import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useItinerary } from '../../context/ItineraryContext';
import { geocodeDestination } from '../../services/maps';
import { getWeatherByCoords, getWeatherByCity } from '../../services/weather';
import { generatePackingList } from '../../services/packing';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiCheck, 
  FiX, 
  FiPackage,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiCheckCircle,
  FiCircle,
  FiInfo,
  FiTag
} from 'react-icons/fi';

// Sample categories and items
const defaultCategories = [
  'Clothing',
  'Toiletries',
  'Electronics',
  'Documents',
  'Accessories',
  'Medication',
  'Other'
];

const sampleItems = [
  { id: 1, name: 'T-Shirts', category: 'Clothing', quantity: 5, packed: 2 },
  { id: 2, name: 'Toothbrush', category: 'Toiletries', quantity: 1, packed: 0 },
  { id: 3, name: 'Passport', category: 'Documents', quantity: 1, packed: 1 },
  { id: 4, name: 'Phone Charger', category: 'Electronics', quantity: 1, packed: 0 },
];

const PackingList = () => {
  const { tripId } = useParams();
  const { trips, currentTrip } = useItinerary();
  const trip = tripId ? trips.find(t => t.id === tripId) : currentTrip;
  const [items, setItems] = useState(sampleItems);
  const [weather, setWeather] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 1,
    notes: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    packedItems: 0,
    categories: {}
  });

  // Calculate stats when items change
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    const packed = items.reduce((sum, item) => sum + item.packed, 0);
    
    const categories = {};
    items.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    
    setStats({
      totalItems: total,
      packedItems: packed,
      categories: categories
    });
  }, [items]);

  useEffect(() => {
    const run = async () => {
      if (!trip?.destination) return;
      try {
        const geo = await geocodeDestination(trip.destination);
        let w = null;
        if (geo) {
          w = await getWeatherByCoords(geo.lat, geo.lng, 'metric');
        } else {
          w = await getWeatherByCity(trip.destination, 'metric');
        }
        setWeather(w);
        const rec = generatePackingList(trip, w);
        // assign ids
        const withIds = rec.map((it, idx) => ({ id: idx + 1, ...it }));
        setItems(withIds);
      } catch (e) {
        const rec = generatePackingList(trip, null);
        const withIds = rec.map((it, idx) => ({ id: idx + 1, ...it }));
        setItems(withIds);
      }
    };
    run();
  }, [trip]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? (parseInt(value, 10) || '') : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      return; // Validation
    }
    
    if (editingItem) {
      // Update existing item
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: editingItem.id, packed: editingItem.packed }
          : item
      ));
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        packed: 0
      };
      setItems([...items, newItem]);
    }
    
    // Reset form and close dialog
    setFormData({
      name: '',
      category: '',
      quantity: 1,
      notes: ''
    });
    setEditingItem(null);
    setOpenDialog(false);
  };
  
  // Handle item packing
  const handlePackItem = (itemId, packed) => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, packed: packed ? item.quantity : 0 }
        : item
    ));
  };
  
  // Handle item delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };
  
  // Filter items based on tab and search term
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tabValue === 'all') return matchesSearch;
    if (tabValue === 'packed') return item.packed > 0 && matchesSearch;
    if (tabValue === 'unpacked') return item.packed < item.quantity && matchesSearch;
    return item.category === tabValue && matchesSearch;
  });
  
  // Calculate completion percentage
  const completionPercentage = stats.totalItems > 0 
    ? Math.round((stats.packedItems / stats.totalItems) * 100) 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">Packing List</Typography>
          <Box>
            <Button 
              variant="contained" 
              startIcon={<FiPlus />}
              onClick={() => setOpenDialog(true)}
              sx={{ mr: 1 }}
            >
              Add Item
            </Button>
            <Tooltip title="Print">
              <IconButton>
                <FiPrinter />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {trip && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">AI Packing Recommendations</Typography>
            <Typography variant="body2" color="text.secondary">
              Destination: {trip.destination} {weather?.current?.condition ? `• Weather: ${weather.current.condition}` : ''}
            </Typography>
          </Paper>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Items</Typography>
                <Typography variant="h4" component="div">
                  {stats.totalItems}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {Object.keys(stats.categories).length} categories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Packed</Typography>
                <Typography variant="h4" component="div">
                  {stats.packedItems} / {stats.totalItems}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {completionPercentage}% complete
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Categories</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {Object.entries(stats.categories).map(([category, count]) => (
                    <Chip 
                      key={category} 
                      label={`${category} (${count})`} 
                      size="small" 
                      variant="outlined"
                      onClick={() => setTabValue(category)}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Progress Bar */}
        {stats.totalItems > 0 && (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Packing Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completionPercentage}%
              </Typography>
            </Box>
            <Box sx={{ width: '100%', height: 10, bgcolor: 'grey.200', borderRadius: 5, overflow: 'hidden' }}>
              <Box 
                sx={{ 
                  width: `${completionPercentage}%`, 
                  height: '100%', 
                  bgcolor: 'primary.main',
                  transition: 'width 0.3s ease-in-out'
                }} 
              />
            </Box>
          </Box>
        )}
        
        {/* Filter and Search */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiFilter />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ '& .MuiTab-root': { minHeight: 48 } }}
              >
                <Tab label="All" value="all" />
                <Tab 
                  label={
                    <Badge badgeContent={stats.packedItems} color="primary" sx={{ '& .MuiBadge-badge': { right: -8 } }}>
                      Packed
                    </Badge>
                  } 
                  value="packed" 
                />
                <Tab 
                  label={
                    <Badge badgeContent={stats.totalItems - stats.packedItems} color="primary" sx={{ '& .MuiBadge-badge': { right: -8 } }}>
                      Unpacked
                    </Badge>
                  } 
                  value="unpacked" 
                />
                {defaultCategories.map(category => (
                  <Tab 
                    key={category} 
                    label={category} 
                    value={category}
                    sx={{ textTransform: 'none' }}
                  />
                ))}
              </Tabs>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Items List */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          {filteredItems.length > 0 ? (
            <List>
              {filteredItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <Checkbox
                      checked={item.packed === item.quantity}
                      onChange={(e) => handlePackItem(item.id, e.target.checked)}
                      icon={<FiCircle />}
                      checkedIcon={<FiCheckCircle color="primary" />}
                      indeterminate={item.packed > 0 && item.packed < item.quantity}
                      indeterminateIcon={<FiCheckCircle color="action" />}
                    />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              textDecoration: item.packed === item.quantity ? 'line-through' : 'none',
                              color: item.packed === item.quantity ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Chip 
                            label={item.category} 
                            size="small" 
                            sx={{ ml: 1 }} 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.packed} of {item.quantity} packed
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="edit"
                        onClick={() => {
                          setFormData({
                            name: item.name,
                            category: item.category,
                            quantity: item.quantity,
                            notes: item.notes || ''
                          });
                          setEditingItem(item);
                          setOpenDialog(true);
                        }}
                      >
                        <FiEdit2 />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleDelete(item.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <FiPackage size={48} color="#9e9e9e" style={{ opacity: 0.5, marginBottom: 16 }} />
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {searchTerm ? 'No matching items found' : 'Your packing list is empty'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {searchTerm 
                  ? 'Try a different search term' 
                  : 'Add items to your packing list to get started'}
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="contained" 
                  startIcon={<FiPlus />}
                  onClick={() => setOpenDialog(true)}
                >
                  Add Your First Item
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* Add/Edit Item Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setEditingItem(null);
          setFormData({
            name: '',
            category: '',
            quantity: 1,
            notes: ''
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiPackage />
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
                    {defaultCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  margin="normal"
                  inputProps={{ min: 1 }}
                />
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
                  placeholder="Add any additional details about this item..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                setEditingItem(null);
                setFormData({
                  name: '',
                  category: '',
                  quantity: 1,
                  notes: ''
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editingItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default PackingList;
