import Link from 'next/link';

interface SEOContentProps {
  category?: string;
  relatedCategories?: string[];
}

export default function SEOContent({ category, relatedCategories }: SEOContentProps) {
  
  return (
    <section className="py-8 bg-gray-50" aria-labelledby="seo-content-heading">
      <div className="container mx-auto px-4">
        <h2 id="seo-content-heading" className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Why Choose RK Enterprise for Your Furniture Needs?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🏆 Premium Quality</h3>
            <p className="text-gray-600 text-sm">
              We source only the finest imported furniture from trusted manufacturers worldwide, 
              ensuring every piece meets our high standards for durability and comfort.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💰 Best Prices</h3>
            <p className="text-gray-600 text-sm">
              As one of Pakistan&apos;s largest furniture importers, we offer unbeatable prices 
              without compromising on quality. Compare our prices and see the difference.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🚚 Free Delivery</h3>
            <p className="text-gray-600 text-sm">
              Enjoy free nationwide delivery on all orders. We ensure your furniture 
              arrives safely and on time, anywhere in Pakistan.
            </p>
          </div>
        </div>

        {/* Category-specific content */}
        {category && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Explore Our {category} Collection
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Discover our extensive range of {category.toLowerCase()} designed for modern homes and offices. 
              From ergonomic designs to stylish aesthetics, we have everything you need.
            </p>
            {relatedCategories && relatedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Related categories:</span>
                {relatedCategories.map((cat, index) => (
                  <Link 
                    key={index} 
                    href={`/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-amber-600 hover:text-amber-700 underline"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">Do you offer free delivery across Pakistan?</h4>
              <p className="text-gray-600">Yes, we provide free nationwide delivery on all orders. Your furniture will be delivered safely to your doorstep.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">What is your return policy?</h4>
              <p className="text-gray-600">We offer a 100% money-back guarantee. If you&apos;re not satisfied with your purchase, we&apos;ll make it right.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">How long does delivery take?</h4>
              <p className="text-gray-600">Most orders are delivered within 3-7 business days, depending on your location in Pakistan.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


