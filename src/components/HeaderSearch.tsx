'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
// Removed import of SearchBar
import { getAllProducts } from '@/lib/products';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  images?: string[];
  price: number;
}

const HeaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element
  const router = useRouter();

  // Debounce logic and product fetching
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setLoading(true);
        setShowResults(true);
        try {
          const { products: productsData } = await getAllProducts(undefined, undefined, undefined, undefined, searchTerm);
          setSearchResults(productsData || []);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else if (searchTerm.length === 0) {
        setSearchResults([]);
        setShowResults(false);
        setLoading(false);
      }
    }, 300); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setShowResults(false);
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.blur(); // Remove focus from the input
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContainerRef]); 

  const handleFocus = () => {
    if (searchTerm.length > 0 || searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!searchContainerRef.current?.contains(document.activeElement as Node)) {
        setShowResults(false);
      }
    }, 100); 
  };

  return (
    <div className="relative flex-1 max-w-lg mx-4" ref={searchContainerRef}>
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for furniture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {showResults && (loading || searchResults.length > 0 || searchTerm.length > 2) && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-50 max-h-80 overflow-y-auto border border-gray-200">
          {loading && (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          )}
          {!loading && searchResults.length === 0 && searchTerm.length > 2 && (
            <div className="p-4 text-center text-gray-500">No products found for "{searchTerm}".</div>
          )}
          {!loading && searchResults.length > 0 && (
            <ul>
              {searchResults.map((product) => (
                <li key={product.id} className="border-b last:border-b-0">
                  <button 
                    onClick={() => handleProductClick(product.slug)}
                    className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors duration-200 text-left"
                  >
                    <Image
                      src={product.images?.[0] || "/placeholder-product.jpg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-contain mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">PKR {product.price.toFixed(2)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
