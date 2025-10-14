'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

interface ProductImageGalleryProps {
  images?: { _key: string; _type: 'image'; asset: { _ref: string; _type: 'reference' } }[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images?.[0]);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden shadow-md flex items-center justify-center">
        <span className="text-6xl text-gray-400">🪑</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden shadow-md">
        {activeImage ? (
          <Image
            src={urlForImage(activeImage).url()}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-gray-400">🪑</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={img._key || index}
            className={`relative h-24 w-full bg-gray-100 rounded-lg overflow-hidden shadow-sm cursor-pointer ${activeImage?._key === img._key ? 'border-2 border-amber-600' : ''}`}
            onClick={() => setActiveImage(img)}
          >
            <Image
              src={urlForImage(img).url()}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              sizes="25vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;


