import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link as RouterLink, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from './context/ThemeContext';
import { useItinerary } from './context/ItineraryContext';
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
const Weather = lazy(() => import('./pages/weather/Weather'));
const Documents = lazy(() => import('./pages/Documents'));
const Booking = lazy(() => import('./pages/Booking'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Main Layout - Wraps protected routes with header and layout structure
const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { theme: themeMode } = useTheme();

  console.log('MainLayout - isAuthenticated:', isAuthenticated);
  console.log('MainLayout - isLoading:', isLoading);

  if (isLoading) {
    console.log('MainLayout - Showing loading spinner');
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.log('MainLayout - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

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
  const { currentTrip } = useItinerary();
  
  // Update theme data attribute on theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Debug log for route changes
  useEffect(() => {
    console.log('Current route:', location.pathname);
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
        />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Home Page - Accessible to all */}
            <Route path="/" element={<Home />} />
            
            {/* Map Route - Accessible to all */}
            <Route path="/map" element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                  <MapView />
                </Suspense>
              </ErrorBoundary>
            } />
            
            {/* Protected Routes - Wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/itinerary">
                <Route index element={<ItineraryList />} />
                <Route path="create" element={<ItineraryCreate />} />
                <Route path=":tripId" element={<ItineraryDetail />} />
              </Route>
              {/* Compatibility routes for legacy structure */}
              <Route path="/trip/:tripId">
                <Route index element={<ItineraryDetail />} />
                <Route path="itinerary" element={<ItineraryDetail />} />
              </Route>
              {/* Expenses routes */}
              <Route path="/expenses">
                <Route index element={currentTrip ? <Navigate to={`/expenses/${currentTrip.id}`} replace /> : <ExpensesPage />} />
                <Route path=":tripId" element={<ExpensesPage />} />
              </Route>
              
              {/* Packing routes */}
              <Route path="/packing">
                <Route index element={currentTrip ? <Navigate to={`/packing/${currentTrip.id}`} replace /> : <PackingList />} />
                <Route path=":tripId" element={<PackingList />} />
              </Route>
              
              {/* Documents routes */}
              <Route path="/documents">
                <Route index element={currentTrip ? <Navigate to={`/documents/${currentTrip.id}`} replace /> : <Documents />} />
                <Route path=":tripId" element={<Documents />} />
              </Route>
              
              {/* Weather routes */}
              <Route path="/weather">
                <Route index element={currentTrip ? <Navigate to={`/weather/${currentTrip.id}`} replace /> : <Weather />} />
                <Route path=":tripId" element={<Weather />} />
              </Route>
              
              {/* Other routes */}
              <Route path="/map/:tripId" element={<MapView />} />
              <Route path="/booking/:destinationId" element={<Booking />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
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
