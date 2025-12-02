import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ItineraryProvider } from './context/ItineraryContext';
import i18n from './i18n';
import theme from './theme';
import App from './App';

function AppWithProviders() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <CustomThemeProvider>
            <AuthProvider>
              <ItineraryProvider>
                <CssBaseline />
                <App />
              </ItineraryProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </MuiThemeProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default AppWithProviders;
