import React from 'react';
import './FolkArtAnimations.css';

const WhyFolkify = () => {
  const pillars = [
    {
      id: 1,
      icon: "✅",
      title: "Authenticity",
      description: "Verified artists, original folk art",
      details: "Every artwork is created by verified traditional artists using authentic techniques passed down through generations. No mass-produced replicas."
    },
    {
      id: 2,
      icon: "🤝",
      title: "Fair Trade",
      description: "Artists set their own prices, no middlemen",
      details: "Artists receive fair compensation for their work. We believe in direct trade that empowers creators and preserves their livelihoods."
    },
    {
      id: 3,
      icon: "🏛️",
      title: "Cultural Preservation",
      description: "Supporting India's heritage",
      details: "By purchasing from Folkify, you're helping preserve centuries-old art traditions and supporting communities that keep these crafts alive."
    },
    {
      id: 4,
      icon: "🌍",
      title: "Global Access",
      description: "Bringing local art to worldwide audiences",
      details: "We bridge the gap between rural artists and global art lovers, making authentic Indian folk art accessible to collectors worldwide."
    }
  ];

  return (
    <section id="about" className="py-16 folk-art-background">
      {/* Mandala Patterns */}
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="mandala-pattern mandala-3"></div>
      <div className="mandala-pattern mandala-4"></div>
      
      {/* Warli Art Figures */}
      <div className="warli-figure warli-1">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-2">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-3">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-4">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-5">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      
      {/* Geometric Patterns */}
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>
      <div className="geometric-pattern geo-3"></div>
      
      {/* Content with overlay */}
      <div className="folk-content-overlay max-w-7xl mx-auto">
        {/* Warli corner decorations */}
        <div className="warli-corner-decoration warli-corner-tl"></div>
        <div className="warli-corner-decoration warli-corner-tr"></div>
        <div className="warli-corner-decoration warli-corner-bl"></div>
        <div className="warli-corner-decoration warli-corner-br"></div>
        
        {/* Side patterns */}
        <div className="warli-side-pattern"></div>
        <div className="warli-side-pattern warli-side-pattern-right"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Why Folkify?
          </h2>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            We're more than just an art marketplace. We're a bridge between traditional 
            artists and art lovers worldwide, preserving culture while creating opportunities.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pillars.map((pillar) => (
            <div 
              key={pillar.id} 
              className="group text-center p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-red-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-amber-200/50 warli-pillar-card"
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>

              <h3 className="text-xl font-bold text-amber-900 mb-3">
                {pillar.title}
              </h3>

              <p className="text-amber-700 font-medium mb-4">
                {pillar.description}
              </p>

              <p className="text-sm text-amber-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {pillar.details}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-red-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-amber-100">Artworks Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">₹12L+</div>
              <div className="text-amber-100">Earned by Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-amber-100">Active Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-amber-100">Countries Reached</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">
            Join Our Mission
          </h3>
          <p className="text-amber-700 mb-8 max-w-2xl mx-auto">
            Whether you're an art lover looking for authentic pieces or an artist 
            wanting to share your craft with the world, Folkify is your platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Collecting
            </button>
            <button className="border-2 border-amber-600 text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-600 hover:text-white transform hover:scale-105 transition-all duration-200">
              Become an Artist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFolkify;
