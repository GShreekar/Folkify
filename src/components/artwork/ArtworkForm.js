import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createArtwork, updateArtwork, getArtistVerificationProgress } from '../../services/artworkService';
import { ART_FORMS } from '../../constants/artForms';
import BadgeNotification from '../BadgeNotification';
import '../FolkArtAnimations.css';

const ArtworkForm = ({ 
  isOpen, 
  onClose, 
  artwork = null, 
  onSuccess 
}) => {
  const { currentUser, refreshUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: artwork?.title || '',
    description: artwork?.description || '',
    artForm: artwork?.artForm || '',
    price: artwork?.price || '',
    currency: artwork?.currency || 'INR',
    dimensions: artwork?.dimensions || '',
    materials: artwork?.materials || '',
    yearCreated: artwork?.yearCreated || new Date().getFullYear(),
    tags: artwork?.tags?.join(', ') || '',
    isForSale: artwork?.isForSale !== undefined ? artwork?.isForSale : true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(artwork?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [badgeNotification, setBadgeNotification] = useState(null);

  const isEditing = !!artwork;

  // Scroll to form when it opens
  useEffect(() => {
    if (isOpen && formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 10MB'
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any existing image error
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.artForm) {
      newErrors.artForm = 'Art form is required';
    }

    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Please enter a valid price';
    }

    if (formData.yearCreated && (formData.yearCreated < 1800 || formData.yearCreated > new Date().getFullYear())) {
      newErrors.yearCreated = 'Please enter a valid year';
    }

    // Image is required for new artworks
    if (!isEditing && !imageFile) {
      newErrors.image = 'Please select an image for your artwork';
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
      // Prepare tags array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const artworkData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        artForm: formData.artForm,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        dimensions: formData.dimensions.trim(),
        materials: formData.materials.trim(),
        yearCreated: parseInt(formData.yearCreated) || new Date().getFullYear(),
        tags: tags,
        isForSale: formData.isForSale
      };

      let result;
      
      if (isEditing) {
        // Update existing artwork
        result = await updateArtwork(artwork.id, artworkData, imageFile);
      } else {
        // Create new artwork
        result = await createArtwork(currentUser.uid, artworkData, imageFile);
      }

      if (result.success) {
        // Check if artist was just verified
        if (!isEditing) {
          const progressResult = await getArtistVerificationProgress(currentUser.uid);
          if (progressResult.success) {
            const { progress } = progressResult;
            
            if (progress.isVerified && progress.current === 3) {
              // Artist just became verified with this upload
              setBadgeNotification({
                type: 'success',
                title: '🎉 Congratulations!',
                message: 'You are now a Verified Artist! Your profile will show the verified badge.',
                duration: 8000
              });
            } else if (progress.remaining > 0) {
              // Show progress notification
              setBadgeNotification({
                type: 'info',
                title: 'Keep Going!',
                message: `Upload ${progress.remaining} more artwork${progress.remaining !== 1 ? 's' : ''} to become a Verified Artist.`,
                duration: 4000
              });
            }
          }
        }
        
        await refreshUserProfile();
        onSuccess?.();
        
        // Close form after showing notification or immediately
        if (badgeNotification?.duration) {
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          onClose();
        }
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Error saving artwork:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl border-2 border-amber-200/50 mb-8 overflow-hidden max-w-5xl mx-auto">
      {/* Folk Art Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {/* Mandala Patterns */}
        <div className="mandala-pattern mandala-1" style={{ top: '-10%', left: '-10%', width: '150px', height: '150px' }}></div>
        <div className="mandala-pattern mandala-2" style={{ top: '20%', right: '-5%', width: '120px', height: '120px' }}></div>
        
        {/* Warli Art Figures */}
        <div className="warli-figure warli-1" style={{ bottom: '10%', left: '5%', width: '80px', height: '80px' }}>
          <div className="warli-arms"></div>
          <div className="warli-legs"></div>
        </div>
        
        {/* Geometric Patterns */}
        <div className="geometric-pattern geo-1" style={{ top: '50%', left: '2%', width: '60px', height: '60px' }}></div>
        <div className="geometric-pattern geo-2" style={{ bottom: '30%', right: '3%', width: '70px', height: '70px' }}></div>
      </div>

      {/* Header Section with Folk Art Border */}
      <div className="relative z-10 bg-gradient-to-r from-amber-600 to-red-600 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-shadow-lg">
              {isEditing ? '✏️ Edit Your Artwork' : '🎨 Share Your Art with the World'}
            </h2>
            <p className="text-amber-100 text-lg">
              {isEditing ? 'Update your masterpiece' : 'Upload your creation and connect with art lovers'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-full transition-all duration-200 group"
          >
            <svg className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Decorative Wave Border */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 to-orange-400">
          <div className="w-full h-full bg-white" style={{ 
            clipPath: 'polygon(0 50%, 10% 0%, 20% 50%, 30% 0%, 40% 50%, 50% 0%, 60% 50%, 70% 0%, 80% 50%, 90% 0%, 100% 50%, 100% 100%, 0% 100%)'
          }}></div>
        </div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Display with Enhanced Styling */}
          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl shadow-md">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Image Upload Section with Enhanced Design */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-amber-800 mb-2 flex items-center justify-center">
                <span className="mr-2">📸</span>
                Artwork Image {!isEditing && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <p className="text-amber-600">Upload a high-quality image of your artwork</p>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              {imagePreview ? (
                <div className="relative group">
                  <div className="p-2 bg-gradient-to-br from-amber-400 to-red-500 rounded-3xl">
                    <img
                      src={imagePreview}
                      alt="Artwork preview"
                      className="w-80 h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(artwork?.imageUrl || null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Image Info Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Preview
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative w-80 h-80 border-3 border-dashed border-amber-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-300 bg-gradient-to-br from-amber-50/30 to-orange-50/30"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-amber-800 mb-2">Upload Your Artwork</h4>
                    <p className="text-amber-600 font-medium mb-1">Click to browse or drag & drop</p>
                    <p className="text-amber-500 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                  
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-3 border-t-3 border-amber-400 opacity-50"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-3 border-t-3 border-amber-400 opacity-50"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-3 border-b-3 border-amber-400 opacity-50"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-3 border-b-3 border-amber-400 opacity-50"></div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-4 text-center font-medium">{errors.image}</p>}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title Field */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md">
                <label htmlFor="title" className="block text-lg font-bold text-amber-800 mb-3">
                  <span className="mr-2">🎯</span>
                  Artwork Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                  placeholder="Give your artwork a captivating title..."
                />
                {errors.title && <p className="text-red-500 text-sm mt-2 font-medium">{errors.title}</p>}
              </div>

              {/* Art Form Field */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md">
                <label htmlFor="artForm" className="block text-lg font-bold text-amber-800 mb-3">
                  <span className="mr-2">🎨</span>
                  Art Form <span className="text-red-500">*</span>
                </label>
                <select
                  id="artForm"
                  name="artForm"
                  value={formData.artForm}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                >
                  <option value="" className="text-amber-600">Choose your art form...</option>
                  {ART_FORMS.map((form) => (
                    <option key={form.id} value={form.id} className="text-amber-800">
                      {form.name}
                    </option>
                  ))}
                </select>
                {errors.artForm && <p className="text-red-500 text-sm mt-2 font-medium">{errors.artForm}</p>}
              </div>

              {/* Price and Currency */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md">
                <label className="block text-lg font-bold text-amber-800 mb-3">
                  <span className="mr-2">💰</span>
                  Pricing (Optional)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-2 font-medium">{errors.price}</p>}
              </div>

              {/* Dimensions and Materials */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md space-y-4">
                <div>
                  <label htmlFor="dimensions" className="block text-lg font-bold text-amber-800 mb-3">
                    <span className="mr-2">📏</span>
                    Dimensions
                  </label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                    placeholder="e.g., 30cm x 40cm"
                  />
                </div>
                <div>
                  <label htmlFor="materials" className="block text-lg font-bold text-amber-800 mb-3">
                    <span className="mr-2">🖌️</span>
                    Materials Used
                  </label>
                  <input
                    type="text"
                    id="materials"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                    placeholder="e.g., Acrylic on canvas, Oil pastels"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description Field */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md">
                <label htmlFor="description" className="block text-lg font-bold text-amber-800 mb-3">
                  <span className="mr-2">📝</span>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium resize-none transition-all duration-200"
                  placeholder="Tell the story behind your artwork... What inspired you? What techniques did you use? What emotions does it convey?"
                />
                {errors.description && <p className="text-red-500 text-sm mt-2 font-medium">{errors.description}</p>}
              </div>

              {/* Year and Tags */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md space-y-4">
                <div>
                  <label htmlFor="yearCreated" className="block text-lg font-bold text-amber-800 mb-3">
                    <span className="mr-2">📅</span>
                    Year Created
                  </label>
                  <input
                    type="number"
                    id="yearCreated"
                    name="yearCreated"
                    value={formData.yearCreated}
                    onChange={handleChange}
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                  />
                  {errors.yearCreated && <p className="text-red-500 text-sm mt-2 font-medium">{errors.yearCreated}</p>}
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-lg font-bold text-amber-800 mb-3">
                    <span className="mr-2">🏷️</span>
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-amber-200 rounded-xl focus:ring-3 focus:ring-amber-500/30 focus:border-amber-500 bg-amber-50/50 text-lg font-medium transition-all duration-200"
                    placeholder="traditional, colorful, geometric, modern..."
                  />
                  <p className="text-amber-600 text-sm mt-2 italic">Separate multiple tags with commas</p>
                </div>
              </div>

              {/* For Sale Toggle */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-amber-200/50 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-amber-800 mb-1">
                      <span className="mr-2">💎</span>
                      Available for Sale
                    </h4>
                    <p className="text-amber-600">Let potential buyers know this artwork is available</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isForSale"
                      name="isForSale"
                      checked={formData.isForSale}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-amber-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons with Enhanced Styling */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-amber-200/50 shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="group flex-1 max-w-xs px-8 py-4 border-2 border-amber-300 text-amber-700 rounded-xl font-bold text-lg hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <span className="mr-2 group-hover:scale-110 transition-transform duration-200">❌</span>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex-1 max-w-xs bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <span className="mr-2 group-hover:scale-110 transition-transform duration-200">
                  {isSubmitting ? '⏳' : (isEditing ? '✏️' : '🚀')}
                </span>
                {isSubmitting 
                  ? (isEditing ? 'Updating Your Art...' : 'Sharing Your Art...')
                  : (isEditing ? 'Update Artwork' : 'Share with the World')
                }
              </button>
            </div>
          </div>
        </form>
      </div>

      {badgeNotification && (
        <BadgeNotification
          notification={badgeNotification}
          onClose={() => setBadgeNotification(null)}
        />
      )}
    </div>
  );
};

export default ArtworkForm;
