'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell, { safeRedirect } from '../../components/AuthShell';

function formatIndianMobile(value) {
  const digits = value.replace(/\D/g, '');
  if (value.trim().startsWith('+')) return `+${digits}`;
  return `+91${digits.slice(-10)}`;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirect'));

  const [tab, setTab] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already signed in? Skip the form.
  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.authenticated) router.replace(d.user.onboardingComplete ? redirectTo : '/onboarding');
      })
      .catch(() => {});
  }, [router, redirectTo]);

  const submit = async (url, body, onOk) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      onOk(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishLogin = (data) => {
    router.replace(data?.user && !data.user.onboardingComplete ? '/onboarding' : redirectTo);
    router.refresh();
  };

  const switchTab = (next) => {
    setTab(next);
    setError('');
  };

  return (
    <>
      <div role="tablist" aria-label="Sign-in method" className="mb-6 grid grid-cols-2 rounded-lg bg-canvas p-1">
        {[
          { id: 'password', label: 'Email' },
          { id: 'otp', label: 'WhatsApp code' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => switchTab(t.id)}
            className={`h-9 rounded-md text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-white text-ink shadow-card' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger mb-5" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {tab === 'password' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit('/api/auth/login', { email, password }, finishLogin);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : !otpSent ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit('/api/auth/whatsapp-otp/request', { mobile: formatIndianMobile(mobile) }, () => setOtpSent(true));
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="mobile" className="label">WhatsApp number</label>
            <div className="flex">
              <span className="inline-flex h-11 items-center rounded-l-lg border border-r-0 border-line bg-canvas px-3 text-sm font-medium text-ink-muted">
                +91
              </span>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="98765 43210"
                className="input rounded-l-none"
              />
            </div>
            <p className="hint">Use the number saved on your account. We’ll send a 6-digit code to WhatsApp.</p>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit('/api/auth/whatsapp-otp/verify', { mobile: formatIndianMobile(mobile), otp }, finishLogin);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="otp" className="label">6-digit code</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="input h-12 text-center text-xl font-semibold tracking-[0.4em]"
            />
            <p className="hint">Sent to {formatIndianMobile(mobile)} on WhatsApp. The code expires in 5 minutes.</p>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {loading ? 'Checking…' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setError('');
            }}
            className="btn btn-ghost w-full"
          >
            Use a different number
          </button>
        </form>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to your Reviewwo dashboard."
      footer={
        <>
          New to Reviewwo?{' '}
          <Link href="/register" className="link">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
