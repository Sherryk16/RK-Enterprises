import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { cleanHtml, simpleSlugify, normalizeCategoryName } from '@/lib/utils';

interface CSVRow {
  'Name': string;
  'Categories': string;
  'Description': string;
  'Regular price': string;
  'Sale price': string;
  'Images': string;
  'Is featured?': string;
  'Detailed Description'?: string;
  'Colors'?: string;
  'Is molded?'?: string;
  'Is CEO Chair?'?: string;
  'Is Gaming Chair?'?: string;
  'Is Dining Chair?'?: string;
  'Is Visitor Sofa?'?: string;
  'Is Study Chair?'?: string;
  'Is Outdoor Furniture?'?: string;
  'Is Folding Furniture?'?: string;
}

interface ProductToInsert {
  name: string;
  slug: string;
  price: number;
  original_price?: number | null;
  images: string[];
  description: string;
  detailed_description?: string | null;
  colors: string[];
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
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const SUPABASE_BUCKET_NAME = 'product-images';

if (!supabaseUrl) {
  console.error("ERROR: NEXT_PUBLIC_SUPABASE_URL is not set.");
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set.");
}
if (!supabaseServiceRoleKey) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY is not set.");
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
}

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: { persistSession: false },
});

async function getOrCreateCategory(name: string) {
  const cleanedName = normalizeCategoryName(name);
  console.log(`[CSV Import] Attempting to get or create category: '${name}' (Normalized: '${cleanedName}')`); // DEBUG
  if (!cleanedName) return null;
  const slug = simpleSlugify(cleanedName);
  const { data: category, error } = await supabase.from('categories').select('*').eq('slug', slug).single();

  if (error && error.code !== 'PGRST116') {
    console.error(`[CSV Import] Error fetching category ${cleanedName}:`, error);
    throw new Error(`Error fetching category ${cleanedName}: ${error.message}`);
  }

  if (!category) {
    console.log(`[CSV Import] Category '${cleanedName}' not found, creating...`); // DEBUG
    const { data: newCategory, error: insertError } = await supabase.from('categories').insert({ name: cleanedName, slug }).select().single();
    if (insertError) {
      console.warn(`[CSV Import] Error creating category '${cleanedName}':`, insertError.message);
      return null;
    }
    console.log(`[CSV Import] Successfully created category: '${newCategory?.name}' (ID: ${newCategory?.id})`); // DEBUG
    return newCategory;
  }
  console.log(`[CSV Import] Found existing category: '${category.name}' (ID: ${category.id})`); // DEBUG
  return category;
}

async function getOrCreateSubcategory(name: string, categoryId: string) {
  const cleanedName = normalizeCategoryName(name);
  console.log(`[CSV Import] Attempting to get or create subcategory: '${name}' (Normalized: '${cleanedName}') for category ID: ${categoryId}`); // DEBUG
  if (!cleanedName) return null;
  const slug = simpleSlugify(cleanedName);
  const { data: subcategory, error } = await supabase.from('subcategories').select('*').eq('slug', slug).single();

  if (error && error.code !== 'PGRST116') {
    console.error(`[CSV Import] Error fetching subcategory ${cleanedName}:`, error);
    throw new Error(`Error fetching subcategory ${cleanedName}: ${error.message}`);
  }

  if (!subcategory) {
    console.log(`[CSV Import] Subcategory '${cleanedName}' not found, creating...`); // DEBUG
    const { data: newSubcategory, error: insertError } = await supabase.from('subcategories').insert({ name: cleanedName, slug, category_id: categoryId }).select().single();
    if (insertError) {
      console.warn(`[CSV Import] Error creating subcategory '${cleanedName}':`, insertError.message);
      return null;
    }
    console.log(`[CSV Import] Successfully created subcategory: '${newSubcategory?.name}' (ID: ${newSubcategory?.id})`); // DEBUG
    return newSubcategory;
  }
  console.log(`[CSV Import] Found existing subcategory: '${subcategory.name}' (ID: ${subcategory.id})`); // DEBUG
  return subcategory;
}

