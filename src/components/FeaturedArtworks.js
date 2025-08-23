import React, { useState, useEffect } from 'react';
import { getAllArtworks } from '../services/artworkService';
import ArtworkModal from './artwork/ArtworkModal';

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  useEffect(() => {
    const loadFeaturedArtworks = async () => {
      try {
        const result = await getAllArtworks({ 
          limitCount: 6, 
          orderField: 'views',
          orderDirection: 'desc' 
        });
        if (result.success) {
          setArtworks(result.artworks);
        }
      } catch (error) {
        console.error('Error loading featured artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedArtworks();
  }, []);

  const getStyleColor = (artForm) => {
    switch (artForm) {
      case 'Painting': return 'text-amber-700 bg-amber-100';
      case 'Pottery': return 'text-red-700 bg-red-100';
      case 'Textiles': return 'text-orange-700 bg-orange-100';
      case 'Woodwork': return 'text-green-700 bg-green-100';
      case 'Metalwork': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Price on request';
    return `₹${price.toLocaleString()}`;
  };

  return (
    <section id="explore" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Featured Artworks
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Handpicked masterpieces from our talented artists, each telling a unique story 
            of India's rich folk art traditions.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-amber-600 text-lg">Loading featured artworks...</div>
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {artworks.map((artwork) => (
              <div 
                key={artwork.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-amber-100"
              >
                <div className="aspect-square overflow-hidden">
                  {artwork.imageUrl ? (
                    <img
                      src={artwork.thumbnailUrl || artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStyleColor(artwork.artForm)}`}>
                      {artwork.artForm}
                    </span>
                    <span className="text-lg font-bold text-green-600">{formatPrice(artwork.price, artwork.currency)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-amber-900 mb-1">
                    {artwork.title}
                  </h3>
                  
                  <p className="text-amber-700 font-medium mb-3 text-sm">
                    Artist ID: {artwork.artistId.substring(0, 8)}...
                  </p>

                  <p className="text-sm text-amber-600 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {artwork.description}
                  </p>

                  <button 
                    onClick={() => setSelectedArtwork(artwork)}
                    className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-amber-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-amber-800 mb-2">No featured artworks yet</h3>
            <p className="text-amber-600">Check back soon for amazing folk art!</p>
          </div>
        )}

        <div className="text-center">
          <button className="bg-white border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            View All Artworks
          </button>
        </div>
      </div>
      
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </section>
  );
};

export default FeaturedArtworks;
