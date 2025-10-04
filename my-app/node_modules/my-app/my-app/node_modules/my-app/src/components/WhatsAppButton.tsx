'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Import FaWhatsapp icon

const WhatsAppButton = () => {
  const phoneNumber = '+923453593470'; // Updated phone number
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" /> {/* Use FaWhatsapp icon */}
    </a>
  );
};

export default WhatsAppButton;
