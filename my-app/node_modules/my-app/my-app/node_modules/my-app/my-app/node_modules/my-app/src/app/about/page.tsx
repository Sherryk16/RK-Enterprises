'use client';

import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AboutPage() {
  const router = useRouter();

  const handleGetDirections = () => {
    window.open('http://maps.google.com/maps/search/Rk%20Enterprise/@24.9062,67.0656,17z', '_blank');
  };

  const handleContactUs = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-white">
      
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About RK Enterprises Hub</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Your trusted partner in premium furniture solutions since our establishment
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    R.K. Enterprises, established with a vision to redefine living and working spaces,
                    stands as a leading name in Pakistan&apos;s furniture industry. We specialize in both
                    manufacturing and importing high-quality furniture, offering an exquisite blend
                    of comfort, durability, and contemporary style to homes and offices nationwide.
                  </p>
                  <p>
                    Our diverse portfolio boasts a comprehensive range of furniture solutions, including
                    ergonomic executive chairs, modern revolving chairs, sophisticated imported kitchen furniture,
                    chic counter bar stools, elegant dining chairs, versatile restaurant seating,
                    functional school study chairs, comfortable imported benches, and luxurious auditorium seating.
                    Each piece is carefully selected or crafted to meet the highest standards of design and functionality.
                  </p>
                  <p>
                    As one of the largest furniture importers in Pakistan, our strength lies in providing
                    unbeatable value. We are committed to offering the lowest prices without compromising
                    on quality, ensuring that premium furniture is accessible to everyone. Our unwavering
                    dedication to excellence and customer satisfaction is the cornerstone of our success,
                    making RK Enterprises the preferred choice for discerning customers across the country.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="/about-hero.webp" // Placeholder image for a more modern look
                  alt="RK Enterprises Showroom"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission & Core Values</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Driving excellence through quality, integrity, and unparalleled customer satisfaction
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To empower individuals and businesses across Pakistan with access to premium, stylish,
                  and ergonomically designed furniture that enhances well-being and productivity.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💎</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Uncompromising Quality</h3>
                <p className="text-gray-600">
                  We meticulously select imported furniture and employ stringent manufacturing processes
                  to ensure every product reflects superior craftsmanship and lasting durability.
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Customer Centricity</h3>
                <p className="text-gray-600">
                  Our customers are at the core of our business. We commit to understanding their needs
                  and providing exceptional service that builds lasting relationships and trust.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose RK Enterprises?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the difference with our dedication to value, quality, and service
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-white">🌟</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Unbeatable Value</h3>
                <p className="text-gray-600 text-sm">Highest quality products at the most competitive prices in Pakistan.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-white">🌍</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Extensive Range</h3>
                <p className="text-gray-600 text-sm">A vast selection of modern and classic furniture for every need.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-white">🚀</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Nationwide Reach</h3>
                <p className="text-gray-600 text-sm">Reliable and fast delivery services across all major cities in Pakistan.</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-white">🏆</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Award-Winning Service</h3>
                <p className="text-gray-600 text-sm">Dedicated support team committed to your satisfaction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Showroom Information (Simplified) */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Visit Our Showroom</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience the quality and comfort of our furniture firsthand at our Karachi showroom.
            </p>
            <a 
              onClick={handleGetDirections} 
              className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-700 transition-colors duration-300 inline-flex items-center space-x-2 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Get Directions</span>
            </a>
            <button 
              onClick={handleContactUs}
              className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 hover:text-white transition-colors duration-300 ml-4"
            >
              Contact Us
            </button>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have chosen RK Enterprises for their furniture needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300">
                Shop Now
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 transition-colors duration-300">
                Get Quote
              </Link>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
}
