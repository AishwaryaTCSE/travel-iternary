import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      // In a real app, you would make an API call here
      // const response = await authApi.login(email, password);
      
      // Mock response for demo purposes
      const mockUser = {
        id: 'user123',
        email,
        name: email.split('@')[0],
        token: 'mock-jwt-token',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      toast.success(t('auth.loginSuccess'));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || t('auth.loginError'));
      return false;
    }
  }, [t]);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      // In a real app, you would make an API call here
      // const response = await authApi.register(userData);
      
      // Mock response for demo purposes
      const mockUser = {
        id: `user${Math.floor(Math.random() * 10000)}`,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        token: 'mock-jwt-token',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      toast.success(t('auth.registrationSuccess'));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || t('auth.registrationError'));
      return false;
    }
  }, [t]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success(t('auth.logoutSuccess'));
    navigate('/login');
  }, [navigate, t]);

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      // In a real app, you would make an API call here
      // const response = await authApi.updateProfile(userData);
      
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success(t('auth.profileUpdateSuccess'));
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || t('auth.profileUpdateError'));
      return false;
    }
  }, [user, t]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };
};

export default useAuth;
// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from './useLocalStorage';

export function useAuth() {
  const [user, setUser] = useLocalStorage('user', null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update isAuthenticated when user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your actual authentication logic
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const newUser = await response.json();
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    // Optionally clear any other auth-related data
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate, setUser]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && !user) {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        logout();
      }
    };

    checkAuth();
  }, [user, setUser, logout]);

  // Redirect to login if not authenticated and not on a public route
  useEffect(() => {
    const publicPaths = ['/login', '/register', '/forgot-password'];
    if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
  };
}