import { getProductBySlug } from '@/lib/products';
import type { Metadata } from 'next';

interface Product {
  id: string;
  name: string;
  description?: string;
  detailed_description?: string;
  slug: string;
  images?: string[]; // Add images property here
}

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata> {
  const product: Product | null = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found - RK Enterprise',
      description: 'The requested product could not be found.',
    };
  }

  const title = `${product.name} | Premium Furniture Pakistan | RK Enterprise`;
  const description = product.description || product.detailed_description || `Buy ${product.name} from RK Enterprise - Pakistan's leading furniture store. Premium quality, best prices, free delivery nationwide.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      'furniture Pakistan',
      'imported furniture',
      'RK Enterprise',
      'premium furniture',
      'furniture online shopping',
      'furniture delivery Pakistan'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://rkenterprise.com/products/${product.slug}`,
      images: product.images && product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: `${product.name} - Premium Furniture by RK Enterprise`,
        }
      ] : [
        {
          url: '/sitelogo.png',
          width: 800,
          height: 600,
          alt: 'RK Enterprise Logo',
        }
      ],
      siteName: 'RK Enterprise',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : ['/sitelogo.png'],
    },
    alternates: {
      canonical: `https://rkenterprise.com/products/${product.slug}`,
    },
  };
}
