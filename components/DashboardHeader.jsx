'use client';

import Link from 'next/link';

export default function DashboardHeader({ title, subtitle, actions }) {
  return (
    <div className="bg-white border-b border-[#0B3D3B]/10 px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-display font-black tracking-tight text-[#0B3D3B]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#4A706E] font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions ? (
          actions
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('reviewwo_onboarding_dismissed');
                window.dispatchEvent(new Event('reviewwo_open_tour'));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0B3D3B] bg-white border border-[#0B3D3B]/20 rounded-xl hover:bg-[#E6FFFB] hover:border-[#14B8A6] transition-all shadow-sm"
              title="Launch interactive setup guide tour"
            >
              <span className="text-sm">🧭</span>
              <span>Setup Guide</span>
            </button>
            <Link
              href="/dashboard/whatsapp"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#0B3D3B] bg-[#E6FFFB] border border-[#14B8A6]/40 rounded-xl hover:bg-[#99F6E4]/30 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Manager Rail: Alerts + OTP
            </Link>
            <Link
              href="/dashboard/standees"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-display font-bold text-white bg-[#0B3D3B] hover:bg-[#14B8A6] rounded-xl shadow-sm transition-all"
            >
              + Create Standee
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
