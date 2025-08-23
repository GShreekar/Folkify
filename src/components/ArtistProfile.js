import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtistProfile } from '../services/artistService';
import VerifiedArtistBadge from './VerifiedArtistBadge';
import ArtworkModal from './artwork/ArtworkModal';
import Navigation from './Navigation';
import Footer from './Footer';

const ArtistProfile = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtistProfile = async () => {
      try {
        const result = await getArtistProfile(artistId);
        if (result.success) {
          setArtist(result.artist);
          setArtworks(result.artworks);
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Error loading artist profile:', error);
        setError('Failed to load artist profile');
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      loadArtistProfile();
    }
  }, [artistId]);

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Price on request';
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-800 text-lg">Loading artist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">Artist Not Found</h2>
            <p className="text-amber-600 mb-6">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Artist Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-6xl">
                👤
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-amber-900">
                      {artist.fullName || 'Anonymous Artist'}
                    </h1>
                    {artist.isVerified && <VerifiedArtistBadge size="lg" />}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      {artist.primaryArtForm || 'Folk Artist'}
                    </span>
                    {artist.village && (
                      <div className="flex items-center text-amber-700 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {artist.village}
                      </div>
                    )}
                    {artist.yearsOfExperience && (
                      <span className="text-amber-700 text-sm">
                        {artist.yearsOfExperience} years experience
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-amber-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-amber-800">{artworks.length}</div>
                    <div className="text-sm text-amber-600">Artworks</div>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-800">
                      {artist.isVerified ? '✓' : '⏳'}
                    </div>
                    <div className="text-sm text-green-600">
                      {artist.isVerified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-800">
                      {artworks.reduce((total, artwork) => total + (artwork.views || 0), 0)}
                    </div>
                    <div className="text-sm text-blue-600">Total Views</div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {artist.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">About the Artist</h3>
                  <p className="text-gray-700 leading-relaxed">{artist.bio}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artist.specialization && (
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Specialization</h4>
                    <p className="text-gray-700">{artist.specialization}</p>
                  </div>
                )}

                {artist.awardsAndRecognition && (
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Awards & Recognition</h4>
                    <p className="text-gray-700">{artist.awardsAndRecognition}</p>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(artist.socialMedia?.website || artist.socialMedia?.instagram || artist.socialMedia?.facebook) && (
                <div className="mt-6 pt-6 border-t border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">Connect with the Artist</h4>
                  <div className="flex gap-4">
                    {artist.socialMedia.website && (
                      <a
                        href={artist.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        🌐 Website
                      </a>
                    )}
                    {artist.socialMedia.instagram && (
                      <a
                        href={artist.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                      >
                        📷 Instagram
                      </a>
                    )}
                    {artist.socialMedia.facebook && (
                      <a
                        href={artist.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        📘 Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-amber-800">
              {artist.fullName}'s Artworks ({artworks.length})
            </h2>
          </div>

          {artworks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-amber-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-amber-800 mb-2">No artworks yet</h3>
              <p className="text-amber-600">This artist hasn't uploaded any artworks yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="bg-amber-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-amber-200/50"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <div className="aspect-square overflow-hidden rounded-t-xl">
                    {artwork.imageUrl ? (
                      <img
                        src={artwork.thumbnailUrl || artwork.imageUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-amber-800 line-clamp-1 mb-2">{artwork.title}</h3>
                    <p className="text-amber-600 text-sm mb-2">{artwork.artForm}</p>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{artwork.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-3 text-amber-600">
                        <span>👁 {artwork.views || 0}</span>
                        <span>❤️ {artwork.likes || 0}</span>
                      </div>
                      
                      {artwork.isForSale && artwork.price && (
                        <span className="font-semibold text-green-600">
                          {formatPrice(artwork.price, artwork.currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      <ArtworkModal 
        artwork={selectedArtwork} 
        onClose={() => setSelectedArtwork(null)} 
      />
    </div>
  );
};

export default ArtistProfile;
