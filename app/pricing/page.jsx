'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RazorpayCheckoutButton from '../../components/RazorpayCheckoutButton';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(d => {
        if (d && d.authenticated) setIsAuthenticated(true);
      })
      .catch(() => {});
  }, []);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 149,
      priceAnnual: 119, // ~20% off
      badge: 'Single Location',
      description: 'Ideal for neighborhood cafes, clinics, salons, and solo retailers looking to jumpstart their 5-star Google presence.',
      features: [
        '1 Active Physical Location',
        '1-Tap Review Copy & Google Maps Deep-Link',
        'Negative Feedback Interception Shield',
        'Manager WhatsApp Grievance Alerts (Socket)',
        'Merchant WhatsApp OTP Login (₹0 SMS)',
        'AI Review Drafts (English & Hinglish)',
        'Standard Email & Community Support'
      ],
      ctaText: 'Start on Starter Plan',
      popular: false
    },
    {
      id: 'growth',
      name: 'Growth',
      priceMonthly: 299,
      priceAnnual: 239,
      badge: 'Most Popular',
      description: 'For busy dining spots, multi-chair clinics, and retail stores serious about ranking #1 in local Google Maps search.',
      features: [
        'Up to 3 Active Physical Locations',
        'Unlimited Table / Counter Standees',
        '1-Tap Review Copy & Google Maps Deep-Link',
        '24/7 AI Review Autopilot Reply Engine',
        'Instant WhatsApp Manager Grievance Alerts',
        'Merchant WhatsApp OTP Login (₹0 SMS)',
        'NFC Dual-Tap Microchip Programmer',
        'Priority 24/7 WhatsApp Merchant Support'
      ],
      ctaText: 'Get Growth Plan Free →',
      popular: true
    },
    {
      id: 'agency',
      name: 'Agency & Multi-Branch',
      priceMonthly: 799,
      priceAnnual: 639,
      badge: 'Reseller Ready',
      description: 'Built for digital marketing agencies, consultants, and retail chains managing multiple client brands.',
      features: [
        'Up to 25 Client Locations Included',
        '100% White-Label Client Portal & Custom Domain',
        'Multi-Tenant Agency Dashboard',
        'Wholesale Bulk Standee Pricing (₹280/unit)',
        'Automated Client Billing Integration',
        'Manager Grievance Alert Dispatch Rail',
        'Dedicated Technical Account Manager'
      ],
      ctaText: 'Launch Agency Hub →',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FFFE] text-[#234745] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-display font-extrabold text-[#14B8A6] uppercase tracking-wider px-3 py-1 bg-[#E6FFFB] rounded-full border border-[#14B8A6]/20">
              No Hidden Charges • ₹0 SMS Costs
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-[#0B3D3B] tracking-tight">
              Honest, Transparent Pricing For Real Merchants
            </h1>
            <p className="text-base text-[#4A706E] leading-relaxed">
              Every plan includes our 1-tap review deep-linking engine and sovereign WhatsApp socket rail for instant manager grievance alerts and passwordless login.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-[#0B3D3B]' : 'text-[#4A706E]'}`}>
                Monthly Billing
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#0B3D3B] transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#14B8A6] shadow ring-0 transition duration-200 ease-in-out ${
                    billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-[#0B3D3B]' : 'text-[#4A706E]'}`}>
                  Annual Billing
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((p) => {
              const currentPrice = billingCycle === 'annual' ? p.priceAnnual : p.priceMonthly;
              return (
                <div
                  key={p.id}
                  className={`rounded-3xl p-8 bg-white border flex flex-col justify-between transition-all ${
                    p.popular
                      ? 'border-2 border-[#14B8A6] shadow-2xl relative scale-105 z-10'
                      : 'border-[#0B3D3B]/10 shadow-sm hover:shadow-md'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#14B8A6] text-white text-[10px] font-display font-extrabold uppercase tracking-wider shadow">
                      Most Popular For Retailers
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-display font-bold text-[#14B8A6] uppercase tracking-wider">{p.badge}</span>
                      <h3 className="text-2xl font-display font-black text-[#0B3D3B] mt-1">{p.name}</h3>
                      <p className="text-xs text-[#4A706E] mt-2 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="pt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-display font-black text-[#0B3D3B]">₹{currentPrice}</span>
                      <span className="text-xs font-bold text-[#4A706E]">/ month</span>
                    </div>

                    <div className="pt-4 border-t border-[#0B3D3B]/10 space-y-3">
                      <p className="text-xs font-display font-extrabold text-[#0B3D3B] uppercase tracking-wider">What's Included:</p>
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#234745]">
                          <span className="text-[#10B981] font-bold">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    {isAuthenticated ? (
                      <RazorpayCheckoutButton
                        plan={p.id}
                        billingCycle={billingCycle}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-display font-bold text-center block shadow transition-all ${
                          p.popular
                            ? 'bg-[#0B3D3B] hover:bg-[#14B8A6] text-white hover:text-white'
                            : 'bg-[#E6FFFB] hover:bg-[#0B3D3B] text-[#0B3D3B] hover:text-white border border-[#14B8A6]/30'
                        }`}
                      >
                        Subscribe with Razorpay →
                      </RazorpayCheckoutButton>
                    ) : (
                      <Link
                        href={`/register?plan=${p.id}&billing=${billingCycle}`}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-display font-bold text-center block shadow transition-all ${
                          p.popular
                            ? 'bg-[#0B3D3B] hover:bg-[#14B8A6] text-white hover:text-white'
                            : 'bg-[#E6FFFB] hover:bg-[#0B3D3B] text-[#0B3D3B] hover:text-white border border-[#14B8A6]/30'
                        }`}
                      >
                        {p.ctaText}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantee Box */}
          <div className="p-8 rounded-3xl bg-[#E6FFFB] border border-[#14B8A6]/30 text-center max-w-3xl mx-auto space-y-3">
            <h4 className="font-display font-extrabold text-base text-[#0B3D3B]">
              30-Day Google Review Acceleration Guarantee
            </h4>
            <p className="text-xs text-[#234745] leading-relaxed max-w-xl mx-auto">
              If your store does not see at least a 250% increase in new 5-star Google reviews within 30 days of deploying our standees, we will refund 100% of your software subscription—no questions asked.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
