// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  updateProfile as updateAuthProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, app } from '../services/firebase';

// Initialize Firebase Auth
const auth = getAuth(app);

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
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
          // Only redirect to login if not on an auth page or public page
          const currentPath = window.location.pathname;
          const publicPaths = [
            '/login', 
            '/signup', 
            '/forgot-password', 
            '/auth/forgot-password', 
            '/auth/reset-password', 
            '/',
            '/itinerary',
            '/dashboard',
            '/home'
          ];
          // Don't redirect if on public paths or if path starts with /itinerary
          if (!publicPaths.includes(currentPath) && !currentPath.startsWith('/itinerary') && !currentPath.startsWith('/map') && !currentPath.startsWith('/expenses') && !currentPath.startsWith('/packing') && !currentPath.startsWith('/weather') && !currentPath.startsWith('/documents')) {
            // Only redirect protected routes like /profile, /settings
            if (currentPath.startsWith('/profile') || currentPath.startsWith('/settings')) {
              navigate('/login', { replace: true });
            }
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
      console.log('Starting login process for:', email);
      setIsLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user) {
        throw new Error('No user returned from sign in');
      }
      
      console.log('User signed in successfully:', user.email);
      
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
      console.error('Login error details:', {
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
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
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateAuthProfile(user, {
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
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      // Update the user's profile
      await updateAuthProfile(currentUser, {
        displayName: userData.displayName || currentUser.displayName,
        photoURL: userData.photoURL || currentUser.photoURL
      });
      
      // Update local state
      const updatedUser = {
        ...user,
        displayName: userData.displayName || user?.displayName || '',
        photoURL: userData.photoURL || user?.photoURL || ''
      };
      
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in process');
      setIsLoading(true);
      setError(null);
      
      // Initialize Google provider
      const provider = new GoogleAuthProvider();
      
      // Add any additional scopes you need
      provider.addScope('profile');
      provider.addScope('email');
      
      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (!user) {
        throw new Error('No user returned from Google sign-in');
      }
      
      console.log('Google sign-in successful for user:', user.email);
      
      try {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          console.log('Creating new user document in Firestore');
          // Create user in Firestore if doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified || false,
            phoneNumber: user.phoneNumber || '',
            provider: 'google.com',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      } catch (firestoreError) {
        console.error('Error updating Firestore:', firestoreError);
        // Don't fail the sign-in if Firestore update fails
      }
      
      // Update local state
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified || false,
        phoneNumber: user.phoneNumber || '',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store auth state in localStorage if needed
      localStorage.setItem('isAuthenticated', 'true');
      
      // Show success message
      toast.success('Signed in with Google successfully!');
      
      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Google sign-in error details:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential,
        timestamp: new Date().toISOString()
      });
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      // Handle specific Google auth errors
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email but different sign-in method. Please sign in using your email and password.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing. Please try again.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked. Please allow popups for this site and try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled. Please contact support.';
      }
      
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
    updateProfile
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

export default AuthProvider;