'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiPost, CATEGORIES, googleReviewUrl, PLACE_ID_FINDER_URL } from '../../../components/api';
import { SectionCard, ErrorNote } from '../../../components/ui';
import RazorpayCheckoutButton from '../../../components/RazorpayCheckoutButton';

const local = (m) => String(m || '').replace(/^\+91/, '');

function useSection(initial) {
  const { refresh } = useDashboardUser();
  const [values, setValues] = useState(initial);
  const [state, setState] = useState({ saving: false, error: '', saved: false });
  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setState((s) => ({ ...s, saved: false }));
  };
  const save = async (e) => {
    e?.preventDefault();
    setState({ saving: true, error: '', saved: false });
    try {
      await apiPost('/api/settings/profile', values);
      setState({ saving: false, error: '', saved: true });
      refresh();
    } catch (err) {
      setState({ saving: false, error: err.message, saved: false });
    }
  };
  return { values, set, save, state };
}

function SaveFooter({ state, label = 'Save changes' }) {
  return (
    <>
      {state.saved && <span className="text-sm text-emerald-800" role="status">Saved</span>}
      <button type="submit" disabled={state.saving} className="btn btn-primary btn-sm">
        {state.saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {label}
      </button>
    </>
  );
}

function PhoneInput({ id, value, onChange, required }) {
  return (
    <div className="flex">
      <span className="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-line bg-canvas px-3 text-sm font-medium text-ink-muted">+91</span>
      <input id={id} type="tel" inputMode="numeric" required={required} value={value} onChange={onChange} className="input rounded-l-none" />
    </div>
  );
}

const PLAN_NAMES = { starter: 'Starter', growth: 'Growth', agency: 'Agency' };

function planLine(user) {
  if (user.planSource === 'coupon') {
    if (!user.planExpiresAt) return 'free with a coupon, no end date';
    const d = new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    return user.planStatus === 'expired' ? `free with a coupon, ended ${d}` : `free with a coupon until ${d}`;
  }
  return user.billingCycle === 'annual' ? 'billed yearly' : 'billed monthly';
}

function CouponForm({ onApplied }) {
  const [code, setCode] = useState('');
  const [state, setState] = useState({ busy: false, error: '' });
  const apply = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: '' });
    try {
      const res = await apiPost('/api/coupons/redeem', { code });
      setCode('');
      setState({ busy: false, error: '' });
      onApplied(res);
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  };
  return (
    <form onSubmit={apply} className="mt-5 border-t border-line pt-5">
      <label htmlFor="coupon" className="label">Have a coupon code?</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input font-mono uppercase sm:max-w-xs"
          placeholder="RW-XXXXXXXX"
          autoCapitalize="characters"
          spellCheck={false}
        />
        <button type="submit" disabled={state.busy || !code.trim()} className="btn btn-secondary">
          {state.busy && <Loader2 className="h-4 w-4 animate-spin" />} Apply
        </button>
      </div>
      {state.error && <p className="mt-2 text-sm text-red-700" role="alert">{state.error}</p>}
    </form>
  );
}

