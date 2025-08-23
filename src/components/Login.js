import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getCurrentUserData } from '../firebase/auth';
import './FolkArtAnimations.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
        // Get user data to check role
        const userDataResult = await getCurrentUserData(result.user.uid);
        
        if (userDataResult.success) {
          const userRole = userDataResult.userData.role;
          
          // Redirect based on role
          if (userRole === 'artist') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } else {
          navigate('/dashboard');
        }
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
    <div className="min-h-screen folk-art-background flex items-center justify-center p-4">
      {/* Mandala Patterns */}
      <div className="mandala-pattern mandala-1"></div>
      <div className="mandala-pattern mandala-2"></div>
      <div className="mandala-pattern mandala-3"></div>
      
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
      
      {/* Geometric Patterns */}
      <div className="geometric-pattern geo-1"></div>
      <div className="geometric-pattern geo-2"></div>

      <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-amber-200/50 folk-content-overlay">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold folkify-title mb-2">
            Folkify
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700 transform hover:scale-105'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-amber-700">
            New here?{' '}
            <Link 
              to="/register" 
              className="text-red-600 hover:text-red-700 font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
            >
              Register as an Artist
            </Link>
          </p>
          <p className="text-amber-700">
            Want to buy art?{' '}
            <Link 
              to="/user-register" 
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
            >
              Register as User
            </Link>
          </p>
        </div>

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-red-400 rounded-full opacity-20"></div>
      </div>
    </div>
  );
};

export default Login;
