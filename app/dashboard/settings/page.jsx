'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/DashboardHeader';
import RazorpayCheckoutButton from '../../../components/RazorpayCheckoutButton';

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: '',
    businessName: '',
    email: '',
    mobile: '',
    googlePlaceId: '',
    plan: 'growth',
    planPrice: 299
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) {
          setUser(d.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          businessName: user.businessName,
          mobile: user.mobile,
          googlePlaceId: user.googlePlaceId
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Settings updated successfully!');
      } else {
        setMessage('Error saving settings: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      setMessage('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Settings &amp; Integrations"
        subtitle="Manage your Google Place ID linkage, business identity, and subscription tier."
      />

      <div className="p-8 max-w-4xl space-y-8">
        {message && (
          <div className="p-4 rounded-2xl bg-[#E6FFFB] border border-[#14B8A6]/40 text-xs font-bold text-[#0B3D3B]">
            {message}
          </div>
        )}

        {/* Google Place ID Configuration */}
        <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
          <div className="border-b border-[#0B3D3B]/10 pb-3">
            <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Google Business Profile Sync</h3>
            <p className="text-xs text-[#4A706E]">
              Connect your verified Google Place ID so customers tapping your standees are directed immediately to your 5-star Google review dialog with prewritten text.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                Google Place ID
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
                  value={user.googlePlaceId || ''}
                  onChange={(e) => setUser({ ...user, googlePlaceId: e.target.value })}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>
              <p className="text-[11px] text-[#4A706E] mt-1">
                Can be obtained directly from your Google Business Profile manager or Google Maps Place ID Finder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Business Trading Name
                </label>
                <input
                  type="text"
                  value={user.businessName || ''}
                  onChange={(e) => setUser({ ...user, businessName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  value={user.name || ''}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Account Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email || ''}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/10 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B3D3B] mb-1">
                  Manager WhatsApp Alert Phone Number
                </label>
                <input
                  type="tel"
                  value={user.mobile || ''}
                  onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-6 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
            >
              {saving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Subscription Plan Overview */}
        <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
          <div className="border-b border-[#0B3D3B]/10 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Subscription Plan</h3>
              <p className="text-xs text-[#4A706E]">Your active SaaS plan and license entitlements</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-display font-bold uppercase bg-[#E6FFFB] text-[#0B3D3B] border border-[#14B8A6]/30">
              {user.plan} Tier
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FFFE] border border-[#0B3D3B]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xl font-display font-black text-[#0B3D3B]">₹{user.planPrice || 299}</span>
              <span className="text-xs text-[#4A706E]"> / month (billed automatically)</span>
              <p className="text-xs text-[#234745] mt-1">
                Includes 1-Tap Google Review Deep-Linking, Smart Negative Feedback Shield with Manager WhatsApp Alerts, and AI Autopilot Replies.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <RazorpayCheckoutButton
                plan={user.plan || 'growth'}
                billingCycle="monthly"
                className="px-4 py-2.5 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
                onSuccess={(data) => {
                  setMessage('🎉 Subscription activated successfully via Razorpay!');
                  fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); });
                }}
              >
                Pay via Razorpay →
              </RazorpayCheckoutButton>
              <a
                href="/pricing"
                className="px-4 py-2.5 bg-[#E6FFFB] border border-[#14B8A6]/40 text-[#0B3D3B] hover:bg-[#14B8A6] hover:text-white text-xs font-display font-bold rounded-xl transition-all shadow"
              >
                Change Plan →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
