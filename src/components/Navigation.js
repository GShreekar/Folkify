import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';

const Navigation = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { currentUser, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
              <a href="#home" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Home
              </a>
              <a href="#explore" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Explore Art
              </a>
              <a href="#artists" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Artists
              </a>
              <a href="#workshops" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Workshops
              </a>
              <a href="#about" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                About Us
              </a>
              <a href="#contact" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks, artists, or styles..."
                className={`w-full px-4 py-2 pl-10 rounded-full border ${
                  isSearchFocused ? 'border-amber-500 ring-2 ring-amber-200' : 'border-amber-300'
                } focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-white/70 text-sm transition-all duration-200`}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center space-x-3">
            {currentUser ? (
              <>
                <span className="text-amber-800 text-sm">
                  Welcome, {userData?.fullName || currentUser.email}
                </span>
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-600 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                For Artists → Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden">
      </div>
    </nav>
  );
};

export default Navigation;
