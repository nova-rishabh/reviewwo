import Link from 'next/link';

export default function AuthShell({ title, subtitle, children, footer, wide = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="px-4 py-5 sm:px-6">
        <Link href="/" className="inline-flex" aria-label="Reviewwo home">
          <img src="/assets/img/logos/combo-dark.png" alt="Reviewwo" className="h-8 w-auto" />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className={`w-full ${wide ? 'max-w-xl' : 'max-w-md'}`}>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] text-ink-muted">{subtitle}</p>}
          </div>
          <div className="card p-6 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

/** Only allow same-site relative redirects such as "/dashboard/settings". */
export function safeRedirect(value, fallback = '/dashboard') {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  return value;
}
