import React from 'react';
import DashboardNavigation from './DashboardNavigation';
import WelcomeBanner from './WelcomeBanner';
import ArtistProfileOverview from './ArtistProfileOverview';
import MyArtworksSection from './MyArtworksSection';
import DashboardFooter from './DashboardFooter';

const Dashboard = () => {
  // All data will be fetched from database later
  const artistData = null; // Will be fetched from API
  const artworks = []; // Will be fetched from API

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <DashboardNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner artistData={artistData} />

        <ArtistProfileOverview artistData={artistData} />

        <MyArtworksSection artworks={artworks} />
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
