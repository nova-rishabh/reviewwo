import Link from 'next/link';
import { SiteShell, PageIntro, CtaBand, JsonLd } from '../../components/content';
import { pageMetadata, absoluteUrl } from '../../src/lib/seo';
import { GUIDES } from '../../src/content/guides';

export const metadata = pageMetadata({
  title: 'Google Review Guides for Local Businesses',
  description:
    'Free guides on getting more Google reviews, creating a review link, finding your Place ID, replying to negative reviews and following Google’s review rules.',
  path: '/guides',
});

export default function GuidesIndex() {
  return (
    <SiteShell>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Google review guides',
          url: absoluteUrl('/guides'),
          hasPart: GUIDES.map((g) => ({ '@type': 'Article', headline: g.title, url: absoluteUrl(`/guides/${g.slug}`) })),
        }}
      />
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ]}
        title="Guides to Google reviews"
        lead="Practical, plain-language guides for shop owners, restaurant managers, salon owners and clinics. No jargon, and nothing that breaks Google’s rules."
      />
      <section className="border-t border-line">
        <ol className="mx-auto max-w-6xl divide-y divide-line px-4 sm:px-6">
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group grid gap-2 py-8 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-10">
                <h2 className="text-xl font-bold group-hover:text-brand-700 group-hover:underline">{g.title}</h2>
                <p className="text-ink-muted">{g.description}</p>
                <span className="text-sm text-ink-subtle">{g.readMinutes} min read</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand />
    </SiteShell>
  );
}
