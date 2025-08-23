import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPurchases } from '../services/purchaseService';
import LoadingSpinner from './LoadingSpinner';
import Navigation from './Navigation';
import Footer from './Footer';

const PurchaseHistory = () => {
  const { currentUser } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const result = await getUserPurchases(currentUser.uid);
        if (result.success) {
          setPurchases(result.purchases);
        } else {
          setError(result.error || 'Failed to load purchase history');
        }
      } catch (err) {
        setError('An error occurred while loading your purchase history');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [currentUser]);

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Price on request';
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h2>
        <p className="text-gray-600">You need to be logged in to view your purchase history.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Purchases Yet</h2>
        <p className="text-gray-600">You haven't made any purchases yet. Start exploring artworks to find something you love!</p>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
            
            <div className="space-y-4">
              {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {purchase.artworkTitle}
                </h3>
                <p className="text-gray-600 text-sm">
                  Purchase ID: {purchase.id}
                </p>
                <p className="text-gray-600 text-sm">
                  Date: {formatDate(purchase.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900 mb-2">
                  {formatPrice(purchase.artworkPrice, purchase.artworkCurrency)}
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(purchase.status)}`}>
                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Shipping Address</h4>
                <p className="text-gray-600 text-sm">{purchase.buyerAddress}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Contact</h4>
                <p className="text-gray-600 text-sm">
                  {purchase.buyerEmail}
                  {purchase.buyerPhone && (
                    <span className="block">{purchase.buyerPhone}</span>
                  )}
                </p>
              </div>
            </div>

            {purchase.notes && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                <p className="text-gray-600 text-sm">{purchase.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Payment Status: {' '}
                <span className={`font-medium ${
                  purchase.paymentStatus === 'paid' ? 'text-green-600' : 
                  purchase.paymentStatus === 'refunded' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {purchase.paymentStatus.charAt(0).toUpperCase() + purchase.paymentStatus.slice(1)}
                </span>
              </div>
              
              {purchase.status === 'pending' && (
                <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Contact Artist
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PurchaseHistory;
