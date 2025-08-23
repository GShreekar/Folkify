import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileEdit from '../profile/ProfileEdit';
import '../FolkArtAnimations.css';

const WelcomeBanner = () => {
  const { userData, artistStats, verificationProgress } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const artistName = userData?.fullName || 'Artist';
  const artworkCount = artistStats?.totalArtworks || 0;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white p-6 rounded-2xl mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {artistName}! 🎨
            </h1>
            <p className="text-amber-100">
              Ready to showcase your beautiful folk art to the world?
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-sm opacity-80">Artworks: </span>
                <span className="font-bold">{artworkCount}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-sm opacity-80">Status: </span>
                <span className="font-bold">
                  {userData?.isVerified ? '✓ Verified' : 
                   verificationProgress?.current >= 2 ? '🟡 Almost There' : '🔄 In Progress'}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <span className="text-sm opacity-80">Export: </span>
                <span className="font-bold">{userData?.exportCompliant ? 'Ready' : 'Pending'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setShowProfileEdit(true)}
              className="bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              <span className="mr-2">✏️</span>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {showProfileEdit && (
        <ProfileEdit
          isOpen={showProfileEdit}
          onClose={() => setShowProfileEdit(false)}
        />
      )}
    </>
  );
};

export default WelcomeBanner;
