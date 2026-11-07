import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'For agencies | Reviewwo',
  description: 'Offer NFC review cards to your local clients. The Agency plan covers up to 25 locations for ₹799 a month.',
};

const points = [
  ['Up to 25 locations', 'Set up review pages and cards for your clients from one plan, for ₹799 a month.'],
  ['Cards in bulk', 'Order NFC cards in volume at a lower price per card and include them in your local marketing packages.'],
  ['Help getting started', 'We help you set up your first few clients so their cards are on the counter quickly.'],
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
            <Link href="/register?plan=agency" className="btn btn-primary btn-lg">
              Start on the Agency plan
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
