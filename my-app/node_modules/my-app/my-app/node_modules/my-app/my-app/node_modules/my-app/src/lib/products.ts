import { supabase } from './supabase';
console.log('products.ts: Supabase client imported.'); // DEBUG LOG

export type ProductInput = {
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  category_id: string;
  subcategory_id?: string | null;
  images?: string[];
  description?: string;
  detailed_description?: string;
  colors?: string[];
  is_featured?: boolean;
  show_in_office?: boolean;
  is_molded?: boolean;
  is_ceo_chair?: boolean;
  is_gaming_chair?: boolean;
  is_dining_chair?: boolean;
  is_visitor_sofa?: boolean;
  is_study_chair?: boolean;
  is_outdoor_furniture?: boolean;
  is_folding_furniture?: boolean;
};

// Get all products with category and subcategory info
export async function getAllProducts(
  categorySlug?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string,
  searchQuery?: string,
  page: number = 1,
  limit: number = 20
) {
  let query = supabase
    .from('products')
    .select(`
      *,
      slug,
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
    `, { count: 'exact' }); // Request exact count

  if (categorySlug) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (categoryError) throw categoryError;
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }

  if (searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    query = query.or(`name.ilike.${searchPattern},description.ilike.${searchPattern}`);
  }

  switch (sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'featured':
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      break;
  }

  const start = (page - 1) * limit;
  const end = start + limit - 1;
  query = query.range(start, end);

  const { data: products, error, count: totalCount } = await query;

  console.log('getAllProducts: Supabase raw data:', products); // CRITICAL DEBUG LOG
  console.log('getAllProducts: Supabase raw error:', error); // CRITICAL DEBUG LOG
  console.log('getAllProducts: Total count:', totalCount); // CRITICAL DEBUG LOG

  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }
  return { products: products || [], totalCount: totalCount || 0 };
}

// Get products by category ID
export async function getProductsByCategoryId(categoryId: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get products by category slug
export async function getProductsByCategory(categorySlug: string) {
  // First get the category by slug
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (categoryError) throw categoryError;
  if (!category) return [];

  // Then get products by category ID
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
  return data;
}

// Get products by subcategory
export async function getProductsBySubcategory(subcategoryId: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq('subcategory_id', subcategoryId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq('is_featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get office products
export async function getOfficeProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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

  if (error) throw error;
  return data;
}

// Get products by specific flags
export async function getProductsByFlag(flag: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq(flag, true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get products by color
export async function getProductsByColor(color: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .contains('colors', [color])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get all unique colors
export async function getAllColors() {
  const { data, error } = await supabase
    .from('products')
    .select('colors');

  if (error) throw error;
  
  const allColors = data.flatMap(product => product.colors || []);
  return [...new Set(allColors)];
}

// Get single product by ID
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  console.log('getProductBySlug: Searching for slug:', slug); // DEBUG LOG
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('getProductBySlug: Supabase query error:', error); // DEBUG LOG
    throw error;
  }
  console.log('getProductBySlug: Supabase response data:', data); // DEBUG LOG
  return data;
}

// Create or update product
export async function upsertProduct(input: ProductInput & { id?: string }) {
  const productData = {
    name: input.name,
    slug: input.slug,
    price: input.price,
    original_price: input.original_price || null,
    category_id: input.category_id,
    subcategory_id: input.subcategory_id || null,
    images: input.images || [],
    description: input.description || null,
    detailed_description: input.detailed_description || null,
    colors: input.colors || [],
    is_featured: !!input.is_featured,
    show_in_office: !!input.show_in_office,
    is_molded: !!input.is_molded,
    is_ceo_chair: !!input.is_ceo_chair,
    is_gaming_chair: !!input.is_gaming_chair,
    is_dining_chair: !!input.is_dining_chair,
    is_visitor_sofa: !!input.is_visitor_sofa,
    is_study_chair: !!input.is_study_chair,
    is_outdoor_furniture: !!input.is_outdoor_furniture,
    is_folding_furniture: !!input.is_folding_furniture,
  };

  if (input.id) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', input.id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }
}

// Delete product
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Get all categories
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

// Get all subcategories
export async function getAllSubcategories() {
  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      *,
      categories:category_id (
        id,
        name,
        slug
      )
    `)
    .order('name');

  if (error) throw error;
  return data;
}

// Get categories with their subcategories
export async function getCategoriesWithSubcategories() {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      category_subcategories(subcategory_id(id, name, slug))
    `)
    .order('name');

  if (error) {
    console.error('getCategoriesWithSubcategories: Supabase query error:', error); // DEBUG LOG
    throw error;
  }
  console.log('getCategoriesWithSubcategories: Supabase response data:', data); // DEBUG LOG
  return data;
}

// Get subcategories that should appear under multiple categories
export async function getSharedSubcategories() {
  // This function used to manually define shared subcategories.
  // To ensure consistency with CSV imports and prevent duplication, 
  // we will now rely solely on categories and subcategories being 
  // properly linked during the CSV import process.
  return []; // Return an empty array to disable manual shared subcategories
}

// Debug function to check database contents
export async function debugDatabaseContents() {
  try {
    // Get all categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (catError) throw catError;
    
    // Get all products with their category info
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        category_id,
        show_in_office,
        slug,
        categories:category_id (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });
    
    if (prodError) throw prodError;
    
    return {
      categories: categories || [],
      products: products || [],
      summary: {
        totalCategories: categories?.length || 0,
        totalProducts: products?.length || 0,
        officeProducts: products?.filter(p => p.show_in_office)?.length || 0,
        productsByCategory: categories?.map(cat => ({
          categoryName: cat.name,
          categorySlug: cat.slug,
          productCount: products?.filter(p => p.category_id === cat.id)?.length || 0
        })) || []
      }
    };
  } catch (error: unknown) {
    console.error('Debug error:', error);
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return { error: errorMessage };
  }
}

// Get subcategories by category
export async function getSubcategoriesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      *,
      categories:category_id (
        id,
        name,
        slug
      )
    `)
    .eq('category_id', categoryId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      slug,
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
    .eq('category_id', categoryId)
    .neq('id', currentProductId) // Exclude the current product
    .order('created_at', { ascending: false })
    .limit(5); // Limit to 5 related products

  if (error) throw error;
  return data;
}
