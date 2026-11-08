'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiGet, apiPost } from '../../../components/api';
import { StarRow, timeAgo, AlertBadge, ErrorNote } from '../../../components/ui';

const FILTERS = [
  { id: 'open', label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
  { id: 'all', label: 'All' },
];

function FeedbackItem({ item, onChanged }) {
  const [resolving, setResolving] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const act = async (body) => {
    setBusy(true);
    setError('');
    try {
      await apiPost('/api/shield/resolve', { id: item.id, ...body });
      setResolving(false);
      setNote('');
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const tel = item.customerContact.replace(/[^\d+]/g, '');

  return (
    <li className="px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <StarRow value={item.rating} />
            <span className="text-sm text-ink-subtle">{item.cardName || 'QR code'}</span>
            <time className="text-sm text-ink-subtle" dateTime={item.receivedAt} title={new Date(item.receivedAt).toLocaleString('en-IN')}>
              {timeAgo(item.receivedAt)}
            </time>
            <AlertBadge alert={item.alert} />
          </div>
          <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink">{item.feedback}</p>
          <p className="mt-2 text-sm text-ink-muted">
            {item.customerName || 'No name given'}
            {item.customerContact && (
              <>
                {', '}
                <a href={`tel:${tel}`} className="link">{item.customerContact}</a>
              </>
            )}
          </p>
          {item.status === 'resolved' && (
            <p className="mt-2 text-sm text-ink-subtle">
              Resolved {timeAgo(item.resolvedAt)}
              {item.note ? `: ${item.note}` : ''}
            </p>
          )}
        </div>

        <div className="shrink-0">
          {item.status === 'open' ? (
            !resolving && (
              <button type="button" onClick={() => setResolving(true)} className="btn btn-secondary btn-sm">
                Mark resolved
              </button>
            )
          ) : (
            <button type="button" onClick={() => act({ reopen: true })} disabled={busy} className="btn btn-ghost btn-sm">
              Reopen
            </button>
          )}
        </div>
      </div>

      {resolving && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            act({ note });
          }}
          className="mt-4 space-y-3 rounded-lg border border-line bg-canvas p-4"
        >
          <label htmlFor={`note-${item.id}`} className="label">What did you do? (optional)</label>
          <input
            id={`note-${item.id}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input"
            placeholder="Called the customer and offered a free coffee"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="btn btn-primary btn-sm">
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Mark resolved
            </button>
            <button type="button" onClick={() => setResolving(false)} className="btn btn-ghost btn-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
      {error && <div className="mt-3"><ErrorNote message={error} /></div>}
    </li>
  );
}

export default function FeedbackPage() {
  const { refresh } = useDashboardUser();
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('open');
  const [error, setError] = useState('');

  const load = () =>
    apiGet('/api/shield/list')
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch((e) => {
        setError(e.message);
        setItems([]);
      });

  useEffect(() => {
    load();
  }, []);

  const counts = {
    open: (items || []).filter((i) => i.status === 'open').length,
    resolved: (items || []).filter((i) => i.status === 'resolved').length,
    all: (items || []).length,
  };
  const shown = (items || []).filter((i) => filter === 'all' || i.status === filter);

  return (
    <>
      <PageHeader
        title="Feedback"
        description="Private messages customers sent from your QR codes. We also forward each one to your alert number on WhatsApp."
      />
      <ErrorNote message={error} />

      <div role="tablist" aria-label="Filter feedback" className="mb-4 inline-flex rounded-lg border border-line bg-white p-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium ${
              filter === f.id ? 'bg-brand-800 text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {f.label}
            <span className={`tabular-nums ${filter === f.id ? 'text-brand-100' : 'text-ink-subtle'}`}>{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <section className="card">
        {items === null ? (
          <div className="h-48" aria-busy="true" />
        ) : shown.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-medium text-ink">
              {filter === 'open' ? 'Nothing waiting for you' : filter === 'resolved' ? 'Nothing resolved yet' : 'No feedback yet'}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
              {filter === 'open'
                ? 'New messages from customers will appear here.'
                : 'Messages customers send from your QR codes will appear here.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((item) => (
              <FeedbackItem
                key={item.id}
                item={item}
                onChanged={() => {
                  load();
                  refresh();
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
