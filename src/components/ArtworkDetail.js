import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtwork } from '../services/artworkService';
import { getArtistProfile } from '../services/artistService';
import { useAuth } from '../contexts/AuthContext';
import VerifiedArtistBadge from './VerifiedArtistBadge';
import Navigation from './Navigation';
import Footer from './Footer';
import PurchaseModal from './artwork/PurchaseModal';
import ArtworkForm from './artwork/ArtworkForm';
import './FolkArtAnimations.css';

const ArtworkDetail = () => {
  const { artworkId } = useParams();
  const { currentUser, loading: authLoading } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Check if current user is the owner of this artwork
  const isArtworkOwner = currentUser && artwork && currentUser.uid === artwork.artistId;

  const handlePurchaseSuccess = (purchaseId) => {
    setPurchaseSuccess(true);
    console.log('Purchase created successfully:', purchaseId);
    // You could add a toast notification here
  };

  const handleArtworkFormSuccess = async () => {
    // Reload the artwork data to show updated information
    try {
      const artworkResult = await getArtwork(artworkId);
      if (artworkResult.success) {
        setArtwork(artworkResult.artwork);
      }
    } catch (error) {
      console.error('Error reloading artwork:', error);
    }
  };

  const handleArtworkFormClose = () => {
    setShowArtworkForm(false);
    // Always reload when form closes to ensure we have latest data
    handleArtworkFormSuccess();
  };

  useEffect(() => {
    const loadArtworkDetail = async () => {
      try {
        // Get artwork data
        const artworkResult = await getArtwork(artworkId);
        if (!artworkResult.success) {
          setError(artworkResult.error);
          setLoading(false);
          return;
        }

        setArtwork(artworkResult.artwork);

        // Get artist data
        const artistResult = await getArtistProfile(artworkResult.artwork.artistId);
        if (artistResult.success) {
          setArtist(artistResult.artist);
        }
      } catch (error) {
        console.error('Error loading artwork detail:', error);
        setError('Failed to load artwork details');
      } finally {
        setLoading(false);
      }
    };

    if (artworkId) {
      loadArtworkDetail();
    }
  }, [artworkId]);

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Price on request';
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-800 text-lg">Loading artwork...</p>
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
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-amber-800 mb-2">Artwork Not Found</h2>
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
    <div className="min-h-screen folk-art-background">
      {/* Mandala Patterns */}
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="mandala-pattern mandala-3"></div>
      
      {/* Warli Art Figures */}
      <div className="warli-figure warli-1">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-2">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-3">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      
      {/* Geometric Patterns */}
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>
      
      <Navigation />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-amber-700 hover:text-amber-800 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Gallery
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="aspect-square lg:aspect-auto">
              {artwork.imageUrl ? (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-20 h-20 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-amber-500 text-lg">No image available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {artwork.artForm}
                  </span>
                  {artwork.isForSale && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      For Sale
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-amber-900 mb-2">{artwork.title}</h1>
                
                {/* Artist Info */}
                {artist && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-amber-800">
                          {artist.fullName || 'Anonymous Artist'}
                        </span>
                        {artist.isVerified && <VerifiedArtistBadge size="xs" />}
                      </div>
                      <p className="text-sm text-amber-600">
                        {artist.village && `${artist.village} • `}{artist.primaryArtForm}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {artwork.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-800 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                </div>
              )}

              {/* Technical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {artwork.materials && (
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Materials</h4>
                    <p className="text-gray-700 text-sm">{artwork.materials}</p>
                  </div>
                )}

                {artwork.dimensions && (
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Dimensions</h4>
                    <p className="text-gray-700 text-sm">{artwork.dimensions}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Year Created</h4>
                  <p className="text-gray-700 text-sm">{artwork.yearCreated}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Listed On</h4>
                  <p className="text-gray-700 text-sm">{formatDate(artwork.createdAt)}</p>
                </div>
              </div>

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-amber-800 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Section */}
              {artwork.isForSale && artwork.price && (
                <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Price</h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {formatPrice(artwork.price, artwork.currency)}
                  </p>
                  <p className="text-sm text-green-700">
                    Contact the artist for purchase inquiries
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Buy Button - Show only when logged in, not loading, and not the artwork owner */}
                {artwork.isForSale && !authLoading && currentUser && !isArtworkOwner && (
                  <button 
                    onClick={() => setShowPurchaseModal(true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
                  >
                    Buy Artwork
                  </button>
                )}

                {/* Login prompt - Show only when not loading, not logged in, and not the artwork owner */}
                {artwork.isForSale && !authLoading && !currentUser && !isArtworkOwner && (
                  <div className="flex-1">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-amber-800 text-sm text-center">
                        Please{' '}
                        <a 
                          href="/login"
                          className="underline font-medium hover:text-amber-900"
                        >
                          log in
                        </a>{' '}
                        to purchase this artwork
                      </p>
                    </div>
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Buy Artwork
                    </button>
                  </div>
                )}

                {/* Loading state - Show loading button while auth is being determined and not the artwork owner */}
                {artwork.isForSale && authLoading && !isArtworkOwner && (
                  <button 
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Loading...
                  </button>
                )}

                {/* Owner message - Show when the current user is the artwork owner */}
                {isArtworkOwner && artwork.isForSale && (
                  <div className="flex-1 text-center py-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-blue-600 text-sm font-medium">
                        This is your artwork
                      </p>
                    </div>
                  </div>
                )}

                {/* Edit Artwork button for artwork owner */}
                {isArtworkOwner && (
                  <button 
                    onClick={() => setShowArtworkForm(true)}
                    className="flex-1 bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
                  >
                    ✏️ Edit Artwork
                  </button>
                )}

                {!artwork.isForSale && (
                  <div className="flex-1 text-center py-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-gray-600 text-sm">
                        This artwork is not currently for sale
                      </p>
                    </div>
                  </div>
                )}
                
                {/* View Artist Profile - Hide when user is viewing their own artwork */}
                {artist && !isArtworkOwner && (
                  <button 
                    onClick={() => window.location.href = `/artist/${artist.id}`}
                    className="flex-1 border-2 border-amber-600 text-amber-700 py-3 px-6 rounded-xl font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200"
                  >
                    View Artist Profile
                  </button>
                )}
              </div>

              {/* Purchase Success Message */}
              {purchaseSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h5 className="text-green-800 font-medium">Purchase Request Submitted!</h5>
                      <p className="text-green-700 text-sm">The artist has been notified of your interest.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          artwork={{
            ...artwork,
            artistName: artist?.fullName || 'Unknown Artist'
          }}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}

      {/* Artwork Edit Form */}
      {showArtworkForm && (
        <ArtworkForm
          isOpen={showArtworkForm}
          onClose={handleArtworkFormClose}
          artwork={artwork}
        />
      )}

      <Footer />
    </div>
  );
};

export default ArtworkDetail;
