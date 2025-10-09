'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { simpleSlugify } from '@/lib/utils';
import Image from 'next/image';

interface SimpleImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImages: string[]; // Pass current images to display
}

const SUPABASE_BUCKET_NAME = 'product-images';

export default function SimpleImageUpload({ onImageUploaded, currentImages }: SimpleImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleUpload = useCallback(async (fileToUpload: File | null = null) => {
    const fileToUse = fileToUpload || file;
    if (!fileToUse) {
      setUploadError('Please select a file or paste an image to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const fileExtension = fileToUse.name.split('.').pop();
    const fileName = `${simpleSlugify(fileToUse.name.replace(`.${fileExtension}`, ''))}-${Date.now()}.${fileExtension}`;
    const filePath = `products/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(filePath, fileToUse, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(filePath);

      if (data?.publicUrl) {
        onImageUploaded(data.publicUrl);
        setUploadSuccess(true);
        setFile(null); // Clear the selected file after successful upload
      } else {
        throw new Error('Failed to get public URL for the uploaded image.');
      }
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'An unknown error occurred during upload.');
    } finally {
      setUploading(false);
    }
  }, [file, onImageUploaded]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const pastedFile = items[i].getAsFile();
        if (pastedFile) {
          // Create a new File object with a unique name
          const fileName = `pasted-image-${Date.now()}.png`; // Assuming PNG for pasted images
          const imageFile = new File([pastedFile], fileName, { type: pastedFile.type });
          setFile(imageFile); // Set the file in state for the upload button
          setUploadError(null);
          setUploadSuccess(false);
          event.preventDefault(); // Prevent default paste behavior
          // Optionally, auto-upload the pasted image
          // handleUpload(imageFile);
          break;
        }
      }
    }
  }, [setFile, setUploadError, setUploadSuccess]);

  return (
    <div
      className="border border-gray-300 rounded-md p-4 mb-4 bg-gray-50"
      onPaste={handlePaste}
    >
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images or Paste Image Here</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100"
      />
      <button
        type="button"
        onClick={() => handleUpload()}
        disabled={!file || uploading}
        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {uploadError && (
        <p className="mt-2 text-sm text-red-600">Error: {uploadError}</p>
      )}
      {uploadSuccess && (
        <p className="mt-2 text-sm text-green-600">Image uploaded successfully!</p>
      )}

      {currentImages.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
          <div className="flex flex-wrap gap-2">
            {currentImages.map((imageUrl, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden bg-white">
                <Image
                  src={imageUrl}
                  alt={`Product Image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}





