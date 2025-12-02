import React from 'react';
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppWithProviders from './AppWithProviders';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary>
        <AppWithProviders />
      </ErrorBoundary>
    </Suspense>
  </React.StrictMode>
);