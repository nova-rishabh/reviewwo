import Link from 'next/link';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'NFC cards', href: '/cards' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'For agencies', href: '/agency' },
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm space-y-3">
          <img src="/assets/img/logos/combo-dark.png" alt="Reviewwo" className="h-8 w-auto" />
          <p className="text-sm text-ink-muted">
            NFC review cards for local businesses. Make it easy for customers to review you on Google, and hear
            about problems while you can still fix them.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-muted hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-5 text-[13px] text-ink-subtle sm:px-6">
          © {new Date().getFullYear()} Reviewwo. Google and Google Maps are trademarks of Google LLC. Reviewwo is not
          affiliated with or endorsed by Google.
        </div>
      </div>
    </footer>
  );
}
