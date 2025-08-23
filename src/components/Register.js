import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../firebase/auth';
import { ART_FORMS } from '../constants/artForms';
import './FolkArtAnimations.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    governmentId: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    primaryArtForm: '',
    village: '',
    bio: ''
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

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const requiredFields = ['fullName', 'email', 'governmentId', 'phoneNumber', 'primaryArtForm'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await registerUser(formData.email, formData.password, {
        fullName: formData.fullName,
        governmentId: formData.governmentId,
        phoneNumber: formData.phoneNumber,
        primaryArtForm: formData.primaryArtForm,
        village: formData.village,
        bio: formData.bio
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Registration error:', error);
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

      <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-amber-200/50 my-8 folk-content-overlay">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold folkify-title mb-2">
            Folkify
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-red-600 mx-auto rounded-full mb-4"></div>
          <h2 className="text-2xl font-semibold text-amber-800 mb-2">
            Register as an Artist
          </h2>
          <p className="text-amber-700 text-sm">
            Join Folkify to showcase your art to the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Enter your full name"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Enter your email address"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="governmentId" className="block text-sm font-medium text-amber-800 mb-2">
              Government ID (Aadhar / PAN) *
            </label>
            <input
              type="text"
              id="governmentId"
              name="governmentId"
              value={formData.governmentId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.governmentId ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Enter Aadhar or PAN number"
              required
            />
            {errors.governmentId && (
              <p className="text-red-500 text-xs mt-1">{errors.governmentId}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 rounded-xl border ${errors.phoneNumber ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Enter your phone number"
              required
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Create a password"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

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
              className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50`}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="primaryArtForm" className="block text-sm font-medium text-amber-800 mb-2">
              Primary Art Form *
            </label>
            <select
              id="primaryArtForm"
              name="primaryArtForm"
              value={formData.primaryArtForm}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.primaryArtForm ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70`}
              required
            >
              {ART_FORMS.map(form => (
                <option key={form.value} value={form.value} disabled={form.disabled}>
                  {form.label}
                </option>
              ))}
            </select>
            {errors.primaryArtForm && (
              <p className="text-red-500 text-xs mt-1">{errors.primaryArtForm}</p>
            )}
          </div>

          <div>
            <label htmlFor="village" className="block text-sm font-medium text-amber-800 mb-2">
              Village/Region
            </label>
            <input
              type="text"
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Your village or region (optional)"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-amber-800 mb-2">
              Short Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50 resize-none"
              placeholder="Tell us about your artistic background (optional)"
            />
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-amber-700">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-red-600 hover:text-red-700 font-semibold underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* User Registration Link */}
        <div className="mt-4 text-center">
          <p className="text-amber-600 text-sm">
            Looking to buy folk art?{' '}
            <Link to="/user-register" className="font-medium text-amber-800 hover:text-red-600 transition-colors duration-200">
              Register as User
            </Link>
          </p>
        </div>

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-red-400 rounded-full opacity-20"></div>
        <div className="absolute top-4 right-4 w-6 h-6 bg-orange-400 rounded-full opacity-15"></div>
      </div>
    </div>
  );
};

export default Register;
