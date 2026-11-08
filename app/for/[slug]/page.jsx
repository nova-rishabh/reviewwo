import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell, PageIntro, FaqSection, CtaBand } from '../../../components/content';
import QrSign from '../../../components/QrSign';
import { pageMetadata } from '../../../src/lib/seo';
import { INDUSTRIES, industryBySlug } from '../../../src/content/industries';

const EXAMPLE_NAMES = {
  restaurants: 'Spice Route Kitchen',
  cafes: 'The Corner Café',
  salons: 'Glow Salon',
  clinics: 'City Family Clinic',
  retail: 'Mehta Electronics',
  hotels: 'Hillview Homestay',
  gyms: 'Iron Box Fitness',
};

export const dynamicParams = false;

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return {};
  return pageMetadata({ title: ind.metaTitle, description: ind.metaDescription, path: `/for/${slug}` });
}

export default async function IndustryPage({ params }) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();
  const others = INDUSTRIES.filter((i) => i.slug !== slug);

  return (
    <SiteShell>
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Who it’s for', path: '/for' },
          { name: ind.label, path: `/for/${slug}` },
        ]}
        title={ind.h1}
        lead={ind.lead}
        aside={
          <div className="mx-auto w-full max-w-[300px] py-6">
            <QrSign businessName={EXAMPLE_NAMES[slug]} className="rotate-[-3deg]" />
          </div>
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className="btn btn-primary btn-lg">Get started</Link>
          <Link href="/r/demo" className="btn btn-secondary btn-lg">Try the review page</Link>
        </div>
      </PageIntro>

      <section className="border-t border-line py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-bold">When to ask</h2>
          <div className="max-w-2xl space-y-5 text-[17px] leading-relaxed text-ink-muted">
            <p>{ind.moment}</p>
            <blockquote className="border-l-2 border-brand-800 pl-5 text-ink">{ind.script}</blockquote>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-bold">Where to put your QR code</h2>
          <dl className="grid gap-8 sm:grid-cols-3">
            {ind.placement.map(([t, d]) => (
              <div key={t}>
                <dt className="font-semibold text-ink">{t}</dt>
                <dd className="mt-1.5 text-ink-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">What customers can mention</h2>
            <p className="mt-3 text-ink-muted">
              On the review page, customers who had a good visit can pick what stood out to get a starting sentence.
              They change it however they like before posting.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Suggested topics">
              {ind.mentions.map((m) => (
                <li key={m} className="rounded-full border border-line px-3 py-1.5 text-sm text-ink">{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Problems worth catching early</h2>
            <p className="mt-3 text-ink-muted">
              Any customer can send the manager a private message from the review page. For{' '}
              {ind.label.toLowerCase()}, these are common problems worth hearing about while you can still fix them:
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-ink-muted">
              {ind.catchEarly.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <p className="mt-5 text-ink-muted">
              Messages reach the manager’s WhatsApp straight away and are kept in your feedback inbox. Customers can
              still leave a public Google review as well.
            </p>
          </div>
        </div>
        {ind.note && (
          <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
            <p className="rounded-[10px] border border-line bg-canvas px-5 py-4 text-ink-muted">{ind.note}</p>
          </div>
        )}
      </section>

      <FaqSection faqs={ind.faqs} tinted />

      <section className="border-t border-line py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Read next</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <li><Link href="/guides/get-more-google-reviews" className="link">How to get more Google reviews</Link></li>
            <li><Link href="/guides/respond-to-negative-google-reviews" className="link">How to respond to negative reviews</Link></li>
            <li><Link href="/how-it-works" className="link">How Reviewwo QR codes work</Link></li>
          </ul>
          <h2 className="mt-12 text-2xl font-bold">Other businesses</h2>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {others.map((o) => (
              <li key={o.slug}><Link href={`/for/${o.slug}`} className="link">{o.label}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
