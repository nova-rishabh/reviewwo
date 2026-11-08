import Link from 'next/link';
import { SiteShell, PageIntro, CtaBand } from '../../components/content';
import { pageMetadata } from '../../src/lib/seo';
import { INDUSTRIES } from '../../src/content/industries';

export const metadata = pageMetadata({
  title: 'Google Review QR Codes by Business Type',
  description:
    'How restaurants, cafés, salons, clinics, shops, hotels and gyms use review QR codes to collect Google reviews and catch complaints early.',
  path: '/for',
});

export default function IndustriesIndex() {
  return (
    <SiteShell>
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Who it’s for', path: '/for' },
        ]}
        title="Review QR codes for every kind of local business"
        lead="The right moment to ask for a review is different in a salon than in a restaurant. Pick your business to see where to put your QR code, when to ask and what to say."
      />
      <section className="border-t border-line">
        <ul className="mx-auto grid max-w-6xl px-4 sm:px-6 md:grid-cols-2">
          {INDUSTRIES.map((i) => (
            <li key={i.slug} className="border-b border-line md:odd:border-r md:odd:pr-10 md:even:pl-10">
              <Link href={`/for/${i.slug}`} className="group block py-8">
                <h2 className="text-2xl font-bold group-hover:text-brand-700 group-hover:underline">{i.label}</h2>
                <p className="mt-2 text-ink-muted">{i.lead}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </SiteShell>
  );
}
