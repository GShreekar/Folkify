import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import './FolkArtAnimations.css';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(null);
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  // Handle redirect after authentication state is updated
  useEffect(() => {
    if (shouldRedirect && currentUser && userData) {
      const userRole = userData.role;
      
      // Redirect based on role
      if (userRole === 'artist') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      setShouldRedirect(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await loginUser(formData.email, formData.password);
      
      if (result.success) {
        // Set flag to redirect once AuthContext updates
        setShouldRedirect(true);
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
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
            <h2 className="mt-4 text-2xl font-bold text-amber-800">Welcome Back</h2>
            <p className="text-amber-600 mt-2">Sign in to your account to discover folk art</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter your password"
                required
              />
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
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-amber-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-amber-600">
              Don't have an account?{' '}
              <Link to="/user-register" className="font-medium text-amber-800 hover:text-red-600 transition-colors duration-200">
                Create account
              </Link>
            </p>
          </div>

          {/* Artist Link */}
          <div className="mt-4 text-center">
            <p className="text-amber-600 text-sm">
              Are you an artist?{' '}
              <Link to="/login" className="font-medium text-amber-800 hover:text-red-600 transition-colors duration-200">
                Artist Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
