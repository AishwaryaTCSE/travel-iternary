import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Box, Container, Paper } from '@mui/material';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography component="h1" variant="h1" color="primary" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" gutterBottom>
            {t('notFound.title', 'Page Not Found')}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {t('notFound.message', 'The page you are looking for does not exist or has been moved.')}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FiHome />}
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              {t('notFound.goHome', 'Go to Home')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FiArrowLeft />}
              onClick={() => navigate(-1)}
              sx={{ textTransform: 'none' }}
            >
              {t('notFound.goBack', 'Go Back')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
