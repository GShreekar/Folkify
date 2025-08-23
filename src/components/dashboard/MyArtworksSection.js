import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteArtwork } from '../../services/artworkService';
import ArtworkForm from '../artwork/ArtworkForm';

const MyArtworksSection = () => {
  const { userArtworks, refreshUserProfile } = useAuth();
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteArtwork = async (artworkId) => {
    try {
      setIsDeleting(true);
      const result = await deleteArtwork(artworkId);
      
      if (result.success) {
        await refreshUserProfile();
        setDeleteConfirm(null);
      } else {
        alert('Error deleting artwork: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Failed to delete artwork');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArtworkSuccess = () => {
    setShowArtworkForm(false);
    setEditingArtwork(null);
  };

  const handleEditArtwork = (artwork) => {
    setEditingArtwork(artwork);
    setShowArtworkForm(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Price on request';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(price);
  };

  const ArtworkDetailsModal = ({ artwork, onClose }) => {
    if (!artwork) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-amber-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-amber-800 mb-2">{artwork.title}</h2>
                <span className="text-amber-600">{artwork.artForm}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-amber-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                {artwork.imageUrl ? (
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-96 object-cover rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-amber-500">No image available</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
                </div>

                {artwork.materials && (
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Materials</h3>
                    <p className="text-gray-700">{artwork.materials}</p>
                  </div>
                )}

                {artwork.dimensions && (
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Dimensions</h3>
                    <p className="text-gray-700">{artwork.dimensions}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Year</h3>
                    <p className="text-gray-700">{artwork.yearCreated}</p>
                  </div>
                  
                  {artwork.isForSale && artwork.price && (
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Price</h3>
                      <p className="text-green-600 font-semibold">
                        {formatPrice(artwork.price, artwork.currency)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-amber-600 py-3 border-t border-amber-200">
                  <span>Created: {formatDate(artwork.createdAt)}</span>
                </div>

                {artwork.tags && artwork.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      onClose();
                      handleEditArtwork(artwork);
                    }}
                    className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors font-medium"
                  >
                    Edit Artwork
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      setDeleteConfirm(artwork);
                    }}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ artwork, onConfirm, onCancel }) => {
    if (!artwork) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Artwork</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<strong>{artwork.title}</strong>"? 
            This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(artwork.id)}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="my-artworks-section" className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-amber-800 mb-2">My Artworks</h2>
          <p className="text-amber-600">
            {userArtworks?.length || 0} artwork{(userArtworks?.length || 0) !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        
        <button
          onClick={() => setShowArtworkForm(true)}
          className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <span className="mr-2">🎨</span>
          Add New Artwork
        </button>
      </div>

      {/* Artworks Grid */}
      {!userArtworks || userArtworks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-amber-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">No artworks yet</h3>
          <p className="text-amber-600 mb-6">Share your first artwork with the world!</p>
          <button
            onClick={() => setShowArtworkForm(true)}
            className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transition-all duration-200"
          >
            Add Your First Artwork
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-amber-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-amber-200/50 cursor-pointer"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="aspect-square overflow-hidden">
                {artwork.imageUrl ? (
                  <img
                    src={artwork.thumbnailUrl || artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-amber-800 line-clamp-1 mb-2">{artwork.title}</h3>
                
                <p className="text-amber-600 text-sm mb-2">{artwork.artForm}</p>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {artwork.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  {artwork.isForSale && artwork.price && (
                    <span className="font-semibold text-green-600 text-xs">
                      {formatPrice(artwork.price, artwork.currency)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-amber-500 mt-2">
                  Created {formatDate(artwork.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artwork Form */}
      {showArtworkForm && (
        <div className="mt-10 mb-4">
          <ArtworkForm
            key="artwork-form"
            isOpen={showArtworkForm}
            onClose={() => {
              setShowArtworkForm(false);
              setEditingArtwork(null);
            }}
            artwork={editingArtwork}
            onSuccess={handleArtworkSuccess}
          />
        </div>
      )}

      {/* Other Modals */}
      <ArtworkDetailsModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />

      <DeleteConfirmModal
        artwork={deleteConfirm}
        onConfirm={handleDeleteArtwork}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default MyArtworksSection;
