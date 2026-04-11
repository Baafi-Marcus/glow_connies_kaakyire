import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://glowbyconnie.local';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/Kaakyire', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
