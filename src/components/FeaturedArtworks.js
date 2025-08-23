import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtworks } from '../services/artworkService';
import { getArtFormColor } from '../constants/artForms';
import LoadingSpinner from './LoadingSpinner';
import './FolkArtAnimations.css';

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedArtworks();
  }, []);

  const fetchFeaturedArtworks = async () => {
    setError(null);
    try {
      const result = await getAllArtworks({
        limitCount: 6,
        orderField: 'createdAt',
        orderDirection: 'desc'
      });
      
      if (result.success) {
        setArtworks(result.artworks);
      } else {
        setError(result.error || 'Failed to load artworks');
      }
    } catch (error) {
      setError('Unable to load artworks at this time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="explore" className="py-16 folk-art-background relative overflow-hidden">
      {/* Enhanced Folk Art Elements */}
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="mandala-complex complex-1">
        <div className="mandala-petals"></div>
      </div>
      
      {/* Warli Elements */}
      <div className="warli-figure warli-1">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-2">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      
      {/* Warli Trees */}
      <div className="warli-tree tree-1">
        <div className="warli-tree-branches"></div>
      </div>
      <div className="warli-tree tree-3">
        <div className="warli-tree-branches"></div>
      </div>
      
      {/* Warli Peacocks */}
      <div className="warli-peacock peacock-2">
        <div className="peacock-tail"></div>
      </div>
      
      {/* Celebration Circle */}
      <div className="warli-celebration celebration-1">
        <div className="celebration-figure fig-1">
          <div className="celebration-arms"></div>
          <div className="celebration-legs"></div>
        </div>
        <div className="celebration-figure fig-2">
          <div className="celebration-arms"></div>
          <div className="celebration-legs"></div>
        </div>
        <div className="celebration-figure fig-3">
          <div className="celebration-arms"></div>
          <div className="celebration-legs"></div>
        </div>
        <div className="celebration-figure fig-4">
          <div className="celebration-arms"></div>
          <div className="celebration-legs"></div>
        </div>
      </div>
      
      {/* Tribal Patterns */}
      <div className="tribal-pattern tribal-1"></div>
      <div className="tribal-pattern tribal-3"></div>
      
      {/* Geometric Patterns */}
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>
      
      {/* Enhanced mandala-style folk art patterns */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mandala-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Central mandala */}
              <g transform="translate(100, 100)">
                <circle cx="0" cy="0" r="80" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
                <circle cx="0" cy="0" r="60" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
                <circle cx="0" cy="0" r="40" stroke="white" strokeWidth="1" fill="none" opacity="0.4"/>
                <circle cx="0" cy="0" r="20" stroke="white" strokeWidth="1" fill="none" opacity="0.3"/>
                <circle cx="0" cy="0" r="8" fill="white" opacity="0.4"/>
                
                {/* Radiating dancers */}
                {Array.from({length: 16}).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 22.5} 0 0)`}>
                    <g transform="translate(0, -50)">
                      <circle cx="0" cy="0" r="2" fill="white" opacity="0.6"/>
                      <line x1="0" y1="2" x2="0" y2="12" stroke="white" strokeWidth="1" opacity="0.5"/>
                      <line x1="0" y1="6" x2="-5" y2="14" stroke="white" strokeWidth="1" opacity="0.5"/>
                      <line x1="0" y1="6" x2="5" y2="14" stroke="white" strokeWidth="1" opacity="0.5"/>
                      <line x1="0" y1="12" x2="-4" y2="20" stroke="white" strokeWidth="1" opacity="0.5"/>
                      <line x1="0" y1="12" x2="4" y2="20" stroke="white" strokeWidth="1" opacity="0.5"/>
                    </g>
                    
                    {/* Decorative petals */}
                    <path d="M0,-70 Q-8,-62 0,-54 Q8,-62 0,-70" fill="white" opacity="0.3"/>
                    <circle cx="0" cy="-65" r="3" fill="white" opacity="0.4"/>
                  </g>
                ))}
                
                {/* Corner decorative elements */}
                <g transform="translate(-60, -60)">
                  <polygon points="0,0 8,8 0,16 -8,8" fill="white" opacity="0.3"/>
                </g>
                <g transform="translate(60, -60)">
                  <polygon points="0,0 8,8 0,16 -8,8" fill="white" opacity="0.3"/>
                </g>
                <g transform="translate(-60, 60)">
                  <polygon points="0,0 8,8 0,16 -8,8" fill="white" opacity="0.3"/>
                </g>
                <g transform="translate(60, 60)">
                  <polygon points="0,0 8,8 0,16 -8,8" fill="white" opacity="0.3"/>
                </g>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mandala-pattern)" />
        </svg>
      </div>

      {/* Floating mandala elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-spin-slow">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" className="text-white">
          <circle cx="75" cy="75" r="60" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="75" cy="75" r="40" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="75" cy="75" r="10" fill="currentColor"/>
          {Array.from({length: 12}).map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 75 75)`}>
              <line x1="75" y1="15" x2="75" y2="35" stroke="currentColor" strokeWidth="2"/>
              <circle cx="75" cy="25" r="4" fill="currentColor"/>
              <path d="M75,10 Q70,5 75,0 Q80,5 75,10" fill="currentColor"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute top-32 right-20 opacity-25 animate-float">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-white">
          {/* Intricate mandala with dancing figures */}
          <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="3" fill="none"/>
          <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="60" cy="60" r="8" fill="currentColor"/>
          
          {Array.from({length: 8}).map((_, i) => (
            <g key={i} transform={`rotate(${i * 45} 60 60)`}>
              {/* Dancing figures in circle */}
              <g transform="translate(60, 25)">
                <circle cx="0" cy="0" r="3" fill="currentColor"/>
                <line x1="0" y1="3" x2="0" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="0" y1="8" x2="-6" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="0" y1="8" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="0" y1="15" x2="-5" y2="25" stroke="currentColor" strokeWidth="1.5"/>
                <line x1="0" y1="15" x2="5" y2="25" stroke="currentColor" strokeWidth="1.5"/>
              </g>
              
              {/* Decorative elements */}
              <path d="M60,10 Q55,5 60,0 Q65,5 60,10" fill="currentColor"/>
              <line x1="60" y1="110" x2="60" y2="100" stroke="currentColor" strokeWidth="2"/>
              <circle cx="60" cy="105" r="2" fill="currentColor"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute bottom-20 left-1/4 opacity-20 animate-pulse">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-white">
          {/* Lotus mandala */}
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="50" cy="50" r="6" fill="currentColor"/>
          
          {Array.from({length: 12}).map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 50 50)`}>
              <path d="M50,10 Q40,20 50,30 Q60,20 50,10" fill="currentColor" opacity="0.7"/>
              <line x1="50" y1="30" x2="50" y2="40" stroke="currentColor" strokeWidth="1"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute top-1/2 right-10 opacity-20 animate-spin-slow">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-yellow-200">
          {/* Sun mandala */}
          <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="40" cy="40" r="20" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="40" cy="40" r="8" fill="currentColor"/>
          
          {Array.from({length: 16}).map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5} 40 40)`}>
              <line x1="40" y1="5" x2="40" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="40" y1="65" x2="40" y2="75" stroke="currentColor" strokeWidth="1"/>
              <circle cx="40" cy="10" r="2" fill="currentColor"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="absolute bottom-10 right-1/3 opacity-25 animate-bounce-slow">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="text-white">
          {/* Sacred geometry mandala */}
          <polygon points="45,5 65,25 65,65 45,85 25,65 25,25" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="45" cy="45" r="25" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="45" cy="45" r="15" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="45" cy="45" r="6" fill="currentColor"/>
          
          {Array.from({length: 6}).map((_, i) => (
            <g key={i} transform={`rotate(${i * 60} 45 45)`}>
              <line x1="45" y1="20" x2="45" y2="30" stroke="currentColor" strokeWidth="2"/>
              <circle cx="45" cy="25" r="3" fill="currentColor"/>
              <polygon points="45,15 50,20 45,25 40,20" fill="currentColor"/>
            </g>
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 relative">
            Featured Artworks
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 opacity-30">
              <svg viewBox="0 0 60 60" fill="none" className="text-yellow-200 animate-twinkle">
                <polygon points="30,5 35,20 50,20 38,30 42,45 30,37 18,45 22,30 10,20 25,20" fill="currentColor"/>
              </svg>
            </span>
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Handpicked masterpieces from our talented artists, each telling a unique story 
            of India's rich folk art traditions.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-300 to-white mx-auto mt-6 rounded-full relative">
            <div className="absolute -left-2 -top-1 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute -right-2 -top-1 w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 mb-12">
            <LoadingSpinner />
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {artworks.map((artwork) => (
              <Link 
                to={`/artwork/${artwork.id}`}
                key={artwork.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-amber-100"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
                  {artwork.imageUrl || artwork.thumbnailUrl ? (
                    <img
                      src={artwork.thumbnailUrl || artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHBhdGggZD0iTTEwMCAxNDUuNDUyQzY2Ljk3NCAxNDUuNDUyIDMwLjExNyAxMTcuNjU4IDMwLjExNyA4NC4wNzE3QzMwLjExNyA1MC40ODM3IDY2Ljk3NCAyMi42OSAxMDAgMjIuNjlDMTMzLjAyNiAyMi42OSAxNzAuMDEzIDUwLjQ4MzcgMTcwLjAxMyA4NC4wNzE2QzE3MC4wMTMgMTE3LjY1OCAxMzMuMDI2IDE0NS40NTIgMTAwIDE0NS40NTJ6IiBmaWxsPSIjRkZCNjI2IiBzdHJva2U9IiNGRkI2MjYiIHN0cm9rZS13aWR0aD0iMTUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSI+8J+OqDwvdGV4dD48L2c+PC9zdmc+";
                      }}
                    />
                  ) : (
                    <div className="text-8xl text-amber-400">🎨</div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getArtFormColor(artwork.artForm)}`}>
                      {artwork.artForm}
                    </span>
                    {artwork.isForSale && artwork.price && (
                      <span className="text-2xl font-bold text-amber-900">
                        ₹{artwork.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-amber-900 mb-1">
                    {artwork.title}
                  </h3>

                  <p className="text-amber-700 font-medium mb-3">
                    {artwork.yearCreated && `Created in ${artwork.yearCreated}`}
                  </p>

                  {artwork.description && (
                    <p className="text-sm text-amber-600 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                      {artwork.description}
                    </p>
                  )}

                  <button className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200">
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-12">
            <div className="text-8xl mb-6">🎨</div>
            <h3 className="text-2xl font-semibold text-white mb-4">
              Beautiful Artworks Coming Soon
            </h3>
            <p className="text-orange-100 max-w-md mx-auto">
              We're working with amazing folk artists to bring you authentic, handcrafted artworks. 
              Stay tuned for our collection!
            </p>
          </div>
        )}

        <div className="text-center">
          <Link 
            to="/gallery"
            className="bg-white border-2 border-white text-red-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-300 hover:text-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
          >
            View All Artworks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;