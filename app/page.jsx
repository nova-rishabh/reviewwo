import Link from 'next/link';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NfcCard from '../components/NfcCard';

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
      <Navbar />

      <main className="flex-1">
        {/* Hero: the card itself */}
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:pb-28 lg:pt-20">
            <div>
              <h1 className="text-[2.75rem] font-bold leading-[1.05] sm:text-6xl">
                Tap the card.
                <br />
                Leave a review.
              </h1>
              <p className="mt-6 max-w-md text-lg text-ink-muted">
                A Reviewwo card sits by your till. Customers tap it with their phone or scan the code, rate their visit
                and post a Google review in under a minute.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get started
                </Link>
                <Link href="/r/demo" className="btn btn-secondary btn-lg">
                  Try the review page
                </Link>
              </div>
              <p className="mt-5 text-sm text-ink-subtle">Plans from ₹149 a month. Works with any phone, no app needed.</p>
            </div>

            <div className="relative mx-auto w-full max-w-[460px] py-6 lg:py-10">
              <div className="absolute -right-24 top-1/2 hidden h-[130%] w-[85%] -translate-y-1/2 rounded-[40px] bg-canvas lg:block" aria-hidden="true" />
              <NfcCard businessName="The Corner Café" className="relative -rotate-[5deg]" />
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
              <MiniScreen step="1" title="They rate the visit">
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
                Customers who had a bad experience can message your manager straight from the card page. The message
                arrives on WhatsApp while they are still in the shop, so you can put it right.
              </p>
              <dl className="mt-8 grid max-w-lg gap-6 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-ink">Feedback inbox</dt>
                  <dd className="mt-1 text-ink-muted">Every message is saved. Mark each one resolved when it’s handled.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Scans per card</dt>
                  <dd className="mt-1 text-ink-muted">See which counter or table gets tapped most.</dd>
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

        {/* Closing */}
        <section className="border-t border-line py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Set up in about ten minutes</h2>
              <p className="mt-3 max-w-lg text-lg text-ink-muted">
                Create an account, add your Google listing and the manager’s number, then order your cards.
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
