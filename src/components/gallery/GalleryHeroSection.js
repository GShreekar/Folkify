import React from 'react';

const GalleryHeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0522d' fill-opacity='0.15'%3E%3Cpath d='M60 60c0-16.5 13.5-30 30-30s30 13.5 30 30-13.5 30-30 30-30-13.5-30-30zm-30-30c0-16.5 13.5-30 30-30s30 13.5 30 30-13.5 30-30 30-30-13.5-30-30z'/%3E%3Cpath d='M30 90c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15zm60 0c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15z'/%3E%3Cpath d='M15 30c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5-3.4 7.5-7.5 7.5S15 34.1 15 30zm90 0c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5-3.4 7.5-7.5 7.5-3.4-3.4-7.5-7.5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="block text-amber-900">Discover India's</span>
            <span className="block folkify-title">Living Folk Art</span>
          </h1>

          <p className="text-xl text-amber-700 leading-relaxed max-w-3xl mx-auto mb-8">
            Explore <span className="font-semibold">Warli</span>, <span className="font-semibold">Pithora</span>, <span className="font-semibold">Madhubani</span>, and more — 
            directly from authentic artists preserving centuries-old traditions.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">Warli</span>
            <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Madhubani</span>
            <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">Pithora</span>
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Gond</span>
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">Kalamkari</span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">& More</span>
          </div>

          <div className="animate-bounce">
            <svg className="w-6 h-6 mx-auto text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryHeroSection;
