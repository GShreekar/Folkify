import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Registration attempt:', formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0522d' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm-10 10c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-amber-200/50 my-8">
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
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Enter your full name"
              required
            />
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
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Enter your email address"
              required
            />
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
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Enter Aadhar or PAN number"
              required
            />
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
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-amber-600/50"
              placeholder="Enter your phone number"
              required
            />
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
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70"
              required
            >
              <option value="">Select your primary art form</option>
              <option value="warli">Warli</option>
              <option value="madhubani">Madhubani</option>
              <option value="pithora">Pithora</option>
              <option value="gond">Gond</option>
              <option value="kalamkari">Kalamkari</option>
              <option value="tanjore">Tanjore</option>
              <option value="patachitra">Patachitra</option>
              <option value="miniature">Miniature Painting</option>
              <option value="other">Other</option>
            </select>
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Create Account
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

        <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-red-400 rounded-full opacity-20"></div>
        <div className="absolute top-4 right-4 w-6 h-6 bg-orange-400 rounded-full opacity-15"></div>
      </div>
    </div>
  );
};

export default Register;
