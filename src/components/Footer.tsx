import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Import social icons

const Footer = () => {
  const categories = [
    'Office Furniture',
    'Dining Furniture', 
    'Visitor Bench',
    'Study Chair',
    'Outdoor Range',
    'Folding Range',
    'Molded Furniture'
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="/mainlogo-removebg-preview.png"
                alt="RK Enterprises Hub"
                width={100}
                height={60}
                className="rounded-lg w-24 h-16"
                quality={100}
              />
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop destination for premium imported furniture. We offer the best quality 
              office chairs, dining furniture, and seating solutions at unbeatable prices.
            </p>

            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/RKEnterprisesOfficialPK"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/r.kenterprisesfurniture"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/923453593"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link 
                    href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Showrooms</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a 
                  href="http://maps.google.com/maps/search/Rk%20Enterprise/@24.9062,67.0656,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:underline"
                >
                  <div className="text-sm text-gray-300">
                    <p>Shop # G23, Panama Centre</p>
                    <p>Sir Shah Suleman Road, Opp. Essa Nagri</p>
                    <p>Hassan Square, Gulshan-e-Iqbal</p>
                    <p>13D, Karachi</p>
                  </div>
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/923453593470" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:underline">
                  +92 345 3593470
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:Info@rkenterpriseshub.com" className="text-sm text-gray-300 hover:underline">
                  Info@rkenterpriseshub.com
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-amber-500"
                />
                <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-lg text-sm font-medium transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 RK Enterprises Hub. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🚚 Free Shipping Nationwide</span>
              <span>🛡️ Money Back Guarantee</span>
              <span>💬 24/7 Chat Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
