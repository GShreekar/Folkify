import { useState } from 'react';

export const BADGE_CONFIG = {
  VERIFICATION_THRESHOLD: 3,
  BADGE_TYPES: {
    VERIFIED_ARTIST: 'verified_artist',
  }
};

/**
 * Check if an artist qualifies for verification badge
 * @param {Object} artist - Artist object
 * @param {Array} artworks - Array of artworks by the artist (no approval needed)
 * @returns {Object} - Verification status and details
 */
export const checkVerificationStatus = (artist, artworks = []) => {
  const artistArtworks = artworks.filter(artwork => 
    artwork.artistId === artist.id && artwork.isActive
  );
  
  const artworkCount = artistArtworks.length;
  const shouldBeVerified = artworkCount >= BADGE_CONFIG.VERIFICATION_THRESHOLD;
  const wasAlreadyVerified = artist.isVerified || false;
  
  return {
    shouldBeVerified,
    wasAlreadyVerified,
    artworkCount,
    verificationChanged: shouldBeVerified !== wasAlreadyVerified,
    remainingArtworks: Math.max(0, BADGE_CONFIG.VERIFICATION_THRESHOLD - artworkCount)
  };
};

/**
 * Update artist with verification status
 * @param {Object} artist - Original artist object
 * @param {Object} verificationStatus - Status from checkVerificationStatus
 * @returns {Object} - Updated artist object
 */
export const updateArtistWithBadge = (artist, verificationStatus) => {
  const updatedArtist = {
    ...artist,
    artworkCount: verificationStatus.artworkCount,
    isVerified: verificationStatus.shouldBeVerified
  };

  if (verificationStatus.verificationChanged && verificationStatus.shouldBeVerified) {
    updatedArtist.verificationDate = new Date().toISOString();
  }

  if (verificationStatus.verificationChanged && !verificationStatus.shouldBeVerified) {
    delete updatedArtist.verificationDate;
  }

  return updatedArtist;
};

/**
 * Process artwork upload and update artist verification
 * This function should be called whenever an artwork is uploaded/approved
 * @param {Object} artist - Artist object
 * @param {Array} allArtworks - All artworks in the system
 * @returns {Object} - Result with updated artist and notification info
 */
export const processArtworkUpload = (artist, allArtworks) => {
  const verificationStatus = checkVerificationStatus(artist, allArtworks);
  const updatedArtist = updateArtistWithBadge(artist, verificationStatus);
  
  let notification = null;
  
  if (verificationStatus.verificationChanged) {
    if (verificationStatus.shouldBeVerified) {
      notification = {
        type: 'success',
        title: '🎉 Congratulations!',
        message: 'You are now a Verified Artist! Your profile will show the verified badge.',
        duration: 8000
      };
    }
  } else if (verificationStatus.remainingArtworks > 0) {
    notification = {
      type: 'info',
      title: 'Keep Going!',
      message: `Upload ${verificationStatus.remainingArtworks} more artwork${verificationStatus.remainingArtworks !== 1 ? 's' : ''} to become a Verified Artist.`,
      duration: 4000
    };
  }
  
  return {
    updatedArtist,
    verificationChanged: verificationStatus.verificationChanged,
    notification
  };
};

/**
 * Get verification progress for an artist
 * @param {Object} artist - Artist object
 * @returns {Object} - Progress information
 */
export const getVerificationProgress = (artist) => {
  const current = artist.artworkCount || 0;
  const target = BADGE_CONFIG.VERIFICATION_THRESHOLD;
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(0, target - current);
  
  return {
    current,
    target,
    percentage,
    remaining,
    isComplete: current >= target,
    status: current >= target ? 'verified' : 
            current >= target - 1 ? 'almost_there' : 'in_progress'
  };
};

/**
 * Get all artists with their verification status
 * @param {Array} artists - Array of all artists
 * @param {Array} artworks - Array of all artworks
 * @returns {Array} - Updated artists with verification status
 */
export const updateAllArtistsVerification = (artists, artworks) => {
  return artists.map(artist => {
    const verificationStatus = checkVerificationStatus(artist, artworks);
    return updateArtistWithBadge(artist, verificationStatus);
  });
};

/**
 * Hook for React components to handle badge notifications
 */
export const useBadgeNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (notificationData) => {
    setNotification(notificationData);
    
    if (notificationData?.duration) {
      setTimeout(() => {
        setNotification(null);
      }, notificationData.duration);
    }
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};
