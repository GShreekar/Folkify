import React, { useState } from 'react';
import GalleryNavigation from './GalleryNavigation';
import GalleryHeroSection from './GalleryHeroSection';
import GalleryFilters from './GalleryFilters';
import GalleryArtworksGrid from './GalleryArtworksGrid';
import GalleryCallToAction from './GalleryCallToAction';
import Footer from '../Footer';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <GalleryNavigation />
      
      <GalleryHeroSection />
      
      <GalleryFilters onFiltersChange={handleFiltersChange} />
      
      <GalleryArtworksGrid filters={filters} />

      <GalleryCallToAction />
      
      <Footer />
    </div>
  );
};

export default Gallery;
