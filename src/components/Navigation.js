import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';

const Navigation = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="folkify-title text-3xl font-bold">
                Folkify
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
            <Link to="/" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/gallery" className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
              Gallery
            </Link>
            <Link 
              to="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === '/') {
                  document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#artists';
                }
              }}
              className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Artists
            </Link>
            <Link 
              to="/"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === '/') {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = '/#about';
                }
              }}
              className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About Us
            </Link>
          </div>

          {/* Search bar - Desktop only */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
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

          {/* Auth section - Desktop only */}
          <div className="hidden md:flex flex-shrink-0 items-center space-x-3">
            {currentUser ? (
              <>
                <span className="text-amber-800 text-sm">
                  Welcome, {userData?.fullName || currentUser.email}
                </span>
                {userData?.role === 'artist' && (
                  <Link 
                    to="/dashboard" 
                    className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                )}
                {userData?.role !== 'artist' && (
                  <Link 
                    to="/purchase-history" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    My Purchases
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-600 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/user-login" 
                  className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/user-register" 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  For Artists
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-amber-50 inline-flex items-center justify-center p-2 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-amber-50 border-t border-amber-200">
          <Link 
            to="/" 
            className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link 
            to="/" 
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              if (window.location.pathname === '/') {
                document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#artists';
              }
            }}
            className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
          >
            Artists
          </Link>
          <Link 
            to="/" 
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              if (window.location.pathname === '/') {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#about';
              }
            }}
            className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
          >
            About Us
          </Link>
          
          {/* Mobile search */}
          <div className="px-3 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-white text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile auth */}
          <div className="border-t border-amber-200 pt-2">
            {currentUser ? (
              <>
                <div className="px-3 py-2 text-sm text-amber-800">
                  Welcome, {userData?.fullName || currentUser.email}
                </div>
                {userData?.role === 'artist' && (
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {userData?.role !== 'artist' && (
                  <Link 
                    to="/purchase-history" 
                    className="block px-3 py-2 text-blue-900 hover:text-blue-700 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Purchases
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/user-login" 
                  className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/user-register" 
                  className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 text-amber-900 hover:text-amber-700 font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  For Artists
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
