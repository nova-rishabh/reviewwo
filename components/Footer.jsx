import Link from 'next/link';
import { INDUSTRIES } from '../src/content/industries';
import { GUIDES } from '../src/content/guides';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Try the review page', href: '/r/demo' },
      { label: 'Add NFC cards', href: '/nfc-cards' },
    ],
  },
  {
    title: 'Who it’s for',
    links: [...INDUSTRIES.map((i) => ({ label: i.label, href: `/for/${i.slug}` })), { label: 'Agencies', href: '/agency' }],
  },
  {
    title: 'Guides',
    links: GUIDES.map((g) => ({ label: g.short, href: `/guides/${g.slug}` })),
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr_0.8fr]">
        <div className="max-w-sm space-y-3">
          <img src="/assets/img/logos/combo-dark.png" alt="Reviewwo" className="h-8 w-auto" width="160" height="32" />
          <p className="text-sm text-ink-muted">
            Google review QR codes for local businesses in India. Make it easy for customers to review you on Google,
            and hear about problems while you can still fix them.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-sans text-sm font-semibold text-ink">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-muted hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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
