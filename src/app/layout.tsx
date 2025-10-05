import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Changed to default import
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast'; // Import ToastProvider
import { Suspense } from 'react'; // Import Suspense
import WhatsAppButton from '@/components/WhatsAppButton'; // Import WhatsAppButton
import PerformanceOptimizer from '@/components/PerformanceOptimizer'; // Import PerformanceOptimizer

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'RK Enterprise - Premium Imported Furniture',
    template: '%s | RK Enterprise'
  },
  description: 'Your one-stop shop for quality imported furniture. Shop office chairs, dining sets, outdoor furniture, and more at unbeatable prices in Pakistan.',
  keywords: ['furniture', 'office furniture', 'dining furniture', 'imported furniture', 'Pakistan', 'RK Enterprise'],
  authors: [{ name: 'RK Enterprise' }],
  creator: 'RK Enterprise',
  publisher: 'RK Enterprise',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rkenterprise.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rkenterprise.com', // Replace with your actual domain
    title: 'RK Enterprise - Premium Imported Furniture',
    description: 'Your one-stop shop for quality imported furniture. Shop office chairs, dining sets, outdoor furniture, and more at unbeatable prices in Pakistan.',
    siteName: 'RK Enterprise',
    images: [
      {
        url: '/sitelogo.png',
        width: 1200,
        height: 630,
        alt: 'RK Enterprise Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RK Enterprise - Premium Imported Furniture',
    description: 'Your one-stop shop for quality imported furniture. Shop office chairs, dining sets, outdoor furniture, and more at unbeatable prices in Pakistan.',
    images: ['/sitelogo.png'],
    creator: '@rkenterprise', // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/sitelogo.png', sizes: '32x32', type: 'image/png' },
      { url: '/sitelogo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/sitelogo.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/sitelogo.png',
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RK Enterprise",
    "description": "Your one-stop shop for quality imported furniture. Shop office chairs, dining sets, outdoor furniture, and more at unbeatable prices in Pakistan.",
    "url": "https://rkenterprise.com",
    "logo": "https://rkenterprise.com/sitelogo.png",
    "image": "https://rkenterprise.com/sitelogo.png",
    "sameAs": [
      "https://www.facebook.com/rkenterprise",
      "https://www.instagram.com/rkenterprise",
      "https://twitter.com/rkenterprise"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-XXX-XXXXXXX",
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK",
      "addressLocality": "Pakistan"
    },
    "foundingDate": "2020",
    "founder": {
      "@type": "Person",
      "name": "RK Enterprise Founder"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification - Replace with your actual verification code */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" /> */}
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <PerformanceOptimizer />
        <CartProvider>
          <ToastProvider> 
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<div>Loading...</div>}> 
                  {children}
                </Suspense>
              </main>
              <Footer />
              <WhatsAppButton /> {/* Add WhatsAppButton here */}
            </div>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
