// Mock database service for artist verification system
import { mockArtists, mockArtworks } from '../data/mockData';
import { updateArtistVerification, countArtworksByArtist } from '../utils/artistUtils';

class MockDatabaseService {
  constructor() {
    // Initialize with mock data
    this.artists = [...mockArtists];
    this.artworks = [...mockArtworks];
    this.nextArtworkId = Math.max(...this.artworks.map(a => a.id)) + 1;
  }

  /**
   * Simulate API delay
   */
  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get artist by ID
   */
  async getArtist(artistId) {
    await this.delay(50);
    const artist = this.artists.find(a => a.id === artistId);
    if (!artist) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    return { ...artist };
  }

  /**
   * Get artist by name
   */
  async getArtistByName(name) {
    await this.delay(50);
    const artist = this.artists.find(a => a.name === name);
    if (!artist) {
      throw new Error(`Artist with name ${name} not found`);
    }
    return { ...artist };
  }

  /**
   * Get all artists
   */
  async getAllArtists() {
    await this.delay(100);
    return [...this.artists];
  }

  /**
   * Get artworks by artist
   */
  async getArtworksByArtist(artistId) {
    await this.delay(50);
    return this.artworks.filter(artwork => artwork.artistId === artistId);
  }

  /**
   * Get all artworks
   */
  async getAllArtworks() {
    await this.delay(100);
    return [...this.artworks];
  }

  /**
   * Add new artwork and check verification status
   */
  async addArtwork(artworkData) {
    await this.delay(200);
    
    const newArtwork = {
      ...artworkData,
      id: this.nextArtworkId++,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    this.artworks.push(newArtwork);

    // Update artist verification status
    const artist = this.artists.find(a => a.id === artworkData.artistId);
    if (artist) {
      const artworkCount = countArtworksByArtist(this.artworks, artist.name);
      const updatedArtist = updateArtistVerification(artist, artworkCount);
      
      // Update artist in the array
      const artistIndex = this.artists.findIndex(a => a.id === artist.id);
      this.artists[artistIndex] = updatedArtist;

      console.log(`[Mock DB] Artist ${artist.name} now has ${artworkCount} artworks, verified: ${updatedArtist.isVerified}`);

      return {
        artwork: newArtwork,
        artist: updatedArtist,
        verificationChanged: artist.isVerified !== updatedArtist.isVerified
      };
    }

    return { artwork: newArtwork, artist: null, verificationChanged: false };
  }

  /**
   * Update artist verification status
   */
  async updateArtistVerification(artistId, isVerified, artworkCount) {
    await this.delay(100);
    
    const artistIndex = this.artists.findIndex(a => a.id === artistId);
    if (artistIndex === -1) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }

    this.artists[artistIndex] = {
      ...this.artists[artistIndex],
      isVerified,
      artworkCount,
      verificationDate: isVerified && !this.artists[artistIndex].isVerified 
        ? new Date().toISOString() 
        : this.artists[artistIndex].verificationDate
    };

    console.log(`[Mock DB] Updated artist ${artistId}: verified=${isVerified}, artworks=${artworkCount}`);

    return {
      success: true,
      artist: { ...this.artists[artistIndex] }
    };
  }

  /**
   * Approve artwork (changes status from pending to approved)
   */
  async approveArtwork(artworkId) {
    await this.delay(100);
    
    const artworkIndex = this.artworks.findIndex(a => a.id === artworkId);
    if (artworkIndex === -1) {
      throw new Error(`Artwork with ID ${artworkId} not found`);
    }

    this.artworks[artworkIndex].status = 'approved';
    
    // Check if this approval affects artist verification
    const artwork = this.artworks[artworkIndex];
    const artist = this.artists.find(a => a.id === artwork.artistId);
    
    if (artist) {
      const approvedArtworkCount = this.artworks.filter(
        a => a.artistId === artist.id && a.status === 'approved'
      ).length;
      
      const updatedArtist = updateArtistVerification(artist, approvedArtworkCount);
      const artistIndex = this.artists.findIndex(a => a.id === artist.id);
      this.artists[artistIndex] = updatedArtist;

      return {
        artwork: this.artworks[artworkIndex],
        artist: updatedArtist,
        verificationChanged: artist.isVerified !== updatedArtist.isVerified
      };
    }

    return { 
      artwork: this.artworks[artworkIndex], 
      artist: null, 
      verificationChanged: false 
    };
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats() {
    await this.delay(50);
    
    const totalArtists = this.artists.length;
    const verifiedArtists = this.artists.filter(a => a.isVerified).length;
    const totalArtworks = this.artworks.length;
    const approvedArtworks = this.artworks.filter(a => a.status === 'approved').length;

    return {
      totalArtists,
      verifiedArtists,
      verificationRate: totalArtists > 0 ? (verifiedArtists / totalArtists * 100).toFixed(1) : 0,
      totalArtworks,
      approvedArtworks
    };
  }
}

// Create singleton instance
const mockDB = new MockDatabaseService();

export default mockDB;
