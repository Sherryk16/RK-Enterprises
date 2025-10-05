import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About RK Enterprise - Pakistan\'s Leading Furniture Store | Premium Imported Furniture',
  description: 'Learn about RK Enterprise, Pakistan\'s premier furniture store. We specialize in premium imported furniture, office chairs, dining sets, and more. Established with a vision to redefine living spaces.',
  keywords: [
    'about RK Enterprise',
    'furniture company Pakistan',
    'furniture store history',
    'premium furniture Pakistan',
    'imported furniture company',
    'office furniture manufacturer',
    'dining furniture supplier',
    'furniture business Pakistan'
  ],
  openGraph: {
    title: 'About RK Enterprise - Pakistan\'s Leading Furniture Store',
    description: 'Learn about RK Enterprise, Pakistan\'s premier furniture store specializing in premium imported furniture for homes and offices.',
    type: 'website',
    url: 'https://rkenterprise.com/about',
    images: [
      {
        url: '/sitelogo.png',
        width: 1200,
        height: 630,
        alt: 'About RK Enterprise - Pakistan Furniture Store',
      },
    ],
  },
  alternates: {
    canonical: 'https://rkenterprise.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
