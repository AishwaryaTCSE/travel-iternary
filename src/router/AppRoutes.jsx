import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../layouts/MainLayout';
import Loader from '../components/ui/Loader';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const CreateTrip = lazy(() => import('../pages/CreateTrip'));
const Itinerary = lazy(() => import('../pages/Itinerary'));
const Expenses = lazy(() => import('../pages/Expenses'));
const PackingList = lazy(() => import('../pages/PackingList'));
const MapOverview = lazy(() => import('../pages/MapOverview'));
const Weather = lazy(() => import('../pages/Weather'));
const Documents = lazy(() => import('../pages/Documents'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="trip/:tripId">
            <Route index element={<Itinerary />} />
            <Route path="itinerary" element={<Itinerary />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="packing-list" element={<PackingList />} />
            <Route path="map" element={<MapOverview />} />
            <Route path="weather" element={<Weather />} />
            <Route path="documents" element={<Documents />} />
          </Route>
          <Route path="settings" element={<Settings />} />
          
          {/* 404 Route */}
          <Route path="404" element={<NotFound />} />
          
          {/* Redirect unknown paths to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
