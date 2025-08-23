import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import VerifiedArtistBadge from '../VerifiedArtistBadge';
import ProfileEdit from '../profile/ProfileEdit';

const ArtistProfileOverview = () => {
  const { userData, userArtworks, verificationProgress, profileLoading } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  if (profileLoading || !userData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
        <div className="animate-pulse">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-amber-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-amber-200 rounded w-48 mb-3"></div>
              <div className="h-4 bg-amber-200 rounded w-32 mb-3"></div>
              <div className="h-4 bg-amber-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-amber-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    fullName,
    bio = 'Complete your bio to help customers learn about your artistic journey...',
    village,
    primaryArtForm,
    isVerified = false,
    yearsOfExperience,
    specialization,
    awardsAndRecognition,
    socialMedia = {}
  } = userData;

  const artworkCount = userArtworks?.length || 0;

  const handleProfileEditSuccess = () => {
    console.log('Profile updated successfully');
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-red-200 rounded-full flex items-center justify-center text-4xl overflow-hidden">
              <span>👤</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-amber-900">{fullName}</h2>
                  {isVerified && <VerifiedArtistBadge size="md" />}
                </div>

                <div className="flex items-center space-x-2 mb-3 flex-wrap gap-2">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {primaryArtForm || 'Art Form'}
                  </span>
                  {village && (
                    <>
                      <span className="text-amber-600">•</span>
                      <span className="text-amber-700 font-medium">{village}</span>
                    </>
                  )}
                  {yearsOfExperience && (
                    <>
                      <span className="text-amber-600">•</span>
                      <span className="text-amber-700">{yearsOfExperience} years experience</span>
                    </>
                  )}
                </div>

                {specialization && (
                  <div className="mb-3">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      Specializes in: {specialization}
                    </span>
                  </div>
                )}

                <p className="text-amber-600 leading-relaxed max-w-2xl mb-4">
                  {bio}
                </p>

                {awardsAndRecognition && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-1">🏆 Recognition & Awards</h4>
                    <p className="text-sm text-yellow-700">{awardsAndRecognition}</p>
                  </div>
                )}

                {(socialMedia.instagram || socialMedia.facebook || socialMedia.website) && (
                  <div className="flex items-center space-x-4 mb-4">
                    {socialMedia.instagram && (
                      <a
                        href={socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                      >
                        📷 Instagram
                      </a>
                    )}
                    {socialMedia.facebook && (
                      <a
                        href={socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        📘 Facebook
                      </a>
                    )}
                    {socialMedia.website && (
                      <a
                        href={socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 transition-colors duration-200"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-amber-800">{artworkCount}</div>
                    <div className="text-sm text-amber-600">Artworks</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-800">
                      {isVerified ? '✓' : (verificationProgress?.percentage || 0) + '%'}
                    </div>
                    <div className="text-sm text-red-600">
                      {isVerified ? 'Verified' : 'Progress'}
                    </div>
                  </div>
                </div>

                {!isVerified && verificationProgress && verificationProgress.remaining > 0 && (
                  <div className="bg-amber-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-amber-900">
                        Verification Progress
                      </span>
                      <span className="text-xs text-amber-700">
                        {verificationProgress?.current || 0}/{verificationProgress?.target || 3} artworks
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          verificationProgress.status === 'almost_there' ? 'bg-amber-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${verificationProgress?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-amber-700">
                      Upload {verificationProgress?.remaining || 3} more artwork{(verificationProgress?.remaining || 3) !== 1 ? 's' : ''} to become a Verified Artist! 🎨
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowProfileEdit(true)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 p-2 rounded-lg transition-colors duration-200 flex-shrink-0"
                title="Edit Profile"
              >
                <span className="text-lg">✏️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProfileEdit && (
        <ProfileEdit
          onClose={() => setShowProfileEdit(false)}
          onSuccess={handleProfileEditSuccess}
        />
      )}
    </>
  );
};

export default ArtistProfileOverview;
