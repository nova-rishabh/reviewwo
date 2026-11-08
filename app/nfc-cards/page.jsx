import Link from 'next/link';
import { SiteShell, PageIntro, FaqSection, CtaBand } from '../../components/content';
import NfcCard from '../../components/NfcCard';
import { pageMetadata } from '../../src/lib/seo';
import { NFC_CARD_PRICE } from '../../src/lib/nfc';

export const metadata = pageMetadata({
  title: `NFC Review Cards: ₹${NFC_CARD_PRICE} Add-on for Your QR Code`,
  description: `Optional NFC review cards for ₹${NFC_CARD_PRICE} each plus delivery. Customers tap their phone instead of scanning. Each card also has your QR code printed on it.`,
  path: '/nfc-cards',
});

const specs = [
  ['Price', `₹${NFC_CARD_PRICE} per card, plus delivery`],
  ['Size', '85.6 × 54 mm, the same as a debit card'],
  ['Tap', 'NFC chip, read by iPhone XS and newer and by NFC-enabled Android phones'],
  ['Scan', 'Your QR code is printed on the front, so phones without NFC still work'],
  ['Opens', 'The same review page as your QR code'],
];

const steps = [
  ['Set up your QR codes first', 'Every plan includes QR codes. Each NFC card is linked to one of them, so set those up in your dashboard.'],
  ['Request cards from your dashboard', 'Open “Order NFC cards”, choose how many cards you want for each QR code, and enter your delivery address.'],
  ['We confirm the total', 'Nothing is charged online. We contact you to confirm the delivery charge and how to pay.'],
  ['Cards arrive ready to use', 'Put them where customers pay or wait. Scans from the card are counted with that QR code.'],
];

const faqs = [
  {
    q: 'Are NFC cards included in my plan?',
    a: `No. Plans include your QR codes only. NFC cards are an optional extra at ₹${NFC_CARD_PRICE} each plus delivery.`,
  },
  {
    q: 'Do I need NFC cards to use Reviewwo?',
    a: 'No. Most businesses just print their QR code. NFC cards are for places where a quick tap is easier than opening the camera, such as a busy billing counter.',
  },
  {
    q: 'What if a customer’s phone has no NFC?',
    a: 'Every card has your QR code printed on it, so they can scan it with their camera instead.',
  },
  {
    q: 'Which phones can tap an NFC card?',
    a: 'iPhone XS and newer read NFC cards without opening any app. Many Android phones have NFC, though customers may need to switch it on. Some budget phones do not have NFC and can use the QR code.',
  },
  {
    q: 'How much is delivery?',
    a: 'It depends on where you are and how many cards you order. We confirm the delivery charge with you before anything is sent.',
  },
];

export default function NfcCardsPage() {
  return (
    <SiteShell>
      <PageIntro
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'NFC cards', path: '/nfc-cards' },
        ]}
        title="Add an NFC card to your QR code"
        lead={`Optional, ₹${NFC_CARD_PRICE} per card plus delivery. Customers hold their phone near the card instead of opening the camera. It opens the same review page as your QR code.`}
        aside={
          <div className="relative mx-auto w-full max-w-[420px] py-8">
            <NfcCard businessName="Glow Salon" className="relative rotate-[4deg]" />
          </div>
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/dashboard/nfc" className="btn btn-primary btn-lg">Order NFC cards</Link>
          <Link href="/register" className="btn btn-secondary btn-lg">Create an account first</Link>
        </div>
        <p className="mt-4 text-sm text-ink-subtle">Not included in plans. You need a Reviewwo account to order.</p>
      </PageIntro>

      <section className="border-t border-line py-16">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-bold">What you get</h2>
            <p className="mt-3 text-ink-muted">A tap for phones with NFC, and your QR code for everyone else.</p>
          </div>
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
          <h2 className="text-3xl font-bold">How ordering works</h2>
          <ol className="space-y-6">
            {steps.map(([t, d], i) => (
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

      <FaqSection faqs={faqs} />
      <CtaBand title="Start with your QR code" text="Every plan includes QR codes you can print yourself. Add NFC cards whenever you like." />
    </SiteShell>
  );
}
