import Link from 'next/link';
import { SiteShell, PageIntro, FaqSection, CtaBand } from '../../components/content';
import { pageMetadata } from '../../src/lib/seo';

export const metadata = pageMetadata({
  title: 'Google Review QR Codes for Marketing Agencies',
  description:
    'Offer Google review QR codes to the local businesses you manage. Set up each client in minutes and add review collection to your local SEO services.',
  path: '/agency',
});

const points = [
  ['One account per client', 'Each business gets its own Reviewwo account, so its QR codes, feedback and alerts stay separate from your other clients. Reviews always go to the right Google listing.'],
  ['You can set it up for them', 'Go through the four-step setup on your client’s behalf: business details, Google listing, alert number and first QR code. It takes about ten minutes per client.'],
  ['Pick the plan that fits', 'Starter covers one QR code. Growth and Agency cover up to 5 and 25, for venues with many tables, rooms or counters.'],
];

const playbook = [
  ['Audit the listing first', 'Before printing QR codes, check the client’s Google Business Profile: correct category, opening hours, photos and a verified address. Reviews help most when the rest of the listing is complete.'],
  ['Find the Place ID', 'Use Google’s Place ID finder and test the review link before printing anything. Multi-branch clients need one Place ID per branch.'],
  ['Choose placements with the owner', 'Agree where customers finish their visit: the till, the table, the mirror. Name each QR code after its location so you can report on it.'],
  ['Brief the staff', 'Give the team one sentence to say and tell them who asks. A request from the person who served the customer works best.'],
  ['Set the alert number', 'Use the manager who is on the floor, not the owner who is rarely in. Send a test message together so they know what an alert looks like.'],
  ['Review monthly', 'Look at scans per QR code, private feedback and new Google reviews together. Move quiet codes and share what customers are saying.'],
];

const faqs = [
  {
    q: 'Can I manage all my clients from one login?',
    a: 'Not yet. Each client business has its own Reviewwo account. This keeps every client’s QR codes, feedback and alert numbers separate.',
  },
  {
    q: 'Can I resell Reviewwo to my clients?',
    a: 'Yes. Agencies can include Reviewwo in their local SEO or social media packages. Set the price you charge your clients yourself. Clients can also add NFC cards if they want them.',
  },
  {
    q: 'Does Reviewwo follow Google’s review rules?',
    a: 'Yes. Every customer is offered the Google review option, there are no incentives, and customers write their own reviews. This protects your clients’ listings from having reviews removed.',
  },
  {
    q: 'Who receives private feedback for a client?',
    a: 'The alert number you set in that client’s account, usually their store manager. Feedback is also stored in that client’s dashboard.',
  },
];

export default function AgencyPage() {
  return (
    <SiteShell>
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'For agencies', path: '/agency' },
        ]}
        title="Google review QR codes for agencies that look after local businesses"
        lead="Reviewwo gives you a simple, practical service to offer clients: a QR code that helps them collect Google reviews and catch complaints early, set up in minutes per client."
      >
        <div className="mt-8">
          <Link href="/register" className="btn btn-primary btn-lg">Set up a client</Link>
        </div>
      </PageIntro>

      <section className="border-t border-line bg-canvas py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
          {points.map(([t, d]) => (
            <div key={t}>
              <h2 className="font-sans text-lg font-semibold">{t}</h2>
              <p className="mt-1.5 text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-3xl font-bold">A rollout playbook for each client</h2>
            <p className="mt-3 text-ink-muted">
              The steps we recommend when you add review QR codes to a client’s marketing.
            </p>
          </div>
          <ol className="space-y-6">
            {playbook.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-sm font-semibold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-sans text-lg font-semibold">{t}</h3>
                  <p className="mt-1 text-ink-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Resources to share with clients</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li><Link href="/guides/get-more-google-reviews" className="link">How to get more Google reviews</Link></li>
            <li><Link href="/guides/google-review-policy" className="link">Google review rules for businesses</Link></li>
            <li><Link href="/guides/respond-to-negative-google-reviews" className="link">How to respond to negative Google reviews</Link></li>
            <li><Link href="/for" className="link">Advice by business type</Link></li>
          </ul>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <CtaBand />
    </SiteShell>
  );
}
