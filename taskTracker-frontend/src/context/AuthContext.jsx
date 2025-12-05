import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Create Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app loads
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Login function - now accepts identifier (email or username)
  const login = async (identifier, password) => {
    try {
      const response = await authService.login(identifier, password);
      
      // Extract user from response structure
      const userData = response.data?.user || response.user;
      
      if (userData) {
        setUser(userData);
        return { success: true, user: userData };
      }
      
      return { success: false, error: 'Login failed - no user data received' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Login failed. Please check your credentials.';
      return { success: false, error: message };
    }
  };


  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      console.log('Full registration response:', response);
      
      // Check if registration was successful
      if (response.data?.success || response.statusCode === 200 || response.status === 200) {
        // Registration successful - don't set user, let them login to get token
        return { 
          success: true, 
          message: response.data?.message || 'Registration successful! Please login.' 
        };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // Value provided to all children components
  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};