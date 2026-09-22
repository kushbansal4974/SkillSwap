import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable SearchBar Component with dark mode support
 */
export const SearchBar = ({
  placeholder = 'Search for services, skills or gigs...',
  initialValue = '',
  onSearch,
  size = 'md',
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  const isLarge = size === 'lg';

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full ${className}`}
      role="search"
    >
      <label htmlFor="marketplace-search" className="sr-only">
        Search for services
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          <Search className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
        </div>
        <input
          id="marketplace-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 dark:focus:border-primary-500 ${
            isLarge ? 'py-3 text-sm shadow-sm' : 'py-2 text-xs'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <X className={isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          </button>
        )}
      </div>
      {isLarge && (
        <button
          type="submit"
          className="ml-2.5 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex-shrink-0"
        >
          Search
        </button>
      )}
    </form>
  );
};

export default SearchBar;
