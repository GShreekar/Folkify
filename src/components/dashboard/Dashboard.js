import React, {useState, useEffect} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardNavigation from './DashboardNavigation';
import WelcomeBanner from './WelcomeBanner';
import ArtistProfileOverview from './ArtistProfileOverview';
import MyArtworksSection from './MyArtworksSection';
import ExportComplianceCard from './ExportComplianceCard';
import SalesDashboard from './SalesDashboard';
import DashboardFooter from './DashboardFooter';
import '../FolkArtAnimations.css';

const Dashboard = () => {
  const { currentUser, userData } = useAuth();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  if (loading) {
    return (
      <div className="min-h-screen folk-art-background flex items-center justify-center">
        {/* Mandala Patterns */}
        <div className="mandala-pattern mandala-1"></div>
        <div className="mandala-pattern mandala-2"></div>
        
        {/* Warli Art Figures */}
        <div className="warli-figure warli-1">
          <div className="warli-arms"></div>
          <div className="warli-legs"></div>
        </div>
        <div className="warli-figure warli-2">
          <div className="warli-arms"></div>
          <div className="warli-legs"></div>
        </div>
        
        <div className="relative z-10 text-amber-900 text-xl">Loading dashboard...</div>
      </div>
    );
  }

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
      
      <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WelcomeBanner />

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-amber-200 mb-6 sm:mb-8">
          <div className="border-b border-amber-200">
            <nav className="flex overflow-x-auto px-4 sm:px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap mr-6 sm:mr-8 ${
                  activeTab === 'overview'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('artworks')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap mr-6 sm:mr-8 ${
                  activeTab === 'artworks'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Artworks
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap mr-6 sm:mr-8 ${
                  activeTab === 'sales'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                  activeTab === 'compliance'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Compliance
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                <ArtistProfileOverview />
              </div>
            )}

            {activeTab === 'artworks' && (
              <MyArtworksSection
                artworks={artworks}
                artistData={userData}
              />
            )}

            {activeTab === 'sales' && (
              <SalesDashboard />
            )}

            {activeTab === 'compliance' && (
              <ExportComplianceCard artistData={userData} />
            )}
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
