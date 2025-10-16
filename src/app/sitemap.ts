import { MetadataRoute } from 'next';
import { getAllCategories, SanityCategory } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const categories = await getAllCategories();
  const categoryRoutes = (categories || []).map((category: SanityCategory) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date().toISOString(), // Assuming categories don't change very often
    changeFrequency: 'weekly' as const,
    priority: 0.8 as const,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1 as const,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9 as const,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7 as const,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7 as const,
    },
    ...categoryRoutes,
  ];
}
