import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import NfcCard from '../../components/NfcCard';

export const metadata = {
  title: 'NFC review cards | Reviewwo',
  description:
    'Card-sized NFC review cards with a printed QR code. Customers tap or scan to open your review page. No app needed.',
};

const specs = [
  ['Size', '85.6 × 54 mm, the same as a debit card'],
  ['Tap', 'NFC chip, works on most iPhones (XS and newer) and NFC-enabled Android phones'],
  ['Scan', 'QR code printed on the front for phones without NFC'],
  ['Opens', 'Your Reviewwo review page in the phone’s browser'],
  ['Placement', 'Lay it on the counter, stand it in a holder or stick it to the table'],
];

const faqs = [
  {
    q: 'Do my customers need an app?',
    a: 'No. Tapping or scanning opens a normal web page in their browser.',
  },
  {
    q: 'What if a customer’s phone has no NFC?',
    a: 'They can scan the QR code printed on the card with their camera instead.',
  },
  {
    q: 'Can I use one card per table?',
    a: 'Yes. Give each card a name in your dashboard, such as “Table 4” or “Front counter”, and see how often each one is used.',
  },
  {
    q: 'Can I print my own codes?',
    a: 'Yes. Every card in your dashboard has a QR code you can download as PNG or SVG.',
  },
];

export default function CardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:pt-20">
            <div>
              <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">One card, by the till</h1>
              <p className="mt-5 max-w-md text-lg text-ink-muted">
                The Reviewwo card is the size of a debit card. Customers hold their phone over it, or scan the code,
                and your review page opens.
              </p>
              <div className="mt-8">
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get started
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[420px] py-8">
              <NfcCard businessName="Glow Salon" className="relative rotate-[4deg]" />
            </div>
          </div>
        </section>

        <section className="border-t border-line py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="text-3xl font-bold">Specifications</h2>
            <dl className="divide-y divide-line border-y border-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
                  <dt className="font-semibold text-ink">{k}</dt>
                  <dd className="text-ink-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-line bg-canvas py-16">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="text-3xl font-bold">Questions</h2>
            <div className="space-y-8">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-sans text-lg font-semibold">{f.q}</h3>
                  <p className="mt-1.5 text-ink-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