// Utility to extract base filename (without extension and common trailing identifiers)
function getBaseFilenameForComparison(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    parts.pop(); // Remove extension
  }
  let base = parts.join('.');
  // Remove common trailing slugs/timestamps/model numbers (more aggressive)
  base = base.replace(/-\d{6,}$/, ''); // remove trailing -timestamp (e.g., -1759534871649)
  base = base.replace(/-(v\d+)$/, ''); // remove trailing -vX (e.g., -v4)
  base = base.replace(/-(copy)$/, ''); // remove trailing -copy
  base = base.replace(/-(model-rk-\d{2,}-\d{3})$/, ''); // remove specific model pattern like -model-rk-350-1759534871649
  base = base.replace(/-\d{2,}-\d{3,}$/, ''); // more general number sequences
  base = base.replace(/-rk-\d{2,3}$/, ''); // remove -rk-XXX
  base = base.replace(/-rk-enterprise(s)?$/, ''); // remove -rk-enterprise or -rk-enterprises
  return simpleSlugify(base);
}

async function getImagePublicUrlFromBucket(productName: string, imageFileNameHintFromCSV: string): Promise<string | null> {
  console.log(`[CSV Import] Attempting fuzzy match for product: '${productName}', with CSV hint: '${imageFileNameHintFromCSV}'`); // DEBUG
  if (!productName) return null;

  const normalizedProductName = simpleSlugify(productName);
  console.log(`[CSV Import] Normalized Product Name for comparison: '${normalizedProductName}'`); // DEBUG

  // List all files in the 'products/' directory of the bucket
  const { data: listData, error: listError } = await supabase.storage.from(SUPABASE_BUCKET_NAME).list('products');

  if (listError) {
    console.error(`[CSV Import] Error listing files in bucket '${SUPABASE_BUCKET_NAME}/products/':`, listError);
    return null;
  }

  if (!listData || listData.length === 0) {
    console.warn(`[CSV Import] No files found in bucket '${SUPABASE_BUCKET_NAME}/products/'.`);
    return null;
  }

  let bestMatchFileName: string | null = null;
  let highestSimilarityScore = 0;

  for (const bucketFile of listData) {
    const normalizedBucketFilename = getBaseFilenameForComparison(bucketFile.name);
    
    // Simple fuzzy matching: check if product name is a substring of filename, or vice versa
    // Prioritize longer common substrings or exact matches after normalization
    let currentSimilarity = 0;
    if (normalizedBucketFilename.includes(normalizedProductName)) {
      currentSimilarity = normalizedProductName.length; // CSV name is contained in bucket name
    } else if (normalizedProductName.includes(normalizedBucketFilename)) {
      currentSimilarity = normalizedBucketFilename.length; // Bucket name is contained in CSV name
    }
    
    // Further boost for closer matches or if CSV hint is also a good match
    if (normalizedBucketFilename === normalizedProductName) {
      currentSimilarity += normalizedProductName.length * 2; // Exact match after base processing
    }

    // Also consider the imageFileNameHintFromCSV if it's provided and is a strong match
    if (imageFileNameHintFromCSV) {
      const normalizedHint = getBaseFilenameForComparison(imageFileNameHintFromCSV);
      if (normalizedBucketFilename.includes(normalizedHint)) {
        currentSimilarity += normalizedHint.length; // Boost if hint matches bucket filename
      }
    }

    if (currentSimilarity > highestSimilarityScore) {
      highestSimilarityScore = currentSimilarity;
      bestMatchFileName = bucketFile.name;
    }
    console.log(`[CSV Import] Comparing product '${normalizedProductName}' with bucket file '${bucketFile.name}' (normalized: '${normalizedBucketFilename}'). Score: ${currentSimilarity}`); // DEBUG
  }

  if (bestMatchFileName) {
    const publicUrl = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(`products/${bestMatchFileName}`).data?.publicUrl;
    if (publicUrl) {
      console.log(`[CSV Import] BEST MATCH found for product '${productName}': '${bestMatchFileName}'. Public URL: ${publicUrl}`); // DEBUG
      return publicUrl;
    } else {
      console.warn(`[CSV Import] Could not get public URL for best matched file '${bestMatchFileName}'.`); // DEBUG
      return null;
    }
  } else {
    console.warn(`[CSV Import] No strong fuzzy match found in bucket for product: '${productName}'.`); // DEBUG
    return null;
  }
}

// This link function is probably not needed anymore given the direct subcategory_id in subcategories table
// async function linkCategoryToSubcategory(categoryId: string, subcategoryId: string) {
//   const { data, error } = await supabase.from('category_subcategories')
//     .select('*')
//     .eq('category_id', categoryId)
//     .eq('subcategory_id', subcategoryId)
//     .single();

