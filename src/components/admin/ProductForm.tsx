'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import SimpleImageUpload from './SimpleImageUpload'; // Import the SimpleImageUpload component

interface ProductFormData {
  name: string;
  slug: string;
  price: string;
  original_price: string;
  category_id: string | null;
  subcategory_id: string | null;
  description: string;
  detailed_description: string;
  colors: string[];
  images: string[];
  is_featured: boolean;
  show_in_office: boolean;
  is_molded: boolean;
  is_ceo_chair: boolean;
  is_gaming_chair: boolean;
  is_dining_chair: boolean;
  is_visitor_sofa: boolean;
  is_study_chair: boolean;
  is_outdoor_furniture: boolean;
  is_folding_furniture: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface ProductProps {
  id?: string;
  name?: string;
  slug?: string;
  price?: string | number;
  original_price?: string | number | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  description?: string;
  detailed_description?: string;
  colors?: string[];
  images?: string[];
  is_featured?: boolean;
  show_in_office?: boolean;
  is_molded?: boolean;
  is_ceo_chair?: boolean;
  is_gaming_chair?: boolean;
  is_dining_chair?: boolean;
  is_visitor_sofa?: boolean;
  is_study_chair?: boolean;
  is_outdoor_furniture?: boolean;
  is_folding_furniture?: boolean;
}

export default function ProductForm({
  product,
  onClose
}: {
  product: ProductProps | null;
  onClose: () => void
}) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    price: '',
    original_price: '',
    category_id: '',
    subcategory_id: '',
    description: '',
    detailed_description: '',
    colors: [''],
    images: [''],
    is_featured: false,
    show_in_office: false,
    is_molded: false,
    is_ceo_chair: false,
    is_gaming_chair: false,
    is_dining_chair: false,
    is_visitor_sofa: false,
    is_study_chair: false,
    is_outdoor_furniture: false,
    is_folding_furniture: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(''); // New state for manual image URL

  // Fetch categories from Supabase
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, []);

  // Fetch subcategories for a specific category
  const fetchSubcategoriesForCategory = useCallback(async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('subcategories') // Directly query subcategories table
        .select('id, name, slug')
        .eq('category_id', categoryId)
        .order('name');

      if (error) throw error;

      setSubcategories(data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  }, []);

  // Initialize form with product data if editing
  useEffect(() => {
    fetchCategories();

    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        price: String(product.price || ''),
        original_price: String(product.original_price || ''),
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        description: product.description || '',
        detailed_description: product.detailed_description || '',
        colors: product.colors || [''],
        images: product.images || [''],
        is_featured: product.is_featured || false,
        show_in_office: product.show_in_office || false,
        is_molded: product.is_molded || false,
        is_ceo_chair: product.is_ceo_chair || false,
        is_gaming_chair: product.is_gaming_chair || false,
        is_dining_chair: product.is_dining_chair || false,
        is_visitor_sofa: product.is_visitor_sofa || false,
        is_study_chair: product.is_study_chair || false,
        is_outdoor_furniture: product.is_outdoor_furniture || false,
        is_folding_furniture: product.is_folding_furniture || false,
      });

      // Load subcategories if category is set
      if (product.category_id) {
        fetchSubcategoriesForCategory(product.category_id);
      }
    }
  }, [product, fetchCategories, fetchSubcategoriesForCategory]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: '' // Reset subcategory when category changes
    }));

    if (categoryId) {
      fetchSubcategoriesForCategory(categoryId);
    } else {
      setSubcategories([]);
    }
  };

  // Generate unique slug
  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const timestamp = Date.now().toString().slice(-6);
    return `${baseSlug}-${timestamp}`;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        slug: product?.id ? formData.slug : generateSlug(formData.name),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        description: formData.description,
        detailed_description: formData.detailed_description,
        colors: formData.colors.filter(color => color.trim() !== ''),
        images: formData.images.filter(img => img.trim() !== ''),
        is_featured: formData.is_featured,
        show_in_office: formData.show_in_office,
        is_molded: formData.is_molded,
        is_ceo_chair: formData.is_ceo_chair,
        is_gaming_chair: formData.is_gaming_chair,
        is_dining_chair: formData.is_dining_chair,
        is_visitor_sofa: formData.is_visitor_sofa,
        is_study_chair: formData.is_study_chair,
        is_outdoor_furniture: formData.is_outdoor_furniture,
        is_folding_furniture: formData.is_folding_furniture,
      };

      let result;
      if (product?.id) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
      } else {
        // Insert new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }

      if (result.error) throw result.error;

      alert('Product saved successfully!');
      onClose();
    } catch (error: unknown) {
      console.error('Error saving product:', JSON.stringify(error, null, 2));
      alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Color management
  const addColor = () => {
    setFormData(prev => ({ ...prev, colors: [...prev.colors, ''] }));
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => i === index ? value : color)
    }));
  };

  // Image management
  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
  };

  const addManualImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl(''); // Clear input after adding
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (Auto-generated)</label>
                <input
                  type="text"
                  value={formData.name ? generateSlug(formData.name) : ''}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Original Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category *</label>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={formData.subcategory_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory_id: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!formData.category_id || subcategories.length === 0}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
              <textarea
                value={formData.detailed_description}
                onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>

            {/* Color Management Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
              {formData.colors.map((color, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Red, Blue"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                Add Color
              </button>
            </div>

            {/* Image Upload Section */}
            <SimpleImageUpload 
              onImageUploaded={handleImageUploaded}
              currentImages={formData.images}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (Manually Added)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Paste image URL here"
                />
                <button
                  type="button"
                  onClick={addManualImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add URL
                </button>
              </div>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Product Tags</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[ 
                  { key: 'is_featured', label: 'Featured' },
                  { key: 'show_in_office', label: 'Office' },
                  { key: 'is_molded', label: 'Molded' },
                  { key: 'is_ceo_chair', label: 'CEO Chair' },
                  { key: 'is_gaming_chair', label: 'Gaming Chair' },
                  { key: 'is_dining_chair', label: 'Dining Chair' },
                  { key: 'is_visitor_sofa', label: 'Visitor Sofa' },
                  { key: 'is_study_chair', label: 'Study Chair' },
                  { key: 'is_outdoor_furniture', label: 'Outdoor' },
                  { key: 'is_folding_furniture', label: 'Folding' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[key as keyof ProductFormData] as boolean}
                      onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}