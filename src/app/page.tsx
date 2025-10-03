import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCategories, getFeaturedProducts } from '@/lib/products';

export default async function Home() {
  // Fetch data from database
  let categories: any[] = [];
  let featuredProducts: any[] = [];
  let displayCategories: any[] = []; // Declare with let and initialize
  let displayProducts: any[] = [];   // Declare with let and initialize

  try {
    const [categoriesData, productsData] = await Promise.all([
      getAllCategories(),
      getFeaturedProducts()
    ]);

    // Removed hardcoded homepageCategoryNames filter to display all categories dynamically
    categories = categoriesData || [];
    featuredProducts = productsData || [];

    // Assign values here after data is fetched
    displayCategories = categories;
    displayProducts = featuredProducts;

    console.log('Home Page: Fetched categoriesData:', categoriesData); // DEBUG
    console.log('Home Page: Displaying categories:', displayCategories); // DEBUG
  } catch (error) {
    console.error('Error fetching data:', error);
    // Use fallback data if database fails
    // Ensure displayCategories and displayProducts are still arrays even on error
    displayCategories = [];
    displayProducts = [];
  }

  // Debug: Log the first product to see what data we have
  if (displayProducts.length > 0) {
    console.log('First product data:', displayProducts[0]);
  }

  return (
    <div className="min-h-screen bg-white">
      
      <main>
        <HeroSection />
        
        {/* Categories Section */}
               <section className="py-8 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">Our Collections</h2>
              <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our wide range of premium furniture collections designed to meet all your seating and furnishing needs
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {displayCategories.map((category) => {
                // Map category names to image files
                const getCategoryImage = (categoryName: string) => {
                  const imageMap: { [key: string]: string } = {
                    // Use normalized category names here if specific images are needed
                    'office furniture': '/office.png',
                    'dining furniture': '/dining.png',
                    'visitor bench': '/visitorsbench.png',
                    'study chair': '/study.png',
                    'outdoor range': '/outdoor.png',
                    'folding range': '/folding.png',
                    'molded furniture': '/molded.png',
                    'craft chair upvc': '/craft.png' // Corrected mapping for Craft Chair UPVC
                  };
                  // Ensure categoryName is normalized for consistent lookup
                  const normalizedCategoryName = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
                  return imageMap[normalizedCategoryName] || '/placeholder-category.jpg';
                };

                return (
                <CategoryCard
                    key={category.id || category.name}
                    title={category.name}
                  description={category.description}
                    href={category.href || `/categories/${category.slug}`}
                    itemCount={category.itemCount || 0}
                    icon={category.icon || "🪑"}
                    image={getCategoryImage(category.name)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Branded Banner - Background image with overlay text */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="relative w-full overflow-hidden rounded-2xl shadow-lg h-56 sm:h-64 lg:h-80">
              {/* Background Image */}
              <Image
                src="/section.png"
                alt="RK Enterprises banner"
                fill
                priority
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
                <h3 className="text-xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight">
                  Premium Furniture, Unbeatable Value
                </h3>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-lg max-w-3xl">
                  Imported quality for offices, homes, dining, and outdoor spaces. Large stock, ready to ship.
                </p>
                <div className="mt-4 sm:mt-6">
                  <a href="/shop" className="btn-primary text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Top quality furniture at unbeatable prices. Huge variety and stock available, ready to ship.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {displayProducts.map((product) => {
                // Calculate discount percentage if original_price exists
                let discountPercentage = 0;
                if (product.original_price && product.original_price > product.price) {
                  discountPercentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
                }

                return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                    originalPrice={product.original_price}
                    category={product.categories?.name || product.category}
                    slug={product.slug}
                    rating={product.rating || 4.5}
                    reviews={product.reviews || 0}
                    isNew={product.isNew || false}
                    discount={discountPercentage}
                    image={product.images?.[0] || "/placeholder-product.jpg"}
                  />
                );
              })}
            </div>
            
            <div className="text-center mt-12">
              <a href="/shop" className="btn-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg">
                View All Products
              </a>
            </div>
          </div>
        </section>

        {/* Special Features Section */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Free Shipping Nationwide</h3>
                <p className="text-amber-100">Enjoy Free Shipping Nationwide. Fast, reliable delivery straight to your doorstep!</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Money Back Guarantee</h3>
                <p className="text-amber-100">Shop with confidence – 100% Money Back Guarantee. If you're not satisfied, we'll make it right!</p>
              </div>
              
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">24/7 Chat Support</h3>
                <p className="text-amber-100">Need help anytime? We're here for you 24/7. Chat with our support team here.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
              <p className="text-xl text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Imtiaz Sadiq",
                  review: "I have purchased 6 imported dining chairs, 1 computer revolving chair 2 study chair and 2 study table, all have good quality. Thanks! Ahsan bhai, for giving us good and quick service. 🥰❤️",
                  rating: 5
                },
                {
                  name: "Sharoq Khan",
                  review: "I purchased Revolving chair for my House, 100% Satisfied about quality & services, Thanks, keep up good work, highly recommended",
                  rating: 5
                },
                {
                  name: "Asanka Nishan",
                  review: "Great service, highly recommend",
                  rating: 5
                },
                {
                  name: "Farhan Akram",
                  review: "Behtareen services Very good communication skill Saab k items lajawab Hain",
                  rating: 5
                },
                {
                  name: "Mohammed Adeel",
                  review: "Product is really good!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
        </section>
      </main>
      
    </div>
  );
}