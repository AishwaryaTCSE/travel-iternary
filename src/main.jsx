import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import i18n from './i18n';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Suspense } from 'react';
import './index.css';
import theme from './theme';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CustomThemeProvider>
            <AuthProvider>
              <CssBaseline />
              <Suspense fallback={<div>Loading...</div>}>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </Suspense>
            </AuthProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);