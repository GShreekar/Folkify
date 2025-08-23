import React, { useState, useEffect } from 'react';
import { ART_FORM_CATEGORIES } from '../../constants/artForms';

const GalleryFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    artform: 'all',
    region: 'all',
    search: '',
    sort: 'newest'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const categories = ART_FORM_CATEGORIES;

    const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update filters when debounced search term changes
  useEffect(() => {
    const newFilters = { ...filters, search: debouncedSearchTerm };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  }, [debouncedSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryId) => {
    const newFilters = { ...filters, artform: categoryId };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  return (
    <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Search Bar */}
          <div className="w-full lg:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-amber-200 rounded-lg bg-white text-amber-800 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500">
                🔍
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 flex-1 justify-center">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filters.artform === category.id
                    ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg'
                    : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <label className="text-amber-800 font-medium">Sort by:</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-amber-200 rounded-lg bg-white text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.artform !== 'all' || filters.search) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-amber-700">Active filters:</span>
            {filters.artform !== 'all' && (
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                {categories.find(c => c.id === filters.artform)?.name}
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                "{filters.search}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  ×
                </button>
              </span>
            )}
            <button 
              onClick={() => {
                const resetFilters = { artform: 'all', region: 'all', search: '', sort: 'newest' };
                setFilters(resetFilters);
                setSearchTerm('');
                onFiltersChange && onFiltersChange(resetFilters);
              }}
              className="text-xs text-amber-600 hover:text-amber-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryFilters;
