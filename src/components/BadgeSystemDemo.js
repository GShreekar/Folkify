import React, { useState, useEffect } from 'react';
import VerifiedArtistBadge from './VerifiedArtistBadge';
import mockDB from '../services/mockDatabaseService';
import { shouldBeVerified } from '../utils/artistUtils';

const BadgeSystemDemo = () => {
  const [artists, setArtists] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const artistsData = await mockDB.getAllArtists();
        const statsData = await mockDB.getVerificationStats();
        setArtists(artistsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const simulateArtworkUpload = async (artistId) => {
    try {
      const mockArtwork = {
        title: `New Artwork ${Date.now()}`,
        description: 'Test artwork for verification demo',
        artform: 'Test Art',
        artistId: artistId,
        artist: artists.find(a => a.id === artistId)?.name || 'Unknown',
        region: 'Test Region',
        price: 5000
      };

      const result = await mockDB.addArtwork(mockArtwork);
      
      if (result.verificationChanged) {
        alert(`🎉 Artist verification status changed! Now verified: ${result.artist.isVerified}`);
        
        // Update local state
        setArtists(prev => prev.map(artist => 
          artist.id === artistId ? result.artist : artist
        ));
        
        // Update stats
        const newStats = await mockDB.getVerificationStats();
        setStats(newStats);
      } else {
        alert(`Artwork uploaded! Artist now has ${result.artist.artworkCount} artworks.`);
        
        // Update local state
        setArtists(prev => prev.map(artist => 
          artist.id === artistId ? result.artist : artist
        ));
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
      alert('Error uploading artwork');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading badge system demo...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Badge System Demo
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Test the content-based badging system. Artists automatically receive a "Verified Artist" badge once they upload at least 3 artworks.
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">System Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900">{stats.totalArtists}</div>
                <div className="text-amber-600">Total Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.verifiedArtists}</div>
                <div className="text-amber-600">Verified Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900">{stats.verificationRate}%</div>
                <div className="text-amber-600">Verification Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900">{stats.totalArtworks}</div>
                <div className="text-amber-600">Total Artworks</div>
              </div>
            </div>
          </div>
        )}

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  {artist.avatar}
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-amber-900">{artist.name}</h3>
                  {artist.isVerified && <VerifiedArtistBadge size="sm" />}
                </div>
                
                <p className="text-amber-700 text-sm">{artist.location}</p>
                <p className="text-amber-600 text-xs">{artist.specialty}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Artworks:</span>
                  <span className="font-bold text-amber-900">{artist.artworkCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Status:</span>
                  <span className={`font-medium ${artist.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                    {artist.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Needs:</span>
                  <span className="text-amber-600 text-sm">
                    {shouldBeVerified(artist.artworkCount) 
                      ? 'Already qualified!' 
                      : `${3 - artist.artworkCount} more artwork${3 - artist.artworkCount !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>

                <button
                  onClick={() => simulateArtworkUpload(artist.id)}
                  className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 px-4 rounded-xl text-sm font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 mt-4"
                >
                  + Upload Artwork (Test)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Badge Examples */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Badge Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <VerifiedArtistBadge size="xs" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Extra Small</p>
            </div>
            <div className="text-center">
              <VerifiedArtistBadge size="sm" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Small</p>
            </div>
            <div className="text-center">
              <VerifiedArtistBadge size="md" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Medium</p>
            </div>
            <div className="text-center">
              <VerifiedArtistBadge size="lg" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Large</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-100 rounded-2xl p-6 mt-8">
          <h3 className="text-xl font-bold text-amber-900 mb-3">How to Test</h3>
          <ol className="list-decimal list-inside space-y-2 text-amber-800">
            <li>Click "Upload Artwork (Test)" on any artist card to simulate uploading an artwork</li>
            <li>Watch the artwork count increase and verification status change</li>
            <li>Artists automatically become verified when they reach 3+ artworks</li>
            <li>The green verified badge appears next to their name</li>
            <li>Statistics update in real-time</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default BadgeSystemDemo;
