import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createArtwork, updateArtwork, getArtistVerificationProgress } from '../../services/artworkService';
import { ART_FORMS } from '../../constants/artForms';
import BadgeNotification from '../BadgeNotification';
import '../FolkArtAnimations.css';

const ArtworkManagement = ({ 
  isOpen, 
  onClose, 
  artwork = null, 
  onSuccess 
}) => {
  const { currentUser, refreshUserProfile } = useAuth();
  const fileInputRef = useRef(null);
  
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

  if (!isOpen) return null;

  console.log('ArtworkManagement rendering - ID:', Math.random().toString(36).substr(2, 9));

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
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, or WebP)'
        }));
        return;
      }

      // Validate file size (10MB max for Cloudinary)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 10MB'
        }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        
        // Close modal after showing notification or immediately
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
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={onClose}
    >
        /* ARTWORK MANAGEMENT MODAL */
        <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '30px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>

        {/* Header */}
        <h2 style={{ marginTop: 0, marginBottom: '30px', color: '#92400e', fontSize: '28px', fontWeight: 'bold' }}>
          {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Error Display */}
          {errors.submit && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              border: '1px solid #fecaca', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {errors.submit}
            </div>
          )}

          {/* Image Upload */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#92400e' }}>
              Artwork Image {!isEditing && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            
            {imagePreview ? (
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      width: '200px', 
                      height: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '15px',
                      border: '3px solid #f59e0b'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(artwork?.imageUrl || null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #f59e0b',
                  borderRadius: '15px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#fffbeb',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#fef3c7'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#fffbeb'}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📸</div>
                <div style={{ color: '#92400e', fontWeight: '600', marginBottom: '5px' }}>
                  Click to upload image
                </div>
                <div style={{ color: '#d97706', fontSize: '14px' }}>
                  PNG, JPG up to 10MB
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {errors.image && <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '5px' }}>{errors.image}</div>}
          </div>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
              Title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter artwork title"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #fbbf24',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: '#fffbeb',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#fbbf24'}
            />
            {errors.title && <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '5px' }}>{errors.title}</div>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
              Description <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your artwork..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #fbbf24',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: '#fffbeb',
                outline: 'none',
                resize: 'vertical',
                minHeight: '100px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#fbbf24'}
            />
            {errors.description && <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '5px' }}>{errors.description}</div>}
          </div>

          {/* Art Form */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
              Art Form <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              name="artForm"
              value={formData.artForm}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #fbbf24',
                borderRadius: '10px',
                fontSize: '16px',
                backgroundColor: '#fffbeb',
                outline: 'none'
              }}
            >
              <option value="">Select an art form</option>
              {ART_FORMS.map((form) => (
                <option key={form.id} value={form.id}>
                  {form.name}
                </option>
              ))}
            </select>
            {errors.artForm && <div style={{ color: '#dc2626', fontSize: '14px', marginTop: '5px' }}>{errors.artForm}</div>}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '2px solid #fbbf24',
                borderRadius: '10px',
                backgroundColor: 'white',
                color: '#92400e',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #dc2626)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Creating...')
                : (isEditing ? 'Update Artwork' : 'Create Artwork')
              }
            </button>
          </div>
        </form>
      </div>
        {/* Folk Art Background */}
        <div className="folk-art-background absolute inset-0 rounded-3xl overflow-hidden opacity-20">
          {/* Mandala Patterns */}
          <div className="mandala-pattern mandala-1"></div>
          <div className="mandala-pattern mandala-2"></div>
          
          {/* Warli Art Figures */}
          <div className="warli-figure warli-1">
            <div className="warli-arms"></div>
            <div className="warli-legs"></div>
          </div>
          <div className="warli-figure warli-2">
            <div className="warli-arms"></div>
            <div className="warli-legs"></div>
          </div>
          
          {/* Geometric Patterns */}
          <div className="geometric-pattern geo-1"></div>
        </div>
        
        {/* Form Container */}
        <div className="relative z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-800">
              {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-amber-800">
              Artwork Image {!isEditing && <span className="text-red-500">*</span>}
            </label>
            
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Artwork preview"
                    className="w-64 h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-64 h-64 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors"
                >
                  <svg className="w-12 h-12 text-amber-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-amber-600 text-sm font-medium">Click to upload image</p>
                  <p className="text-amber-500 text-xs">JPEG, PNG, WebP (max 10MB)</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {!imagePreview && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-amber-600 text-white px-6 py-2 rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Select Image
                </button>
              )}
            </div>
            
            {errors.image && (
              <p className="text-red-500 text-sm text-center">{errors.image}</p>
            )}
          </div>

          {/* Two-column layout for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-amber-800 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                  placeholder="Enter artwork title"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* Art Form */}
              <div>
                <label htmlFor="artForm" className="block text-sm font-medium text-amber-800 mb-2">
                  Art Form <span className="text-red-500">*</span>
                </label>
                <select
                  id="artForm"
                  name="artForm"
                  value={formData.artForm}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.artForm ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                >
                  <option value="">Select art form</option>
                  {ART_FORMS.filter(form => !form.disabled).map(form => (
                    <option key={form.value} value={form.value}>{form.label}</option>
                  ))}
                </select>
                {errors.artForm && (
                  <p className="text-red-500 text-xs mt-1">{errors.artForm}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-amber-800 mb-2">
                  Price (Optional)
                </label>
                <div className="flex">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="px-3 py-3 rounded-l-xl border border-r-0 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-amber-50"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`flex-1 px-4 py-3 rounded-r-xl border ${errors.price ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>

              {/* Dimensions */}
              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-amber-800 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="e.g., 24 x 18 inches"
                />
              </div>

              {/* Year Created */}
              <div>
                <label htmlFor="yearCreated" className="block text-sm font-medium text-amber-800 mb-2">
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
                  className={`w-full px-4 py-3 rounded-xl border ${errors.yearCreated ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                />
                {errors.yearCreated && (
                  <p className="text-red-500 text-xs mt-1">{errors.yearCreated}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-amber-800 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400' : 'border-amber-300'} focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 resize-none`}
                  placeholder="Describe your artwork, its inspiration, and techniques used..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              {/* Materials */}
              <div>
                <label htmlFor="materials" className="block text-sm font-medium text-amber-800 mb-2">
                  Materials Used
                </label>
                <textarea
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="e.g., Acrylic on canvas, natural pigments, wood..."
                />
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-amber-800 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="traditional, colorful, handmade (comma separated)"
                />
                <p className="text-amber-600 text-xs mt-1">Separate tags with commas</p>
              </div>

              {/* For Sale Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isForSale"
                  name="isForSale"
                  checked={formData.isForSale}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="isForSale" className="text-sm font-medium text-amber-800">
                  Available for sale
                </label>
              </div>
            </div>
          </div>

          {/* Error message */}
          {errors.submit && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {errors.submit}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Creating...')
                : (isEditing ? 'Update Artwork' : 'Create Artwork')
              }
            </button>
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

export default ArtworkManagement;
