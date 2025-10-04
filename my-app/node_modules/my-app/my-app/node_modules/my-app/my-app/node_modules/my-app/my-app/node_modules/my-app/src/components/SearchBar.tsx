'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void; // onSearch is now required
  initialQuery?: string;
  debounceTime?: number; 
  onFocus?: () => void; 
  onBlur?: () => void; 
}

const SearchBar = ({ onSearch, initialQuery = '', debounceTime = 300, onFocus, onBlur }: SearchBarProps) => {
  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const debouncedSearchRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentQuery(initialQuery);
  }, [initialQuery]);

  // Use a ref to store the onSearch function to avoid unnecessary re-creations of debouncedOnSearch
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const debouncedChange = useCallback(() => {
    if (onSearchRef.current) {
      onSearchRef.current(currentQuery);
    }
  }, [currentQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentQuery(value);

    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }
    if (value.length > 0) { // Only debounce if there's actual input
      debouncedSearchRef.current = setTimeout(() => {
        debouncedChange();
      }, debounceTime);
    } else { // If input is cleared, immediately trigger search with empty query
      debouncedChange();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedSearchRef.current) {
      clearTimeout(debouncedSearchRef.current);
    }
    debouncedChange(); // Immediately trigger search on submit
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search for furniture..."
        value={currentQuery}
        onChange={handleInputChange}
        onFocus={onFocus} 
        onBlur={onBlur} 
        className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors duration-200"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
