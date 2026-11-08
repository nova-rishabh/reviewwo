/**
 * Shared SEO helpers. SITE_URL is the canonical public domain used in canonical tags,
 * the sitemap and structured data. It is read at build time and deliberately does not
 * fall back to NEXT_PUBLIC_APP_URL, which may point at a hosting subdomain.
 */
export const SITE_URL = (process.env.SITE_URL || 'https://reviewwo.divergit.com').replace(/\/$/, '');
export const SITE_NAME = 'Reviewwo';
export const UPDATED = '2026-11-08';

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

/** Builds page metadata with a canonical URL and matching Open Graph / Twitter tags. */
export function pageMetadata({ title, description, path, type = 'website', noindex = false }) {
  const url = absoluteUrl(path);
  const plainTitle = typeof title === 'string' ? title : title.absolute;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: plainTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Reviewwo Google review QR codes' }],
    },
    twitter: { card: 'summary_large_image', title: plainTitle, description, images: ['/opengraph-image'] },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/img/logos/icon-dark.png`,
  description: 'Google review QR codes that help local businesses in India collect reviews and hear about problems early.',
  areaServed: 'IN',
};

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema({ title, description, path, published = UPDATED, modified = UPDATED }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    datePublished: published,
    dateModified: modified,
    inLanguage: 'en-IN',
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/img/logos/icon-dark.png` },
    },
  };
}
