import React, { useState } from 'react';

const MyArtworksSection = ({ artworks = [] }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    artform: '',
    image: null,
    price: ''
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">✅ Approved</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">⏳ Pending Review</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">❌ Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">Status Unknown</span>;
    }
  };

  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    console.log('Artwork upload:', uploadFormData);
    setShowUploadForm(false);
    setUploadFormData({
      title: '',
      description: '',
      artform: '',
      image: null,
      price: ''
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-900">My Artworks</h2>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <span className="mr-2">+</span>
          Upload Artwork
        </button>
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-amber-900">Upload New Artwork</h3>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-amber-600 hover:text-amber-800 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={uploadFormData.title}
                    onChange={handleUploadFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter artwork title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">
                    Description / Story *
                  </label>
                  <textarea
                    name="description"
                    value={uploadFormData.description}
                    onChange={handleUploadFormChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                    placeholder="Tell the story behind your artwork..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">
                    Art Form *
                  </label>
                  <select
                    name="artform"
                    value={uploadFormData.artform}
                    onChange={handleUploadFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  >
                    <option value="">Select art form</option>
                    <option value="warli">Warli</option>
                    <option value="pithora">Pithora</option>
                    <option value="madhubani">Madhubani</option>
                    <option value="gond">Gond</option>
                    <option value="kalamkari">Kalamkari</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">
                    Upload Image *
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleUploadFormChange}
                    accept="image/*"
                    className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                  {uploadFormData.image && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(uploadFormData.image)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border border-amber-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-800 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={uploadFormData.price}
                    onChange={handleUploadFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter price (optional)"
                    min="0"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 border border-amber-600 text-amber-700 py-3 px-4 rounded-xl font-semibold hover:bg-amber-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transition-all duration-200"
                  >
                    Save & Submit for Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {artworks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-xl shadow-lg border border-amber-200/50 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                {artwork.image ? (
                  <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🎨</span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-amber-900 truncate">{artwork.title}</h3>
                  {getStatusBadge(artwork.status)}
                </div>

                <p className="text-amber-600 text-sm mb-3 line-clamp-2">
                  {artwork.description}
                </p>

                {artwork.price && (
                  <div className="text-xl font-bold text-amber-900 mb-3">
                    ₹{artwork.price}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 bg-amber-100 text-amber-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors duration-200">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200">
                    Delete
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-800 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors duration-200">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-amber-200/50">
          <div className="text-8xl mb-6">🎨</div>
          <h3 className="text-2xl font-semibold text-amber-800 mb-4">
            No Artworks Yet
          </h3>
          <p className="text-amber-600 mb-6 max-w-md mx-auto">
            Upload your first artwork to start showcasing your talent to the world. 
            Share the story behind your art!
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
          >
            Upload Your First Artwork
          </button>
        </div>
      )}
    </div>
  );
};

export default MyArtworksSection;
