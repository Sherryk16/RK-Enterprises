import ProductCard from '@/components/ProductCard';
import { getProductsByCategory, getCategoryBySlug, getAllCategories } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
// Removed import { use } from 'react';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // Debug log for slug
  console.log('=== DEBUG CATEGORY PAGE ===');
  console.log('Slug received by CategoryPage:', slug);

  try {
    // Try normal slug lookup first
    let [category, products] = await Promise.all([
      getCategoryBySlug(slug),
      getProductsByCategory(slug)
    ]);

    console.log('=== DEBUG CATEGORY PAGE ===');
    console.log('Slug received by CategoryPage:', slug);
    console.log('Category found by getCategoryBySlug:', category);
    console.log('Initial products fetched by getProductsByCategory:', products.length);

    // If this is Office Furniture, add visitor chairs and office products
    if (category && (category.name?.toLowerCase().includes('office') || category.slug?.includes('office'))) {
      console.log('Detected Office Furniture category (normal case), fetching additional products...');
      
      // Get ALL visitor chair products (regardless of their main category)
      const { data: visitorProducts, error: visitorError } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          ),
          subcategories:subcategory_id (
            id,
            name,
            slug
          )
        `)
        .or(`name.ilike.%visitor%,name.ilike.%chair%,is_visitor_sofa.eq.true`)
        .order('created_at', { ascending: false });
      
      console.log('Visitor products found:', visitorProducts?.length || 0);
      
      // Get products with show_in_office flag
      const { data: officeProducts, error: officeError } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          ),
          subcategories:subcategory_id (
            id,
            name,
            slug
          )
        `)
        .eq('show_in_office', true)
        .order('created_at', { ascending: false });
      
      console.log('Office products found:', officeProducts?.length || 0);
      
      // Merge all products, avoiding duplicates
      const allProducts = [...products];
      const existingIds = new Set(products.map(p => p.id));
      
      // Add visitor products first (these are the main ones you want)
      if (!visitorError && visitorProducts) {
        const newVisitorProducts = visitorProducts.filter(p => !existingIds.has(p.id));
        allProducts.push(...newVisitorProducts);
        newVisitorProducts.forEach(p => existingIds.add(p.id));
      }
      
      // Add office products
      if (!officeError && officeProducts) {
        const newOfficeProducts = officeProducts.filter(p => !existingIds.has(p.id));
        allProducts.push(...newOfficeProducts);
        newOfficeProducts.forEach(p => existingIds.add(p.id));
      }
      
      products = allProducts;
      console.log('Final products count (normal case):', products.length);
    }

    if (!category) {
      // Fallback: try to find by name-derived slug
      const slugify = (text: string) => text.toString().trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      // Load all categories and try matching on slugified names
      const cats = await getAllCategories();
      console.log('All categories:', cats);
      const fallback = (cats || []).find((c: any) => slugify(c.name || '') === slug);
      console.log('Fallback category:', fallback);
      if (!fallback) {
        notFound();
      }
      category = fallback;
      // fetch products by category id
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug
          ),
          subcategories:subcategory_id (
            id,
            name,
            slug
          )
        `)
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      products = data || [];
      console.log('Products after fallback:', products.length);
      
      // If this is Office Furniture, also include office products and visitor chairs
      if (category.name?.toLowerCase().includes('office') || category.slug?.includes('office')) {
        console.log('Detected Office Furniture category, fetching additional products...');
        
        // Get ALL visitor chair products (regardless of their main category)
        const { data: visitorProducts, error: visitorError } = await supabase
          .from('products')
          .select(`
            *,
            categories:category_id (
              id,
              name,
              slug
            ),
            subcategories:subcategory_id (
              id,
              name,
              slug
            )
          `)
          .or(`name.ilike.%visitor%,name.ilike.%chair%,is_visitor_sofa.eq.true`)
          .order('created_at', { ascending: false });
        
        console.log('Visitor products found:', visitorProducts?.length || 0);
        
        // Get products with show_in_office flag
        const { data: officeProducts, error: officeError } = await supabase
          .from('products')
          .select(`
            *,
            categories:category_id (
              id,
              name,
              slug
            ),
            subcategories:subcategory_id (
              id,
              name,
              slug
            )
          `)
          .eq('show_in_office', true)
          .order('created_at', { ascending: false });
        
        console.log('Office products found:', officeProducts?.length || 0);
        
        // Merge all products, avoiding duplicates
        const allProducts = [...products];
        const existingIds = new Set(products.map(p => p.id));
        
        // Add visitor products first (these are the main ones you want)
        if (!visitorError && visitorProducts) {
          const newVisitorProducts = visitorProducts.filter(p => !existingIds.has(p.id));
          allProducts.push(...newVisitorProducts);
          newVisitorProducts.forEach(p => existingIds.add(p.id));
        }
        
        // Add office products
        if (!officeError && officeProducts) {
          const newOfficeProducts = officeProducts.filter(p => !existingIds.has(p.id));
          allProducts.push(...newOfficeProducts);
          newOfficeProducts.forEach(p => existingIds.add(p.id));
        }
        
        products = allProducts;
        console.log('Final products count:', products.length);
      }
    }

    return (
      <div className="min-h-screen bg-white">
        
        <main>
          {/* Category Header */}
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  {category.name}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  {category.description}
                </p>
                <div className="mt-4">
                  <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {products.length} Products Available
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                  {products.map((product) => {
                    // Calculate discount percentage if original_price exists
                    let discountPercentage = 0;
                    if (product.original_price && product.original_price > product.price) {
                      discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                    }

                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.original_price}
                        category={product.categories?.name || product.category}
                        slug={product.slug} // Pass the slug here
                        rating={product.rating || 4.5}
                        reviews={product.reviews || 0}
                        isNew={product.is_new || false}
                        discount={discountPercentage}
                        image={product.images?.[0] || "/placeholder-product.jpg"}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🪑</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-6">
                    We're working on adding more products to this category.
                  </p>
                  <a 
                    href="/shop" 
                    className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-200"
                  >
                    View All Products
                  </a>
                </div>
              )}

              {/* View All Products and Return to Home buttons - always at the end if products are displayed */}
              {products.length > 0 && (
                <div className="text-center mt-12 space-x-4">
                  <a 
                    href="/shop" 
                    className="inline-block bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg whitespace-nowrap"
                  >
                    View All Products
                  </a>
                  <a 
                    href="/" 
                    className="inline-block border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 hover:text-white transition-colors duration-300 whitespace-nowrap"
                  >
                    Return to Home
                  </a>
                </div>
              )}
            </div>
          </section>
        </main>

      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}

// Generate static params for categories from database
export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return (categories || []).map((category: any) => ({ slug: category.slug }));
  } catch (e) {
    return [];
  }
}
