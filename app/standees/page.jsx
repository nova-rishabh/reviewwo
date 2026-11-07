import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Hardware Studio & Acrylic Standees — Reviewwo',
  description: 'Premium laser-engraved acrylic standees with dual-tap NFC and high-contrast vector QR codes. Engineered to turn physical foot traffic into verified 5-star Google reviews in 1 tap.',
};

export default function StandeesPage() {
  const hardwareOptions = [
    {
      name: '7" × 5" Frosted Glass Acrylic Standee',
      badge: 'Bestseller for Billing Desks',
      specs: '6mm cast acrylic • Beveled edge • NTAG213 NFC chip • Scratch-proof vector engraving',
      description: 'The flagship counter presence. Sits upright beside your POS or reception desk, catching customers right when payment is complete.',
      recommended: 'Restaurants, Cafes, Spas, Clinics, Retail Showrooms'
    },
    {
      name: '5" × 4" Compact Tabletop Wedge',
      badge: 'For Dining & Waiting Areas',
      specs: 'Solid cast acrylic block • 15° angled viewing face • Dual NFC antenna • Waterproof',
      description: 'Compact footprint designed to rest elegantly on restaurant tables, bar tops, and clinic waiting lounges without crowding items.',
      recommended: 'Fine Dining, Coffee Shops, Barber Salons, Lounge Bars'
    },
    {
      name: '3.5" Dual-Tap NFC Wood & Polymer Puck',
      badge: 'Minimalist & Durable',
      specs: 'Sustainably sourced walnut or matte composite • Deep-laser etching • High-gain NFC',
      description: 'Discreet, ultra-durable coaster or counter puck. Customers simply rest their phone on the puck for 1 second to launch the review dialog.',
      recommended: 'Hotel Rooms, Cocktail Bars, Boutique Studios'
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
              Hardware Studio
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-[#0B3D3B] tracking-tight">
              Museum-Grade Acrylic Standees That Demand Attention
            </h1>
            <p className="text-base text-[#4A706E] leading-relaxed">
              Paper tent cards look cheap and get thrown away. Our precision-engraved acrylic stands look like luxury art pieces on your counter.
            </p>
          </div>

          {/* Visual Showcase */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#0B3D3B]/10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-xl">
              <span className="text-xs font-display font-extrabold text-[#14B8A6] uppercase tracking-wider">
                Industrial Engineering
              </span>
              <h2 className="text-3xl font-display font-black text-[#0B3D3B]">
                Dual-Frequency NFC + Error-Corrected QR Code
              </h2>
              <p className="text-xs text-[#4A706E] leading-relaxed">
                Every unit is manufactured using premium grade cast acrylic with laser-cut flame-polished edges. The embedded NTAG213 microchip triggers the smartphone browser instantly within 0.2 seconds—no app download required.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#E6FFFB] border border-[#14B8A6]/30">
                  <span className="block text-2xl font-display font-black text-[#0B3D3B]">0.2s</span>
                  <span className="text-[11px] text-[#4A706E] font-semibold">NFC Instant Launch</span>
                </div>
                <div className="p-4 rounded-xl bg-[#E6FFFB] border border-[#14B8A6]/30">
                  <span className="block text-2xl font-display font-black text-[#0B3D3B]">1-Tap</span>
                  <span className="text-[11px] text-[#4A706E] font-semibold">Review Copy &amp; Deep-Link</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl shadow-md transition-all"
                >
                  Order Custom Standee For Your Store →
                </Link>
              </div>
            </div>

            {/* Standee Mock Preview */}
            <div className="w-64 h-84 rounded-2xl bg-gradient-to-b from-[#F8FFFE] to-[#E6FFFB] border-4 border-[#0B3D3B] p-5 flex flex-col items-center justify-between shadow-2xl relative">
              <div className="text-center flex flex-col items-center">
                <img
                  src="/assets/img/logos/combo-dark.png"
                  alt="Reviewwo Standee"
                  className="h-8 w-auto object-contain mb-1"
                />
                <p className="text-[10px] text-[#4A706E] font-medium">Tap NFC or Scan Code</p>
              </div>

              <div className="w-32 h-32 bg-white border-2 border-[#0B3D3B] p-2.5 rounded-2xl flex items-center justify-center shadow-inner">
                <div className="w-full h-full bg-[#0B3D3B] rounded-xl flex flex-col items-center justify-center text-white text-[10px] font-display font-bold p-1 text-center">
                  <span>VECTOR QR</span>
                  <span className="text-[8px] text-[#99F6E4] mt-1">RW-PRO</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-display font-bold text-[#14B8A6] uppercase tracking-wider">
                  Verified Google Partner
                </span>
                <p className="text-[9px] text-[#4A706E]">5-Star Review in 12s</p>
              </div>
            </div>
          </div>

          {/* Hardware Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hardwareOptions.map((hw, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#14B8A6] px-2.5 py-1 rounded bg-[#E6FFFB] border border-[#14B8A6]/30">
                    {hw.badge}
                  </span>
                  <h3 className="text-lg font-display font-black text-[#0B3D3B]">{hw.name}</h3>
                  <p className="text-xs text-[#4A706E] leading-relaxed">{hw.description}</p>
                </div>

                <div className="pt-4 border-t border-[#0B3D3B]/10 space-y-2 text-xs">
                  <p className="text-[11px] text-[#234745]"><strong>Specs:</strong> {hw.specs}</p>
                  <p className="text-[11px] text-[#14B8A6]"><strong>Best For:</strong> {hw.recommended}</p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="w-full py-2.5 px-4 bg-[#E6FFFB] hover:bg-[#0B3D3B] hover:text-white text-[#0B3D3B] text-xs font-display font-bold rounded-xl text-center block transition-all border border-[#14B8A6]/30"
                  >
                    Select Model →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
