import React from 'react';

const HeroSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0522d' fill-opacity='0.2'%3E%3Cpath d='M40 40c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm-20-20c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3Cpath d='M20 60c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-amber-900">Preserving India's</span>
                <span className="block folkify-title">Folk Art</span>
                <span className="block text-red-800">Connecting Artists with the World</span>
              </h1>
              <p className="text-xl text-amber-800 leading-relaxed max-w-2xl">
                Discover authentic handmade artworks directly from traditional artists. 
                Experience the rich heritage of Warli, Madhubani, Pithora, and more.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('explore')}
                className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Art
              </button>
              <button 
                onClick={() => scrollToSection('artists')}
                className="border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200"
              >
                Meet the Artists
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">500+</div>
                <div className="text-amber-800 font-medium">Artworks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">100+</div>
                <div className="text-amber-800 font-medium">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">15+</div>
                <div className="text-amber-800 font-medium">Art Forms</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-amber-200 to-red-200 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎨</div>
                  <div className="text-amber-800 font-semibold">
                    Beautiful Folk Art
                  </div>
                  <div className="text-sm text-amber-700">
                    Warli • Madhubani • Pithora
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -left-4 bg-white rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-semibold text-amber-800">Warli</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-semibold text-red-700">Madhubani</span>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
                <span className="text-sm font-semibold text-orange-700">Pithora</span>
              </div>
            </div>

            <div className="absolute -z-10 top-4 right-4 w-20 h-20 bg-amber-300 rounded-full opacity-20"></div>
            <div className="absolute -z-10 bottom-4 left-4 w-16 h-16 bg-red-300 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
