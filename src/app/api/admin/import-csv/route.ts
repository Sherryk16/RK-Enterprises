import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
// Removed import slugify from 'slugify';
import csv from 'csv-parser';
import { Readable } from 'stream'; // Import Readable from 'stream'
import { cleanHtml, simpleSlugify, normalizeCategoryName } from '@/lib/utils'; // Import utility functions
import fetch from 'node-fetch'; // Import node-fetch for server-side fetching
import { Buffer } from 'buffer'; // Import Buffer

interface CSVRow {
  'Name': string;
  'Categories': string;
  'Description': string;
  'Regular price': string;
  'Sale price': string;
  'Images': string;
  'Is featured?': string;
  // Add other expected CSV headers here
}

interface ProductToInsert {
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  images: string[];
  description: string;
  detailed_description: string;
  is_featured: boolean;
  show_in_office: boolean;
  category_id: string;
  subcategory_id?: string | null;
  is_molded: boolean;
  is_ceo_chair: boolean;
  is_gaming_chair: boolean;
  is_dining_chair: boolean;
  is_visitor_sofa: boolean;
  is_study_chair: boolean;
  is_outdoor_furniture: boolean;
  is_folding_furniture: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side
const SUPABASE_BUCKET_NAME = 'product-images'; // Define your Supabase bucket name here

console.log('Supabase URL (from env): ', supabaseUrl ? 'Loaded' : 'NOT LOADED', supabaseUrl);
console.log('Supabase Service Role Key (from env): ', supabaseServiceRoleKey ? 'Loaded' : 'NOT LOADED', 'Length:', supabaseServiceRoleKey?.length);

if (!supabaseUrl) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL is not set.");
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set.");
}
if (!supabaseServiceRoleKey) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY is not set.");
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
}

// Initialize Supabase client for server-side operations with the Service Role Key
// This key bypasses Row Level Security and has full privileges.
const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: { persistSession: false }, // No session persistence needed for a service role key
});

// Helper to get or create a category
async function getOrCreateCategory(name: string) {
  const cleanedName = normalizeCategoryName(name); // Use new normalization for category name
  console.log(`getOrCreateCategory: Processing category name: '${name}', Normalized: '${cleanedName}'`); // DEBUG LOG
  if (!cleanedName) return null; // Skip if name is empty after cleaning
  const slug = simpleSlugify(cleanedName);
  const { data: category, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error(`Error fetching category ${cleanedName}:`, error);
    throw new Error(`Error fetching category ${cleanedName}: ${error.message}`);
  }

  if (!category) {
    const { data: newCategory, error: insertError } = await supabase.from('categories').insert({ name: cleanedName, slug }).select().single();
    if (insertError) {
      console.error(`Error creating category ${cleanedName}:`, insertError);
      throw new Error(`Error creating category ${cleanedName}: ${insertError.message}`);
    }
    return newCategory;
  }
  return category;
}

