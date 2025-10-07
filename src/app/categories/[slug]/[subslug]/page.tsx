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
interface SubcategoryPageProps {
  params: Promise<{ slug: string; subslug: string }>;
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

async function getSubcategoryBySlug(subslug: string) {
  const { data: subcategory, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('slug', subslug)
    .single();

  if (error || !subcategory) {
    return null;
  }

  return subcategory as SubcategoryData;
}

async function getProductsBySubcategory(subcategoryId: string) {
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
    .eq('subcategory_id', subcategoryId);

  if (error) {
    console.error('Error fetching products by subcategory:', error);
    return [];
  }

  return products as ProductData[];
}

// FIXED: Component is now async and awaits params
export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  // Await the params promise to get the actual values
  const { slug, subslug } = await params;
  
  if (!slug || !subslug) {
    notFound();
  }

  console.log('SubcategoryPage: Rendering for slug:', slug, 'subslug:', subslug);

  try {
    const category = await getCategoryBySlug(slug);
    const subcategory = await getSubcategoryBySlug(subslug);
    
    if (!category || !subcategory) {
      console.warn('SubcategoryPage: Category or subcategory not found for slug:', slug, 'subslug:', subslug);
      notFound();
    }

    const products = await getProductsBySubcategory(subcategory.id);

    console.log('SubcategoryPage: Fetched category:', category, 'subcategory:', subcategory, 'products:', products.length);

    return (
      <div className="min-h-screen bg-white">
        <main>
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{subcategory.name}</h1>
              <p className="text-lg text-gray-600 mb-4">Part of the {category.name} collection</p>
              <div className="mt-4">
                <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {products.length} Products Available
                </span>
              </div>
            </div>
          </section>

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
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found in {subcategory.name}</h3>
                  <p className="text-gray-600 mb-6">We couldn&apos;t find any products in this subcategory.</p>
                  <Link 
                    href={`/categories/${slug}`}
                    className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-200"
                  >
                    Back to {category.name}
                  </Link>
                  <Link 
                    href="/shop"
                    className="ml-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200"
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
    console.error('SubcategoryPage: Error rendering subcategory page:', e);
    notFound();
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: SubcategoryPageProps) {
  // Await params here too
  const { slug, subslug } = await params;
  
  const category = await getCategoryBySlug(slug);
  const subcategory = await getSubcategoryBySlug(subslug);
  
  if (!category || !subcategory) {
    return {
      title: 'Subcategory Not Found',
    };
  }
  
  return {
    title: `${subcategory.name} - ${category.name} Products`,
    description: `Browse our selection of ${subcategory.name} products from the ${category.name} collection.`,
  };
}

// Generate static params for all categories and subcategories
export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, subcategories(slug)');
  
  if (!categories) return [];

  const params = categories.flatMap((category) => {
    if (!category.subcategories || category.subcategories.length === 0) {
      return { slug: category.slug, subslug: '' }; // Handle categories without subcategories if necessary
    }
    return category.subcategories.map((sub: { slug: string }) => ({
      slug: category.slug,
      subslug: sub.slug,
    }));
  });
  
  return params.filter(p => p.subslug !== ''); // Filter out categories without subslug for subcategory page
}