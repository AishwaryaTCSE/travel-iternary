import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setMessage(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Enter your email and we'll send you a link to reset your password.
          </Typography>
        </Box>
        
        {message && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: message.includes('sent') ? 'success.light' : 'error.light',
              color: 'white',
              borderRadius: 1
            }}
          >
            {message}
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <FiMail style={{ marginRight: 8, color: 'gray' }} />
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Link'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              <FiArrowLeft style={{ marginRight: 4 }} />
              Back to Sign in
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
