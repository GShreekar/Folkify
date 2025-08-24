import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './FolkArtAnimations.css';

// Component for the folk art slideshow
const FolkArtSlideshow = () => {
  const images = [
    {
      src: "https://diybaazar.com/publicuploads/seller/products/warli-painting-on-6inch-square-mdf-board-3-1_1724362302.jpg",
      alt: "Authentic Warli Dancing Figures Art",
      title: "Authentic Warli Art",
      description: "Traditional • Handcrafted",
    },
    {
      src: "https://www.tallengestore.com/cdn/shop/files/Peacock-MadhubaniPainting-FolkArtOfIndia_af8a25dc-dbe6-44b2-ab61-200d1f566721.jpg?v=1733380872",
      alt: "Madhubani Peacock Painting",
      title: "Vibrant Madhubani Art",
      description: "Intricate • Cultural",
    },
    {
      src: "https://www.gitagged.com/wp-content/uploads/2022/05/PITHORA-HORSE-RIDE-4-1.jpg",
      alt: "Pithora Art Horse",
      title: "Captivating Pithora Art",
      description: "Tribal • Ritualistic",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
        <div className="aspect-square bg-gradient-to-br from-red-600 via-orange-500 to-red-800 rounded-xl lg:rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-2 lg:inset-4 rounded-lg lg:rounded-xl overflow-hidden transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover rounded-md lg:rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Basic fallback, consider more robust error handling if needed
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPjxwYXRoIGQ9Ik0xMDAgMTQ1LjQ1MkM2Ni45NzQgMTQ1LjQ1MiAzMC4xMTcgMTE3LjY1OCAzMC4xMTcgODQuMDcxN0MzMC4xMTcgNTAuNDgzNyA2Ni45NzQgMjIuNjkgMTAwIDIyLjY5QzEzMy4wMjYgMjIuNjkgMTcwLjAxMyA1MC40ODM3IDE3MC4wMTMgODQuMDcxNkMxNzAuMDEzIDExNy42NTggMTMzLjAyNiAxNDUuNDUyIDEwMCAxNDUuNDUyeiIgZmlsbD0id2hpdGUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMy45NDAyIDc1LjY4NzdMMTYuODgzNSAzNS45OTM3TDIuMDMzNTkgNzUuNjg3N0w0OC44NTIzIDE0OC4yMDhMNzMuODY5NyA4Ni4zODQ0TTc1LjQxMzMgMTY4LjAyNEw5NC4wOTMzIDk3LjMxMTZMMTA1LjcwNyAxNzAuMDI0TTExNi43MzEgODMuODIzM0wxNDEuMjQ3IDE0Ny43MDhMMTQ4LjU5MSAzNi4xNjM0TDEzMy40MDYgNzUuNjg3N0wxMDAgMTA1LjE4M0wxMDAgMjIuNjlMMzMuOTQwMiA3NS42ODc3WiIgZmlsbD0id2hpdGUiLz48L2c+PGRlZnM+PGNsaXBQYXRoIGlkPSJjbGlwMC0iPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGIi8+PC9jbGlwUGF0aD48L2RlZnM+PC9zdmc+";
            }}
          />

          {/* Decorative frame overlay */}
          <div className="absolute inset-0 border-2 lg:border-4 border-white/20 rounded-md lg:rounded-lg"></div>

          {/* Animated corner decorations */}
          <div className="absolute top-1 lg:top-2 left-1 lg:left-2 w-3 lg:w-4 h-3 lg:h-4 border-l-2 border-t-2 border-white/40 animate-pulse"></div>
          <div className="absolute top-1 lg:top-2 right-1 lg:right-2 w-3 lg:w-4 h-3 lg:h-4 border-r-2 border-t-2 border-white/40 animate-pulse"></div>
          <div className="absolute bottom-1 lg:bottom-2 left-1 lg:left-2 w-3 lg:w-4 h-3 lg:h-4 border-l-2 border-b-2 border-white/40 animate-pulse"></div>
          <div className="absolute bottom-1 lg:bottom-2 right-1 lg:right-2 w-3 lg:w-4 h-3 lg:h-4 border-r-2 border-b-2 border-white/40 animate-pulse"></div>
        </div>
      ))}

      <div className="absolute top-2 lg:top-4 left-2 lg:left-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-lg px-2 lg:px-4 py-1 lg:py-2 border border-white/30 shadow-lg animate-pulse">
        <div className="text-white font-bold text-xs lg:text-sm flex items-center">
          <span className="mr-1 lg:mr-2">🎨</span>
          {images[currentSlide].title}
        </div>
      </div>

      <div className="absolute bottom-2 lg:bottom-4 right-2 lg:right-4 bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm rounded-lg px-2 lg:px-4 py-1 lg:py-2 border border-white/30 shadow-lg">
        <div className="text-white font-medium text-xs flex items-center">
          <span className="mr-1 lg:mr-2">✨</span>
          {images[currentSlide].description}
        </div>
      </div>
    </div>
  );
};


