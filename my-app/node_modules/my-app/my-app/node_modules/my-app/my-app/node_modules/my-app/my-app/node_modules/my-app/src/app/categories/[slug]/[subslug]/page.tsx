import ProductCard from '@/components/ProductCard';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getSharedSubcategories } from '@/lib/products';
import { simpleSlugify } from '@/lib/utils'; // Import simpleSlugify
import Link from 'next/link'; // Added import for Link

interface CategoryData {
  id: string;
  name: string;
  slug: string;
}

interface SubcategoryData {
  id: string;
  name: string;
  slug: string;
  category_id?: string; // Optional if a shared subcategory
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

interface SubcategoryPageProps {
  params: { slug: string; subslug: string }; // Revert params type
}

async function getCategoryAndSubcategory(categorySlug: string, subcategorySlug: string) {
  console.log('getCategoryAndSubcategory: Fetching for categorySlug:', categorySlug, 'subcategorySlug:', subcategorySlug); // DEBUG
  
  const { data: categoryData, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();
  
  let category: CategoryData | null = categoryData;

  if (catErr || !category) {
    const { data: allCategories } = await supabase.from('categories').select('*') as { data: CategoryData[] | null };
    category = (allCategories || []).find((c: CategoryData) => simpleSlugify(c.name || '') === categorySlug) || null;
  }
  
  console.log('getCategoryAndSubcategory: Fetched category:', category); // DEBUG
  if (!category) return { category: null, subcategory: null };

  const sharedSubcategories = await getSharedSubcategories();
  const sharedSub = sharedSubcategories.find((sub: SubcategoryData & { categories: string[] }) => 
    sub.slug === subcategorySlug && (
      sub.categories.includes(categorySlug) ||
      sub.categories.includes(category.slug) ||
      (category.name && sub.categories.some((slug: string) => 
        simpleSlugify(category.name).includes(simpleSlugify(slug)) || 
        simpleSlugify(slug).includes(simpleSlugify(category.name))
      ))
    )
  ) as (SubcategoryData & { categories: string[] }) | undefined;
  
  if (sharedSub) {
    console.log('getCategoryAndSubcategory: Found shared subcategory:', sharedSub); // DEBUG
    return { 
      category, 
      subcategory: {
        id: sharedSub.id,
        name: sharedSub.name,
        slug: sharedSub.slug,
        category_id: category.id
      }
    };
  }

  const { data: subcategoryData, error: subErr } = await supabase
    .from('subcategories')
    .select('*')
    .eq('slug', subcategorySlug)
    .eq('category_id', category.id)
    .single();
  
  let subcategory: SubcategoryData | null = subcategoryData;

  if (subErr || !subcategory) {
    const { data: allSubcategories } = await supabase
      .from('subcategories')
      .select('*') as { data: SubcategoryData[] | null };
    subcategory = (allSubcategories || []).find((s: SubcategoryData) => simpleSlugify(s.name || '') === subcategorySlug) || null;
  }
  
  console.log('getCategoryAndSubcategory: Fetched subcategory:', subcategory); // DEBUG
  return { category, subcategory };
}

async function getProductsBySubcategorySlug(categorySlug: string, subcategorySlug: string) {
  console.log('getProductsBySubcategorySlug: Fetching products for categorySlug:', categorySlug, 'subcategorySlug:', subcategorySlug); // DEBUG
  const { category, subcategory } = await getCategoryAndSubcategory(categorySlug, subcategorySlug);
  console.log('getProductsBySubcategorySlug: Resolved category:', category, 'Resolved subcategory:', subcategory); // DEBUG
  if (!category || !subcategory) return { category, subcategory, products: [] };

  const sharedSubcategories = await getSharedSubcategories();
  const isSharedSubcategory = sharedSubcategories.some((sub: SubcategoryData & { categories: string[] }) => 
    sub.slug === subcategorySlug && (
      sub.categories.includes(categorySlug) ||
      sub.categories.includes(category.slug) ||
      (category.name && sub.categories.some((slug: string) => 
        simpleSlugify(category.name).includes(simpleSlugify(slug)) || 
        simpleSlugify(slug).includes(simpleSlugify(category.name))
      ))
    )
  );

  let products: ProductData[];
  if (isSharedSubcategory) {
    console.log('getProductsBySubcategorySlug: Handling as shared subcategory.'); // DEBUG
    const { data: realSubcategory } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', subcategorySlug)
      .single();
    
    if (realSubcategory) {
      console.log('getProductsBySubcategorySlug: Found real subcategory for shared subcategory.', realSubcategory); // DEBUG
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
        `) as { data: ProductData[] | null, error: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (error) {
        console.error('getProductsBySubcategorySlug: Error fetching products for real subcategory:', error); // DEBUG
        throw error;
      }
      products = data || [];
    } else {
      console.log('getProductsBySubcategorySlug: No real subcategory found for shared subcategory, falling back to name/flag search.'); // DEBUG
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
        `) as { data: ProductData[] | null, error: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (error) {
        console.error('getProductsBySubcategorySlug: Error fetching products for shared subcategory fallback:', error); // DEBUG
        throw error;
      }
      products = data || [];
    }
  } else {
    console.log('getProductsBySubcategorySlug: Handling as regular subcategory.'); // DEBUG
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
      `) as { data: ProductData[] | null, error: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (error) {
      console.error('getProductsBySubcategorySlug: Error fetching products for regular subcategory:', error); // DEBUG
      throw error;
    }
    products = data || [];
  }
  
  console.log('getProductsBySubcategorySlug: Final products fetched:', products.length); // DEBUG
  return { category, subcategory, products };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subslug } = params; // Destructure from the params object

  console.log('SubcategoryPage: Rendering for slug:', slug, 'subslug:', subslug); // DEBUG

  try {
    const { category, subcategory, products } = await getProductsBySubcategorySlug(slug, subslug);
    console.log('SubcategoryPage: Fetched category:', category, 'subcategory:', subcategory, 'products:', products.length); // DEBUG
    if (!category || !subcategory) {
      console.warn('SubcategoryPage: Category or subcategory not found. slug:', slug, 'subslug:', subslug); // DEBUG
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        
        <main>
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">{subcategory.name}</h1>
              <p className="text-gray-600">{category.name}</p>
              <div className="mt-4">
                <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {products.length} Products Available
                </span>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                  {products.map((product: ProductData) => {
                    let discountPercentage = 0;
                    if (product.original_price && product.original_price > product.price) {
                      discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                    }
                    console.log('SubcategoryPage: Rendering ProductCard for product slug:', product.slug); // DEBUG LOG
                    return (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.original_price ?? undefined}
                        category={product.categories?.name || product.category_id}
                        slug={product.slug} // Ensure slug is correctly passed
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
                  <p className="text-gray-600 mb-6">We couldn&apos;t find products in this subcategory.</p>
                  <Link 
                    href="/shop" // Changed to link to the main shop page
                    className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-200"
                  >
                    View All Products // Changed text
                  </Link>
                </div>
              )}

              {/* View All Products and Return to Home buttons - always at the end if products are displayed */}
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
    console.error('SubcategoryPage: Error rendering subcategory page:', e); // DEBUG
    notFound();
  }
}

export async function generateStaticParams() {
  const { data: categories } = await supabase.from('categories').select('id, slug') as { data: CategoryData[] | null };
  if (!categories) return [];
  const { data: subcategories } = await supabase.from('subcategories').select('id, slug, category_id') as { data: SubcategoryData[] | null };
  if (!subcategories) return [];
  const params: Array<{ slug: string; subslug: string }> = [];
  for (const cat of categories) {
    for (const sub of subcategories.filter((s: SubcategoryData) => s.category_id === cat.id)) {
      params.push({ slug: cat.slug, subslug: sub.slug });
    }
  }
  return params;
}


