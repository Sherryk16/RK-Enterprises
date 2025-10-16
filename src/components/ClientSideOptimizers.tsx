'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
// import { Metadata } from 'next'; // No longer needed
// import { DefaultSeo } from 'next-seo'; // No longer needed

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const PerformanceOptimizer = dynamic(() => import('@/components/PerformanceOptimizer'), { ssr: false });

interface ClientSideOptimizersProps {
  children: ReactNode;
  // defaultSeoConfig: Metadata; // No longer needed
}

export default function ClientSideOptimizers({ children }: ClientSideOptimizersProps) {
  return (
    <>
      <PerformanceOptimizer />
      <WhatsAppButton />
      {children} {/* CartProvider and ToastProvider are now in layout.tsx */}
    </>
  );
}

