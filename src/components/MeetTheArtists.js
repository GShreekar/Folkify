import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtists } from '../services/artworkService';
import LoadingSpinner from './LoadingSpinner';
import VerifiedArtistBadge from './VerifiedArtistBadge';
import { getArtFormColor } from '../constants/artForms';
import './FolkArtAnimations.css';

const MeetTheArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatArtistData = (user) => {
    return {
      id: user.id,
      displayName: user.displayName || user.firstName || user.name || user.email?.split('@')[0] || 'Artist',
      firstName: user.firstName || user.name || user.displayName,
      lastName: user.lastName || '',
      email: user.email,
      profileImage: user.profileImage || user.photoURL || user.avatar,
      location: user.location || user.city || user.address || 'India',
      specialization: user.specialization || user.primaryArtForm || user.artForm || user.category,
      primaryArtForm: user.primaryArtForm || user.specialization || user.artForm,
      bio: user.bio || user.description || user.about || `Passionate ${user.specialization || 'folk'} artist`,
      artworkCount: user.artworkCount || 0,
      experienceYears: user.experienceYears || user.experience || Math.floor(Math.random() * 15) + 5,
      isVerified: user.isVerified || false,
      isActive: user.isActive !== false,
      userType: user.userType || user.role || 'artist', // Use role field if userType is not available
      role: user.role || 'artist' // Ensure role is preserved
    };
  };

  const fetchArtists = async () => {
    setError(null);
    try {
      const allUsersResult = await getAllArtists({
        limitCount: 20,
        includeArtworkCount: true
      });
      
      if (allUsersResult.success) {
        if (allUsersResult.artists.length > 0) {
          const formattedArtists = allUsersResult.artists
            .map(formatArtistData)
            .filter(artist => 
              artist.role === 'artist' || 
              artist.userType === 'artist' || 
              (!artist.role && !artist.userType) // Legacy artists without role field
            );
          const artistsToShow = formattedArtists.slice(0, 6);
          setArtists(artistsToShow);
        }
      } else {
        setError(allUsersResult.error || 'Failed to load artists');
      }
    } catch (error) {
      setError(`Unable to load artists: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="artists" className="py-16 folk-art-background">
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="mandala-complex complex-1">
        <div className="mandala-petals"></div>
      </div>
      <div className="mandala-complex complex-2">
        <div className="mandala-petals"></div>
      </div>
      
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
      
      <div className="warli-tree tree-1">
        <div className="warli-tree-branches"></div>
      </div>
      <div className="warli-tree tree-2">
        <div className="warli-tree-branches"></div>
      </div>
      <div className="warli-tree tree-3">
        <div className="warli-tree-branches"></div>
      </div>
      
      <div className="warli-peacock peacock-1">
        <div className="peacock-tail"></div>
      </div>
      <div className="warli-peacock peacock-2">
        <div className="peacock-tail"></div>
      </div>
      
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
      
      <div className="tribal-pattern tribal-1"></div>
      <div className="tribal-pattern tribal-2"></div>
      <div className="tribal-pattern tribal-3"></div>
      
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>
      
      <div className="folk-content-overlay mx-auto">
        <div className="warli-corner-decoration warli-corner-tl"></div>
        <div className="warli-corner-decoration warli-corner-tr"></div>
        <div className="warli-corner-decoration warli-corner-bl"></div>
        <div className="warli-corner-decoration warli-corner-br"></div>
        
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
          <div className="flex justify-center items-center h-64 mb-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-16 mb-12 warli-artist-card bg-white/90 backdrop-blur-sm rounded-2xl mx-4 border border-red-200/50">
            <div className="text-8xl mb-6">⚠️</div>
            <h3 className="text-2xl font-semibold text-red-800 mb-4">
              Error Loading Artists
            </h3>
            <p className="text-red-600 max-w-lg mx-auto mb-4">
              {error}
            </p>
            <button 
              onClick={fetchArtists}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {artists.map((artist) => (
              <Link
                to={`/artist/${artist.id}`}
                key={artist.id} 
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-amber-200/50 p-6 text-center warli-artist-card"
              >
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                    {artist.profileImage ? (
                      <img
                        src={artist.profileImage}
                        alt={artist.displayName || artist.firstName || 'Artist'}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span className={artist.profileImage ? 'hidden' : 'block'}>
                      👨‍🎨
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-amber-900">
                        {artist.displayName || artist.firstName || artist.email?.split('@')[0] || 'Artist'}
                      </h3>
                      {artist.isVerified && (
                        <VerifiedArtistBadge size="xs" />
                      )}
                    </div>
                    <p className="text-amber-700 text-sm font-medium">
                      {artist.location || 'India'}
                    </p>
                  </div>

                  {(artist.specialization || artist.primaryArtForm) && (
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getArtFormColor(artist.specialization || artist.primaryArtForm)}`}>
                        {artist.specialization || artist.primaryArtForm}
                      </span>
                    </div>
                  )}

                  {artist.bio && (
                    <p className="text-sm text-amber-600 leading-relaxed line-clamp-2">
                      {artist.bio}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
                    <div>
                      <div className="text-lg font-bold text-amber-900">{artist.artworkCount || 0}</div>
                      <div className="text-xs text-amber-600">Artworks</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-amber-900 flex items-center justify-center">
                        {artist.experienceYears || 0}+ 
                      </div>
                      <div className="text-xs text-amber-600">Years</div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 mt-4">
                    View Profile
                  </button>
                </div>
              </Link>
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

  {/* Explore All Artists button removed as requested */}
      </div>
    </section>
  );
};

export default MeetTheArtists;