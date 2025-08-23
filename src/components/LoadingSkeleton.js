import React from 'react';

const ArtworkSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-amber-100 animate-pulse">
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      ))}
    </>
  );
};

const ArtistSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-amber-200/50 p-6 text-center animate-pulse">
          <div className="relative mb-4">
            <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full"></div>
            <div className="absolute -bottom-2 -right-2 bg-gray-300 w-6 h-6 rounded-full border-2 border-white"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-200">
              <div>
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded-xl mt-4"></div>
          </div>
        </div>
      ))}
    </>
  );
};

const LoadingSkeleton = ({ type = 'artwork', count = 6 }) => {
  if (type === 'artist') {
    return <ArtistSkeleton count={count} />;
  }
  
  return <ArtworkSkeleton count={count} />;
};

export default LoadingSkeleton;
