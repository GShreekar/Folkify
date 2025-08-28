import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (currentUser && userData) {
    // Redirect based on user role
    const redirectPath = userData.role === 'artist' ? '/dashboard' : '/';
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

export default PublicRoute;
