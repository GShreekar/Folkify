import React from 'react';

const WelcomeBanner = ({ artistData }) => {
  const artistName = artistData?.name || 'Artist';

  return (
    <div className="bg-gradient-to-r from-amber-600 to-red-600 text-white p-6 rounded-2xl mb-8 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {artistName}! 🎨
          </h1>
          <p className="text-amber-100">
            Ready to showcase your beautiful folk art to the world?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-white text-amber-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
            <span className="mr-2">🎨</span>
            Upload New Artwork
          </button>
          <button className="bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
            <span className="mr-2">✏️</span>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