export default function SettingsPage() {
  const { user, refresh } = useDashboardUser();
  const business = useSection({ businessName: user.businessName, category: user.category, city: user.city });
  const google = useSection({ googlePlaceId: user.googlePlaceId });
  const alerts = useSection({ alertName: user.alertName, alertMobile: local(user.alertMobile) });
  const account = useSection({ name: user.name, mobile: local(user.mobile) });
  const [test, setTest] = useState({ state: 'idle', message: '' });
  const [planMsg, setPlanMsg] = useState('');

  const sendTest = async () => {
    setTest({ state: 'sending', message: '' });
    try {
      const res = await apiPost('/api/whatsapp/send-test');
      setTest({ state: 'sent', message: `Test message sent to ${res.to}.` });
    } catch (err) {
      setTest({ state: 'failed', message: err.message });
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Your business details, Google listing, alerts and plan." />

      <div className="grid max-w-5xl gap-6">
        <form onSubmit={business.save}>
          <SectionCard id="business" title="Business" description="Shown to customers when they scan your QR code." footer={<SaveFooter state={business.state} />}>
            <ErrorNote message={business.state.error} />
            <div className="grid gap-5 md:grid-cols-3">
              <div className="md:col-span-1">
                <label htmlFor="bn" className="label">Business name</label>
                <input id="bn" required value={business.values.businessName} onChange={business.set('businessName')} className="input" />
              </div>
              <div>
                <label htmlFor="cat" className="label">Type of business</label>
                <select id="cat" required value={business.values.category} onChange={business.set('category')} className="input">
                  <option value="" disabled>Choose one</option>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="label">City</label>
                <input id="city" required value={business.values.city} onChange={business.set('city')} className="input" />
              </div>
            </div>
          </SectionCard>
        </form>

        <form onSubmit={google.save}>
          <SectionCard
            id="google"
            title="Google listing"
            description="Customers are sent to the review form for this listing."
            footer={<SaveFooter state={google.state} />}
          >
            <ErrorNote message={google.state.error} />
            <label htmlFor="pid" className="label">Google Place ID</label>
            <input
              id="pid"
              required
              value={google.values.googlePlaceId}
              onChange={google.set('googlePlaceId')}
              className="input font-mono text-[13px]"
              spellCheck={false}
              placeholder="ChIJ…"
            />
            <p className="hint">
              Find it with Google’s{' '}
              <a href={PLACE_ID_FINDER_URL} target="_blank" rel="noreferrer" className="link">Place ID finder</a>.
            </p>
            {google.values.googlePlaceId?.trim().length >= 20 && (
              <a href={googleReviewUrl(google.values.googlePlaceId.trim())} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm mt-4">
                Check it opens your listing <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </SectionCard>
        </form>

        <form onSubmit={alerts.save}>
          <SectionCard
            id="alerts"
            title="Feedback alerts"
            description="Private messages from customers are forwarded to this WhatsApp number."
            footer={<SaveFooter state={alerts.state} />}
          >
            <ErrorNote message={alerts.state.error} />
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="an" className="label">Name</label>
                <input id="an" value={alerts.values.alertName} onChange={alerts.set('alertName')} className="input" placeholder="Store manager" />
              </div>
              <div>
                <label htmlFor="am" className="label">WhatsApp number</label>
                <PhoneInput id="am" required value={alerts.values.alertMobile} onChange={alerts.set('alertMobile')} />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={sendTest} disabled={test.state === 'sending' || !user.alertMobile} className="btn btn-secondary btn-sm">
                {test.state === 'sending' && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Send a test message
              </button>
              <span className="text-[13px] text-ink-subtle">Sends to the saved number.</span>
            </div>
            {test.message && (
              <p className={`mt-2 text-sm ${test.state === 'sent' ? 'text-emerald-800' : 'text-red-700'}`} role="status">{test.message}</p>
            )}
          </SectionCard>
        </form>

        <form onSubmit={account.save}>
          <SectionCard id="account" title="Your account" footer={<SaveFooter state={account.state} />}>
            <ErrorNote message={account.state.error} />
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="un" className="label">Your name</label>
                <input id="un" required value={account.values.name} onChange={account.set('name')} className="input" />
              </div>
              <div>
                <label htmlFor="ue" className="label">Email</label>
                <input id="ue" value={user.email} disabled className="input" />
              </div>
              <div>
                <label htmlFor="um" className="label">Mobile (for sign-in)</label>
                <PhoneInput id="um" required value={account.values.mobile} onChange={account.set('mobile')} />
              </div>
            </div>
          </SectionCard>
        </form>

        <SectionCard id="plan" title="Plan">
          {planMsg && <div className="alert alert-success mb-4">{planMsg}</div>}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] text-ink">
                <span className="font-semibold">{PLAN_NAMES[user.plan] || user.plan}</span>
                {', '}
                {planLine(user)}
              </p>
              <p className="mt-1">
                {user.planStatus === 'active' ? (
                  <span className="badge badge-success">Active</span>
                ) : user.planStatus === 'expired' ? (
                  <span className="badge badge-warning">Ended</span>
                ) : (
                  <span className="badge badge-warning">Not paid yet</span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.planStatus !== 'active' && (
                <RazorpayCheckoutButton
                  plan={user.plan}
                  billingCycle={user.billingCycle}
                  className="btn btn-primary btn-sm"
                  onSuccess={(d) => {
                    setPlanMsg(d.message || 'Payment received.');
                    refresh();
                  }}
                >
                  Pay and activate
                </RazorpayCheckoutButton>
              )}
              <Link href="/pricing" className="btn btn-secondary btn-sm">Compare plans</Link>
            </div>
          </div>
          <CouponForm
            onApplied={(res) => {
              const months = res.months === 0 ? 'with no end date' : `for ${res.months} month${res.months === 1 ? '' : 's'}`;
              setPlanMsg(`Coupon applied. You’re on the ${PLAN_NAMES[res.plan]} plan ${months}.`);
              refresh();
            }}
          />
        </SectionCard>
      </div>
    </>
  );
}
