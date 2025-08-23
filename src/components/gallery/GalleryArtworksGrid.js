import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtworks } from '../../services/artworkService';
import LoadingSkeleton from '../LoadingSkeleton';
import LazyImage from '../LazyImage';
import { getArtFormColor } from '../../constants/artForms';

const GalleryArtworksGrid = ({ filters }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortOptions = [
    { id: 'newest', name: 'Newest First', field: 'createdAt', direction: 'desc' },
    { id: 'oldest', name: 'Oldest First', field: 'createdAt', direction: 'asc' },
    { id: 'price-high', name: 'Price: High to Low', field: 'price', direction: 'desc' },
    { id: 'price-low', name: 'Price: Low to High', field: 'price', direction: 'asc' }
  ];

  useEffect(() => {
    fetchArtworks();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArtworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const sortOption = sortOptions.find(option => option.id === filters?.sort) || sortOptions[0];
      const options = {
        limitCount: 100,
        orderField: sortOption.field,
        orderDirection: sortOption.direction
      };

      if (filters?.artform && filters.artform !== 'all') {
        options.artForm = filters.artform;
      }

      const result = await getAllArtworks(options);
      if (result.success) {
        let filteredArtworks = result.artworks;
        
        // Apply client-side search filtering
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredArtworks = filteredArtworks.filter(artwork => 
            artwork.title?.toLowerCase().includes(searchLower) ||
            artwork.description?.toLowerCase().includes(searchLower) ||
            artwork.materials?.toLowerCase().includes(searchLower) ||
            artwork.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        // Apply region filter (if needed for your use case)
        if (filters?.region && filters.region !== 'all') {
          filteredArtworks = filteredArtworks.filter(artwork => 
            artwork.region?.toLowerCase().replace(/\s+/g, '-') === filters.region
          );
        }
        
        setArtworks(filteredArtworks);
      } else {
        setError(result.error || 'Failed to load artworks');
        setArtworks([]);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchArtworks();
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <LoadingSkeleton count={8} />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">😔</div>
            <h3 className="text-2xl font-semibold text-amber-900 mb-4">
              Oops! Something went wrong
            </h3>
            <p className="text-amber-700 max-w-md mx-auto mb-6">
              {error}
            </p>
            <button
              onClick={retryFetch}
              className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-red-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              {artworks.length} {artworks.length === 1 ? 'Artwork' : 'Artworks'} Found
            </h2>
            {filters?.search && (
              <p className="text-amber-700">
                Showing results for "{filters.search}"
              </p>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
            <button className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors duration-200">
              Grid
            </button>
            <button className="px-3 py-2 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-50">
              List
            </button>
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">No artworks found</h3>
            <p className="text-amber-700 mb-6">Try adjusting your filters or search terms to find more artworks.</p>
            {filters?.artform && filters.artform !== 'all' && (
              <button 
                onClick={() => window.location.reload()}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <Link
                key={artwork.id}
                to={`/artwork/${artwork.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-amber-50 to-orange-50">
                  {artwork.imageUrl || artwork.thumbnailUrl ? (
                    <LazyImage
                      src={artwork.thumbnailUrl || artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl text-amber-400">
                      🎨
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getArtFormColor(artwork.artForm)}`}>
                      {artwork.artForm}
                    </span>
                  </div>
                  
                  {/* Overlay with quick info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        {artwork.price && (
                          <div className="text-lg font-bold">
                            ₹{artwork.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getArtFormColor(artwork.artForm)}`}>
                      {artwork.artForm}
                    </span>
                    {artwork.isForSale && artwork.price && (
                      <span className="text-lg font-bold text-amber-900">
                        ₹{artwork.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-amber-900 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">
                    {artwork.title}
                  </h3>

                  <p className="text-amber-700 text-sm mb-2">
                    {artwork.yearCreated && `Created in ${artwork.yearCreated}`}
                  </p>

                  {artwork.dimensions && (
                    <p className="text-xs text-amber-600">
                      {artwork.dimensions}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {artworks.length > 0 && artworks.length >= 8 && (
          <div className="text-center mt-12">
            <button className="bg-white text-amber-800 border-2 border-amber-300 px-8 py-4 rounded-xl font-semibold hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 shadow-md">
              Load More Artworks
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryArtworksGrid;
