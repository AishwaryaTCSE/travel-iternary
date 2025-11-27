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

const Header = ({ isAuthenticated = false }) => {
  const theme = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome /> },
    { name: 'Itinerary', path: '/itinerary', icon: <FiCalendar /> },
    { name: 'Map', path: '/map', icon: <FiMap /> },
    { name: 'Expenses', path: '/expenses', icon: <FiDollarSign /> },
    { name: 'Packing', path: '/packing', icon: <FiLayers /> },
    { name: 'Weather', path: '/weather', icon: <FiSun /> },
    { name: 'Documents', path: '/documents', icon: <FiFileText /> }
  ];

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
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <FiGlobe size={24} style={{ marginRight: 12, color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
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

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    textTransform: 'none',
                    px: 2,
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        {/* Auth Buttons */}
        {!isAuthenticated ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
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
          </Box>
        ) : (
          <Button
            component={Link}
            to="/profile"
            startIcon={<FiUser />}
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Profile
          </Button>
        )}

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

        {/* Right-side actions */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
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
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Sign In
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;