import React from 'react';

const GalleryCallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="folk-pattern-cta" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <circle cx="25" cy="25" r="2" fill="currentColor" />
              <circle cx="75" cy="75" r="2" fill="currentColor" />
              <circle cx="25" cy="75" r="2" fill="currentColor" />
              <circle cx="75" cy="25" r="2" fill="currentColor" />
              
              <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="1" />
              <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="1" />
              
              <polygon points="50,35 45,45 55,45" fill="currentColor" />
              <polygon points="50,65 45,55 55,55" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#folk-pattern-cta)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
            Support Local Artists.
            <br />
            <span className="text-yellow-200">Every Artwork Tells a Story.</span>
          </h2>

          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            When you purchase folk art, you're not just buying a piece of beauty—you're preserving centuries of tradition, 
            supporting rural communities, and keeping India's cultural heritage alive for future generations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-200 mb-2">500+</div>
              <div className="text-amber-100 text-lg">Local Artists</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-200 mb-2">50+</div>
              <div className="text-amber-100 text-lg">Art Forms</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-200 mb-2">28</div>
              <div className="text-amber-100 text-lg">States Represented</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Authentic & Original</h3>
              <p className="text-amber-100 text-sm">Every piece is handcrafted by skilled traditional artists</p>
            </div>

            <div className="text-center p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Direct Impact</h3>
              <p className="text-amber-100 text-sm">Your purchase directly supports the artist and their community</p>
            </div>

            <div className="text-center p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Secure Delivery</h3>
              <p className="text-amber-100 text-sm">Safe packaging and insured shipping to your doorstep</p>
            </div>

            <div className="text-center p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Certificate of Authenticity</h3>
              <p className="text-amber-100 text-sm">Each artwork comes with artist signature and provenance</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm max-w-3xl mx-auto">
            <p className="text-amber-100 text-lg italic">
              "Art is not what you see, but what you make others see. Every purchase preserves a tradition 
              and empowers an artist to continue their ancestral craft."
            </p>
            <p className="text-yellow-200 font-semibold mt-2">– Folkify Community</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryCallToAction;
