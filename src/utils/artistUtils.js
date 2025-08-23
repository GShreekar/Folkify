// Artist data management utilities

/**
 * Check if an artist should be verified based on artwork count
 * @param {number} artworkCount - Number of artworks uploaded by the artist
 * @returns {boolean} - Whether the artist should be verified
 */
export const shouldBeVerified = (artworkCount) => {
  return artworkCount >= 3;
};

/**
 * Update artist verification status based on artwork count
 * @param {Object} artist - Artist object
 * @param {number} artworkCount - Current artwork count
 * @returns {Object} - Updated artist object with verification status
 */
export const updateArtistVerification = (artist, artworkCount) => {
  const isVerified = shouldBeVerified(artworkCount);
  
  return {
    ...artist,
    artworkCount,
    isVerified,
    verificationDate: isVerified && !artist.isVerified ? new Date().toISOString() : artist.verificationDate
  };
};

/**
 * Get artworks by artist from artworks array
 * @param {Array} artworks - Array of all artworks
 * @param {string} artistName - Name of the artist
 * @returns {Array} - Array of artworks by the specified artist
 */
export const getArtworksByArtist = (artworks, artistName) => {
  return artworks.filter(artwork => artwork.artist === artistName);
};

/**
 * Count artworks by artist
 * @param {Array} artworks - Array of all artworks
 * @param {string} artistName - Name of the artist
 * @returns {number} - Number of artworks by the artist
 */
export const countArtworksByArtist = (artworks, artistName) => {
  return getArtworksByArtist(artworks, artistName).length;
};

/**
 * Check verification status for all artists based on their artwork count
 * @param {Array} artists - Array of artist objects
 * @param {Array} artworks - Array of all artworks
 * @returns {Array} - Updated artists array with verification status
 */
export const updateAllArtistsVerification = (artists, artworks) => {
  return artists.map(artist => {
    const artworkCount = countArtworksByArtist(artworks, artist.name);
    return updateArtistVerification(artist, artworkCount);
  });
};

/**
 * Mock database operations for artist verification
 */
export const mockArtistDatabase = {
  /**
   * Simulate updating artist verification in database
   * @param {string} artistId - Artist ID
   * @param {boolean} isVerified - Verification status
   * @param {number} artworkCount - Current artwork count
   * @returns {Promise} - Simulated database response
   */
  updateVerification: async (artistId, isVerified, artworkCount) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`[Mock DB] Updated artist ${artistId}: verified=${isVerified}, artworks=${artworkCount}`);
    
    return {
      success: true,
      artistId,
      isVerified,
      artworkCount,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Simulate fetching artist data from database
   * @param {string} artistId - Artist ID
   * @returns {Promise} - Simulated artist data
   */
  getArtist: async (artistId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Return mock artist data
    return {
      id: artistId,
      name: 'Mock Artist',
      isVerified: false,
      artworkCount: 0,
      bio: 'Mock artist bio',
      region: 'Mock Region',
      artform: 'Mock Art Form'
    };
  }
};
