import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Platform Features — Reviewwo',
  description: 'Deep dive into the Reviewwo autonomous review acceleration engine: 1-tap copy & Google deep-linking, sovereign WhatsApp manager alerts, negative review shield, and laser-engraved acrylic hardware.',
};

export default function FeaturesPage() {
  const featureList = [
    {
      title: '1-Tap Review Copy & Google Deep-Link',
      category: 'Frictionless Conversion',
      icon: '✨',
      description: 'Customers want to leave a good review, but "writer\'s block" causes 78% of them to abandon. Our dynamic prompt engine generates 3 authentic drafts in English or Hinglish. With 1 tap, the draft is copied to their clipboard and the official Google review modal opens automatically.',
      highlights: ['Overcomes review abandonment', 'Zero app download or customer phone number needed', 'Pre-written draft copied & Google dialogue launched in 1 click']
    },
    {
      title: 'Manager Grievance Alert Rail (WhatsApp Socket)',
      category: 'Reputation Defense',
      icon: '🛡️',
      description: 'Keep your public Google rating untarnished at 4.9★. If a customer rates their experience 1 to 3 stars, they are instantly redirected to a private manager feedback form instead of Google. The socket immediately fires an alert to the store manager\'s personal WhatsApp with table/ticket details.',
      highlights: ['Deflects 100% of impulsive 1-star reviews', 'Immediate WhatsApp alert to store manager\'s phone', 'On-the-spot customer resolution before they leave']
    },
    {
      title: 'Merchant WhatsApp OTP Authentication',
      category: 'Zero SMS Costs',
      icon: '💬',
      description: 'Merchants and store owners sign into the Reviewwo console passwordless using a 6-digit WhatsApp OTP delivered via our sovereign multi-device socket. Zero third-party SMS carrier fees (Twilio/MSG91) and instant delivery.',
      highlights: ['₹0.00 carrier SMS costs forever', 'High security multi-device socket pair', 'Instant 6-digit WhatsApp OTP delivery']
    },
    {
      title: 'Dual-Frequency NFC + QR Standees',
      category: 'Physical Hardware',
      icon: '🏷️',
      description: 'Museum-grade frosted acrylic stands with embedded NTAG213 high-speed NFC microchips and crisp, scratch-resistant vector QR engraving. Designed to look stunning on cashier counters and dining tables.',
      highlights: ['Dual-tap NFC for iOS & Android', '7x5" & 5x4" high-durability acrylic', 'Direct Google Maps Place ID deep link']
    },
    {
      title: '24/7 Autopilot Review Reply Agent',
      category: 'Local SEO Booster',
      icon: '🤖',
      description: 'Google explicitly rewards businesses that reply to 100% of their customer reviews. Our autonomous agent posts intelligent, keyword-rich replies within 180 seconds of review publication.',
      highlights: ['100% response rate on Google Business Profile', 'Significantly boosts Google Maps 3-Pack ranking', 'Contextual and personalized tone']
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
              Enterprise Feature Suite
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-[#0B3D3B] tracking-tight">
              Engineered for In-Store Review Velocity
            </h1>
            <p className="text-base text-[#4A706E] leading-relaxed">
              Every component of Reviewwo is built to remove friction for the customer, protect your public star rating, and give store managers immediate visibility.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureList.map((feat, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{feat.icon}</span>
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#14B8A6] px-2.5 py-1 rounded bg-[#E6FFFB] border border-[#14B8A6]/30">
                      {feat.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-display font-black text-[#0B3D3B]">{feat.title}</h3>
                  <p className="text-xs text-[#4A706E] leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-4 border-t border-[#0B3D3B]/10 space-y-2">
                  {feat.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#0B3D3B]">
                      <span className="text-[#10B981]">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0B3D3B] to-[#14B8A6] text-white shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-[#99F6E4]">
                  Deploy Today
                </span>
                <h3 className="text-2xl font-display font-black">Ready to Dominate Local Google Search?</h3>
                <p className="text-xs text-[#C5EBE8] leading-relaxed">
                  Start on our Starter plan at ₹149/mo or Growth at ₹299/mo. Order your custom acrylic counter standee and be live in 10 minutes.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#0B3D3B] text-xs font-display font-black rounded-xl shadow hover:bg-[#E6FFFB] hover:text-[#0B3D3B] transition-all"
                >
                  Create Account Free →
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 bg-black/20 hover:bg-black/30 text-white text-xs font-display font-bold rounded-xl border border-white/20 transition-all"
                >
                  View All Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
