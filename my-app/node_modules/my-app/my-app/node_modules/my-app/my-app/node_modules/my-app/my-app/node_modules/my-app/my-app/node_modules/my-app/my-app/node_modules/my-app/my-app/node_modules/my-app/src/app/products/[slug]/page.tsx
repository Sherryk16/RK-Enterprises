'use client'; // Convert to client component

import Image from 'next/image';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { notFound, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from '@/components/AddToCartButton';
import { useCart } from '@/context/CartContext';
import { useEffect, useState, use } from 'react'; // Revert to previous imports
import Link from 'next/link'; // Added missing import for Link
import { cleanHtml } from '@/lib/utils'; // Import cleanHtml

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  description?: string;
  detailed_description?: string;
  colors?: string[];
  is_featured?: boolean;
  is_ceo_chair?: boolean;
  is_molded?: boolean;
  is_gaming_chair?: boolean;
  is_dining_chair?: boolean;
  is_visitor_sofa?: boolean;
  is_study_chair?: boolean;
  is_outdoor_furniture?: boolean;
  is_folding_furniture?: boolean;
  categories?: { id: string; name: string; slug: string };
  slug: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false); // State for toggling full description
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // State for current image index

  useEffect(() => {
    if (slug) {
      // setCurrentSlug(params.slug); // This line is removed as per the new_code
    }
  }, [slug]); // Use the unwrapped slug in dependencies

  useEffect(() => {
    async function fetchProductData() {
      if (!slug) return; // Only fetch if slug is available

      setLoading(true);
      setError(null);
      try {
        const fetchedProduct: Product | null = await getProductBySlug(slug);
        console.log('ProductDetailPage: Fetched product data:', fetchedProduct); // DEBUG LOG

        if (!fetchedProduct) {
          console.error('ProductDetailPage: Product not found for slug:', slug);
          notFound();
          return;
        }
        setProduct(fetchedProduct);
        setSelectedImageIndex(0); // Reset selected image when product changes

        if (fetchedProduct?.categories?.id) {
          const fetchedRelatedProducts: Product[] = await getRelatedProducts(fetchedProduct.categories.id, fetchedProduct.id);
          setRelatedProducts(fetchedRelatedProducts || []);
        }
      } catch (err: unknown) {
        console.error('Error fetching product for slug:', slug, err);
        let errorMessage = 'Failed to load product.';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(errorMessage);
        notFound(); // Still call notFound for unrecoverable errors
      } finally {
        setLoading(false);
      }
    }
    fetchProductData();
  }, [slug]); // Use the unwrapped slug in dependencies

  console.log('ProductDetailPage: Rendering product data:', product); // DEBUG LOG

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    // notFound() is already called in useEffect for unrecoverable errors
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p>Error: {error || 'Product not found.'}</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder-product.jpg",
        slug: product.slug,
        quantity: 1,
      });
      router.push('/checkout');
    }
  };

  const goToNextImage = () => {
    if (product && product.images && product.images.length > 1) {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % product.images!.length);
    }
  };

  const goToPrevImage = () => {
    if (product && product.images && product.images.length > 1) {
      setSelectedImageIndex((prevIndex) => (prevIndex - 1 + product.images!.length) % product.images!.length);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const renderedTruncatedDescription = product.detailed_description ? cleanHtml(product.detailed_description).substring(0, 150) + '...' : '';

  return (
    <div className="min-h-screen bg-white">
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.name,
              "image": product.images && product.images.length > 0 ? product.images[0] : "/placeholder-product.jpg",
              "description": product.description || product.detailed_description || "",
              "sku": product.id, // Using product ID as SKU
              "offers": {
                "@type": "Offer",
                "url": `https://www.rkenterprises.com/products/${product.slug}`,
                "priceCurrency": "PKR",
                "price": product.price,
                "itemCondition": "https://schema.org/NewCondition",
                "availability": "https://schema.org/InStock", // Assuming products are generally in stock
                "seller": {
                  "@type": "Organization",
                  "name": "RK Enterprise"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.5", // Default rating value
                "reviewCount": "10" // Default review count
              },
              "brand": {
                "@type": "Brand",
                "name": "RK Enterprise"
              }
            })
          }}
        />
      )}
      <main>
        {/* Breadcrumb */}
        <section className="py-2 bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-amber-600">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/shop" className="text-gray-500 hover:text-amber-600">Shop</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Product Images - Always on top for mobile */}
              <div className="space-y-4">
                <div className="relative aspect-w-1 aspect-h-1 bg-gray-100 rounded-2xl overflow-hidden md:max-w-md mx-auto">
                  {product.images && product.images.length > 0 ? (
                    <>
                      <Image
                        src={product.images[selectedImageIndex]}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-contain"
                      />
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={goToPrevImage}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-colors ml-2"
                            aria-label="Previous image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={goToNextImage}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full z-10 hover:bg-opacity-75 transition-colors mr-2"
                            aria-label="Next image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">
                      🪑
                    </div>
                  )}
                </div>
                
                {/* Additional Images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-4 max-w-md mx-auto">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${index === selectedImageIndex ? 'border-amber-500' : 'border-transparent'}`}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info - Below images on mobile, next to images on desktop */}
              <div className="space-y-4 mt-6 lg:mt-0">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
                  <p className="text-gray-600 text-sm">{product.categories?.name}</p>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                  {product.original_price && product.original_price > product.price && (
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-sm font-semibold">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Description</h3>
                    <div
                      className="text-gray-700 text-base"
                      dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                    />
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Available Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.is_featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Featured Product
                      </span>
                    )}
                    {product.is_ceo_chair && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        CEO Chair
                      </span>
                    )}
                    {product.is_molded && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Molded
                      </span>
                    )}
                    {product.is_gaming_chair && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Gaming Chair
                      </span>
                    )}
                    {product.is_dining_chair && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Dining Chair
                      </span>
                    )}
                    {product.is_visitor_sofa && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Visitor Sofa
                      </span>
                    )}
                    {product.is_study_chair && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Study Chair
                      </span>
                    )}
                    {product.is_outdoor_furniture && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                        Outdoor Furniture
                      </span>
                    )}
                    {product.is_folding_furniture && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        Folding Furniture
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons - Always visible */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <AddToCartButton product={product} />
                  <button 
                    onClick={handleBuyNow} // Attach handleBuyNow
                    className="flex-1 border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 hover:text-white transition-colors duration-300"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Detailed Description - Moved below main info, with show more/hide */}
                {product.detailed_description && (
                  <div className="mt-6 bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Description</h3>
                    <div className="text-gray-700 text-base">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: showFullDescription
                            ? product.detailed_description.replace(/\n/g, '<br />')
                            : renderedTruncatedDescription.replace(/\n/g, '<br />'),
                        }}
                      />
                    </div>
                    {product.detailed_description.length > 150 && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-amber-600 hover:underline mt-2 text-sm font-medium"
                      >
                        {showFullDescription ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-700 mb-4">
                    Contact us for more information about this product or to place a custom order.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link 
                      href="https://wa.me/923453593470" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300 text-center"
                    >
                      WhatsApp Us
                    </Link>
                    <a 
                      href="tel:+923453593470" 
                      className="bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300 text-center"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Related Products</h2>
            {relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct: Product) => {
                  let discountPercentage = 0;
                  if (relatedProduct.original_price && relatedProduct.original_price > relatedProduct.price) {
                    discountPercentage = Math.round(((relatedProduct.original_price - relatedProduct.price) / relatedProduct.original_price) * 100);
                  }

                  return (
                    <ProductCard
                      key={relatedProduct.id}
                      id={relatedProduct.id}
                      name={relatedProduct.name}
                      price={relatedProduct.price}
                      originalPrice={relatedProduct.original_price}
                      category={relatedProduct.categories?.name || 'Unknown'}
                      slug={relatedProduct.slug}
                      rating={4.5}
                      reviews={0}
                      isNew={false}
                      discount={discountPercentage}
                      image={relatedProduct.images?.[0] || "/placeholder-product.jpg"}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No related products found in this category.</p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link 
                href={`/categories/${product.categories?.slug || 'shop'}`}
                className="inline-block bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg whitespace-nowrap"
              >
                View All {product.categories?.name || 'Products'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}