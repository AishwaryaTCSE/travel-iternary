// src/components/Header.jsx
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  FiHome,
  FiMap,
  FiCalendar,
  FiDollarSign,
  FiLayers,
  FiSun,
  FiFileText,
  FiGlobe,
  FiMenu,
  FiUser
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItinerary } from '../context/ItineraryContext';

const Header = () => {
  const { isAuthenticated } = useAuth(); // Get auth state from context
  const theme = useTheme();
  const location = useLocation();
  const { currentTrip } = useItinerary();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Define base nav items and whether they require a tripId
  const navItems = [
    { name: 'Dashboard', base: 'dashboard', icon: <FiHome />, requiresTrip: false },
    { name: 'Itinerary', base: 'itinerary', icon: <FiCalendar />, requiresTrip: false },
    { name: 'Map', base: 'map', icon: <FiMap />, requiresTrip: true, optionalTrip: true },
    { name: 'Expenses', base: 'expenses', icon: <FiDollarSign />, requiresTrip: true },
    { name: 'Packing', base: 'packing', icon: <FiLayers />, requiresTrip: true },
    { name: 'Weather', base: 'weather', icon: <FiSun />, requiresTrip: true },
    { name: 'Documents', base: 'documents', icon: <FiFileText />, requiresTrip: true }
  ];

  const resolvePath = (item) => {
    const tripId = currentTrip?.id;
    // Dashboard/Home: main itinerary list page
    if (item.base === 'dashboard') return '/';
    // Itinerary list
    if (item.base === 'itinerary') return '/itinerary';
    // Map supports both, prefer trip-specific when available
    if (item.base === 'map') return tripId ? `/map/${tripId}` : '/map';
    // Features that require a trip; fall back to itinerary list when none selected
    if (item.requiresTrip) return tripId ? `/${item.base}/${tripId}` : '/itinerary';
    return `/${item.base}`;
  };

  const isActive = (targetPath) => {
    // Basic startsWith check covers dynamic paths like /expenses/:tripId
    return location.pathname === targetPath || location.pathname.startsWith(targetPath);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar 
      position="fixed"
      elevation={1}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer + 1,
        height: '64px',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Toolbar disableGutters sx={{ 
        minHeight: '64px !important',
        paddingLeft: '16px',
        paddingRight: '16px',
        width: '100%'
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <FiGlobe size={24} style={{ marginRight: 12, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component={Link}
            to="/itinerary"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: { xs: 'none', sm: 'block' },
              mr: 4
            }}
          >
            TravelPlanner
          </Typography>

          {/* Desktop Navigation - Always show navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => {
                const targetPath = resolvePath(item);
                return (
                  <Button
                    key={item.base}
                    component={Link}
                    to={targetPath}
                    startIcon={item.icon}
                    sx={{
                      color: isActive(targetPath) ? 'primary.main' : 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                      fontWeight: isActive(targetPath) ? 600 : 400,
                      textTransform: 'none',
                      px: 2,
                    }}
                    title={item.requiresTrip && !currentTrip ? 'Select a trip from Itinerary' : undefined}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </Box>
        </Box>

        {/* Auth Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/profile"
                startIcon={<FiUser />}
                color="inherit"
                sx={{ textTransform: 'none' }}
              >
                Profile
              </Button>
              <Button
                component={Link}
                to="/logout"
                variant="outlined"
                color="inherit"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant={location.pathname === '/login' ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="primary"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ color: 'text.primary' }}
          >
            <FiMenu />
          </IconButton>
        </Box>

        {/* Forgot Password Link (only when not authenticated) */}
        {!isAuthenticated && (
          <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
            <Typography 
              component={Link}
              to="/auth/forgot-password"
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot Password?
            </Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
