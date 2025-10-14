'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
// Update the import to match the actual exports from '@/lib/products'
import { SanityProduct } from '@/lib/products';
import { getAllProducts } from '@/lib/products'; // Adjust the path if getAllProducts is in a subfile
import { urlForImage } from '@/sanity/lib/image';
import Image from 'next/image';
import { Image as SanityImage } from 'sanity'; // Import Sanity's Image type

interface Product {
  _id: string;
  name: string;
  slug: string;
  images?: SanityImage[]; // Use SanityImage type for images
  price: number;
  description?: string;
  category?: {
    name: string;
  };
}

const HeaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce search logic
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setLoading(true);
        setShowResults(true);

        try {
          const { products } = await getAllProducts();

          const filtered = (products || []).filter((product: SanityProduct) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const mappedProducts: Product[] = filtered.map((product: SanityProduct) => ({
            _id: product._id,
            name: product.name,
            slug: typeof product.slug === 'object' && product.slug !== null && 'current' in product.slug
              ? (product.slug as { current: string }).current
              : (product.slug as string),
            images: Array.isArray(product.images)
              ? product.images.map((img) => img as SanityImage) // Cast to SanityImage
              : [],
            price: product.price,
            description: product.description,
            category: product.category,
          }));

          setSearchResults(mappedProducts.slice(0, 10));
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
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`);
    setShowResults(false);
    setSearchTerm('');
    inputRef.current?.blur();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => {
    if (searchTerm.length > 0 || searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
      setSearchTerm('');
      inputRef.current?.blur();
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative flex-1 max-w-lg mx-4" ref={searchContainerRef}>
      <form onSubmit={handleFormSubmit} className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for furniture..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors duration-200"
          aria-label="Search"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {showResults && (loading || searchResults.length > 0 || searchTerm.length > 2) && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-50 max-h-80 overflow-y-auto border border-gray-200">
          {loading && (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          )}
          {!loading && searchResults.length === 0 && searchTerm.length > 2 && (
            <div className="p-4 text-center text-gray-500">
              No products found for &quot;{searchTerm}&quot;.
            </div>
          )}
          {!loading && searchResults.length > 0 && (
            <ul>
              {searchResults.map((product) => (
                <li key={product._id} className="border-b last:border-b-0">
                  <button
                    onClick={() => handleProductClick(product.slug)}
                    className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors duration-200 text-left"
                  >
                    <Image
                      src={
                        product.images?.[0]
                          ? urlForImage(product.images[0]).url()
                          : '/placeholder-product.jpg'
                      }
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(product.price)}
                      </p>
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
