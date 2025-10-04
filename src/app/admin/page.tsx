'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { getAllProducts, deleteProduct } from '@/lib/products';
import Image from 'next/image'; // Import Next.js Image component

// Define Product interfaces (simplified for admin display)
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

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  images: string[];
  category_id: string;
  categories: Category; // Supabase join
  subcategory_id?: string | null;
  subcategories?: Subcategory | null; // Supabase join
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
  // Add other fields as necessary from your product schema
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { products: productsData } = await getAllProducts(undefined, undefined, undefined, undefined, undefined, 1, 1000); // Pass a high limit for admin view
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center">Loading products...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <>
        <div className="px-4 sm:px-0">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your product inventory
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add Product
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Flags
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product: Product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {product.images && product.images.length > 0 ? (
                                  <Image
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={40} // Specify width
                                    height={40} // Specify height
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    🪑
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.categories?.name}
                            {product.subcategories?.name && (
                              <span className="text-gray-500"> / {product.subcategories.name}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{product.price}
                            {product.original_price && (
                              <span className="text-gray-500 line-through ml-2">
                                ₹{product.original_price}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {product.is_featured && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Featured
                                </span>
                              )}
                              {product.is_ceo_chair && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  CEO Chair
                                </span>
                              )}
                              {product.is_molded && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Molded
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
          />
        )}
      </>
    </AdminLayout>
  );
}





