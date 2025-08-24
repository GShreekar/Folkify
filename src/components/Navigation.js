import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';

const Navigation = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionNavigation = (sectionId) => {
    if (location.pathname === '/') {
      // If already on home page, just scroll to section with offset for sticky navbar
      const element = document.getElementById(sectionId);
      if (element) {
        const navHeight = 80; // Account for sticky navbar height
        const elementPosition = element.offsetTop - navHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to home page and then scroll to section
      navigate('/', { replace: true });
      // Use a longer timeout to ensure page has fully loaded and rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navHeight = 80; // Account for sticky navbar height
          const elementPosition = element.offsetTop - navHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  };

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
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="folkify-title text-2xl sm:text-3xl font-bold text-amber-800 hover:text-red-600 transition-colors duration-200">
              Folkify
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-amber-800 hover:text-red-600 px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/gallery" className="text-amber-800 hover:text-red-600 px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200">
              Gallery
            </Link>
            <button 
              onClick={() => handleSectionNavigation('artists')}
              className="text-amber-800 hover:text-red-600 px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Artists
            </button>
            <button 
              onClick={() => handleSectionNavigation('about')}
              className="text-amber-800 hover:text-red-600 px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About Us
            </button>
          </div>

          {/* Search bar - Desktop only */}
          <div className="hidden lg:block flex-1 max-w-sm xl:max-w-lg mx-4 xl:mx-8">
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
          <div className="hidden lg:flex flex-shrink-0 items-center space-x-2 xl:space-x-3">
            {currentUser ? (
              <>
                <span className="text-amber-800 text-xs xl:text-sm truncate max-w-24 xl:max-w-none">
                  Welcome, {userData?.fullName || currentUser.email}
                </span>
                {userData?.role === 'artist' && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/my-purchases" 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      My Purchases
                    </Link>
                  </>
                )}
                {userData?.role === 'buyer' && (
                  <Link 
                    to="/my-purchases" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    My Purchases
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-gray-500 text-white px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium hover:bg-gray-600 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/user-login" 
                  className="text-amber-800 hover:text-red-600 px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/user-register" 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-3 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-medium hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  For Artists
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-amber-50 inline-flex items-center justify-center p-2 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle main menu"
            >
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
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-amber-50/95 backdrop-blur-sm border-t border-amber-200 shadow-lg">
          {/* Mobile navigation links */}
          <Link 
            to="/" 
            className="block px-3 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 font-medium transition-all duration-200 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link 
            to="/gallery" 
            className="block px-3 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 font-medium transition-all duration-200 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            🎨 Gallery
          </Link>
          <button 
            onClick={() => {
              handleSectionNavigation('artists');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 font-medium transition-all duration-200 rounded-lg"
          >
            👨‍🎨 Artists
          </button>
          <button 
            onClick={() => {
              handleSectionNavigation('about');
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 font-medium transition-all duration-200 rounded-lg"
          >
            ℹ️ About Us
          </button>
          
          {/* Mobile search */}
          <div className="px-3 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks..."
                className="w-full px-4 py-3 pl-10 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 bg-white text-sm shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile auth */}
          <div className="border-t border-amber-200 pt-3 mt-3">
            {currentUser ? (
              <>
                <div className="px-3 py-2 text-sm text-amber-800 bg-amber-100 rounded-lg mb-2">
                  Welcome, <span className="font-medium">{userData?.fullName || currentUser.email}</span>
                </div>
                {userData?.role === 'artist' && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block px-3 py-3 text-amber-900 hover:text-amber-700 hover:bg-amber-100 font-medium transition-all duration-200 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link 
                      to="/my-purchases" 
                      className="block px-3 py-3 text-blue-900 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      🛍️ My Purchases
                    </Link>
                  </>
                )}
                {userData?.role === 'buyer' && (
                  <Link 
                    to="/my-purchases" 
                    className="block px-3 py-3 text-blue-900 hover:text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🛍️ My Purchases
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 text-red-900 hover:text-red-700 hover:bg-red-50 font-medium transition-all duration-200 rounded-lg"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link 
                  to="/user-login" 
                  className="block px-3 py-3 text-center bg-amber-600 text-white hover:bg-amber-700 font-medium transition-all duration-200 rounded-lg shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔐 Login
                </Link>
                <Link 
                  to="/user-register" 
                  className="block px-3 py-3 text-center bg-green-600 text-white hover:bg-green-700 font-medium transition-all duration-200 rounded-lg shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📝 Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="block px-3 py-3 text-center bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700 font-medium transition-all duration-200 rounded-lg shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🎨 For Artists
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
