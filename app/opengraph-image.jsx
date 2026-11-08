import { ImageResponse } from 'next/og';

export const alt = 'Reviewwo Google review QR codes';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// A fixed QR-like pattern for the preview image (decorative, not scannable).
const PATTERN = [
  '1111111010110101111111',
  '1000001011001001000001',
  '1011101001110101011101',
  '1011101010011001011101',
  '1011101011100101011101',
  '1000001001011001000001',
  '1111111010101011111111',
  '0000000011010100000000',
  '1101011100101011010110',
  '0110100111010010101011',
  '1011011010011101100101',
  '0100110101100110011010',
  '1110001011011001110101',
  '0000000010110110100110',
  '1111111001101011011001',
  '1000001010110100110110',
  '1011101011001011010011',
  '1011101000110101101101',
  '1011101011011010010110',
  '1000001001101101101001',
  '1111111010010110110110',
];

/** Default social preview image, used by every page that does not define its own. */
export default function OpengraphImage() {
  const cell = 9;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F2F5F4',
          padding: '72px 90px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 600 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0B3D3B' }}>Reviewwo</div>
          <div style={{ marginTop: 28, fontSize: 70, fontWeight: 800, lineHeight: 1.05, color: '#13201F' }}>
            Scan the code. Leave a review.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: '#4F6260', lineHeight: 1.35 }}>
            Google review QR codes for local businesses in India
          </div>
        </div>
        <div
          style={{
            width: 330,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '2px solid #DCE3E1',
            borderRadius: 20,
            padding: '30px 30px 26px',
            transform: 'rotate(3deg)',
            boxShadow: '0 30px 60px -20px rgba(7,39,38,0.45)',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, color: '#13201F' }}>Your business</div>
          <div style={{ fontSize: 18, color: '#4F6260', marginTop: 4 }}>Enjoyed your visit?</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18, padding: 10, border: '2px solid #DCE3E1', borderRadius: 12 }}>
            {PATTERN.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.split('').map((c, x) => (
                  <div key={x} style={{ width: cell, height: cell, background: c === '1' ? '#0B3D3B' : '#FFFFFF' }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: '#0B3D3B', marginTop: 18 }}>Scan to leave a Google review</div>
        </div>
      </div>
    ),
    size
  );
}
