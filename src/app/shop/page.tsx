'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { getAllProducts, getAllCategories } from '@/lib/products';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  images?: string[];
  category?: string;
  categories?: { name: string; id: string; slug: string };
  is_new?: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const getPriceBounds = () => {
      let minPrice: number | undefined;
      let maxPrice: number | undefined;
      switch (priceRange) {
        case 'under-10000':
          maxPrice = 10000;
          break;
        case '10000-25000':
          minPrice = 10000;
          maxPrice = 25000;
          break;
        case '25000-50000':
          minPrice = 25000;
          maxPrice = 50000;
          break;
        case 'above-50000':
          minPrice = 50000;
          break;
        default:
          break;
      }
      return { minPrice, maxPrice };
    };

    const fetchShopData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { minPrice, maxPrice } = getPriceBounds();

        const [productsResult, categoriesData] = await Promise.all([
          getAllProducts(selectedCategory, minPrice, maxPrice, sortBy, searchTerm, currentPage, productsPerPage),
          getAllCategories()
        ]);

        setProducts(productsResult.products || []);
        setTotalProducts(productsResult.totalCount || 0);
        setCategories((categoriesData as Category[]) || []);
      } catch (err: unknown) {
        console.error('Error fetching shop data:', err);
        let errorMessage = 'Failed to fetch products. Please try again later.';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, [selectedCategory, priceRange, sortBy, searchTerm, currentPage, productsPerPage]); // Add productsPerPage to dependencies

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceRange(e.target.value);
    setCurrentPage(1);
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Helper function to generate an array of page numbers for pagination
  const generatePaginationNumbers = (currentPage: number, totalPages: number, maxPageButtons: number = 5) => {
    const pageNumbers: (number | string)[] = [];
    const halfMax = Math.floor(maxPageButtons / 2);

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always add the first page
      pageNumbers.push(1);

      // Determine start and end for the middle block
      let start = Math.max(2, currentPage - halfMax);
      let end = Math.min(totalPages - 1, currentPage + halfMax);

      // Adjust start/end if near boundaries
      if (currentPage - 1 < halfMax) {
        end = maxPageButtons - 1;
      }
      if (totalPages - currentPage < halfMax + 1) {
        start = totalPages - maxPageButtons + 2;
      }
      
      // Add ellipsis if needed after the first page
      if (start > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed before the last page
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always add the last page (if not already included and totalPages > 1)
      if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Discover our complete collection of premium imported furniture. Best quality at unbeatable prices.
            </p>
          </div>
        </section>

        {/* Filters & Sorting */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap items-center space-x-4">
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                >
                  <option value="">Price Range</option>
                  <option value="under-10000">Under PKR 10,000</option>
                  <option value="10000-25000">PKR 10,000 - 25,000</option>
                  <option value="25000-50000">PKR 25,000 - 50,000</option>
                  <option value="above-50000">Above PKR 50,000</option>
                </select>

                {/* Search Bar for Shop Page */}
                <div className="md:flex-1 md:max-w-xs">
                  <SearchBar 
                    onSearch={handleSearch} 
                    initialQuery={searchTerm} 
                    debounceTime={300}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sort by:</span>
                <select 
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={sortBy}
                  onChange={handleSortByChange}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-10"><p>Loading products...</p></div>
            ) : error ? (
              <div className="text-center py-10 text-red-500"><p>{error}</p></div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 text-gray-500"><p>No products found matching your criteria.</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product: Product) => {
                  let discountPercentage = 0;
                  if (product.original_price && product.original_price > product.price) {
                    discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                  }

                  return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                      originalPrice={product.original_price || undefined}
                      category={product.categories?.name || product.category || 'Unknown'}
                      slug={product.slug}
                      rating={4.5}
                      reviews={0}
                      isNew={product.is_new || false}
                      discount={discountPercentage}
                      image={product.images?.[0] || "/placeholder-product.jpg"}
                    />
                  );
                })}
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {generatePaginationNumbers(currentPage, totalPages).map((page, index) => (
                    <button
                      key={page === '...' ? `ellipsis-${index}` : page}
                      onClick={() => typeof page === 'number' && handlePageChange(page)}
                      disabled={page === '...'}
                      className={`px-3 py-2 border border-gray-300 rounded-lg ${
                        typeof page === 'number'
                          ? currentPage === page
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                          : 'text-gray-500 cursor-default' // For ellipsis
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Contact us for custom orders or bulk purchases. We&apos;re here to help you find the perfect furniture solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300">
                Contact Us
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 transition-colors duration-300">
                Get Quote
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
