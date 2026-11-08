'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RazorpayCheckoutButton from '../../components/RazorpayCheckoutButton';
import useSession from '../../components/useSession';
import { FaqSection } from '../../components/content';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 149,
    annual: 119,
    description: 'For a single counter or reception desk.',
    features: [
      '1 review QR code',
      'Review page for your business',
      'Private feedback inbox',
      'WhatsApp alerts to your manager',
      'Scan tracking',
      'PNG and SVG QR downloads',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 299,
    annual: 239,
    popular: true,
    description: 'For places with several counters or tables.',
    features: ['Up to 5 review QR codes', 'Scans compared code by code', 'Everything in Starter'],
  },
  {
    id: 'agency',
    name: 'Agency',
    monthly: 799,
    annual: 639,
    description: 'For large venues with many tables or rooms.',
    features: ['Up to 25 review QR codes', 'Everything in Growth'],
  },
];

const PRICING_FAQS = [
  {
    q: 'How much does a Google review QR code cost with Reviewwo?',
    a: 'Plans start at ₹149 a month for one QR code, ₹299 a month for up to five and ₹799 a month for up to 25. Paying yearly lowers each plan by 20%.',
  },
  {
    q: 'Are NFC cards included in the plan?',
    a: 'No. Plans include QR codes only, which you download and print yourself. NFC cards are an optional extra at ₹50 per card plus delivery, ordered from your dashboard.',
  },
  {
    q: 'Can I start without paying?',
    a: 'Yes. You can create an account, complete setup and create your first QR code before you pay. Subscribe from Settings when you are ready.',
  },
  {
    q: 'How do I pay?',
    a: 'Payments are handled by Razorpay, which accepts UPI, cards and net banking.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Pick a different plan from the pricing page or your Settings. If you need more QR codes, move to a plan that includes them.',
  },
  {
    q: 'What happens if I reach my QR code limit?',
    a: 'Your existing QR codes keep working. You will not be able to create more until you move to a plan with a higher limit or remove one you no longer use.',
  },
];

export default function PricingPage() {
  const [cycle, setCycle] = useState('monthly');
  const { status } = useSession();
  const authed = status === 'authenticated';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 pb-4 pt-14 sm:px-6 md:flex-row md:items-end lg:pt-20">
            <div>
              <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">Pricing</h1>
              <p className="mt-4 max-w-xl text-lg text-ink-muted">
                Prices in Indian rupees. Plans include QR codes that you print yourself.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Billing period"
              className="inline-flex shrink-0 rounded-lg border border-line bg-white p-1"
            >
              {[
                { id: 'monthly', label: 'Monthly' },
                { id: 'annual', label: 'Yearly', extra: 'Save 20%' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={cycle === o.id}
                  onClick={() => setCycle(o.id)}
                  className={`flex h-9 items-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors ${
                    cycle === o.id ? 'bg-brand-800 text-white' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {o.label}
                  {o.extra && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                        cycle === o.id ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {o.extra}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 pt-10">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
            {plans.map((p) => {
              const price = cycle === 'annual' ? p.annual : p.monthly;
              const btnClass = `btn btn-lg w-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`;
              return (
                <div
                  key={p.id}
                  className={`relative flex flex-col rounded-xl border bg-white p-6 sm:p-8 ${
                    p.popular ? 'border-brand-800 shadow-pop' : 'border-line shadow-card'
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-6 rounded-full bg-brand-800 px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <p className="mt-1.5 text-[15px] text-ink-muted">{p.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-ink">₹{price}</span>
                    <span className="text-sm text-ink-subtle">/month</span>
                  </div>
                  <p className="mt-1 h-5 text-[13px] text-ink-subtle">
                    {cycle === 'annual' ? `Billed ₹${(price * 12).toLocaleString('en-IN')} yearly` : 'Billed monthly'}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[15px] text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {authed ? (
                      <RazorpayCheckoutButton plan={p.id} billingCycle={cycle} className={btnClass}>
                        Subscribe to {p.name}
                      </RazorpayCheckoutButton>
                    ) : (
                      <Link href={`/register?plan=${p.id}&billing=${cycle}`} className={btnClass}>
                        Choose {p.name}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-[10px] border border-line bg-canvas px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-[15px] text-ink-muted">
                <span className="font-semibold text-ink">NFC cards are not included in any plan.</span> Want customers to tap
                instead of scan? Add NFC cards for ₹50 each plus delivery.
              </p>
              <Link href="/nfc-cards" className="btn btn-secondary btn-sm shrink-0">About NFC cards</Link>
            </div>
          </div>
        </section>

        <section className="border-t border-line py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold">Compare plans</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-3 pr-4 font-semibold text-ink">Included</th>
                    <th className="py-3 pr-4 font-semibold text-ink">Starter</th>
                    <th className="py-3 pr-4 font-semibold text-ink">Growth</th>
                    <th className="py-3 font-semibold text-ink">Agency</th>
                  </tr>
                </thead>
                <tbody className="text-ink-muted">
                  {[
                    ['Review QR codes', '1', '5', '25'],
                    ['Review page for your business', 'Yes', 'Yes', 'Yes'],
                    ['Private feedback inbox', 'Yes', 'Yes', 'Yes'],
                    ['WhatsApp alerts to your manager', 'Yes', 'Yes', 'Yes'],
                    ['Scans per QR code', 'Yes', 'Yes', 'Yes'],
                    ['NFC cards', 'Not included', 'Not included', 'Not included'],
                    ['PNG and SVG QR downloads', 'Yes', 'Yes', 'Yes'],
                    ['Monthly price', '₹149', '₹299', '₹799'],
                    ['Yearly price, per month', '₹119', '₹239', '₹639'],
                  ].map(([label, ...vals]) => (
                    <tr key={label} className="border-b border-line">
                      <td className="py-3 pr-4 font-medium text-ink">{label}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="py-3 pr-4">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-ink-subtle">
              Not sure how many QR codes you need? See placement advice for{' '}
              <Link href="/for/restaurants" className="link">restaurants</Link>,{' '}
              <Link href="/for/cafes" className="link">cafés</Link> and{' '}
              <Link href="/for" className="link">other businesses</Link>.
            </p>
          </div>
        </section>

        <FaqSection faqs={PRICING_FAQS} tinted />
      </main>
      <Footer />
    </div>
  );
}
