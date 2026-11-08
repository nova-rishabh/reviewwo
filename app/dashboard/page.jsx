'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Circle } from 'lucide-react';
import { useDashboardUser, PageHeader } from '../../components/DashboardShell';
import { apiGet } from '../../components/api';
import { StarRow, timeAgo } from '../../components/ui';

function Stat({ label, value, hint, href }) {
  const body = (
    <>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-[13px] text-ink-subtle">{hint}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="card block p-5 transition-colors hover:border-brand-200">
      {body}
    </Link>
  ) : (
    <div className="card p-5">{body}</div>
  );
}

export default function OverviewPage() {
  const { user } = useDashboardUser();
  const [cards, setCards] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sender, setSender] = useState(null);

  useEffect(() => {
    apiGet('/api/standees/list').then(setCards).catch(() => setCards([]));
    apiGet('/api/shield/list').then(setFeedback).catch(() => setFeedback([]));
    apiGet('/api/whatsapp/status').then(setSender).catch(() => setSender({ connected: false }));
  }, []);

  const loading = cards === null || feedback === null;
  const totalScans = (cards || []).reduce((n, c) => n + (c.scans || 0), 0);
  const open = (feedback || []).filter((f) => f.status === 'open');
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonth = (feedback || []).filter((f) => new Date(f.receivedAt) >= monthStart).length;

  const setup = [
    { done: Boolean(user.googlePlaceId), label: 'Link your Google listing', href: '/dashboard/settings#google' },
    { done: Boolean(user.alertMobile), label: 'Add a number for feedback alerts', href: '/dashboard/settings#alerts' },
    { done: (cards || []).length > 0, label: 'Create your first QR code', href: '/dashboard/cards' },
    { done: totalScans > 0, label: 'Get your first scan', href: '/dashboard/cards' },
    { done: user.planStatus === 'active', label: 'Subscribe to a plan', href: '/dashboard/settings#plan' },
  ];
  const setupLeft = setup.filter((s) => !s.done);

  return (
    <>
      <PageHeader
        title="Overview"
        description={`How your QR codes are doing at ${user.businessName}.`}
        actions={
          <Link href="/dashboard/cards" className="btn btn-primary">
            Add a QR code
          </Link>
        }
      />

      {sender && !sender.connected && user.alertMobile && (
        <div className="alert alert-info mb-6">
          <span>
            Feedback alerts are paused while our WhatsApp sender reconnects. Messages are still saved in your{' '}
            <Link href="/dashboard/feedback" className="link">feedback inbox</Link>.
          </span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Scans" value={loading ? '–' : totalScans} hint="All time, across your QR codes" href="/dashboard/cards" />
        <Stat label="Open feedback" value={loading ? '–' : open.length} hint="Waiting for you to resolve" href="/dashboard/feedback" />
        <Stat label="Feedback this month" value={loading ? '–' : thisMonth} />
        <Stat label="QR codes" value={loading ? '–' : (cards || []).length} href="/dashboard/cards" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
            <h2 className="font-sans text-base font-semibold">Latest feedback</h2>
            <Link href="/dashboard/feedback" className="link text-sm">View all</Link>
          </div>
          {loading ? (
            <div className="h-40" />
          ) : feedback.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-medium text-ink">No feedback yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
                When a customer sends a private message from one of your QR codes, it will show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {feedback.slice(0, 5).map((f) => (
                <li key={f.id} className="px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <StarRow value={f.rating} />
                    <span className="text-sm text-ink-subtle">{f.cardName || 'QR code'}</span>
                    <span className="text-sm text-ink-subtle">{timeAgo(f.receivedAt)}</span>
                    {f.status === 'open' ? <span className="badge badge-warning">Open</span> : <span className="badge badge-success">Resolved</span>}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[15px] text-ink">{f.feedback}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          {setupLeft.length > 0 && (
            <section className="card">
              <div className="border-b border-line px-5 py-4 sm:px-6">
                <h2 className="font-sans text-base font-semibold">Finish setting up</h2>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {setup.length - setupLeft.length} of {setup.length} done
                </p>
              </div>
              <ul className="px-3 py-2">
                {setup.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] ${s.done ? 'text-ink-subtle' : 'text-ink hover:bg-canvas'}`}
                    >
                      {s.done ? (
                        <Check className="h-4 w-4 text-brand-600" aria-hidden="true" />
                      ) : (
                        <Circle className="h-4 w-4 text-line" aria-hidden="true" />
                      )}
                      <span className={s.done ? 'line-through' : ''}>{s.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <h2 className="font-sans text-base font-semibold">Scans by QR code</h2>
              <Link href="/dashboard/cards" className="link text-sm">Manage</Link>
            </div>
            {loading ? (
              <div className="h-24" />
            ) : cards.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-ink-muted">You haven’t created any QR codes yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {[...cards]
                  .sort((a, b) => (b.scans || 0) - (a.scans || 0))
                  .slice(0, 6)
                  .map((c) => (
                    <li key={c.id} className="flex items-center justify-between px-5 py-3 text-[15px] sm:px-6">
                      <span className="truncate text-ink">{c.name}</span>
                      <span className="tabular-nums text-ink-muted">{c.scans || 0}</span>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
