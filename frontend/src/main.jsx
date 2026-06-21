import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

/**
 * Create root React element and render app
 * AuthProvider wraps entire app to provide authentication context globally
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider makes auth state available to all components */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);