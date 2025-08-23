import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from './config';
import { getUserArtworks as getArtworksFromService, getArtistStats as getStatsFromService } from '../services/artworkService';

export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: userData.fullName
    });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      fullName: userData.fullName,
      governmentId: userData.governmentId,
      phoneNumber: userData.phoneNumber,
      primaryArtForm: userData.primaryArtForm,
      village: userData.village || '',
      bio: userData.bio || '',
      createdAt: new Date().toISOString(),
      isVerified: false,
      role: 'artist'
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage = 'An error occurred during login';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email address';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password';
        break;
      default:
        errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { success: true, userData: userDoc.data() };
    } else {
      return { success: false, error: 'User data not found' };
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const updateUserProfile = async (uid, updatedData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

export const addArtwork = async (uid, artworkData) => {
  try {
    const artworksRef = collection(db, 'artworks');
    const docRef = await addDoc(artworksRef, {
      ...artworkData,
      artistId: uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      views: 0,
      likes: 0,
      status: 'pending' // Add default status
    });
    return { success: true, artworkId: docRef.id };
  } catch (error) {
    console.error('Error adding artwork:', error);
    return { success: false, error: error.message };
  }
};

// Get user's artworks (delegated to artwork service)
export const getUserArtworks = async (uid) => {
  return await getArtworksFromService(uid);
};

// Get artist statistics (delegated to artwork service)
export const getArtistStats = async (uid) => {
  return await getStatsFromService(uid);
};
