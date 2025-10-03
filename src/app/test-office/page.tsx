import { supabase } from '@/lib/supabase';

export default async function TestOfficePage() {
  try {
    // Test 1: Get all categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    // Test 2: Find Office Furniture category
    const officeCategory = categories?.find(cat => 
      cat.name?.toLowerCase().includes('office') || 
      cat.slug?.includes('office')
    );
    
    // Test 3: Get products with show_in_office flag
    const { data: officeProducts, error: officeError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        show_in_office,
        categories:category_id (
          id,
          name,
          slug
        )
      `)
      .eq('show_in_office', true);
    
    // Test 4: Get visitor chair products
    const { data: visitorProducts, error: visitorError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        is_visitor_sofa,
        categories:category_id (
          id,
          name,
          slug
        )
      `)
      .or(`name.ilike.%visitor%,name.ilike.%chair%,is_visitor_sofa.eq.true`);
    
    // Test 5: Get subcategories of Office Furniture
    let subcategories = [];
    let subcategoryProducts = [];
    if (officeCategory) {
      const { data: subs, error: subError } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', officeCategory.id);
      
      subcategories = subs || [];
      
      // Get products from subcategories
      for (const sub of subcategories) {
        const { data: subProds, error: subProdError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            subcategory_id,
            categories:category_id (
              id,
              name,
              slug
            )
          `)
          .eq('subcategory_id', sub.id);
        
        if (!subProdError && subProds) {
          subcategoryProducts.push(...subProds);
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
            {categories?.map((cat: any) => (
              <div key={cat.id} className={`p-3 rounded ${cat.name?.toLowerCase().includes('office') ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-gray-600">ID: {cat.id} | Slug: {cat.slug || 'No slug'}</div>
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
              <div className="text-sm text-green-600">ID: {officeCategory.id} | Slug: {officeCategory.slug || 'No slug'}</div>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-300 p-4 rounded text-red-800">
              No Office Furniture category found!
            </div>
          )}
        </div>
        
        {/* Office Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products with show_in_office=true ({officeProducts?.length || 0})</h2>
          <div className="space-y-2">
            {officeProducts?.map((prod: any) => (
              <div key={prod.id} className="p-3 bg-blue-50 rounded">
                <div className="font-semibold">{prod.name}</div>
                <div className="text-sm text-gray-600">Category: {prod.categories?.name || 'No category'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Visitor Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Visitor Chair Products ({visitorProducts?.length || 0})</h2>
          <div className="space-y-2">
            {visitorProducts?.map((prod: any) => (
              <div key={prod.id} className="p-3 bg-purple-50 rounded">
                <div className="font-semibold">{prod.name}</div>
                <div className="text-sm text-gray-600">Category: {prod.categories?.name || 'No category'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Subcategories */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Office Furniture Subcategories ({subcategories.length})</h2>
          <div className="space-y-2">
            {subcategories.map((sub: any) => (
              <div key={sub.id} className="p-3 bg-yellow-50 rounded">
                <div className="font-semibold">{sub.name}</div>
                <div className="text-sm text-gray-600">ID: {sub.id} | Slug: {sub.slug || 'No slug'}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Subcategory Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Products from Office Subcategories ({subcategoryProducts.length})</h2>
          <div className="space-y-2">
            {subcategoryProducts.map((prod: any) => (
              <div key={prod.id} className="p-3 bg-green-50 rounded">
                <div className="font-semibold">{prod.name}</div>
                <div className="text-sm text-gray-600">Category: {prod.categories?.name || 'No category'}</div>
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
            <div>Products with show_in_office: {officeProducts?.length || 0}</div>
            <div>Visitor chair products: {visitorProducts?.length || 0}</div>
            <div>Office subcategories: {subcategories.length}</div>
            <div>Products in office subcategories: {subcategoryProducts.length}</div>
            <div className="font-semibold text-lg mt-4">
              Total products that should show in Office Furniture: {(officeProducts?.length || 0) + (visitorProducts?.length || 0) + subcategoryProducts.length}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }
}


