import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Features | Reviewwo',
  description:
    'NFC review cards, a mobile review page for your business, private feedback with manager alerts on WhatsApp, and scan tracking.',
};

const groups = [
  {
    title: 'For your customers',
    items: [
      ['A page with your name on it', 'Tapping the card opens a short page with your business name and a star rating. It loads fast on mobile data.'],
      ['Help with what to write', 'Customers can pick what stood out, such as “Friendly staff”, to get a starting sentence they can change.'],
      ['Straight to Google', 'One tap copies their words and opens the Google review form for your listing.'],
      ['A direct line to the manager', 'Anyone can send a private message to the manager instead of, or as well as, posting a review.'],
    ],
  },
  {
    title: 'For you',
    items: [
      ['Manager alerts on WhatsApp', 'Private messages are sent to your manager’s WhatsApp with the rating, the card it came from and the comment.'],
      ['Feedback inbox', 'All messages are saved in your dashboard. Mark each one resolved when it has been dealt with.'],
      ['Scans per card', 'Name each card after where it sits and see how often it is used.'],
      ['Print-ready codes', 'Download any card’s QR code as PNG or SVG.'],
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pb-12 pt-14 sm:px-6 lg:pt-20">
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] sm:text-5xl">What Reviewwo does</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Two things: makes it easy for customers to review you on Google, and gives them a quick way to tell you
            when something went wrong.
          </p>
        </section>

        {groups.map((g, gi) => (
          <section key={g.title} className={`border-t border-line py-16 ${gi % 2 ? 'bg-canvas' : ''}`}>
            <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
              <h2 className="text-3xl font-bold">{g.title}</h2>
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

        <section className="border-t border-line py-16">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
            <p className="max-w-lg text-lg text-ink-muted">
              Want to see it from the customer’s side? Open the demo review page on your phone.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/r/demo" className="btn btn-secondary btn-lg">
                Try the review page
              </Link>
              <Link href="/register" className="btn btn-primary btn-lg">
                Get started
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
