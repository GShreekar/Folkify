import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPurchases } from '../services/purchaseService';
import Navigation from './Navigation';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

const MyPurchases = () => {
  const { currentUser } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPurchases = async () => {
      if (!currentUser) return;
      
      try {
        const result = await getUserPurchases(currentUser.uid);
        if (result.success) {
          setPurchases(result.purchases);
        } else {
          setError(result.error || 'Failed to load purchases');
        }
      } catch (err) {
        console.error('Error loading purchases:', err);
        setError('An error occurred while loading your purchases');
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [currentUser]);

  const formatPrice = (price, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
          <p className="text-gray-600">View all your artwork purchases and orders</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
            <p className="text-gray-600 mb-6">You haven't purchased any artworks yet.</p>
            <a
              href="/gallery"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Browse Gallery
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase, index) => (
              <div key={purchase.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {purchase.artwork?.imageUrl && (
                          <img
                            src={purchase.artwork.imageUrl}
                            alt={purchase.artwork.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {purchase.artwork?.title || 'Artwork Title'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            by {purchase.artwork?.artistName || 'Unknown Artist'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Art Form: {purchase.artwork?.artForm || 'N/A'}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(purchase.artwork?.price || 0, purchase.artwork?.currency)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              purchase.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : purchase.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {(purchase.status || 'pending').charAt(0).toUpperCase() + (purchase.status || 'pending').slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6 lg:flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Purchase Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(purchase.purchaseDate || purchase.createdAt)}
                        </p>
                        {purchase.orderId && (
                          <p className="text-xs text-gray-500 mt-1">
                            Order #{purchase.orderId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {purchase.buyerInfo && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Delivery Address:</p>
                          <p className="font-medium text-gray-900">{purchase.buyerInfo.address}</p>
                        </div>
                        {purchase.buyerInfo.notes && (
                          <div>
                            <p className="text-gray-600">Notes:</p>
                            <p className="font-medium text-gray-900">{purchase.buyerInfo.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPurchases;
