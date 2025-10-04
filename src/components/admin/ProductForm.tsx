'use client';

import { useState, useEffect, useCallback } from 'react';
import { upsertProduct, getCategoriesWithSubcategories } from '@/lib/products';
import SimpleImageUpload from './SimpleImageUpload';

interface ProductFormData {
  name: string;
  slug: string;
  price: string;
  original_price: string;
  category_id: string;
  subcategory_id: string;
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

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_subcategories?: { subcategory_id: SubcategoryData[] }[]; // Nested structure from Supabase
}

interface SubcategoryData {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
}

interface TransformedCategoryData extends CategoryData {
  subcategories: SubcategoryData[]; // Flattened structure for client-side use
}

interface ProductProps {
  id?: string;
  name?: string;
  slug?: string;
  price?: string | number;
  original_price?: string | number | null;
  category_id?: string;
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

export default function ProductForm({ product, onClose }: { product: ProductProps | null; onClose: () => void }) {
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

  const [categories, setCategories] = useState<TransformedCategoryData[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const data: CategoryData[] | null = await getCategoriesWithSubcategories();
      const transformedCategories = (data || []).map((cat: CategoryData) => ({
        ...cat,
        subcategories: (cat.category_subcategories || []).flatMap((link: { subcategory_id: SubcategoryData[] }) => link.subcategory_id || [])
      }));
      setCategories(transformedCategories);

      if (product && product.category_id) {
        const selectedCat = transformedCategories.find((c) => c.id === product.category_id);
        if (selectedCat) {
          setSubcategories(selectedCat.subcategories || []);
        }
      }

    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setSubcategories([]);
    }
  }, [product]); // Add product to dependencies

  useEffect(() => {
    const loadCategoriesAndProduct = async () => {
      await fetchCategories();

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

        if (product.category_id) {
          const allCats = await getCategoriesWithSubcategories();
          const selectedCategory = (allCats || []).find((c: CategoryData) => c.id === product.category_id);
          if (selectedCategory && selectedCategory.category_subcategories) {
            const flatSubcategories = selectedCategory.category_subcategories.flatMap((link: { subcategory_id: SubcategoryData[] }) => link.subcategory_id || []);
            setSubcategories(flatSubcategories);
          }
        }
      }
    };
    loadCategoriesAndProduct();
  }, [product, fetchCategories]); // Add fetchCategories to useEffect dependencies

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setSubcategories(category.subcategories || []);
    } else {
      setSubcategories([]);
    }
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await upsertProduct({
        ...formData,
        id: product?.id,
        slug: generateSlug(formData.name),
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        colors: formData.colors.filter(color => color.trim() !== ''),
        images: formData.images.filter(img => img.trim() !== ''),
      });
      onClose();
    } catch (error: unknown) {
      console.error('Error saving product:', error);
      let errorMessage = 'Error saving product';
      if (error instanceof Error) {
        errorMessage = `Error saving product: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = `Error saving product: ${error}`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
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

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (Auto-generated)</label>
                <input
                  type="text"
                  value={generateSlug(formData.name)}
                  disabled
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category: TransformedCategoryData) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={formData.subcategory_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory_id: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!formData.category_id || subcategories.length === 0}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory: SubcategoryData) => (
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
              <textarea
                value={formData.detailed_description}
                onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Colors</label>
              {formData.colors.map((color, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Color name"
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
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Color
              </button>
            </div>

            <div>
              <SimpleImageUpload 
                onImageUploaded={handleImageUploaded}
                currentImages={formData.images.filter(img => img.trim() !== '')}
              />
              
              {/* Manual URL input as backup */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Or add image URLs manually:</label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Image URL"
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
                <button
                  type="button"
                  onClick={addImage}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add URL
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.show_in_office}
                  onChange={(e) => setFormData(prev => ({ ...prev, show_in_office: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Office</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_ceo_chair}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_ceo_chair: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">CEO Chair</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_molded}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_molded: e.target.checked }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Molded</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
