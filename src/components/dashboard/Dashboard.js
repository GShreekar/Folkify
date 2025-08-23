import React, {useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardNavigation from './DashboardNavigation';
import WelcomeBanner from './WelcomeBanner';
import ArtistProfileOverview from './ArtistProfileOverview';
import MyArtworksSection from './MyArtworksSection';
import ExportComplianceCard from './ExportComplianceCard';
import DashboardFooter from './DashboardFooter';

const Dashboard = () => {
  const { currentUser, userData } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load artworks for the current user
        // TODO: Implement artwork fetching from Firestore
        setArtworks([]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && userData) {
      loadDashboardData();
    }
  }, [currentUser, userData]);

  const handleArtistUpdate = (updatedArtist) => {
    console.log('Artist updated:', updatedArtist);
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
                <WelcomeBanner />

        <ArtistProfileOverview />

        <ExportComplianceCard artistData={userData} />

          <MyArtworksSection
            artworks={artworks}
            artistData={userData}
          />
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
