'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import {
  getAllProducts,
  getAllCategories,
  getAllSubcategories,
  SanityCategory,
  SanitySubcategory,
  SanityProduct,
} from '@/lib/products'
import { useSearchParams } from 'next/navigation'

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<SanityProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<SanityProduct[]>([])
  const [categories, setCategories] = useState<SanityCategory[]>([])
  const [subcategories, setSubcategories] = useState<SanitySubcategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const searchParams = useSearchParams()
  const initialSearchQuery = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(20)

  // 🔹 Update search term when URL changes
  useEffect(() => {
    const currentSearchQuery = searchParams.get('search') || ''
    if (currentSearchQuery !== searchTerm) {
      setSearchTerm(currentSearchQuery)
      setCurrentPage(1)
    }
  }, [searchParams, searchTerm])

  // 🔹 Fetch all products, categories, subcategories
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [productsResult, categoriesData, subcategoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllSubcategories(),
        ])

        setAllProducts(productsResult.products || [])
        setCategories(categoriesData || [])
        setSubcategories(subcategoriesData || [])
      } catch (err: unknown) {
        console.error('Error fetching shop data:', err)
        let errorMessage = 'Failed to fetch products. Please try again later.'
        if (err instanceof Error) errorMessage = err.message
        else if (typeof err === 'string') errorMessage = err
        setError(errorMessage)
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  // 🔹 Filter and sort products whenever filters change
  useEffect(() => {
    let filtered = [...allProducts]

    // Search filter with relevance scoring
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      const productsWithScore = filtered.map((product) => {
        let score = 0
        const productName = product.name.toLowerCase()
        const productDescription = product.description?.toLowerCase() || ''
        const productCategory = product.category?.name.toLowerCase() || ''
        const productSubcategory = product.subcategory?.name.toLowerCase() || ''

        if (productName === lowerSearchTerm) score += 1000
        else if (productName.startsWith(lowerSearchTerm)) score += 500
        else if (productName.includes(lowerSearchTerm)) score += 300

        if (productCategory === lowerSearchTerm) score += 200
        else if (productCategory.includes(lowerSearchTerm)) score += 150

        if (productSubcategory === lowerSearchTerm) score += 180
        else if (productSubcategory.includes(lowerSearchTerm)) score += 120

        if (productDescription.includes(lowerSearchTerm)) score += 50

        const searchWords = lowerSearchTerm.split(' ').filter((w) => w.length > 2)
        searchWords.forEach((w) => {
          if (productName.includes(w)) score += 20
          if (productCategory.includes(w)) score += 10
          if (productDescription.includes(w)) score += 5
        })

        return { product, score }
      })

      filtered = productsWithScore
        .filter((i) => i.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((i) => i.product)
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory)
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter((p) => p.subcategory?.slug === selectedSubcategory)
    }

    // Price filter
    if (priceRange) {
      switch (priceRange) {
        case 'under-10000':
          filtered = filtered.filter((p) => p.price < 10000)
          break
        case '10000-25000':
          filtered = filtered.filter((p) => p.price >= 10000 && p.price <= 25000)
          break
        case '25000-50000':
          filtered = filtered.filter((p) => p.price >= 25000 && p.price <= 50000)
          break
        case 'above-50000':
          filtered = filtered.filter((p) => p.price > 50000)
          break
      }
    }

    // Sort (relevance → price → newest)
    if (!searchTerm) {
      switch (sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          filtered.sort(
            (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          )
          break
        default:
          filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
      }
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [allProducts, searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy])

  // 🔹 Filtered subcategories by selected category
  const filteredSubcategories = selectedCategory
    ? subcategories.filter((sub) => sub.category?.slug === selectedCategory)
    : subcategories

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
    setSelectedSubcategory('')
  }

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value)
  }

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceRange(e.target.value)
  }

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  // Pagination logic
  const totalProducts = filteredProducts.length
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // const handlePageChange = (page: number) => {
  //   if (page > 0 && page <= totalPages) {
  //     setCurrentPage(page)
  //     window.scrollTo({ top: 0, behavior: 'smooth' })
  //   }
  // }

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Shop All Products'}
            </h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              {searchTerm
                ? `Found ${totalProducts} product${totalProducts !== 1 ? 's' : ''} matching your search`
                : 'Discover our complete collection of premium imported furniture.'}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                disabled={!filteredSubcategories.length}
              >
                <option value="">All Subcategories</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub._id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={handlePriceRangeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Price Range</option>
                <option value="under-10000">Under PKR 10,000</option>
                <option value="10000-25000">PKR 10,000 - 25,000</option>
                <option value="25000-50000">PKR 25,000 - 50,000</option>
                <option value="above-50000">Above PKR 50,000</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={handleSortByChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-10">Loading products...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No products found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {currentProducts.map((p) => {
                  const discount =
                    p.original_price && p.original_price > p.price
                      ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                      : 0

                  return (
                    <ProductCard
                      key={p._id}
                      id={p._id}
                      name={p.name}
                      price={p.price}
                      originalPrice={p.original_price}
                      category={p.category?.name || ''}
                      slug={p.slug}
                      rating={p.rating || 4.5}
                      reviews={p.reviews || 0}
                      isNew={p.is_new || false}
                      discount={discount}
                      image={p.images?.[0] || undefined}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
