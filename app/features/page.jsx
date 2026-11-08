import Link from 'next/link';
import { SiteShell, PageIntro, FaqSection, CtaBand } from '../../components/content';
import { pageMetadata } from '../../src/lib/seo';

export const metadata = pageMetadata({
  title: 'Features: Google Reviews and Private Feedback',
  description:
    'Google review QR codes, a mobile review page, private feedback with WhatsApp alerts to your manager and scan tracking. See everything included.',
  path: '/features',
});

const groups = [
  {
    id: 'customers',
    title: 'For your customers',
    intro:
      'Customers only see one short page. It is built to load quickly on mobile data and to get them to your Google review form in as few taps as possible.',
    items: [
      ['A page with your name on it', 'Scanning your QR code opens a page showing your business name and city, and asks “How was your visit?”. There is no Reviewwo sign-up and nothing to install.'],
      ['A quick star rating', 'Customers choose one to five stars. The rating helps them decide what to do next; it is not posted anywhere by itself.'],
      ['Help with what to write', 'Customers who had a good visit can pick what stood out, such as “Friendly staff” or “Great coffee”, to get a starting sentence. They change it however they like.'],
      ['Straight to Google', 'One tap copies their words and opens the Google review form for your listing. They choose their stars on Google, paste and post.'],
      ['A private line to the manager', 'Anyone can send the manager a private message. Customers who rate one to three stars are invited to do this first, and they can still post on Google too.'],
      ['Works on any phone', 'Any phone camera can scan the QR code. The page loads quickly on mobile data and needs no app.'],
    ],
  },
  {
    id: 'owners',
    title: 'For you and your manager',
    intro:
      'The dashboard is for the person who runs the shop day to day. It shows what happened since you last looked and what needs doing.',
    items: [
      ['WhatsApp alerts for private feedback', 'When a customer sends a private message, the manager’s WhatsApp gets the rating, the QR code it came from, the message and any contact details the customer chose to share.'],
      ['Feedback inbox', 'Every message is saved. Mark each one resolved with a note of what you did, or reopen it if the problem comes back.'],
      ['QR codes and scans', 'Create a QR code for each counter, table or room. Name it after where it sits and see how often it is scanned and when it was last used.'],
      ['Print it anywhere', 'Download each QR code as PNG or as SVG for sharp printing at any size: table signs, stickers, bills, menus or posters.'],
      ['Guided setup', 'Four steps after sign-up: business details, Google listing, alert number and your first QR code. You can test the Google link and send a test alert as you go.'],
      ['Change things without reprinting', 'Your QR code points to your Reviewwo page, not straight to Google. If you correct your Place ID or alert number, every printed code uses the new details immediately.'],
    ],
  },
];

const faqs = [
  {
    q: 'Does Reviewwo post reviews or replies to Google for me?',
    a: 'No. Customers post their own reviews from their own Google accounts, and you reply from your Google Business Profile. Reviewwo makes it quick for customers to get to your review form and gives you a private feedback channel.',
  },
  {
    q: 'Does Reviewwo show my Google reviews in the dashboard?',
    a: 'Not at the moment. The dashboard shows QR code scans and private feedback. Read and reply to your Google reviews in your Business Profile or the Google Maps app.',
  },
  {
    q: 'Who receives the WhatsApp alerts?',
    a: 'The number you choose during setup, usually the store manager. You can change it at any time under Settings and send a test message to check it works.',
  },
  {
    q: 'What language is the review page in?',
    a: 'The review page is in English. Customers can write their Google review in any language they like.',
  },
  {
    q: 'Can I use Reviewwo for more than one branch?',
    a: 'Each branch has its own Google listing, so each needs its own Reviewwo account. That keeps reviews, QR codes and feedback separate for every location.',
  },
];

export default function FeaturesPage() {
  return (
    <SiteShell>
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Features', path: '/features' },
        ]}
        title="Everything you need to collect Google reviews in person"
        lead="Reviewwo does two things well: it makes it easy for customers to review you on Google, and it gives them a quick, private way to tell you when something went wrong."
      >
        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="link">{g.title}</a>
          ))}
          <a href="#limits" className="link">What it does not do</a>
        </nav>
      </PageIntro>

      {groups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`scroll-mt-20 border-t border-line py-16 ${gi % 2 ? 'bg-canvas' : ''}`}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="text-3xl font-bold">{g.title}</h2>
              <p className="mt-3 text-ink-muted">{g.intro}</p>
            </div>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {g.items.map(([t, d]) => (
                <div key={t}>
                  <h3 className="font-sans text-lg font-semibold">{t}</h3>
                  <p className="mt-1.5 text-ink-muted">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section id="limits" className="scroll-mt-20 border-t border-line py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-bold">What Reviewwo does not do</h2>
          <div className="max-w-2xl space-y-4 text-[17px] leading-relaxed text-ink-muted">
            <p>We would rather you know this before you sign up:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>It does not write reviews for customers or post anything on their behalf.</li>
              <li>It does not hide the Google option from unhappy customers. Everyone can post a public review.</li>
              <li>It does not offer discounts or rewards for reviews, which Google does not allow.</li>
              <li>It does not import your Google reviews or reply to them for you.</li>
              <li>It does not message your customers. WhatsApp messages only go to your own alert number.</li>
            </ul>
            <p>
              The reasons are explained in our guide to{' '}
              <Link href="/guides/google-review-policy">Google’s review rules for businesses</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
          <p className="max-w-lg text-lg text-ink-muted">
            Want to see it from the customer’s side? Open the demo review page on your phone, or read{' '}
            <Link href="/how-it-works" className="link">how it works step by step</Link>.
          </p>
          <Link href="/r/demo" className="btn btn-secondary btn-lg">Try the review page</Link>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <CtaBand />
    </SiteShell>
  );
}
