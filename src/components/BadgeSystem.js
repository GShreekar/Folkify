import React, { useState, useEffect } from 'react';
import VerifiedArtistBadge from './VerifiedArtistBadge';
import { shouldBeVerified, updateArtistVerification } from '../utils/artistUtils';

const BadgeSystem = () => {
  // Sample artist for demonstration (would come from Firebase/backend in real app)
  const [artist, setArtist] = useState({
    id: 1,
    name: 'Sample Artist',
    location: 'Karnataka, India',
    specialty: 'Traditional Folk Art',
    artworkCount: 0,
    isVerified: false,
    joinDate: '2024-01-15'
  });

  const [artworks, setArtworks] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const currentlyVerified = shouldBeVerified(artist.artworkCount);
    
    if (currentlyVerified && !artist.isVerified) {
      setArtist(prev => updateArtistVerification(prev, prev.artworkCount));
      showVerificationNotification('🎉 Congratulations! You are now a Verified Artist!');
    } else if (!currentlyVerified && artist.isVerified) {
      setArtist(prev => ({ ...prev, isVerified: false }));
    }
  }, [artist.artworkCount, artist.isVerified]);

  const showVerificationNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const simulateArtworkUpload = () => {
    const newArtwork = {
      id: Date.now(),
      title: `Artwork ${artworks.length + 1}`,
      description: 'Beautiful traditional folk art piece',
      artistId: artist.id,
      uploadDate: new Date().toISOString(),
      status: 'approved'
    };

    setArtworks(prev => [...prev, newArtwork]);
    setArtist(prev => ({
      ...prev,
      artworkCount: prev.artworkCount + 1
    }));
  };

  const removeArtwork = (artworkId) => {
    setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
    setArtist(prev => ({
      ...prev,
      artworkCount: Math.max(0, prev.artworkCount - 1)
    }));
  };

  const getVerificationProgress = () => {
    const needed = 3;
    const current = artist.artworkCount;
    return Math.min((current / needed) * 100, 100);
  };

  const getStatusColor = () => {
    if (artist.isVerified) return 'text-green-600';
    if (artist.artworkCount >= 2) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getStatusMessage = () => {
    if (artist.isVerified) return 'Verified Artist';
    const remaining = 3 - artist.artworkCount;
    return `${remaining} more artwork${remaining !== 1 ? 's' : ''} needed for verification`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {showNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 transform animate-bounce">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <span className="font-semibold">{notificationMessage}</span>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Artist Badge System
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Upload 3 artworks to automatically become a Verified Artist and unlock premium features!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-4xl mr-6">
              🎨
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <h2 className="text-3xl font-bold text-amber-900">{artist.name}</h2>
                {artist.isVerified && <VerifiedArtistBadge size="lg" />}
              </div>
              <p className="text-amber-700">{artist.location}</p>
              <p className="text-amber-600 text-sm">{artist.specialty}</p>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-amber-900">Verification Progress</h3>
              <span className={`font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </span>
            </div>
            
            <div className="w-full bg-amber-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  artist.isVerified ? 'bg-green-500' : 'bg-amber-500'
                }`}
                style={{ width: `${getVerificationProgress()}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-amber-700">
              <span>{artist.artworkCount} artworks uploaded</span>
              <span>3 needed for verification</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-900">{artist.artworkCount}</div>
              <div className="text-amber-600 text-sm">Artworks</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-900">
                {artist.isVerified ? '✅' : '⏳'}
              </div>
              <div className="text-amber-600 text-sm">Status</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-900">{Math.round(getVerificationProgress())}%</div>
              <div className="text-amber-600 text-sm">Progress</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-900">
                {artist.isVerified ? '🏆' : '🎯'}
              </div>
              <div className="text-amber-600 text-sm">Goal</div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={simulateArtworkUpload}
              className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              + Upload New Artwork
            </button>
          </div>
        </div>

        {artworks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Your Artworks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="border border-amber-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-amber-900">{artwork.title}</h4>
                    <button
                      onClick={() => removeArtwork(artwork.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-amber-700 text-sm mb-2">{artwork.description}</p>
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>#{artwork.id}</span>
                    <span>{artwork.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">Verified Artist Badge Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-amber-200 rounded-xl">
              <VerifiedArtistBadge size="xs" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Extra Small (xs)</p>
              <p className="text-xs text-amber-500">For compact spaces</p>
            </div>
            <div className="text-center p-4 border border-amber-200 rounded-xl">
              <VerifiedArtistBadge size="sm" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Small (sm)</p>
              <p className="text-xs text-amber-500">Default size</p>
            </div>
            <div className="text-center p-4 border border-amber-200 rounded-xl">
              <VerifiedArtistBadge size="md" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Medium (md)</p>
              <p className="text-xs text-amber-500">For profiles</p>
            </div>
            <div className="text-center p-4 border border-amber-200 rounded-xl">
              <VerifiedArtistBadge size="lg" className="justify-center mb-2" />
              <p className="text-sm text-amber-600">Large (lg)</p>
              <p className="text-xs text-amber-500">For showcases</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-green-900 mb-4">🏆 Verified Artist Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-green-800">Verified badge displayed on profile</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-green-800">Higher search ranking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-green-800">Access to premium features</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span className="text-green-800">Enhanced credibility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;
