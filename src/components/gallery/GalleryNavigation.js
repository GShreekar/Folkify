import React from 'react';
import { Link } from 'react-router-dom';

const GalleryNavigation = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="folkify-title text-3xl font-bold">
              Folkify
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                to="/" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/gallery" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 border-amber-600"
              >
                Gallery
              </Link>
              <Link 
                to="/folk-arts" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                About Folk Arts
              </Link>
              <Link 
                to="/contact" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button className="text-amber-800 hover:text-red-600 p-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GalleryNavigation;
