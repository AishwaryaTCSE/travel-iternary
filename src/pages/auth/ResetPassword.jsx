import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  FiLock, 
  FiCheckCircle, 
  FiEye, 
  FiEyeOff,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const { token } = useParams();
  const { resetPasswordConfirm } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', isError: true });
      return;
    }
    
    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', isError: true });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', isError: false });
    
    try {
      await resetPasswordConfirm(token, password);
      setMessage({ 
        text: 'Password reset successfully! Redirecting to login...', 
        isError: false 
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setMessage({ 
        text: error.message || 'Failed to reset password', 
        isError: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container component="main" maxWidth="xs" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography component="h1" variant="h5">
            Reset Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your new password below.
          </Typography>
        </Box>
        
        {message.text && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: message.isError ? 'error.light' : 'success.light',
              color: 'white',
              borderRadius: 1
            }}
          >
            {message.text}
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <FiLock style={{ marginRight: 8, color: 'gray' }} />
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ''}
            helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
            InputProps={{
              startAdornment: (
                <FiCheckCircle style={{ marginRight: 8, color: 'gray' }} />
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Reset Password'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Button
              startIcon={<FiArrowLeft />}
              onClick={() => navigate('/login')}
              color="inherit"
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
