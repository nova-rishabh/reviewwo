import QRCode from 'qrcode';
import { appUrl } from './store.js';

const QR_COLORS = { dark: '#0B3D3B', light: '#FFFFFF' };

export function cardUrl(shortCode) {
  return `${appUrl()}/r/${shortCode}`;
}

/** Adds QR images for a card. URLs always use the current public app URL. */
export async function withQr(card) {
  const url = cardUrl(card.shortCode);
  if (card.fullUrl === url && card.qrDataUrl && card.qrSvg) return { card, changed: false };
  const [qrDataUrl, qrSvg] = await Promise.all([
    QRCode.toDataURL(url, { width: 600, margin: 1, errorCorrectionLevel: 'M', color: QR_COLORS }),
    QRCode.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: QR_COLORS }),
  ]);
  return { card: { ...card, fullUrl: url, qrUrl: `/r/${card.shortCode}`, qrDataUrl, qrSvg }, changed: true };
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

export function newShortCode(existing) {
  for (let i = 0; i < 50; i++) {
    let code = '';
    for (let j = 0; j < 6; j++) code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    if (!existing.has(code.toLowerCase())) return code;
  }
  throw new Error('Could not generate a unique card code.');
}
