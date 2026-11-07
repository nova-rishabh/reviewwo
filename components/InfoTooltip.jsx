'use client';

import { useState } from 'react';

export default function InfoTooltip({ text, title = 'About this metric' }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E6FFFB] hover:bg-[#14B8A6] text-[#0B3D3B] hover:text-white text-[10px] font-bold border border-[#14B8A6]/30 transition-all focus:outline-none"
        aria-label="More information"
      >
        ?
      </button>

      {open && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-[#0B3D3B] text-white text-[11px] font-normal rounded-xl shadow-xl border border-[#14B8A6]/30 leading-relaxed text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <span className="block font-display font-bold text-[#99F6E4] mb-1">
            {title}
          </span>
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#0B3D3B]"></span>
        </span>
      )}
    </span>
  );
}
