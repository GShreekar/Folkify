import React, { useState, useEffect } from 'react';
import { getAllArtworks, updateArtworkStatus, ARTWORK_STATUS } from '../../services/artworkService';
import LoadingSpinner from '../LoadingSpinner';

const ArtworkAdmin = () => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    loadArtworks();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [artworks, selectedStatus]);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const result = await getAllArtworks({
        status: null,
        limitCount: 100
      });
      
      if (result.success) {
        setArtworks(result.artworks);
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArtworks = () => {
    let filtered = [...artworks];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(artwork => artwork.status === selectedStatus);
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredArtworks(filtered);
  };

  const handleStatusUpdate = async (artworkId, newStatus, reason = null) => {
    try {
      setStatusUpdateLoading(true);
      const result = await updateArtworkStatus(artworkId, newStatus, reason);
      
      if (result.success) {
        setArtworks(prev => prev.map(artwork => 
          artwork.id === artworkId 
            ? { ...artwork, status: newStatus, statusReason: reason }
            : artwork
        ));
        
        setSelectedArtwork(null);
      } else {
        alert('Error updating status: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating artwork status:', error);
      alert('Error updating status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ARTWORK_STATUS.APPROVED:
        return 'bg-green-100 text-green-800';
      case ARTWORK_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      case ARTWORK_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ARTWORK_STATUS.DRAFT:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ArtworkDetailsModal = ({ artwork, onClose, onStatusUpdate }) => {
    const [reviewReason, setReviewReason] = useState('');

    if (!artwork) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{artwork.title}</h2>
                <p className="text-gray-600">ID: {artwork.id}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Current Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(artwork.status)}`}>
                    {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Art Form</h3>
                  <p className="text-gray-600">{artwork.artForm}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{artwork.description}</p>
                </div>

                {artwork.materials && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Materials</h3>
                    <p className="text-gray-600">{artwork.materials}</p>
                  </div>
                )}

                {artwork.dimensions && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Dimensions</h3>
                    <p className="text-gray-600">{artwork.dimensions}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Year Created</h3>
                    <p className="text-gray-600">{artwork.yearCreated}</p>
                  </div>
                  
                  {artwork.price && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Price</h3>
                      <p className="text-gray-600">{artwork.currency} {artwork.price}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Views:</span> {artwork.views || 0}
                  </div>
                  <div>
                    <span className="font-medium">Likes:</span> {artwork.likes || 0}
                  </div>
                  <div>
                    <span className="font-medium">For Sale:</span> {artwork.isForSale ? 'Yes' : 'No'}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Dates</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Created: {formatDate(artwork.createdAt)}</div>
                    <div>Updated: {formatDate(artwork.updatedAt)}</div>
                  </div>
                </div>

                {artwork.tags && artwork.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {artwork.statusReason && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Status Reason</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{artwork.statusReason}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-4">Update Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    id="reason"
                    value={reviewReason}
                    onChange={(e) => setReviewReason(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Provide feedback or reason for status change..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => onStatusUpdate(artwork.id, ARTWORK_STATUS.APPROVED, reviewReason)}
                    disabled={statusUpdateLoading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {statusUpdateLoading ? 'Updating...' : 'Approve'}
                  </button>
                  
                  <button
                    onClick={() => onStatusUpdate(artwork.id, ARTWORK_STATUS.REJECTED, reviewReason)}
                    disabled={statusUpdateLoading}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {statusUpdateLoading ? 'Updating...' : 'Reject'}
                  </button>
                  
                  <button
                    onClick={() => onStatusUpdate(artwork.id, ARTWORK_STATUS.PENDING, reviewReason)}
                    disabled={statusUpdateLoading}
                    className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    {statusUpdateLoading ? 'Updating...' : 'Mark Pending'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Artwork Management</h1>
        <p className="text-gray-600">Review and manage submitted artworks</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Statuses</option>
                <option value={ARTWORK_STATUS.PENDING}>Pending Review</option>
                <option value={ARTWORK_STATUS.APPROVED}>Approved</option>
                <option value={ARTWORK_STATUS.REJECTED}>Rejected</option>
                <option value={ARTWORK_STATUS.DRAFT}>Draft</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No artworks found</h3>
          <p className="text-gray-600">No artworks match the selected filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artwork
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Art Form
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArtworks.map((artwork) => (
                  <tr key={artwork.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {artwork.imageUrl ? (
                            <img
                              src={artwork.imageUrl}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{artwork.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{artwork.description}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {artwork.artForm}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(artwork.status)}`}>
                        {artwork.status.charAt(0).toUpperCase() + artwork.status.slice(1)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(artwork.createdAt)}
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex space-x-4">
                        <span>👁 {artwork.views || 0}</span>
                        <span>❤️ {artwork.likes || 0}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedArtwork(artwork)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ArtworkDetailsModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default ArtworkAdmin;
