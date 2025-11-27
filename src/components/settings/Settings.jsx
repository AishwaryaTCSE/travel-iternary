import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  CircularProgress
} from '@mui/material';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiGlobe, 
  FiLock, 
  FiBell,
  FiMoon,
  FiSun,
  FiLogOut,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiCheck,
  FiChevronDown
} from 'react-icons/fi';

// Sample user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  joinedDate: 'January 2023',
  notificationSettings: {
    email: true,
    push: true,
    sms: false,
    newsletter: true
  },
  appSettings: {
    darkMode: false,
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD'
  }
};

// Available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' }
];

// Available timezones
const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai'
];

// Available currencies
const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'INR', name: 'Indian Rupee' }
];

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  // App settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD'
  });
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newsletter: true
  });
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Load user data on component mount
  useEffect(() => {
    // In a real app, you would fetch this from an API
    setProfile({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location
    });
    
    setSettings({
      darkMode: userData.appSettings.darkMode,
      language: userData.appSettings.language,
      timezone: userData.appSettings.timezone,
      currency: userData.appSettings.currency
    });
    
    setNotifications({
      email: userData.notificationSettings.email,
      push: userData.notificationSettings.push,
      sms: userData.notificationSettings.sms,
      newsletter: userData.notificationSettings.newsletter
    });
  }, []);
  
  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle settings changes
  const handleSettingChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (name) => {
    setNotifications(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  // Save settings
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', { profile, settings, notifications });
      setIsSaving(false);
      setIsEditing(false);
      
      // In a real app, you would show a success message here
      // and possibly update the theme or other global settings
      if (settings.darkMode) {
        // Apply dark theme
        console.log('Applying dark theme');
      } else {
        // Apply light theme
        console.log('Applying light theme');
      }
    }, 1000);
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    setIsDeleting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Account deleted');
      setIsDeleting(false);
      setOpenDeleteDialog(false);
      
      // Redirect to login or home page after deletion
      navigate('/');
    }, 1500);
  };
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Get language name by code
  const getLanguageName = (code) => {
    const lang = languages.find(lang => lang.code === code);
    return lang ? lang.name : code;
  };
  
  // Get currency name by code
  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? `${currency.code} - ${currency.name}` : code;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">Settings</Typography>
          
          {activeTab === 'account' && (
            <Box>
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setIsEditing(false)}
                    startIcon={<FiX />}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <FiSave />}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={() => setIsEditing(true)}
                  startIcon={<FiEdit2 />}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          )}
        </Box>
        
        <Grid container spacing={4}>
          {/* Left sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
              <List component="nav">
                <ListItem 
                  button 
                  selected={activeTab === 'account'} 
                  onClick={() => setActiveTab('account')}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary="Account" />
                </ListItem>
                <ListItem 
                  button 
                  selected={activeTab === 'notifications'} 
                  onClick={() => setActiveTab('notifications')}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary="Notifications" />
                </ListItem>
                <ListItem 
                  button 
                  selected={activeTab === 'appearance'} 
                  onClick={() => setActiveTab('appearance')}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary="Appearance" />
                </ListItem>
                <ListItem 
                  button 
                  selected={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary="Security" />
                </ListItem>
                <ListItem 
                  button 
                  selected={activeTab === 'billing'} 
                  onClick={() => setActiveTab('billing')}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText primary="Billing" />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <List>
                <ListItem 
                  button 
                  sx={{ color: 'error.main', borderRadius: 1 }}
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <ListItemText primary="Delete Account" />
                </ListItem>
                <ListItem 
                  button 
                  sx={{ borderRadius: 1 }}
                  onClick={() => {
                    // Handle logout
                    console.log('Logging out...');
                    navigate('/login');
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Main content */}
          <Grid item xs={12} md={9}>
            {activeTab === 'account' && (
              <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>Profile Information</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Update your account's profile information and email address.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar 
                      src={userData.avatar} 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        mx: 'auto',
                        mb: 2,
                        border: `2px solid ${theme.palette.divider}`
                      }} 
                    />
                    {isEditing && (
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => document.getElementById('avatar-upload').click()}
                      >
                        Change Photo
                        <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} />
                      </Button>
                    )}
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FiUser />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FiMail />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FiPhone />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          name="location"
                          value={profile.location}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FiGlobe />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Box>
                  <Typography variant="h6" gutterBottom>Account Information</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Manage your account settings and preferences.
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Member since"
                        secondary={userData.joinedDate}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Account status"
                        secondary={
                          <Chip 
                            label="Active" 
                            size="small" 
                            color="success" 
                            variant="outlined" 
                            sx={{ borderRadius: 1 }} 
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Box>
              </Paper>
            )}
            
            {activeTab === 'appearance' && (
              <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>Appearance</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Customize the appearance of the app. These settings affect how the app looks and feels.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {settings.darkMode ? <FiMoon /> : <FiSun />}
                          <Box component="span" sx={{ ml: 1 }}>
                            {settings.darkMode ? 'Dark' : 'Light'} Mode
                          </Box>
                        </Box>
                      }
                      secondary="Toggle between light and dark theme"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Language"
                      secondary="Select your preferred language"
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select language' }}
                        endAdornment={
                          <InputAdornment position="end">
                            <FiChevronDown />
                          </InputAdornment>
                        }
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Timezone"
                      secondary="Set your local timezone"
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select timezone' }}
                        endAdornment={
                          <InputAdornment position="end">
                            <FiChevronDown />
                          </InputAdornment>
                        }
                      >
                        {timezones.map((tz) => (
                          <MenuItem key={tz} value={tz}>
                            {tz}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Currency"
                      secondary="Set your preferred currency"
                    />
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={settings.currency}
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Select currency' }}
                        endAdornment={
                          <InputAdornment position="end">
                            <FiChevronDown />
                          </InputAdornment>
                        }
                      >
                        {currencies.map((currency) => (
                          <MenuItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <FiSave />}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Paper>
            )}
            
            {activeTab === 'notifications' && (
              <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure how you receive notifications. You can choose which types of notifications you want to receive and how you want to receive them.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Email Notifications"
                      secondary="Receive email notifications for important updates"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.email}
                        onChange={() => handleNotificationToggle('email')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Push Notifications"
                      secondary="Receive push notifications on your device"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.push}
                        onChange={() => handleNotificationToggle('push')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="SMS Notifications"
                      secondary="Receive text message notifications"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.sms}
                        onChange={() => handleNotificationToggle('sms')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Newsletter"
                      secondary="Subscribe to our newsletter for updates and promotions"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={notifications.newsletter}
                        onChange={() => handleNotificationToggle('newsletter')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <FiSave />}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Paper>
            )}
            
            {activeTab === 'security' && (
              <Paper sx={{ p: 4 }}>
                <Typography variant="h6" gutterBottom>Security Settings</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Manage your account security settings and password.
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Change Password"
                      secondary="Last changed 3 months ago"
                    />
                    <Button 
                      variant="outlined" 
                      onClick={() => console.log('Change password clicked')}
                    >
                      Change
                    </Button>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to your account"
                    />
                    <Button 
                      variant="outlined" 
                      onClick={() => console.log('Enable 2FA clicked')}
                    >
                      Enable
                    </Button>
                  </ListItem>
                  
                  <Divider component="li" />
                  
                  <ListItem>
                    <ListItemText 
                      primary="Active Sessions"
                      secondary="View and manage your active login sessions"
                    />
                    <Button 
                      variant="outlined" 
                      onClick={() => console.log('View sessions clicked')}
                    >
                      View All
                    </Button>
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 4 }} />
                
                <Box>
                  <Typography variant="h6" gutterBottom>Danger Zone</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    These actions are irreversible. Please proceed with caution.
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<FiLogOut />}
                    onClick={() => console.log('Logout all devices clicked')}
                    sx={{ mr: 2, mb: 2 }}
                  >
                    Logout All Devices
                  </Button>
                  
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <FiTrash2 />}
                    onClick={() => setOpenDeleteDialog(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </Box>
              </Paper>
            )}
            
            {activeTab === 'billing' && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
                  <Box sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }}>
                    <FiCreditCard />
                  </Box>
                  <Typography variant="h6" gutterBottom>Billing & Subscription</Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    You are currently on the <strong>Free</strong> plan. Upgrade to unlock premium features.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => console.log('View billing history clicked')}
                    >
                      Billing History
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => console.log('Upgrade plan clicked')}
                    >
                      Upgrade Plan
                    </Button>
                  </Box>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  <Typography variant="subtitle2" color="text.secondary">
                    Need help with billing? <Link href="#" color="primary">Contact support</Link>
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
          </DialogContentText>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>To confirm, type "DELETE" in the box below</Typography>
            <TextField
              fullWidth
              placeholder="Type DELETE to confirm"
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
