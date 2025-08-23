import React, { useState } from 'react';
import Navigation from '../Navigation';
import GalleryHeroSection from './GalleryHeroSection';
import GalleryFilters from './GalleryFilters';
import GalleryArtworksGrid from './GalleryArtworksGrid';
import GalleryCallToAction from './GalleryCallToAction';
import Footer from '../Footer';
import '../FolkArtAnimations.css';

const Gallery = () => {
  const [filters, setFilters] = useState({
    artform: 'all',
    region: 'all',
    search: '',
    sort: 'newest'
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen folk-art-background">
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
      
      {/* Content with overlay for readability */}
      <div className="relative z-10">
        <Navigation />
        
        <div className="folk-content-overlay">
          <GalleryHeroSection />
        </div>
        
        <div className="folk-content-overlay">
          <GalleryFilters onFiltersChange={handleFiltersChange} />
        </div>
        
        <div className="folk-content-overlay">
          <GalleryArtworksGrid filters={filters} />
        </div>

        <div className="folk-content-overlay">
          <GalleryCallToAction />
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default Gallery;