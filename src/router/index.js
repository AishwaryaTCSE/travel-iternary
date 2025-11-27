import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import ErrorBoundary from '../components/common/ErrorBoundary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { lazy, Suspense } from 'react';

// Layouts
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const AuthLayout = lazy(() => import('../layouts/AuthLayout'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

// Main Pages
const Home = lazy(() => import('../pages/Home'));
const ItineraryList = lazy(() => import('../pages/itinerary/ItineraryList'));
const ItineraryDetail = lazy(() => import('../pages/itinerary/ItineraryDetail'));
const ItineraryCreate = lazy(() => import('../pages/itinerary/ItineraryCreate'));
const Expenses = lazy(() => import('../pages/expenses/Expenses'));
const PackingList = lazy(() => import('../pages/packing/PackingList'));
const MapView = lazy(() => import('../pages/map/MapView'));
const Weather = lazy(() => import('../pages/weather/Weather'));
const Documents = lazy(() => import('../pages/documents/Documents'));
const Settings = lazy(() => import('../pages/settings/Settings'));
const Profile = lazy(() => import('../pages/profile/Profile'));

// Error Pages
const NotFound = lazy(() => import('../pages/error/NotFound'));
const Unauthorized = lazy(() => import('../pages/error/Unauthorized'));

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

// Routes Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      // Auth Routes
      {
        path: 'auth',
        element: (
          <Suspense fallback={<LoadingSpinner fullScreen />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password/:token', element: <ResetPassword /> },
        ],
      },
      
      // Protected Routes
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <MainLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Home /> },
          {
            path: 'itinerary',
            children: [
              { index: true, element: <ItineraryList /> },
              { path: 'create', element: <ItineraryCreate /> },
              { path: ':id', element: <ItineraryDetail /> },
              { path: 'edit/:id', element: <ItineraryCreate editMode /> },
            ],
          },
          { path: 'expenses', element: <Expenses /> },
          { path: 'packing', element: <PackingList /> },
          { path: 'map', element: <MapView /> },
          { path: 'weather', element: <Weather /> },
          { path: 'documents', element: <Documents /> },
          { path: 'profile', element: <Profile /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      
      // Error Routes
      { path: 'unauthorized', element: <Unauthorized /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
