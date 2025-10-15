import ProductCard from '@/components/ProductCard';
import {
  getProductsByCategory,
  getCategoryBySlug,
  getAllCategories,
  SanityCategory,
  SanityProduct,
} from '@/lib/products';
import { urlForImage } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  console.log('=== DEBUG CATEGORY PAGE ===');
  console.log('Slug received by CategoryPage:', slug);

  try {
    let category: SanityCategory | null = null;
    let products: SanityProduct[] = [];

    // Try normal slug lookup first
    category = await getCategoryBySlug(slug);
    const { products: fetchedProducts } = await getProductsByCategory(slug);
    products = fetchedProducts;

    console.log('=== DEBUG CATEGORY PAGE ===');
    console.log('Slug received by CategoryPage:', slug);
    console.log('Category found by getCategoryBySlug:', category);
    console.log('Initial products fetched by getProductsByCategory:', products.length);

    if (!category) {
      // Fallback: If not found by direct slug, try finding by name after slugifying
      const allCategories = await getAllCategories();
      const fallbackCategory = (allCategories || []).find(
        (cat: SanityCategory) => cat.slug === slug
      );
      if (!fallbackCategory) {
        notFound();
      }
      category = fallbackCategory;
      const { products: fallbackProducts } = await getProductsByCategory(category.slug);
      products = fallbackProducts;
      console.log('Fallback category found:', category);
      console.log('Products after fallback:', products.length);
    }

    if (!category) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        <main>
          {/* Category Header */}
          <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  {category?.name}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  Browse our collection of premium {category?.name.toLowerCase()}
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
                  {products.map((product: SanityProduct) => {
                    let discountPercentage = 0;
                    if (product.original_price && product.original_price > product.price) {
                      discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                    }

                    return (
                      <ProductCard
                        key={product._id}
                        id={product._id}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.original_price ?? undefined}
                        category={product.category?.name || ''}
                        slug={product.slug}
                        rating={product.rating || 4.5}
                        reviews={product.reviews || 0}
                        isNew={product.is_new || false}
                        discount={discountPercentage}
                        image={product.images?.[0] ? urlForImage(product.images[0]).url() : "/placeholder-product.jpg"}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🪑</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-6">
                    We&apos;re working on adding more products to this category.
                  </p>
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
  } catch (error: unknown) {
    console.error('Error loading category page:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return (categories || [])
      .filter((category: SanityCategory) => category.slug)
      .map((category: SanityCategory) => ({ slug: category.slug }));
  } catch (e) {
    console.error('Error generating static params for categories:', e);
    return [];
  }
}

export async function generateMetadata(props: CategoryPageProps) {
  const params = await props.params;
  const slug = params.slug;
  
  if (!slug) {
    return {
      title: 'Category Not Found',
      description: 'The requested category was not found.',
    };
  }
  
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category was not found.',
    };
  }

  return {
    title: `${category.name} Chairs & Furniture | RK Enterprises Hub Pakistan`,
    description: `Explore a vast selection of premium imported ${category.name.toLowerCase()} chairs and furniture at RK Enterprises Hub. Find durable office chairs, ergonomic gaming chairs, comfortable dining sets, and stylish visitor benches. Best prices with nationwide delivery in Pakistan.`,
  };
}