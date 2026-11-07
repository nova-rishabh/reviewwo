'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Loader2, Copy, Check } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiGet, apiPost, downloadDataUrl, downloadText } from '../../../components/api';
import { ErrorNote, timeAgo } from '../../../components/ui';
import NfcCard from '../../../components/NfcCard';

function CopyLink({ url }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          setCopied(false);
        }
      }}
      className="btn btn-secondary btn-sm"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}

function CardDetail({ card, businessName, onChanged, onRemoved }) {
  const [name, setName] = useState(card.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    setName(card.name);
    setConfirmRemove(false);
    setError('');
  }, [card.id, card.name]);

  const rename = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiPost('/api/standees/update', { id: card.id, name });
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    setError('');
    try {
      await apiPost('/api/standees/update', { id: card.id, remove: true });
      onRemoved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div>
          <NfcCard businessName={businessName} qrDataUrl={card.qrDataUrl} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => downloadDataUrl(card.qrDataUrl, `reviewwo-${card.shortCode}.png`)} className="btn btn-secondary btn-sm">
              Download PNG
            </button>
            <button
              type="button"
              onClick={() => downloadText(card.qrSvg, `reviewwo-${card.shortCode}.svg`, 'image/svg+xml')}
              className="btn btn-secondary btn-sm"
              disabled={!card.qrSvg}
            >
              Download SVG
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm text-ink-subtle">Scans</dt>
              <dd className="mt-0.5 font-display text-2xl font-bold tabular-nums">{card.scans || 0}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-subtle">Last scan</dt>
              <dd className="mt-1 text-[15px] text-ink">{card.lastScanAt ? timeAgo(card.lastScanAt) : 'Not yet'}</dd>
            </div>
            <div>
              <dt className="text-sm text-ink-subtle">Code</dt>
              <dd className="mt-1 font-mono text-[15px] text-ink">{card.shortCode}</dd>
            </div>
          </dl>

          <div>
            <p className="text-sm text-ink-subtle">Card link</p>
            <p className="mt-1 break-all text-[15px] text-ink">{card.fullUrl}</p>
            <p className="mt-1 text-[13px] text-ink-subtle">Write this link to the NFC chip, or use the QR code.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyLink url={card.fullUrl} />
              <a href={`/r/${card.shortCode}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                Open customer page <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <form onSubmit={rename} className="border-t border-line pt-5">
            <label htmlFor="card-name" className="label">Card name</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="card-name" required value={name} onChange={(e) => setName(e.target.value)} className="input sm:max-w-sm" />
              <button type="submit" disabled={busy || name.trim() === card.name} className="btn btn-secondary">
                Save name
              </button>
            </div>
          </form>

          <div className="border-t border-line pt-5">
            {confirmRemove ? (
              <div className="space-y-3">
                <p className="text-[15px] text-ink">
                  Remove “{card.name}”? Its QR code and NFC link will stop working. This can’t be undone.
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={remove} disabled={busy} className="btn btn-danger btn-sm">
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Remove card
                  </button>
                  <button type="button" onClick={() => setConfirmRemove(false)} className="btn btn-ghost btn-sm">
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmRemove(true)} className="btn btn-ghost btn-sm text-red-700 hover:bg-red-50 hover:text-red-800">
                Remove card
              </button>
            )}
          </div>
          <ErrorNote message={error} />
        </div>
      </div>
    </section>
  );
}

export default function CardsPage() {
  const { user } = useDashboardUser();
  const [cards, setCards] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const load = async (selectId) => {
    try {
      const list = await apiGet('/api/standees/list');
      setCards(list);
      setSelectedId((cur) => selectId || (list.some((c) => c.id === cur) ? cur : list[0]?.id || null));
    } catch (e) {
      setError(e.message);
      setCards([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const data = await apiPost('/api/standees/create', { name: newName });
      setNewName('');
      await load(data.standee.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const selected = (cards || []).find((c) => c.id === selectedId);

  return (
    <>
      <PageHeader
        title="Cards"
        description="Each NFC card has its own link and QR code. Name cards after where they sit so you can compare them."
      />
      <ErrorNote message={error} />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <form onSubmit={create} className="card p-4">
            <label htmlFor="new-card" className="label">New card</label>
            <div className="flex gap-2">
              <input
                id="new-card"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Table 4"
                className="input"
              />
              <button type="submit" disabled={creating} className="btn btn-primary shrink-0">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
              </button>
            </div>
          </form>

          <div className="card">
            {cards === null ? (
              <div className="h-32" aria-busy="true" />
            ) : cards.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">No cards yet. Add your first one above.</p>
            ) : (
              <ul className="divide-y divide-line" role="listbox" aria-label="Your cards">
                {cards.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.id === selectedId}
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left ${
                        c.id === selectedId ? 'bg-brand-50' : 'hover:bg-canvas'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-medium text-ink">{c.name}</span>
                        <span className="block font-mono text-xs text-ink-subtle">{c.shortCode}</span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-ink-muted">{c.scans || 0} scans</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {selected ? (
          <CardDetail
            card={selected}
            businessName={user.businessName}
            onChanged={() => load(selected.id)}
            onRemoved={() => load()}
          />
        ) : (
          cards !== null && (
            <div className="card flex items-center justify-center p-10 text-center text-ink-muted">
              Add a card to see its QR code and link.
            </div>
          )
        )}
      </div>
    </>
  );
}
