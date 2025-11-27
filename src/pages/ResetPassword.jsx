// src/pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, TextField, Box, Typography, Container, Paper, Alert } from '@mui/material';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // TODO: Verify the reset token is valid
    const verifyToken = async () => {
      try {
        // await authApi.verifyResetToken(token);
      } catch (err) {
        setIsValidToken(false);
        setError('Invalid or expired reset token');
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsValidToken(false);
      setError('No reset token provided');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Call your reset password API
      // await authApi.resetPassword(token, password);
      setMessage('Your password has been reset successfully!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            {error || 'Invalid or expired reset link'}
          </Typography>
          <Button
            component={Link}
            to="/auth/forgot-password"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Request New Reset Link
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            {t('auth.resetPassword')}
          </Typography>
          {message ? (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {message}
            </Alert>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1, width: '100%' }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('auth.newPassword')}
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label={t('auth.confirmNewPassword')}
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ mt: 3, mb: 2 }}
              >
                {isLoading ? t('common.loading') : t('auth.resetPassword')}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;