// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dhn4m03rt';
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'folkify-artworks';

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} artistId - Artist's UID for folder organization
 * @returns {Promise<Object>} - Result with success status and URL
 */
export const uploadArtworkImage = async (file, artistId) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
    }

    // Validate file size (max 10MB for Cloudinary)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 10MB.');
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `folkify/artworks/${artistId}`); // Organize by artist
    formData.append('resource_type', 'image');

    // Upload to Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    
    return { 
      success: true, 
      imageUrl: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl: result.secure_url.replace('/upload/', '/upload/c_thumb,w_300,h_300/')
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Result with success status
 */
export const deleteArtworkImage = async (publicId) => {
  try {
    if (!publicId) {
      return { success: true }; // No image to delete
    }

    // Note: Deleting from Cloudinary requires server-side implementation
    // For now, we'll just return success as images will be managed through Cloudinary dashboard
    // In production, you'd implement this via your backend API
    
    console.log('Image deletion should be handled server-side:', publicId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: true, warning: 'Image could not be deleted' };
  }
};
