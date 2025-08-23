import React from 'react';

const VerifiedArtistBadge = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 text-xs',
    sm: 'w-5 h-5 text-sm',
    md: 'w-6 h-6 text-base',
    lg: 'w-8 h-8 text-lg'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`inline-flex items-center space-x-1 ${className}`}>
      <div className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center`}>
        <svg 
          className="w-3/4 h-3/4 text-white" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      <span className={`${textSizeClasses[size]} text-green-700 font-medium`}>
        Verified Artist
      </span>
    </div>
  );
};

export default VerifiedArtistBadge;
