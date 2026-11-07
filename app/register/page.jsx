'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('growth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          businessName,
          email,
          mobile,
          password,
          plan
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          Create Enterprise Account
        </h2>
        <p className="mt-1 text-xs text-[#4A706E]">
          Join thousands of merchants accelerating 5-star Google reviews with 1-tap deep links.
        </p>
      </div>

      <div className="mt-8 w-full max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#0B3D3B]/10 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-bold text-[#EF4444]">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Bengal Bistro"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  WhatsApp Number (for Grievance Alerts)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                Create Strong Password
              </label>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
              />
            </div>

            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0B3D3B] mb-2">
                Choose Subscription Plan
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'starter', name: 'Starter', price: '₹149/mo', desc: '1 Location' },
                  { id: 'growth', name: 'Growth', price: '₹299/mo', desc: 'Popular • 3 Loc' },
                  { id: 'agency', name: 'Agency', price: '₹799/mo', desc: 'White-Label' }
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`cursor-pointer p-3.5 rounded-2xl border text-center transition-all ${
                      plan === p.id
                        ? 'border-[#14B8A6] bg-[#E6FFFB] shadow-sm'
                        : 'border-[#0B3D3B]/10 bg-[#F8FFFE] hover:border-[#14B8A6]/40'
                    }`}
                  >
                    <p className="text-xs font-display font-extrabold text-[#0B3D3B]">{p.name}</p>
                    <p className="text-sm font-display font-black text-[#14B8A6]">{p.price}</p>
                    <p className="text-[10px] text-[#4A706E]">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow-md mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Enterprise Registration →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#0B3D3B]/10 text-center">
            <p className="text-xs text-[#4A706E]">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#14B8A6] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
