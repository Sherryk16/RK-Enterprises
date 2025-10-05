'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicCustomerReviewsSection = dynamic(
  () => import('@/components/CustomerReviewsSection'),
  { ssr: false } // Disable SSR for this component
);

export default function DynamicCustomerReviewsWrapper() {
  return (
    <Suspense fallback={<div>Loading reviews...</div>}>
      <DynamicCustomerReviewsSection />
    </Suspense>
  );
}




