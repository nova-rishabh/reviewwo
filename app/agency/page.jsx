import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Agency & Reseller Program — Reviewwo',
  description: '100% white-label Google review growth platform for marketing agencies and local SEO consultants. Manage 25 client locations on our ₹799/mo Agency plan.',
};

export default function AgencyPage() {
  const marginTiers = [
    { clients: '10 Local Clients', agencyCost: '₹799/mo', clientBill: '₹14,990/mo', netProfit: '₹14,191/mo' },
    { clients: '25 Local Clients', agencyCost: '₹799/mo', clientBill: '₹37,250/mo', netProfit: '₹36,451/mo' },
    { clients: '50 Local Clients', agencyCost: '₹1,598/mo', clientBill: '₹74,500/mo', netProfit: '₹72,902/mo' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FFFE] text-[#234745] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-display font-extrabold text-[#14B8A6] uppercase tracking-wider px-3 py-1 bg-[#E6FFFB] rounded-full border border-[#14B8A6]/20">
              Agency &amp; Reseller Program
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-[#0B3D3B] tracking-tight">
              Add a High-Margin Recurring SaaS Revenue Stream
            </h1>
            <p className="text-base text-[#4A706E] leading-relaxed">
              White-label our entire review acceleration software under your agency's domain and branding. Bill your local clients ₹1,499 - ₹2,999/mo while paying just ₹799/mo for up to 25 locations.
            </p>

            <div className="pt-4">
              <Link
                href="/register?plan=agency"
                className="inline-flex items-center px-8 py-3.5 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl shadow-lg transition-all"
              >
                Join Agency Partner Network (₹799/mo) →
              </Link>
            </div>
          </div>

          {/* Margin Economics Table */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#0B3D3B]/10 shadow-lg space-y-6">
            <div className="border-b border-[#0B3D3B]/10 pb-4">
              <h3 className="text-xl font-display font-black text-[#0B3D3B]">Agency Margin Economics</h3>
              <p className="text-xs text-[#4A706E] mt-1">
                Typical agency revenue assuming standard ₹1,490/mo client retail price point.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E6FFFB] text-[#0B3D3B] uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4 rounded-l font-display">Client Scale</th>
                    <th className="py-3 px-4 font-display">Your Software Cost</th>
                    <th className="py-3 px-4 font-display">Client Retail Billing</th>
                    <th className="py-3 px-4 rounded-r font-display">Monthly Agency Net Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B3D3B]/10 font-medium">
                  {marginTiers.map((tier, idx) => (
                    <tr key={idx} className="hover:bg-[#F8FFFE]">
                      <td className="py-3.5 px-4 font-bold text-[#0B3D3B]">{tier.clients}</td>
                      <td className="py-3.5 px-4 text-[#4A706E]">{tier.agencyCost}</td>
                      <td className="py-3.5 px-4 text-[#234745] font-semibold">{tier.clientBill}</td>
                      <td className="py-3.5 px-4 font-display font-black text-[#10B981]">{tier.netProfit} (95%+ Margin)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agency Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
              <span className="text-2xl">🌐</span>
              <h3 className="font-display font-black text-base text-[#0B3D3B]">100% White-Label Portal</h3>
              <p className="text-xs text-[#4A706E] leading-relaxed">
                Map your own agency custom domain (e.g. <code>portal.youragency.com</code>) with your logo, brand colors, and favicon. Zero Reviewwo mentions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
              <span className="text-2xl">📦</span>
              <h3 className="font-display font-black text-base text-[#0B3D3B]">Wholesale Acrylic Standees</h3>
              <p className="text-xs text-[#4A706E] leading-relaxed">
                Order bulk laser-engraved acrylic stands and NFC pucks at wholesale cost (₹280/unit) and bundle them into your high-ticket local SEO retainer.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
              <span className="text-2xl">👥</span>
              <h3 className="font-display font-black text-base text-[#0B3D3B]">Multi-Tenant Role Permissions</h3>
              <p className="text-xs text-[#4A706E] leading-relaxed">
                Provide client store owners with read-only dashboard access or allow their managers to reply to reviews without seeing your backend margins.
              </p>
            </div>
          </div>

          {/* Agency CTA Footer */}
          <div className="p-10 rounded-3xl bg-gradient-to-r from-[#0B3D3B] to-[#14B8A6] text-white text-center space-y-6 shadow-xl">
            <h2 className="text-3xl font-display font-black">Ready to Scale Your Agency Retainers?</h2>
            <p className="text-xs text-[#C5EBE8] max-w-xl mx-auto leading-relaxed">
              Sign up for the Agency tier at ₹799/mo today. Includes immediate access to 25 client accounts and white-label branding controls.
            </p>
            <div>
              <Link
                href="/register?plan=agency"
                className="inline-flex items-center px-8 py-3.5 bg-white text-[#0B3D3B] text-xs font-display font-black rounded-xl shadow-lg hover:bg-[#E6FFFB] transition-all"
              >
                Register as Agency Partner →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
