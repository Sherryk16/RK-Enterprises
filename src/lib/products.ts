import { sanityClient } from "@/sanity/lib/client"; // Import sanityClient
import { SanityProduct, SanityCategory, SanitySubcategory } from "@/types/sanity";

// ===============================
// 🔹 Common product fields (GROQ)
// ===============================
const productFields = `
  _id,
  name,
  price,
  original_price,
  images,
  description,
  detailed_description,
  colors,
  is_featured,
  is_ceo_chair,
  is_molded,
  is_gaming_chair,
  is_dining_chair,
  is_visitor_sofa,
  is_study_chair,
  is_outdoor_furniture,
  is_folding_furniture,
  "category": category->{_id, name, "slug": slug.current},
  "subcategory": subcategory->{_id, name, "slug": slug.current},
  "slug": slug.current,
  show_in_office,
  created_at
`;

const productCardFields = `
  _id,
  name,
  price,
  original_price,
  images,
  "category": category->{_id, name, "slug": slug.current},
  "slug": slug.current,
  rating,
  reviews,
  is_new,
`;

// ===============================
// 🔹 CATEGORY FUNCTIONS
// ===============================
export async function getCategories(): Promise<SanityCategory[]> {
  const query = `*[_type == "category"] | order(name asc)`;
  return await sanityClient.fetch<SanityCategory[]>(query);
}

export async function getCategoryBySlug(slug: string): Promise<SanityCategory | null> {
  const query = `*[_type == "category" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    description
  }`;
  return await sanityClient.fetch<SanityCategory | null>(query, { slug });
}

// 🟢 Get all categories (simple)
export async function getAllCategories(): Promise<SanityCategory[]> {
  const query = `*[_type == "category"]{
    _id,
    name,
    "slug": slug.current,
    description
  } | order(name asc)`;

  return await sanityClient.fetch<SanityCategory[]>(query);
}

// 🟢 Get categories with subcategories
export async function getCategoriesWithSubcategories(): Promise<
  (SanityCategory & { subcategories: SanitySubcategory[] })[]
> {
  const query = `*[_type == "category"]{
    _id,
    name,
    "slug": slug.current,
    "subcategories": *[_type == "subcategory" && references(^._id)]{
      _id,
      name,
      "slug": slug.current
    }
  } | order(name asc)`;

  return await sanityClient.fetch(query);
}

// ===============================
// 🔹 SUBCATEGORY FUNCTIONS
// ===============================
export async function getSubcategories(): Promise<SanitySubcategory[]> {
  const query = `*[_type == "subcategory"] | order(name asc)`;
  return await sanityClient.fetch<SanitySubcategory[]>(query);
}

export async function getSubcategoriesByCategoryRef(
  categoryId: string
): Promise<SanitySubcategory[]> {
  const query = `*[_type == "subcategory" && references($categoryId)]{
    _id,
    name,
    "slug": slug.current
  } | order(name asc)`;
  return await sanityClient.fetch<SanitySubcategory[]>(query, { categoryId });
}

export async function getSubcategoryBySlug(slug: string): Promise<SanitySubcategory | null> {
  const query = `*[_type == "subcategory" && slug.current == $slug][0]`;
  return await sanityClient.fetch<SanitySubcategory | null>(query, { slug });
}

// 🟢 Get all subcategories (used in shop page)
export async function getAllSubcategories(): Promise<SanitySubcategory[]> {
  const query = `*[_type == "subcategory"]{
    _id,
    name,
    "slug": slug.current,
    "category": category->{_id, name, "slug": slug.current}
  } | order(name asc)`;

  return await sanityClient.fetch<SanitySubcategory[]>(query);
}

// ===============================
// 🔹 PRODUCT FUNCTIONS
// ===============================

// 🟢 Get all products
export async function getAllProducts(): Promise<{ products: SanityProduct[] }> {
  const query = `*[_type == "product"]{ ${productCardFields} } | order(created_at desc)`;

  try {
    const products = await sanityClient.fetch<SanityProduct[]>(query);
    console.log("✅ Total products fetched:", products.length);
    return { products };
  } catch (error) {
    console.error("❌ Error fetching all products:", error);
    return { products: [] };
  }
}

// 🟢 Get products by category
export async function getProductsByCategory(
  slug: string
): Promise<{ category: SanityCategory; products: SanityProduct[] }> {
  const category = await getCategoryBySlug(slug);
  if (!category) throw new Error(`Category not found for slug: ${slug}`);

  const query = `*[_type == "product" && category->slug.current == $slug]{ ${productCardFields} } | order(created_at desc)`;
  const products = await sanityClient.fetch<SanityProduct[]>(query, { slug });

  return { category, products };
}

// 🟢 Get products by subcategory
export async function getProductsBySubcategory(
  slug: string
): Promise<{ subcategory: SanitySubcategory; products: SanityProduct[] }> {
  const subcategory = await getSubcategoryBySlug(slug);
  if (!subcategory) throw new Error(`Subcategory not found for slug: ${slug}`);

  const query = `*[_type == "product" && subcategory->slug.current == $slug]{ ${productCardFields} } | order(created_at desc)`;
  const products = await sanityClient.fetch<SanityProduct[]>(query, { slug });

  return { subcategory, products };
}

// 🟢 Get related products
export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string
): Promise<SanityProduct[]> {
  const query = `*[_type == "product" && category._ref == $categoryId && _id != $currentProductId]{
    ${productCardFields}
  } | order(created_at desc)[0...5]`;

  const products = await sanityClient.fetch<SanityProduct[]>(query, { categoryId, currentProductId });
  return products || [];
}

// 🟢 Get single product by slug
export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  const query = `*[_type == "product" && slug.current == $slug][0]{ ${productFields} }`;
  return await sanityClient.fetch<SanityProduct | null>(query, { slug });
}

// 🟢 Get featured products
export async function getFeaturedProducts(): Promise<SanityProduct[]> {
  const query = `*[_type == "product" && is_featured == true]{ ${productCardFields} } | order(created_at desc)[0...10]`;
  return await sanityClient.fetch<SanityProduct[]>(query);
}

// ===============================
// ✅ Export all types
// ===============================
export type { SanityProduct, SanityCategory, SanitySubcategory };
