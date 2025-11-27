// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  auth, 
  signUp, 
  signIn, 
  signInWithGoogle,
  signOut as firebaseSignOut,
  onAuthStateChanged as onFirebaseAuthStateChanged
} from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in on initial load
  useEffect(() => {
    console.log('AuthProvider: Starting auth state check');
    let isMounted = true;
    
    const unsubscribe = onFirebaseAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      if (isMounted) {
        console.log('Auth state update - isMounted:', isMounted, 'User:', user);
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber || '',
          };
          setUser(userData);
          setIsAuthenticated(true);
          
          // Only redirect if user is on auth pages and already authenticated
          const currentPath = window.location.pathname;
          const authPaths = ['/login', '/signup', '/auth/login', '/auth/register'];
          const { from } = location.state || { from: { pathname: '/' } };
          
          // Only redirect if user is authenticated AND trying to access an auth page
          if (user && authPaths.includes(currentPath)) {
            // Add a small delay to prevent flash of content
            const timer = setTimeout(() => {
              navigate(from.pathname, { replace: true });
            }, 100);
            return () => clearTimeout(timer);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          // Only redirect to login if not on an auth page and not on the home page
          const currentPath = window.location.pathname;
          const publicPaths = ['/login', '/signup', '/forgot-password', '/auth/forgot-password', '/auth/reset-password', '/'];
          if (!publicPaths.includes(currentPath)) {
            navigate('/login', { replace: true });
          }
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user } = await signIn(email, password);
      
      // Update local state
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        default:
          errorMessage = error.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create user with email and password
      const { user } = await signUp(userData.email, userData.password);
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: userData.name,
        // You can add more profile fields here
      });
      
      // Create user document in Firestore (if needed)
      // await createDocument('users', {
      //   uid: user.uid,
      //   email: user.email,
      //   displayName: userData.name,
      //   phone: userData.phone || '',
      //   address: userData.address || '',
      //   createdAt: new Date().toISOString(),
      // });
      
      // Update local state
      const updatedUser = {
        uid: user.uid,
        email: user.email,
        displayName: userData.name,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || userData.phone || '',
      };
      
      setUser(updatedUser);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      navigate('/');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please use a different email or sign in.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters long.';
          break;
        default:
          errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const updateProfile = async (user, userData) => {
    try {
      setIsLoading(true);
      await user.updateProfile(userData);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile.');
      toast.error(error.message || 'Failed to update profile.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (!user) {
        throw new Error('No user returned from Google sign-in');
      }
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user in Firestore if doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber || '',
          address: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      // Update local state
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      const errorMessage = error.message || 'Google sign-in failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};