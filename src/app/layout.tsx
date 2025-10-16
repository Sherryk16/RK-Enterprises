import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Changed to default import
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast'; // Import ToastProvider
import { Suspense } from 'react'; // Import Suspense
import ClientSideOptimizers from '@/components/ClientSideOptimizers'; // Import the new client wrapper
import { Metadata } from 'next'; // Import Metadata

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: 'RK Enterprises Hub - Premium Imported Furniture',
    template: '%s | RK Enterprises Hub Pakistan',
  },
  description: 'Shop Pakistan\'s largest collection of premium imported office chairs, dining sets, gaming chairs, study chairs, outdoor furniture & more. Best prices with nationwide delivery.',
  applicationName: 'RK Enterprises Hub',
  keywords: [
    'RK Enterprises Hub',
    'furniture Pakistan',
    'imported furniture',
    'office furniture',
    'dining furniture',
    'gaming chair',
    'waiting bench',
    'CEO chair',
    'manager chair',
    'study chair',
    'plastic chair',
    'steel chair',
    'wooden chair',
    'bar stools',
    'outdoor furniture',
    'home furniture',
    'furniture online Pakistan',
    'furniture delivery',
    'best furniture prices Pakistan',
  ],
  authors: [{
    name: 'RK Enterprises Hub',
    url: 'https://www.rkenterpriseshub.com'
  }],
  creator: 'RK Enterprises Hub',
  publisher: 'RK Enterprises Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://www.rkenterpriseshub.com',
    siteName: 'RK Enterprises Hub',
    title: 'RK Enterprises Hub - Premium Imported Furniture',
    description: 'Shop Pakistan\'s largest collection of premium imported office chairs, dining sets, gaming chairs, study chairs, outdoor furniture & more. Best prices with nationwide delivery.',
    images: [
      {
        url: '/sitelogo.png',
        width: 1200,
        height: 630,
        alt: 'RK Enterprises Hub - Premium Imported Furniture Store Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@rkenterprise',
    creator: '@rkenterprise',
    title: 'RK Enterprises Hub - Premium Imported Furniture',
    description: 'Shop Pakistan\'s largest collection of premium imported office chairs, dining sets, gaming chairs, study chairs, outdoor furniture & more. Best prices with nationwide delivery.',
    images: ['/sitelogo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RK Enterprises Hub",
    "description": "Pakistan's leading premium imported furniture store offering office chairs, dining sets, outdoor furniture, and more with nationwide delivery.",
    "url": "https://www.rkenterpriseshub.com",
    "logo": new URL('/sitelogo.png', process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").toString(),
    "image": new URL('/sitelogo.png', process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").toString(),
    "sameAs": [
      "https://www.facebook.com/rkenterprise",
      "https://www.instagram.com/rkenterprise",
      "https://twitter.com/rkenterprise"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+92-345-3593470", // Updated phone number
      "contactType": "customer service",
      "availableLanguage": ["English", "Urdu"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PK",
      "addressLocality": "Karachi",
      "addressRegion": "Sindh",
      "streetAddress": "Shop # G23, Panama Centre, Sir Shah Suleman Road, Opp. Essa Nagri, Hassan Square, Gulshan-e-Iqbal 13D"
    },
    "foundingDate": "2020",
    "founder": {
      "@type": "Person",
      "name": "RK Enterprises Hub Founder" // Updated to reflect company name
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
        <CartProvider>
          <ToastProvider>
            <ClientSideOptimizers>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Suspense fallback={<div>Loading...</div>}> 
                    {children}
                  </Suspense>
                </main>
                <Footer />
              </div>
            </ClientSideOptimizers>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
