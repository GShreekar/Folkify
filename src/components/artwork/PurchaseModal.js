import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createPurchase } from '../../services/purchaseService';
import { isUserAuthenticated, isUserDataLoading } from '../../utils/authUtils';

const PurchaseModal = ({ artwork, onClose, onSuccess }) => {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    // Initialize form data with user information
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.fullName || userData.displayName || userData.name || '',
        phone: userData.phoneNumber || ''
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isUserAuthenticated(currentUser, userData)) {
      if (isUserDataLoading(currentUser, userData)) {
        setError('Loading user information...');
      } else {
        setError('Please log in to make a purchase');
      }
      return;
    }

    setLoading(true);
    setError('');

    const buyerData = {
      userId: currentUser.uid,
      name: formData.name,
      email: userData.email || currentUser.email,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes
    };

    const result = await createPurchase(artwork.id, buyerData, artwork);

    if (result.success) {
      onSuccess && onSuccess(result.purchaseId);
      onClose();
    } else {
      setError(result.error || 'Failed to create purchase. Please try again.');
    }

    setLoading(false);
  };

  const formatPrice = (price, currency = 'INR') => {
    if (!price) return 'Price on request';
    return `₹${price.toLocaleString()}`;
  };

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-green-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-800">Purchase Artwork</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-green-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Artwork Summary */}
          <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-200">
            <div className="flex items-start space-x-4">
              {artwork.imageUrl && (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">{artwork.title}</h3>
                <p className="text-green-700 mb-2">{artwork.artForm}</p>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(artwork.price, artwork.currency)}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          {!currentUser ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.73 0 2.813-1.874 2.37-3.504L13.949 3.378c-.442-1.63-2.296-1.63-2.738 0L2.852 17.496C2.409 19.126 3.492 21 5.222 21z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
              <p className="text-amber-700 mb-4">Please log in to your account to purchase this artwork.</p>
              <div className="flex gap-3 justify-center">
                <a 
                  href="/user-login" 
                  className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Login
                </a>
                <a 
                  href="/user-register" 
                  className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  Register
                </a>
              </div>
            </div>
          ) : isUserDataLoading(currentUser, userData) ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Loading User Information</h3>
              <p className="text-blue-700">Please wait while we load your account details...</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Buyer Info (Pre-filled) */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Buyer Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData?.email || currentUser?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your complete address for artwork delivery"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Any special requests or notes for the artist"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.73 0 2.813-1.874 2.37-3.504L13.949 3.378c-.442-1.63-2.296-1.63-2.738 0L2.852 17.496C2.409 19.126 3.492 21 5.222 21z" />
                </svg>
                <div>
                  <h5 className="text-amber-800 font-medium mb-1">Important Notice</h5>
                  <p className="text-amber-700 text-sm">
                    This is a demo purchase. The artist will be notified of your interest. 
                    Payment and shipping arrangements will be handled directly between you and the artist.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
