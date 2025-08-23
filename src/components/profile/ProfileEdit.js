import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ART_FORMS } from '../../constants/artForms';

const ProfileEdit = ({ onClose, onSuccess }) => {
  const { userData, updateProfile, profileLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    primaryArtForm: '',
    village: '',
    bio: '',
    yearsOfExperience: '',
    specialization: '',
    awardsAndRecognition: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      website: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        primaryArtForm: userData.primaryArtForm || '',
        village: userData.village || '',
        bio: userData.bio || '',
        yearsOfExperience: userData.yearsOfExperience || '',
        specialization: userData.specialization || '',
        awardsAndRecognition: userData.awardsAndRecognition || '',
        socialMedia: {
          instagram: userData.socialMedia?.instagram || '',
          facebook: userData.socialMedia?.facebook || '',
          website: userData.socialMedia?.website || ''
        }
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.primaryArtForm) {
      newErrors.primaryArtForm = 'Primary art form is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while updating your profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            <span className="text-amber-800">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.fullName ? 'border-red-400' : 'border-amber-300'
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phoneNumber ? 'border-red-400' : 'border-amber-300'
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Primary Art Form *
              </label>
              <select
                name="primaryArtForm"
                value={formData.primaryArtForm}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.primaryArtForm ? 'border-red-400' : 'border-amber-300'
                } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
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
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Village/Region
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Your village or region"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Professional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Years of experience in art"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="e.g., Traditional motifs, Contemporary fusion, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="Tell us about your artistic background and journey..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Awards and Recognition
              </label>
              <textarea
                name="awardsAndRecognition"
                value={formData.awardsAndRecognition}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                placeholder="List any awards, exhibitions, or recognition received..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-800">Social Media & Online Presence</h3>
            
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Instagram Profile
              </label>
              <input
                type="url"
                name="socialMedia.instagram"
                value={formData.socialMedia.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="https://instagram.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Facebook Profile
              </label>
              <input
                type="url"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="https://facebook.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Website/Portfolio
              </label>
              <input
                type="url"
                name="socialMedia.website"
                value={formData.socialMedia.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700 transform hover:scale-105'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
