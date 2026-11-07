'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReviewTapPage({ params }) {
  const unwrappedParams = use(params);
  const code = unwrappedParams.code || 'RW101';

  const [business, setBusiness] = useState({
    name: 'Royal Bengal Bistro & Lounge',
    city: 'Connaught Place, New Delhi',
    placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    rating: 4.9,
    totalReviews: 842
  });

  const [rating, setRating] = useState(5);
  const [selectedTag, setSelectedTag] = useState('Attentive Hospitality');
  const [customDraft, setCustomDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [shieldSubmitted, setShieldSubmitted] = useState(false);
  const [shieldFeedback, setShieldFeedback] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submittingShield, setSubmittingShield] = useState(false);

  const tags = [
    'Attentive Hospitality',
    'Delicious Food & Fresh Taste',
    'Cozy & Elegant Ambiance',
    'Fast & Courteous Service',
    'Great Drinks & Vibe',
    'Outstanding Value'
  ];

  const draftTemplates = {
    'Attentive Hospitality': [
      `Had a wonderful experience at ${business.name}! The staff was extremely polite, attentive, and welcoming throughout our visit. Definitely 5 stars!`,
      `Outstanding hospitality at ${business.name}! Team went above and beyond to make sure our table had everything. Highly recommend!`,
    ],
    'Delicious Food & Fresh Taste': [
      `The food at ${business.name} was incredible! Every dish was fresh, flavorful, and cooked to perfection. Can't wait to return.`,
      `Easily one of the best meals in town! ${business.name} exceeded our expectations. Great flavors and top-tier presentation.`,
    ],
    'Cozy & Elegant Ambiance': [
      `Loved the atmosphere and music at ${business.name}. Beautiful interior aesthetics and very relaxing vibe for an evening out!`,
      `The vibe at ${business.name} is second to none! Perfect spot for catching up with friends or date night. 5/5 stars!`,
    ],
    'Fast & Courteous Service': [
      `Super quick service and courteous team at ${business.name}! Our orders arrived promptly and everything was seamless.`,
      `Impressively efficient staff at ${business.name}. Polite, prompt, and thorough. 10/10 dining experience!`,
    ],
    'Great Drinks & Vibe': [
      `Fantastic beverage selection and vibrant ambience at ${business.name}. Thoroughly enjoyed our time here!`,
      `Top notch bar and great drinks at ${business.name}. Bartenders know their craft and service was super friendly.`,
    ],
    'Outstanding Value': [
      `Amazing value for money at ${business.name}! Generous portions, premium quality, and friendly staff. Will definitely visit again.`,
      `Solid 5-star experience at ${business.name}. Great quality without breaking the bank. Highly recommend to everyone!`,
    ]
  };

  useEffect(() => {
    const list = draftTemplates[selectedTag] || draftTemplates['Attentive Hospitality'];
    setCustomDraft(list[0]);
  }, [selectedTag, business.name]);

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    const list = draftTemplates[tag] || draftTemplates['Attentive Hospitality'];
    const pick = list[Math.floor(Math.random() * list.length)];
    setCustomDraft(pick);
    setCopied(false);
  };

  const handleShuffleDraft = () => {
    const list = draftTemplates[selectedTag] || draftTemplates['Attentive Hospitality'];
    const other = list.find(d => d !== customDraft) || list[0];
    setCustomDraft(other);
    setCopied(false);
  };

  const handle1TapCopyAndOpenGoogle = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(customDraft);
    }
    setCopied(true);

    // Deep-link to Google Maps Write Review dialogue
    setTimeout(() => {
      const googleUrl = `https://search.google.com/local/writereview?placeid=${business.placeId}`;
      window.open(googleUrl, '_blank');
    }, 500);

    setTimeout(() => {
      setCopied(false);
    }, 6000);
  };

  const handleSubmitShield = async (e) => {
    e.preventDefault();
    if (!shieldFeedback.trim()) return;
    setSubmittingShield(true);
    try {
      await fetch('/api/shield/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback: shieldFeedback,
          customerName: guestName || 'In-Store Guest',
          code
        })
      });
      setShieldSubmitted(true);
    } catch (err) {
      alert('Feedback logged. Thank you!');
      setShieldSubmitted(true);
    } finally {
      setSubmittingShield(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FFFE] flex flex-col justify-between max-w-md mx-auto shadow-2xl border-x border-[#0B3D3B]/10">
      {/* Top Header */}
      <header className="p-4 bg-white border-b border-[#0B3D3B]/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/assets/img/logos/combo-dark.png"
            alt="Reviewwo"
            className="h-7 w-auto object-contain"
          />
        </Link>
        <span className="text-[10px] font-bold text-[#14B8A6] bg-[#E6FFFB] px-2 py-0.5 rounded-full border border-[#14B8A6]/20">
          NFC In-Store Tap #{code}
        </span>
      </header>

      {/* Main Review Card */}
      <main className="p-5 space-y-5 flex-1">
        {/* Business Title Badge */}
        <div className="text-center pt-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#0B3D3B] to-[#14B8A6] flex items-center justify-center text-white text-xl font-display font-black shadow-md mb-2">
            🏪
          </div>
          <h1 className="text-xl font-display font-black text-[#0B3D3B]">
            {business.name}
          </h1>
          <p className="text-xs text-[#4A706E]">
            {business.city} • <span className="text-[#F59E0B] font-bold">★ {business.rating}</span> ({business.totalReviews} reviews)
          </p>
        </div>

        {/* Interactive Star Rating */}
        <div className="bg-white p-5 rounded-2xl border border-[#0B3D3B]/10 shadow-sm text-center">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#4A706E] mb-2.5">
            How was your visit today?
          </p>
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform active:scale-125 hover:scale-110 ${
                  star <= rating ? 'text-[#F59E0B]' : 'text-gray-300'
                }`}
                aria-label={`${star} Stars`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-xs font-bold mt-2 text-[#0B3D3B]">
            {rating === 5 && '🌟 Extraordinary 5-Star Experience!'}
            {rating === 4 && '👍 Great Visit!'}
            {rating === 3 && '😐 Average Experience'}
            {rating <= 2 && '⚠️ Needs Immediate Improvement'}
          </p>
        </div>

        {/* 4 & 5 STARS: 1-Tap Copy & Deep-Link to Google Maps */}
        {rating >= 4 ? (
          <div className="space-y-4">
            {/* Tag selector */}
            <div>
              <label className="block text-xs font-display font-bold text-[#0B3D3B] mb-2">
                What did you enjoy the most?
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSelectTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-[#0B3D3B] text-white shadow-sm font-bold scale-[1.02]'
                        : 'bg-white border border-[#0B3D3B]/15 text-[#234745] hover:border-[#14B8A6]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Draft Box */}
            <div className="bg-white p-4 rounded-2xl border border-[#0B3D3B]/10 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-display font-bold text-[#14B8A6] uppercase tracking-wider flex items-center gap-1">
                  ✨ Pre-Written 5★ Review
                </span>
                <button
                  type="button"
                  onClick={handleShuffleDraft}
                  className="text-[11px] text-[#4A706E] hover:text-[#0B3D3B] font-semibold flex items-center gap-1"
                >
                  🔄 Shuffle
                </button>
              </div>
              <textarea
                rows={3}
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                className="w-full text-xs text-[#234745] p-2.5 rounded-xl bg-[#F8FFFE] border border-[#0B3D3B]/15 focus:outline-none focus:border-[#14B8A6] leading-relaxed"
              />
              <p className="text-[10px] text-[#4A706E] italic">
                Feel free to edit or personalize before posting!
              </p>
            </div>

            {/* 1-TAP ACTION BUTTON */}
            <button
              type="button"
              onClick={handle1TapCopyAndOpenGoogle}
              className={`w-full py-4 px-6 rounded-2xl font-display font-black text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-[#10B981] scale-[0.99]'
                  : 'bg-gradient-to-r from-[#0B3D3B] via-[#0D4B48] to-[#14B8A6] hover:brightness-110 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <span>✓</span> Review Copied! Opening Google...
                </>
              ) : (
                <>
                  <span>⚡</span> 1-Tap Copy &amp; Open Google Maps →
                </>
              )}
            </button>

            {/* Micro instruction */}
            <div className="p-3 bg-[#E6FFFB] border border-[#14B8A6]/30 rounded-xl text-center space-y-1">
              <p className="text-[11px] font-bold text-[#0B3D3B]">
                How it works in 10 seconds:
              </p>
              <p className="text-[10px] text-[#4A706E] leading-relaxed">
                1. Tap the button above (copies your review automatically).<br />
                2. On Google Maps, select <strong>5 Stars</strong>, long-press to <strong>Paste</strong>, and hit <strong>Post</strong>!
              </p>
            </div>
          </div>
        ) : (
          /* 1, 2, 3 STARS: Negative Review Shield - Dispatches WhatsApp Alert to Manager */
          <div className="bg-white p-5 rounded-2xl border border-[#EF4444]/20 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-[#DC2626]">
              <span className="text-xl">🛡️</span>
              <h2 className="text-sm font-display font-bold">
                Private Manager Grievance Channel
              </h2>
            </div>
            <p className="text-xs text-[#4A706E] leading-relaxed">
              We are genuinely sorry your visit was not 5-star. Your feedback is sent directly to the store manager's personal WhatsApp, giving our team a chance to fix it right now.
            </p>

            {shieldSubmitted ? (
              <div className="p-4 bg-[#E6FFFB] border border-[#14B8A6] rounded-xl text-center space-y-1">
                <span className="text-xl">✅</span>
                <p className="text-xs font-display font-bold text-[#0B3D3B]">
                  Direct Manager Alert Dispatched
                </p>
                <p className="text-[11px] text-[#4A706E]">
                  Our store manager has been notified on WhatsApp and will address your feedback immediately. Thank you for your patience!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitShield} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#0B3D3B] mb-1">
                    What fell short today?
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us what went wrong (slow service, food quality, temperature, etc.)..."
                    value={shieldFeedback}
                    onChange={(e) => setShieldFeedback(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#F8FFFE] border border-[#0B3D3B]/20 focus:outline-none focus:border-[#EF4444]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0B3D3B] mb-1">
                    Your Name or Phone (Optional, for resolution)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John • +91 98765 43210"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#F8FFFE] border border-[#0B3D3B]/20 focus:outline-none focus:border-[#EF4444]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingShield}
                  className="w-full py-3 px-4 bg-[#0B3D3B] hover:bg-[#DC2626] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
                >
                  {submittingShield ? 'Sending to Manager...' : 'Alert Store Manager on WhatsApp →'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-[#0B3D3B]/10 bg-white">
        <p className="text-[10px] text-[#4A706E]">
          Powered by <strong className="text-[#0B3D3B]">Reviewwo</strong> • 1-Tap Google Review Velocity
        </p>
      </footer>
    </div>
  );
}
