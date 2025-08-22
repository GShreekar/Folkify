import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardNavigation = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="folkify-title text-3xl font-bold">
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
              <Link 
                to="/dashboard/artworks" 
                className="text-amber-800 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                My Artworks
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200 relative"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-amber-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-amber-100">
                    <h3 className="font-semibold text-amber-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 text-center text-amber-600">
                      No notifications yet
                    </div>
                  </div>
                </div>
              )}
            </div>

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
