import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PurchaseModal from './PurchaseModal';

const ArtworkModal = ({ artwork, onClose }) => {
  const { currentUser, loading } = useAuth();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  if (!artwork) return null;

  const handlePurchaseSuccess = (purchaseId) => {
    setPurchaseSuccess(true);
    console.log('Purchase created successfully:', purchaseId);
    // You could add a toast notification here
  };

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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-amber-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-800">Artwork Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              {artwork.imageUrl ? (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full h-96 lg:h-[500px] bg-amber-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-amber-500">No image available</span>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Title & Basic Info */}
              <div>
                <h3 className="text-3xl font-bold text-amber-900 mb-2">{artwork.title}</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {artwork.artForm}
                  </span>
                  {artwork.isForSale && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      For Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {artwork.description && (
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                </div>
              )}

              {/* Technical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {artwork.materials && (
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Materials</h4>
                    <p className="text-gray-700">{artwork.materials}</p>
                  </div>
                )}

                {artwork.dimensions && (
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Dimensions</h4>
                    <p className="text-gray-700">{artwork.dimensions}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Year Created</h4>
                  <p className="text-gray-700">{artwork.yearCreated}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Created On</h4>
                  <p className="text-gray-700">{formatDate(artwork.createdAt)}</p>
                </div>
              </div>

              {/* Price */}
              {artwork.isForSale && artwork.price && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Price</h4>
                  <p className="text-3xl font-bold text-green-600">
                    {formatPrice(artwork.price, artwork.currency)}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Contact the artist for purchase inquiries
                  </p>
                </div>
              )}

              {/* Tags */}
              {artwork.tags && artwork.tags.length > 0 && (
                <div>
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {artwork.isForSale && currentUser && (
                  <button 
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
                  >
                    Buy Artwork
                  </button>
                )}

                                {/* Buy Now Button - Show only when logged in and not loading */}
                {artwork.isForSale && !loading && currentUser && (
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Buy Now - {formatPrice(artwork.price)}
                  </button>
                )}

                {/* Login prompt - Show only when not loading and not logged in */}
                {artwork.isForSale && !loading && !currentUser && (
                  <div className="w-full">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-amber-800 text-sm text-center">
                        Please{' '}
                        <button 
                          onClick={onClose}
                          className="underline font-medium hover:text-amber-900"
                        >
                          log in
                        </button>{' '}
                        to purchase this artwork
                      </p>
                    </div>
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Login Required
                    </button>
                  </div>
                )}

                {/* Loading state - Show loading button while auth is being determined */}
                {artwork.isForSale && loading && (
                  <button 
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Loading...
                  </button>
                )}

                {!artwork.isForSale && (
                  <div className="w-full text-center py-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-gray-600 text-sm">
                        This artwork is not currently for sale
                      </p>
                    </div>
                  </div>
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

        {/* Purchase Modal */}
        {showPurchaseModal && (
          <PurchaseModal
            artwork={artwork}
            onClose={() => setShowPurchaseModal(false)}
            onSuccess={handlePurchaseSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ArtworkModal;
