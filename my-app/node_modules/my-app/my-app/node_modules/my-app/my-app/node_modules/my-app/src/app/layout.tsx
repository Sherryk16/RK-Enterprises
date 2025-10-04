import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Changed to default import
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast'; // Import ToastProvider
import { Suspense } from 'react'; // Import Suspense
import WhatsAppButton from '@/components/WhatsAppButton'; // Import WhatsAppButton

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RK Enterprise',
  description: 'Your one-stop shop for quality furniture.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
