'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Hardware Studio', href: '/standees' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Agency Portal', href: '/agency' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8FFFE]/95 backdrop-blur-md border-b border-[#0B3D3B]/10">
      {/* Top Value Banner */}
      <div className="bg-[#0B3D3B] text-[#C5EBE8] text-xs py-2 px-4 text-center font-medium">
        <span>⚡ <strong className="text-white font-extrabold">Frictionless In-Store Reviews:</strong> 1-Tap Copy &amp; Google Deep-Link • Instant Manager Grievance Alerts • Starter from ₹149/mo.</span>
        <Link href="/pricing" className="ml-2 underline text-[#99F6E4] hover:text-white font-bold transition-colors">
          View Plans →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Official Reviewwo Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/assets/img/logos/combo-dark.png"
              alt="Reviewwo"
              className="h-9 md:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#14B8A6] font-bold'
                      : 'text-[#234745] hover:text-[#14B8A6]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#0B3D3B] hover:text-[#14B8A6] px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center text-sm font-display font-bold text-white bg-[#0B3D3B] hover:bg-[#14B8A6] px-5 py-2.5 rounded-xl shadow hover:shadow-md transition-all"
            >
              Get Started Free →
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#0B3D3B] hover:text-[#14B8A6] p-2 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#0B3D3B]/10 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-[#234745] hover:text-[#14B8A6] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#0B3D3B]/10 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-semibold text-[#0B3D3B] py-2.5 rounded-lg border border-[#0B3D3B]/20"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center font-display font-bold text-white bg-[#0B3D3B] py-2.5 rounded-xl shadow"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
