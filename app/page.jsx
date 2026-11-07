'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
  const [bizName, setBizName] = useState('Urban Bistro');
  const [selectedTag, setSelectedTag] = useState('Delicious Food & Fast Service');
  const [generatedDraft, setGeneratedDraft] = useState(
    'Had an incredible experience at Urban Bistro! The Delicious Food & Fast Service was top-notch. Staff was super polite. 5 stars all the way!'
  );
  const [copied, setCopied] = useState(false);
  const [simulatedRating, setSimulatedRating] = useState(5);

  const tags = [
    'Delicious Food & Fast Service',
    'Chic Ambiance & Great Music',
    'Attentive Staff & Polite Hospitality',
    'Authentic Flavors & Fresh Ingredients',
    'Best Value for Money in Town'
  ];

  const handleGenerate = (tag) => {
    setSelectedTag(tag);
    setCopied(false);
    const drafts = [
      `Had an incredible experience at ${bizName}! The ${tag} was top-notch. Staff was super polite. 5 stars all the way!`,
      `Easily one of my favorite spots! Everything from the hospitality to their ${tag} exceeded expectations. Highly recommend visiting ${bizName}.`,
      `Outstanding visit to ${bizName}! Loved their ${tag}. The service team went above and beyond to make our evening special.`
    ];
    setGeneratedDraft(drafts[Math.floor(Math.random() * drafts.length)]);
  };

  const handleCopyAndOpenGoogle = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => {
      // Simulate launching Google Maps review dialogue
      window.open(`https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4`, '_blank');
    }, 600);
    setTimeout(() => setCopied(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FFFE] text-[#234745] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6FFFB] border border-[#14B8A6]/40 text-[#0B3D3B] text-xs font-bold shadow-sm">
                <span className="text-[#F59E0B]">★★★★★</span>
                <span className="font-display tracking-wide">The #1 In-Store Google Review Engine</span>
              </div>

              {/* Headline in King Rounded font */}
              <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-[#0B3D3B] leading-[1.1]">
                Turn Foot Traffic into <span className="text-[#14B8A6] underline decoration-[#99F6E4] decoration-4 underline-offset-4">5-Star Google Reviews</span> on Autopilot.
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-[#4A706E] max-w-2xl mx-auto leading-relaxed">
                Laser-engraved NFC + QR counter standees. When customers tap, AI drafts their 5-star review, copies it in 1 tap, and deep-links directly into Google Maps. Negative feedback is intercepted privately with instant manager WhatsApp alerts.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-display font-bold text-white bg-[#0B3D3B] hover:bg-[#14B8A6] rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Start Autonomous Engine Free →
                </Link>
                <Link
                  href="/standees"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-display font-bold text-[#0B3D3B] bg-white hover:bg-[#E6FFFB] border border-[#0B3D3B]/20 rounded-xl shadow-sm transition-all"
                >
                  Explore Hardware Studio 🏷️
                </Link>
              </div>

              {/* Micro-guarantee */}
              <div className="flex items-center justify-center gap-6 text-xs text-[#4A706E] pt-2">
                <span>✓ Starter at ₹149/mo</span>
                <span>✓ 1-Tap Copy &amp; Deep-Link</span>
                <span>✓ Manager Grievance Alerts</span>
              </div>
            </div>

            {/* INTERACTIVE REVIEW FLYWHEEL SIMULATOR */}
            <div className="mt-16 max-w-4xl mx-auto bg-white rounded-3xl border border-[#0B3D3B]/10 shadow-2xl p-6 sm:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-6 border-b border-[#0B3D3B]/10 gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-display font-extrabold text-[#14B8A6] px-2.5 py-1 rounded-full bg-[#E6FFFB] border border-[#14B8A6]/20">
                    Live Customer Flow Simulation
                  </span>
                  <h3 className="text-2xl font-display font-black text-[#0B3D3B] mt-2">
                    How Customers Leave 5-Star Reviews in 12 Seconds
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#10B981]">1-Tap Copy &amp; Open Google</span>
                  <p className="text-[11px] text-[#4A706E]">Pre-written draft &rarr; Google Review Dialog</p>
                </div>
              </div>

              {/* Step 1: Rating selection */}
              <div className="mb-6 p-4 rounded-2xl bg-[#F8FFFE] border border-[#0B3D3B]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-display font-bold text-[#0B3D3B]">Step 1: Customer Taps Standee &amp; Rates Experience</p>
                  <p className="text-[11px] text-[#4A706E]">4–5★ routes to Google Review. 1–3★ routes to Private Shield.</p>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSimulatedRating(star)}
                      className={`text-xl px-2 py-1 rounded-lg transition-transform hover:scale-110 ${
                        simulatedRating >= star ? 'text-[#F59E0B]' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#0B3D3B] ml-2">({simulatedRating} Stars)</span>
                </div>
              </div>

              {simulatedRating >= 4 ? (
                /* 4-5 STAR FLOW: 1-Tap Copy & Deep-Link to Google Maps */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Form controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                        Business Name:
                      </label>
                      <input
                        type="text"
                        value={bizName}
                        onChange={(e) => {
                          setBizName(e.target.value);
                          handleGenerate(selectedTag);
                        }}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0B3D3B] mb-1.5">
                        Customer Selects What They Loved:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleGenerate(t)}
                            className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                              selectedTag === t
                                ? 'bg-[#0B3D3B] text-white shadow-sm'
                                : 'bg-[#E6FFFB] text-[#0B3D3B] border border-[#14B8A6]/30 hover:bg-[#99F6E4]/40'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Review Generator Output Box */}
                  <div className="bg-gradient-to-br from-[#F8FFFE] to-[#E6FFFB] border-2 border-[#14B8A6]/30 rounded-2xl p-6 shadow-inner space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-bold text-[#0B3D3B]">AI-Assisted 5-Star Draft</span>
                      <span className="text-xs text-[#F59E0B]">★★★★★</span>
                    </div>

                    <p className="text-xs text-[#234745] leading-relaxed italic bg-white p-4 rounded-xl border border-[#0B3D3B]/10 shadow-sm min-h-[90px] flex items-center">
                      "{generatedDraft}"
                    </p>

                    <div className="pt-1 space-y-2">
                      <button
                        type="button"
                        onClick={handleCopyAndOpenGoogle}
                        className="w-full inline-flex items-center justify-center gap-2 text-xs font-display font-bold px-4 py-3 bg-[#14B8A6] hover:bg-[#0B3D3B] text-white rounded-xl transition-all shadow-md"
                      >
                        {copied ? '✓ Review Copied! Launching Google Maps...' : '1-Tap: Copy Review & Open Google Maps →'}
                      </button>
                      <p className="text-[11px] text-center text-[#4A706E]">
                        Review is copied to clipboard &amp; customer pastes directly into the official Google dialog!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 1-3 STAR DEFLECTION FLOW: Negative Feedback Shield with Manager WhatsApp Alert */
                <div className="p-6 rounded-2xl bg-[#EF4444]/5 border-2 border-[#EF4444]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🛡️</span>
                      <h4 className="font-display font-bold text-[#0B3D3B]">Negative Review Shield Intercepted</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">
                      Public Google Page Protected
                    </span>
                  </div>

                  <p className="text-xs text-[#4A706E]">
                    The guest rated <strong>{simulatedRating} Stars</strong>. Instead of directing them to Google Maps, Reviewwo presents a private feedback box and immediately triggers an automated WhatsApp alert to the store manager.
                  </p>

                  <div className="p-4 rounded-xl bg-white border border-[#0B3D3B]/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B3D3B]">
                      <span>💬 Instant WhatsApp Alert to Store Manager's Phone:</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#E6FFFB] border border-[#14B8A6]/30 text-xs font-mono text-[#0B3D3B]">
                      "⚠️ Reviewwo Alert: Guest at Table 4 rated {simulatedRating} stars. Issue: 'Service delay'. Tap here to resolve privately before they leave."
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2 EXCLUSIVE ROLES OF THE WHATSAPP SOCKET */}
        <section className="py-20 bg-white border-y border-[#0B3D3B]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-display font-extrabold text-[#14B8A6] uppercase tracking-wider">
                Targeted WhatsApp Socket Architecture
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0B3D3B]">
                How We Use the Sovereign WhatsApp Rail
              </h2>
              <p className="text-sm text-[#4A706E]">
                We do not spam customers. Our WhatsApp multi-device socket connection is dedicated exclusively to 2 mission-critical merchant capabilities with ₹0 SMS fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Feature 2: Real-time Grievance Alerts */}
              <div className="p-8 rounded-3xl bg-[#E6FFFB] border-2 border-[#14B8A6] space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0B3D3B] text-white font-display font-bold text-xl flex items-center justify-center">
                    01
                  </div>
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-[#14B8A6]">
                    Reputation Defense
                  </span>
                  <h3 className="text-xl font-display font-black text-[#0B3D3B]">
                    Instant Manager Grievance Alerts
                  </h3>
                  <p className="text-xs text-[#234745] leading-relaxed">
                    When a guest in your restaurant, clinic, or salon rates 1, 2, or 3 stars, the negative review shield intercepts it. The WhatsApp socket immediately sends a high-priority alert to the store manager’s personal WhatsApp phone with the table number and feedback details, allowing on-the-spot resolution.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#14B8A6]/30 text-xs text-[#0B3D3B] font-semibold flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>100% Google Maps star rating protection</span>
                </div>
              </div>

              {/* Feature 4: Merchant WhatsApp OTP */}
              <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0B3D3B] text-white font-display font-bold text-xl flex items-center justify-center">
                    02
                  </div>
                  <span className="text-xs font-display font-bold uppercase tracking-wider text-[#14B8A6]">
                    Zero SMS Costs
                  </span>
                  <h3 className="text-xl font-display font-black text-[#0B3D3B]">
                    Merchant WhatsApp OTP Login
                  </h3>
                  <p className="text-xs text-[#4A706E] leading-relaxed">
                    Merchants and store managers can sign in securely using a 6-digit one-time password delivered directly to their business WhatsApp via the sovereign socket. Bypasses third-party SMS carrier fees (Twilio/MSG91) and delivers 99.9% instant deliverability.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#0B3D3B]/10 text-xs text-[#0B3D3B] font-semibold flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span>₹0.00 carrier SMS costs forever</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-STEP REVIEW FLYWHEEL */}
        <section className="py-20 bg-[#F8FFFE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-display font-extrabold text-[#14B8A6] uppercase tracking-wider">
                The In-Store Conversion Flywheel
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0B3D3B]">
                From Foot Traffic to #1 Local Ranking
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E6FFFB] text-[#0B3D3B] font-display font-black text-xl flex items-center justify-center mx-auto border border-[#14B8A6]/30">
                  01
                </div>
                <h3 className="font-display font-black text-lg text-[#0B3D3B]">Dual-Tap Standee</h3>
                <p className="text-xs text-[#4A706E] leading-relaxed">
                  Guests touch their phone to the NFC puck or point their camera at the acrylic standee on your counter or table. Opens in 0.2s without downloading any app.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E6FFFB] text-[#0B3D3B] font-display font-black text-xl flex items-center justify-center mx-auto border border-[#14B8A6]/30">
                  02
                </div>
                <h3 className="font-display font-black text-lg text-[#0B3D3B]">1-Tap Copy &amp; Deep-Link</h3>
                <p className="text-xs text-[#4A706E] leading-relaxed">
                  AI generates a tailored review based on what they enjoyed. 1 tap copies the review to their clipboard and automatically opens Google Maps review dialogue.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#E6FFFB] text-[#0B3D3B] font-display font-black text-xl flex items-center justify-center mx-auto border border-[#14B8A6]/30">
                  03
                </div>
                <h3 className="font-display font-black text-lg text-[#0B3D3B]">24/7 Autopilot Reply</h3>
                <p className="text-xs text-[#4A706E] leading-relaxed">
                  Every Google review receives an immediate, tailored public reply within 180 seconds, sending Google's local algorithm the signals to rank your business #1.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW TEASER */}
        <section className="py-20 bg-white border-t border-[#0B3D3B]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-display font-extrabold text-[#14B8A6] uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0B3D3B]">
              Simple, Honest Plans for Every Merchant
            </h2>
            <p className="text-sm text-[#4A706E] max-w-xl mx-auto">
              Starter at ₹149/mo, Growth at ₹299/mo, and Agency at ₹799/mo. Includes 1-tap Google deep-link engine and sovereign WhatsApp manager alerts.
            </p>

            <div className="pt-4">
              <Link
                href="/pricing"
                className="inline-flex items-center px-8 py-3.5 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-sm font-display font-bold rounded-xl shadow-lg transition-all"
              >
                View Full Pricing &amp; Feature Matrix →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
