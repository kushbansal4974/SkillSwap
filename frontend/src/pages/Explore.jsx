import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { gigApi } from '../api/gigApi';
import { GigCard } from '../components/GigCard';
import { SearchBar } from '../components/SearchBar';
import { GigCardSkeleton } from '../components/Loading';
import { EmptyState } from '../components/EmptyState';
import { SlidersHorizontal, RotateCcw, X, Layers } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Video Editing',
  'Marketing',
  'Mobile Development',
  'Photography',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read filter state from search parameters
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'All';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  // Local price input state for smooth typing before submitting
  const [localMinPrice, setLocalMinPrice] = useState(currentMinPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(currentMaxPrice);

  useEffect(() => {
    setLocalMinPrice(currentMinPrice);
    setLocalMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          search: currentSearch || undefined,
          category: currentCategory !== 'All' ? currentCategory : undefined,
          minPrice: currentMinPrice || undefined,
          maxPrice: currentMaxPrice || undefined,
          sort: currentSort || undefined,
        };

        const result = await gigApi.getGigs(queryParams);
        setGigs(result);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
        setError(err.message || 'Unable to load gigs at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [currentSearch, currentCategory, currentMinPrice, currentMaxPrice, currentSort]);

  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'All') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const handleApplyPrice = (e) => {
    e.preventDefault();
    updateFilters({
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
    });
  };

  const handleResetFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams({});
  };

  const hasActiveFilters =
    currentSearch ||
    (currentCategory && currentCategory !== 'All') ||
    currentMinPrice ||
    currentMaxPrice ||
    currentSort !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors">
      
      {/* Header & Search Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Layers className="w-3 h-3 mr-1" />
            Marketplace Gigs
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Explore Freelance Services
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Find skilled creators for your next project across all digital disciplines.
        </p>

        <div className="max-w-xl">
          <SearchBar
            initialValue={currentSearch}
            placeholder="Search by keyword, skill, or service..."
            onSearch={(term) => updateFilters({ search: term })}
          />
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Mobile Filter Toggle Button */}
        <div className="w-full flex lg:hidden items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          {/* Mobile Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`w-full lg:w-64 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card dark:shadow-card-dark flex-shrink-0 transition-colors ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Filter By
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map((category) => {
                const isSelected = currentCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => updateFilters({ category })}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Budget (₹ INR)
            </h3>
            <form onSubmit={handleApplyPrice} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-price" className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold">
                    Min Price
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    placeholder="₹ 0"
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 uppercase font-bold">
                    Max Price
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    placeholder="₹ Any"
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Apply Budget
              </button>
            </form>
          </div>

        </aside>

        {/* Gigs Results Section */}
        <main className="flex-1 w-full">
          
          {/* Desktop Sort & Result Count Bar */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-white">{gigs.length}</span>{' '}
              {gigs.length === 1 ? 'gig' : 'gigs'}
              {currentCategory !== 'All' && <span> in <strong className="text-slate-900 dark:text-white">{currentCategory}</strong></span>}
              {currentSearch && <span> for "<strong className="text-slate-900 dark:text-white">{currentSearch}</strong>"</span>}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={currentSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="text-xs border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium shadow-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {currentCategory !== 'All' && (
                <span className="badge bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                  Category: {currentCategory}
                  <button
                    onClick={() => updateFilters({ category: 'All' })}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {currentSearch && (
                <span className="badge bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                  Search: "{currentSearch}"
                  <button
                    onClick={() => updateFilters({ search: '' })}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                    aria-label="Remove search filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(currentMinPrice || currentMaxPrice) && (
                <span className="badge bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                  Budget: ₹{currentMinPrice || 0} - ₹{currentMaxPrice || 'Any'}
                  <button
                    onClick={() => {
                      setLocalMinPrice('');
                      setLocalMaxPrice('');
                      updateFilters({ minPrice: '', maxPrice: '' });
                    }}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100"
                    aria-label="Remove price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <GigCardSkeleton key={i} />
              ))}
            </div>
          ) : gigs.length === 0 ? (
            /* Empty State */
            <EmptyState
              title="No gigs found"
              description="No services matched your current filters. Try changing your keywords or resetting filters."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            /* Gigs Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default Explore;
