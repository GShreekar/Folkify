import React, { useState, useEffect } from 'react';
import { getAllArtworks, ART_FORMS, incrementArtworkViews } from '../../services/artworkService';
import LoadingSpinner from '../LoadingSpinner';

const ArtworkGallery = ({ 
  showFilters = true,
  limitCount = 50,
  artistId = null 
}) => {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtForm, setSelectedArtForm] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadArtworks();
  }, []);

  useEffect(() => {
    filterAndSortArtworks();
  }, [artworks, selectedArtForm, sortBy]);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const options = {
        limitCount: limitCount
      };
      
      const result = await getAllArtworks(options);
      if (result.success) {
        let artworksList = result.artworks;
        
        if (artistId) {
          artworksList = artworksList.filter(artwork => artwork.artistId === artistId);
        }
        
        setArtworks(artworksList);
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortArtworks = () => {
    let filtered = [...artworks];

    if (selectedArtForm) {
      filtered = filtered.filter(artwork => artwork.artForm === selectedArtForm);
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      default:
        break;
    }

    setFilteredArtworks(filtered);
  };

  const handleArtworkClick = async (artwork) => {
    setSelectedArtwork(artwork);
    
    try {
      await incrementArtworkViews(artwork.id);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
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

  const ArtworkModal = ({ artwork, onClose }) => {
    if (!artwork) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-amber-800 mb-2">{artwork.title}</h2>
                <p className="text-amber-600">by Artist • {artwork.artForm}</p>
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

                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Year Created</h3>
                  <p className="text-gray-700">{artwork.yearCreated}</p>
                </div>

                {artwork.isForSale && artwork.price && (
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Price</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatPrice(artwork.price, artwork.currency)}
                    </p>
                  </div>
                )}

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

                <div className="flex items-center space-x-4 text-sm text-amber-600">
                  <span>👁 {artwork.views || 0} views</span>
                  <span>❤️ {artwork.likes || 0} likes</span>
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
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="artForm" className="block text-sm font-medium text-amber-800 mb-1">
                Art Form
              </label>
              <select
                id="artForm"
                value={selectedArtForm}
                onChange={(e) => setSelectedArtForm(e.target.value)}
                className="px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="">All Art Forms</option>
                {ART_FORMS.map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-amber-800 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>

            <div className="ml-auto">
              <span className="text-sm text-amber-600">
                {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      )}

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-amber-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">No artworks found</h3>
          <p className="text-amber-600">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-amber-200/50"
              onClick={() => handleArtworkClick(artwork)}
            >
              <div className="aspect-square overflow-hidden rounded-t-xl">
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
                <h3 className="font-semibold text-amber-800 mb-2 line-clamp-2">
                  {artwork.title}
                </h3>
                
                <p className="text-amber-600 text-sm mb-2">{artwork.artForm}</p>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {artwork.description}
                </p>

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

      <ArtworkModal 
        artwork={selectedArtwork} 
        onClose={() => setSelectedArtwork(null)} 
      />
    </div>
  );
};

export default ArtworkGallery;
