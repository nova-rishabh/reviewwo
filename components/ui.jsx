'use client';

import { Star, AlertCircle } from 'lucide-react';

export function StarRow({ value, size = 'h-4 w-4' }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= value ? 'fill-marigold text-marigold' : 'text-line'}`} aria-hidden="true" />
      ))}
    </span>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger" role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function SectionCard({ title, description, children, footer, id }) {
  return (
    <section id={id} className="card">
      {(title || description) && (
        <div className="border-b border-line px-5 py-4 sm:px-6">
          {title && <h2 className="font-sans text-base font-semibold text-ink">{title}</h2>}
          {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
        </div>
      )}
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-canvas/60 px-5 py-3 sm:px-6">{footer}</div>}
    </section>
  );
}

const rtf = typeof Intl !== 'undefined' ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;

export function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = (d.getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (!rtf) return d.toLocaleString();
  if (abs < 60) return 'just now';
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 7) return rtf.format(Math.round(diff / 86400), 'day');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AlertBadge({ alert }) {
  if (alert === 'sent') return <span className="badge badge-success">Alert sent</span>;
  if (alert === 'failed') return <span className="badge badge-danger">Alert not delivered</span>;
  return <span className="badge badge-neutral">No alert sent</span>;
}
