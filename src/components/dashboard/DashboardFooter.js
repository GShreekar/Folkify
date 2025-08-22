import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-red-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-amber-100">
              © 2025 Folkify. All rights reserved. Made with ❤️ for Indian folk artists.
            </p>
          </div>

          <div className="flex space-x-6 text-sm">
            <a href="#about" className="text-amber-100 hover:text-white transition-colors duration-200">
              About
            </a>
            <a href="#contact" className="text-amber-100 hover:text-white transition-colors duration-200">
              Contact
            </a>
            <a href="#help" className="text-amber-100 hover:text-white transition-colors duration-200">
              Help
            </a>
            <a href="#terms" className="text-amber-100 hover:text-white transition-colors duration-200">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
