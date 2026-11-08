'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2, X, Plus, Star, ImagePlus } from 'lucide-react';
import { PageHeader, useDashboardUser } from '../../../components/DashboardShell';
import { apiPost, CATEGORIES, googleReviewUrl, PLACE_ID_FINDER_URL } from '../../../components/api';
import { SectionCard, ErrorNote } from '../../../components/ui';
import RazorpayCheckoutButton from '../../../components/RazorpayCheckoutButton';
import {
  DEFAULT_KEYWORDS,
  DEFAULT_BRAND_COLOR,
  DEFAULT_ACCENT_COLOR,
  MAX_KEYWORDS,
  MAX_KEYWORD_LENGTH,
  textOn,
} from '../../../src/lib/branding';

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

/** Shrinks an uploaded image to fit 256x256 and returns a WebP (or PNG) data URL. */
function resizeLogo(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      reject(new Error('Use a PNG, JPG or WebP image.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 256 / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      let data = canvas.toDataURL('image/webp', 0.9);
      if (!data.startsWith('data:image/webp')) data = canvas.toDataURL('image/png');
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That image could not be read.'));
    };
    img.src = url;
  });
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function ColorField({ id, label, value, fallback, onChange, hint }) {
  const v = value || fallback;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={HEX.test(v) ? v : fallback}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-line bg-white p-1"
        />
        <input
          aria-label={`${label} hex code`}
          value={v}
          onChange={(e) => onChange(e.target.value)}
          className="input font-mono text-[13px] uppercase"
          maxLength={7}
          spellCheck={false}
        />
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function BrandingSection({ user }) {
  const { refresh } = useDashboardUser();
  const [v, setV] = useState({
    brandName: user.brandName || '',
    brandLogo: user.brandLogo || '',
    brandColor: user.brandColor || '',
    brandAccent: user.brandAccent || '',
  });
  const [state, setState] = useState({ saving: false, error: '', saved: false });
  const set = (k, val) => {
    setV((x) => ({ ...x, [k]: val }));
    setState((s) => ({ ...s, saved: false }));
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      set('brandLogo', await resizeLogo(file));
    } catch (err) {
      setState({ saving: false, error: err.message, saved: false });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setState({ saving: true, error: '', saved: false });
    try {
      await apiPost('/api/settings/profile', v);
      setState({ saving: false, error: '', saved: true });
      refresh();
    } catch (err) {
      setState({ saving: false, error: err.message, saved: false });
    }
  };

  const color = HEX.test(v.brandColor) ? v.brandColor : DEFAULT_BRAND_COLOR;
  const accent = HEX.test(v.brandAccent) ? v.brandAccent : DEFAULT_ACCENT_COLOR;
  const shownName = v.brandName.trim() || user.businessName || 'Your business';

  return (
    <form onSubmit={save}>
      <SectionCard
        id="branding"
        title="Review page branding"
        description="Customers see your name, logo and colours when they scan. Reviewwo only appears as a small “Powered by” line."
        footer={<SaveFooter state={state} />}
      >
        <ErrorNote message={state.error} />
        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="brand-name" className="label">Name shown to customers</label>
              <input
                id="brand-name"
                value={v.brandName}
                onChange={(e) => set('brandName', e.target.value)}
                className="input"
                maxLength={80}
                placeholder={user.businessName}
              />
              <p className="hint">Leave empty to use your business name.</p>
            </div>
            <div className="sm:col-span-2">
              <span className="label">Logo</span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-line bg-canvas">
                  {v.brandLogo ? (
                    <img src={v.brandLogo} alt="Your logo" className="h-full w-full object-contain" />
                  ) : (
                    <ImagePlus className="h-6 w-6 text-ink-subtle" aria-hidden="true" />
                  )}
                </div>
                <label className="btn btn-secondary btn-sm cursor-pointer">
                  {v.brandLogo ? 'Change logo' : 'Upload logo'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="sr-only" />
                </label>
                {v.brandLogo && (
                  <button type="button" onClick={() => set('brandLogo', '')} className="btn btn-ghost btn-sm">Remove</button>
                )}
              </div>
              <p className="hint">PNG, JPG or WebP. A square logo works best; it is resized for you.</p>
            </div>
            <ColorField
              id="brand-color"
              label="Main colour"
              value={v.brandColor}
              fallback={DEFAULT_BRAND_COLOR}
              onChange={(c) => set('brandColor', c)}
              hint="Buttons and selected highlights."
            />
            <ColorField
              id="brand-accent"
              label="Star colour"
              value={v.brandAccent}
              fallback={DEFAULT_ACCENT_COLOR}
              onChange={(c) => set('brandAccent', c)}
              hint="The rating stars."
            />
          </div>

          <div aria-hidden="true" className="rounded-2xl border border-line bg-white p-5 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-subtle">Preview</p>
            {v.brandLogo && <img src={v.brandLogo} alt="" className="mx-auto mt-3 h-12 w-12 rounded-lg object-contain" />}
            <p className="mt-2 font-semibold text-ink">{shownName}</p>
            <div className="mt-2 flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="h-5 w-5" style={{ color: accent, fill: n <= 4 ? accent : 'none' }} strokeWidth={1.5} />
              ))}
            </div>
            <div className="mt-3 rounded-lg py-2 text-sm font-semibold" style={{ background: color, color: textOn(color) }}>
              Post review
            </div>
            <p className="mt-3 text-[10px] text-ink-subtle">Powered by Reviewwo</p>
          </div>
        </div>
      </SectionCard>
    </form>
  );
}

