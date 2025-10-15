import { MetadataRoute } from 'next';
import { getAllCategories, getAllProducts, getAllSubcategories } from '@/lib/products';

const baseUrl = 'https://www.rkenterpriseshub.com'; // Your deployed website URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getAllCategories();
  const productsData = await getAllProducts(); // getAllProducts returns { products: SanityProduct[] }
  const products = productsData.products;
  const subcategories = await getAllSubcategories();

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date().toISOString(),
  }));

  const subcategoryRoutes = subcategories.map((sub) => ({
    url: `${baseUrl}/categories/${sub.category?.slug}/${sub.slug}`,
    lastModified: new Date().toISOString(),
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.created_at || new Date()).toISOString(),
  }));

  // Add static routes
  const staticRoutes = [
    '/',
    '/shop',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    // Add any other important static pages here
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...subcategoryRoutes,
    ...productRoutes,
  ];
}
