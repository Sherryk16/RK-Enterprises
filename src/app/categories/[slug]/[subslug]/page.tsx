// app/categories/[slug]/page.tsx
import ProductCard from '@/components/ProductCard';
import {
  getCategoryBySlug,
  getProductsByCategory,
  getProductsBySubcategory, // Import this
  getSubcategoryBySlug, // Import this
  SanityCategory,
  SanityProduct,
  SanitySubcategory, // Import this
  getAllCategories,
  getSubcategoriesByCategoryRef, // Import this
} from '@/lib/products';
import { urlForImage } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subslug: string }>;
}

export default async function SubcategoryPage(props: SubcategoryPageProps) {
  const params = await props.params;
  const { slug, subslug } = params;

  if (!slug || !subslug) {
    notFound();
  }

  const category = await getCategoryBySlug(slug);
  const subcategory = await getSubcategoryBySlug(subslug);

  if (!category || !subcategory) {
    notFound();
  }

  const { products } = await getProductsBySubcategory(subslug);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{subcategory.name}</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Explore our premium collection of {subcategory.name.toLowerCase()} in {category.name.toLowerCase()}
            </p>
            <div className="mt-6">
              <span className="bg-white text-amber-600 px-6 py-2 rounded-full text-sm font-semibold">
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
                {products.map((product: SanityProduct) => {
                  let discountPercentage = 0;
                  if (product.original_price && product.original_price > product.price) {
                    discountPercentage = Math.round(
                      ((product.original_price - product.price) / product.original_price) * 100
                    );
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
                      image={
                        product.images?.[0]
                          ? urlForImage(product.images[0]).url()
                          : '/placeholder-product.jpg'
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No Products Found in {subcategory.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any products in this subcategory yet.
                </p>
                <div className="space-x-4">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition"
                  >
                    Back to {category.name}
                  </Link>
                  <Link
                    href="/shop"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            )}

            {products.length > 0 && (
              <div className="text-center mt-12 space-x-4">
                <Link
                  href="/shop"
                  className="inline-block bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition"
                >
                  View All Products
                </Link>
                <Link
                  href="/"
                  className="inline-block border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 hover:text-white transition"
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
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  if (!categories) return [];

  const paramsPromises = categories.map(async (category) => {
    const subcategories = await getSubcategoriesByCategoryRef(category._id);
    return subcategories.map((sub: SanitySubcategory) => ({
      slug: category.slug,
      subslug: sub.slug as string, // Explicitly cast to string
    }));
  });

  const allParams = await Promise.all(paramsPromises);
  return allParams.flat();
}

export async function generateMetadata(props: SubcategoryPageProps): Promise<Metadata> {
  const params = await props.params;
  const { slug, subslug } = params;

  const category = await getCategoryBySlug(slug);
  const subcategory = await getSubcategoryBySlug(subslug);

  if (!category || !subcategory) {
    return {
      title: 'Subcategory Not Found',
      description: 'The requested subcategory could not be found.',
    };
  }

  return {
    title: `${subcategory.name} - ${category.name} | RK Enterprise`,
    description: `Browse our premium collection of ${subcategory.name.toLowerCase()} in the ${category.name.toLowerCase()} category. High-quality furniture at competitive prices from RK Enterprise.`,
  };
}