//   if (error && error.code !== 'PGRST116') {
//     console.error(`Error checking category-subcategory link ${categoryId}-${subcategoryId}:`, error);
//     throw new Error(`Error checking link: ${error.message}`);
//   }

//   if (!data) {
//     const { error: insertError } = await supabase.from('category_subcategories').insert({
//       category_id: categoryId,
//       subcategory_id: subcategoryId,
//     });
//     if (insertError) {
//       console.error(`Error linking category ${categoryId} to subcategory ${subcategoryId}:`, insertError);
//       throw new Error(`Error linking: ${insertError.message}`);
//     }
//   }
// }

export async function POST(request: Request) {
  console.log('[CSV Import] Starting product import process.'); // DEBUG
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File | null;

    if (!file) {
      console.warn('[CSV Import] No CSV file uploaded.'); // DEBUG
      return NextResponse.json({ error: 'No CSV file uploaded.' }, { status: 400 });
    }

    console.log(`[CSV Import] Received file: '${file.name}' (Type: '${file.type}', Size: ${file.size} bytes)`); // DEBUG
    const fileContent = await file.text();
    const results: CSVRow[] = await new Promise((resolve, reject) => {
      const products: CSVRow[] = [];
      Readable.from(fileContent)
        .pipe(csv())
        .on('data', (data: CSVRow) => products.push(data))
        .on('end', () => {
          console.log(`[CSV Import] CSV parsing complete. Found ${products.length} rows.`); // DEBUG
          resolve(products);
        })
        .on('error', (error) => {
          console.error('[CSV Import] Error parsing CSV:', error);
          reject(error);
        });
    });

    if (results.length === 0) {
      console.warn('[CSV Import] Empty or unparseable CSV file after parsing.'); // DEBUG
      return NextResponse.json({ error: 'Empty or unparseable CSV file.' }, { status: 400 });
    }

    const productsToInsert: ProductToInsert[] = [];
    const processedSlugs = new Set<string>();
    const errors: string[] = [];

    for (const row of results) {
      console.log('[CSV Import] Processing row:', row); // DEBUG: Log each row being processed
      let primaryCategoryId: string | null = null;
      let primarySubcategoryId: string | null = null;

      const productName = cleanHtml(row['Name'] || '');
      const categoriesStr = cleanHtml(row['Categories'] || '');
      const cleanedDescription = cleanHtml(row['Description'] || '');
      const cleanedDetailedDescription = cleanHtml(row['Detailed Description'] || '');
      const cleanedColors = (row['Colors'] || '').split(',').map(color => color.trim()).filter(color => color);

      if (!productName || productName.trim() === '') {
        errors.push(`Skipping row due to missing or empty product name in row: ${JSON.stringify(row)}`);
        console.warn(`[CSV Import] ${errors[errors.length - 1]}`); // DEBUG
        continue; 
      }

      const regularPrice = parseFloat(row['Regular price']);
      const salePrice = parseFloat(row['Sale price']);
      if ((isNaN(regularPrice) || regularPrice <= 0) && (isNaN(salePrice) || salePrice <= 0)) {
        errors.push(`Skipping row due to missing or invalid price for product '${productName}' in row: ${JSON.stringify(row)}`);
        console.warn(`[CSV Import] ${errors[errors.length - 1]}`); // DEBUG
        continue;
      }

      const imageFileNames = (row['Images'] || '').split(',').map(img => img.trim()).filter(img => img);
      const uploadedImageUrls: string[] = [];

      // Use product name as the primary key for image matching
      for (const imageFileNameHint of imageFileNames) {
        if (imageFileNameHint) {
          const publicUrl = await getImagePublicUrlFromBucket(productName, imageFileNameHint); // Pass product name and image hint
          if (publicUrl) {
            uploadedImageUrls.push(publicUrl);
          } else {
            errors.push(`Image not found or public URL unavailable for product '${productName}' with hint '${imageFileNameHint}'.`);
            console.warn(`[CSV Import] ${errors[errors.length - 1]}`); // DEBUG
          }
        }
      }
      console.log(`[CSV Import] Product '${productName}' processed images:`, uploadedImageUrls); // DEBUG

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
                const subcategoryNames = parts[1].split(',').map(s => s.trim()).filter(s => s);
                for (const subcategoryName of subcategoryNames) {
                  const subcategory = await getOrCreateSubcategory(subcategoryName, category.id);
                  if (subcategory) {
                    if (!primarySubcategoryId) primarySubcategoryId = subcategory.id;
                    // await linkCategoryToSubcategory(category.id, subcategory.id);
                  } else {
                    errors.push(`Could not create/find subcategory for name: ${subcategoryName} under category: ${categoryName} in row: ${JSON.stringify(row)}.`);
                    console.warn(`[CSV Import] ${errors[errors.length - 1]}`); // DEBUG
                  }
                }
              }
            } else {
              errors.push(`Could not create/find category for name: ${categoryName} in row: ${JSON.stringify(row)}. Skipping related subcategory/product linkage.`);
              console.warn(`[CSV Import] ${errors[errors.length - 1]}`); // DEBUG
            }
          }
        }
      }
      console.log(`[CSV Import] Product '${productName}' primaryCategoryId: ${primaryCategoryId}, primarySubcategoryId: ${primarySubcategoryId}`); // DEBUG

      if (!primaryCategoryId) {
        errors.push(`Product '${productName}' from row: ${JSON.stringify(row)} has no valid primary category. Skipping product insertion.`);
        console.warn(`[CSV Import] ${errors[errors.length - 1]}`); // DEBUG
        continue;
      }

      const baseSlug = simpleSlugify(productName || `product-${Math.random().toString(36).substring(7)}`);
      let productSlug = baseSlug;
      let suffix = 1;

      while (true) {
        const { data: existingProductsInDb, error: slugCheckError } = await supabase.from('products').select('slug').eq('slug', productSlug);
        if (slugCheckError) {
          console.error(`[CSV Import] Error checking slug uniqueness for ${productSlug}:`, slugCheckError);
          productSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
          break;
        }

        if (existingProductsInDb && existingProductsInDb.length > 0 || processedSlugs.has(productSlug)) {
          productSlug = `${baseSlug}-${suffix}`;
          suffix++;
        } else {
          break;
        }
      }
      processedSlugs.add(productSlug);
      console.log(`[CSV Import] Product '${productName}' final slug: '${productSlug}'`); // DEBUG

      const product_data: ProductToInsert = {
          name: productName,
          slug: productSlug,
          price: row['Sale price'] ? parseFloat(row['Sale price']) : parseFloat(row['Regular price']) || 0,
          original_price: parseFloat(row['Regular price']) || 0,
          images: uploadedImageUrls,
          description: cleanedDescription,
        detailed_description: cleanedDetailedDescription || null,
        colors: cleanedColors,
          is_featured: row['Is featured?'] === '1',
          show_in_office: ((categoriesStr || '').toLowerCase().includes('office furniture') || (categoriesStr || '').toLowerCase().includes('visitor chair')),
          category_id: primaryCategoryId,
          subcategory_id: primarySubcategoryId,
        is_molded: row['Is molded?'] === '1',
        is_ceo_chair: row['Is CEO Chair?'] === '1',
        is_gaming_chair: row['Is Gaming Chair?'] === '1',
        is_dining_chair: row['Is Dining Chair?'] === '1',
        is_visitor_sofa: row['Is Visitor Sofa?'] === '1',
        is_study_chair: row['Is Study Chair?'] === '1',
        is_outdoor_furniture: row['Is Outdoor Furniture?'] === '1',
        is_folding_furniture: row['Is Folding Furniture?'] === '1',
      };
      console.log(`[CSV Import] Product data prepared for insertion for '${productName}':`, JSON.stringify(product_data, null, 2)); // DEBUG

      productsToInsert.push(product_data);
    }

    if (productsToInsert.length > 0) {
      console.log(`[CSV Import] Attempting to insert ${productsToInsert.length} products into Supabase.`); // DEBUG
      const { error: insertProductsError } = await supabase.from('products').insert(productsToInsert);
      if (insertProductsError) {
        const errorMsg = `Error inserting products into Supabase: ${insertProductsError.message}`; 
        console.error(`[CSV Import] ${errorMsg}`); // DEBUG
        errors.push(errorMsg);
        return NextResponse.json({ message: `Successfully imported ${productsToInsert.length} products with some errors.`, errors: errors }, { status: 500 });
      }
      console.log(`[CSV Import] Successfully inserted ${productsToInsert.length} products.`); // DEBUG
    } else {
      console.warn('[CSV Import] No products to insert after processing CSV.'); // DEBUG
    }

    return NextResponse.json({ message: `Successfully imported ${productsToInsert.length} products.`, errors: errors });

  } catch (error: unknown) {
    console.error('[CSV Import] Uncaught error during CSV upload processing:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}



