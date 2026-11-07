'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RazorpayCheckoutButton from '../../components/RazorpayCheckoutButton';
import useSession from '../../components/useSession';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 149,
    annual: 119,
    description: 'For a single counter or reception desk.',
    features: [
      '1 NFC card',
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
    features: ['Up to 5 NFC cards', 'Scans compared card by card', 'Everything in Starter'],
  },
  {
    id: 'agency',
    name: 'Agency',
    monthly: 799,
    annual: 639,
    description: 'For large venues with many tables or rooms.',
    features: ['Up to 25 NFC cards', 'Everything in Growth', 'Bulk card pricing'],
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
                Prices in Indian rupees. NFC cards are ordered separately.
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
      </main>
      <Footer />
    </div>
  );
}
