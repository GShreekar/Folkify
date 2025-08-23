import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChange, 
  getCurrentUserData, 
  updateUserProfile,
  getUserArtworks,
  getArtistStats
} from '../firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userArtworks, setUserArtworks] = useState([]);
  const [artistStats, setArtistStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadUserArtworks = async (uid) => {
    try {
      const artworksResult = await getUserArtworks(uid);
      if (artworksResult.success) {
        setUserArtworks(artworksResult.artworks);
      }
      
      const statsResult = await getArtistStats(uid);
      if (statsResult.success) {
        setArtistStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Error loading user artworks:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    
    setProfileLoading(true);
    try {
      const result = await getCurrentUserData(currentUser.uid);
      if (result.success) {
        setUserData(result.userData);
      }
      await loadUserArtworks(currentUser.uid);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    if (!currentUser) return { success: false, error: 'No user logged in' };
    
    setProfileLoading(true);
    try {
      const result = await updateUserProfile(currentUser.uid, updatedData);
      if (result.success) {
        await refreshUserProfile();
      }
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const result = await getCurrentUserData(user.uid);
        if (result.success) {
          setUserData(result.userData);
        }
        
        await loadUserArtworks(user.uid);
      } else {
        setUserData(null);
        setUserArtworks([]);
        setArtistStats(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    userArtworks,
    artistStats,
    loading,
    profileLoading,
    refreshUserProfile,
    updateProfile,
    loadUserArtworks: () => currentUser ? loadUserArtworks(currentUser.uid) : Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
