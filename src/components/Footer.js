import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    // TODO: Implement actual newsletter subscription service
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer id="contact" className="bg-gradient-to-br from-amber-900 via-red-900 to-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
          {/* Company Info */}
          <div className="space-y-4 lg:space-y-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <div>
              <h3 className="folkify-title text-2xl lg:text-3xl font-bold text-white mb-2">
                Folkify
              </h3>
              <p className="text-amber-100 leading-relaxed text-sm lg:text-base">
                Preserving India's folk art heritage while connecting traditional artists with art lovers worldwide.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-200" aria-label="Facebook">
                <span className="text-lg">📘</span>
              </button>
              <button className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-200" aria-label="Instagram">
                <span className="text-lg">📸</span>
              </button>
              <button className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-200" aria-label="Twitter">
                <span className="text-lg">🐦</span>
              </button>
              <button className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-200" aria-label="YouTube">
                <span className="text-lg">📺</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Quick Links</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link to="/" className="text-amber-100 hover:text-white transition-colors duration-200 text-sm lg:text-base">Home</Link></li>
              <li><Link to="/gallery" className="text-amber-100 hover:text-white transition-colors duration-200 text-sm lg:text-base">Gallery</Link></li>
              <li><a href="#artists" className="text-amber-100 hover:text-white transition-colors duration-200 text-sm lg:text-base">Artists</a></li>
              <li><a href="#about" className="text-amber-100 hover:text-white transition-colors duration-200 text-sm lg:text-base">About Us</a></li>
            </ul>
          </div>

          {/* For Artists */}
          <div className="col-span-1">
            <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">For Artists</h4>
            <ul className="space-y-2 lg:space-y-3">
              <li><Link to="/register" className="text-amber-100 hover:text-white transition-colors duration-200 text-sm lg:text-base">Join as Artist</Link></li>
              <li><Link to="/login" className="text-amber-100 hover:text-white transition-colors duration-200 text-sm lg:text-base">Artist Login</Link></li>
              <li><button className="text-amber-100 hover:text-white transition-colors duration-200 text-left text-sm lg:text-base">Seller Guidelines</button></li>
              <li><button className="text-amber-100 hover:text-white transition-colors duration-200 text-left text-sm lg:text-base">Pricing Tips</button></li>
              <li><button className="text-amber-100 hover:text-white transition-colors duration-200 text-left text-sm lg:text-base">Success Stories</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Stay Updated</h4>
            <p className="text-amber-100 mb-4 text-xs lg:text-sm">
              Get notified about new folk art collections and artist features.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 lg:py-3 rounded-xl border border-amber-700 bg-amber-800/50 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-2 lg:py-3 px-4 rounded-xl font-semibold hover:bg-amber-500 transform hover:scale-105 transition-all duration-200 text-sm lg:text-base"
              >
                {subscribed ? 'Subscribed! ✓' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-amber-700 pt-6 lg:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 lg:gap-6 text-xs lg:text-sm">
              <button className="text-amber-100 hover:text-white transition-colors duration-200">Privacy Policy</button>
              <button className="text-amber-100 hover:text-white transition-colors duration-200">Terms of Service</button>
              <button className="text-amber-100 hover:text-white transition-colors duration-200">Shipping Policy</button>
              <button className="text-amber-100 hover:text-white transition-colors duration-200">Return Policy</button>
              <button className="text-amber-100 hover:text-white transition-colors duration-200">Contact Us</button>
            </div>

            <div className="text-xs lg:text-sm text-amber-100 text-center md:text-right">
              © 2025 Folkify. All rights reserved. Made with ❤️ for Indian folk art.
            </div>
          </div>
        </div>
      </div>

      <div className="h-1 lg:h-2 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500"></div>
    </footer>
  );
};

export default Footer;
