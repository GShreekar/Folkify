import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChange, 
  getCurrentUserData, 
  updateUserProfile
} from '../firebase/auth';
import { getUserArtworks, getArtistStats, getArtistVerificationProgress } from '../services/artworkService';
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
  const [verificationProgress, setVerificationProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadUserDataWithRetry = async (uid, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await getCurrentUserData(uid);
        if (result.success) {
          return result;
        } else if (i < retries - 1) {
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      } catch (error) {
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    return { success: false, error: 'Failed to load user data after multiple attempts' };
  };

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
      
      const progressResult = await getArtistVerificationProgress(uid);
      if (progressResult.success) {
        setVerificationProgress(progressResult.progress);
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
        try {
          const result = await loadUserDataWithRetry(user.uid);
          if (result.success) {
            setUserData(result.userData);
            await loadUserArtworks(user.uid);
          } else {
            console.error('Error loading user data:', result.error);
            setUserData(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
        setUserArtworks([]);
        setArtistStats(null);
        setVerificationProgress(null);
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
    verificationProgress,
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
