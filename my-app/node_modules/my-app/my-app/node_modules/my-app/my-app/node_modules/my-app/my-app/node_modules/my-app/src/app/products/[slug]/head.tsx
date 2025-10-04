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

  const title = `${product.name} - RK Enterprise`;
  const description = product.description || product.detailed_description || `Explore the ${product.name} from RK Enterprise. High-quality furniture for your home and office.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.rkenterprises.com/products/${product.slug}`,
      images: product.images && product.images.length > 0 ? product.images[0] : '/mainlogo.png',
    },
  };
}
