import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client for server-side operations with the Service Role Key
const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: { persistSession: false }, // No session persistence needed for a service role key
});

export async function POST(_request: Request) {
  // For this API route, the request object might not be directly used, but it's required by Next.js.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  try {
    // First, check if the service role key is correctly configured.
    if (!supabaseServiceRoleKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not configured.');
      return NextResponse.json({ error: 'Admin authentication failed: SUPABASE_SERVICE_ROLE_KEY not set.' }, { status: 401 });
    }

    console.log('Attempting to delete non-featured products...');

    const { data: nonFeaturedProducts, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('is_featured', false);

    if (fetchError) {
      console.error('Error fetching non-featured products:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch non-featured products.', details: fetchError.message }, { status: 500 });
    }

    if (!nonFeaturedProducts || nonFeaturedProducts.length === 0) {
      console.log('No non-featured products found to delete.');
      return NextResponse.json({ message: 'No non-featured products found to delete.' });
    }

    const productIdsToDelete = nonFeaturedProducts.map(p => p.id);
    console.log(`Found ${productIdsToDelete.length} non-featured products to delete.`);

    // Perform deletion in batches if there are many products
    const BATCH_SIZE = 1000;
    let deletedCount = 0;

    for (let i = 0; i < productIdsToDelete.length; i += BATCH_SIZE) {
      const batch = productIdsToDelete.slice(i, i + BATCH_SIZE);
      console.log(`Deleting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(productIdsToDelete.length / BATCH_SIZE)} of ${batch.length} products.`);
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', batch);

      if (deleteError) {
        console.error('Error deleting products in batch:', deleteError);
        throw new Error(`Failed to delete a batch of products: ${deleteError.message}`);
      }
      deletedCount += batch.length;
      console.log(`Successfully deleted ${batch.length} products in this batch.`);
    }
    
    console.log(`Successfully deleted ${deletedCount} non-featured products.`);
    return NextResponse.json({ message: `Successfully deleted ${deletedCount} non-featured products.` });

  } catch (error: unknown) {
    console.error('Error in delete-non-featured-products API:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
