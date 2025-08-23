import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getArtistSales, updatePurchaseStatus } from '../../services/purchaseService';
import LoadingSpinner from '../LoadingSpinner';

const SalesDashboard = () => {
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const result = await getArtistSales(currentUser.uid);
        if (result.success) {
          setSales(result.sales);
        } else {
          setError(result.error || 'Failed to load sales data');
        }
      } catch (err) {
        setError('An error occurred while loading your sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [currentUser]);

  const handleStatusUpdate = async (purchaseId, newStatus, paymentStatus = null) => {
    setUpdatingStatus(purchaseId);
    
    try {
      const result = await updatePurchaseStatus(purchaseId, newStatus, paymentStatus);
      if (result.success) {
        // Update local state
        setSales(prevSales => 
          prevSales.map(sale => 
            sale.id === purchaseId 
              ? { 
                  ...sale, 
                  status: newStatus,
                  ...(paymentStatus && { paymentStatus })
                }
              : sale
          )
        );
      } else {
        setError('Failed to update status. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the status');
    } finally {
      setUpdatingStatus('');
    }
  };

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

  const getTotalRevenue = () => {
    return sales
      .filter(sale => sale.paymentStatus === 'paid')
      .reduce((total, sale) => total + (sale.artworkPrice || 0), 0);
  };

  const getPendingRevenue = () => {
    return sales
      .filter(sale => sale.paymentStatus === 'pending' && sale.status !== 'cancelled')
      .reduce((total, sale) => total + (sale.artworkPrice || 0), 0);
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
        <p className="text-gray-600">You need to be logged in to view your sales dashboard.</p>
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Sales Dashboard</h2>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">{sales.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Revenue Earned</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(getTotalRevenue())}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Revenue</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {formatPrice(getPendingRevenue())}
          </p>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Sales Yet</h2>
          <p className="text-gray-600">When customers purchase your artworks, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => (
            <div key={sale.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {sale.artworkTitle}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sale ID: {sale.id}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Date: {formatDate(sale.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    {formatPrice(sale.artworkPrice, sale.artworkCurrency)}
                  </div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(sale.status)}`}>
                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Buyer Information</h4>
                  <p className="text-gray-600 text-sm">
                    {sale.buyerName}
                    <span className="block">{sale.buyerEmail}</span>
                    {sale.buyerPhone && (
                      <span className="block">{sale.buyerPhone}</span>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Shipping Address</h4>
                  <p className="text-gray-600 text-sm">{sale.buyerAddress}</p>
                </div>
              </div>

              {sale.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Buyer Notes</h4>
                  <p className="text-gray-600 text-sm">{sale.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Payment Status: {' '}
                  <span className={`font-medium ${
                    sale.paymentStatus === 'paid' ? 'text-green-600' : 
                    sale.paymentStatus === 'refunded' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {sale.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(sale.id, 'confirmed')}
                        disabled={updatingStatus === sale.id}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {updatingStatus === sale.id ? 'Updating...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(sale.id, 'cancelled')}
                        disabled={updatingStatus === sale.id}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {sale.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(sale.id, 'shipped')}
                      disabled={updatingStatus === sale.id}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {updatingStatus === sale.id ? 'Updating...' : 'Mark Shipped'}
                    </button>
                  )}
                  
                  {sale.status === 'shipped' && (
                    <button
                      onClick={() => handleStatusUpdate(sale.id, 'delivered')}
                      disabled={updatingStatus === sale.id}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingStatus === sale.id ? 'Updating...' : 'Mark Delivered'}
                    </button>
                  )}

                  {sale.paymentStatus === 'pending' && sale.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusUpdate(sale.id, sale.status, 'paid')}
                      disabled={updatingStatus === sale.id}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
