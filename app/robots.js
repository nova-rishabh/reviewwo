import { absoluteUrl } from '../src/lib/seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/onboarding', '/r/', '/review/', '/login', '/register'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
