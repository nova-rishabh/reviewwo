'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiGet, apiPost } from '../../../components/api';
import { SectionCard, ErrorNote, timeAgo } from '../../../components/ui';
import NfcCard from '../../../components/NfcCard';

import { NFC_CARD_PRICE as PRICE } from '../../../src/lib/nfc';
const STATUS_TEXT = {
  requested: ['Requested', 'badge-warning', 'We’ll contact you to confirm the delivery charge and payment.'],
  confirmed: ['Confirmed', 'badge-brand', 'Your cards are being prepared.'],
  shipped: ['Shipped', 'badge-brand', 'Your cards are on the way.'],
  delivered: ['Delivered', 'badge-success', ''],
  cancelled: ['Cancelled', 'badge-neutral', ''],
};

const local = (m) => String(m || '').replace(/^\+91/, '');

export default function NfcOrderPage() {
  const { user } = useDashboardUser();
  const [codes, setCodes] = useState(null);
  const [orders, setOrders] = useState([]);
  const [qty, setQty] = useState({});
  const [form, setForm] = useState({
    name: user.name,
    phone: local(user.mobile),
    address: '',
    city: user.city,
    pincode: '',
    notes: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const loadOrders = () => apiGet('/api/nfc-orders').then(setOrders).catch(() => {});

  useEffect(() => {
    apiGet('/api/standees/list')
      .then((list) => {
        setCodes(list);
        setQty(Object.fromEntries(list.map((c, i) => [c.id, i === 0 ? 1 : 0])));
      })
      .catch((e) => {
        setError(e.message);
        setCodes([]);
      });
    loadOrders();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const total = Object.values(qty).reduce((n, v) => n + (Number(v) || 0), 0);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiPost('/api/nfc-orders', {
        ...form,
        items: Object.entries(qty).map(([cardId, q]) => ({ cardId, qty: Number(q) || 0 })),
      });
      setSent(true);
      loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Order NFC cards"
        description="Optional. An NFC card works like your QR code, but customers just hold their phone near it instead of scanning."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-6">
          <SectionCard title="1. Which QR codes should be on cards?" description={`₹${PRICE} per card. Each card opens the same page as the QR code you pick.`}>
            {codes === null ? (
              <div className="h-20" aria-busy="true" />
            ) : codes.length === 0 ? (
              <p className="text-sm text-ink-muted">
                Create a QR code first on the <Link href="/dashboard/cards" className="link">QR codes</Link> page.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {codes.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-4 py-3">
                    <label htmlFor={`q-${c.id}`} className="min-w-0">
                      <span className="block truncate font-medium text-ink">{c.name}</span>
                      <span className="block font-mono text-xs text-ink-subtle">{c.shortCode}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`q-${c.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={qty[c.id] ?? 0}
                        onChange={(e) => setQty((q) => ({ ...q, [c.id]: e.target.value }))}
                        className="input h-9 w-20 text-center"
                      />
                      <span className="text-sm text-ink-subtle">cards</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="2. Delivery address">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="d-name" className="label">Name</label>
                <input id="d-name" required value={form.name} onChange={set('name')} className="input" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="d-phone" className="label">Phone</label>
                <input id="d-phone" required type="tel" inputMode="numeric" value={form.phone} onChange={set('phone')} className="input" autoComplete="tel-national" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="d-address" className="label">Address</label>
                <textarea id="d-address" required rows={2} value={form.address} onChange={set('address')} className="input" autoComplete="street-address" />
              </div>
              <div>
                <label htmlFor="d-city" className="label">City</label>
                <input id="d-city" required value={form.city} onChange={set('city')} className="input" autoComplete="address-level2" />
              </div>
              <div>
                <label htmlFor="d-pin" className="label">PIN code</label>
                <input id="d-pin" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={form.pincode} onChange={set('pincode')} className="input" autoComplete="postal-code" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="d-notes" className="label">Anything we should know? (optional)</label>
                <input id="d-notes" value={form.notes} onChange={set('notes')} className="input" />
              </div>
            </div>
          </SectionCard>

          <ErrorNote message={error} />
          {sent && (
            <div className="alert alert-success" role="status">
              <span>Request sent. We’ll contact you on {form.phone} to confirm the delivery charge and payment.</span>
            </div>
          )}

          <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[15px] text-ink">
                <span className="font-semibold">{total} card{total === 1 ? '' : 's'}</span>: ₹{total * PRICE}, plus delivery
              </p>
              <p className="mt-0.5 text-[13px] text-ink-subtle">Nothing is charged now. We confirm the total with you before shipping.</p>
            </div>
            <button type="submit" disabled={busy || total === 0 || !codes?.length} className="btn btn-primary">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send request
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="card p-5">
            <NfcCard businessName={user.businessName} qrDataUrl={codes?.[0]?.qrDataUrl} />
            <p className="mt-4 text-sm text-ink-muted">
              Debit-card size, with your QR code printed on the front so it works on every phone.{' '}
              <Link href="/nfc-cards" className="link">More about NFC cards</Link>
            </p>
          </div>

          <SectionCard title="Your requests">
            {orders.length === 0 ? (
              <p className="text-sm text-ink-muted">No requests yet.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((o) => {
                  const [label, cls, hint] = STATUS_TEXT[o.status] || [o.status, 'badge-neutral', ''];
                  return (
                    <li key={o.id}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[15px] text-ink">{o.quantity} cards</span>
                        <span className={`badge ${cls}`}>{label}</span>
                      </div>
                      <p className="text-[13px] text-ink-subtle">{timeAgo(o.createdAt)}</p>
                      {(o.adminNote || hint) && <p className="mt-1 text-sm text-ink-muted">{o.adminNote || hint}</p>}
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </>
  );
}
