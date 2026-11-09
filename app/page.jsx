import Link from 'next/link';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QrSign from '../components/QrSign';
import LaunchVideo from '../components/LaunchVideo';
import { FaqSection, JsonLd } from '../components/content';
import { pageMetadata, organizationSchema, SITE_URL, SITE_NAME } from '../src/lib/seo';
import { INDUSTRIES } from '../src/content/industries';
import { GUIDES } from '../src/content/guides';

export const metadata = pageMetadata({
  title: { absolute: 'Reviewwo: Google Review QR Codes for Businesses in India' },
  description:
    'A Google review QR code for your counter. Customers scan, rate their visit and post a Google review in under a minute. Complaints reach your manager on WhatsApp.',
  path: '/',
});

const homeFaqs = [
  {
    q: 'What is a Google review QR code?',
    a: 'It is a QR code that customers scan with their phone camera to reach your Google review form. Reviewwo’s QR code opens a short page with your business name first, so customers can rate their visit, get help with what to write, and then go straight to Google.',
  },
  {
    q: 'Do I need to buy anything to start?',
    a: 'No. Download your QR code and print it yourself on a table sign, a sticker, your bill or a poster. If you want, you can also order NFC cards for ₹50 each plus delivery, so customers can tap their phone instead of scanning.',
  },
  {
    q: 'Do customers need to install an app?',
    a: 'No. Any phone camera can scan the code, and it opens a normal web page. Posting the review happens on Google, so customers need to be signed in to a Google account.',
  },
  {
    q: 'What happens when a customer has a complaint?',
    a: 'Every customer can post on Google. Customers who rate their visit one to three stars are also invited to send a private message to the manager. It is forwarded to the manager’s WhatsApp straight away and saved in your dashboard.',
  },
  {
    q: 'Is this allowed under Google’s review rules?',
    a: 'Yes. Reviewwo shows the Google review option to every customer, never offers incentives, and customers write their own reviews from their own accounts. Read our summary of Google’s review rules for businesses for details.',
  },
  {
    q: 'How much does it cost?',
    a: 'Plans start at ₹149 a month for one QR code. Growth is ₹299 a month for up to five QR codes and Agency is ₹799 a month for up to 25. Paying yearly saves 20%. NFC cards are optional and not included in any plan.',
  },
];

