'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '../../components/AuthShell';

const PLANS = [
  { id: 'starter', name: 'Starter', price: 149 },
  { id: 'growth', name: 'Growth', price: 299 },
  { id: 'agency', name: 'Agency', price: 799 },
];

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlan = PLANS.some((p) => p.id === params.get('plan')) ? params.get('plan') : 'starter';
  const billingCycle = params.get('billing') === 'annual' ? 'annual' : 'monthly';

  const initialCoupon = (params.get('coupon') || '').toUpperCase();
  const initialRef = (params.get('ref') || '').toUpperCase();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', plan: initialPlan, coupon: initialCoupon, reference: initialRef });
  const [showCoupon, setShowCoupon] = useState(Boolean(initialCoupon));
  const [showRef, setShowRef] = useState(Boolean(initialRef));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.authenticated) router.replace(d.user.onboardingComplete ? '/dashboard' : '/onboarding');
      })
      .catch(() => {});
  }, [router]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, billingCycle }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not create your account.');
      router.replace('/onboarding');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">Your name</label>
        <input id="name" required autoComplete="name" value={form.name} onChange={set('name')} className="input" />
      </div>

      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@business.com"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="mobile" className="label">Mobile number</label>
        <div className="flex">
          <span className="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-line bg-canvas px-3 text-sm font-medium text-ink-muted">
            +91
          </span>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="tel-national"
            value={form.mobile}
            onChange={set('mobile')}
            placeholder="98765 43210"
            className="input rounded-l-none"
          />
        </div>
        <p className="hint">Use a number with WhatsApp. You can sign in with it, and we’ll suggest it for feedback alerts.</p>
      </div>

      <div>
        <label htmlFor="password" className="label">Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            className="input pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ink-subtle hover:bg-canvas hover:text-ink"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="hint">At least 8 characters.</p>
      </div>

      <fieldset>
        <legend className="label">Plan</legend>
        <div className="grid grid-cols-3 gap-2">
          {PLANS.map((p) => (
            <label
              key={p.id}
              className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600 ${
                form.plan === p.id ? 'border-brand-800 bg-brand-50' : 'border-line hover:border-brand-200'
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={p.id}
                checked={form.plan === p.id}
                onChange={set('plan')}
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-ink">{p.name}</span>
              <span className="block text-[13px] text-ink-muted">₹{p.price}/mo</span>
            </label>
          ))}
        </div>
        <p className="hint">
          {form.coupon.trim()
            ? 'Your coupon sets the plan. You can change it later.'
            : 'You can change your plan later. You’ll pay when you subscribe from your dashboard.'}
        </p>
      </fieldset>

      {showRef ? (
        <div>
          <label htmlFor="reference" className="label">Reference code</label>
          <input
            id="reference"
            value={form.reference}
            onChange={set('reference')}
            className="input font-mono uppercase"
            placeholder="REF-XXXXXX"
            autoCapitalize="characters"
            spellCheck={false}
          />
          <p className="hint">The code from the person who told you about Reviewwo.</p>
        </div>
      ) : null}

      {showCoupon ? (
        <div>
          <label htmlFor="coupon" className="label">Coupon code</label>
          <input
            id="coupon"
            value={form.coupon}
            onChange={set('coupon')}
            className="input font-mono uppercase"
            placeholder="RW-XXXXXXXX"
            autoCapitalize="characters"
            spellCheck={false}
          />
        </div>
      ) : null}

      {(!showCoupon || !showRef) && (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {!showCoupon && (
            <button type="button" onClick={() => setShowCoupon(true)} className="link text-sm">
              Have a coupon code?
            </button>
          )}
          {!showRef && (
            <button type="button" onClick={() => setShowRef(true)} className="link text-sm">
              Have a reference code?
            </button>
          )}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Next, you’ll add your business and Google listing."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="link">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-96" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
