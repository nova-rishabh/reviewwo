'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/DashboardHeader';

export default function ShieldLogsPage() {
  const [logs, setLogs] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [note, setNote] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/shield/list');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleResolve = async (logId) => {
    try {
      const res = await fetch('/api/shield/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId, resolutionNote: note || 'Store manager notified on WhatsApp and customer grievance resolved privately.' })
      });
      if (res.ok) {
        setResolvingId(null);
        setNote('');
        fetchLogs();
      }
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Negative Review Shield"
        subtitle="Intercepts 1–3 star dissatisfied feedback before it reaches Google Maps. Dispatches instant WhatsApp alerts directly to the store manager."
      />

      <div className="p-8 max-w-7xl space-y-8">
        {/* Shield Architecture Value Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B3D3B] to-[#14B8A6] text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-display font-bold uppercase tracking-wider text-[#99F6E4]">
              Public Reputation Guardian
            </span>
            <h3 className="text-xl font-display font-black">Autonomous Grievance Interception Rail</h3>
            <p className="text-xs text-[#C5EBE8] max-w-2xl leading-relaxed">
              When a guest scans your standee and selects 1, 2, or 3 stars, they are seamlessly guided to a private feedback form. An automated alert is sent to the manager's phone via the WhatsApp socket. Your public Google rating remains untarnished at 4.9★ while the manager addresses the customer in real-time.
            </p>
          </div>
          <div className="bg-[#051C1B]/60 p-4 rounded-xl border border-white/10 shrink-0 text-center">
            <span className="block text-3xl font-display font-black text-[#99F6E4]">100%</span>
            <span className="text-[10px] text-[#C5EBE8] uppercase font-bold">Public Rating Protected</span>
          </div>
        </div>

        {/* Logs Table */}
        <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0B3D3B]/10">
            <h3 className="font-display font-extrabold text-base text-[#0B3D3B]">Intercepted Feedback Stream</h3>
            <span className="text-xs font-bold text-[#14B8A6]">
              {logs.filter(l => l.status === 'pending').length} Action Items Pending
            </span>
          </div>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#4A706E]">
                No negative feedback intercepted yet. Your standees are actively deflecting low ratings.
              </div>
            ) : (
              logs.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl border border-[#0B3D3B]/10 bg-[#F8FFFE] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0B3D3B]">{item.customerName || 'Anonymous Guest'}</span>
                        <span className="text-xs font-semibold text-[#4A706E]">({item.customerPhone || 'In-Store Scan'})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === 'resolved' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}>
                          {item.status === 'resolved' ? 'Resolved ✓' : 'Action Needed'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4A706E] mt-0.5">
                        Intercepted on {new Date(item.interceptedAt).toLocaleDateString()} at {new Date(item.interceptedAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="text-sm font-bold text-[#EF4444]">
                      {'★'.repeat(item.rating || 2)}
                      <span className="text-[#CBD5E1]">{'★'.repeat(5 - (item.rating || 2))}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#234745] bg-white p-3.5 rounded-xl border border-[#0B3D3B]/5 leading-relaxed">
                    "{item.feedback}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#0B3D3B]/5 text-xs">
                    <span className="text-[#4A706E]">
                      <strong>Internal Action:</strong> {item.actionTaken}
                    </span>
                    {item.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleResolve(item.id)}
                        className="px-3.5 py-1.5 bg-[#14B8A6] hover:bg-[#0B3D3B] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
