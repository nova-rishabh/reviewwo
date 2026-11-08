import { absoluteUrl, UPDATED } from '../src/lib/seo';
import { GUIDES } from '../src/content/guides';
import { INDUSTRIES } from '../src/content/industries';

export default function sitemap() {
  const page = (path, priority, changeFrequency = 'monthly') => ({
    url: absoluteUrl(path),
    lastModified: UPDATED,
    changeFrequency,
    priority,
  });
  return [
    page('/', 1.0, 'weekly'),
    page('/nfc-cards', 0.5),
    page('/features', 0.9),
    page('/how-it-works', 0.8),
    page('/pricing', 0.9, 'weekly'),
    page('/agency', 0.6),
    page('/for', 0.7),
    ...INDUSTRIES.map((i) => page(`/for/${i.slug}`, 0.7)),
    page('/guides', 0.7, 'weekly'),
    ...GUIDES.map((g) => page(`/guides/${g.slug}`, 0.8)),
  ];
}
