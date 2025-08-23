import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  limit,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadArtworkImage, deleteArtworkImage } from './cloudinaryService';
import { checkVerificationStatus, updateArtistWithBadge } from './badgeService';

// Art form categories
export const ART_FORMS = [
  'Painting',
  'Sculpture',
  'Pottery',
  'Textiles',
  'Woodwork',
  'Metalwork',
  'Jewelry',
  'Folk Dance',
  'Music',
  'Storytelling',
  'Other'
];

/**
 * Create new artwork with Cloudinary image upload
 * @param {string} artistId - Artist's UID
 * @param {Object} artworkData - Artwork information
 * @param {File} imageFile - Image file
 * @returns {Promise<Object>} - Result with success status and artwork ID
 */
export const createArtwork = async (artistId, artworkData, imageFile = null) => {
  try {
    let imageUrl = null;
    let publicId = null;
    let thumbnailUrl = null;

    // Upload image if provided
    if (imageFile) {
      const uploadResult = await uploadArtworkImage(imageFile, artistId);
      if (!uploadResult.success) {
        return uploadResult;
      }
      imageUrl = uploadResult.imageUrl;
      publicId = uploadResult.publicId;
      thumbnailUrl = uploadResult.thumbnailUrl;
    }

    // Prepare artwork document
    const artworkDoc = {
      title: artworkData.title,
      description: artworkData.description,
      artForm: artworkData.artForm,
      imageUrl: imageUrl,
      thumbnailUrl: thumbnailUrl,
      publicId: publicId,
      price: artworkData.price ? parseFloat(artworkData.price) : null,
      currency: artworkData.currency || 'INR',
      dimensions: artworkData.dimensions || '',
      materials: artworkData.materials || '',
      yearCreated: artworkData.yearCreated || new Date().getFullYear(),
      tags: artworkData.tags || [],
      isForSale: artworkData.isForSale !== undefined ? artworkData.isForSale : true,
      artistId: artistId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      isActive: true
    };

    // Add to Firestore
    const artworksRef = collection(db, 'artworks');
    const docRef = await addDoc(artworksRef, artworkDoc);
    
    // Check and update artist verification status
    try {
      // Get current artist data
      const artistDoc = await getDoc(doc(db, 'users', artistId));
      if (artistDoc.exists()) {
        const artistData = { id: artistId, ...artistDoc.data() };
        
        // Get all artist's artworks for verification check
        const artistArtworksResult = await getUserArtworks(artistId);
        const allArtistArtworks = artistArtworksResult.success ? artistArtworksResult.artworks : [];
        
        // Add the newly created artwork to the count
        const updatedArtworks = [...allArtistArtworks, { id: docRef.id, ...artworkDoc }];
        
        // Check verification status
        const verificationStatus = checkVerificationStatus(artistData, updatedArtworks);
        
        // Update artist if verification status changed
        if (verificationStatus.verificationChanged) {
          const updatedArtist = updateArtistWithBadge(artistData, verificationStatus);
          await updateDoc(doc(db, 'users', artistId), {
            isVerified: updatedArtist.isVerified,
            verificationDate: updatedArtist.verificationDate || null,
            updatedAt: new Date().toISOString()
          });
        }
      }
    } catch (verificationError) {
      console.error('Error updating verification status:', verificationError);
      // Don't fail artwork creation if verification update fails
    }
    
    return { 
      success: true, 
      artworkId: docRef.id,
      artwork: { id: docRef.id, ...artworkDoc }
    };
  } catch (error) {
    console.error('Error creating artwork:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Update existing artwork
 * @param {string} artworkId - Artwork ID
 * @param {Object} updatedData - Updated artwork data
 * @param {File} newImageFile - New image file (optional)
 * @returns {Promise<Object>} - Result with success status
 */
export const updateArtwork = async (artworkId, updatedData, newImageFile = null) => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    
    // Get current artwork data
    const currentArtwork = await getDoc(artworkRef);
    if (!currentArtwork.exists()) {
      return { success: false, error: 'Artwork not found' };
    }
    
    const currentData = currentArtwork.data();
    let imageUrl = currentData.imageUrl;
    let publicId = currentData.publicId;
    let thumbnailUrl = currentData.thumbnailUrl;

    // Handle image update
    if (newImageFile) {
      // Delete old image if exists
      if (currentData.publicId) {
        await deleteArtworkImage(currentData.publicId);
      }

      // Upload new image
      const uploadResult = await uploadArtworkImage(newImageFile, currentData.artistId);
      if (!uploadResult.success) {
        return uploadResult;
      }
      imageUrl = uploadResult.imageUrl;
      publicId = uploadResult.publicId;
      thumbnailUrl = uploadResult.thumbnailUrl;
    }

    // Prepare update data
    const updateData = {
      ...updatedData,
      imageUrl: imageUrl,
      publicId: publicId,
      thumbnailUrl: thumbnailUrl,
      updatedAt: new Date().toISOString()
    };

    // Process specific fields
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    // Update document
    await updateDoc(artworkRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating artwork:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Delete artwork (soft delete)
 * @param {string} artworkId - Artwork ID
 * @returns {Promise<Object>} - Result with success status
 */
export const deleteArtwork = async (artworkId) => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    
    // Soft delete - mark as inactive
    await updateDoc(artworkRef, {
      isActive: false,
      updatedAt: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Permanently delete artwork and its image
 * @param {string} artworkId - Artwork ID
 * @returns {Promise<Object>} - Result with success status
 */
export const permanentlyDeleteArtwork = async (artworkId) => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    
    // Get artwork data to delete image
    const artworkDoc = await getDoc(artworkRef);
    if (artworkDoc.exists()) {
      const artworkData = artworkDoc.data();
      
      // Delete image from Cloudinary
      if (artworkData.publicId) {
        await deleteArtworkImage(artworkData.publicId);
      }
    }
    
    // Delete document
    await deleteDoc(artworkRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error permanently deleting artwork:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get artist's artworks
 * @param {string} artistId - Artist's UID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Result with artworks array
 */
export const getUserArtworks = async (artistId, options = {}) => {
  try {
    const {
      isActive = true,
      limitCount = 50,
      orderField = 'createdAt',
      orderDirection = 'desc'
    } = options;

    let q = query(
      collection(db, 'artworks'),
      where('artistId', '==', artistId),
      where('isActive', '==', isActive)
    );

    q = query(q, orderBy(orderField, orderDirection));

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const artworks = [];
    
    querySnapshot.forEach((doc) => {
      artworks.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });

    return { 
      success: true, 
      artworks 
    };
  } catch (error) {
    console.error('Error getting user artworks:', error);
    return { 
      success: false, 
      error: error.message, 
      artworks: [] 
    };
  }
};

/**
 * Get all artworks (for gallery)
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Result with artworks array
 */
export const getAllArtworks = async (options = {}) => {
  try {
    const {
      isActive = true,
      limitCount = 50,
      artForm = null,
      orderField = 'createdAt',
      orderDirection = 'desc'
    } = options;

    let q = query(
      collection(db, 'artworks'),
      where('isActive', '==', isActive)
    );

    if (artForm) {
      q = query(q, where('artForm', '==', artForm));
    }

    q = query(q, orderBy(orderField, orderDirection));

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const artworks = [];
    
    querySnapshot.forEach((doc) => {
      artworks.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });

    return { 
      success: true, 
      artworks 
    };
  } catch (error) {
    console.error('Error getting all artworks:', error);
    return { 
      success: false, 
      error: error.message, 
      artworks: [] 
    };
  }
};

/**
 * Get single artwork by ID
 * @param {string} artworkId - Artwork ID
 * @returns {Promise<Object>} - Result with artwork data
 */
export const getArtwork = async (artworkId) => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    const artworkDoc = await getDoc(artworkRef);
    
    if (!artworkDoc.exists()) {
      return { 
        success: false, 
        error: 'Artwork not found' 
      };
    }
    
    return { 
      success: true, 
      artwork: { 
        id: artworkDoc.id, 
        ...artworkDoc.data() 
      } 
    };
  } catch (error) {
    console.error('Error getting artwork:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Increment artwork views
 * @param {string} artworkId - Artwork ID
 * @returns {Promise<Object>} - Result with success status
 */
export const incrementArtworkViews = async (artworkId) => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    
    await updateDoc(artworkRef, {
      views: increment(1)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Toggle artwork like
 * @param {string} artworkId - Artwork ID
 * @param {boolean} isLiked - Whether to add or remove like
 * @returns {Promise<Object>} - Result with success status
 */
export const toggleArtworkLike = async (artworkId, isLiked) => {
  try {
    const artworkRef = doc(db, 'artworks', artworkId);
    
    await updateDoc(artworkRef, {
      likes: increment(isLiked ? 1 : -1)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get artist verification progress
 * @param {string} artistId - Artist's UID
 * @returns {Promise<Object>} - Verification progress data
 */
export const getArtistVerificationProgress = async (artistId) => {
  try {
    // Get artist data
    const artistDoc = await getDoc(doc(db, 'users', artistId));
    if (!artistDoc.exists()) {
      return { success: false, error: 'Artist not found' };
    }
    
    const artistData = { id: artistId, ...artistDoc.data() };
    
    // Get artist's artworks
    const artworksResult = await getUserArtworks(artistId);
    const artworks = artworksResult.success ? artworksResult.artworks : [];
    
    // Calculate verification status
    const verificationStatus = checkVerificationStatus(artistData, artworks);
    
    const progress = {
      current: verificationStatus.artworkCount,
      target: 3,
      percentage: Math.min((verificationStatus.artworkCount / 3) * 100, 100),
      remaining: verificationStatus.remainingArtworks,
      isComplete: verificationStatus.shouldBeVerified,
      isVerified: artistData.isVerified || false,
      status: verificationStatus.shouldBeVerified ? 'verified' : 
              verificationStatus.artworkCount >= 2 ? 'almost_there' : 'in_progress'
    };
    
    return { success: true, progress };
  } catch (error) {
    console.error('Error getting verification progress:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get artwork statistics for an artist
 * @param {string} artistId - Artist's UID
 * @returns {Promise<Object>} - Result with statistics
 */
export const getArtistStats = async (artistId) => {
  try {
    const artworksResult = await getUserArtworks(artistId);
    const artworks = artworksResult.artworks || [];
    
    const stats = {
      totalArtworks: artworks.length,
      totalViews: artworks.reduce((sum, artwork) => sum + (artwork.views || 0), 0),
      totalLikes: artworks.reduce((sum, artwork) => sum + (artwork.likes || 0), 0),
      artFormsCount: [...new Set(artworks.map(a => a.artForm))].length,
      recentArtworks: artworks.slice(0, 5)
    };
    
    return { success: true, stats };
  } catch (error) {
    console.error('Error getting artist stats:', error);
    return { success: false, error: error.message };
  }
};
