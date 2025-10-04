import { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/products';

const BASE_URL = 'https://www.rkenterprises.com'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getAllProducts();
  const categories = await getAllCategories();

  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    { url: `${BASE_URL}/`, lastModified: new Date().toISOString(), changeFrequency: 'yearly' as const, priority: 1.0 },
    { url: `${BASE_URL}/shop`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date().toISOString(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date().toISOString(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date().toISOString(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