// Helper to get or create a subcategory
async function getOrCreateSubcategory(name: string, categoryId: string) {
  const cleanedName = normalizeCategoryName(name); // Use new normalization for subcategory name
  console.log(`getOrCreateSubcategory: Processing subcategory name: '${name}', Normalized: '${cleanedName}'`); // DEBUG LOG
  if (!cleanedName) return null; // Skip if name is empty after cleaning
  const slug = simpleSlugify(cleanedName);
  const { data: subcategory, error } = await supabase.from('subcategories').select('*').eq('slug', slug).single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching subcategory ${cleanedName}:`, error);
    throw new Error(`Error fetching subcategory ${cleanedName}: ${error.message}`);
  }

  if (!subcategory) {
    const { data: newSubcategory, error: insertError } = await supabase.from('subcategories').insert({ name: cleanedName, slug, category_id: categoryId }).select().single();
    if (insertError) {
      console.error(`Error creating subcategory ${cleanedName}:`, insertError);
      throw new Error(`Error creating subcategory ${cleanedName}: ${insertError.message}`);
    }
    return newSubcategory;
  }
  return subcategory;
}

async function uploadImageToSupabase(imageUrl: string, productName: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to download image from URL: ${imageUrl} for product: ${productName}. Status: ${response.status}`);
      return null; // Return null if download fails
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file extension from URL or content type
    const contentType = response.headers.get('content-type');
    let fileExt = '.jpg'; // Default to jpg
    if (contentType) {
      if (contentType.includes('png')) fileExt = '.png';
      else if (contentType.includes('jpeg')) fileExt = '.jpeg';
      else if (contentType.includes('gif')) fileExt = '.gif';
      else if (contentType.includes('webp')) fileExt = '.webp';
    }
    
    // Create a unique filename
    const fileName = `${simpleSlugify(productName)}-${Date.now()}${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: contentType || 'application/octet-stream',
        upsert: false, // Prevents overwriting existing files with the same name
      });

    if (error) {
      console.error(`Error uploading image to Supabase Storage for product: ${productName}, URL: ${imageUrl}`, error);
      return null; // Return null if upload fails
    }

    const { data: { publicUrl } } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(filePath);
    console.log(`Successfully uploaded image for product: ${productName}. Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Caught error in uploadImageToSupabase for product: ${productName}, URL: ${imageUrl}`, error);
    return null;
  }
}

// Helper to link category and subcategory
async function linkCategoryToSubcategory(categoryId: string, subcategoryId: string) {
  const { data, error } = await supabase.from('category_subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .eq('subcategory_id', subcategoryId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error(`Error checking category-subcategory link ${categoryId}-${subcategoryId}:`, error);
    throw new Error(`Error checking link: ${error.message}`);
  }

  if (!data) {
    const { error: insertError } = await supabase.from('category_subcategories').insert({
      category_id: categoryId,
      subcategory_id: subcategoryId,
    });
    if (insertError) {
      console.error(`Error linking category ${categoryId} to subcategory ${subcategoryId}:`, insertError);
      throw new Error(`Error linking: ${insertError.message}`);
    }
  }
}

export async function POST(request: Request) {
  // For this API route, the request object might not be directly used, but it's required by Next.js.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    // Diagnostic query to check table visibility
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: diagData, error: diagError } = await supabase.from('category_subcategories').select('category_id').limit(1);
    if (diagError) {
      console.error('Diagnostic query error for category_subcategories:', diagError);
      throw new Error(`Diagnostic table check failed: ${diagError.message}`);
    }
    console.log('Diagnostic query for category_subcategories successful.');

    const formData = await request.formData();
    const file = formData.get('csvFile') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CSV file uploaded.' }, { status: 400 });
    }

    const fileContent = await file.text();
    const results: CSVRow[] = await new Promise((resolve, reject) => {
      const products: CSVRow[] = [];
      Readable.from(fileContent)
        .pipe(csv())
        .on('data', (data: CSVRow) => products.push(data))
        .on('end', () => resolve(products))
        .on('error', (error) => reject(error));
    });

    if (results.length === 0) {
      return NextResponse.json({ error: 'Empty or unparseable CSV file.' }, { status: 400 });
    }

    const productsToInsert: ProductToInsert[] = [];
    const processedSlugs = new Set<string>(); // Keep track of slugs in the current batch

    for (const row of results) {
      console.log(`Processing row:`, row);

      let primaryCategoryId: string | null = null;
      let primarySubcategoryId: string | null = null;

      const originalProductName = row['Name'] || '';
      const productName = cleanHtml(originalProductName);
      console.log(`Original Product Name: '${originalProductName}', Cleaned: '${productName}'`);

      const originalCategoriesStr = row['Categories'] || '';
      const categoriesStr = cleanHtml(originalCategoriesStr);
      console.log(`Original Categories String: '${originalCategoriesStr}', Cleaned: '${categoriesStr}'`);

      const originalDescription = row['Description'] || '';
      const cleanedDescription = cleanHtml(originalDescription);
      console.log(`Original Description: '${originalDescription}', Cleaned: '${cleanedDescription}'`);

      if (!productName || productName.trim() === '') {
        console.warn(`Skipping row due to missing or empty product name in row:`, row);
        continue; 
      }

      // Validate Price: Ensure at least one valid price is present
      const regularPrice = parseFloat(row['Regular price']);
      const salePrice = parseFloat(row['Sale price']);
      if ((isNaN(regularPrice) || regularPrice <= 0) && (isNaN(salePrice) || salePrice <= 0)) {
        console.warn(`Skipping row due to missing or invalid price for product '${productName}' in row:`, row);
        continue;
      }

      // Download and upload images to Supabase Storage
      const originalImageUrls = row['Images'] ? row['Images'].split(',').map((img) => img.trim()).filter((img) => img) : [];
      const uploadedImageUrls: string[] = [];

      for (const imageUrl of originalImageUrls) {
        if (imageUrl) {
          const uploadedUrl = await uploadImageToSupabase(imageUrl, productName);
          if (uploadedUrl) {
            uploadedImageUrls.push(uploadedUrl);
          } else {
            console.warn(`Could not upload image from URL: ${imageUrl}. Using placeholder for product: ${productName}`);
            // Optionally, add a placeholder image if the upload fails for a specific image
            // uploadedImageUrls.push("/placeholder-product.jpg"); 
          }
        }
      }

      if (uploadedImageUrls.length === 0) {
        console.warn(`Skipping row due to no valid image URLs after upload attempt for product '${productName}' in row:`, row);
        continue;
      }

      if (categoriesStr) {
        const categoryPaths = categoriesStr.split('|');
        for (const path of categoryPaths) {
          const parts = path.split('>').map(p => p.trim()).filter(p => p);
          if (parts.length > 0) {
            const categoryName = parts[0];
            const category = await getOrCreateCategory(categoryName);
            if (category) {
              if (!primaryCategoryId) primaryCategoryId = category.id;

              if (parts.length > 1) {
                const subcategoryNames = parts[1].split(',').map(s => s.trim()).filter(s => s); // Split by comma and trim
                for (const subcategoryName of subcategoryNames) {
                  const subcategory = await getOrCreateSubcategory(subcategoryName, category.id);
                  if (subcategory) {
                    if (!primarySubcategoryId) primarySubcategoryId = subcategory.id;
                    await linkCategoryToSubcategory(category.id, subcategory.id);
                  }
                }
              }
            } else {
                console.warn(`Could not create/find category for name: ${categoryName} in row:`, row, `. Skipping related subcategory/product linkage.`);
            }
          }
        }
      }

      // If primaryCategoryId is still null after parsing, handle the constraint violation
      // This means the product might not have a valid category assigned from the CSV.
      if (!primaryCategoryId) {
          console.warn(`Product '${productName}' from row:`, row, `has no valid primary category. Skipping product insertion.`);
          continue; // Skip inserting this product if no primary category could be determined
      }

      const baseSlug = simpleSlugify(productName || `product-${Math.random().toString(36).substring(7)}`);
      let productSlug = baseSlug;
      let suffix = 1;

      // Loop to ensure slug is unique across database and current batch
      while (true) {
        const { data: existingProductsInDb, error: slugCheckError } = await supabase.from('products').select('slug').eq('slug', productSlug);
        if (slugCheckError) {
          console.error(`Error checking slug uniqueness for ${productSlug}:`, slugCheckError);
          // Fallback to a truly random slug if DB check fails
          productSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
          break; // Exit loop, will try to insert with this random slug
        }

        if (existingProductsInDb && existingProductsInDb.length > 0 || processedSlugs.has(productSlug)) {
          // Slug exists in DB or current batch, append a suffix
          productSlug = `${baseSlug}-${suffix}`;
          suffix++;
        } else {
          // Slug is unique
          break;
        }
      }
      processedSlugs.add(productSlug); // Add the final unique slug to our set

      // Prepare product data for insertion
      const product_data: ProductToInsert = {
          name: productName,
          slug: productSlug,
          price: row['Sale price'] ? parseFloat(row['Sale price']) : parseFloat(row['Regular price']) || 0,
          original_price: parseFloat(row['Regular price']) || 0,
          images: uploadedImageUrls,
          description: cleanedDescription,
          detailed_description: cleanedDescription,
          is_featured: row['Is featured?'] === '1',
          show_in_office: ((categoriesStr || '').toLowerCase().includes('office furniture') || (categoriesStr || '').toLowerCase().includes('visitor chair')),
          category_id: primaryCategoryId,
          subcategory_id: primarySubcategoryId,
          is_molded: false,
          is_ceo_chair: false,
          is_gaming_chair: false,
          is_dining_chair: false,
          is_visitor_sofa: false,
          is_study_chair: false,
          is_outdoor_furniture: false,
          is_folding_furniture: false,
      };

      console.log('Product Data before Supabase insertion:', product_data); // FINAL DEBUG LOG

      productsToInsert.push(product_data);
    }

    if (productsToInsert.length > 0) {
      const { error: insertProductsError } = await supabase.from('products').insert(productsToInsert);
      if (insertProductsError) {
        console.error('Error inserting products:', insertProductsError);
        return NextResponse.json({ error: 'Failed to insert products.', details: insertProductsError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: `Successfully imported ${productsToInsert.length} products.` });

  } catch (error: unknown) {
    console.error('Error processing CSV upload:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

