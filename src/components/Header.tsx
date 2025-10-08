'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShoppingCart from './ShoppingCart';
import HeaderSearch from './HeaderSearch'; // Import the new HeaderSearch component
import { getCategoriesWithSubcategories } from '@/lib/products'; // Removed getSharedSubcategories as it's no longer needed in transformCategories
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation'; // Import useRouter
import { usePathname } from 'next/navigation'; // Import usePathname
import { simpleSlugify, StructuredCategory, StructuredSubcategory, transformCategories } from '@/lib/utils'; // Import simpleSlugify from utils


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [navCategories, setNavCategories] = useState<StructuredCategory[]>([]);
  const { cartCount } = useCart();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter(); // Initialize useRouter
  // Removed local slugify as simpleSlugify is imported from utils

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  const pathname = usePathname(); // Initialize usePathname

  useEffect(() => {
    setIsMenuOpen(false); // Close menu whenever pathname changes
  }, [pathname]);

  console.log('isMenuOpen:', isMenuOpen); // Debug log for menu state

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const categoriesData = await getCategoriesWithSubcategories(); // No need for sharedSubcategories anymore
        
        console.log('Header: Raw categoriesData from DB:', JSON.stringify(categoriesData, null, 2)); // DEBUG LOG: Log full content
        console.log('Header: Raw sharedSubcategories:', categoriesData); // DEBUG LOG

        if (isMounted) {
          // Display all categories fetched, no manual filtering needed
          // const allCategories: NavCategory[] = (categoriesData || []).map((category: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
          //   ...category,
          //   category_subcategories: (category.category_subcategories || []).map((link: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
          //     subcategory_id: link.subcategory_id as NavSubcategory
          //   }))
          // }));
          
          // console.log('All Categories for Header (before shared subcategories):', allCategories); // TEMP DEBUG LOG

          // Add shared subcategories to relevant categories
          // allCategories.forEach((category: NavCategory) => {
          //   const catSlug = category.slug || simpleSlugify(category.name || '');
          //   const sharedSubs = sharedSubcategories.filter((sub: NavSubcategory & { categories: string[] }) => 
          //     sub.categories.includes(catSlug) || 
          //     sub.categories.includes(category.slug) ||
          //     (category.name && sub.categories.some((slug: string) => 
          //       simpleSlugify(category.name).includes(simpleSlugify(slug)) || 
          //       simpleSlugify(slug).includes(simpleSlugify(category.name))
          //     ))
          //   );
          //   
          //   if (sharedSubs.length > 0) {
          //     category.subcategories = [
          //       ...(category.subcategories || []),
          //       ...sharedSubs
          //     ];
          //   }
          // });
          
          const transformed = transformCategories(categoriesData || []);
          setNavCategories(transformed);
          console.log('Header: Final Navigation Categories (after transform):', JSON.stringify(transformed, null, 2)); // CRITICAL DEBUG LOG
          console.log('Final Navigation Categories (with shared subcategories):', transformed); // TEMP DEBUG LOG
        }
      } catch (e: unknown) {
        console.error("Error fetching navigation categories:", e); // Add error logging
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-amber-800 to-amber-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-2 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 md:space-x-4">
              <span className="text-xs md:text-sm">🚚 Nation-Wide Delivery</span>
              <span className="text-xs md:text-sm">💎 100% Imported</span>
              <span className="text-xs md:text-sm">💳 Card Payments</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end space-x-2 md:space-x-4">
              <a href="tel:+923453593470" className="text-xs md:text-sm hover:underline">
                📞 +92 345 3593470
              </a>
              <a 
                href="https://wa.me/923453593470" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs md:text-sm hover:underline"
              >
                (WhatsApp)
              </a>
              <a href="mailto:Info@rkenterpriseshub.com" className="text-xs md:text-sm hidden sm:inline hover:underline">
                📧 Info@rkenterpriseshub.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-2">
        {/* Mobile Layout - Two rows */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/mainlogo-removebg-preview.png"
                alt="RK Enterprises Hub"
                width={300}
                height={100}
                className="rounded-lg w-32 h-16"
                quality={100}
                priority
              />
            </Link>

            {/* Search, Cart & Menu */}
            <div className="flex items-center space-x-1">
              {/* Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 text-gray-700 hover:text-amber-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-1 text-gray-700 hover:text-amber-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5 6m0 0h9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
              
              {/* Menu */}
              <button
                className="p-1 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Search Bar - Appears when search icon is clicked */}
          {isSearchOpen && (
            <div className="mt-2">
              <HeaderSearch />
            </div>
          )}
        </div>

        {/* Desktop Layout - Single row with full navigation */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/mainlogo-removebg-preview.png"
              alt="RK Enterprises Hub"
              width={300}
              height={100}
              className="rounded-lg w-40 h-20"
              quality={100}
              priority
            />
          </Link>

          {/* Search Bar */}
          <HeaderSearch />

          {/* Desktop Navigation Links and Cart */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium text-sm">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-amber-600 font-medium text-sm">
              Shop
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 font-medium text-sm">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 font-medium text-sm">
              Contact
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-amber-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5 6m0 0h9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Menu - Visible on desktop, hidden on mobile */}
      <div className="hidden md:block bg-gradient-to-r from-amber-800 to-amber-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between py-3 space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-6">
              
              {navCategories.map((category: StructuredCategory) => {
                const catSlug = category.slug || simpleSlugify(category.name || '');
                return (
                <div key={category.id} className="relative group">
                  <Link
                    href={`/categories/${catSlug}`}
                    className="text-white hover:text-gray-200 font-medium text-sm flex items-center space-x-1" 
                  >
                    <span>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                    {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    )}
                  </Link>
                  
                  {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-lg border border-gray-200 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                        {category.subcategories.map((sub: StructuredSubcategory) => {
                          // const sub = link.subcategory_id; // Access the nested subcategory_id object
                          const subSlug = sub.slug || simpleSlugify(sub.name || '');
                          return (
                        <Link
                            key={sub.id}
                            href={`/categories/${catSlug}/${subSlug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600"
                        >
                            {sub.name}
                        </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
            <div className="hidden md:flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-white text-center">New Arrival SALE - Up to 60% OFF!</span>
              <button className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-red-700">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" onClick={() => handleLinkClick('/')} className="text-gray-700 hover:text-amber-600 font-medium py-2">
                Home
              </Link>
              <Link href="/shop" onClick={() => handleLinkClick('/shop')} className="text-gray-700 hover:text-amber-600 font-medium py-2">
                Shop
              </Link>
              <Link href="/about" onClick={() => handleLinkClick('/about')} className="text-gray-700 hover:text-amber-600 font-medium py-2">
                About
              </Link>
              <Link href="/contact" onClick={() => handleLinkClick('/contact')} className="text-gray-700 hover:text-amber-600 font-medium py-2">
                Contact
              </Link>
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
                <div className="space-y-3">
                  {navCategories.map((category: StructuredCategory) => {
                    const catSlug = category.slug || simpleSlugify(category.name || '');
                    return (
                    <div key={category.id} className="space-y-2">
                      <Link
                        href={`/categories/${catSlug}`}
                        onClick={() => handleLinkClick(`/categories/${catSlug}`)}
                        className="text-sm font-medium text-gray-800 hover:text-amber-600 block"
                      >
                        {category.name}
                      </Link>
                      {Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
                      <div className="pl-4 space-y-1">
                          {category.subcategories.map((sub: StructuredSubcategory) => {
                            // const sub = link.subcategory_id; // Access the nested subcategory_id object
                            const subSlug = sub.slug || simpleSlugify(sub.name || '');
                            return (
                          <Link
                              key={sub.id}
                              href={`/categories/${catSlug}/${subSlug}`}
                              onClick={() => handleLinkClick(`/categories/${catSlug}/${subSlug}`)}
                            className="text-xs text-gray-600 hover:text-amber-600 block py-1"
                          >
                              {sub.name}
                          </Link>
                            );
                          })}
                      </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;


