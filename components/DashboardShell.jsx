'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Inbox, CreditCard, Settings, MessageCircle, Menu, X, LogOut } from 'lucide-react';
import { apiGet } from './api';

const SessionContext = createContext({ user: null, refresh: () => {} });
export const useDashboardUser = () => useContext(SessionContext);

const NAV = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Feedback', href: '/dashboard/feedback', icon: Inbox },
  { label: 'Cards', href: '/dashboard/cards', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];
const PLAN_LABELS = { starter: 'Starter', growth: 'Growth', agency: 'Agency' };
const ADMIN_NAV = [{ label: 'WhatsApp sender', href: '/dashboard/whatsapp', icon: MessageCircle }];

function NavLinks({ pathname, isAdmin, openCount }) {
  const items = isAdmin ? [...NAV, ...ADMIN_NAV] : NAV;
  return (
    <nav className="space-y-0.5" aria-label="Dashboard">
      {items.map((item) => {
        const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-colors ${
              active ? 'bg-white/10 text-white' : 'text-brand-100 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span className="flex-1">{item.label}</span>
            {item.href === '/dashboard/feedback' && openCount > 0 && (
              <span className="rounded-full bg-marigold px-2 text-xs font-semibold leading-5 text-brand-900">{openCount}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [openCount, setOpenCount] = useState(0);
  const [drawer, setDrawer] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const me = await apiGet('/api/auth/me');
      if (!me.user.onboardingComplete) {
        router.replace('/onboarding');
        return;
      }
      setUser(me.user);
      const fb = await apiGet('/api/shield/list').catch(() => []);
      setOpenCount(Array.isArray(fb) ? fb.filter((f) => f.status === 'open').length : 0);
    } catch (e) {
      // apiGet redirects to /login on 401
    }
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => setDrawer(false), [pathname]);

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.replace('/login');
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-800">
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/dashboard" aria-label="Dashboard home">
          <img src="/assets/img/logos/combo-white.png" alt="Reviewwo" className="h-7 w-auto" />
        </Link>
        <button type="button" onClick={() => setDrawer(false)} className="rounded-md p-2 text-brand-100 hover:text-white lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-5 pb-5">
        <p className="truncate text-[15px] font-semibold text-white">{user?.businessName || ' '}</p>
        <p className="truncate text-[13px] text-brand-200">{user ? `${PLAN_LABELS[user.plan] || 'Starter'} plan` : ' '}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <NavLinks pathname={pathname} isAdmin={user?.isAdmin} openCount={openCount} />
      </div>
      <div className="border-t border-white/10 p-3">
        <div className="px-3 pb-2">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-[13px] text-brand-200">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[15px] font-medium text-brand-100 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <SessionContext.Provider value={{ user, refresh }}>
      <div className="min-h-screen bg-canvas">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

        {/* Mobile drawer */}
        {drawer && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button type="button" className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} aria-label="Close menu" />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">{sidebar}</aside>
          </div>
        )}

        <div className="lg:pl-64">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white px-4 lg:hidden">
            <button type="button" onClick={() => setDrawer(true)} className="-ml-2 rounded-md p-2 text-ink" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <p className="truncate font-semibold text-ink">{user?.businessName}</p>
          </div>
          <main className="w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{user ? children : <div className="h-64" aria-busy="true" />}</main>
        </div>
      </div>
    </SessionContext.Provider>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.75rem] font-bold leading-tight">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
