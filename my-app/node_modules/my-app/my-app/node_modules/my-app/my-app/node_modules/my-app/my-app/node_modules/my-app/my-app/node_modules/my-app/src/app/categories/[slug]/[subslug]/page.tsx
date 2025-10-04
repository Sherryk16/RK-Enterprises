// app/categories/[slug]/page.tsx

import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
}

interface SubcategoryData {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  images?: string[];
  category_id: string;
  categories?: { name: string; id: string; slug: string };
  subcategory_id?: string | null;
  subcategories?: { name: string; id: string; slug: string } | null;
  rating?: number;
  reviews?: number;
  is_new?: boolean;
  is_featured?: boolean;
}

// FIXED: params is now a Promise in Next.js 15
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategoryBySlug(slug: string) {
  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !category) {
    return null;
  }

  return category as CategoryData;
}

async function getSubcategoriesByCategory(categoryId: string) {
  const { data: subcategories, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('name');

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return subcategories as SubcategoryData[];
}

async function getProductsByCategory(categoryId: string) {
  const { data: products, error } = await supabase
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
    .eq('category_id', categoryId);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products as ProductData[];
}

// FIXED: Component is now async and awaits params
export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params promise to get the actual values
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  console.log('CategoryPage: Rendering for slug:', slug);

  try {
    const category = await getCategoryBySlug(slug);
    
    if (!category) {
      console.warn('CategoryPage: Category not found for slug:', slug);
      notFound();
    }

    const [subcategories, products] = await Promise.all([
      getSubcategoriesByCategory(category.id),
      getProductsByCategory(category.id)
    ]);

    console.log('CategoryPage: Fetched category:', category, 'subcategories:', subcategories.length, 'products:', products.length);

    return (
      <div className="min-h-screen bg-white">
        <main>
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{category.name}</h1>
              <div className="mt-4">
                <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {products.length} Products Available
                </span>
              </div>
            </div>
          </section>

          {/* Subcategories Section */}
          {subcategories.length > 0 && (
            <section className="py-8 border-b">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Subcategories</h2>
                <div className="flex flex-wrap gap-3">
                  {subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/categories/${slug}/${subcategory.slug}`}
                      className="inline-block bg-gray-100 hover:bg-amber-100 text-gray-800 px-4 py-2 rounded-full transition-colors duration-200"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Products Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                  {products.map((product) => {
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
                        originalPrice={product.original_price ?? undefined}
                        category={product.categories?.name || 'Category'}
                        slug={product.slug}
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
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-6">We couldn&apos;t find products in this category.</p>
                  <Link 
                    href="/shop"
                    className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-200"
                  >
                    View All Products
                  </Link>
                </div>
              )}

              {products.length > 0 && (
                <div className="text-center mt-12 space-x-4">
                  <Link 
                    href="/shop" 
                    className="inline-block bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg whitespace-nowrap"
                  >
                    View All Products
                  </Link>
                  <Link 
                    href="/"
                    className="inline-block border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 hover:text-white transition-colors duration-300 whitespace-nowrap"
                  >
                    Return to Home
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  } catch (e: unknown) {
    console.error('CategoryPage: Error rendering category page:', e);
    notFound();
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps) {
  // Await params here too
  const { slug } = await params;
  
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return {
    title: `${category.name} - Shop`,
    description: `Browse our selection of ${category.name} products`,
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');
  
  if (!categories) return [];
  
  return categories.map((category) => ({
    slug: category.slug,
  }));
}