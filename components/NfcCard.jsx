/**
 * A to-scale rendering of the Reviewwo NFC review card (ISO ID-1, 85.6 × 54 mm).
 * Pass a QR data URL to show the real code; otherwise a placeholder pattern is drawn.
 */
export function ContactlessMark({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M8.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M11.6 6.8a7.4 7.4 0 0 1 0 10.4" />
      <path d="M14.7 4.4a10.8 10.8 0 0 1 0 15.2" />
    </svg>
  );
}

function PlaceholderQr() {
  // Deterministic pseudo-QR so the illustration is stable across renders.
  const cells = [];
  let seed = 7;
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const inFinder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (inFinder) continue;
      seed = (seed * 9301 + 49297) % 233280;
      if (seed / 233280 > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  const finder = (x, y) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" className="h-full w-full" fill="#0B3D3B" shapeRendering="crispEdges" aria-hidden="true">
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
      {cells}
    </svg>
  );
}

export default function NfcCard({ businessName = 'The Corner Café', qrDataUrl, className = '', label }) {
  return (
    <div
      className={`relative aspect-[85.6/54] w-full select-none overflow-hidden rounded-[4.5%/7%] bg-brand-800 text-white shadow-object [container-type:inline-size] ${className}`}
      role="img"
      aria-label={label || `Reviewwo NFC review card for ${businessName}`}
    >
      {/* subtle sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.10),transparent_55%)]" />
      <div className="relative flex h-full flex-col justify-between p-[6%]">
        <div className="flex items-start justify-between">
          <ContactlessMark className="h-[9cqw] w-[9cqw] text-white/90" />
          <img src="/assets/img/logos/icon-white.png" alt="" className="h-[7cqw] w-auto opacity-80" />
        </div>
        <div className="flex items-end justify-between gap-[5%]">
          <div className="min-w-0">
            <p className="truncate font-display text-[6.4cqw] font-bold leading-tight">
              {businessName}
            </p>
            <p className="mt-1 text-[3.6cqw] text-brand-100">Tap or scan to leave a review</p>
          </div>
          <div className="aspect-square w-[27%] shrink-0 rounded-[8%] bg-white p-[2.5%]">
            {qrDataUrl ? <img src={qrDataUrl} alt="" className="h-full w-full" /> : <PlaceholderQr />}
          </div>
        </div>
      </div>
    </div>
  );
}
