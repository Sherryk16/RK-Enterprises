'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImages?: string[];
}

export default function ImageUpload({ onImageUploaded, currentImages = [] }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Check if bucket exists, if not show instructions
      const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
      
      console.log('Available buckets:', buckets);
      console.log('Looking for bucket:product-images');
      
      if (bucketListError) {
        console.error('Error listing buckets:', bucketListError);
        alert('Error accessing storage: ' + bucketListError.message);
        return;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.id === 'product-images');
      console.log('Bucket exists:', bucketExists);
      
      if (!bucketExists) {
        alert(`Storage bucket not found. Available buckets: ${buckets?.map(b => b.id).join(', ') || 'none'}. Please create a bucket named "product-images" in your Supabase dashboard first.`);
        return;
      }

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        alert('Upload failed: ' + error.message);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      setUploadProgress(100);
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Product Images
        </label>
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Uploading...' : 'Choose Image'}
            </div>
          </label>
          
          {uploading && (
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Images Preview */}
      {currentImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {currentImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border"
                />
                <button
                  onClick={() => {
                    const newImages = currentImages.filter((_, i) => i !== index);
                    // You might want to add a callback to update the parent component
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
