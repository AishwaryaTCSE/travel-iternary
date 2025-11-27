import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Link as MuiLink, 
  Box, 
  IconButton, 
  InputAdornment,
  CircularProgress,
  Divider,
  Grid,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Google as GoogleIcon } from '@mui/icons-material';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiPhone, FiMapPin } from 'react-icons/fi';

const Signup = () => {
  const { t } = useTranslation();
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });
      
      if (result.success) {
        toast.success('Registration successful! Welcome to Travel Itinerary Planner!');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mb: 2 }}>
          <IconButton component={Link} to="/" sx={{ mb: 2 }}>
            <FiArrowLeft />
          </IconButton>
        </Box>
        
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <FiUser />
        </Avatar>
        
        <Typography component="h1" variant="h5">
          {t('auth.signUp')}
        </Typography>
        
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isLoading}
        >
          {t('auth.signUp')} with Google
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 2 }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
            {t('common.or')}
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiUser />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
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
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password || 'Minimum 6 characters required'}
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiLock />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            fullWidth
            name="phone"
            label="Phone Number"
            type="tel"
            id="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiPhone />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            fullWidth
            name="address"
            label="Address"
            type="text"
            id="address"
            multiline
            rows={2}
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiMapPin />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink component={Link} to="/auth/login" variant="body2">
              Already have an account? Sign In
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
