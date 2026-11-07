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
      const res = await fetch('/api/auth/whatsapp-otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
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
      const res = await fetch('/api/auth/whatsapp-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
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
        <div className="mb-6 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-bold text-[#EF4444]">
          {error}
        </div>
      )}

      {/* Authentication Mode Tabs */}
      <div className="flex border-b border-[#0B3D3B]/10 mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('password'); setError(''); }}
          className={`flex-1 pb-3 text-xs font-display font-bold text-center border-b-2 transition-all ${
            activeTab === 'password'
              ? 'border-[#0B3D3B] text-[#0B3D3B]'
              : 'border-transparent text-[#4A706E] hover:text-[#0B3D3B]'
          }`}
        >
          Email &amp; Password
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('otp'); setError(''); }}
          className={`flex-1 pb-3 text-xs font-display font-bold text-center border-b-2 transition-all ${
            activeTab === 'otp'
              ? 'border-[#14B8A6] text-[#14B8A6]'
              : 'border-transparent text-[#4A706E] hover:text-[#0B3D3B]'
          }`}
        >
          WhatsApp OTP (₹0 SMS)
        </button>
      </div>

      {activeTab === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="merchant@example.com"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console →'}
          </button>
        </form>
      ) : (
        <div>
          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  WhatsApp Phone Number (with Country Code)
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
                <p className="text-[11px] text-[#4A706E] mt-1">
                  OTP delivered directly to your WhatsApp via sovereign socket with ₹0 SMS surcharge.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#14B8A6] hover:bg-[#0B3D3B] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
              >
                {loading ? 'Dispatching OTP...' : 'Send WhatsApp OTP (₹0)'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Enter 6-Digit WhatsApp OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-lg font-black tracking-widest px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
                <p className="text-[11px] text-[#4A706E] mt-1 text-center">
                  Code sent to {mobile}. Valid for 5 minutes.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
              >
                {loading ? 'Verifying Code...' : 'Verify & Enter Dashboard →'}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-[#4A706E] hover:text-[#0B3D3B] font-semibold"
              >
                Change Phone Number
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
