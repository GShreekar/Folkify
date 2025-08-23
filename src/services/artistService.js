import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUserArtworks } from './artworkService';

/**
 * Get artist profile with their artworks
 * @param {string} artistId - Artist's UID
 * @returns {Promise<Object>} - Result with artist data and artworks
 */
export const getArtistProfile = async (artistId) => {
  try {
    // Get artist data
    const artistDoc = await getDoc(doc(db, 'users', artistId));
    if (!artistDoc.exists()) {
      return { success: false, error: 'Artist not found' };
    }
    
    const artistData = { id: artistId, ...artistDoc.data() };
    
    // Get artist's artworks
    const artworksResult = await getUserArtworks(artistId, { limitCount: 50 });
    const artworks = artworksResult.success ? artworksResult.artworks : [];
    
    return { 
      success: true, 
      artist: artistData,
      artworks: artworks
    };
  } catch (error) {
    console.error('Error getting artist profile:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
