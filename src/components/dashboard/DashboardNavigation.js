import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../firebase/auth';

const DashboardNavigation = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        navigate('/login');
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const scrollToArtworks = (e) => {
    e.preventDefault();
    
    // First, switch to artworks tab if not already there
    if (setActiveTab && activeTab !== 'artworks') {
      setActiveTab('artworks');
      
      // Longer delay when switching tabs to ensure content is rendered
      setTimeout(() => {
        const artworksSection = document.getElementById('my-artworks-section');
        if (artworksSection) {
          artworksSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 200);
    } else {
      // Already on artworks tab, just scroll
      setTimeout(() => {
        const artworksSection = document.getElementById('my-artworks-section');
        if (artworksSection) {
          artworksSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 50);
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
              <Link 
                to="/dashboard" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 border-amber-600"
              >
                Dashboard
              </Link>
              <button 
                onClick={scrollToArtworks}
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-amber-600"
              >
                My Artworks
              </button>
              <Link 
                to="/my-purchases" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:border-b-2 hover:border-amber-600"
              >
                My Purchases
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
