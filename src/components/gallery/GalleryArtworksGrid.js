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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const sortOptions = [
    { id: 'newest', name: 'Newest First', field: 'createdAt', direction: 'desc' },
    { id: 'oldest', name: 'Oldest First', field: 'createdAt', direction: 'asc' },
    { id: 'price-high', name: 'Price: High to Low', field: 'price', direction: 'desc' },
    { id: 'price-low', name: 'Price: Low to High', field: 'price', direction: 'asc' }
  ];

  useEffect(() => {
    fetchArtworks();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArtworks = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLastDoc(null);
      setHasMore(false);
    }
    setError(null);
    
    try {
      const sortOption = sortOptions.find(option => option.id === filters?.sort) || sortOptions[0];
      const options = {
        limitCount: 12, // Load 12 items at a time
        orderField: sortOption.field,
        orderDirection: sortOption.direction
      };

      if (filters?.artform && filters.artform !== 'all') {
        options.artForm = filters.artform;
      }

      if (loadMore && lastDoc) {
        options.lastDoc = lastDoc;
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
        
        if (loadMore) {
          setArtworks(prev => [...prev, ...filteredArtworks]);
        } else {
          setArtworks(filteredArtworks);
        }
        
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore && filteredArtworks.length > 0);
      } else {
        setError(result.error || 'Failed to load artworks');
        if (!loadMore) {
          setArtworks([]);
        }
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      if (!loadMore) {
        setArtworks([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreArtworks = () => {
    if (hasMore && !loadingMore) {
      fetchArtworks(true);
    }
  };

  // Render artwork in grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {artworks.map((artwork) => (
        <Link
          key={artwork.id}
          to={`/artwork/${artwork.id}`}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-amber-50 to-orange-50">
            {artwork.imageUrl || artwork.thumbnailUrl ? (
              <LazyImage
                src={artwork.thumbnailUrl || artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl sm:text-6xl text-amber-400">
                🎨
              </div>
            )}
            
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getArtFormColor(artwork.artForm)}`}>
                {artwork.artForm}
              </span>
            </div>
            
            {/* Overlay with quick info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                <div className="flex items-center justify-between text-white">
                  {artwork.price && (
                    <div className="text-sm sm:text-lg font-bold">
                      ₹{artwork.price.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getArtFormColor(artwork.artForm)}`}>
                {artwork.artForm}
              </span>
              {artwork.isForSale && artwork.price && (
                <span className="text-sm sm:text-lg font-bold text-amber-900">
                  ₹{artwork.price.toLocaleString()}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-lg font-bold text-amber-900 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">
              {artwork.title}
            </h3>

            <p className="text-amber-700 text-xs sm:text-sm mb-2">
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
  );

  // Render artwork in list view
  const renderListView = () => (
    <div className="space-y-4 sm:space-y-6">
      {artworks.map((artwork) => (
        <Link
          key={artwork.id}
          to={`/artwork/${artwork.id}`}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row"
        >
          <div className="relative overflow-hidden sm:w-72 sm:h-48 w-full h-48 bg-gradient-to-br from-amber-50 to-orange-50 sm:flex-shrink-0">
            {artwork.imageUrl || artwork.thumbnailUrl ? (
              <LazyImage
                src={artwork.thumbnailUrl || artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl sm:text-6xl text-amber-400">
                🎨
              </div>
            )}
            
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getArtFormColor(artwork.artForm)}`}>
                {artwork.artForm}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getArtFormColor(artwork.artForm)}`}>
                      {artwork.artForm}
                    </span>
                    {artwork.yearCreated && (
                      <span className="text-amber-700 text-sm">
                        Created in {artwork.yearCreated}
                      </span>
                    )}
                  </div>
                </div>
                {artwork.isForSale && artwork.price && (
                  <div className="text-right ml-4">
                    <span className="text-xl sm:text-2xl font-bold text-amber-900">
                      ₹{artwork.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              {artwork.description && (
                <p className="text-amber-700 text-sm sm:text-base mb-3 line-clamp-2">
                  {artwork.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 text-xs text-amber-600">
                {artwork.dimensions && (
                  <span className="bg-amber-50 px-2 py-1 rounded">
                    📏 {artwork.dimensions}
                  </span>
                )}
                {artwork.materials && (
                  <span className="bg-amber-50 px-2 py-1 rounded">
                    🎨 {artwork.materials}
                  </span>
                )}
                {artwork.tags && artwork.tags.length > 0 && (
                  <span className="bg-amber-50 px-2 py-1 rounded">
                    🏷️ {artwork.tags.slice(0, 2).join(', ')}{artwork.tags.length > 2 ? '...' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-amber-100">
              <div className="flex items-center justify-between text-sm text-amber-600">
                <span>Click to view details</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

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
    <section className="py-8 sm:py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-900 mb-2">
              {artworks.length} {artworks.length === 1 ? 'Artwork' : 'Artworks'} Found
            </h2>
            {filters?.search && (
              <p className="text-amber-700 text-sm sm:text-base">
                Showing results for "{filters.search}"
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-2 xs:px-3 py-2 rounded-lg text-xs xs:text-sm font-medium transition-colors duration-200 flex items-center ${
                viewMode === 'grid' 
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="hidden xs:inline">Grid</span>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-2 xs:px-3 py-2 rounded-lg text-xs xs:text-sm font-medium transition-colors duration-200 flex items-center ${
                viewMode === 'list' 
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              <svg className="w-3 h-3 xs:w-4 xs:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden xs:inline">List</span>
            </button>
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-amber-900 mb-2">No artworks found</h3>
            <p className="text-amber-700 mb-6 text-sm sm:text-base max-w-md mx-auto">Try adjusting your filters or search terms to find more artworks.</p>
            {filters?.artform && filters.artform !== 'all' && (
              <button 
                onClick={() => window.location.reload()}
                className="bg-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-amber-700 transition-colors text-sm sm:text-base"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          viewMode === 'grid' ? renderGridView() : renderListView()
        )}

        {hasMore && (
          <div className="text-center mt-8 sm:mt-12">
            <button 
              onClick={loadMoreArtworks}
              disabled={loadingMore}
              className="bg-white text-amber-800 border-2 border-amber-300 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-amber-50 hover:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md text-sm sm:text-base"
            >
              {loadingMore ? (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Loading More...
                </>
              ) : (
                <>
                  Load More Artworks
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryArtworksGrid;
