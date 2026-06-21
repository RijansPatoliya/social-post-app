// ============================================
// Authentication Context
// ============================================
// This file manages global authentication state
// Used to keep track of logged-in user across entire app

import React, { createContext, useState, useEffect } from 'react';

// Create context for authentication
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the entire app and provides authentication state to all components
 */
export const AuthProvider = ({ children }) => {
  // State to store current user information
  const [user, setUser] = useState(null);
  
  // State to track loading status (useful for showing spinners)
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when app loads
  // This runs once when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    // If token exists, user is logged in
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Stop loading after check is complete
    setLoading(false);
  }, []);

  /**
   * Login function - called after successful authentication
   * @param {object} userData - User object from backend (contains username, email, userId)
   * @param {string} token - JWT token from backend
   */
  const login = (userData, token) => {
    // Save token for API requests
    localStorage.setItem('token', token);
    
    // Save user data for display
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state to reflect logged-in user
    setUser(userData);
  };

  /**
   * Logout function - called when user wants to logout
   */
  const logout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear user state
    setUser(null);
  };

  /**
   * Check if user is currently logged in
   * @returns {boolean} - True if user is logged in
   */
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  // Provide context values to all child components
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use Auth Context
 * Use this hook in any component to access authentication state
 * Example: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};