'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/DashboardHeader';

export default function GoogleReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews/list');
      const data = await res.json();
      setReviews(data.reviews || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSendReply = async (reviewId) => {
    const customReply = replyTextMap[reviewId];
    setSubmittingId(reviewId);
    try {
      const res = await fetch('/api/reviews/autopilot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, customReply })
      });
      if (res.ok) {
        fetchReviews();
        setReplyTextMap({ ...replyTextMap, [reviewId]: '' });
      }
    } catch (e) {
      alert('Error sending reply: ' + e.message);
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return (r.rating || 5) === Number(filterRating);
  });

  return (
    <div>
      <DashboardHeader
        title="Google Reviews Management"
        subtitle="Live Google Business Profile review sync with 24/7 AI Autopilot instant replies and sentiment telemetry."
      />

      <div className="p-8 max-w-7xl space-y-8">
        {/* Autopilot Control Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${autopilotEnabled ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-[#14B8A6]">Autonomous Agent</span>
            </div>
            <h3 className="text-lg font-display font-black text-[#0B3D3B]">24/7 AI Review Autopilot Reply Engine</h3>
            <p className="text-xs text-[#4A706E] max-w-xl">
              When enabled, incoming Google reviews automatically receive a personalized, context-aware reply within 180 seconds to maximize your local Google Maps SEO ranking.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-[#0B3D3B]">
              {autopilotEnabled ? 'Autopilot Active' : 'Autopilot Paused'}
            </span>
            <button
              type="button"
              onClick={() => setAutopilotEnabled(!autopilotEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autopilotEnabled ? 'bg-[#14B8A6]' : 'bg-[#CBD5E1]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  autopilotEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', '5', '4', '3', '2', '1'].map((val) => (
            <button
              key={val}
              onClick={() => setFilterRating(val)}
              className={`px-4 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
                filterRating === val
                  ? 'bg-[#0B3D3B] text-white shadow'
                  : 'bg-white border border-[#0B3D3B]/10 text-[#4A706E] hover:text-[#0B3D3B]'
              }`}
            >
              {val === 'all' ? 'All Reviews' : `${val} Stars`}
            </button>
          ))}
        </div>

        {/* Reviews Stream */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-[#4A706E] py-8 text-center">Loading reviews...</p>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#0B3D3B]/10 rounded-2xl">
              <p className="text-sm font-display font-bold text-[#0B3D3B]">No reviews matching filter</p>
              <p className="text-xs text-[#4A706E] mt-1">Try switching to "All Reviews" or scan a counter standee to generate a new 5-star review.</p>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-white border border-[#0B3D3B]/10 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E6FFFB] text-[#0B3D3B] font-display font-black flex items-center justify-center text-sm border border-[#14B8A6]/30">
                      {rev.author ? rev.author.charAt(0) : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0B3D3B]">{rev.author}</h4>
                      <p className="text-[11px] text-[#4A706E]">{rev.date || 'Google Maps Verified Review'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#F59E0B] text-sm">
                    {'★'.repeat(rev.rating || 5)}
                  </div>
                </div>

                <p className="text-xs text-[#234745] leading-relaxed italic bg-[#F8FFFE] p-3.5 rounded-xl border border-[#0B3D3B]/5">
                  "{rev.text}"
                </p>

                {rev.reply ? (
                  <div className="p-4 rounded-xl bg-[#E6FFFB] border border-[#14B8A6]/30 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0B3D3B]">Dispatched Public Reply</span>
                      <span className="text-[10px] text-[#14B8A6] font-semibold">Autopilot Verified ✓</span>
                    </div>
                    <p className="text-xs text-[#234745]">{rev.reply}</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-[#0B3D3B]/10">
                    <label className="block text-xs font-bold text-[#0B3D3B]">
                      Write or Customize Public Reply:
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Thank you for visiting! We are delighted to hear this..."
                        value={replyTextMap[rev.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                        className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#0B3D3B]/20 bg-[#F8FFFE] focus:outline-none focus:border-[#14B8A6]"
                      />
                      <button
                        type="button"
                        disabled={submittingId === rev.id}
                        onClick={() => handleSendReply(rev.id)}
                        className="px-4 py-2.5 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow shrink-0"
                      >
                        {submittingId === rev.id ? 'Sending...' : 'Publish Reply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
