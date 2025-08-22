import React from 'react';

const FeaturedArtworks = () => {
  const artworks = [];

  const getStyleColor = (style) => {
    switch (style) {
      case 'Warli': return 'text-amber-700 bg-amber-100';
      case 'Madhubani': return 'text-red-700 bg-red-100';
      case 'Pithora': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <section id="explore" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Featured Artworks
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Handpicked masterpieces from our talented artists, each telling a unique story 
            of India's rich folk art traditions.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {artworks.map((artwork) => (
              <div 
                key={artwork.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-amber-100"
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
                  {artwork.image}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStyleColor(artwork.style)}`}>
                      {artwork.style}
                    </span>
                    <span className="text-2xl font-bold text-amber-900">{artwork.price}</span>
                  </div>

                  <h3 className="text-xl font-bold text-amber-900 mb-1">
                    {artwork.title}
                  </h3>
                  
                  <p className="text-amber-700 font-medium mb-3">
                    by {artwork.artist}
                  </p>

                  <p className="text-sm text-amber-600 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {artwork.description}
                  </p>

                  <button className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-12">
            <div className="text-8xl mb-6">🎨</div>
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">
              Beautiful Artworks Coming Soon
            </h3>
            <p className="text-amber-600 max-w-md mx-auto">
              We're working with amazing folk artists to bring you authentic, handcrafted artworks. 
              Stay tuned for our collection!
            </p>
          </div>
        )}

        <div className="text-center">
          <button className="bg-white border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            View All Artworks
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
