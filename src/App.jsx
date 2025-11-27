import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
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
const Expenses = lazy(() => import('./pages/expenses/Expenses'));
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
const MainLayout = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { theme: themeMode } = useTheme();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
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
        {children}
      </Box>
    </ErrorBoundary>
  );
};

function App() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className={`app ${theme}-theme`}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header isAuthenticated={isAuthenticated} />
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
            
            {/* Protected Routes - Wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="itinerary">
                <Route index element={<ItineraryList />} />
                <Route path="create" element={<ItineraryCreate />} />
                <Route path=":tripId" element={<ItineraryDetail />} />
              </Route>
              <Route path="expenses/:tripId" element={<Expenses />} />
              <Route path="packing/:tripId" element={<PackingList />} />
              <Route path="map/:tripId" element={<MapView />} />
              <Route path="weather/:tripId" element={<Weather />} />
              <Route path="documents/:tripId" element={<Documents />} />
              <Route path="/booking/:destinationId" element={<Booking />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Box>
    </div>
  );
}

export default App;