/**
 * Main App Component
 * 
 * Features:
 * - Enhanced Map View with real-time places and recommendations
 * - API integration for Foursquare/Google Maps Places
 * - Smart recommendations based on itinerary activities
 * - Error boundary for graceful error handling
 * - Environment variable validation
 * 
 * See ENV_SETUP.md for API key configuration
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper, 
  Link, 
  Divider, 
  IconButton, 
  InputAdornment,
  CircularProgress,
  Grid,
  Avatar,
  CssBaseline
} from '@mui/material';
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiArrowRight, 
  FiArrowLeft, 
  FiEye, 
  FiEyeOff,
  FiCheckCircle,
  FiUser as UserIcon,
  FiLock as LockIcon
} from 'react-icons/fi';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const ItineraryList = lazy(() => import('./pages/itinerary/ItineraryList'));
const ItineraryDetail = lazy(() => import('./pages/itinerary/ItineraryDetail'));
const ItineraryCreate = lazy(() => import('./pages/itinerary/ItineraryCreate'));
const ExpensesPage = lazy(() => import('./pages/expenses/ExpensesPage'));
// const SimpleExpenses = lazy(() => import('./pages/expenses/SimpleExpenses'));
const PackingList = lazy(() => import('./pages/packing/PackingList'));
const MapView = lazy(() => import('./components/maps/MapView'));
const GoogleMapsItineraryPage = lazy(() => import('./pages/GoogleMapsItineraryPage'));
const Weather = lazy(() => import('./pages/weather/Weather'));
const Documents = lazy(() => import('./pages/Documents'));
const Booking = lazy(() => import('./pages/Booking'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingSpinner = ({ message }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    gap={2}
  >
    <CircularProgress size={48} />
    {message && (
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    )}
  </Box>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to error tracking service in production
    if (import.meta.env.PROD) {
      // You can integrate with error tracking services like Sentry here
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          {import.meta.env.DEV && this.state.errorInfo && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1, textAlign: 'left' }}>
              <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

const Logout = () => {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return <LoadingSpinner message="Signing out..." />;
};

// Main Layout - Wraps routes with header and layout structure
// Note: Made public to match frontend-only requirement from prompt
const MainLayout = () => {
  const { theme: themeMode } = useTheme();

  return (
    <ErrorBoundary>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 8,
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Outlet />
      </Box>
    </ErrorBoundary>
  );
};

function App() {
  const location = useLocation();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  // Update theme data attribute on theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Check API keys configuration on mount
  useEffect(() => {
    const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    // Only show warning in development mode
    if (import.meta.env.DEV) {
      const missingApis = [];
      if (!FOURSQUARE_API_KEY && !GOOGLE_MAPS_API_KEY) {
        missingApis.push('Foursquare or Google Maps API');
      }
      if (!OPENWEATHER_API_KEY) {
        missingApis.push('OpenWeatherMap API');
      }
      
      if (missingApis.length > 0) {
        console.warn(
          `⚠️ Missing API keys: ${missingApis.join(', ')}. ` +
          `Some features may use fallback data. See ENV_SETUP.md for setup instructions.`
        );
      } else {
        console.log('✅ API keys configured successfully');
      }
    }
  }, []);
  
  // Debug log for route changes (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Current route:', location.pathname);
    }
  }, [location]);

  return (
    <div className={`app ${theme}-theme`}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header isAuthenticated={isAuthenticated} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            pt: '80px', // Space for fixed header
            px: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
            position: 'relative',
            zIndex: 1,
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 80px)'
          }}
        >
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === 'dark' ? 'dark' : 'light'}
          toastStyle={{
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        <Suspense fallback={<LoadingSpinner message="Loading application..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Main Routes - Dashboard/Itinerary List as Home */}
            <Route element={<MainLayout />}>
              {/* Dashboard/Home - Show Home page at base URL */}
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<ItineraryList />} />
              
              {/* Itinerary Routes */}
              <Route path="/itinerary">
                <Route index element={<ItineraryList />} />
                <Route path="create" element={<ItineraryCreate />} />
                <Route path=":tripId" element={<ItineraryDetail />} />
                <Route path=":tripId/edit" element={<ItineraryCreate />} />
              </Route>
              
              {/* Compatibility routes */}
              <Route path="/trip/:tripId">
                <Route index element={<ItineraryDetail />} />
                <Route path="itinerary" element={<ItineraryDetail />} />
              </Route>
              
              {/* Feature Routes - Can be accessed directly or via itinerary detail tabs */}
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/:tripId" element={<ExpensesPage />} />
              <Route path="/packing" element={<PackingList />} />
              <Route path="/packing/:tripId" element={<PackingList />} />
              <Route path="/map/:tripId" element={<MapView />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/weather/:tripId" element={<Weather />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:tripId" element={<Documents />} />
              
              {/* Map Routes - Enhanced map view with recommendations */}
              <Route path="/map" element={<MapView />} />
              <Route path="/google-maps-itinerary" element={<GoogleMapsItineraryPage />} />
              <Route path="/recommendations/:tripId" element={<Navigate to="/itinerary/:tripId?tab=map" replace />} />
              <Route path="/booking/:destinationId" element={<Booking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logout" element={<Logout />} />
            </Route>
            
            {/* Public Landing Page (Optional) */}
            <Route path="/home" element={<Home />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </Box>
      </Box>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --background-default: #f5f5f5;
            --background-paper: #ffffff;
          }
          
          [data-theme="dark"] {
            --background-default: #121212;
            --background-paper: #1e1e1e;
          }
          
          body {
            margin: 0;
            padding: 0;
            background-color: var(--background-default);
          }
          
          a {
            text-decoration: none;
            color: inherit;
          }
        `
      }} />
    </div>
  );
}

export default App;
