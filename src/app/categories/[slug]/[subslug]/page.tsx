'use client';
// app/categories/[slug]/[subslug]/page.tsx

import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getSubcategoryBySlug,
  getProductsBySubcategory,
  // getAllCategories,
  // getSubcategoriesByCategoryRef,
  // SanitySubcategory,
  SanityProduct,
} from "@/lib/products";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";

export default function SubcategoryPage({ params }: { params: { slug: string; subslug: string } }) {
  const { slug, subslug } = params;

  if (!slug || !subslug) {
    notFound();
  }

  // Temporary placeholder data, as async fetching is removed from client component
  const category = { name: "Category Placeholder" };
  const subcategory = { name: "Subcategory Placeholder" };
  const products = { products: [] as SanityProduct[] };

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Header Section */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {subcategory.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Part of the {category.name} collection
            </p>
            <div className="mt-4">
              <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {products.products.length} Products Available
              </span>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {products.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {products.products.map((product: SanityProduct) => {
                  const discount =
                    product.original_price && product.original_price > product.price
                      ? Math.round(
                          ((product.original_price - product.price) /
                            product.original_price) *
                            100
                        )
                      : 0;

                  return (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.original_price ?? undefined}
                      category={product.category?.name ?? "Category"}
                      slug={product.slug}
                      rating={product.rating ?? 4.5}
                      reviews={product.reviews ?? 0}
                      isNew={false}
                      discount={discount}
                      image={
                        product.images && typeof product.images[0] === "object"
                          ? urlForImage(product.images[0]).url()
                          : "/placeholder-product.jpg"
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
                  We couldn&apos;t find any products in this subcategory.
                </p>
                <div className="space-x-4">
                  <Link
                    href={`/categories/${slug}`}
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

            {Array.isArray(products) && products.length > 0 && (
              <div className="text-center mt-12 space-x-4">
                <Link
                  href="/shop"
                  className="inline-block bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg"
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

// export async function generateMetadata({ params }: { params: { slug: string; subslug: string } }) {
//   const { slug, subslug } = params;
//   const category = await getCategoryBySlug(slug);
//   const subcategory = await getSubcategoryBySlug(subslug);

//   if (!category || !subcategory) {
//     return { title: "Subcategory Not Found" };
//   }

//   return {
//     title: `${subcategory.name} - ${category.name} Products`,
//     description: `Browse ${subcategory.name} items in the ${category.name} category.`,
//   };
// }

// export async function generateStaticParams() {
//   const categories = await getAllCategories();
//   if (!categories) return [];

//   const paramsPromises = categories.map(async (category) => {
//     const subcategories = await getSubcategoriesByCategoryRef(category._id);
//     return subcategories.map((sub: SanitySubcategory) => ({
//       slug: category.slug,
//       subslug: sub.slug,
//     }));
//   });

//   const allParams = await Promise.all(paramsPromises);
//   return allParams.flat();
// }
