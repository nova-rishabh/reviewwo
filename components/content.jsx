import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { breadcrumbSchema, faqSchema } from '../src/lib/seo';

export function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((d, i) => (
    <script
      key={i}
      type="application/ld+json"
      // JSON.stringify output is safe here: the data is static and authored in this repo.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }}
    />
  ));
}

export function SiteShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-ink-subtle">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-ink-muted">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-ink hover:underline">{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function PageIntro({ breadcrumbs, title, lead, children, aside }) {
  return (
    <section className="overflow-hidden">
      <div className={`mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:pt-14 ${aside ? 'grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]' : ''}`}>
        <div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <h1 className={`${breadcrumbs ? 'mt-6' : ''} max-w-3xl text-4xl font-bold leading-[1.1] sm:text-5xl`}>{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-lg text-ink-muted">{lead}</p>}
          {children}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function FaqSection({ faqs, title = 'Frequently asked questions', id = 'faq', tinted = false }) {
  return (
    <section id={id} className={`border-t border-line py-16 ${tinted ? 'bg-canvas' : ''}`}>
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-sans text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <h3 className="font-sans text-lg font-semibold">{f.q}</h3>
                <span className="mt-1 text-xl leading-none text-ink-subtle transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({ title = 'Put a review QR code on your counter', text = 'Create an account, link your Google listing and print your first QR code in about ten minutes.' }) {
  return (
    <section className="border-t border-line py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-3 max-w-lg text-lg text-ink-muted">{text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className="btn btn-primary btn-lg">Get started</Link>
          <Link href="/pricing" className="btn btn-secondary btn-lg">See pricing</Link>
        </div>
      </div>
    </section>
  );
}

/** Long-form article with a sticky table of contents on wide screens. */
export function Article({ sections, related }) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24">
            <p className="text-sm font-semibold text-ink">On this page</p>
            <ol className="mt-3 space-y-2 border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-3 text-sm text-ink-muted hover:border-brand-800 hover:text-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="article min-w-0">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2>{s.title}</h2>
              {s.body}
            </section>
          ))}
          {related && related.length > 0 && (
            <aside className="not-article mt-14 rounded-[10px] border border-line bg-canvas p-6">
              <p className="font-semibold text-ink">Keep reading</p>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="link">{r.label}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
