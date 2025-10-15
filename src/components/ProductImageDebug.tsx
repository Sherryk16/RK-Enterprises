'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as SanityImage } from 'sanity'; // Import Sanity's Image type
import { urlForImage } from '@/sanity/lib/image'; // Import urlForImage

interface Product {
  _id: string; // Changed from id to _id
  name: string;
  images?: SanityImage[]; // Changed to SanityImage[]
}

interface ProductImageDebugProps {
  product: Product;
}

export default function ProductImageDebug({ product }: ProductImageDebugProps) {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const imageUrl = product?.images?.[0] ? urlForImage(product.images[0]).url() : '/placeholder-product.jpg';

  useEffect(() => {
    if (imageUrl && imageUrl !== '/placeholder-product.jpg') {
      setImageStatus('loading');
      setErrorMessage('');
    }
  }, [imageUrl]);

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
            {imageUrl || 'No image URL'}
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
          {imageUrl && imageUrl !== '/placeholder-product.jpg' ? (
            <Image
              src={imageUrl}
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
        {imageUrl && (
          <div className="text-sm">
            <div className="font-medium text-gray-700">Direct Link:</div>
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {imageUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


