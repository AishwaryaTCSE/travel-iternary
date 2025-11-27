// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : 'auto'}
      width={fullScreen ? '100vw' : 'auto'}
      position={fullScreen ? 'fixed' : 'static'}
      top={0}
      left={0}
      bgcolor={fullScreen ? 'background.paper' : 'transparent'}
      zIndex={fullScreen ? 9999 : 'auto'}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner;