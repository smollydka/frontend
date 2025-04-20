import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Skontrolujte, či máte token v localStorage

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Ak nie je používateľ prihlásený, presmerujeme na prihlásenie
  }

  return children;
};

export default ProtectedRoute;
