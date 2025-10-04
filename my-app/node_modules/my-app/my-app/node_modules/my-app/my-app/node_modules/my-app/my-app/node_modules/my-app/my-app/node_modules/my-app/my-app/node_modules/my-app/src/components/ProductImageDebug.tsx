'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  images?: string[];
}

interface ProductImageDebugProps {
  product: Product;
}

export default function ProductImageDebug({ product }: ProductImageDebugProps) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (product?.images?.[0]) {
      setImageStatus('loading');
      setErrorMessage('');
    }
  }, [product?.images]);

  const handleImageLoad = () => {
    setImageStatus('success');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageStatus('error');
    setErrorMessage(e.currentTarget.src);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="font-semibold text-gray-800 mb-2">{product?.name || 'Unknown Product'}</h3>
      
      <div className="space-y-3">
        {/* Image URL Info */}
        <div className="text-sm">
          <div className="font-medium text-gray-700">Image URL:</div>
          <div className="text-gray-600 break-all">
            {product?.images?.[0] || 'No image URL'}
          </div>
        </div>

        {/* Image Status */}
        <div className="text-sm">
          <div className="font-medium text-gray-700">Status:</div>
          <div className={`font-semibold ${
            imageStatus === 'success' ? 'text-green-600' : 
            imageStatus === 'error' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>
            {imageStatus === 'success' ? '✅ Loaded Successfully' :
             imageStatus === 'error' ? '❌ Failed to Load' :
             '⏳ Loading...'}
          </div>
        </div>

        {/* Error Message */}
        {imageStatus === 'error' && (
          <div className="text-sm">
            <div className="font-medium text-gray-700">Error:</div>
            <div className="text-red-600 break-all">{errorMessage}</div>
          </div>
        )}

        {/* Image Preview */}
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {product?.images?.[0] && product.images[0] !== "/placeholder-product.jpg" ? (
            <Image
              src={product.images[0]}
              alt={product.name || 'Product image'}
              fill
              className="object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">
              🪑
            </div>
          )}
        </div>

        {/* Direct Link */}
        {product?.images?.[0] && (
          <div className="text-sm">
            <div className="font-medium text-gray-700">Direct Link:</div>
            <a 
              href={product.images[0]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {product.images[0]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


