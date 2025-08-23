import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { addArtwork, updateArtwork, deleteArtwork } from '../../firebase/auth';

const ArtworkManagement = ({ artwork, onSuccess, onCancel, isEditing = false }) => {
  const { currentUser, loadUserArtworks } = useAuth();
  const [formData, setFormData] = useState({
    title: artwork?.title || '',
    description: artwork?.description || '',
    artForm: artwork?.artForm || '',
    price: artwork?.price || '',
    dimensions: artwork?.dimensions || '',
    materials: artwork?.materials || '',
    yearCreated: artwork?.yearCreated || new Date().getFullYear(),
    isForSale: artwork?.isForSale || true,
    tags: artwork?.tags?.join(', ') || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.artForm) {
      newErrors.artForm = 'Art form is required';
    }

    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Please enter a valid price';
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
      const artworkData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      let result;
      if (isEditing) {
        result = await updateArtwork(artwork.id, artworkData);
      } else {
        result = await addArtwork(currentUser.uid, artworkData);
      }

      if (result.success) {
        await loadUserArtworks();
        onSuccess?.();
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Error saving artwork:', error);
      setErrors({ submit: 'An error occurred while saving the artwork' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-800">
              {isEditing ? 'Edit Artwork' : 'Add New Artwork'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title ? 'border-red-400' : 'border-amber-300'
              } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
              placeholder="Enter artwork title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Art Form *
            </label>
            <select
              name="artForm"
              value={formData.artForm}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.artForm ? 'border-red-400' : 'border-amber-300'
              } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
            >
              <option value="">Select art form</option>
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
            {errors.artForm && (
              <p className="text-red-500 text-xs mt-1">{errors.artForm}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.description ? 'border-red-400' : 'border-amber-300'
              } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 resize-none`}
              placeholder="Describe your artwork, its inspiration, and techniques used..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="e.g., 24x18 inches"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Year Created
              </label>
              <input
                type="number"
                name="yearCreated"
                value={formData.yearCreated}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Materials Used
            </label>
            <input
              type="text"
              name="materials"
              value={formData.materials}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="e.g., Natural pigments, handmade paper, canvas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="e.g., traditional, nature, mythology (separate with commas)"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isForSale"
                checked={formData.isForSale}
                onChange={handleChange}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-amber-800">Available for sale</span>
            </label>

            {formData.isForSale && (
              <div className="flex-1">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 rounded-xl border ${
                    errors.price ? 'border-red-400' : 'border-amber-300'
                  } focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200`}
                  placeholder="Price in INR"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
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
              {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Artwork' : 'Add Artwork')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtworkManagement;
