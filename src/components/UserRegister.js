import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerBuyerUser } from '../firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import './FolkArtAnimations.css';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  // Handle redirect after authentication state is updated
  useEffect(() => {
    if (shouldRedirect && currentUser && userData && userData.role === 'buyer') {
      // All conditions met: user is registered, logged in, and userData is loaded
      navigate('/');
      setShouldRedirect(false);
    } else if (shouldRedirect && currentUser) {
      // Fallback: if userData is taking too long, redirect after 5 seconds
      const timer = setTimeout(() => {
        console.warn('UserData not loaded after 5 seconds, redirecting anyway');
        navigate('/');
        setShouldRedirect(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentUser, userData, shouldRedirect, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await registerBuyerUser(formData.email, formData.password, {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      });

      if (result.success) {
        // Set flag to redirect once AuthContext updates with userData
        setShouldRedirect(true);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen folk-art-background flex items-center justify-center px-4 py-12">
      {/* Decorative Elements */}
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="warli-figure warli-1">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="warli-figure warli-2">
        <div className="warli-arms"></div>
        <div className="warli-legs"></div>
      </div>
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-200 relative z-10">
        <div className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="folkify-title text-4xl font-bold text-amber-800 hover:text-red-600 transition-colors duration-300">
              Folkify
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-amber-800">Create Your Account</h2>
            <p className="text-amber-600 mt-2">Join Folkify to discover and buy authentic folk art</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-amber-800 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.fullName ? 'border-red-300' : 'border-amber-200 focus:border-amber-500'
                }`}
                placeholder="Enter your full name"
                required
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-amber-200 focus:border-amber-500'
                }`}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-amber-800 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.phoneNumber ? 'border-red-300' : 'border-amber-200 focus:border-amber-500'
                }`}
                placeholder="Enter your phone number"
                required
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-amber-800 mb-2">
                Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter your address for artwork delivery"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.password ? 'border-red-300' : 'border-amber-200 focus:border-amber-500'
                }`}
                placeholder="Create a password"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-800 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-amber-200 focus:border-amber-500'
                }`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="text-center">
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || shouldRedirect}
              className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-amber-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Creating Account...' : shouldRedirect ? 'Logging in...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-amber-600">
              Already have an account?{' '}
              <Link to="/user-login" className="font-medium text-amber-800 hover:text-red-600 transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>

          {/* Artist Link */}
          <div className="mt-4 text-center">
            <p className="text-amber-600 text-sm">
              Are you an artist?{' '}
              <Link to="/register" className="font-medium text-amber-800 hover:text-red-600 transition-colors duration-200">
                Register as Artist
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
