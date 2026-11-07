import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'For agencies | Reviewwo',
  description: 'Offer NFC review cards to the local businesses you work with. Each client gets their own Reviewwo account.',
};

const points = [
  ['One account per client', 'Each business gets its own Reviewwo account, so its cards, feedback and alerts stay separate from your other clients.'],
  ['You can set it up for them', 'Go through the four-step setup on your client’s behalf: business details, Google listing, alert number and first card.'],
  ['Pick the plan that fits', 'Starter covers one card. Growth and Agency cover up to 5 and 25 cards for venues with many tables or rooms.'],
];

export default function AgencyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 lg:pt-20">
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] sm:text-5xl">For agencies that look after local businesses</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Reviewwo gives you a simple physical product to offer clients: a card that helps them collect Google
            reviews and catch complaints early.
          </p>
          <div className="mt-8">
            <Link href="/register" className="btn btn-primary btn-lg">
              Set up a client
            </Link>
          </div>
        </section>

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
      </main>
      <Footer />
    </div>
  );
}
