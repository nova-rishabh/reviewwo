'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Copy, Check } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiGet, apiPost } from '../../../components/api';
import { SectionCard, ErrorNote, timeAgo } from '../../../components/ui';

const PLAN_NAMES = { starter: 'Starter', growth: 'Growth', agency: 'Agency' };
const STATUS_BADGE = {
  requested: 'badge-warning',
  confirmed: 'badge-brand',
  shipped: 'badge-brand',
  delivered: 'badge-success',
  cancelled: 'badge-neutral',
};

function CopyCode({ code }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch (e) {
          setDone(false);
        }
      }}
      className="inline-flex items-center gap-1.5 font-mono text-[15px] font-semibold text-ink hover:text-brand-700"
      aria-label={`Copy coupon ${code}`}
    >
      {code}
      {done ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5 text-ink-subtle" />}
    </button>
  );
}

function Coupons() {
  const [coupons, setCoupons] = useState(null);
  const [form, setForm] = useState({ code: '', plan: 'growth', months: '0', maxUses: '1', note: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState('');

  const load = useCallback(() => apiGet('/api/admin/coupons').then(setCoupons).catch((e) => setError(e.message)), []);
  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setCreated('');
    try {
      const res = await apiPost('/api/admin/coupons', {
        ...form,
        months: Number(form.months),
        maxUses: Number(form.maxUses),
      });
      setCreated(res.coupon.code);
      setForm((f) => ({ ...f, code: '', note: '' }));
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (c) => {
    try {
      await apiPost('/api/admin/coupons/update', { code: c.code, active: !c.active });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)] [&>*]:min-w-0">
      <form onSubmit={create}>
        <SectionCard
          title="New coupon"
          description="Give the code to someone. They enter it when they sign up, or later in Settings."
          footer={
            <button type="submit" disabled={busy} className="btn btn-primary btn-sm">
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Create coupon
            </button>
          }
        >
          <div className="space-y-4">
            <ErrorNote message={error} />
            {created && (
              <div className="alert alert-success" role="status">
                <span>
                  Created <span className="font-mono font-semibold">{created}</span>. Copy it from the list.
                </span>
              </div>
            )}
            <div>
              <label htmlFor="c-code" className="label">Code (optional)</label>
              <input id="c-code" value={form.code} onChange={set('code')} className="input font-mono uppercase" placeholder="Leave blank to generate" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-plan" className="label">Plan</label>
                <select id="c-plan" value={form.plan} onChange={set('plan')} className="input">
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="agency">Agency</option>
                </select>
              </div>
              <div>
                <label htmlFor="c-months" className="label">Free for</label>
                <select id="c-months" value={form.months} onChange={set('months')} className="input">
                  <option value="0">Forever</option>
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="c-uses" className="label">How many people can use it</label>
              <input id="c-uses" type="number" min="0" max="10000" value={form.maxUses} onChange={set('maxUses')} className="input" />
              <p className="hint">0 means no limit.</p>
            </div>
            <div>
              <label htmlFor="c-note" className="label">Note (only you see this)</label>
              <input id="c-note" value={form.note} onChange={set('note')} className="input" placeholder="For Rahul’s café" />
            </div>
          </div>
        </SectionCard>
      </form>

      <SectionCard title="Coupons">
        {coupons === null ? (
          <div className="h-24" aria-busy="true" />
        ) : coupons.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">No coupons yet.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Gives</th>
                  <th>Used</th>
                  <th>Note</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.code} className={c.active ? '' : 'opacity-60'}>
                    <td className="whitespace-nowrap"><CopyCode code={c.code} /></td>
                    <td className="whitespace-nowrap">
                      {PLAN_NAMES[c.plan]}, {c.months === 0 ? 'forever' : `${c.months} month${c.months === 1 ? '' : 's'}`}
                    </td>
                    <td className="whitespace-nowrap tabular-nums">
                      {c.uses}{c.maxUses > 0 ? ` of ${c.maxUses}` : ''}
                      {c.redeemedBy?.length > 0 && (
                        <span className="block text-xs text-ink-subtle">{c.redeemedBy.map((r) => r.email).join(', ')}</span>
                      )}
                    </td>
                    <td className="text-ink-muted">{c.note}</td>
                    <td className="whitespace-nowrap text-right">
                      <button type="button" onClick={() => toggle(c)} className="btn btn-ghost btn-sm">
                        {c.active ? 'Turn off' : 'Turn on'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function OrderRow({ order, onChanged }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.adminNote || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dirty = status !== order.status || note !== (order.adminNote || '');

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await apiPost('/api/admin/nfc-orders/update', { id: order.id, status, adminNote: note });
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const d = order.delivery || {};
  return (
    <li className="px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-ink">{order.businessName || order.email}</span>
        <span className={`badge ${STATUS_BADGE[order.status] || 'badge-neutral'}`}>{order.status}</span>
        <span className="text-sm text-ink-subtle">{timeAgo(order.createdAt)}</span>
      </div>
      <div className="mt-3 grid gap-4 text-sm md:grid-cols-3">
        <div>
          <p className="text-ink-subtle">Cards</p>
          <ul className="mt-1 space-y-0.5 text-ink">
            {order.items.map((i) => (
              <li key={i.cardId}>
                {i.qty} × {i.cardName} <span className="font-mono text-xs text-ink-subtle">{i.url}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-ink">
            {order.quantity} cards, ₹{order.cardsTotal} plus delivery
          </p>
        </div>
        <div>
          <p className="text-ink-subtle">Deliver to</p>
          <p className="mt-1 whitespace-pre-line text-ink">
            {d.name}
            {'\n'}
            {d.address}
            {'\n'}
            {d.city} {d.pincode}
          </p>
          <a href={`tel:${d.phone}`} className="link">{d.phone}</a>
          <p className="text-ink-muted">{order.email}</p>
        </div>
        <div>
          {order.notes && (
            <>
              <p className="text-ink-subtle">Customer note</p>
              <p className="mt-1 text-ink">{order.notes}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <div>
          <label htmlFor={`st-${order.id}`} className="label">Status</label>
          <select id={`st-${order.id}`} value={status} onChange={(e) => setStatus(e.target.value)} className="input h-9 sm:w-40">
            {['requested', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor={`nt-${order.id}`} className="label">Note to customer</label>
          <input id={`nt-${order.id}`} value={note} onChange={(e) => setNote(e.target.value)} className="input h-9" placeholder="Delivery ₹60, pay by UPI to …" />
        </div>
        <button type="button" onClick={save} disabled={!dirty || busy} className="btn btn-primary btn-sm">Save</button>
      </div>
      {error && <div className="mt-3"><ErrorNote message={error} /></div>}
    </li>
  );
}

function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(() => apiGet('/api/admin/nfc-orders').then(setOrders).catch((e) => setError(e.message)), []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="card">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="font-sans text-base font-semibold">NFC card requests</h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          No payment is taken online. Contact the business to confirm delivery and collect payment, then update the status. The note is shown to them.
        </p>
      </div>
      <ErrorNote message={error} />
      {orders === null ? (
        <div className="h-24" aria-busy="true" />
      ) : orders.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-ink-muted">No requests yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {orders.map((o) => <OrderRow key={o.id} order={o} onChanged={load} />)}
        </ul>
      )}
    </section>
  );
}

export default function AdminPage() {
  const { user } = useDashboardUser();
  const router = useRouter();
  const [tab, setTab] = useState('coupons');

  useEffect(() => {
    if (!user.isAdmin) router.replace('/dashboard');
  }, [user.isAdmin, router]);
  if (!user.isAdmin) return null;

  return (
    <>
      <PageHeader title="Admin" description="Coupons and NFC card requests. Only admins can see this page." />
      <div role="tablist" aria-label="Admin sections" className="mb-6 inline-flex rounded-lg border border-line bg-white p-1">
        {[['coupons', 'Coupons'], ['orders', 'NFC card requests']].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`h-8 rounded-md px-3 text-sm font-medium ${tab === id ? 'bg-brand-800 text-white' : 'text-ink-muted hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === 'coupons' ? <Coupons /> : <Orders />}
    </>
  );
}
