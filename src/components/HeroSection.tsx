'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/hero.png', '/hero1.png', '/hero2.png', '/hero3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-2 md:py-6 lg:py-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full translate-x-40 translate-y-40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-2 md:gap-4 lg:gap-4 items-center">
          {/* Left Content */}
          <div className="space-y-1 md:space-y-3 lg:space-y-3 text-center lg:text-left">
            <div className="space-y-1 lg:space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-4xl font-bold text-gray-800 leading-tight">
                Premium
                <span className="text-amber-600 block">Furniture</span>
                Solutions
              </h1>
              <p className="text-xs sm:text-sm lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Your one-stop destination for premium imported furniture including office chairs, 
                dining chairs, bar stools, gaming chairs, and more. Best quality at unbeatable prices.
              </p>
            </div>


            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-1 md:gap-2 lg:gap-3 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="btn-primary text-white px-3 lg:px-6 py-1.5 lg:py-3 rounded-full font-semibold text-xs lg:text-base text-center hover:shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-amber-600 text-amber-600 px-3 lg:px-6 py-1.5 lg:py-3 rounded-full font-semibold text-xs lg:text-base text-center hover:bg-amber-600 hover:text-white"
              >
                Get Quote
              </Link>
            </div>

            {/* Sale Badge - Hidden on mobile */}
            <div className="hidden md:inline-flex items-center space-x-2 bg-red-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full">
              <span className="text-lg lg:text-xl">🔥</span>
              <div>
                <p className="font-bold text-xs lg:text-sm">New Arrival SALE</p>
                <p className="text-xs">Up to 60% OFF!</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Slideshow */}
          <div className="relative">
            <div className="aspect-square w-64 md:w-80 lg:w-96 xl:w-[28rem] mx-auto rounded-xl overflow-hidden">
              <Image
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt="Premium Furniture"
                width={448}
                height={448}
                className="w-full h-full object-contain rounded-xl transition-opacity duration-500"
                priority={currentImageIndex === 0}
              />
            </div>
            
            {/* Slide Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-amber-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
