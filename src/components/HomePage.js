import React from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturedArtworks from './FeaturedArtworks';
import MeetTheArtists from './MeetTheArtists';
import WhyFolkify from './WhyFolkify';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedArtworks />
      <MeetTheArtists />
      <WhyFolkify />
      <Footer />
    </div>
  );
};

export default HomePage;
