import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://glow-connies-kaakyire.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/Kaakyire', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
