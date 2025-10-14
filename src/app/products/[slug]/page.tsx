import { notFound } from 'next/navigation';

import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getProductBySlug, getAllProducts, SanityProduct, getRelatedProducts } from '@/lib/products'; // Added getRelatedProducts
import { urlForImage } from '@/sanity/lib/image';
import { Metadata } from 'next';
import AddToCartButton from '@/components/AddToCartButton'; // Import the new client component
import ProductImageGallery from '@/components/ProductImageGallery'; // Import the new ProductImageGallery client component
import ProductCard from '@/components/ProductCard'; // Import ProductCard

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const product = await getProductBySlug(slug);

  console.log('[ProductPage] Product colors for display:', product?.colors); // Re-added debug log

  if (!product) {
    notFound();
  }

  const relatedProducts = product.category?._id
    ? await getRelatedProducts(product.category._id, product._id)
    : [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="lg:w-1/2">
            <ProductImageGallery images={product.images as { _key: string; _type: 'image'; asset: { _ref: string; _type: 'reference' } }[] | undefined} productName={product.name} />
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <nav className="text-sm text-gray-500 mb-2">
              <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Shop</Link> /{' '}
              {product.category && (
                <Link href={`/categories/${product.category.slug}`} className="hover:underline">
                  {product.category.name}
                </Link>
              )}
              {product.subcategory && (
                <>
                  {' '} /{` `}
                  <Link href={`/categories/${product.category?.slug}/${product.subcategory.slug}`} className="hover:underline">
                    {product.subcategory.name}
                  </Link>
                </>
              )}
              {' '} /{` `}
              <span className="text-gray-700 font-medium">{product.name}</span>
            </nav>

            <p className="text-sm text-amber-600 uppercase tracking-wide mb-2">{product.category?.name || 'Category'}</p>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center space-x-2 mb-4">
              {product.original_price && product.original_price > product.price ? (
                <>
                  <span className="text-2xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                  <span className="text-lg text-gray-500 line-through">{formatPrice(product.original_price)}</span>
                  <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full font-semibold">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-amber-600">{formatPrice(product.price)}</span>
              )}
            </div>

           {/* Available Colors Section */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Available Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    // Color name to hex mapping
                    const colorMap: { [key: string]: string } = {
                      'black': '#000000',
                      'white': '#FFFFFF',
                      'grey': '#808080',
                      'gray': '#808080',
                      'red': '#FF0000',
                      'blue': '#0000FF',
                      'green': '#008000',
                      'yellow': '#FFFF00',
                      'orange': '#FFA500',
                      'purple': '#800080',
                      'pink': '#FFC0CB',
                      'brown': '#A52A2A',
                      'beige': '#F5F5DC',
                      'navy': '#000080',
                      'maroon': '#800000',
                      'teal': '#008080',
                      'olive': '#808000',
                      'lime': '#00FF00',
                      'cyan': '#00FFFF',
                      'magenta': '#FF00FF',
                      'silver': '#C0C0C0',
                      'gold': '#FFD700',
                      'cream': '#FFFDD0',
                      'ivory': '#FFFFF0',
                      'tan': '#D2B48C',
                    };
                    
                    // Get the raw colors data
                    let colorsArray: string[] = [];
                    
                    // Convert to string and extract color names
                    const colorString = JSON.stringify(product.colors);
                    
                    // Extract all quoted words (color names)
                    const matches = colorString.match(/\\?"([A-Za-z]+)\\?"/g);
                    
                    if (matches) {
                      colorsArray = matches.map(m => 
                        m.replace(/\\/g, '').replace(/"/g, '').trim()
                      );
                      // Remove duplicates
                      colorsArray = [...new Set(colorsArray)];
                    }
                    
                    console.log('Extracted colors:', colorsArray);
                    
                    return colorsArray.map((colorName: string, index: number) => {
                      const lowerColor = colorName.toLowerCase();
                      const hexColor = colorMap[lowerColor] || lowerColor;
                      
                      return (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: hexColor }}
                          title={colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                        ></div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
            {product.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Product Features / Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.is_featured && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Featured Product</span>}
              {product.is_ceo_chair && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">CEO Chair</span>}
              {product.is_gaming_chair && <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Gaming Chair</span>}
              {product.is_dining_chair && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Dining Chair</span>}
              {product.is_visitor_sofa && <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Visitor Sofa</span>}
              {product.is_study_chair && <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Study Chair</span>}
              {product.is_outdoor_furniture && <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Outdoor Furniture</span>}
              {product.is_folding_furniture && <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Folding Furniture</span>}
              {product.is_molded && <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Molded Design</span>}
              {product.show_in_office && <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Office Furniture</span>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton product={product} />
              <button className="mt-8 w-full md:w-auto bg-amber-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-amber-700 transition-colors duration-200">
                Buy Now
              </button>
            </div>

            {/* Need Help? Section */}
            {/* Need Help? Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-3">Need Help?</h2>
              <p className="text-gray-600 mb-4">Contact us for more information about this product or to place a custom order.</p>
              <div className="flex gap-4">
                <a 
                  href="https://wa.me/923453593470" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  WhatsApp Us
                </a>
                <a 
                  href="tel:+923453593470" 
                  className="inline-flex items-center border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition-colors duration-200"
                >
                  Call Now
                </a>
              </div>
            </div>

            {product.detailed_description && product.detailed_description.length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h2 className="text-2xl font-semibold mb-3">Product Details</h2>
                <div className="prose max-w-none text-gray-700">
                  <PortableText value={product.detailed_description as unknown as import('@portabletext/types').TypedObject[]} />
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>SKU:</strong> {product._id}</p>
              {product.subcategory && (
                <p><strong>Subcategory:</strong> {product.subcategory.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 py-8 bg-gray-50 rounded-lg shadow-inner">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct: SanityProduct) => {
                  let discountPercentage = 0;
                  if (relatedProduct.original_price && relatedProduct.original_price > relatedProduct.price) {
                    discountPercentage = Math.round(((relatedProduct.original_price - relatedProduct.price) / relatedProduct.original_price) * 100);
                  }
                  const productImageUrl = relatedProduct.images?.[0] ? urlForImage(relatedProduct.images[0]).url() : "/placeholder-product.jpg";

                  return (
                    <ProductCard
                      key={relatedProduct._id}
                      id={relatedProduct._id}
                      name={relatedProduct.name}
                      price={relatedProduct.price}
                      originalPrice={relatedProduct.original_price ?? undefined}
                      category={relatedProduct.category?.name || ''}
                      slug={relatedProduct.slug}
                      rating={relatedProduct.rating || 4.5}
                      reviews={relatedProduct.reviews || 0}
                      isNew={relatedProduct.is_new || false}
                      discount={discountPercentage}
                      image={productImageUrl}
                    />
                  );
                })}
              </div>
              <div className="text-center mt-12">
                <Link href={`/categories/${product.category?.slug}`}
                  className="btn-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg inline-flex items-center"
                >
                  View All {product.category?.name} Range
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  
  const productsResult = await getAllProducts(); // Assuming getAllProducts fetches all products
  

  if (!productsResult || !productsResult.products) {
    
    return [];
  }

  const validSlugs = productsResult.products
    .filter(product => {
      const isSlugValid = !!product.slug;
      
      return isSlugValid;
    })
    .map(product => ({
      slug: product.slug,
    }));

  
  return validSlugs;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // Ensure slug is a string or null from the start, providing a fallback empty string
  const slug = params.slug;

  if (!slug) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} - RK Enterprise`,
    description: product.description || `Buy ${product.name} at RK Enterprise. Explore premium imported furniture.`, 
    openGraph: {
      title: `${product.name} - RK Enterprise`,
      description: product.description || `Buy ${product.name} at RK Enterprise. Explore premium imported furniture.`,
      images: product.images && typeof product.images[0] === 'object'
        ? [urlForImage(product.images[0]).url()]
        : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - RK Enterprise`,
      description: product.description || `Buy ${product.name} at RK Enterprise. Explore premium imported furniture.`,
      images: product.images && typeof product.images[0] === 'object'
        ? [urlForImage(product.images[0]).url()]
        : [],
    }
  };
}