function KeywordsSection({ user }) {
  const { refresh } = useDashboardUser();
  const suggested = DEFAULT_KEYWORDS[user.category] || DEFAULT_KEYWORDS.other;
  const [list, setList] = useState(user.reviewKeywords?.length ? user.reviewKeywords : suggested);
  const [draft, setDraft] = useState('');
  const [state, setState] = useState({ saving: false, error: '', saved: false });

  const update = (next) => {
    setList(next);
    setState({ saving: false, error: '', saved: false });
  };
  const add = () => {
    const k = draft.replace(/\s+/g, ' ').trim().slice(0, MAX_KEYWORD_LENGTH);
    if (!k) return;
    if (list.some((x) => x.toLowerCase() === k.toLowerCase())) {
      setDraft('');
      return;
    }
    if (list.length >= MAX_KEYWORDS) {
      setState({ saving: false, error: `You can have up to ${MAX_KEYWORDS} highlights.`, saved: false });
      return;
    }
    update([...list, k]);
    setDraft('');
  };

  const save = async (e) => {
    e.preventDefault();
    if (!list.length) {
      setState({ saving: false, error: 'Add at least one highlight.', saved: false });
      return;
    }
    setState({ saving: true, error: '', saved: false });
    try {
      await apiPost('/api/settings/profile', { reviewKeywords: list });
      setState({ saving: false, error: '', saved: true });
      refresh();
    } catch (err) {
      setState({ saving: false, error: err.message, saved: false });
    }
  };

  return (
    <form onSubmit={save}>
      <SectionCard
        id="keywords"
        title="Review highlights"
        description="The words customers can tap to describe their visit. When they tap “Use AI”, a review is written around the ones they picked. Use words you want to be found for, like your best dishes or services."
        footer={<SaveFooter state={state} />}
      >
        <ErrorNote message={state.error} />
        <ul className="flex flex-wrap gap-2" aria-label="Highlights">
          {list.map((k) => (
            <li key={k} className="inline-flex h-9 items-center gap-1 rounded-full border border-line bg-white pl-3.5 pr-1.5 text-sm font-medium text-ink">
              {k}
              <button
                type="button"
                onClick={() => update(list.filter((x) => x !== k))}
                className="rounded-full p-1 text-ink-subtle hover:bg-canvas hover:text-ink"
                aria-label={`Remove ${k}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="kw-add" className="sr-only">Add a highlight</label>
          <input
            id="kw-add"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                add();
              }
            }}
            maxLength={MAX_KEYWORD_LENGTH}
            className="input sm:max-w-sm"
            placeholder="e.g. Best filter coffee"
          />
          <button type="button" onClick={add} disabled={!draft.trim()} className="btn btn-secondary">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add
          </button>
        </div>
        <p className="hint">
          {list.length} of {MAX_KEYWORDS}. Keep them short and true to what you offer.{' '}
          <button type="button" className="link" onClick={() => update(suggested)}>Reset to suggestions</button>
        </p>
      </SectionCard>
    </form>
  );
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
      <PageHeader title="Settings" description="Your business, review page, Google listing, alerts and plan." />

      <div className="grid max-w-5xl gap-6">
        <form onSubmit={business.save}>
          <SectionCard id="business" title="Business" description="Your business details. The AI uses your business type and city when writing reviews." footer={<SaveFooter state={business.state} />}>
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

        <BrandingSection user={user} />

        <KeywordsSection user={user} />

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
