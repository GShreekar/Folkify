import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VerifiedArtistBadge from '../VerifiedArtistBadge';
import { mockArtworks, mockArtists } from '../../data/mockData';

const GalleryArtworksGrid = ({ filters }) => {
  // Use mock data for artworks and artists
  const [artworks, setArtworks] = useState(mockArtworks);
  const [artists, setArtists] = useState(mockArtists);

  // Helper function to get artist data by name
  const getArtistByName = (artistName) => {
    return artists.find(artist => artist.name === artistName);
  };


  const getFilteredArtworks = () => {
    let filtered = artworks;

    // Filter by art form
    if (filters?.artform && filters.artform !== 'all') {
      filtered = filtered.filter(artwork => 
        artwork.artform.toLowerCase() === filters.artform.toLowerCase()
      );
    }

    // Filter by region
    if (filters?.region && filters.region !== 'all') {
      filtered = filtered.filter(artwork => 
        artwork.region.toLowerCase().replace(/\s+/g, '-') === filters.region
      );
    }

    // Filter by search term
    if (filters?.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(searchTerm) ||
        artwork.artist.toLowerCase().includes(searchTerm) ||
        artwork.artform.toLowerCase().includes(searchTerm) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Sort artworks
    if (filters?.sort) {
      switch (filters.sort) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          break;
        case 'popular':
          filtered.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'price-low-high':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          filtered.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  const filteredArtworks = getFilteredArtworks();

  const getArtformColor = (artform) => {
    const colors = {
      'Warli': 'bg-amber-100 text-amber-800',
      'Madhubani': 'bg-red-100 text-red-800',
      'Pithora': 'bg-orange-100 text-orange-800',
      'Gond': 'bg-green-100 text-green-800',
      'Kalamkari': 'bg-purple-100 text-purple-800',
      'Tanjore': 'bg-yellow-100 text-yellow-800',
      'Patachitra': 'bg-blue-100 text-blue-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[artform] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'Artwork' : 'Artworks'} Found
            </h2>
            {filters?.search && (
              <p className="text-amber-700">
                Showing results for "{filters.search}"
              </p>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
            <button className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
              Grid
            </button>
            <button className="px-3 py-2 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-50">
              List
            </button>
          </div>
        </div>

        {filteredArtworks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">No artworks found</h3>
            <p className="text-amber-700 mb-6">Try adjusting your filters or search terms to find more artworks.</p>
            <button className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getArtformColor(artwork.artform)}`}>
                      {artwork.artform}
                    </span>
                  </div>
                  
                  {artwork.popularity > 100 && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        🔥 Popular
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {artwork.title}
                  </h3>
                  
                  <div className="flex items-center text-sm text-amber-700 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>by {artwork.artist}</span>
                    {getArtistByName(artwork.artist)?.isVerified && (
                      <VerifiedArtistBadge size="xs" className="ml-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-amber-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{artwork.region}</span>
                  </div>

                  <p className="text-amber-800 text-sm mb-4 line-clamp-2">
                    {artwork.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-amber-900">
                      ₹{artwork.price.toLocaleString()}
                    </div>
                    <Link
                      to={`/gallery/artwork/${artwork.id}`}
                      className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredArtworks.length > 0 && filteredArtworks.length >= 8 && (
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
