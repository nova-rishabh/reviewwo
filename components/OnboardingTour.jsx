'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const tourSteps = [
  {
    id: 'place-sync',
    targetId: 'tour-step-place',
    title: '1. Connect Your Google Place ID',
    badge: 'Critical Step',
    description: 'Connect your official Google Place ID. This ensures in-store NFC standees deep-link directly into your Google Maps 5-star review dialog with prewritten text.',
    actionLabel: 'Connect Place ID →',
    actionHref: '/dashboard/settings',
    tip: '💡 Tip: You can find your Place ID in Google Maps or paste your store link in Settings.'
  },
  {
    id: 'standees',
    targetId: 'tour-step-standees',
    title: '2. Deploy In-Store NFC Standees',
    badge: 'Physical Hardware',
    description: 'Generate custom acrylic counter standees for cashiers, dining tables, or bar counters. Includes embedded NTAG213 chips and vector SVG print templates.',
    actionLabel: 'View Standee Studio →',
    actionHref: '/dashboard/standees',
    tip: '💡 Tip: Customers tap with any iPhone or Android phone—zero app download required.'
  },
  {
    id: 'whatsapp-shield',
    targetId: 'tour-step-whatsapp',
    title: '3. Store Manager Grievance Rail',
    badge: 'Negative Shield',
    description: 'Link the store manager’s personal WhatsApp. If a customer rates 1–3 stars on a standee, it is intercepted away from Google and alerted straight to the manager’s phone (₹0 SMS fee).',
    actionLabel: 'Link Manager WhatsApp →',
    actionHref: '/dashboard/whatsapp',
    tip: '💡 Tip: Sovereign Baileys socket saves you ₹2.50 per SMS message and Meta Cloud fees.'
  },
  {
    id: 'customer-tap',
    targetId: 'tour-step-customer',
    title: '4. 1-Tap Customer Review Velocity',
    badge: '1-Tap Flow',
    description: 'Test what your customers experience on their phone: category tag chips, AI review drafts, 1-tap copy, and direct launch into Google Maps in under 12 seconds.',
    actionLabel: 'Open In-Store Tap Demo →',
    actionHref: '/r/RW101',
    external: true,
    tip: '💡 Tip: 1-tap prefilled reviews generate up to 4.2x higher review volume than bare Google links.'
  }
];

export default function OnboardingTour({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('reviewwo_onboarding_dismissed');
    if (isOpen !== undefined) {
      setVisible(isOpen);
    } else if (!dismissed) {
      setVisible(true);
    }

    const handleOpen = () => {
      setVisible(true);
      setMinimized(false);
      setCurrentStepIndex(0);
    };
    window.addEventListener('reviewwo_open_tour', handleOpen);
    return () => window.removeEventListener('reviewwo_open_tour', handleOpen);
  }, [isOpen]);

  const step = tourSteps[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / tourSteps.length) * 100);

  useEffect(() => {
    if (!visible || minimized) return;
    
    document.querySelectorAll('.tour-spotlight-active').forEach(el => {
      el.classList.remove('tour-spotlight-active');
    });

    const target = document.getElementById(step.targetId);
    if (target) {
      target.classList.add('tour-spotlight-active');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      if (target) target.classList.remove('tour-spotlight-active');
    };
  }, [currentStepIndex, visible, minimized, step.targetId]);

  const handleNext = () => {
    if (currentStepIndex < tourSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('reviewwo_onboarding_dismissed', 'true');
    setVisible(false);
    document.querySelectorAll('.tour-spotlight-active').forEach(el => {
      el.classList.remove('tour-spotlight-active');
    });
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <aside aria-label="Interactive Onboarding Guide" className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans animate-in fade-in slide-in-from-bottom-4 duration-300">
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2.5 bg-[#0B3D3B] text-white px-4 py-2.5 rounded-full shadow-2xl border border-[#14B8A6]/40 hover:bg-[#14B8A6] transition-all ml-auto"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
          <span className="text-xs font-display font-bold">Resume Setup Guide ({currentStepIndex + 1}/4)</span>
        </button>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#14B8A6]/40 overflow-hidden">
          <div className="bg-[#0B3D3B] px-5 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-xs font-display font-black tracking-wide text-white">
                Reviewwo Setup Guide
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="text-xs text-[#99F6E4] hover:text-white px-1.5 py-0.5 rounded font-bold"
                title="Minimize guide"
              >
                _
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="text-xs text-[#99F6E4] hover:text-white px-1.5 py-0.5 rounded font-bold"
                title="Dismiss guide"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="w-full bg-[#E6FFFB] h-1.5">
            <div
              className="bg-[#14B8A6] h-1.5 transition-all duration-300"
              style={{ width: progressPercent + '%' }}
            ></div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display font-extrabold px-2.5 py-0.5 rounded-full bg-[#E6FFFB] text-[#0B3D3B] border border-[#14B8A6]/30 uppercase tracking-wider">
                {step.badge}
              </span>
              <span className="text-xs font-bold text-[#4A706E]">
                Step {currentStepIndex + 1} of {tourSteps.length}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-display font-black text-[#0B3D3B]">
                {step.title}
              </h3>
              <p className="text-xs text-[#234745] leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#F8FFFE] border border-[#0B3D3B]/10 text-[11px] text-[#4A706E]">
              {step.tip}
            </div>

            {step.actionHref && (
              <div>
                <Link
                  href={step.actionHref}
                  target={step.external ? '_blank' : undefined}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E6FFFB] hover:bg-[#0B3D3B] text-[#0B3D3B] hover:text-white text-xs font-display font-bold rounded-xl border border-[#14B8A6]/40 transition-all shadow-sm"
                >
                  {step.actionLabel}
                </Link>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-[#0B3D3B]/10">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className={`text-xs font-bold transition-colors ${
                  currentStepIndex === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-[#4A706E] hover:text-[#0B3D3B]'
                }`}
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B3D3B] hover:bg-[#14B8A6] text-white text-xs font-display font-bold rounded-xl transition-all shadow"
              >
                {currentStepIndex === tourSteps.length - 1 ? 'Finish Guide ✓' : 'Next Step →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
