import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
        <h2 className="text-2xl font-bold text-amber-800 mb-2">Folkify</h2>
        <p className="text-amber-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
