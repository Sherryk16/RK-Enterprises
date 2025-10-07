'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { getAllProducts, deleteProduct } from '@/lib/products';
import { ProductInput } from '@/lib/products';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface Product extends ProductInput {
  id: string;
  created_at: string;
  categories: { id: string; name: string; slug: string };
  subcategories: { id: string; name: string; slug: string } | null;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<{
    id: string;
    name: string;
    slug: string;
  }[]>([]);

  const router = useRouter();
  // const searchParams = useSearchParams(); // Removed as it's not directly used

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const allCategories = await (await import('@/lib/products')).getAllCategories();
      setCategories(allCategories || []);

      const { products: fetchedProducts, totalCount } = await getAllProducts(
        selectedCategory,
        undefined,
        undefined,
        sortBy,
        searchQuery,
        currentPage
      );
      setProducts(fetchedProducts || []);
      setTotalPages(Math.ceil(totalCount / 20));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, sortBy, searchQuery]);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    if (selectedCategory) params.set('category', selectedCategory);
    router.replace(`?${params.toString()}`);
  }, [fetchProducts, currentPage, searchQuery, sortBy, selectedCategory, router]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportCsv = () => {
    const headers = [
      'id',
      'name',
      'slug',
      'price',
      'original_price',
      'category_id',
      'category_name',
      'subcategory_id',
      'subcategory_name',
      'description',
      'detailed_description',
      'colors',
      'images',
      'is_featured',
      'show_in_office',
      'is_molded',
      'is_ceo_chair',
      'is_gaming_chair',
      'is_dining_chair',
      'is_visitor_sofa',
      'is_study_chair',
      'is_outdoor_furniture',
      'is_folding_furniture',
      'created_at',
    ];
    const rows = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      original_price: product.original_price,
      category_id: product.categories?.id,
      category_name: product.categories?.name,
      subcategory_id: product.subcategories?.id || '',
      subcategory_name: product.subcategories?.name || '',
      description: product.description,
      detailed_description: product.detailed_description,
      colors: product.colors?.join(','),
      images: product.images?.join(','),
      is_featured: product.is_featured ? 1 : 0,
      show_in_office: product.show_in_office ? 1 : 0,
      is_molded: product.is_molded ? 1 : 0,
      is_ceo_chair: product.is_ceo_chair ? 1 : 0,
      is_gaming_chair: product.is_gaming_chair ? 1 : 0,
      is_dining_chair: product.is_dining_chair ? 1 : 0,
      is_visitor_sofa: product.is_visitor_sofa ? 1 : 0,
      is_study_chair: product.is_study_chair ? 1 : 0,
      is_outdoor_furniture: product.is_outdoor_furniture ? 1 : 0,
      is_folding_furniture: product.is_folding_furniture ? 1 : 0,
      created_at: product.created_at,
    }));

    const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'products.xlsx');
  };

  const handleImportCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csvFile', file);

    setLoading(true);
    try {
      const response = await fetch('/api/admin/import-csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import CSV');
      }

      alert(result.message);
      fetchProducts();
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert(`Error importing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleAddProduct} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
          >
            Add New Product
          </button>
          <label className="bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-700 text-sm md:text-base">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleImportCsv} />
          </label>
          <button 
            onClick={exportCsv} 
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 text-sm md:text-base"
          >
            Export CSV
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md w-full sm:flex-1"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded-md w-full sm:flex-1"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded-md w-full sm:flex-1"
          >
            <option value="newest">Sort by Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-lg py-10">Loading products...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    {product.images && product.images.length > 0 && (
                      <Image src={product.images[0]} alt={product.name} width={50} height={50} className="rounded-md object-cover" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words w-1/4">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 break-words">{product.categories?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 break-words">{product.subcategories?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 break-words">PKR {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {product.is_featured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex-none">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </AdminLayout>
  );
}





