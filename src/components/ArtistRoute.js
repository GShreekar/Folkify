import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ArtistRoute = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!userData) {
    return <div>Loading user data...</div>;
  }
  
  if (userData.role !== 'artist') {
    return <Navigate to="/gallery" replace />;
  }
  
  return children;
};

export default ArtistRoute;
