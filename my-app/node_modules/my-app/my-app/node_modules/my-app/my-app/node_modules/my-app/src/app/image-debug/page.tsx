'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageDebug() {
  const [imageError, setImageError] = useState<string | null>(null);

  const testImages = [
    '/mainlogo.png',
    '/hero.png',
    '/office.png',
    '/dining.png',
    '/visitorsbench.png',
    '/study.png',
    '/outdoor.png',
    '/folding.png',
    '/molded.png',
    '/section.png',
    '/placeholder-product.jpg',
    '/placeholder-category.jpg'
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image Debug - Port 3001</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Environment</h2>
        <div className="space-y-2 text-sm">
          <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</div>
          <div><strong>Port:</strong> {typeof window !== 'undefined' ? window.location.port : 'Unknown'}</div>
          <div><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'Unknown'}</div>
        </div>
      </div>

      {imageError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-red-800">Image Error</h2>
          <div className="text-red-700">{imageError}</div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Testing Local Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {testImages.map((src, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-semibold mb-2">{src}</div>
              <div className="relative w-full h-32 bg-gray-100 rounded">
                <Image
                  src={src}
                  alt={`Test image ${index + 1}`}
                  fill
                  className="object-contain"
                  onError={() => setImageError(`Failed to load: ${src}`)}
                  onLoad={() => console.log(`Successfully loaded: ${src}`)}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Direct Link
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>1. Check Console:</strong> Open browser dev tools (F12) and check the Console tab for any image loading errors.
          </div>
          <div>
            <strong>2. Check Network Tab:</strong> In dev tools, go to Network tab and refresh the page. Look for failed image requests (red status codes).
          </div>
          <div>
            <strong>3. Restart Server:</strong> After updating next.config.ts, restart your Next.js development server.
          </div>
          <div>
            <strong>4. Check File Paths:</strong> Make sure all image files exist in the <code>public/</code> folder.
          </div>
          <div>
            <strong>5. Clear Cache:</strong> Try hard refresh (Ctrl+F5) or clear browser cache.
          </div>
        </div>
      </div>
    </div>
  );
}



