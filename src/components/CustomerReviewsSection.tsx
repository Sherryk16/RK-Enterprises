'use client';

import React from 'react';

interface Testimonial {
  name: string;
  review: string;
  rating: number;
}

const testimonials: Testimonial[] = [
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
];

const CustomerReviewsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600">Don&apos;t just take our word for it - hear from our satisfied customers</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">&quot;{testimonial.review}&quot;</p>
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
  );
};

export default CustomerReviewsSection;





