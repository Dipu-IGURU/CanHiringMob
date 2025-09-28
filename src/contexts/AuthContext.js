import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔍 AuthContext: Checking authentication state...');
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      console.log('🔍 AuthContext: Stored token exists:', !!storedToken);
      console.log('🔍 AuthContext: Stored user exists:', !!storedUser);

      if (storedToken && storedUser) {
        console.log('🔍 AuthContext: Verifying token with server...');
        // Verify token with server
        const isValid = await verifyToken(storedToken);
        console.log('🔍 AuthContext: Token verification result:', isValid);
        
        if (isValid) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          console.log('✅ AuthContext: User authenticated successfully');
        } else {
          console.log('❌ AuthContext: Token invalid, clearing auth data');
          // Token is invalid, clear storage
          await clearAuthData();
        }
      } else {
        console.log('ℹ️ AuthContext: No stored auth data found');
      }
    } catch (error) {
      console.error('❌ AuthContext: Error checking auth state:', error);
      await clearAuthData();
    } finally {
      setLoading(false);
      console.log('🔍 AuthContext: Auth state check completed');
    }
  };

  const verifyToken = async (tokenToVerify) => {
    try {
      // Try to get user profile to verify token
      const response = await fetch(`${API_BASE_URL}/api/profile/`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.success;
      }
      return false;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const { token: newToken, user: userData } = data;
        
        // Store token and user data
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Registration data being sent:', userData);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        const { token: newToken, user: newUser } = data;
        
        console.log('Registration successful, storing auth data...');
        
        // Store token and user data
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
        
        console.log('Auth state updated:', { token: !!newToken, user: !!newUser, isAuthenticated: true });
        
        return { success: true, user: newUser };
      } else {
        console.log('Registration failed:', data);
        return { success: false, message: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      
      console.log('AuthContext: About to clear AsyncStorage...');
      // Clear all auth data from AsyncStorage
      await clearAuthData();
      console.log('AuthContext: AsyncStorage cleared successfully');
      
      console.log('AuthContext: About to reset auth state...');
      // Reset all auth state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setLoading(false);
      
      console.log('AuthContext: Auth state reset successfully');
      console.log('AuthContext: Logout completed successfully');
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      throw error; // Re-throw to handle in the calling component
    }
  };

  const clearAuthData = async () => {
    try {
      console.log('clearAuthData: Starting to clear AsyncStorage...');
      
      console.log('clearAuthData: Removing token...');
      // Remove all auth-related data
      await AsyncStorage.removeItem('token');
      console.log('clearAuthData: Token removed');
      
      console.log('clearAuthData: Removing user...');
      await AsyncStorage.removeItem('user');
      console.log('clearAuthData: User removed');
      
      console.log('clearAuthData: Running multiRemove...');
      // Also try to clear any other potential auth data
      await AsyncStorage.multiRemove(['token', 'user']);
      console.log('clearAuthData: MultiRemove completed');
      
      console.log('clearAuthData: All auth data cleared from AsyncStorage successfully');
    } catch (error) {
      console.error('clearAuthData: Error clearing auth data:', error);
      // Don't throw error here, just log it
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const updatedUser = { ...user, ...updatedUserData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.user;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    getAuthHeaders,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
