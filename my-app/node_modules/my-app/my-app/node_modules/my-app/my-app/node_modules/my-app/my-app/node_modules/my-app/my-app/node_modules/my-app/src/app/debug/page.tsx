import { debugDatabaseContents } from '@/lib/products';

interface CategoryDebugData {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

interface ProductByCategoryDebugData {
  categoryName: string;
  categorySlug: string;
  productCount: number;
}

interface ProductDebugData {
  id: string;
  name: string;
  category_id: string;
  categories?: { id: string; name: string; slug: string }[]; // Updated to match actual data structure
  show_in_office: boolean;
  slug: string;
}

interface DebugSummary {
  totalCategories: number;
  totalProducts: number;
  officeProducts: number;
  productsByCategory: ProductByCategoryDebugData[];
}

interface DebugContents {
  error?: string;
  summary?: DebugSummary;
  categories?: CategoryDebugData[];
  products?: ProductDebugData[];
}

export default async function DebugPage() {
  const debugData: DebugContents = await debugDatabaseContents();

  if (debugData.error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Debug - Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {debugData.error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database Debug Information</h1>
      
      {/* Summary */}
      {debugData.summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{debugData.summary.totalCategories}</div>
              <div className="text-sm text-gray-600">Total Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{debugData.summary.totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{debugData.summary.officeProducts}</div>
              <div className="text-sm text-gray-600">Office Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {debugData.summary.productsByCategory.find(p => p.categoryName.toLowerCase().includes('office'))?.productCount || 0}
              </div>
              <div className="text-sm text-gray-600">Office Furniture Products</div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      {debugData.categories && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Categories ({debugData.categories.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Slug</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {debugData.categories.map((category: CategoryDebugData) => (
                <tr key={category.id} className="border-b">
                  <td className="px-4 py-2 font-mono text-sm">{category.id}</td>
                  <td className="px-4 py-2 font-semibold">{category.name}</td>
                  <td className="px-4 py-2 font-mono text-sm">{category.slug || 'No slug'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{category.description || 'No description'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Products by Category */}
      {debugData.summary && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products by Category</h2>
          <div className="space-y-4">
            {debugData.summary.productsByCategory.map((item: ProductByCategoryDebugData) => (
            <div key={item.categoryName} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-semibold">{item.categoryName}</span>
                <span className="text-sm text-gray-500 ml-2">({item.categorySlug})</span>
              </div>
              <div className="text-lg font-bold text-blue-600">{item.productCount} products</div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Sample Products */}
      {debugData.products && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Products (First 10)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category ID</th>
                <th className="px-4 py-2 text-left">Category Name</th>
                <th className="px-4 py-2 text-left">Show in Office</th>
              </tr>
            </thead>
            <tbody>
              {debugData.products.slice(0, 10).map((product: ProductDebugData) => (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2 font-mono text-sm">{product.category_id}</td>
                  <td className="px-4 py-2">{product.categories?.[0]?.name || 'No category'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${product.show_in_office ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.show_in_office ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">How to Fix &quot;0 Products in Office Furniture&quot;</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Option 1:</strong> Make sure you have an &quot;Office Furniture&quot; category in your database and assign products to it via <code>category_id</code>.
          </div>
          <div>
            <strong>Option 2:</strong> Mark products with <code>show_in_office: true</code> flag - these will appear in Office Furniture even if they&apos;re in other categories.
          </div>
          <div>
            <strong>Option 3:</strong> Use the admin panel to edit products and set their category to &quot;Office Furniture&quot;.
          </div>
        </div>
      </div>
    </div>
  );
}