function Stars({ count = 5, size = 'h-5 w-5' }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size} ${s <= count ? 'fill-marigold text-marigold' : 'text-line'}`} />
      ))}
    </div>
  );
}

function MiniScreen({ step, title, children }) {
  return (
    <li className="flex flex-col">
      <p className="text-sm font-semibold text-ink">
        <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-800 text-xs text-white">
          {step}
        </span>
        {title}
      </p>
      <div className="mt-4 flex-1 rounded-[22px] border border-line bg-canvas p-2">
        <div className="h-full rounded-[16px] border border-line bg-white p-4">{children}</div>
      </div>
    </li>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd
        data={[
          organizationSchema,
          { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, inLanguage: 'en-IN' },
        ]}
      />
      <Navbar />

      <main className="flex-1">
        {/* Hero: the QR sign itself */}
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-20">
            <div>
              <h1 className="text-[2.75rem] font-bold leading-[1.05] sm:text-6xl">
                Scan the code.
                <br />
                Leave a review.
              </h1>
              <p className="mt-6 max-w-md text-lg text-ink-muted">
                Reviewwo gives your business a Google review QR code. Customers scan it at the counter, rate their visit
                and post a Google review in under a minute. If something went wrong, your manager hears about it first.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get your QR code
                </Link>
                <Link href="/r/demo" className="btn btn-secondary btn-lg">
                  Try the review page
                </Link>
              </div>
              <p className="mt-5 text-sm text-ink-subtle">From ₹149 a month. Print it yourself, works with any phone camera.</p>
            </div>

            <div className="relative mx-auto w-full max-w-[340px] py-6 lg:py-10">
              <div className="absolute -right-24 top-1/2 hidden h-[120%] w-[95%] -translate-y-1/2 rounded-[40px] bg-canvas lg:block" aria-hidden="true" />
              <QrSign businessName="The Corner Café" className="relative rotate-[3deg]" />
            </div>
          </div>
        </section>

        {/* Launch film */}
        <section className="border-t border-line bg-white py-16 sm:py-20" aria-labelledby="film-title">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 id="film-title" className="text-3xl font-bold sm:text-4xl">See it in 30 seconds</h2>
            <p className="mt-3 max-w-xl text-lg text-ink-muted">
              A customer scans, taps a few words, and AI writes the review. You get unhappy feedback on WhatsApp.
            </p>
            <div className="mt-8">
              <LaunchVideo
                src="/video/reviewwo-launch.mp4"
                poster="/video/reviewwo-launch-poster.jpg"
                title="Reviewwo in 30 seconds: scan, rate, AI-written review, posted"
              />
            </div>
          </div>
        </section>

        {/* What the customer sees */}
        <section className="border-t border-line bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-xl text-3xl font-bold sm:text-4xl">What your customer sees</h2>
            <p className="mt-3 max-w-xl text-lg text-ink-muted">
              A short page with your name on it. Nothing to download, no account to make.
            </p>

            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              <MiniScreen step="1" title="They scan and rate the visit">
                <p className="text-xs text-ink-subtle">The Corner Café</p>
                <p className="mt-1 font-display text-lg font-bold">How was your visit?</p>
                <div className="mt-4">
                  <Stars size="h-7 w-7" />
                </div>
              </MiniScreen>

              <MiniScreen step="2" title="They write a few words">
                <p className="text-xs font-medium text-ink-muted">What stood out?</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['Friendly staff', 'Great coffee', 'Quick service'].map((t, i) => (
                    <span
                      key={t}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        i === 1 ? 'bg-brand-800 text-white' : 'border border-line text-ink'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 rounded-lg border border-line p-2.5 text-xs leading-relaxed text-ink-muted">
                  The coffee was excellent and the staff were really friendly.
                </p>
              </MiniScreen>

              <MiniScreen step="3" title="They post it on Google">
                <p className="text-xs text-ink-muted">One tap copies their words and opens your Google review form.</p>
                <div className="mt-3 rounded-lg border border-line p-2.5">
                  <Stars size="h-4 w-4" />
                  <p className="mt-2 text-xs leading-relaxed text-ink">
                    The coffee was excellent and the staff were really friendly.
                  </p>
                </div>
                <div className="mt-3 h-8 rounded-md bg-brand-800 text-center text-xs font-semibold leading-8 text-white">
                  Post
                </div>
              </MiniScreen>
            </ol>
          </div>
        </section>

        {/* What the owner gets */}
        <section className="border-t border-line bg-canvas py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">When something goes wrong, you hear first</h2>
              <p className="mt-4 max-w-lg text-lg text-ink-muted">
                Customers who had a bad experience can message your manager straight from the review page. The message
                arrives on WhatsApp while they are still in the shop, so you can put it right.
              </p>
              <dl className="mt-8 grid max-w-lg gap-6 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink">Feedback inbox</dt>
                  <dd className="mt-1 text-ink-muted">Every message is saved. Mark each one resolved when it’s handled.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Scans per QR code</dt>
                  <dd className="mt-1 text-ink-muted">Give each counter or table its own code and see which gets used most.</dd>
                </div>
              </dl>
            </div>

            <figure className="mx-auto w-full max-w-sm">
              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="text-xs text-ink-subtle">Today, 1:42 pm</p>
                <div className="mt-3 rounded-xl rounded-tl-sm bg-brand-50 p-4 text-[15px] leading-relaxed text-ink">
                  <p className="font-semibold">New feedback for The Corner Café</p>
                  <p className="mt-2">Rating: 2 of 5</p>
                  <p>Where: Table 4</p>
                  <p className="mt-2">“Waited 25 minutes for our order and nobody checked on us.”</p>
                  <p className="mt-2 text-ink-muted">Contact: Priya, 98xxxxxx21</p>
                </div>
              </div>
              <figcaption className="mt-3 text-center text-sm text-ink-subtle">The alert your manager receives</figcaption>
            </figure>
          </div>
        </section>

        {/* Comparison */}
        <section className="border-t border-line py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Why not just a QR code to Google Maps?</h2>
              <p className="mt-4 text-lg text-ink-muted">
                You can make one for free. The difference is what happens after the scan, and what you learn from it.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-3 pr-4 font-semibold text-ink"><span className="sr-only">Feature</span></th>
                    <th className="py-3 pr-4 font-semibold text-ink">Plain QR to Google</th>
                    <th className="py-3 font-semibold text-ink">Reviewwo QR code</th>
                  </tr>
                </thead>
                <tbody className="text-ink-muted">
                  {[
                    ['Opens', 'Your Google listing or review form', 'A page with your name, then your Google review form'],
                    ['Help with what to write', 'No', 'Optional prompts that customers can change'],
                    ['Private message to the manager', 'No', 'Yes, forwarded to WhatsApp'],
                    ['Feedback inbox', 'No', 'Yes'],
                    ['Scans per location', 'No', 'Yes, per QR code'],
                    ['Fix a wrong listing after printing', 'Reprint everything', 'Change it in Settings'],
                  ].map(([k, a, b]) => (
                    <tr key={k} className="border-b border-line">
                      <td className="py-3 pr-4 font-medium text-ink">{k}</td>
                      <td className="py-3 pr-4">{a}</td>
                      <td className="py-3">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="border-t border-line bg-canvas py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Made for businesses where customers walk in</h2>
            <p className="mt-3 max-w-2xl text-lg text-ink-muted">
              The right moment to ask is different in every business. See where to put your QR code and what to say in yours.
            </p>
            <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              {INDUSTRIES.map((i) => (
                <li key={i.slug}>
                  <Link href={`/for/${i.slug}`} className="link text-[17px]">
                    Google reviews for {i.label.toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Guides */}
        <section className="border-t border-line py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 className="text-3xl font-bold sm:text-4xl">Guides for business owners</h2>
              <Link href="/guides" className="link">All guides</Link>
            </div>
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {GUIDES.slice(0, 3).map((g) => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="group block">
                    <h3 className="font-sans text-lg font-semibold group-hover:text-brand-700 group-hover:underline">{g.title}</h3>
                    <p className="mt-2 text-[15px] text-ink-muted">{g.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FaqSection faqs={homeFaqs} tinted />

        {/* Closing */}
        <section className="border-t border-line py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Set up in about ten minutes</h2>
              <p className="mt-3 max-w-lg text-lg text-ink-muted">
                Create an account, add your Google listing and the manager’s number, then download and print your QR code.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn btn-primary btn-lg">
                Create an account
              </Link>
              <Link href="/pricing" className="btn btn-secondary btn-lg">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
