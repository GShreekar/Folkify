import React from 'react';
import VerifiedArtistBadge from '../VerifiedArtistBadge';
import { getVerificationProgress } from '../../services/badgeService';

const ArtistProfileOverview = ({ artistData }) => {
  const {
    name = 'Artist Name',
    bio = 'Bio will be loaded from database...',
    region = 'Region',
    artform = 'Art Form',
    profilePicture = '👤',
    isVerified = false,
    artworkCount = 0
  } = artistData || {};

  const verificationProgress = getVerificationProgress({ artworkCount });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-4xl overflow-hidden">
            {typeof profilePicture === 'string' && profilePicture.startsWith('http') ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{profilePicture}</span>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-amber-900">{name}</h2>
                {isVerified && <VerifiedArtistBadge size="md" />}
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {artform}
                </span>
                <span className="text-amber-600">•</span>
                <span className="text-amber-700 font-medium">{region}</span>
              </div>

              <p className="text-amber-600 leading-relaxed max-w-2xl mb-4">
                {bio}
              </p>

              {!isVerified && verificationProgress.remaining > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-amber-900">
                      Verification Progress
                    </span>
                    <span className="text-xs text-amber-700">
                      {verificationProgress.current}/{verificationProgress.target} artworks
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        verificationProgress.status === 'almost_there' ? 'bg-amber-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${verificationProgress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-amber-700">
                    Upload {verificationProgress.remaining} more artwork{verificationProgress.remaining !== 1 ? 's' : ''} to become a Verified Artist! 🎨
                  </p>
                </div>
              )}
            </div>

            <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg transition-colors duration-200">
              <span className="text-lg">✏️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfileOverview;
