'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [activeTab, setActiveTab] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please verify credentials.');
      }
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp OTP Request (Feature 4: Merchant WhatsApp OTP)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile.replace(/\D/g, '')}`;
      const res = await fetch('/api/auth/whatsapp-otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formattedMobile })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch WhatsApp OTP.');
      }
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp OTP Verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile.replace(/\D/g, '')}`;
      const res = await fetch('/api/auth/whatsapp-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formattedMobile, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired OTP code.');
      }
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-xl border border-[#0B3D3B]/10 rounded-3xl sm:px-10">
      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-bold text-[#EF4444] flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Balanced Segmented Pill Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-[#E6FFFB] rounded-2xl mb-6 border border-[#14B8A6]/20">
        <button
          type="button"
          onClick={() => { setActiveTab('password'); setError(''); }}
          className={`py-2.5 text-xs font-display font-bold text-center rounded-xl transition-all ${
            activeTab === 'password'
              ? 'bg-[#0B3D3B] text-white shadow-sm'
              : 'text-[#4A706E] hover:text-[#0B3D3B]'
          }`}
        >
          Email &amp; Password
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('otp'); setError(''); }}
          className={`py-2.5 text-xs font-display font-bold text-center rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'otp'
              ? 'bg-[#0B3D3B] text-white shadow-sm'
              : 'text-[#4A706E] hover:text-[#0B3D3B]'
          }`}
        >
          <span>WhatsApp OTP</span>
          <span className="text-[10px] bg-[#14B8A6] text-white px-1.5 py-0.2 rounded font-black">₹0</span>
        </button>
      </div>

      {activeTab === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-display font-bold text-[#0B3D3B] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@business.com"
              className="h-12 w-full text-sm font-medium px-4 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all text-[#0B3D3B]"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-bold text-[#0B3D3B] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full text-sm font-medium pl-4 pr-16 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:bg-white focus:outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 transition-all text-[#0B3D3B]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-display font-bold text-[#14B8A6] hover:text-[#0B3D3B] transition-colors select-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-sm font-display font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console →'}
          </button>
        </form>
      ) : (
        <div>
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-display font-bold text-[#0B3D3B] mb-1.5">
                  Merchant WhatsApp Phone Number
                </label>
                <div className="h-12 flex items-stretch rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus-within:bg-white focus-within:border-[#14B8A6] focus-within:ring-2 focus-within:ring-[#14B8A6]/20 transition-all overflow-hidden">
                  <span className="inline-flex items-center px-3.5 bg-[#E6FFFB] border-r border-[#0B3D3B]/10 text-xs font-display font-bold text-[#0B3D3B] select-none shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 43210"
                    className="h-full w-full text-sm font-medium px-4 bg-transparent focus:outline-none text-[#0B3D3B]"
                  />
                </div>
                <p className="text-[11px] text-[#4A706E] mt-1.5">
                  Security OTP is dispatched to your WhatsApp via sovereign socket with ₹0 SMS surcharge.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-sm font-display font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Transmitting Code...' : 'Send WhatsApp Security Code (₹0) →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-display font-bold text-[#0B3D3B] mb-1.5 text-center">
                  Enter 6-Digit WhatsApp Security Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="h-14 w-full text-center text-2xl font-display font-black tracking-[0.4em] px-4 rounded-xl border-2 border-[#14B8A6] bg-[#F8FFFE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 transition-all text-[#0B3D3B]"
                />
                <p className="text-[11px] text-[#4A706E] mt-2 text-center">
                  Security code delivered to <strong className="text-[#0B3D3B]">{mobile}</strong>. Valid for 5 minutes.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-sm font-display font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Verifying Code...' : 'Verify & Enter Console →'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-[#4A706E] hover:text-[#0B3D3B] font-semibold pt-1"
              >
                ← Change Phone Number
              </button>
            </form>
          )}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-[#0B3D3B]/10 text-center">
        <p className="text-xs text-[#4A706E]">
          New to Reviewwo?{' '}
          <Link href="/register" className="font-bold text-[#14B8A6] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FFFE] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="w-full max-w-md text-center flex flex-col items-center">
        <Link href="/" className="inline-block group mb-4">
          <img
            src="/assets/img/logos/combo-dark.png"
            alt="Reviewwo"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
        <h2 className="text-2xl font-display font-black tracking-tight text-[#0B3D3B]">
          Sign In to Merchant Console
        </h2>
        <p className="mt-1 text-xs text-[#4A706E]">
          Autonomous In-Store Google Review Acceleration Platform
        </p>
      </div>

      <div className="mt-8 w-full max-w-md">
        <Suspense fallback={<div className="p-8 text-center text-xs text-[#4A706E]">Loading console...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
