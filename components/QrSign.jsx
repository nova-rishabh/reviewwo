/**
 * A printed table-top review sign with the business's QR code. This is the main product visual;
 * NFC cards are an optional add-on shown only on the NFC pages.
 */
function PlaceholderQr() {
  const cells = [];
  let seed = 11;
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      const inFinder = (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16);
      if (inFinder) continue;
      seed = (seed * 9301 + 49297) % 233280;
      if (seed / 233280 > 0.5) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
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
    <svg viewBox="0 0 25 25" className="h-full w-full" fill="#0B3D3B" shapeRendering="crispEdges" aria-hidden="true">
      {finder(0, 0)}
      {finder(18, 0)}
      {finder(0, 18)}
      {cells}
    </svg>
  );
}

export default function QrSign({ businessName = 'The Corner Café', qrDataUrl, className = '', label }) {
  return (
    <figure
      className={`relative mx-auto w-full max-w-[300px] select-none [container-type:inline-size] ${className}`}
      aria-label={label || `Review QR code sign for ${businessName}`}
      role="img"
    >
      <div className="rounded-[6%] border border-line bg-white px-[9%] pb-[9%] pt-[10%] text-center shadow-object">
        <p className="font-display text-[8.5cqw] font-bold leading-tight text-ink">{businessName}</p>
        <p className="mt-[2%] text-[5cqw] text-ink-muted">Enjoyed your visit?</p>
        <div className="mx-auto mt-[7%] aspect-square w-[78%] rounded-[5%] border border-line bg-white p-[4%]">
          {qrDataUrl ? <img src={qrDataUrl} alt="" className="h-full w-full" /> : <PlaceholderQr />}
        </div>
        <p className="mt-[7%] text-[5.4cqw] font-semibold text-brand-800">Scan to leave a Google review</p>
      </div>
      {/* stand foot */}
      <div className="mx-auto h-[3.5cqw] w-[70%] rounded-b-[2cqw] bg-line" aria-hidden="true" />
    </figure>
  );
}
