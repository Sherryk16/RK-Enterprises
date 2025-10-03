'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SimpleImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImages?: string[];
}

export default function SimpleImageUpload({ onImageUploaded, currentImages = [] }: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false);

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

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log('Uploading file:', fileName);
      console.log('File path:', filePath);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        alert('Upload failed: ' + error.message);
        return;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      onImageUploaded(publicUrl);
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





