'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({
    name: 'Merchant Partner',
    businessName: 'Connecting Business...',
    plan: 'growth',
    planPrice: 299
  });
  const [socketOnline, setSocketOnline] = useState(false);

  useEffect(() => {
    // Fetch live session
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) {
          setUser(d.user);
        }
      })
      .catch(() => {});

    // Check socket status
    fetch('/api/whatsapp/status')
      .then(r => r.json())
      .then(d => {
        if (d.connected) setSocketOnline(true);
      })
      .catch(() => {});
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Executive Overview', href: '/dashboard', icon: '📊' },
    { label: 'Manager WhatsApp Rail', href: '/dashboard/whatsapp', icon: '💬', badge: 'Alerts + OTP' },
    { label: 'Google Reviews', href: '/dashboard/reviews', icon: '⭐' },
    { label: 'Smart Standees', href: '/dashboard/standees', icon: '🏷️' },
    { label: 'Negative Shield', href: '/dashboard/shield', icon: '🛡️' },
    { label: 'Settings & Places', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#0B3D3B] text-[#C5EBE8] flex flex-col justify-between shrink-0 min-h-screen border-r border-[#14B8A6]/20">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-[#14B8A6]/20">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <img
              src="/assets/img/logos/combo-white.png"
              alt="Reviewwo Console"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Business quick info */}
        <div className="px-6 py-4 bg-[#051C1B]/60 border-b border-[#14B8A6]/10 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs text-[#99F6E4]/70">Active Business</p>
            <p className="text-sm font-bold text-white truncate">{user.businessName}</p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#14B8A6]/20 text-[#99F6E4] border border-[#14B8A6]/30">
            {user.plan} (₹{user.planPrice}/mo)
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#14B8A6] text-[#051C1B] font-extrabold shadow-sm'
                    : 'text-[#C5EBE8] hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-[#051C1B] text-white' : 'bg-white/10 text-[#99F6E4]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-[#14B8A6]/20 bg-[#051C1B]/40 space-y-3">
        {/* Gateway live status indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0B3D3B] border border-[#14B8A6]/20 text-xs">
          <span className="text-[#99F6E4]/80">Manager Alerts Rail</span>
          <span className="inline-flex items-center gap-1.5 font-bold text-white">
            <span className={`w-2 h-2 rounded-full ${socketOnline ? 'bg-[#10B981] animate-pulse' : 'bg-[#EF4444]'}`}></span>
            {socketOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* User Card & Sign Out */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-[#99F6E4]/70 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-bold text-[#EF4444] hover:text-white hover:bg-[#EF4444] px-2.5 py-1.5 rounded-lg transition-all border border-[#EF4444]/40"
            title="Sign out of enterprise console"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
