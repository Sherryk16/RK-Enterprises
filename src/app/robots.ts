import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/(auth)'], // Disallow Sanity Studio and authentication routes
    },
    sitemap: process.env.NEXT_PUBLIC_BASE_URL + '/sitemap.xml',
  };
}
