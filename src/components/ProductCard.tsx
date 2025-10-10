'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast'; // Import useToast

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category: string;
  slug: string;
  rating?: number; // Made optional as it's not used directly in rendering
  reviews?: number; // Made optional as it's not used directly in rendering
  isNew?: boolean;
  discount?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  slug,
  isNew = false,
  discount = 0
}: ProductCardProps) => {
  console.log('ProductCard: Received slug prop:', slug); // DEBUG LOG
  const { addToCart } = useCart();
  const { showToast } = useToast(); // Use the toast hook

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      slug,
      quantity: 1,
    });
    showToast(`${name} added to cart!`); // Show success toast
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-64 sm:h-72 lg:h-80 flex flex-col"
    >
      <Link href={`/products/${slug}`} className="block flex-1">
        {/* Image Container */}
        <div className="relative h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {/* Product Image */}
          {image && image !== "/placeholder-product.jpg" ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain rounded-t-2xl"
            />
          ) : (
            /* Product Image Placeholder */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                🪑
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {isNew && (
              <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Quick Actions (e.g., Wishlist, Compare, Quick View) */}
          <div className="absolute top-2 right-2 flex-col space-y-1 transition-all duration-300 opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto md:group-hover:flex md:group-hover:translate-x-0">
            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-1 sm:p-2 lg:p-3 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{category}</p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-800 mb-0.5 lg:mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300 text-xs lg:text-sm">
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-0.5">
            {originalPrice && originalPrice > price ? (
              <>
                <span className="text-sm lg:text-base font-bold text-gray-800">{formatPrice(price)}</span>
                <span className="text-xs text-gray-500 line-through">{formatPrice(originalPrice)}</span>
              </>
            ) : (
              <span className="text-sm lg:text-base font-bold text-gray-800">{formatPrice(price)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - Always visible on mobile, hover on desktop */}
      <div className="mt-auto p-1 sm:p-2 lg:p-3 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-amber-600 text-white py-1.5 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-200 text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
