'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, ExternalLink, Loader2 } from 'lucide-react';
import QrSign from '../../components/QrSign';
import {
  apiGet,
  apiPost,
  CATEGORIES,
  googleReviewUrl,
  PLACE_ID_FINDER_URL,
  downloadDataUrl,
} from '../../components/api';

const STEPS = ['Business', 'Google listing', 'Alerts', 'QR code'];

function localNumber(mobile) {
  return String(mobile || '').replace(/^\+91/, '');
}

function Stepper({ current }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Setup progress">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 sm:gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                done ? 'bg-brand-800 text-white' : active ? 'border-2 border-brand-800 text-brand-800' : 'border border-line text-ink-subtle'
              }`}
              aria-current={active ? 'step' : undefined}
            >
              {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
            </span>
            <span className={`hidden text-sm sm:inline ${active ? 'font-semibold text-ink' : 'text-ink-subtle'}`}>{label}</span>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-line sm:w-8" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-danger" role="alert">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: '',
    category: '',
    city: '',
    googlePlaceId: '',
    alertName: '',
    alertMobile: '',
    cardName: 'Front counter',
  });
  const [card, setCard] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [test, setTest] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    Promise.all([apiGet('/api/auth/me'), apiGet('/api/standees/list').catch(() => [])])
      .then(([me, cards]) => {
        const u = me.user;
        if (u.onboardingComplete) {
          router.replace('/dashboard');
          return;
        }
        setUser(u);
        setForm((f) => ({
          ...f,
          businessName: u.businessName,
          category: u.category,
          city: u.city,
          googlePlaceId: u.googlePlaceId,
          alertName: u.alertName || u.name,
          alertMobile: localNumber(u.alertMobile || u.mobile),
        }));
        const existing = Array.isArray(cards) ? cards[0] : null;
        if (existing) setCard(existing);
        // Resume where the user left off.
        if (!u.businessName || !u.category || !u.city) setStep(0);
        else if (!u.googlePlaceId) setStep(1);
        else if (!u.alertMobile) setStep(2);
        else setStep(3);
      })
      .catch(() => {});
  }, [router]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (fields, next) => {
    setError('');
    setSaving(true);
    try {
      const data = await apiPost('/api/settings/profile', fields);
      setUser(data.user);
      if (next !== undefined) setStep(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const createCard = async () => {
    setError('');
    setSaving(true);
    try {
      const data = await apiPost('/api/standees/create', { name: form.cardName });
      setCard(data.standee);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    setError('');
    setSaving(true);
    try {
      await apiPost('/api/settings/profile', { onboardingComplete: true });
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setTest({ state: 'sending', message: '' });
    try {
      await apiPost('/api/settings/profile', { alertName: form.alertName, alertMobile: form.alertMobile });
      const res = await apiPost('/api/whatsapp/send-test');
      setTest({ state: 'sent', message: `Test message sent to ${res.to}. Check WhatsApp on that phone.` });
    } catch (err) {
      setTest({ state: 'failed', message: err.message });
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-canvas" aria-busy="true" />;
  }

  const back = (
    <button type="button" onClick={() => { setError(''); setStep((s) => s - 1); }} className="btn btn-ghost">
      Back
    </button>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <img src="/assets/img/logos/combo-dark.png" alt="Reviewwo" className="h-7 w-auto" />
          <Stepper current={step} />
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
        {step === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save({ businessName: form.businessName, category: form.category, city: form.city }, 1);
            }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">Tell us about your business</h1>
              <p className="mt-2 text-ink-muted">Customers see this name when they scan your QR code.</p>
            </div>
            <ErrorNote message={error} />
            <div className="card space-y-5 p-6">
              <div>
                <label htmlFor="businessName" className="label">Business name</label>
                <input id="businessName" required value={form.businessName} onChange={set('businessName')} className="input" placeholder="The Corner Café" />
                <p className="hint">Use the name shown on your Google listing.</p>
              </div>
              <div>
                <label htmlFor="category" className="label">Type of business</label>
                <select id="category" required value={form.category} onChange={set('category')} className="input">
                  <option value="" disabled>Choose one</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="label">City</label>
                <input id="city" required value={form.city} onChange={set('city')} className="input" autoComplete="address-level2" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Continue
              </button>
            </div>
          </form>
        )}

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save({ googlePlaceId: form.googlePlaceId.trim() }, 2);
            }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">Link your Google listing</h1>
              <p className="mt-2 text-ink-muted">
                We need your Google Place ID so customers land on your review form, not someone else’s.
              </p>
            </div>
            <ErrorNote message={error} />
            <div className="card space-y-5 p-6">
              <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-ink-muted">
                <li>
                  Open Google’s{' '}
                  <a href={PLACE_ID_FINDER_URL} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-1">
                    Place ID finder <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
                <li>Search for your business name and pick it from the list.</li>
                <li>Copy the Place ID it shows and paste it below.</li>
              </ol>
              <div>
                <label htmlFor="placeId" className="label">Google Place ID</label>
                <input
                  id="placeId"
                  required
                  value={form.googlePlaceId}
                  onChange={set('googlePlaceId')}
                  className="input font-mono text-[13px]"
                  placeholder="ChIJ…"
                  spellCheck={false}
                  autoCapitalize="off"
                />
              </div>
              {form.googlePlaceId.trim().length >= 20 && (
                <a
                  href={googleReviewUrl(form.googlePlaceId.trim())}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  Check it opens your listing <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="flex justify-between">
              {back}
              <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Continue
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save({ alertName: form.alertName, alertMobile: form.alertMobile }, 3);
            }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">Who should get feedback alerts?</h1>
              <p className="mt-2 text-ink-muted">
                When a customer sends a private message from your QR code, we forward it to this WhatsApp number straight
                away. Usually this is the store manager.
              </p>
            </div>
            <ErrorNote message={error} />
            <div className="card space-y-5 p-6">
              <div>
                <label htmlFor="alertName" className="label">Name</label>
                <input id="alertName" value={form.alertName} onChange={set('alertName')} className="input" placeholder="Store manager" />
              </div>
              <div>
                <label htmlFor="alertMobile" className="label">WhatsApp number</label>
                <div className="flex">
                  <span className="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-line bg-canvas px-3 text-sm font-medium text-ink-muted">
                    +91
                  </span>
                  <input
                    id="alertMobile"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={form.alertMobile}
                    onChange={set('alertMobile')}
                    className="input rounded-l-none"
                    placeholder="98765 43210"
                  />
                </div>
              </div>
              <div className="border-t border-line pt-5">
                <button type="button" onClick={sendTest} disabled={test.state === 'sending' || !form.alertMobile} className="btn btn-secondary btn-sm">
                  {test.state === 'sending' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Send a test message
                </button>
                {test.message && (
                  <p className={`mt-2 text-sm ${test.state === 'sent' ? 'text-emerald-800' : 'text-red-700'}`} role="status">
                    {test.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              {back}
              <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Continue
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Create your first QR code</h1>
              <p className="mt-2 text-ink-muted">
                Name it after where it will sit, so you can tell your QR codes apart later. You can add more at any
                time.
              </p>
            </div>
            <ErrorNote message={error} />
            {!card ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createCard();
                }}
                className="card space-y-5 p-6"
              >
                <div>
                  <label htmlFor="cardName" className="label">Name</label>
                  <input id="cardName" required value={form.cardName} onChange={set('cardName')} className="input" placeholder="Front counter" />
                  <p className="hint">For example “Front counter”, “Table 4” or “Reception”.</p>
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} Create QR code
                </button>
              </form>
            ) : (
              <div className="card space-y-6 p-6">
                <div className="mx-auto w-full max-w-[260px]">
                  <QrSign businessName={user.businessName} qrDataUrl={card.qrDataUrl} />
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-ink-subtle">Name</dt>
                    <dd className="font-medium text-ink">{card.name}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-subtle">Link</dt>
                    <dd className="truncate font-medium text-ink">{card.fullUrl}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-2">
                  <a href={`/r/${card.shortCode}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    Open the customer page <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadDataUrl(card.qrDataUrl, `reviewwo-${card.shortCode}.png`)}
                    className="btn btn-secondary btn-sm"
                  >
                    Download QR code
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              {back}
              <button type="button" onClick={finish} disabled={saving || !card} className="btn btn-primary btn-lg">
                {saving && card && <Loader2 className="h-4 w-4 animate-spin" />} Go to dashboard
              </button>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-ink-subtle">
          Signed in as {user.email}.{' '}
          <Link href="/" className="link">Back to home</Link>
        </p>
      </main>
    </div>
  );
}
