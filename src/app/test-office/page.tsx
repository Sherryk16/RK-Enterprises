import {
  getAllCategories,
  getAllSubcategories,
  // getProductsByFlag,
  SanityCategory,
  SanityProduct,
  SanitySubcategory,
} from '@/lib/products';
import { client } from '../../sanity/lib/client'; // Ensure this path is correct

export default async function TestOfficePage() {
  try {
    const categories: SanityCategory[] = await getAllCategories();

    const officeCategory = categories?.find(
      (cat) => cat.name?.toLowerCase().includes('office') || cat.slug?.includes('office')
    );

    // const officeProducts: SanityProduct[] = await getProductsByFlag('show_in_office');

    // const visitorProducts: SanityProduct[] = await getProductsByFlag('is_visitor_sofa');

    let subcategories: SanitySubcategory[] = [];
    const subcategoryProducts: SanityProduct[] = [];

    if (officeCategory) {
      const allSubcategories = await getAllSubcategories();
      subcategories = allSubcategories.filter(
        (sub) => sub.category && sub.category._id === officeCategory._id
      );

      for (const sub of subcategories) {
        const prods = await client.fetch<SanityProduct[]>(`*[_type == "product" && subcategory._ref == $subcategoryId] {
          _id,
          name,
          subcategory,
          category->{_id, name, "slug": slug}
        }`, { subcategoryId: sub._id });
        if (prods) {
          subcategoryProducts.push(...prods);
        }
      }
    }

    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Office Furniture Debug Test</h1>
        
        {/* Categories */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">All Categories ({categories?.length || 0})</h2>
          <div className="space-y-2">
            {categories?.map((cat: SanityCategory) => (
              <div key={cat._id} className={`p-3 rounded ${cat.name?.toLowerCase().includes('office') ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-gray-600">ID: {cat._id} | Slug: {cat.slug || 'No slug'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Office Category */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Office Furniture Category</h2>
          {officeCategory ? (
            <div className="bg-green-100 border border-green-300 p-4 rounded">
              <div className="font-semibold text-green-800">Found: {officeCategory.name}</div>
              <div className="text-sm text-green-600">ID: {officeCategory._id} | Slug: {officeCategory.slug || 'No slug'}</div>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-300 p-4 rounded text-red-800">
              No Office Furniture category found!
            </div>
          )}
        </div>
        
        {/* Office Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products with show_in_office=true (0)</h2>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded text-gray-600">No products fetched with &apos;show_in_office&apos; flag.</div>
          </div>
        </div>
        
        {/* Visitor Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Visitor Chair Products (0)</h2>
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 rounded text-gray-600">No products fetched with &apos;is_visitor_sofa&apos; flag.</div>
          </div>
        </div>
        
        {/* Subcategories */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Office Furniture Subcategories ({subcategories.length})</h2>
          <div className="space-y-2">
            {subcategories.map((sub: SanitySubcategory) => (
              <div key={sub._id} className="p-3 bg-yellow-50 rounded">
                <div className="font-semibold">{sub.name}</div>
                <div className="text-sm text-gray-600">ID: {sub._id} | Slug: {sub.slug || 'No slug'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Subcategory Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products from Office Subcategories ({subcategoryProducts.length})</h2>
          <div className="space-y-2">
            {subcategoryProducts.map((prod: SanityProduct) => (
              <div key={prod._id} className="p-3 bg-green-50 rounded">
                <div className="font-semibold">{prod.name}</div>
                <div className="text-sm text-gray-600">Category: {prod.category?.name || 'No category'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div>Total categories: {categories?.length || 0}</div>
            <div>Office Furniture category found: {officeCategory ? 'Yes' : 'No'}</div>
            <div>Products with show_in_office: 0</div>
            <div>Visitor chair products: 0</div>
            <div>Office subcategories: {subcategories.length}</div>
            <div>Products in office subcategories: {subcategoryProducts.length}</div>
            <div className="font-semibold text-lg mt-4">
              Total products that should show in Office Furniture: {subcategoryProducts.length}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: unknown) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error instanceof Error ? error.message : 'An unknown error occurred'}
        </div>
      </div>
    );
  }
}


