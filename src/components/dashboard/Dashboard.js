import React, { useState, useEffect } from 'react';
import DashboardNavigation from './DashboardNavigation';
import WelcomeBanner from './WelcomeBanner';
import ArtistProfileOverview from './ArtistProfileOverview';
import MyArtworksSection from './MyArtworksSection';
import ExportComplianceCard from './ExportComplianceCard';
import DashboardFooter from './DashboardFooter';

const Dashboard = () => {
  const [artistData, setArtistData] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // TODO: Replace with Firebase/backend API call
        // Load current logged-in artist data from database
        
        // For now, set empty data - to be replaced with real data from Firebase
        setArtistData(null);
        setArtworks([]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleArtistUpdate = (updatedArtist) => {
    setArtistData(updatedArtist);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-amber-900 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <DashboardNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner artistData={artistData} />

        <ArtistProfileOverview artistData={artistData} />

        <ExportComplianceCard artistData={artistData} />

        <MyArtworksSection
          artworks={artworks}
          artistData={artistData}
          onArtistUpdate={handleArtistUpdate}
        />
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
