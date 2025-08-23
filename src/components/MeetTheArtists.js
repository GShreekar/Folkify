import React, { useState, useEffect } from 'react';
import VerifiedArtistBadge from './VerifiedArtistBadge';
import './FolkArtAnimations.css';

const MeetTheArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Implement Firebase data fetching
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        
        setArtists([]);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  const getSpecialtyColor = (specialty) => {
    if (specialty.includes('Warli')) return 'text-amber-700 bg-amber-100';
    if (specialty.includes('Madhubani')) return 'text-red-700 bg-red-100';
    if (specialty.includes('Pithora')) return 'text-orange-700 bg-orange-100';
    return 'text-gray-700 bg-gray-100';
  };

  return (
    <section id="artists" className="py-16 folk-art-background">
      {/* Enhanced Mandala Patterns */}
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="mandala-complex complex-1">
        <div className="mandala-petals"></div>
      </div>
      <div className="mandala-complex complex-2">
        <div className="mandala-petals"></div>
      </div>
      
      {/* Warli Art Elements */}
      <div className="warli-figure warli-1">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-2">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-3">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      
      {/* Warli Trees */}
      <div className="warli-tree tree-1">
        <div className="warli-tree-branches"></div>
      </div>
      <div className="warli-tree tree-2">
        <div className="warli-tree-branches"></div>
      </div>
      <div className="warli-tree tree-3">
        <div className="warli-tree-branches"></div>
      </div>
      
      {/* Warli Peacocks */}
      <div className="warli-peacock peacock-1">
        <div className="peacock-tail"></div>
      </div>
      <div className="warli-peacock peacock-2">
        <div className="peacock-tail"></div>
      </div>
      
      {/* Warli Celebration Circles */}
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
        <div className="celebration-figure fig-5">
          <div className="celebration-arms"></div>
          <div className="celebration-legs"></div>
        </div>
        <div className="celebration-figure fig-6">
          <div className="celebration-arms"></div>
          <div className="celebration-legs"></div>
        </div>
      </div>
      
      {/* Tribal Patterns */}
      <div className="tribal-pattern tribal-1"></div>
      <div className="tribal-pattern tribal-2"></div>
      <div className="tribal-pattern tribal-3"></div>
      
      {/* Geometric Patterns */}
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>
      
      {/* Content with overlay */}
      <div className="folk-content-overlay max-w-7xl mx-auto">
        {/* Warli corner decorations */}
        <div className="warli-corner-decoration warli-corner-tl"></div>
        <div className="warli-corner-decoration warli-corner-tr"></div>
        <div className="warli-corner-decoration warli-corner-bl"></div>
        <div className="warli-corner-decoration warli-corner-br"></div>
        
        {/* Side patterns */}
        <div className="warli-side-pattern"></div>
        <div className="warli-side-pattern warli-side-pattern-right"></div>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Meet the Artists
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Discover the talented artists behind these beautiful creations. Each artist brings 
            decades of experience and authentic traditional knowledge.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center py-16 mb-12">
            <div className="w-12 h-12 bg-amber-200 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-amber-900 mb-2">Loading Artists...</h3>
            <p className="text-amber-700">Discovering talented folk artists from across India</p>
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {artists.map((artist) => (
              <div 
                key={artist.id} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-amber-200/50 p-6 text-center warli-artist-card"
              >
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                    {artist.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-amber-900">
                        {artist.name}
                      </h3>
                      {artist.isVerified && (
                        <VerifiedArtistBadge size="xs" />
                      )}
                    </div>
                    <p className="text-amber-700 text-sm font-medium">
                      {artist.location}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSpecialtyColor(artist.specialty)}`}>
                      {artist.specialty}
                    </span>
                  </div>

                  <p className="text-sm text-amber-600 leading-relaxed">
                    {artist.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
                    <div>
                      <div className="text-lg font-bold text-amber-900">{artist.artworkCount}</div>
                      <div className="text-xs text-amber-600">Artworks</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amber-900 flex items-center justify-center">
                        {artist.rating} ⭐
                      </div>
                      <div className="text-xs text-amber-600">Rating</div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 mt-4">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-12 warli-artist-card bg-white/90 backdrop-blur-sm rounded-2xl mx-4 border border-amber-200/50">
            <div className="text-8xl mb-6">🎨</div>
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">
              Amazing Artists Joining Soon
            </h3>
            <p className="text-amber-600 max-w-lg mx-auto">
              We're onboarding talented folk artists from across India who specialize in diverse traditional art forms. 
              From Warli and Madhubani to Gond, Kalamkari, and many more beautiful regional styles.
            </p>
          </div>
        )}

        <div className="text-center">
          <button className="bg-white border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            Explore All Artists
          </button>
        </div>
      </div>
    </section>
  );
};

export default MeetTheArtists;
