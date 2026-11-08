'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiGet, apiPost } from '../../../components/api';
import { SectionCard, ErrorNote, timeAgo } from '../../../components/ui';

const STATUS_LABEL = {
  CONNECTED: { text: 'Connected', cls: 'badge-success' },
  CONNECTING: { text: 'Connecting', cls: 'badge-warning' },
  QR_READY: { text: 'Waiting for scan', cls: 'badge-warning' },
  DISCONNECTED: { text: 'Not connected', cls: 'badge-danger' },
};

const DELIVERY = {
  delivered: 'badge-success',
  failed: 'badge-danger',
  not_connected: 'badge-neutral',
};

/** Admin only: links the one WhatsApp number Reviewwo uses to send alerts and sign-in codes. */
export default function WhatsAppSenderPage() {
  const { user } = useDashboardUser();
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [qr, setQr] = useState(null);
  const [logs, setLogs] = useState([]);
  const [method, setMethod] = useState('qr');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  useEffect(() => {
    if (!user.isAdmin) router.replace('/dashboard');
  }, [user.isAdmin, router]);

  const refresh = useCallback(async () => {
    try {
      const s = await apiGet('/api/whatsapp/status');
      setStatus(s);
      if (s.connected) {
        setQr(null);
        setCode('');
      } else if (s.qrDataUrl) setQr(s.qrDataUrl);
      setLogs(await apiGet('/api/whatsapp/logs'));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (!user.isAdmin) return undefined;
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [refresh, user.isAdmin]);

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!user.isAdmin) return null;
  const s = STATUS_LABEL[status?.status] || STATUS_LABEL.DISCONNECTED;

  return (
    <>
      <PageHeader
        title="WhatsApp sender"
        description="The WhatsApp number Reviewwo uses to send feedback alerts and sign-in codes to every business. Only admins can see this page."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] [&>*]:min-w-0">
        <SectionCard title="Connection">
          <ErrorNote message={error} />
          <div className="flex items-center justify-between">
            <span className={`badge ${s.cls}`}>{s.text}</span>
            {status?.phoneNumber && <span className="text-[15px] text-ink">{status.phoneNumber}</span>}
          </div>

          {status?.connected ? (
            <div className="mt-6 border-t border-line pt-5">
              {confirmDisconnect ? (
                <div className="space-y-3">
                  <p className="text-[15px] text-ink">
                    Disconnect this number? Alerts and sign-in codes will stop until you link a number again.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(async () => { await apiPost('/api/whatsapp/disconnect'); setConfirmDisconnect(false); await refresh(); })}
                      className="btn btn-danger btn-sm"
                    >
                      Disconnect
                    </button>
                    <button type="button" onClick={() => setConfirmDisconnect(false)} className="btn btn-ghost btn-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDisconnect(true)} className="btn btn-danger btn-sm">Disconnect number</button>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div role="tablist" className="inline-flex rounded-lg border border-line p-1">
                {[['qr', 'QR code'], ['code', 'Phone number']].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={method === id}
                    onClick={() => setMethod(id)}
                    className={`h-8 rounded-md px-3 text-sm font-medium ${method === id ? 'bg-brand-800 text-white' : 'text-ink-muted hover:text-ink'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {method === 'qr' ? (
                <div className="space-y-4">
                  <div className="flex aspect-square w-56 items-center justify-center rounded-lg border border-line bg-white p-2">
                    {qr ? <img src={qr} alt="WhatsApp pairing QR code" className="h-full w-full" /> : <p className="px-4 text-center text-sm text-ink-subtle">No code yet</p>}
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(async () => { const r = await apiGet('/api/whatsapp/qr'); if (r.qrDataUrl) setQr(r.qrDataUrl); await refresh(); })}
                    className="btn btn-primary btn-sm"
                  >
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {qr ? 'Get a new code' : 'Show QR code'}
                  </button>
                  <p className="text-sm text-ink-muted">On the sender phone, open WhatsApp, go to Linked devices, tap Link a device and scan this code.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    run(async () => { const r = await apiPost('/api/whatsapp/pairing-code', { mobile: phone }); setCode(r.code || ''); });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="sender" className="label">Sender WhatsApp number</label>
                    <input id="sender" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="input max-w-xs" placeholder="98765 43210" />
                  </div>
                  <button type="submit" disabled={busy} className="btn btn-primary btn-sm">
                    {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Get pairing code
                  </button>
                  {code && (
                    <p className="font-mono text-2xl font-semibold tracking-widest text-ink" aria-live="polite">{code}</p>
                  )}
                  <p className="text-sm text-ink-muted">
                    In WhatsApp, go to Linked devices, tap Link a device, then Link with phone number instead, and enter the code.
                  </p>
                </form>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Recent messages" description="The last 50 messages sent from this number.">
          {logs.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-muted">No messages sent yet.</p>
          ) : (
            <div className="-mx-5 overflow-x-auto sm:-mx-6">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id}>
                      <td className="whitespace-nowrap text-ink-muted">{timeAgo(l.timestamp)}</td>
                      <td className="whitespace-nowrap">{l.to}</td>
                      <td className="whitespace-nowrap capitalize">{String(l.type || '').replace(/_/g, ' ')}</td>
                      <td>
                        <span className={`badge ${DELIVERY[l.status] || 'badge-neutral'}`}>{String(l.status || '').replace(/_/g, ' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