const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBecomeArtist = () => {
    if (currentUser) {
      if (userData?.role === 'artist') {
        // Artist is already logged in, go to dashboard
        navigate('/dashboard');
      } else {
        // User is logged in but not as artist, go to artist registration
        navigate('/register');
      }
    } else {
      // Not logged in, go to artist login
      navigate('/login');
    }
  };

  const WarliDancingFigures = () => (
    <div className="absolute inset-0 overflow-hidden opacity-5">
      {/* Animated Warli figures */}
      <div className="absolute top-20 left-10 animate-bounce-slow">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-amber-800">
          <circle cx="30" cy="8" r="3" fill="currentColor"/>
          <line x1="30" y1="11" x2="30" y2="25" stroke="currentColor" strokeWidth="2"/>
          <line x1="30" y1="18" x2="20" y2="30" stroke="currentColor" strokeWidth="2"/>
          <line x1="30" y1="18" x2="40" y2="30" stroke="currentColor" strokeWidth="2"/>
          <line x1="30" y1="25" x2="22" y2="45" stroke="currentColor" strokeWidth="2"/>
          <line x1="30" y1="25" x2="38" y2="45" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      <div className="absolute top-40 right-20 animate-pulse">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-red-700">
          <circle cx="25" cy="12" r="3" fill="currentColor"/>
          <circle cx="55" cy="12" r="3" fill="currentColor"/>
          <line x1="25" y1="15" x2="25" y2="30" stroke="currentColor" strokeWidth="2"/>
          <line x1="55" y1="15" x2="55" y2="30" stroke="currentColor" strokeWidth="2"/>
          <line x1="25" y1="22" x2="15" y2="35" stroke="currentColor" strokeWidth="2"/>
          <line x1="25" y1="22" x2="35" y2="35" stroke="currentColor" strokeWidth="2"/>
          <line x1="55" y1="22" x2="45" y2="35" stroke="currentColor" strokeWidth="2"/>
          <line x1="55" y1="22" x2="65" y2="35" stroke="currentColor" strokeWidth="2"/>
          <line x1="25" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="2"/>
          <line x1="25" y1="30" x2="20" y2="50" stroke="currentColor" strokeWidth="2"/>
          <line x1="25" y1="30" x2="30" y2="50" stroke="currentColor" strokeWidth="2"/>
          <line x1="55" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="2"/>
          <line x1="55" y1="30" x2="60" y2="50" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      <div className="absolute bottom-32 left-1/4 animate-sway">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="text-orange-700">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="25" cy="25" r="12" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="25" cy="25" r="6" fill="currentColor"/>
          {Array.from({length: 8}).map((_, i) => (
            <line
              key={i}
              x1="25"
              y1="5"
              x2="25"
              y2="15"
              stroke="currentColor"
              strokeWidth="1"
              transform={`rotate(${i * 45} 25 25)`}
            />
          ))}
        </svg>
      </div>

      {/* Warli-style geometric patterns */}
      <div className="absolute top-1/3 right-10 animate-spin-slow">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-amber-600">
          <polygon points="50,10 90,90 10,90" stroke="currentColor" strokeWidth="2" fill="none"/>
          <polygon points="50,25 75,75 25,75" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="50" cy="60" r="8" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );

  const WarliTreePattern = () => (
    <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
      <svg width="100%" height="128" viewBox="0 0 800 128" preserveAspectRatio="none" className="text-amber-800">
        {Array.from({length: 15}).map((_, i) => (
          <g key={i} transform={`translate(${i * 55}, 0)`}>
            <line x1="25" y1="128" x2="25" y2="80" stroke="currentColor" strokeWidth="2"/>
            <circle cx="25" cy="70" r="15" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="25" cy="50" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
            <line x1="15" y1="128" x2="15" y2="100" stroke="currentColor" strokeWidth="1"/>
            <line x1="35" y1="128" x2="35" y2="100" stroke="currentColor" strokeWidth="1"/>
            <circle cx="15" cy="95" r="3" fill="currentColor"/>
            <circle cx="35" cy="95" r="3" fill="currentColor"/>
          </g>
        ))}
      </svg>
    </div>
  );

  return (
    <section id="home" className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 sm:py-16 lg:py-20 overflow-hidden">
      <WarliDancingFigures />
      <WarliTreePattern />

      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-8">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="warli-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#a0522d" opacity="0.3"/>
              <circle cx="25" cy="25" r="1" fill="#dc2626" opacity="0.2"/>
              <circle cx="75" cy="75" r="1" fill="#ea580c" opacity="0.2"/>
              <polygon points="50,40 45,50 55,50" fill="#a0522d" opacity="0.15"/>
              <line x1="20" y1="20" x2="80" y2="80" stroke="#a0522d" strokeWidth="0.5" opacity="0.1"/>
              <line x1="80" y1="20" x2="20" y2="80" stroke="#dc2626" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#warli-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-amber-900">Preserving India's</span>
                <span className="block folkify-title text-red-700">Folk Art</span>
                <span className="block text-red-800 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Connecting Artists with the World</span>
              </h1>
              <p className="text-lg sm:text-xl text-amber-800 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover authentic handmade artworks directly from traditional artists.
                Experience the rich heritage of Warli, Madhubani, Pithora, and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => scrollToSection('explore')}
                className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group min-w-0"
              >
                <span className="relative z-10 flex items-center justify-center">
                  🎨 Explore Art
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              <button
                onClick={() => scrollToSection('artists')}
                className="border-2 border-amber-600 text-amber-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200 relative overflow-hidden group min-w-0"
              >
                <span className="relative z-10 flex items-center justify-center">
                  👨‍🎨 Meet Artists
                </span>
              </button>
              {(!currentUser || userData?.role !== 'artist') && (
                <button
                  onClick={handleBecomeArtist}
                  className="border-2 border-red-600 text-red-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-red-600 hover:text-white transform hover:scale-105 transition-all duration-200 relative overflow-hidden group inline-flex items-center justify-center min-w-0"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    ✨ Become an Artist
                  </span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 lg:gap-8 pt-6 lg:pt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">500+</div>
                <div className="text-sm sm:text-base text-amber-800 font-medium">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">100+</div>
                <div className="text-sm sm:text-base text-amber-800 font-medium">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">15+</div>
                <div className="text-sm sm:text-base text-amber-800 font-medium">Art Forms</div>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className={`relative bg-gradient-to-br from-red-800 via-red-700 to-amber-900 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <FolkArtSlideshow />

              <div className="absolute -top-4 lg:-top-6 -left-4 lg:-left-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-4 lg:px-6 py-2 lg:py-3 shadow-xl border-2 border-white animate-float-gentle hover:scale-110 transition-transform duration-300">
                <span className="text-xs lg:text-sm font-bold text-white relative">
                  🎨 Warli
                  <div className="absolute inset-0 shimmer-effect rounded-full"></div>
                </span>
              </div>
              <div className="absolute -top-4 lg:-top-6 -right-4 lg:-right-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full px-4 lg:px-6 py-2 lg:py-3 shadow-xl border-2 border-white animate-float-gentle hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.5s'}}>
                <span className="text-xs lg:text-sm font-bold text-white relative">
                  🌺 Madhubani
                  <div className="absolute inset-0 shimmer-effect rounded-full"></div>
                </span>
              </div>
              <div className="absolute -bottom-4 lg:-bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full px-4 lg:px-6 py-2 lg:py-3 shadow-xl border-2 border-white animate-float-gentle hover:scale-110 transition-transform duration-300" style={{animationDelay: '1s'}}>
                <span className="text-xs lg:text-sm font-bold text-white relative">
                  🦚 Pithora
                  <div className="absolute inset-0 shimmer-effect rounded-full"></div>
                </span>
              </div>
            </div>

            {/* Enhanced decorative elements */}
            <div className="absolute -z-10 top-4 lg:top-8 right-4 lg:right-8 w-24 lg:w-32 h-24 lg:h-32 rounded-full opacity-20 animate-pulse">
              <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none"/>
                {Array.from({length: 8}).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                    <circle cx="50" cy="10" r="3" fill="currentColor"/>
                    <line x1="50" y1="13" x2="50" y2="20" stroke="currentColor" strokeWidth="1"/>
                  </g>
                ))}
              </svg>
            </div>
            <div className="absolute -z-10 bottom-4 lg:bottom-8 left-4 lg:left-8 w-20 lg:w-24 h-20 lg:h-24 rounded-full opacity-20 animate-bounce-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-red-400">
                <polygon points="50,10 90,90 10,90" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="50" cy="60" r="8" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;