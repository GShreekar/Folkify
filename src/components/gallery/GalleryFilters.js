import React, { useState } from 'react';

const GalleryFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    artform: 'all',
    region: 'all',
    search: '',
    sort: 'newest'
  });

  const artforms = [
    { value: 'all', label: 'All Art Forms' },
    { value: 'warli', label: 'Warli' },
    { value: 'madhubani', label: 'Madhubani' },
    { value: 'pithora', label: 'Pithora' },
    { value: 'gond', label: 'Gond' },
    { value: 'kalamkari', label: 'Kalamkari' },
    { value: 'tanjore', label: 'Tanjore' },
    { value: 'patachitra', label: 'Patachitra' },
    { value: 'other', label: 'Other' }
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'west-bengal', label: 'West Bengal' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  return (
    <section className="bg-white border-b border-amber-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Art Form
            </label>
            <select
              value={filters.artform}
              onChange={(e) => handleFilterChange('artform', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-amber-900"
            >
              {artforms.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Region
            </label>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-amber-900"
            >
              {regions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by artist name, symbol, or keyword..."
                className="w-full px-4 py-3 pl-10 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-amber-900 placeholder-amber-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Sort By
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-amber-900"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(filters.artform !== 'all' || filters.region !== 'all' || filters.search) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-amber-700">Active filters:</span>
            {filters.artform !== 'all' && (
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                {artforms.find(a => a.value === filters.artform)?.label}
                <button 
                  onClick={() => handleFilterChange('artform', 'all')}
                  className="ml-2 text-amber-600 hover:text-amber-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.region !== 'all' && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                {regions.find(r => r.value === filters.region)?.label}
                <button 
                  onClick={() => handleFilterChange('region', 'all')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                "{filters.search}"
                <button 
                  onClick={() => handleFilterChange('search', '')}
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
