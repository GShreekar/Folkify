import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteArtwork } from '../../firebase/auth';
import ArtworkManagement from '../artwork/ArtworkManagement';
import BadgeNotification from '../BadgeNotification';

const MyArtworksSection = () => {
  const { userArtworks, loadUserArtworks } = useAuth();
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeleteArtwork = async (artworkId) => {
    try {
      const result = await deleteArtwork(artworkId);
      if (result.success) {
        await loadUserArtworks();
        showNotification('Artwork deleted successfully');
        setDeleteConfirm(null);
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      showNotification('Failed to delete artwork', 'error');
    }
  };

  const handleArtworkSuccess = () => {
    setShowArtworkForm(false);
    setEditingArtwork(null);
    showNotification('Artwork saved successfully');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'Not for sale';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6">
      {notification && (
        <BadgeNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">My Artworks</h2>
        <button
          onClick={() => setShowArtworkForm(true)}
          className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          + Add New Artwork
        </button>
      </div>

      {userArtworks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-amber-900 mb-2">No Artworks Yet</h3>
          <p className="text-amber-600 mb-6">
            Start building your portfolio by uploading your first artwork!
          </p>
          <button
            onClick={() => setShowArtworkForm(true)}
            className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transition-all duration-200"
          >
            Upload Your First Artwork
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-amber-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-amber-200"
            >
              <div className="h-48 bg-gradient-to-br from-amber-200 to-red-200 flex items-center justify-center">
                <span className="text-6xl">🎨</span>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-amber-900 truncate">
                    {artwork.title}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingArtwork(artwork)}
                      className="text-amber-600 hover:text-amber-700 p-1"
                      title="Edit artwork"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(artwork.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete artwork"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    {artwork.artForm}
                  </span>
                  {artwork.isForSale && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      For Sale
                    </span>
                  )}
                </div>

                <p className="text-amber-600 text-sm line-clamp-3 mb-3">
                  {artwork.description}
                </p>

                <div className="flex justify-between items-center text-xs text-amber-700">
                  <span>{formatDate(artwork.createdAt)}</span>
                  <span className="font-semibold">{formatPrice(artwork.price)}</span>
                </div>

                {artwork.tags && artwork.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {artwork.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {artwork.tags.length > 3 && (
                      <span className="text-xs text-amber-600">
                        +{artwork.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-amber-200 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-amber-800">
                      {artwork.views || 0}
                    </div>
                    <div className="text-xs text-amber-600">Views</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-800">
                      {artwork.likes || 0}
                    </div>
                    <div className="text-xs text-red-600">Likes</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showArtworkForm || editingArtwork) && (
        <ArtworkManagement
          artwork={editingArtwork}
          isEditing={!!editingArtwork}
          onSuccess={handleArtworkSuccess}
          onCancel={() => {
            setShowArtworkForm(false);
            setEditingArtwork(null);
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold text-amber-900 mb-3">
              Delete Artwork
            </h3>
            <p className="text-amber-700 mb-6">
              Are you sure you want to delete this artwork? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArtwork(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArtworksSection;
