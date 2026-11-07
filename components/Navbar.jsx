'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import useSession from './useSession';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'NFC cards', href: '/cards' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For agencies', href: '/agency' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();

  useEffect(() => setOpen(false), [pathname]);

  const authActions = (mobile) => {
    if (status === 'loading') {
      return <span className={mobile ? 'h-10' : 'h-10 w-40'} aria-hidden="true" />;
    }
    if (status === 'authenticated') {
      return (
        <Link href="/dashboard" className={`btn btn-primary ${mobile ? 'w-full' : ''}`}>
          Go to dashboard
        </Link>
      );
    }
    return (
      <>
        <Link href="/login" className={`btn btn-ghost ${mobile ? 'w-full border border-line' : ''}`}>
          Sign in
        </Link>
        <Link href="/register" className={`btn btn-primary ${mobile ? 'w-full' : ''}`}>
          Get started
        </Link>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Reviewwo home">
          <img src="/assets/img/logos/combo-dark.png" alt="Reviewwo" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'text-brand-800 bg-brand-50' : 'text-ink-muted hover:bg-canvas hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">{authActions(false)}</div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="btn btn-ghost -mr-2 h-10 w-10 px-0 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-3 text-[15px] font-medium ${
                  pathname === link.href ? 'bg-brand-50 text-brand-800' : 'text-ink hover:bg-canvas'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">{authActions(true)}</div>
        </div>
      )}
    </header>
  );
}
