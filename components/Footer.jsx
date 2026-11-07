import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0B3D3B] text-[#C5EBE8] pt-16 pb-12 border-t border-[#14B8A6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src="/assets/img/logos/combo-white.png"
                alt="Reviewwo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-[#99F6E4]/80 leading-relaxed">
              Enterprise Google Review velocity engine. Combining laser-engraved acrylic standees, 1-tap review copy &amp; Google deep-linking, and instant WhatsApp manager grievance alerts.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#99F6E4]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>All Systems Operational • Zero Per-Message Fees</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white text-sm font-display font-bold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  1-Tap Review Copy &amp; Deep-Link
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Manager WhatsApp Grievance Alerts
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Negative Review Shield
                </Link>
              </li>
              <li>
                <Link href="/standees" className="hover:text-white transition-colors">
                  Hardware Studio &amp; Acrylic Stands
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Transparent Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Agency & Enterprise */}
          <div>
            <h4 className="text-white text-sm font-display font-bold uppercase tracking-wider mb-4">Agency &amp; Resellers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/agency" className="hover:text-white transition-colors">
                  White-Label Reseller Program
                </Link>
              </li>
              <li>
                <Link href="/agency" className="hover:text-white transition-colors">
                  Multi-Location Dashboard
                </Link>
              </li>
              <li>
                <Link href="/standees" className="hover:text-white transition-colors">
                  Bulk Acrylic Ordering
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Merchant Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Agency Partner Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Manager Grievance Rail */}
          <div>
            <h4 className="text-white text-sm font-display font-bold uppercase tracking-wider mb-4">Sovereign Rail</h4>
            <p className="text-xs text-[#99F6E4]/80 leading-relaxed mb-4">
              Reviewwo uses sovereign WhatsApp socket connection exclusively for instant store manager grievance alerts (1–3★ deflection) and secure merchant OTP login with ₹0 SMS costs.
            </p>
            <div className="p-3.5 rounded-xl bg-[#051C1B] border border-[#14B8A6]/30 text-xs">
              <span className="font-display font-bold text-white">Starter: ₹149/mo</span>
              <span className="block text-[#99F6E4] mt-0.5">Growth: ₹299/mo • Agency: ₹799/mo</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#14B8A6]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#99F6E4] gap-4">
          <p>© {new Date().getFullYear()} Reviewwo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/standees" className="hover:text-white transition-colors">Hardware</Link>
            <Link href="/agency" className="hover:text-white transition-colors">Agencies</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
