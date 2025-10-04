'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { useState } from 'react';

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file to upload.');
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    setMessage('Importing products...');
    setIsError(false);

    try {
      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Products imported successfully!');
        setIsError(false);
        setFile(null); // Clear file input
      } else {
        setMessage(data.error || 'Failed to import products.');
        setIsError(true);
      }
    } catch (error: unknown) {
      console.error('Error uploading CSV:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof Error) {
        errorMessage = 'An unexpected error occurred: ' + error.message;
      } else if (typeof error === 'string') {
        errorMessage = 'An unexpected error occurred: ' + error;
      }
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Import Products from CSV</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <div className="mb-4">
            <label htmlFor="csvFile" className="block text-gray-700 text-sm font-bold mb-2">
              Upload CSV File:
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!file}
            >
              Import Products
            </button>
          </div>
          {message && (
            <p className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
