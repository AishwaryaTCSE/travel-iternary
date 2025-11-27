// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Link as MuiLink,
  IconButton,
  InputAdornment
} from '@mui/material';
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  // Only redirect to the previous page if it exists and is not an auth page
  const from = location.state?.from?.pathname;
  const isAuthPath = from && ['/login', '/signup', '/forgot-password'].some(path => from.startsWith(path));
  const redirectTo = from && !isAuthPath ? from : '/dashboard';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      // Only navigate if login is successful
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleBackToHome = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 4 },
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'background.paper'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <IconButton
              component={Link}
              to="/"
              sx={{
                position: 'absolute',
                left: 16,
                top: 16,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <FiArrowLeft />
            </IconButton>
            
            <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
              Welcome Back
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Sign in to your account to continue
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMail />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <MuiLink
                  component={RouterLink}
                  to="/auth/forgot-password"
                  variant="body2"
                  sx={{ 
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline',
                    }
                  }}
                >
                  Forgot Password?
                </MuiLink>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink
                    component={RouterLink}
                    to="/auth/signup"
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'action.disabledBackground',
                        color: 'action.disabled',
                      },
                    }}
                  >
                    Sign Up
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;