import { getAllProducts } from '@/lib/products';
import ProductImageDebug from '@/components/ProductImageDebug';

export default async function ProductImageTestPage() {
  try {
    const products = await getAllProducts();
    
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Image Debug</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div><strong>Total Products:</strong> {products?.length || 0}</div>
            <div><strong>Products with Images:</strong> {products?.filter(p => p.images && p.images.length > 0)?.length || 0}</div>
            <div><strong>Products without Images:</strong> {products?.filter(p => !p.images || p.images.length === 0)?.length || 0}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.slice(0, 12).map((product: any) => (
            <ProductImageDebug key={product.id} product={product} />
          ))}
        </div>

        {products && products.length > 12 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">Showing first 12 products. Total: {products.length}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }
}


